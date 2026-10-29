import importlib.util
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("inventory-material-components-api.py")
SPEC = importlib.util.spec_from_file_location("mdc_inventory", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class SourceIndexTests(unittest.TestCase):
    def test_decodes_type_and_member_annotation_records(self):
        import base64
        enc = lambda value: base64.b64encode(value.encode()).decode()
        output = "\n".join([
            "|".join(["T", enc("pkg.Widget"), enc("Widget"), "-", "type", "true", "false", "false", enc("")]),
            "|".join(["M", enc("pkg.Widget"), enc("old"), "1", "method", "false", "true", "false", enc("String")]),
        ])
        types, members = MODULE.decode_source_index(output)
        self.assertTrue(types["pkg.Widget"]["restricted"])
        self.assertTrue(members[("pkg.Widget", "old", "method")][0]["deprecated"])

    def test_matches_overloads_using_erased_parameter_types(self):
        index = {
            ("pkg.Widget", "convert", "method"): [
                {"restricted": False, "deprecated": False, "docDeprecated": False, "parameterTypes": ["String"]},
                {"restricted": True, "deprecated": False, "docDeprecated": False, "parameterTypes": ["int"]},
            ],
        }
        result = MODULE.source_member_info(index, "pkg.Widget", "convert", ["java.lang.String"], "method")
        self.assertTrue(result["matched"])
        self.assertFalse(result["ambiguous"])
        self.assertFalse(result["restricted"])

    def test_matches_inherited_members_to_the_nearest_source_declaration(self):
        index = {
            ("pkg.BaseWidget", "setValue", "method"): [
                {"restricted": False, "deprecated": True, "docDeprecated": False, "parameterTypes": ["java.lang.String"]},
            ],
        }
        result = MODULE.source_member_info(
            index, "pkg.ChildWidget", "setValue", ["java.lang.String"], "method",
            inherited_owners=["pkg.BaseWidget"],
        )
        self.assertTrue(result["matched"])
        self.assertTrue(result["inherited"])
        self.assertEqual(result["sourceOwner"], "pkg.BaseWidget")
        self.assertTrue(result["deprecated"])

    def test_erases_inherited_type_variables_using_parent_bounds(self):
        child_signature = "public class ChildWidget extends pkg.BaseWidget<T> {"
        parent_signature = "public class BaseWidget<T extends android.view.View> {"
        self.assertEqual(
            MODULE.erase_binary_parameter_types(
                ["T"], child_signature, "public void setValue(T);", [parent_signature]
            ),
            ["android.view.View"],
        )

    def test_constructors_do_not_inherit_source_declarations(self):
        sections = {
            "pkg.ChildWidget": {"signature": "public class ChildWidget extends pkg.BaseWidget {"},
            "pkg.BaseWidget": {"signature": "public class BaseWidget {"},
        }
        source_types = {"pkg.BaseWidget": {}}
        self.assertEqual(
            MODULE.source_owners_for_member("pkg.ChildWidget", "<init>", sections, source_types),
            [],
        )

    def test_erases_class_and_method_type_variables_using_their_bounds(self):
        class_signature = (
            "public class BaseBehavior<T extends android.view.View> "
            "extends pkg.HeaderBehavior<T> {"
        )
        method_signature = (
            "public <U extends java.lang.CharSequence> void bind(T, U, T[]);"
        )
        self.assertEqual(
            MODULE.erase_binary_parameter_types(["T", "U", "T[]"], class_signature, method_signature),
            ["android.view.View", "java.lang.CharSequence", "android.view.View[]"],
        )

    def test_class_supertypes_skips_generic_bounds_and_erases_type_arguments(self):
        signature = (
            "public class RangeSlider<T extends java.lang.Number> "
            "extends pkg.BaseSlider<pkg.RangeSlider, java.util.List<java.lang.String>> "
            "implements pkg.ChangeListener<pkg.RangeSlider>, java.io.Serializable {"
        )
        self.assertEqual(
            MODULE.class_supertypes(signature),
            ["pkg.BaseSlider", "pkg.ChangeListener", "java.io.Serializable"],
        )

    def test_matches_fully_qualified_source_parameter_types(self):
        index = {
            ("pkg.Widget", "convert", "method"): [
                {"restricted": False, "deprecated": False, "docDeprecated": False, "parameterTypes": ["android.view.ViewGroup.LayoutParams"]},
                {"restricted": True, "deprecated": False, "docDeprecated": False, "parameterTypes": ["android.widget.LinearLayout.LayoutParams"]},
            ],
        }
        result = MODULE.source_member_info(
            index, "pkg.Widget", "convert", ["android.widget.LinearLayout.LayoutParams"], "method"
        )
        self.assertTrue(result["matched"])
        self.assertTrue(result["restricted"])

    def test_java_ast_indexer_resolves_nested_types_in_scope(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "sources"
            package = root / "pkg"
            package.mkdir(parents=True)
            (package / "Outer.java").write_text(
                "package pkg; public class Outer { "
                "public static class Nested {} "
                "public void set(Nested value) {} }",
                encoding="utf-8",
            )
            classes = Path(directory) / "classes"
            classes.mkdir()
            indexer = Path(__file__).with_name("SourceAnnotationIndex.java")
            subprocess.run(
                ["javac", "-d", str(classes), str(indexer)],
                check=True, capture_output=True, text=True,
            )
            result = subprocess.run(
                ["java", "-cp", str(classes), "SourceAnnotationIndex", str(root)],
                check=True, capture_output=True, text=True,
            )
            _, members = MODULE.decode_source_index(result.stdout)
            self.assertEqual(
                members[("pkg.Outer", "set", "method")][0]["parameterTypes"],
                ["pkg.Outer$Nested"],
            )

    def test_does_not_match_unresolved_simple_name_to_another_package(self):
        index = {
            ("pkg.Widget", "convert", "method"): [
                {"restricted": True, "deprecated": False, "docDeprecated": False, "parameterTypes": ["View"]},
            ],
        }
        result = MODULE.source_member_info(index, "pkg.Widget", "convert", ["android.view.View"], "method")
        self.assertFalse(result["matched"])
        self.assertFalse(result["ambiguous"])
        self.assertFalse(result["restricted"])

    def test_keeps_same_erased_signature_ambiguous(self):
        index = {
            ("pkg.Widget", "convert", "method"): [
                {"restricted": False, "deprecated": False, "docDeprecated": False, "parameterTypes": ["List<String>"]},
                {"restricted": True, "deprecated": False, "docDeprecated": False, "parameterTypes": ["java.util.List<Integer>"]},
            ],
        }
        result = MODULE.source_member_info(index, "pkg.Widget", "convert", ["java.util.List<? extends Foo>"], "method")
        self.assertFalse(result["matched"])
        self.assertTrue(result["ambiguous"])
        self.assertFalse(result["restricted"])

    def test_signature_parameter_types_handles_nested_generics(self):
        self.assertEqual(
            MODULE.signature_parameter_types("public void f(java.util.Map<java.lang.String, java.lang.Integer>, int[])"),
            ["java.util.Map<java.lang.String, java.lang.Integer>", "int[]"],
        )
        self.assertEqual(MODULE.signature_parameter_count("public void f()"), 0)
        self.assertIsNone(MODULE.signature_parameter_count("public int value"))
        self.assertEqual(MODULE.normalize_parameter_type("java.util.List<? extends java.lang.String>"), "java.util.List")
        self.assertEqual(MODULE.normalize_parameter_type("String..."), "String[]")

    def test_public_source_path_uses_outer_type_for_nested_classes(self):
        self.assertEqual(
            MODULE.source_path_for("com.google.android.material.button.MaterialButton$SavedState"),
            "com/google/android/material/button/MaterialButton.java",
        )


if __name__ == "__main__":
    unittest.main()
