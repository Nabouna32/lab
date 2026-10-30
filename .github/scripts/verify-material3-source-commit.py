#!/usr/bin/env python3
"""Verify that the published Material 3 Android sources match the AndroidX release commit."""

from __future__ import annotations

import concurrent.futures
import hashlib
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

REPOSITORY = "androidx/androidx"
BRANCH = "androidx-compose-material3-release"
COMMIT = "5113b82a4ed6416d6344efa50e41db8cb65928ff"
RAW_BASE = "https://raw.githubusercontent.com/" + REPOSITORY + "/" + COMMIT + "/"
ALLOWED_HOST = "raw.githubusercontent.com"
MAX_SOURCE_BYTES = 5 * 1024 * 1024
REQUEST_TIMEOUT_SECONDS = 30


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def source_repository_path(archive_path: str) -> str:
    parts = archive_path.split("/")
    if len(parts) < 3 or parts[0] not in {"commonMain", "androidMain", "jvmMain"}:
        raise ValueError("Unsupported Material 3 source archive path: " + archive_path)
    return "compose/material3/material3/src/" + parts[0] + "/kotlin/" + "/".join(parts[1:])


def fetch_raw_source(repository_path: str) -> bytes:
    url = RAW_BASE + repository_path
    for attempt in range(3):
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Loculary-AndroidX-Provenance/1.0",
                "Accept": "application/octet-stream",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                final_url = urllib.parse.urlparse(response.geturl())
                if final_url.scheme != "https" or final_url.hostname != ALLOWED_HOST:
                    raise ValueError("Untrusted source redirect host: " + str(final_url.hostname))
                data = response.read(MAX_SOURCE_BYTES + 1)
                if len(data) > MAX_SOURCE_BYTES:
                    raise ValueError("AndroidX source file exceeds the size safety limit: " + repository_path)
                return data
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(1 + attempt)
    raise RuntimeError("Unreachable source fetch retry state.")


def verify_entry(archive_path: str, archive_bytes: bytes, fetcher=fetch_raw_source) -> dict:
    repository_path = source_repository_path(archive_path)
    published = fetcher(repository_path)
    matches = published == archive_bytes
    return {
        "archivePath": archive_path,
        "repositoryPath": repository_path,
        "archiveGitBlobSha1": git_blob_sha1(archive_bytes),
        "repositoryGitBlobSha1": git_blob_sha1(published),
        "matchesByteForByte": matches,
        "archiveSizeBytes": len(archive_bytes),
        "repositorySizeBytes": len(published),
    }


def verify_archive(archive_path: Path) -> dict:
    results = []
    with zipfile.ZipFile(archive_path) as archive:
        entries = sorted(name for name in archive.namelist() if name.endswith(".kt"))
        if not entries:
            raise ValueError("The published source archive contains no Kotlin files.")
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            futures = {
                executor.submit(verify_entry, name, archive.read(name)): name
                for name in entries
            }
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())

    results.sort(key=lambda item: item["archivePath"])
    mismatches = [item for item in results if not item["matchesByteForByte"]]
    return {
        "schemaVersion": 1,
        "repository": REPOSITORY,
        "branch": BRANCH,
        "commit": COMMIT,
        "sourceArchive": archive_path.name,
        "totalKotlinSourceFiles": len(results),
        "verifiedByteForByte": len(results) - len(mismatches),
        "mismatchCount": len(mismatches),
        "mismatches": mismatches,
        "result": "passed" if not mismatches else "failed",
    }


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: verify-material3-source-commit.py <sources.jar> <output-json>", file=sys.stderr)
        return 2
    source_archive = Path(sys.argv[1])
    output = Path(sys.argv[2])
    report = verify_archive(source_archive)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if report["result"] != "passed":
        print("Published Material 3 sources do not exactly match the pinned AndroidX release commit.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
