#!/usr/bin/env python3
"""Build a reproducible, explicitly provisional API index from a published MDC AAR."""
import argparse
import json
import re
import subprocess
import tempfile
import zipfile
from pathlib import Path

MODIFIERS = {"public", "protected", "abstract", "final", "static", "strictfp", "sealed", "non-sealed"}
HEADER = re.compile(r"^(?P<mods>(?:(?:public|protected|abstract|final|static|strictfp|sealed|non-sealed)\\s+)*)?(?P<kind>class|interface|enum|record|@interface)\\s+(?P<name>[\\w.$]+)")
MEMBER = re.compile(r"^\\s{2}(?P<signature>(?:(?:public|protected|static|final|abstract|synchronized|native|strictfp|default|transient|volatile)\\s+)*.+?;?)\\s*$")
DECLARATION = re.compile(r"(?m)^\\s*(?:@[\\w.]+(?:\\([^\n]*\\))?\\s*)*(?:(?:public|protected|private|static|final|abstract|synchronized|native|strictfp|default|transient|volatile)\\s+)*(?:[\\w.$<>?,\\[\\] @]+\\s+)?(?P<name>[A-Za-z_$][\\w$]*)\\s*(?:\\(|;|=)")
RESTRICTED = re.compile(r"@RestrictTo\\s*\\(")
DEPRECATED = re.compile(r"@Deprecated|@deprecated\\b")

def source_path_for(binary_name):
    top_level = binary_name.split("$", 1)[0]
    return top_level.replace(".", "/") + ".java"

def source_context(source, simple_name, member_name=None):
    lines = source.splitlines()
    matches = []
    target = member_name or simple_name
    for index, line in enumerate(lines):
        if target not in line:
            continue
        # Only consider likely declarations, not arbitrary references or method calls.
        if member_name and not re.search(r"\\b" + re.escape(member_name) + r"\\s*\\(", line) and not re.search(r"\\b" + re.escape(member_name) + r"\\s*(?:;|=)", line):
            continue
        if not member_name and not re.search(r"\\b(?:class|interface|enum|record)\\s+" + re.escape(simple_name) + r"\\b", line):
            continue
        start = max(0, index - 14)
        context = "\n".join(lines[start:index + 1])
        matches.append(context)
    if not matches:
        return {"restricted": False, "deprecated": False, "matched": False}
    # A nearby annotation is evidence only; it is not a substitute for a full Java parser.
    restricted = any(RESTRICTED.search(item) for item in matches)
    deprecated = any(DEPRECATED.search(item) for item in matches)
    return {"restricted": restricted, "deprecated": deprecated, "matched": True}

def class_header(output):
    for line in output.splitlines():
        match = HEADER.match(line.strip())
        if match:
            mods = set((match.group("mods") or "").split())
            return line.strip(), match.group("name"), mods, match.group("kind")
    return None

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

        with zipfile.ZipFile(args.sources) as sources_zip:
            source_files = {
                name: sources_zip.read(name).decode("utf-8", errors="replace")
                for name in sources_zip.namelist()
                if name.endswith(".java") and not name.startswith("META-INF/")
            }

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
        for binary_name in binary_names:
            result = subprocess.run(
                ["javap", "-protected", "-classpath", str(classes_jar), binary_name],
                capture_output=True, text=True, check=False, timeout=20,
            )
            if result.returncode:
                javap_failures.append({"class": binary_name, "error": result.stderr.strip()[:300]})
                continue
            header = class_header(result.stdout)
            if not header:
                javap_failures.append({"class": binary_name, "error": "No class declaration parsed"})
                continue
            class_signature, parsed_name, modifiers, kind = header
            visible = "public" in modifiers or "protected" in modifiers
            source_path = source_path_for(binary_name)
            source = source_files.get(source_path)
            if not visible:
                internal_types.append({"class": binary_name, "sourcePath": source_path if source else None})
                continue
            if source is None:
                source_missing.append(binary_name)
                source_info = {"restricted": False, "deprecated": False, "matched": False}
            else:
                source_info = source_context(source, binary_name.split("$")[-1], None)
            members = []
            for line in result.stdout.splitlines():
                match = MEMBER.match(line)
                if not match:
                    continue
                signature = match.group("signature").strip()
                if signature in {"{", "}", "static {}"} or signature.startswith("Compiled from"):
                    continue
                if "(" in signature:
                    member_name_match = re.search(r"([A-Za-z_$][\\w$]*)\\s*\\(", signature)
                else:
                    field_signature = signature.split("=", 1)[0].rstrip("; ").strip()
                    member_name_match = re.search(r"([A-Za-z_$][\\w$]*)$", field_signature)
                member_name = member_name_match.group(1) if member_name_match else None
                member_info = source_context(source, binary_name.split("$")[-1], member_name) if source and member_name else {"restricted": False, "deprecated": False, "matched": False}
                if source_info["restricted"] or member_info["restricted"]:
                    classification = "restricted"
                elif source_info["deprecated"] or member_info["deprecated"]:
                    classification = "deprecated"
                elif source is None:
                    classification = "source-unmatched"
                else:
                    classification = "public-api-candidate"
                members.append({
                    "signature": signature,
                    "name": member_name,
                    "classification": classification,
                    "sourceAnnotationContextMatched": member_info["matched"],
                })
            if source_info["restricted"]:
                classification = "restricted"
            elif source_info["deprecated"]:
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
            "method": "published AAR classes.jar inspected with javap -protected; source annotations matched by bounded context heuristic",
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
                "unclassifiedMembers": sum(1 for item in entries for member in item["members"] if member["classification"] == "source-unmatched"),
            },
            "limitations": [
                "This is a binary signature candidate index, not an official Android API dump.",
                "Source annotation classification uses a bounded textual context heuristic and is not a Java/Kotlin AST.",
                "Member-level overloaded signatures are not semantically matched to a unique source declaration.",
                "Public API completeness remains unverified until non-matches, annotations, generated classes and signature semantics are reviewed.",
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
