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
        self.assertEqual(summary["methods"], 3)
        self.assertEqual(summary["methods_public_protected"], 2)

    def test_parses_official_api_classes_and_nested_binary_names(self):
        api = """package androidx.compose.material3 {
  public final class AlertDialogDefaults {
    method @BytecodeOnly public long getContainerColor(androidx.compose.runtime.Composer?, int);
    method public void reset();
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
        self.assertEqual(parsed["androidx/compose/material3/AlertDialogDefaults"][0]["name"], "getContainerColor")
        self.assertTrue(parsed["androidx/compose/material3/AlertDialogDefaults"][0]["bytecodeOnly"])

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
                {"methodSignatures": [{"name": "getContainerColor"}, {"name": "reset"}]},
                True,
            )
        ]
        comparison = MODULE.compare_api_dump_to_binary(api, binary)
        self.assertEqual(comparison["apiClassCount"], 1)
        self.assertEqual(comparison["binaryClassMatches"], 1)
        self.assertEqual(comparison["apiMethodCount"], 2)
        self.assertEqual(comparison["methodNameMatches"], 2)
        self.assertEqual(comparison["bytecodeOnlyMethodCount"], 1)
        self.assertEqual(comparison["bytecodeOnlyMethodNameMatches"], 1)
        self.assertEqual(comparison["status"], "class-and-method-names-match")

    def test_rejects_invalid_or_truncated_class_files(self):
        with self.assertRaisesRegex(ValueError, "Invalid JVM class-file header"):
            MODULE.read_class_summary(b"not a class file")
        with self.assertRaises((ValueError, struct.error)):
            MODULE.read_class_summary(b"\xca\xfe\xba\xbe\x00\x00\x00\x3d\x00\x02")


if __name__ == "__main__":
    unittest.main()
