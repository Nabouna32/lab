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
    field_signatures = []
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
            member_name = constant_pool[name_index]
            member_descriptor = constant_pool[descriptor_index]
            if member_name and member_name[0] == 1 and member_descriptor and member_descriptor[0] == 1:
                record = {
                    "name": member_name[1],
                    "descriptor": member_descriptor[1],
                    "publicProtected": bool(access & 0x0005),
                }
                if kind == "methods":
                    method_signatures.append(record)
                else:
                    field_signatures.append(record)
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
        "fieldSignatures": field_signatures,
        **counts,
    }


def _strip_api_annotations(value: str) -> str:
    return re.sub(r"@[A-Za-z0-9_.$]+(?:\([^)]*\))?\s*", "", value).strip()


def _strip_api_modifiers(value: str) -> str:
    value = value.strip()
    modifiers = {
        "public", "protected", "private", "static", "final", "abstract",
        "synchronized", "native", "default", "transient", "volatile", "suspend",
    }
    while value:
        token, separator, remainder = value.partition(" ")
        if token not in modifiers or not separator:
            break
        value = remainder.strip()
    return value


def _api_parameter_type(parameter: str) -> str:
    value = _strip_api_annotations(parameter.strip())
    if value.startswith("optional "):
        value = value[len("optional "):].strip()
    # Metalava signatures include source parameter names after the type.
    match = re.match(r"^(.*\S)\s+[A-Za-z_$][A-Za-z0-9_$]*$", value)
    return match.group(1).strip() if match else value


def _callable_parts(line: str, kind: str) -> tuple[str, str, list[str]] | None:
    body = line.split(kind, 1)[1].strip()
    closing = body.rfind(")")
    if closing < 0:
        return None
    depth = 0
    opening = -1
    for index in range(closing, -1, -1):
        if body[index] == ")":
            depth += 1
        elif body[index] == "(":
            depth -= 1
            if depth == 0:
                opening = index
                break
    if opening < 0:
        return None
    prefix = _strip_api_modifiers(_strip_api_annotations(body[:opening]))
    name_match = re.search(r"([A-Za-z_$][A-Za-z0-9_$-]*)$", prefix)
    if not name_match:
        return None
    name = name_match.group(1)
    if kind == "ctor":
        return name, "void", [_api_parameter_type(p) for p in split_api_parameter_types(body[opening + 1:closing])]
    return_type = prefix[:name_match.start()].strip()
    # Remove a method-level generic declaration. Unbounded type variables erase to Object.
    if return_type.startswith("<"):
        depth = 0
        generic_end = -1
        for index, character in enumerate(return_type):
            if character == "<":
                depth += 1
            elif character == ">":
                depth -= 1
                if depth == 0:
                    generic_end = index
                    break
        if generic_end >= 0:
            return_type = return_type[generic_end + 1:].strip()
    if not return_type:
        return None
    return name, return_type, [_api_parameter_type(p) for p in split_api_parameter_types(body[opening + 1:closing])]


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
            r"^\s*(?:@[A-Za-z0-9_.$]+(?:\([^)]*\))?\s+)*public\b.*?\b(?:class|interface|enum|@interface|record)\s+([A-Za-z0-9_.$]+).*?\{$",
            line,
        )
        if class_match and current_package:
            class_name = class_match.group(1).replace(".", "$")
            current_class = current_package.replace(".", "/") + "/" + class_name
            classes[current_class] = {
                "methods": [], "constructors": [], "fields": [], "properties": [], "unparsed": [],
            }
            continue
        if current_class:
            member_match = re.match(r"^\s*(method|ctor|field|property)\s+.*;$", line)
            if member_match:
                kind = member_match.group(1)
                signature = line.strip()
                if kind in {"method", "ctor"}:
                    parsed = _callable_parts(signature, kind)
                    if parsed:
                        name, return_type, parameters = parsed
                        classes[current_class]["methods" if kind == "method" else "constructors"].append({
                            "name": name,
                            "returnType": return_type,
                            "parameterTypes": parameters,
                            "bytecodeOnly": "@BytecodeOnly" in signature,
                            "kotlinOnly": "@KotlinOnly" in signature,
                            "composable": "@androidx.compose.runtime.Composable" in signature or "@Composable" in signature,
                            "static": bool(re.search(r"\\bstatic\\b", signature)),
                            "signature": signature,
                        })
                    else:
                        classes[current_class]["unparsed"].append({
                            "kind": kind, "signature": signature, "reason": "unrecognized-api-signature",
                        })
                else:
                    body = _strip_api_modifiers(_strip_api_annotations(signature.split(kind, 1)[1].strip().rstrip(";")))
                    field_match = re.match(r"^(.*\S)\s+([A-Za-z_$][A-Za-z0-9_$]*)$", body)
                    if field_match:
                        classes[current_class]["fields" if kind == "field" else "properties"].append({
                            "name": field_match.group(2),
                            "type": field_match.group(1).strip(),
                            "signature": signature,
                        })
                    else:
                        classes[current_class]["unparsed"].append({
                            "kind": kind, "signature": signature, "reason": "unrecognized-api-signature",
                        })
        if line == "  }":
            current_class = None
    return classes

