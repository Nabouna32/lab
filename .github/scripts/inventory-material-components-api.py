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
    return value + dimensions


def type_parameter_bounds(signature, method=False):
    declaration = HEADER.match(signature) if not method else None
    if method:
        modifier_pattern = r"^\s*(?:(?:public|protected|static|final|abstract|synchronized|native|strictfp|default)\s+)*"
        match = re.match(modifier_pattern + r"(<)", signature)
        if not match:
            return {}
        opening = match.start(1)
        remainder = signature[opening:]
    else:
        if not declaration:
            return {}
        remainder = signature[declaration.end():].lstrip()
        if not remainder.startswith("<"):
            return {}
    depth = 0
    closing = -1
    for index, char in enumerate(remainder):
        if char == "<":
            depth += 1
        elif char == ">":
            depth -= 1
            if depth == 0:
                closing = index
                break
    if closing < 0:
        return {}
    bounds = {}
    for parameter in split_top_level_types(remainder[1:closing]):
        name, separator, bound = parameter.partition(" extends ")
        name = name.strip().split()[-1]
        if not name:
            continue
        first_bound = bound.split(" & ", 1)[0].strip() if separator else "java.lang.Object"
        bounds[name] = normalize_parameter_type(erase_generic_type(first_bound))
    return bounds


def erase_binary_parameter_types(parameter_types, class_signature, member_signature, inherited_class_signatures=()):
    variables = type_parameter_bounds(class_signature)
    for inherited_signature in inherited_class_signatures:
        for name, bound in type_parameter_bounds(inherited_signature).items():
            variables.setdefault(name, bound)
    variables.update(type_parameter_bounds(member_signature, method=True))
    erased = []
    for parameter_type in parameter_types:
        value = normalize_parameter_type(parameter_type)
        dimensions = ""
        while value.endswith("[]"):
            dimensions += "[]"
            value = value[:-2]
        seen = set()
        while value in variables and value not in seen:
            seen.add(value)
            bound = variables[value]
            value = normalize_parameter_type(bound)
            while value.endswith("[]"):
                dimensions += "[]"
                value = value[:-2]
        erased.append(value + dimensions)
    return erased


def source_member_info(index, owner, name, binary_parameter_types, member_kind, inherited_owners=()):
    owners = [owner, *inherited_owners]
    binary_types = [normalize_parameter_type(value) for value in binary_parameter_types]

    for declaration_owner in owners:
        candidates = index.get((declaration_owner, name, member_kind), [])
        if member_kind == "field":
            matches = candidates
        else:
            def compatible(source_types):
                normalized = [normalize_parameter_type(value) for value in source_types]
                return normalized == binary_types
            matches = [item for item in candidates if compatible(item["parameterTypes"])]
        if not matches:
            continue
        ambiguous = len(matches) > 1
        return {
            "restricted": not ambiguous and matches[0]["restricted"],
            "deprecated": not ambiguous and (matches[0]["deprecated"] or matches[0]["docDeprecated"]),
            "matched": not ambiguous,
            "ambiguous": ambiguous,
            "sourceOwner": declaration_owner,
            "inherited": declaration_owner != owner,
        }

    return {
        "restricted": False, "deprecated": False, "matched": False, "ambiguous": False,
        "sourceOwner": None, "inherited": False,
    }


def split_top_level_types(value):
    values = []
    start = 0
    depth = 0
    for index, char in enumerate(value):
        if char == "<":
            depth += 1
        elif char == ">":
            depth = max(0, depth - 1)
        elif char == "," and depth == 0:
            values.append(value[start:index].strip())
            start = index + 1
    if value[start:].strip():
        values.append(value[start:].strip())
    return values


def erase_generic_type(value):
    erased = []
    depth = 0
    for char in value:
        if char == "<":
            depth += 1
        elif char == ">":
            depth = max(0, depth - 1)
        elif depth == 0 and not char.isspace():
            erased.append(char)
    return "".join(erased).replace("$", "$")


def class_supertypes(signature):
    header = signature.split("{", 1)[0].strip()
    declaration = HEADER.match(header)
    if not declaration:
        return []
    remainder = header[declaration.end():].strip()
    if remainder.startswith("<"):
        depth = 0
        for index, char in enumerate(remainder):
            if char == "<":
                depth += 1
            elif char == ">":
                depth -= 1
                if depth == 0:
                    remainder = remainder[index + 1:].strip()
                    break

    supertypes = []
    extends = re.search(r"\bextends\s+(.+?)(?=\s+implements\s+|$)", remainder)
    implements = re.search(r"\bimplements\s+(.+)$", remainder)
    for match in (extends, implements):
        if not match:
            continue
        for candidate in split_top_level_types(match.group(1)):
            raw_name = erase_generic_type(candidate)
            if raw_name:
                supertypes.append(raw_name)
    return supertypes


