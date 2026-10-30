#!/usr/bin/env python3
"""Create a deterministic, deliberately non-authoritative source/AAR mapping report."""

from __future__ import annotations

import hashlib
import json
import os
import re
import struct
import sys
import zipfile
from collections import Counter, defaultdict
from pathlib import Path


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def read_class_summary(data: bytes) -> dict:
    if len(data) < 10 or data[:4] != b"\xca\xfe\xba\xbe":
        raise ValueError("Invalid JVM class-file header.")

    offset = 8
    cp_count = struct.unpack_from(">H", data, offset)[0]
    offset += 2
    constant_pool: list[tuple[int, object] | None] = [None] * cp_count
    index = 1

    while index < cp_count:
        if offset >= len(data):
            raise ValueError("Truncated JVM constant pool.")
        tag = data[offset]
        offset += 1
        if tag == 1:
            length = struct.unpack_from(">H", data, offset)[0]
            offset += 2
            value = data[offset : offset + length].decode("utf-8", errors="replace")
            offset += length
            constant_pool[index] = (tag, value)
        elif tag in (3, 4):
            offset += 4
        elif tag in (5, 6):
            offset += 8
            index += 1
        elif tag in (7, 8, 16, 19, 20):
            value = struct.unpack_from(">H", data, offset)[0]
            offset += 2
            constant_pool[index] = (tag, value)
        elif tag in (9, 10, 11, 12, 17, 18):
            offset += 4
        elif tag == 15:
            offset += 3
        else:
            raise ValueError("Unsupported constant-pool tag: " + str(tag))
        if offset > len(data):
            raise ValueError("Truncated JVM constant pool.")
        index += 1

    class_access = struct.unpack_from(">H", data, offset)[0]
    offset += 6  # access_flags, this_class, super_class
    interface_count = struct.unpack_from(">H", data, offset)[0]
    offset += 2 + 2 * interface_count

    counts = {}
    method_signatures = []
    for kind in ("fields", "methods"):
        member_count = struct.unpack_from(">H", data, offset)[0]
        offset += 2
        visible_count = 0
        for _ in range(member_count):
            access = struct.unpack_from(">H", data, offset)[0]
            name_index = struct.unpack_from(">H", data, offset + 2)[0]
            descriptor_index = struct.unpack_from(">H", data, offset + 4)[0]
            offset += 6  # access_flags, name_index, descriptor_index
            if access & 0x0005:  # ACC_PUBLIC | ACC_PROTECTED
                visible_count += 1
            if kind == "methods":
                method_name = constant_pool[name_index]
                method_descriptor = constant_pool[descriptor_index]
                if method_name and method_name[0] == 1 and method_descriptor and method_descriptor[0] == 1:
                    method_signatures.append({
                        "name": method_name[1],
                        "descriptor": method_descriptor[1],
                        "publicProtected": bool(access & 0x0005),
                    })
            attribute_count = struct.unpack_from(">H", data, offset)[0]
            offset += 2
            for _ in range(attribute_count):
                attribute_length = struct.unpack_from(">I", data, offset + 2)[0]
                offset += 6 + attribute_length
                if offset > len(data):
                    raise ValueError("Truncated JVM member attribute.")
        counts[kind] = member_count
        counts[kind + "_public_protected"] = visible_count

    attribute_count = struct.unpack_from(">H", data, offset)[0]
    offset += 2
    source_file = None
    for _ in range(attribute_count):
        name_index = struct.unpack_from(">H", data, offset)[0]
        length = struct.unpack_from(">I", data, offset + 2)[0]
        offset += 6
        name_entry = constant_pool[name_index]
        name = name_entry[1] if name_entry and name_entry[0] == 1 else None
        if name == "SourceFile" and length == 2:
            source_index = struct.unpack_from(">H", data, offset)[0]
            source_entry = constant_pool[source_index]
            if source_entry and source_entry[0] == 1:
                source_file = source_entry[1]
        offset += length
        if offset > len(data):
            raise ValueError("Truncated JVM class attribute.")

    return {
        "classIsPublic": bool(class_access & 0x0001),
        "sourceFile": source_file,
        "methodSignatures": method_signatures,
        **counts,
    }