def split_api_parameter_types(parameters: str) -> list[str]:
    values = []
    depth = 0
    start = 0
    for index, character in enumerate(parameters):
        if character == "<":
            depth += 1
        elif character == ">":
            depth -= 1
        elif character == "," and depth == 0:
            values.append(parameters[start:index].strip())
            start = index + 1
    tail = parameters[start:].strip()
    if tail:
        values.append(tail)
    return values


def api_type_to_jvm_descriptor(type_name: str, is_return: bool = False) -> str | None:
    value = re.sub(r"@[A-Za-z0-9_.]+(?:\([^)]*\))?", "", type_name).strip()
    value = re.sub(r"^(?:\? super|\? extends|in|out)\s+", "", value)
    nullable = value.endswith("?")
    value = value.rstrip("?!").strip()
    value = re.sub(r"\s+", "", value)
    if not value:
        return None

    if value.endswith("[]"):
        inner = api_type_to_jvm_descriptor(value[:-2])
        return "[" + inner if inner else None

    generic_index = value.find("<")
    if generic_index >= 0:
        value = value[:generic_index]

    primitive = {
        "void": "V", "boolean": "Z", "byte": "B", "char": "C",
        "short": "S", "int": "I", "long": "J", "float": "F", "double": "D",
        "kotlin.Boolean": "Z", "kotlin.Byte": "B", "kotlin.Char": "C",
        "kotlin.Short": "S", "kotlin.Int": "I", "kotlin.Long": "J",
        "kotlin.Float": "F", "kotlin.Double": "D",
        "Boolean": "Z", "Byte": "B", "Char": "C", "Short": "S",
        "Int": "I", "Long": "J", "Float": "F", "Double": "D",
    }
    if value in primitive:
        if nullable and primitive[value] != "V":
            wrappers = {
                "Z": "java/lang/Boolean", "B": "java/lang/Byte",
                "C": "java/lang/Character", "S": "java/lang/Short",
                "I": "java/lang/Integer", "J": "java/lang/Long",
                "F": "java/lang/Float", "D": "java/lang/Double",
            }
            return "L" + wrappers[primitive[value]] + ";"
        return primitive[value]

    value_classes = {
        "androidx.compose.ui.graphics.Color": "J",
        "androidx.compose.ui.unit.Dp": "F",
        "androidx.compose.ui.unit.DpSize": "J",
        "androidx.compose.ui.unit.DpOffset": "J",
        "androidx.compose.ui.unit.TextUnit": "J",
        "androidx.compose.ui.geometry.Offset": "J",
        "androidx.compose.ui.geometry.Size": "J",
        "androidx.compose.ui.geometry.CornerRadius": "J",
        "androidx.compose.ui.unit.IntOffset": "J",
        "androidx.compose.ui.unit.IntSize": "J",
        "androidx.compose.ui.unit.Constraints": "J",
        "androidx.compose.ui.graphics.TransformOrigin": "J",
        "androidx.compose.ui.graphics.StrokeCap": "I",
        "androidx.compose.ui.graphics.PathFillType": "I",
        "androidx.compose.ui.graphics.BlendMode": "I",
        "androidx.compose.ui.graphics.FilterQuality": "I",
        "androidx.compose.ui.graphics.TileMode": "I",
        "androidx.compose.ui.graphics.ClipOp": "I",
    }
    if value in value_classes:
        if nullable:
            return "L" + value.replace(".", "/") + ";"
        return value_classes[value]

    aliases = {
        "Object": "java/lang/Object",
        "java.lang.Object": "java/lang/Object",
        "kotlin.String": "java/lang/String",
        "String": "java/lang/String",
        "kotlin.Any": "java/lang/Object",
        "kotlin.Throwable": "java/lang/Throwable",
        "kotlin.collections.Iterable": "java/lang/Iterable",
        "kotlin.collections.Collection": "java/util/Collection",
        "kotlin.collections.List": "java/util/List",
        "kotlin.collections.MutableList": "java/util/List",
        "kotlin.collections.Set": "java/util/Set",
        "kotlin.collections.MutableSet": "java/util/Set",
        "kotlin.collections.Map": "java/util/Map",
        "kotlin.collections.MutableMap": "java/util/Map",
    }
    if value in aliases:
        return "L" + aliases[value] + ";"
    if value == "kotlin.Array":
        return "[Ljava/lang/Object;"
    for primitive_array, descriptor in (
        ("kotlin.BooleanArray", "[Z"), ("kotlin.ByteArray", "[B"),
        ("kotlin.CharArray", "[C"), ("kotlin.ShortArray", "[S"),
        ("kotlin.IntArray", "[I"), ("kotlin.LongArray", "[J"),
        ("kotlin.FloatArray", "[F"), ("kotlin.DoubleArray", "[D"),
    ):
        if value == primitive_array:
            return descriptor
    if value.startswith("kotlin.Function") and value[len("kotlin.Function"):].isdigit():
        return "Lkotlin/jvm/functions/Function" + value[len("kotlin.Function"):] + ";"
    if value.startswith("kotlin.jvm.functions.Function"):
        return "L" + value.replace(".", "/") + ";"
    if value.startswith("kotlin.coroutines.Continuation"):
        return "Lkotlin/coroutines/Continuation;"
    if value.startswith("kotlin.Unit"):
        return "Lkotlin/Unit;"
    if value.startswith("kotlin.jvm.internal."):
        return "L" + value.replace(".", "/") + ";"
    if value.startswith("java.") or value.startswith("android.") or value.startswith("androidx.") or value.startswith("kotlin."):
        segments = value.split(".")
        first_type = next(
            (index for index, segment in enumerate(segments) if segment and segment[0].isupper()),
            len(segments) - 1,
        )
        package_path = "/".join(segments[:first_type])
        binary_type = "$".join(segments[first_type:])
        return "L" + (package_path + "/" if package_path else "") + binary_type + ";"
    return None