def inherited_source_owners(owner, parsed_sections, source_types):
    section = parsed_sections.get(owner)
    if section is None:
        return []
    pending = list(reversed(class_supertypes(section["signature"])))
    visited = set()
    owners = []
    while pending:
        parent = pending.pop()
        if parent in visited:
            continue
        visited.add(parent)
        if parent in source_types:
            owners.append(parent)
        parent_section = parsed_sections.get(parent)
        if parent_section is not None:
            pending.extend(reversed(class_supertypes(parent_section["signature"])))
    return owners


def source_owners_for_member(owner, member_name, parsed_sections, source_types):
    if member_name == "<init>":
        return []
    return inherited_source_owners(owner, parsed_sections, source_types)


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
            class_type_variables = type_parameter_bounds(class_signature)
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
                inherited_owners = source_owners_for_member(
                    binary_name, member_name, parsed_sections, source_types
                ) if member_name else []
                inherited_signatures = [
                    parsed_sections[inherited_owner]["signature"]
                    for inherited_owner in inherited_owners if inherited_owner in parsed_sections
                ]
                erased_parameter_types = erase_binary_parameter_types(
                    parameter_types or [], class_signature, signature, inherited_signatures
                ) if member_kind == "method" else []
                member_info = source_member_info(
                    source_members, binary_name, member_name, erased_parameter_types, member_kind,
                    inherited_owners,
                ) if member_name else {"restricted": False, "deprecated": False, "matched": False, "ambiguous": False, "sourceOwner": None, "inherited": False}
                declaration_type_info = source_types.get(member_info.get("sourceOwner"), {})
                member_restricted = member_info["restricted"] or declaration_type_info.get("restricted", False)
                member_deprecated = member_info["deprecated"] or declaration_type_info.get("deprecated", False) or declaration_type_info.get("docDeprecated", False)
                if source_info["restricted"]:
                    classification = "restricted"
                elif source_info["deprecated"] or source_info.get("docDeprecated", False):
                    classification = "deprecated"
                elif member_info["ambiguous"]:
                    classification = "source-ambiguous"
                elif member_restricted:
                    classification = "restricted"
                elif member_deprecated:
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
                    "sourceDeclarationOwner": member_info.get("sourceOwner"),
                    "sourceDeclarationInherited": member_info.get("inherited", False),
                    "parameterCount": arity,
                    "binaryParameterTypes": parameter_types or [],
                    "erasedBinaryParameterTypes": erased_parameter_types,
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
            "method": "published AAR classes.jar inspected with javap -protected; Java source declarations and annotations indexed with the JDK compiler AST; methods matched by normalized erased parameter types, resolved type-variable bounds, and nearest source hierarchy declaration",
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
                "inheritedSourceDeclarationMatches": sum(1 for item in entries for member in item["members"] if member.get("sourceDeclarationInherited", False)),
                "membersWithoutSourceDeclarationMatch": sum(1 for item in entries for member in item["members"] if not member["sourceDeclarationMatched"]),
                "ambiguousSourceMemberMatches": sum(1 for item in entries for member in item["members"] if member["sourceDeclarationAmbiguous"]),
            },
            "limitations": [
                "This is a binary signature candidate index, not an official Android API dump.",
                "Java source declarations and annotations are indexed with the JDK compiler AST; method matching compares parameter types after generic erasure and resolves explicit imports, nested and package-local source types, and unambiguous wildcard imports. Unresolved simple names are left unmatched rather than guessed across packages.",
                "Compiler-generated bridge methods, implicit or synthetic constructors, enum-generated methods, and inherited members whose declarations belong to dependencies outside the published source archive may not have a source declaration match; these cases remain explicitly unmatched rather than inferred. Type-variable parameters are compared using their declared erasure bounds when those bounds are available in the binary signature and source declaration. Inherited declarations found in the published source archive are attributed to their nearest source owner.",
                "Public API completeness remains unverified until the remaining unmatched members, generated members and signature semantics are reviewed.",
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
