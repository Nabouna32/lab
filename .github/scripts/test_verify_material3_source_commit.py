#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("verify-material3-source-commit.py")
SPEC = importlib.util.spec_from_file_location("verify_material3_source_commit", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class Material3SourceCommitVerificationTests(unittest.TestCase):
    def test_maps_published_source_sets_to_androidx_repository_paths(self):
        self.assertEqual(
            MODULE.source_repository_path("commonMain/androidx/compose/material3/AlertDialog.kt"),
            "compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AlertDialog.kt",
        )
        self.assertEqual(
            MODULE.source_repository_path("androidMain/androidx/compose/material3/ModalBottomSheet.android.kt"),
            "compose/material3/material3/src/androidMain/kotlin/androidx/compose/material3/ModalBottomSheet.android.kt",
        )
        self.assertEqual(
            MODULE.source_repository_path("jvmMain/androidx/compose/material3/CalendarLocale.jvm.kt"),
            "compose/material3/material3/src/jvmMain/kotlin/androidx/compose/material3/CalendarLocale.jvm.kt",
        )

    def test_rejects_paths_outside_the_published_kotlin_source_sets(self):
        with self.assertRaisesRegex(ValueError, "Unsupported Material 3 source archive path"):
            MODULE.source_repository_path("../outside/Bad.kt")
        with self.assertRaisesRegex(ValueError, "Unsupported Material 3 source archive path"):
            MODULE.source_repository_path("commonMain/Bad.kt")

    def test_compares_source_archive_bytes_to_the_pinned_repository_file(self):
        source = b"package androidx.compose.material3\nclass Sample\n"
        report = MODULE.verify_entry(
            "commonMain/androidx/compose/material3/Sample.kt",
            source,
            fetcher=lambda repository_path: source,
        )
        self.assertTrue(report["matchesByteForByte"])
        self.assertEqual(report["archiveGitBlobSha1"], report["repositoryGitBlobSha1"])
        self.assertEqual(report["repositoryPath"], "compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Sample.kt")

    def test_detects_source_content_mismatches(self):
        report = MODULE.verify_entry(
            "commonMain/androidx/compose/material3/Sample.kt",
            b"class Sample\n",
            fetcher=lambda repository_path: b"class Changed\n",
        )
        self.assertFalse(report["matchesByteForByte"])
        self.assertNotEqual(report["archiveGitBlobSha1"], report["repositoryGitBlobSha1"])


if __name__ == "__main__":
    unittest.main()