def bytecode_only_method_descriptor(signature: str) -> tuple[str, str] | None:
    method_part = signature.split("method", 1)[1]
    match = re.search(r"\b(?:public|protected)\s+(?:(?:static|final|abstract|synchronized|native)\s+)*(.+?)\s+([A-Za-z_$][A-Za-z0-9_$-]*)\((.*)\);$", method_part)
    if not match:
        return None
    return_type, method_name, parameter_text = match.groups()
    return_descriptor = api_type_to_jvm_descriptor(return_type, is_return=True)
    if return_descriptor is None:
        return None
    parameters = split_api_parameter_types(parameter_text)
    parameter_descriptors = []
    for parameter in parameters:
        descriptor = api_type_to_jvm_descriptor(parameter)
        if descriptor is None:
            return None
        parameter_descriptors.append(descriptor)
    return method_name, "(" + "".join(parameter_descriptors) + ")" + return_descriptor


def _descriptor_for_api_callable(member: dict, constructor: bool = False) -> tuple[str, str] | None:
    parameters = []
    for parameter_type in member["parameterTypes"]:
        descriptor = api_type_to_jvm_descriptor(parameter_type)
        if descriptor is None:
            return None
        parameters.append(descriptor)
    if constructor:
        if member.get("kotlinOnly"):
            parameters.append("Lkotlin/jvm/internal/DefaultConstructorMarker;")
        return member["name"], "(" + "".join(parameters) + ")V"
    return_descriptor = api_type_to_jvm_descriptor(member["returnType"], is_return=True)
    if return_descriptor is None:
        return None
    if member.get("composable"):
        parameters.append("Landroidx/compose/runtime/Composer;")
        parameters.append("I")
        if member.get("static"):
            parameters.append("I")
    return member["name"], "(" + "".join(parameters) + ")" + return_descriptor


def _property_getter_name(property_name: str) -> str:
    if property_name.startswith("is") and len(property_name) > 2 and property_name[2].isupper():
        return property_name
    return "get" + property_name[:1].upper() + property_name[1:]


