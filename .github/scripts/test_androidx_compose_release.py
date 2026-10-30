#!/usr/bin/env python3
"""Unit tests for the Compose release provenance audit."""

import unittest

from audit_androidx_compose_release import (
    git_blob_sha1,
    parse_compose_version,
    source_repository_path,
)


class ComposeReleaseProvenanceTests(unittest.TestCase):
    def test_reads_the_atomic_compose_release_version(self):
        data = b'[versions]\\nCOMPOSE = "1.12.1"\\nCOMPOSE_MATERIAL3 = "1.4.0"\\n'
        self.assertEqual(parse_compose_version(data), "1.12.1")

    def test_rejects_missing_or_ambiguous_compose_version(self):
        with self.assertRaisesRegex(ValueError, "no unambiguous"):
            parse_compose_version(b'COMPOSE_MATERIAL3 = "1.4.0"\\n')
        with self.assertRaisesRegex(ValueError, "no unambiguous"):
            parse_compose_version(b'COMPOSE = "1.12.1"\\nCOMPOSE = "1.13.0"\\n')

    def test_maps_androidx_multiplatform_archive_paths(self):
        self.assertEqual(
            source_repository_path("compose/ui/ui", "commonMain/androidx/compose/ui/Modifier.kt"),
            "compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Modifier.kt",
        )
        self.assertEqual(
            source_repository_path("compose/foundation/foundation", "androidMain/androidx/compose/foundation/gestures/Draggable.kt"),
            "compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/gestures/Draggable.kt",
        )

    def test_rejects_unsafe_or_malformed_archive_paths(self):
        for path in (
            "../commonMain/Modifier.kt",
            "commonMain/../Modifier.kt",
            "/commonMain/Modifier.kt",
            "commonMain//Modifier.kt",
            "commonMain/Modifier.kt?token=secret",
        ):
            with self.subTest(path=path):
                with self.assertRaises(ValueError):
                    source_repository_path("compose/ui/ui", path)

    def test_calculates_git_blob_sha1(self):
        self.assertEqual(
            git_blob_sha1(b"test"),
            "30d74d258442c7c65512eafab474568dd706c430",
        )


if __name__ == "__main__":
    unittest.main()