def parse_api_dump(api_dump: str) -> dict:
    classes = {}
    current_package = None
    current_class = None
    for line in api_dump.splitlines():
        package_match = re.match(r"^package\s+([\w.]+)\s+\{$", line)
        if package_match:
            current_package = package_match.group(1)
            current_class = None
            continue
        class_match = re.match(
            r"^\s*public\b.*?\b(?:class|interface|enum|@interface|record)\s+([A-Za-z0-9_.$]+).*?\{$",
            line,
        )
        if class_match and current_package:
            class_name = class_match.group(1).replace(".", "$")
            current_class = current_package.replace(".", "/") + "/" + class_name
            classes[current_class] = []
            continue
        if current_class and re.match(r"^\s*method\s+", line):
            signature = line.split("method", 1)[1]
            method_match = re.search(r"\s([A-Za-z_$][A-Za-z0-9_$-]*)\s*\(.*\);$", signature)
            if method_match:
                classes[current_class].append({
                    "name": method_match.group(1),
                    "bytecodeOnly": "@BytecodeOnly" in line,
                })
        if line == "  }":
            current_class = None
    return classes


def compare_api_dump_to_binary(api_dump: str, binary_classes: list[tuple[str, dict, bool]]) -> dict:
    api_classes = parse_api_dump(api_dump)
    binary_by_name = {name[:-6]: summary for name, summary, _ in binary_classes}
    missing_classes = []
    missing_methods = []
    matched_methods = 0
    bytecode_only_methods = 0
    bytecode_only_method_names_matched = 0

    for class_name, api_methods in api_classes.items():
        binary = binary_by_name.get(class_name)
        if binary is None:
            missing_classes.append(class_name + ".class")
            for method in api_methods:
                missing_methods.append({"class": class_name, "method": method["name"], "reason": "class-missing"})
            continue
        binary_method_names = {method["name"] for method in binary["methodSignatures"]}
        for method in api_methods:
            if method["bytecodeOnly"]:
                bytecode_only_methods += 1
            if method["name"] in binary_method_names:
                matched_methods += 1
                if method["bytecodeOnly"]:
                    bytecode_only_method_names_matched += 1
            else:
                missing_methods.append({"class": class_name, "method": method["name"], "reason": "method-name-missing"})

    api_method_count = sum(len(methods) for methods in api_classes.values())
    return {
        "apiClassCount": len(api_classes),
        "binaryClassMatches": len(api_classes) - len(missing_classes),
        "missingClasses": missing_classes,
        "apiMethodCount": api_method_count,
        "methodNameMatches": matched_methods,
        "missingMethods": missing_methods,
        "bytecodeOnlyMethodCount": bytecode_only_methods,
        "bytecodeOnlyMethodNameMatches": bytecode_only_method_names_matched,
        "comparisonMode": "class names and method names only; JVM descriptors and Kotlin source-level type semantics are not compared",
        "status": "class-and-method-names-match" if not missing_classes and not missing_methods else "mismatches-found",
    }


def verify_file(directory: Path, report: dict, file_name: str) -> tuple[bytes, dict]:
    artifact = next((item for item in report.get("artifacts", []) if item.get("fileName") == file_name), None)
    if not artifact or artifact.get("status") != "verified":
        raise ValueError("Missing verified artifact report entry: " + file_name)
    data = (directory / file_name).read_bytes()
    sha256 = hashlib.sha256(data).hexdigest()
    blob_sha1 = git_blob_sha1(data)
    if sha256 != artifact.get("publishedSha256") or sha256 != artifact.get("sha256"):
        raise ValueError("SHA-256 mismatch for " + file_name)
    if blob_sha1 != artifact.get("gitBlobSha1") or len(data) != artifact.get("sizeBytes"):
        raise ValueError("Git blob identity or size mismatch for " + file_name)
    return data, artifact


