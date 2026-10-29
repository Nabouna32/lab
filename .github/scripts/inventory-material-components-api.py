#!/usr/bin/env python3
"""Build a reproducible, explicitly provisional API index from a published MDC AAR."""
import argparse
import json
import re
import subprocess
import tempfile
import zipfile
from pathlib import Path

HEADER = re.compile(r"^(?P<mods>(?:(?:public|protected|abstract|final|static|strictfp|sealed|non-sealed)\s+)*)?(?P<kind>class|interface|enum|record|@interface)\s+(?P<name>[\w.$]+)")
MEMBER = re.compile(r"^\s{2}(?P<signature>(?:(?:public|protected|static|final|abstract|synchronized|native|strictfp|default|transient|volatile)\s+)*.+?;?)\s*$")
RESTRICTED = re.compile(r"@RestrictTo\s*\(")
DEPRECATED = re.compile(r"@Deprecated|@deprecated\b")

def source_path_for(binary_name):
    top_level = binary_name.split("$", 1)[0]
    return top_level.replace(".", "/") + ".java"

def decode_source_index(output):
    import base64
    types = {}
    members = {}
    for line in output.splitlines():
        fields = line.split("|")
        if len(fields) != 9:
            raise ValueError("Java source indexer emitted a malformed record.")
        kind, owner_b64, name_b64, arity, member_kind, restricted, deprecated, doc_deprecated, parameter_types_b64 = fields
        owner = base64.b64decode(owner_b64).decode("utf-8")
        name = base64.b64decode(name_b64).decode("utf-8")
        parameter_types = base64.b64decode(parameter_types_b64).decode("utf-8")
        record = {
            "restricted": restricted == "true",
            "deprecated": deprecated == "true",
            "docDeprecated": doc_deprecated == "true",
        }
        if kind == "T":
            types[owner] = record
        elif kind == "M":
            record["parameterTypes"] = parameter_types.split(";") if parameter_types else []
            members.setdefault((owner, name, member_kind), []).append(record)
        else:
            raise ValueError("Java source indexer emitted an unknown record kind.")
    return types, members


def split_signature_parameters(signature):
    opening = signature.find("(")
    if opening < 0:
        return None
    depth = 0
    closing = -1
    for index in range(opening, len(signature)):
        if signature[index] == "(":
            depth += 1
        elif signature[index] == ")":
            depth -= 1
            if depth == 0:
                closing = index
                break
    if closing < 0:
        return None
    params = signature[opening + 1:closing].strip()
    if not params:
        return []
    values = []
    start = 0
    generic_depth = 0
    for index, char in enumerate(params):
        if char == "<":
            generic_depth += 1
        elif char == ">":
            generic_depth = max(0, generic_depth - 1)
        elif char == "," and generic_depth == 0:
            values.append(params[start:index].strip())
            start = index + 1
    values.append(params[start:].strip())
    return values


def normalize_parameter_type(value):
    value = re.sub(r"@[A-Za-z0-9_.$]+(?:\([^)]*\))?\s*", "", value)
    value = value.replace("...", "[]")
    erased = []
    depth = 0
    for char in value:
        if char == "<":
            depth += 1
        elif char == ">":
            depth = max(0, depth - 1)
        elif depth == 0 and not char.isspace():
            erased.append(char)
    value = "".join(erased).replace("$", ".")
    dimensions = ""
    while value.endswith("[]"):
        dimensions += "[]"
        value = value[:-2]
    if "." in value:
        value = value.rsplit(".", 1)[-1]
    return value + dimensions


def source_member_info(index, owner, name, binary_parameter_types, member_kind):
    candidates = index.get((owner, name, member_kind), [])
    if member_kind == "field":
        matches = candidates
    else:
        binary_types = [normalize_parameter_type(value) for value in binary_parameter_types]
        matches = [
            item for item in candidates
            if [normalize_parameter_type(value) for value in item["parameterTypes"]] == binary_types
        ]
    if not matches:
        return {"restricted": False, "deprecated": False, "matched": False, "ambiguous": False}
    ambiguous = len(matches) > 1
    return {
        "restricted": not ambiguous and matches[0]["restricted"],
        "deprecated": not ambiguous and (matches[0]["deprecated"] or matches[0]["docDeprecated"]),
        "matched": not ambiguous,
        "ambiguous": ambiguous,
    }


def signature_parameter_types(signature):
    return split_signature_parameters(signature)


def signature_parameter_count(signature):
    params = split_signature_parameters(signature)
    return None if params is None else len(params)