def compare_api_dump_to_binary(api_dump: str, binary_classes: list[tuple[str, dict, bool]]) -> dict:
    api_classes = parse_api_dump(api_dump)
    binary_by_name = {name[:-6]: summary for name, summary, _ in binary_classes}
    missing_classes = []
    missing_members = []
    unsupported_signatures = []
    counts = {
        "methods": 0, "methodDescriptorMatches": 0,
        "bytecodeOnlyMethods": 0, "bytecodeOnlyDescriptorMatches": 0,
        "kotlinOnlyMethods": 0, "kotlinOnlyDescriptorMatches": 0,
        "constructors": 0, "constructorDescriptorMatches": 0,
        "fields": 0, "fieldDescriptorMatches": 0,
        "properties": 0, "propertyAccessorMatches": 0,
    }

    for class_name, api_members in api_classes.items():
        for declaration in api_members["unparsed"]:
            unsupported_signatures.append({
                "kind": declaration["kind"], "class": class_name,
                "signature": declaration["signature"], "reason": declaration["reason"],
            })
        binary = binary_by_name.get(class_name)
        if binary is None:
            missing_classes.append(class_name + ".class")
            continue
        binary_methods = [m for m in binary["methodSignatures"] if m.get("publicProtected", True)]
        binary_fields = [f for f in binary.get("fieldSignatures", []) if f.get("publicProtected", True)]

        for method in api_members["methods"]:
            counts["methods"] += 1
            is_bytecode = method["bytecodeOnly"]
            is_kotlin_only = method["kotlinOnly"]
            if is_bytecode:
                counts["bytecodeOnlyMethods"] += 1
            if is_kotlin_only:
                counts["kotlinOnlyMethods"] += 1
            parsed = _descriptor_for_api_callable(method)
            if parsed is None:
                unsupported_signatures.append({
                    "kind": "method", "class": class_name,
                    "signature": method["signature"], "reason": "unsupported-type-descriptor",
                })
                continue
            method_name, descriptor = parsed
            matched = any(
                item["descriptor"] == descriptor and (
                    item["name"] == method_name or item["name"].startswith(method_name + "-")
                )
                for item in binary_methods
            )
            if matched:
                counts["methodDescriptorMatches"] += 1
                if is_bytecode:
                    counts["bytecodeOnlyDescriptorMatches"] += 1
                if is_kotlin_only:
                    counts["kotlinOnlyDescriptorMatches"] += 1
            else:
                missing_members.append({
                    "kind": "method", "class": class_name,
                    "name": method_name, "descriptor": descriptor,
                    "signature": method["signature"],
                })

        for constructor in api_members["constructors"]:
            counts["constructors"] += 1
            parsed = _descriptor_for_api_callable(constructor, constructor=True)
            if parsed is None:
                unsupported_signatures.append({
                    "kind": "constructor", "class": class_name,
                    "signature": constructor["signature"], "reason": "unsupported-type-descriptor",
                })
                continue
            _, descriptor = parsed
            if any(item["name"] == "<init>" and item["descriptor"] == descriptor for item in binary_methods):
                counts["constructorDescriptorMatches"] += 1
            else:
                missing_members.append({
                    "kind": "constructor", "class": class_name,
                    "descriptor": descriptor, "signature": constructor["signature"],
                })

        for field in api_members["fields"]:
            counts["fields"] += 1
            descriptor = api_type_to_jvm_descriptor(field["type"])
            if descriptor is None:
                unsupported_signatures.append({
                    "kind": "field", "class": class_name,
                    "signature": field["signature"], "reason": "unsupported-type-descriptor",
                })
                continue
            if any(item["name"] == field["name"] and item["descriptor"] == descriptor for item in binary_fields):
                counts["fieldDescriptorMatches"] += 1
            else:
                missing_members.append({
                    "kind": "field", "class": class_name, "name": field["name"],
                    "descriptor": descriptor, "signature": field["signature"],
                })

        for prop in api_members["properties"]:
            counts["properties"] += 1
            descriptor = api_type_to_jvm_descriptor(prop["type"])
            if descriptor is None:
                unsupported_signatures.append({
                    "kind": "property", "class": class_name,
                    "signature": prop["signature"], "reason": "unsupported-type-descriptor",
                })
                continue
            getter = _property_getter_name(prop["name"])
            property_parameters = []
            if prop.get("receiverType"):
                receiver_descriptor = api_type_to_jvm_descriptor(prop["receiverType"])
                if receiver_descriptor is None:
                    unsupported_signatures.append({
                        "kind": "property", "class": class_name,
                        "signature": prop["signature"], "reason": "unsupported-extension-receiver-descriptor",
                    })
                    continue
                property_parameters.append(receiver_descriptor)
            if prop.get("composable"):
                property_parameters.append("Landroidx/compose/runtime/Composer;")
                property_parameters.append("I")
                if prop.get("static"):
                    property_parameters.append("I")
            expected = "(" + "".join(property_parameters) + ")" + descriptor
            if any(
                (item["name"] == getter or item["name"].startswith(getter + "-"))
                and item["descriptor"] == expected
                for item in binary_methods
            ):
                counts["propertyAccessorMatches"] += 1
            else:
                missing_members.append({
                    "kind": "property", "class": class_name, "name": prop["name"],
                    "getter": getter, "descriptor": expected, "signature": prop["signature"],
                })

    api_method_count = counts["methods"]
    return {
        "apiClassCount": len(api_classes),
        "binaryClassMatches": len(api_classes) - len(missing_classes),
        "missingClasses": missing_classes,
        "apiMethodCount": api_method_count,
        "sourceLevelMethodCount": api_method_count - counts["bytecodeOnlyMethods"],
        "sourceLevelDescriptorMatches": counts["methodDescriptorMatches"] - counts["bytecodeOnlyDescriptorMatches"],
        "bytecodeOnlyMethodCount": counts["bytecodeOnlyMethods"],
        "bytecodeOnlyDescriptorMatches": counts["bytecodeOnlyDescriptorMatches"],
        "kotlinOnlyMethodCount": counts["kotlinOnlyMethods"],
        "kotlinOnlyDescriptorMatches": counts["kotlinOnlyDescriptorMatches"],
        "constructorCount": counts["constructors"],
        "constructorDescriptorMatches": counts["constructorDescriptorMatches"],
        "fieldCount": counts["fields"],
        "fieldDescriptorMatches": counts["fieldDescriptorMatches"],
        "propertyCount": counts["properties"],
        "propertyAccessorMatches": counts["propertyAccessorMatches"],
        "unsupportedSignatures": unsupported_signatures,
        "missingMembers": missing_members,
        "comparisonMode": "exact JVM descriptors for source-level and @BytecodeOnly methods, constructors, fields, and property getters",
        "status": "exact-declarations-match" if (
            not missing_classes and not missing_members and not unsupported_signatures
            and counts["methodDescriptorMatches"] == counts["methods"]
            and counts["constructorDescriptorMatches"] == counts["constructors"]
            and counts["fieldDescriptorMatches"] == counts["fields"]
            and counts["propertyAccessorMatches"] == counts["properties"]
        ) else "declaration-comparison-incomplete-or-mismatched",
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
    unmatched_classes = [
        {"classFile": name, "sourceFile": summary["sourceFile"]}
        for name, summary, matched in binary_classes
        if not matched
    ]

    api_dump_path = Path(__file__).resolve().parents[2] / "docs/material3/catalog/baselines/material3-1.4.0-api.txt"
    api_dump_bytes = api_dump_path.read_bytes()
    api_dump_text = api_dump_bytes.decode("utf-8")
    api_binary_comparison = compare_api_dump_to_binary(api_dump_text, binary_classes)
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
            "apiDumpAlignment": (
                "VERIFIED" if api_binary_comparison["status"] == "exact-declarations-match"
                else "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_VERIFIED_METHODS_MATCH_OTHER_API_DECLARATIONS_PENDING"
            ),
            "declarationComparison": (
                str(api_binary_comparison["apiClassCount"]) + "/" + str(api_binary_comparison["binaryClassMatches"]) +
                " API classes match; " + str(api_binary_comparison["sourceLevelDescriptorMatches"]) + "/" +
                str(api_binary_comparison["sourceLevelMethodCount"]) + " source-level method descriptors match; " +
                str(api_binary_comparison["bytecodeOnlyDescriptorMatches"]) + "/" +
                str(api_binary_comparison["bytecodeOnlyMethodCount"]) + " @BytecodeOnly descriptors match; " +
                str(api_binary_comparison["kotlinOnlyDescriptorMatches"]) + "/" +
                str(api_binary_comparison["kotlinOnlyMethodCount"]) + " @KotlinOnly descriptors match; " +
                str(api_binary_comparison["constructorDescriptorMatches"]) + "/" +
                str(api_binary_comparison["constructorCount"]) + " constructors match; " +
                str(api_binary_comparison["fieldDescriptorMatches"]) + "/" +
                str(api_binary_comparison["fieldCount"]) + " fields match; " +
                str(api_binary_comparison["propertyAccessorMatches"]) + "/" +
                str(api_binary_comparison["propertyCount"]) + " property getters match."
            ),
            "limitations": [
                "Exact descriptors are compared for source-level, @KotlinOnly, and @BytecodeOnly methods, constructors, fields, and property getters. Unsupported Kotlin/JVM type mappings remain explicitly listed and prevent an exact-match status.",
                "@KotlinOnly and @BytecodeOnly declarations are counted separately; both retain their original API classification during JVM comparison.",
                "Property comparison verifies the getter descriptor exposed by the API dump; it does not infer an unreported setter or backing field.",
                "The official stable 1.4.0 API snapshot is pinned from the AndroidX release branch, and all 249 published Kotlin sources match that release commit byte-for-byte (CI run 40984365256).",
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
