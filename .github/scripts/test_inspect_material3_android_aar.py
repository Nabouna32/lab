#!/usr/bin/env python3
import importlib.util
import shutil
import struct
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("inspect-material3-android-aar.py")
SPEC = importlib.util.spec_from_file_location("inspect_material3_android_aar", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class Material3AndroidAarInspectionTests(unittest.TestCase):
    def test_class_file_summary_counts_public_and_protected_jvm_members(self):
        javac = shutil.which("javac")
        self.assertIsNotNone(javac, "Java 17 must be installed before this tooling test.")
        with tempfile.TemporaryDirectory(prefix="material3-class-fixture-") as directory:
            root = Path(directory)
            source = root / "Sample.java"
            source.write_text(
                "package example; public class Sample { "
                "public String visible; protected int inherited; private String hidden; "
                "protected void call() {} private void secret() {} }",
                encoding="utf-8",
            )
            subprocess.run([javac, "-d", str(root), str(source)], check=True, capture_output=True)
            summary = MODULE.read_class_summary((root / "example" / "Sample.class").read_bytes())

        self.assertTrue(summary["classIsPublic"])
        self.assertEqual(summary["sourceFile"], "Sample.java")
        self.assertEqual(summary["fields"], 3)
        self.assertEqual(summary["fields_public_protected"], 2)
        self.assertEqual(
            {(field["name"], field["descriptor"]) for field in summary["fieldSignatures"] if field["publicProtected"]},
            {("visible", "Ljava/lang/String;"), ("inherited", "I")},
        )
        self.assertEqual(summary["methods"], 3)
        self.assertEqual(summary["methods_public_protected"], 2)

    def test_maps_nullable_primitives_simple_java_types_and_nested_classes(self):
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("String?"), "Ljava/lang/String;")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("Long"), "J")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("Long?"), "Ljava/lang/Long;")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("kotlin.Long?"), "Ljava/lang/Long;")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("androidx.compose.ui.graphics.Color"), "J")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("androidx.compose.ui.unit.Dp"), "F")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("androidx.compose.material3.DisplayMode"), "I")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("androidx.compose.material3.DisplayMode?"), "Landroidx/compose/material3/DisplayMode;")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("androidx.compose.material3.ExposedDropdownMenuAnchorType"), "Ljava/lang/String;")
        self.assertEqual(
            MODULE._descriptor_for_api_callable({
                "name": "box-impl",
                "returnType": "androidx.compose.material3.IconButtonDefaults.IconButtonWidthOption",
                "parameterTypes": ["int"],
                "bytecodeOnly": True,
            })[1],
            "(I)Landroidx/compose/material3/IconButtonDefaults$IconButtonWidthOption;",
        )
        self.assertEqual(MODULE._property_getter_name("is24hour"), "is24hour")
        self.assertEqual(MODULE._property_getter_name("island"), "getIsland")
        self.assertEqual(MODULE.api_type_to_jvm_descriptor("Object?"), "Ljava/lang/Object;")
        self.assertEqual(
            MODULE.api_type_to_jvm_descriptor("androidx.compose.foundation.layout.Arrangement.Vertical"),
            "Landroidx/compose/foundation/layout/Arrangement$Vertical;",
        )

    def test_parses_official_api_classes_and_nested_binary_names(self):
        api = """package androidx.compose.material3 {
  public final class AlertDialogDefaults {
    method @BytecodeOnly public long getContainerColor(androidx.compose.runtime.Composer?, int);
    method @KotlinOnly public void reset();
  }
  public final class Outer.Inner {
    method public boolean isVisible();
  }
}
"""
        parsed = MODULE.parse_api_dump(api)
        self.assertEqual(
            set(parsed),
            {
                "androidx/compose/material3/AlertDialogDefaults",
                "androidx/compose/material3/Outer$Inner",
            },
        )
        parsed_methods = parsed["androidx/compose/material3/AlertDialogDefaults"]["methods"]
        self.assertEqual(parsed_methods[0]["name"], "getContainerColor")
        self.assertTrue(parsed_methods[0]["bytecodeOnly"])
        self.assertEqual(parsed_methods[1]["name"], "reset")
        self.assertTrue(parsed_methods[1]["kotlinOnly"])

    def test_compares_api_class_and_method_names_with_binary_surface(self):
        api = """package androidx.compose.material3 {
  public final class AlertDialogDefaults {
    method @BytecodeOnly public long getContainerColor(androidx.compose.runtime.Composer?, int);
    method public void reset();
  }
}
"""
        binary = [
            (
                "androidx/compose/material3/AlertDialogDefaults.class",
                {"methodSignatures": [
                    {"name": "getContainerColor", "descriptor": "(Landroidx/compose/runtime/Composer;I)J"},
                    {"name": "reset", "descriptor": "()V"},
                ]},
                True,
            )
        ]
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["apiClassCount"], 1)
        self.assertEqual(comparison["binaryClassMatches"], 1)
        self.assertEqual(comparison["apiMethodCount"], 2)
        self.assertEqual(comparison["sourceLevelDescriptorMatches"], 1)
        self.assertEqual(comparison["bytecodeOnlyMethodCount"], 1)
        self.assertEqual(comparison["bytecodeOnlyDescriptorMatches"], 1)
        self.assertEqual(comparison["kotlinOnlyMethodCount"], 1)
        self.assertEqual(comparison["kotlinOnlyDescriptorMatches"], 1)
        self.assertEqual(comparison["status"], "exact-declarations-match")


    def test_compares_exact_method_constructor_field_and_property_descriptors(self):
        api = """package androidx.compose.material3 {
  public final class Api {
    ctor public Api(int count);
    method public java.lang.String label(int count);
    field public static final int VERSION;
    property public boolean isReady;
  }
}
"""
        binary = [
            (
                "androidx/compose/material3/Api.class",
                {
                    "methodSignatures": [
                        {"name": "<init>", "descriptor": "(I)V", "publicProtected": True},
                        {"name": "label", "descriptor": "(I)Ljava/lang/String;", "publicProtected": True},
                        {"name": "isReady", "descriptor": "()Z", "publicProtected": True},
                    ],
                    "fieldSignatures": [
                        {"name": "VERSION", "descriptor": "I", "publicProtected": True},
                    ],
                },
                True,
            )
        ]
        parsed = MODULE.parse_api_dump(api)["androidx/compose/material3/Api"]
        self.assertEqual(len(parsed["methods"]), 1)
        self.assertEqual(len(parsed["constructors"]), 1)
        self.assertEqual(len(parsed["fields"]), 1)
        self.assertEqual(len(parsed["properties"]), 1)
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["sourceLevelDescriptorMatches"], 1)
        self.assertEqual(comparison["constructorDescriptorMatches"], 1)
        self.assertEqual(comparison["kotlinOnlyConstructorCount"], 1)
        self.assertEqual(comparison["kotlinOnlyConstructorMatches"], 1)
        self.assertEqual(comparison["fieldDescriptorMatches"], 1)
        self.assertEqual(comparison["propertyAccessorMatches"], 1)
        self.assertEqual(comparison["missingMembers"], [])
        self.assertEqual(comparison["unsupportedSignatures"], [])
        self.assertEqual(comparison["status"], "exact-declarations-match")


    def test_applies_compose_and_kotlin_value_class_jvm_lowering(self):
        api = """package androidx.compose.material3 {
  public final class Api {
    method @androidx.compose.runtime.Composable public static void draw(androidx.compose.ui.graphics.Color color, androidx.compose.ui.Modifier modifier);
    method @androidx.compose.runtime.Composable public androidx.compose.ui.graphics.Shape getShape();
    method public suspend Object? animate(kotlin.coroutines.Continuation<? super kotlin.Unit>);
    method @androidx.compose.runtime.Composable public static void drawContent(kotlin.jvm.functions.Function0<kotlin.Unit> onClick, kotlin.jvm.functions.Function0<kotlin.Unit> content);
    method @BytecodeOnly @androidx.compose.runtime.Composable public static void drawContent(kotlin.jvm.functions.Function0<kotlin.Unit!>, kotlin.jvm.functions.Function2<? super androidx.compose.runtime.Composer!,? super java.lang.Integer!,kotlin.Unit!>, androidx.compose.runtime.Composer?, int);
    method @BytecodeOnly @androidx.compose.runtime.Composable public androidx.compose.ui.graphics.Color getAccentColor(androidx.compose.runtime.Composer?, int);
    method public void setHour(@IntRange(from=0L, to=23L) int);
    ctor @KotlinOnly public Api(androidx.compose.ui.graphics.Color color);
    field public static final String LABEL = "label";
    property @androidx.compose.runtime.Composable public androidx.compose.ui.graphics.Color containerColor;
    property public androidx.compose.ui.graphics.Color accentColor;
    property public static boolean androidx.compose.material3.TimePickerState.isPm;
    property public static String LABEL;
    property public androidx.compose.material3.DisplayMode displayMode;
    property public androidx.compose.material3.ExposedDropdownMenuAnchorType anchorType;
  }
}
"""
        parsed = MODULE.parse_api_dump(api)["androidx/compose/material3/Api"]
        self.assertTrue(parsed["methods"][0]["composable"])
        self.assertTrue(parsed["constructors"][0]["kotlinOnly"])
        self.assertEqual(parsed["fields"][0]["name"], "LABEL")
        self.assertEqual(parsed["properties"][1]["receiverType"], "androidx.compose.material3.TimePickerState")
        binary = [
            (
                "androidx/compose/material3/Api.class",
                {
                    "methodSignatures": [
                        {"name": "draw-hash", "descriptor": "(JLandroidx/compose/ui/Modifier;Landroidx/compose/runtime/Composer;I)V", "publicProtected": True},
                        {"name": "getShape", "descriptor": "(Landroidx/compose/runtime/Composer;I)Landroidx/compose/ui/graphics/Shape;", "publicProtected": True},
                        {"name": "animate", "descriptor": "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "publicProtected": True},
                        {"name": "drawContent", "descriptor": "(Lkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function2;Landroidx/compose/runtime/Composer;I)V", "publicProtected": True},
                        {"name": "getAccentColor", "descriptor": "(Landroidx/compose/runtime/Composer;I)J", "publicProtected": True},
                        {"name": "getContainerColor-hash", "descriptor": "(Landroidx/compose/runtime/Composer;I)J", "publicProtected": True},
                        {"name": "getDisplayMode-jFl-4v0", "descriptor": "()I", "publicProtected": True},
                        {"name": "getAnchorType-oYjWRB4", "descriptor": "()Ljava/lang/String;", "publicProtected": True},
                        {"name": "setHour", "descriptor": "(I)V", "publicProtected": True},
                        {"name": "isPm", "descriptor": "(Landroidx/compose/material3/TimePickerState;)Z", "publicProtected": True},
                    ],
                    "fieldSignatures": [
                        {"name": "LABEL", "descriptor": "Ljava/lang/String;", "publicProtected": True},
                    ],
                },
                True,
            )
        ]
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["sourceLevelDescriptorMatches"], 5)
        self.assertEqual(comparison["bytecodeOnlyDescriptorMatches"], 2)
        self.assertEqual(comparison["constructorDescriptorMatches"], 1)
        self.assertEqual(comparison["fieldDescriptorMatches"], 1)
        self.assertEqual(comparison["propertyAccessorMatches"], 6)
        self.assertEqual(comparison["missingMembers"], [])
        self.assertEqual(comparison["unsupportedSignatures"], [])



    def test_maps_kotlin_default_constructor_overloads_to_synthetic_mask_descriptors(self):
        api = """package androidx.compose.material3 {
  public final class DefaultApi {
    ctor public DefaultApi();
    ctor @KotlinOnly public DefaultApi(optional androidx.compose.ui.unit.DpSize size);
  }
}
"""
        binary = [
            (
                "androidx/compose/material3/DefaultApi.class",
                {
                    "methodSignatures": [
                        {"name": "<init>", "descriptor": "(JLkotlin/jvm/internal/DefaultConstructorMarker;)V", "publicProtected": True},
                        {"name": "<init>", "descriptor": "(JILkotlin/jvm/internal/DefaultConstructorMarker;)V", "publicProtected": True},
                    ],
                    "fieldSignatures": [],
                },
                True,
            )
        ]
        parsed = MODULE.parse_api_dump(api)["androidx/compose/material3/DefaultApi"]
        self.assertEqual(parsed["constructors"][1]["optionalParameterCount"], 1)
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["constructorCount"], 2)
        self.assertEqual(comparison["constructorDescriptorMatches"], 2)
        self.assertEqual(comparison["missingMembers"], [])



    def test_composable_default_arguments_add_changed_flags_and_default_masks(self):
        member = {
            "name": "render",
            "returnType": "void",
            "parameterTypes": ["int"] * 14,
            "optionalParameterCount": 3,
            "composable": True,
            "static": True,
            "bytecodeOnly": False,
        }
        parsed = MODULE._descriptor_for_api_callable(member)
        self.assertEqual(
            parsed[1],
            "(" + ("I" * 14) + "Landroidx/compose/runtime/Composer;III)V",
        )


    def test_reports_unsupported_types_instead_of_claiming_a_match(self):
        api = """package androidx.compose.material3 {
  public final class Api {
    method public UnknownType unsupported();
  }
}
"""
        binary = [
            (
                "androidx/compose/material3/Api.class",
                {"methodSignatures": [], "fieldSignatures": []},
                True,
            )
        ]
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["unsupportedSignatures"][0]["kind"], "method")
        self.assertEqual(comparison["status"], "declaration-comparison-incomplete-or-mismatched")


    def test_parses_public_classes_with_leading_annotations(self):
        api = """package androidx.compose.material3 {
  @androidx.annotation.RestrictTo(\"LIBRARY\") public interface AnnotatedApi {
    method public void visible();
  }
}
"""
        parsed = MODULE.parse_api_dump(api)
        self.assertEqual(set(parsed), {"androidx/compose/material3/AnnotatedApi"})
        self.assertEqual(parsed["androidx/compose/material3/AnnotatedApi"]["methods"][0]["name"], "visible")


    def test_parses_method_annotations_with_arguments_before_the_parameter_list(self):
        api = """package androidx.compose.material3 {
  public final class Api {
    method @androidx.annotation.IntRange(from=0) public int count(int value);
  }
}
"""
        parsed = MODULE.parse_api_dump(api)["androidx/compose/material3/Api"]
        self.assertEqual(parsed["methods"][0]["name"], "count")
        self.assertEqual(parsed["methods"][0]["returnType"], "int")
        self.assertEqual(parsed["methods"][0]["parameterTypes"], ["int"])


    def test_rejects_invalid_or_truncated_class_files(self):
        with self.assertRaisesRegex(ValueError, "Invalid JVM class-file header"):
            MODULE.read_class_summary(b"not a class file")
        with self.assertRaises((ValueError, struct.error)):
            MODULE.read_class_summary(b"\xca\xfe\xba\xbe\x00\x00\x00\x3d\x00\x02")


if __name__ == "__main__":
    unittest.main()
