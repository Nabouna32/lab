import io
import sys
import unittest
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from verify_compose_source_archive_alignment import compare_source_archive, source_tree_candidates


def make_jar(entries):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, value in entries.items():
            archive.writestr(name, value)
    return output.getvalue()


class ComposeSourceArchiveAlignmentTests(unittest.TestCase):
    def test_maps_androidx_source_sets_to_kotlin_and_java_tree_paths(self):
        self.assertEqual(
            source_tree_candidates("commonMain/androidx/compose/ui/Modifier.kt"),
            [
                "commonMain/kotlin/androidx/compose/ui/Modifier.kt",
                "src/commonMain/kotlin/androidx/compose/ui/Modifier.kt",
                "commonMain/java/androidx/compose/ui/Modifier.kt",
                "src/commonMain/java/androidx/compose/ui/Modifier.kt",
            ],
        )
        self.assertEqual(
            source_tree_candidates("androidMain/androidx/compose/ui/AndroidView.java"),
            [
                "androidMain/java/androidx/compose/ui/AndroidView.java",
                "src/androidMain/java/androidx/compose/ui/AndroidView.java",
                "androidMain/kotlin/androidx/compose/ui/AndroidView.java",
                "src/androidMain/kotlin/androidx/compose/ui/AndroidView.java",
            ],
        )

    def test_verifies_source_files_license_and_ignores_only_the_jar_manifest(self):
        kotlin = b"package androidx.compose.ui\n"
        java = b"package androidx.compose.ui;\n"
        license_bytes = b"Apache License Version 2.0\n"
        jar = make_jar({
            "META-INF/MANIFEST.MF": b"Manifest-Version: 1.0\n",
            "META-INF/androidx/compose/ui/ui/LICENSE.txt": license_bytes,
            "commonMain/androidx/compose/ui/Modifier.kt": kotlin,
            "androidMain/androidx/compose/ui/AndroidView.java": java,
        })
        tree = {
            "commonMain/kotlin/androidx/compose/ui/Modifier.kt": kotlin,
            "androidMain/java/androidx/compose/ui/AndroidView.java": java,
        }
        result = compare_source_archive(jar, tree, license_bytes)
        self.assertEqual(result["status"], "verified-byte-for-byte")
        self.assertEqual(result["jarEntryCount"], 4)
        self.assertEqual(result["matchedFileCount"], 3)
        self.assertEqual(result["ignoredEntryCount"], 1)
        self.assertEqual(result["missingEntries"], [])
        self.assertEqual(result["mismatchedEntries"], [])

    def test_reports_missing_and_different_repository_sources(self):
        jar = make_jar({
            "commonMain/androidx/compose/ui/Modifier.kt": b"published\n",
            "androidMain/androidx/compose/ui/AndroidView.kt": b"not in tree\n",
        })
        tree = {
            "commonMain/kotlin/androidx/compose/ui/Modifier.kt": b"different\n",
        }
        result = compare_source_archive(jar, tree)
        self.assertEqual(result["status"], "unverified")
        self.assertEqual(len(result["missingEntries"]), 1)
        self.assertEqual(len(result["mismatchedEntries"]), 1)
        self.assertNotEqual(
            result["mismatchedEntries"][0]["archiveSha256"],
            result["mismatchedEntries"][0]["repositorySha256"],
        )

    def test_rejects_unsafe_source_jar_paths(self):
        jar = make_jar({"../outside.kt": b"unsafe\n"})
        with self.assertRaisesRegex(ValueError, "unsafe path"):
            compare_source_archive(jar, {})

    def test_rejects_source_entries_outside_supported_source_sets(self):
        jar = make_jar({"generated/androidx/compose/ui/Generated.kt": b"generated\n"})
        with self.assertRaisesRegex(ValueError, "Unsupported source archive entry"):
            compare_source_archive(jar, {})


if __name__ == "__main__":
    unittest.main()