def inspect(directory: Path) -> dict:
    verification = json.loads((directory / "verification.json").read_text(encoding="utf-8"))
    if verification.get("artifact") != "androidx.compose.material3:material3" or verification.get("referenceVersion") != "1.4.0":
        raise ValueError("Unexpected verification report coordinates.")

    source_bytes, source_record = verify_file(directory, verification, "material3-android-1.4.0-sources.jar")
    aar_bytes, aar_record = verify_file(directory, verification, "material3-android-1.4.0.aar")
    common_module_bytes, common_module_record = verify_file(directory, verification, "material3-1.4.0.module")
    android_module_bytes, android_module_record = verify_file(directory, verification, "material3-android-1.4.0.module")

    api_dump_text = api_dump_bytes.decode("utf-8")
    source_sets = Counter()
    source_files_by_package = defaultdict(set)
    with zipfile.ZipFile(__import__("io").BytesIO(source_bytes)) as source_archive:
        for name in source_archive.namelist():
            if not name.endswith(".kt"):
                continue
            parts = name.split("/")
            if len(parts) < 3:
                continue
            source_set = parts[0]
            package_path = "/".join(parts[1:-1])
            source_sets[source_set] += 1
            source_files_by_package[package_path].add(parts[-1])

    with zipfile.ZipFile(__import__("io").BytesIO(aar_bytes)) as aar:
        if "classes.jar" not in aar.namelist():
            raise ValueError("Android AAR does not contain classes.jar.")
        classes_bytes = aar.read("classes.jar")

    binary_classes = []
    with zipfile.ZipFile(__import__("io").BytesIO(classes_bytes)) as classes:
        for name in classes.namelist():
            if not name.endswith(".class"):
                continue
            summary = read_class_summary(classes.read(name))
            package_path = "/".join(name.split("/")[:-1])
            matched = summary["sourceFile"] in source_files_by_package.get(package_path, set())
            binary_classes.append((name, summary, matched))

    matched_classes = [item for item in binary_classes if item[2]]
    api_binary_comparison = compare_api_dump_to_binary(api_dump_text, binary_classes)
    unmatched_classes = [
        {"classFile": name, "sourceFile": summary["sourceFile"]}
        for name, summary, matched in binary_classes
        if not matched
    ]

    api_dump_path = Path(__file__).resolve().parents[2] / "docs/material3/catalog/baselines/material3-1.4.0-api.txt"
    api_dump_bytes = api_dump_path.read_bytes()
    api_dump_blob_sha1 = git_blob_sha1(api_dump_bytes)
    expected_api_dump_blob_sha1 = "fd45e9feea96a631c0f8b7ac82f88ee9ce999029"
    if api_dump_blob_sha1 != expected_api_dump_blob_sha1:
        raise ValueError("Pinned AndroidX stable API dump Git blob identity mismatch.")

    source_commit_path = directory / "material3-android-1.4.0-source-commit-verification.json"
    source_commit_report = json.loads(source_commit_path.read_text(encoding="utf-8"))
    if (
        source_commit_report.get("result") != "passed"
        or source_commit_report.get("repository") != "androidx/androidx"
        or source_commit_report.get("commit") != "5113b82a4ed6416d6344efa50e41db8cb65928ff"
        or source_commit_report.get("totalKotlinSourceFiles") != 249
        or source_commit_report.get("verifiedByteForByte") != 249
        or source_commit_report.get("mismatchCount") != 0
    ):
        raise ValueError("Published Material 3 sources do not match the pinned AndroidX release commit.")

    common_module = json.loads(common_module_bytes)
    android_module = json.loads(android_module_bytes)
    component = common_module.get("component", {})
    android_component = android_module.get("component", {})
    if (component.get("group"), component.get("module"), component.get("version")) != (
        "androidx.compose.material3", "material3", "1.4.0"
    ):
        raise ValueError("Common Gradle module metadata has unexpected coordinates.")
    android_variant = next(
        (variant for variant in common_module.get("variants", []) if variant.get("name") == "androidApiElements-published"),
        None,
    )
    if not android_variant or android_variant.get("available-at", {}).get("module") != "material3-android":
        raise ValueError("Common Gradle metadata does not expose the expected Android variant.")
    if (android_component.get("group"), android_component.get("module"), android_component.get("version")) != (
        "androidx.compose.material3", "material3", "1.4.0"
    ):
        raise ValueError("Android Gradle metadata does not redirect to the common module.")
    if android_component.get("url") != "../../material3/1.4.0/material3-1.4.0.module":
        raise ValueError("Unexpected Android Gradle metadata redirection.")

    return {
        "schemaVersion": 1,
        "artifact": "androidx.compose.material3:material3-android",
        "referenceVersion": "1.4.0",
        "verificationWorkflow": verification.get("source"),
        "sourceArchive": {
            "fileName": source_record["fileName"],
            "sha256": source_record["sha256"],
            "gitBlobSha1": source_record["gitBlobSha1"],
            "sizeBytes": source_record["sizeBytes"],
            "kotlinSourceFiles": sum(source_sets.values()),
            "sourceFilesBySet": dict(sorted(source_sets.items())),
        },
        "androidAar": {
            "fileName": aar_record["fileName"],
            "sha256": aar_record["sha256"],
            "gitBlobSha1": aar_record["gitBlobSha1"],
            "sizeBytes": aar_record["sizeBytes"],
            "classFiles": len(binary_classes),
            "publicJvmClasses": sum(1 for _, summary, _ in binary_classes if summary["classIsPublic"]),
            "publicProtectedJvmFields": sum(summary["fields_public_protected"] for _, summary, _ in binary_classes),
            "publicProtectedJvmMethods": sum(summary["methods_public_protected"] for _, summary, _ in binary_classes),
            "classFilesMappedToPublishedSourceFile": len(matched_classes),
            "classFilesWithoutSourceFileMatch": unmatched_classes,
        },
        "apiDumpBinaryComparison": api_binary_comparison,
        "sourceRepositoryCommit": {
            "repository": source_commit_report["repository"],
            "branch": source_commit_report["branch"],
            "commit": source_commit_report["commit"],
            "totalKotlinSourceFiles": source_commit_report["totalKotlinSourceFiles"],
            "verifiedByteForByte": source_commit_report["verifiedByteForByte"],
            "mismatchCount": source_commit_report["mismatchCount"],
            "result": source_commit_report["result"],
            "workflowRun": "https://github.com/Nabouna32/lab/actions/runs/40984365256",
        },
        "officialApiDump": {
            "repository": "androidx/androidx",
            "branch": "androidx-compose-material3-release",
            "commit": "5113b82a4ed6416d6344efa50e41db8cb65928ff",
            "path": "compose/material3/material3/api/current.txt",
            "gitBlobSha1": api_dump_blob_sha1,
            "sizeBytes": len(api_dump_bytes),
            "signatureFormat": "4.0",
            "libraryVersionMarker": 'COMPOSE_MATERIAL3 = "1.4.0"',
        },
        "gradleModuleMetadata": {
            "common": {
                "fileName": common_module_record["fileName"],
                "sha256": common_module_record["sha256"],
                "component": component,
                "variantCount": len(common_module.get("variants", [])),
                "androidVariantAvailableAt": android_variant.get("available-at"),
            },
            "android": {
                "fileName": android_module_record["fileName"],
                "sha256": android_module_record["sha256"],
                "component": android_component,
            },
        },
        "interpretation": {
            "binarySurface": "Raw JVM public/protected bytecode members; this includes Kotlin-internal and compiler-generated declarations and is not a Kotlin public API dump.",
            "sourceMapping": "Class-file SourceFile attributes mapped to source-archive package paths; file-level mapping does not prove declaration-level API equivalence.",
            "apiDumpAlignment": "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_VERIFIED_BINARY_API_COMPARISON_PENDING",
            "limitations": [
                "The official stable 1.4.0 API snapshot is pinned from the AndroidX release branch, and all 249 published Kotlin sources match that release commit byte-for-byte (CI run 40984365256); declaration-level comparison against the published AAR remains pending.",
                "The derived JVM surface is not an official AndroidX API dump and must not be used as a Kotlin API compatibility claim.",
                "Source-file mapping does not prove that every public binary declaration has an equivalent public Kotlin source declaration.",
            ],
        },
    }


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: inspect-material3-android-aar.py <artifact-directory> <output-json>", file=sys.stderr)
        return 2
    directory = Path(sys.argv[1])
    output = Path(sys.argv[2])
    result = inspect(directory)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