def class_sections(output):
    sections = []
    current = None
    for line in output.splitlines():
        match = HEADER.match(line.strip())
        if match:
            if current is not None:
                sections.append(current)
            current = {
                "signature": line.strip(),
                "name": match.group("name"),
                "modifiers": set((match.group("mods") or "").split()),
                "kind": match.group("kind"),
                "members": [],
            }
            continue
        if current is None:
            continue
        if line.strip() == "}":
            sections.append(current)
            current = None
            continue
        if MEMBER.match(line):
            current["members"].append(line)
    if current is not None:
        sections.append(current)
    return sections

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--aar", required=True, type=Path)
    parser.add_argument("--sources", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--reference-version", required=True)
    parser.add_argument("--aar-sha256", required=True)
    parser.add_argument("--sources-sha256", required=True)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="mdc-api-index-") as temp:
        temp_path = Path(temp)
        classes_jar = temp_path / "classes.jar"
        with zipfile.ZipFile(args.aar) as aar:
            if "classes.jar" not in aar.namelist():
                raise SystemExit("Published AAR does not contain classes.jar.")
            classes_jar.write_bytes(aar.read("classes.jar"))

        source_root = temp_path / "sources"
        source_root.mkdir()
        with zipfile.ZipFile(args.sources) as sources_zip:
            source_files = {}
            for name in sources_zip.namelist():
                if not name.endswith(".java") or name.startswith("META-INF/"):
                    continue
                destination = (source_root / name).resolve()
                if not destination.is_relative_to(source_root.resolve()):
                    raise SystemExit("Source archive contains an unsafe path.")
                destination.parent.mkdir(parents=True, exist_ok=True)
                contents = sources_zip.read(name)
                destination.write_bytes(contents)
                source_files[name] = contents.decode("utf-8", errors="replace")

        indexer_source = Path(__file__).with_name("SourceAnnotationIndex.java")
        compile_indexer = subprocess.run(
            ["javac", "-d", str(temp_path), str(indexer_source)],
            capture_output=True, text=True, check=False, timeout=120,
        )
        if compile_indexer.returncode:
            raise SystemExit("Could not compile the Java AST indexer: " + compile_indexer.stderr.strip()[:1000])
        index_result = subprocess.run(
            ["java", "-cp", str(temp_path), "SourceAnnotationIndex", str(source_root)],
            capture_output=True, text=True, check=False, timeout=120,
        )
        if index_result.returncode:
            raise SystemExit("Could not parse MDC Java sources: " + index_result.stderr.strip()[:1500])
        source_types, source_members = decode_source_index(index_result.stdout)

        with zipfile.ZipFile(classes_jar) as class_zip:
            binary_names = sorted(
                name[:-6].replace("/", ".")
                for name in class_zip.namelist()
                if name.endswith(".class")
                and not name.endswith("module-info.class")
                and not name.endswith("package-info.class")
            )

        entries = []
        internal_types = []
        source_missing = []
        javap_failures = []
        parsed_sections = {}
        batch_size = 40
        for offset in range(0, len(binary_names), batch_size):
            batch = binary_names[offset:offset + batch_size]
            result = subprocess.run(
                ["javap", "-protected", "-classpath", str(classes_jar), *batch],
                capture_output=True, text=True, check=False, timeout=120,
            )
            if result.returncode:
                javap_failures.extend(
                    {"class": name, "error": result.stderr.strip()[:300] or "javap batch failed"}
                    for name in batch
                )
                continue
            for section in class_sections(result.stdout):
                parsed_sections[section["name"]] = section

        for binary_name in binary_names:
            section = parsed_sections.get(binary_name)
            if section is None:
                if not any(item["class"] == binary_name for item in javap_failures):
                    javap_failures.append({"class": binary_name, "error": "No class declaration parsed"})
                continue
            class_signature = section["signature"]
            modifiers = section["modifiers"]
            kind = section["kind"]
            visible = "public" in modifiers or "protected" in modifiers
            source_path = source_path_for(binary_name)
            source = source_files.get(source_path)
            if not visible:
                internal_types.append({"class": binary_name, "sourcePath": source_path if source else None})
                continue
            source_info = source_types.get(binary_name, {
                "restricted": False, "deprecated": False, "docDeprecated": False,
            })
            source_info = {**source_info, "matched": binary_name in source_types}
            if source is None:
                source_missing.append(binary_name)
            members = []
            for line in section["members"]:
                match = MEMBER.match(line)
                if not match:
                    continue
                signature = match.group("signature").strip()
                if signature in {"{", "}", "static {}"} or signature.startswith("Compiled from"):
                    continue
                if "(" in signature:
                    member_name_match = re.search(r"([A-Za-z_$][\w$]*)\s*\(", signature)
                    member_name = member_name_match.group(1) if member_name_match else None
                    parameter_types = signature_parameter_types(signature)
                    arity = None if parameter_types is None else len(parameter_types)
                    member_kind = "method"
                    simple_binary_name = binary_name.rsplit(".", 1)[-1]
                    if member_name == simple_binary_name or member_name == simple_binary_name.rsplit("$", 1)[-1]:
                        member_name = "<init>"
                else:
                    field_signature = signature.split("=", 1)[0].rstrip("; ").strip()
                    member_name_match = re.search(r"([A-Za-z_$][\w$]*)$", field_signature)
                    member_name = member_name_match.group(1) if member_name_match else None
                    arity = 0
                    parameter_types = []
                    member_kind = "field"
                member_info = source_member_info(source_members, binary_name, member_name, parameter_types or [], member_kind) if source and member_name else {"restricted": False, "deprecated": False, "matched": False, "ambiguous": False}
                if source_info["restricted"]:
                    classification = "restricted"
                elif source_info["deprecated"] or source_info.get("docDeprecated", False):
                    classification = "deprecated"
                elif member_info["ambiguous"]:
                    classification = "source-ambiguous"
                elif member_info["restricted"]:
                    classification = "restricted"
                elif member_info["deprecated"]:
                    classification = "deprecated"
                elif source is None or not member_info["matched"]:
                    classification = "source-unmatched"
                else:
                    classification = "public-api-candidate"
                members.append({
                    "signature": signature,
                    "name": member_name,
                    "classification": classification,
                    "sourceDeclarationMatched": member_info["matched"],
                    "sourceAnnotationContextMatched": member_info["matched"],
                    "sourceDeclarationAmbiguous": member_info["ambiguous"],
                    "parameterCount": arity,
                    "binaryParameterTypes": parameter_types or [],
                })
            if source_info["restricted"]:
                classification = "restricted"
            elif source_info["deprecated"] or source_info.get("docDeprecated", False):
                classification = "deprecated"
            elif source is None:
                classification = "source-unmatched"
            else:
                classification = "public-api-candidate"
            entries.append({
                "binaryName": binary_name,
                "kind": kind,
                "visibility": "public" if "public" in modifiers else "protected",
                "signature": class_signature,
                "classification": classification,
                "sourcePath": source_path if source else None,
                "sourceDeclarationContextMatched": source_info["matched"],
                "members": members,
            })

        known_sources = set(source_files)
        referenced_sources = {source_path_for(name) for name in binary_names}
        source_files_without_binary = sorted(known_sources - referenced_sources)
        report = {
            "schemaVersion": 1,
            "artifact": "com.google.android.material:material",
            "referenceVersion": args.reference_version,
            "method": "published AAR classes.jar inspected with javap -protected; Java source declarations and annotations indexed with the JDK compiler AST; methods matched by name and normalized erased parameter types",
            "status": "provisional-not-exhaustive",
            "provenance": {
                "aarSha256": args.aar_sha256,
                "sourcesSha256": args.sources_sha256,
                "binarySignatureTool": "javap -protected",
            },
            "summary": {
                "binaryClassFiles": len(binary_names),
                "publicOrProtectedTypes": len(entries),
                "internalOrNonPublicTypes": len(internal_types),
                "sourceMatchedPublicTypes": sum(1 for item in entries if item["sourcePath"]),
                "publicTypesWithoutSource": len(source_missing),
                "sourceFilesWithoutBinaryTopLevelClass": len(source_files_without_binary),
                "javapFailures": len(javap_failures),
                "publicOrProtectedMembers": sum(len(item["members"]) for item in entries),
                "restrictedTypes": sum(1 for item in entries if item["classification"] == "restricted"),
                "deprecatedTypes": sum(1 for item in entries if item["classification"] == "deprecated"),
                "sourceUnmatchedMembers": sum(1 for item in entries for member in item["members"] if member["classification"] == "source-unmatched"),
                "membersWithSourceDeclarationMatch": sum(1 for item in entries for member in item["members"] if member["sourceDeclarationMatched"]),
                "membersWithoutSourceDeclarationMatch": sum(1 for item in entries for member in item["members"] if not member["sourceDeclarationMatched"]),
                "ambiguousSourceMemberMatches": sum(1 for item in entries for member in item["members"] if member["sourceDeclarationAmbiguous"]),
            },
            "limitations": [
                "This is a binary signature candidate index, not an official Android API dump.",
                "Java source declarations and annotations are indexed with the JDK compiler AST; binary method matching uses name and parameter count, so overloads with the same arity may remain ambiguous.",
                "Generic type variables, compiler-generated bridge methods, synthetic constructor parameters, and inherited binary members may not have a source declaration match; these cases remain explicitly unmatched rather than inferred.",
                "Public API completeness remains unverified until non-matches, ambiguous overloads, generated members and signature semantics are reviewed.",
            ],
            "types": entries,
            "internalTypes": internal_types,
            "sourceFilesWithoutBinaryTopLevelClass": source_files_without_binary,
            "sourceMissingTypes": source_missing,
            "javapFailures": javap_failures,
        }
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(json.dumps(report["summary"], sort_keys=True))

if __name__ == "__main__":
    main()
