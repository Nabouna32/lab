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
        output = "\\n".join([
            "|".join(["T", enc("pkg.Widget"), enc("Widget"), "-", "type", "true", "false", "false"]),
            "|".join(["M", enc("pkg.Widget"), enc("old"), "1", "method", "false", "true", "false"]),
        ])
        types, members = MODULE.decode_source_index(output)
        self.assertTrue(types["pkg.Widget"]["restricted"])
        self.assertTrue(members[("pkg.Widget", "old", "1", "method")][0]["deprecated"])

    def test_matches_overloads_by_arity_and_marks_annotation_conflicts_ambiguous(self):
        index = {
            ("pkg.Widget", "convert", "1", "method"): [
                {"restricted": False, "deprecated": False, "docDeprecated": False},
                {"restricted": True, "deprecated": False, "docDeprecated": False},
            ],
        }
        result = MODULE.source_member_info(index, "pkg.Widget", "convert", 1, "method")
        self.assertTrue(result["matched"])
        self.assertTrue(result["ambiguous"])
        self.assertTrue(result["restricted"])

    def test_signature_parameter_count_handles_nested_generics(self):
        self.assertEqual(MODULE.signature_parameter_count("public void f(java.util.Map<java.lang.String, java.lang.Integer>, int[])"), 2)
        self.assertEqual(MODULE.signature_parameter_count("public void f()"), 0)
        self.assertIsNone(MODULE.signature_parameter_count("public int value"))

    def test_public_source_path_uses_outer_type_for_nested_classes(self):
        self.assertEqual(
            MODULE.source_path_for("com.google.android.material.button.MaterialButton$SavedState"),
            "com/google/android/material/button/MaterialButton.java",
        )


if __name__ == "__main__":
    unittest.main()
