import importlib.util
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
        self.assertTrue(members[("pkg.Widget", "old", "1", "method")][0]["deprecated"])

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
        self.assertEqual(MODULE.normalize_parameter_type("java.util.List<? extends java.lang.String>"), "List")
        self.assertEqual(MODULE.normalize_parameter_type("String..."), "String[]")

    def test_public_source_path_uses_outer_type_for_nested_classes(self):
        self.assertEqual(
            MODULE.source_path_for("com.google.android.material.button.MaterialButton$SavedState"),
            "com/google/android/material/button/MaterialButton.java",
        )


if __name__ == "__main__":
    unittest.main()
