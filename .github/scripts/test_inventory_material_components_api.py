import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("inventory-material-components-api.py")
SPEC = importlib.util.spec_from_file_location("mdc_inventory", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)

class SourceContextTests(unittest.TestCase):
    def test_detects_restrict_to_near_class_declaration(self):
        source = """@RestrictTo(RestrictTo.Scope.LIBRARY_GROUP)
public class InternalWidget {}
"""
        result = MODULE.source_context(source, "InternalWidget")
        self.assertTrue(result["restricted"])
        self.assertTrue(result["matched"])

    def test_detects_deprecated_annotation_near_method(self):
        source = """class Widget {
  @Deprecated
  public void oldMethod() {}
}
"""
        result = MODULE.source_context(source, "Widget", "oldMethod")
        self.assertTrue(result["deprecated"])

    def test_does_not_classify_unmatched_declaration(self):
        result = MODULE.source_context("class Widget {}", "Missing")
        self.assertFalse(result["matched"])
        self.assertFalse(result["restricted"])

    def test_public_source_path_uses_outer_type_for_nested_classes(self):
        self.assertEqual(
            MODULE.source_path_for("com.google.android.material.button.MaterialButton$SavedState"),
            "com/google/android/material/button/MaterialButton.java",
        )

if __name__ == "__main__":
    unittest.main()
