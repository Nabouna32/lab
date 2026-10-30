#!/usr/bin/env python3
"""Verify Compose 1.12.1 API dumps and published sources against the official release branch."""

from __future__ import annotations

import base64
import concurrent.futures
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

REPOSITORY = "androidx/androidx"
GIT_REMOTE = "https://android.googlesource.com/platform/frameworks/support"
RELEASE_BRANCH = "androidx-compose-release"
EXPECTED_VERSION = "1.12.1"
RAW_BASE = "https://raw.githubusercontent.com/" + REPOSITORY + "/"
GITILES_BASE = "https://android.googlesource.com/platform/frameworks/support/+/"
ALLOWED_HOSTS = {
    "raw.githubusercontent.com",
    "android.googlesource.com",
    "dl.google.com",
    "maven.google.com",
    "storage.googleapis.com",
}
MAX_SOURCE_ARCHIVE_BYTES = 50 * 1024 * 1024
MAX_SOURCE_FILE_BYTES = 5 * 1024 * 1024
REQUEST_TIMEOUT_SECONDS = 30
MAX_REDIRECTS = 5

TARGETS = (
    {
        "familyId": "compose-ui",
        "group": "androidx.compose.ui",
        "module": "ui",
        "androidModule": "ui-android",
        "sourceDirectory": "compose/ui/ui",
        "apiPath": "compose/ui/ui/api/current.txt",
    },
    {
        "familyId": "compose-foundation",
        "group": "androidx.compose.foundation",
        "module": "foundation",
        "androidModule": "foundation-android",
        "sourceDirectory": "compose/foundation/foundation",
        "apiPath": "compose/foundation/foundation/api/current.txt",
    },
    {
        "familyId": "compose-ui-text",
        "group": "androidx.compose.ui",
        "module": "ui-text",
        "androidModule": "ui-text-android",
        "sourceDirectory": "compose/ui/ui-text",
        "apiPath": "compose/ui/ui-text/api/current.txt",
    },
    {
        "familyId": "compose-foundation-layout",
        "group": "androidx.compose.foundation",
        "module": "foundation-layout",
        "androidModule": "foundation-layout-android",
        "sourceDirectory": "compose/foundation/foundation-layout",
        "apiPath": "compose/foundation/foundation-layout/api/current.txt",
    },
)


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\\0" + data).hexdigest()


def parse_compose_version(library_versions: bytes) -> str:
    text = library_versions.decode("utf-8")
    match = re.search(r'^COMPOSE\\s*=\\s*"([^"]+)"\\s*$', text, re.MULTILINE)
    if not match:
        raise ValueError("libraryversions.toml has no unambiguous COMPOSE version marker.")
    return match.group(1)


def source_repository_path(source_directory: str, archive_path: str) -> str:
    parts = archive_path.split("/")
    if (
        len(parts) < 2
        or not re.fullmatch(r"[A-Za-z][A-Za-z0-9]*", parts[0])
        or any(part in {"", ".", ".."} for part in parts)
        or not all(re.fullmatch(r"[A-Za-z0-9_.-]+", part) for part in parts)
    ):
        raise ValueError("Unsupported or unsafe Compose source archive path: " + archive_path)
    return source_directory + "/src/" + parts[0] + "/kotlin/" + "/".join(parts[1:])


def assert_trusted_url(url: str) -> urllib.parse.ParseResult:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS or parsed.username or parsed.password:
        raise ValueError("Untrusted HTTPS URL: " + url)
    return parsed


def fetch_bytes(url: str, max_bytes: int, accept: str = "application/octet-stream") -> bytes:
    current = url
    for redirect_count in range(MAX_REDIRECTS + 1):
        assert_trusted_url(current)
        request = urllib.request.Request(
            current,
            headers={"User-Agent": "Loculary-AndroidX-Provenance/1.0", "Accept": accept},
        )
        try:
            with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                final = urllib.parse.urlparse(response.geturl())
                if final.scheme != "https" or final.hostname not in ALLOWED_HOSTS:
                    raise ValueError("Untrusted redirect host: " + str(final.hostname))
                data = response.read(max_bytes + 1)
                if len(data) > max_bytes:
                    raise ValueError("Response exceeds byte safety limit: " + url)
                return data
        except urllib.error.HTTPError as error:
            if error.code not in {301, 302, 303, 307, 308}:
                raise
            location = error.headers.get("Location")
            if not location or redirect_count == MAX_REDIRECTS:
                raise ValueError("Invalid or excessive redirect: " + url)
            current = urllib.parse.urljoin(current, location)
        except urllib.error.URLError:
            if redirect_count == MAX_REDIRECTS:
                raise
            time.sleep(1 + redirect_count)
    raise RuntimeError("Unreachable redirect retry state.")


def fetch_source_file(commit: str, repository_path: str) -> bytes:
    raw_url = RAW_BASE + commit + "/" + repository_path
    try:
        return fetch_bytes(raw_url, MAX_SOURCE_FILE_BYTES)
    except urllib.error.HTTPError as error:
        if error.code not in {400, 404}:
            raise
    gitiles_url = GITILES_BASE + commit + "/" + repository_path + "?format=TEXT"
    encoded = fetch_bytes(gitiles_url, MAX_SOURCE_FILE_BYTES * 2, "text/plain")
    try:
        data = base64.b64decode(encoded, validate=True)
    except ValueError as error:
        raise ValueError("Gitiles returned invalid base64 for " + repository_path) from error
    if len(data) > MAX_SOURCE_FILE_BYTES:
        raise ValueError("AndroidX source file exceeds the size safety limit: " + repository_path)
    return data


def resolve_release_commit() -> str:
    import subprocess

    result = subprocess.run(
        ["git", "ls-remote", "--exit-code", GIT_REMOTE, "refs/heads/" + RELEASE_BRANCH],
        check=True,
        capture_output=True,
        text=True,
        timeout=REQUEST_TIMEOUT_SECONDS,
    )
    matches = [line.split() for line in result.stdout.splitlines() if line.strip()]
    if len(matches) != 1 or len(matches[0]) != 2 or not re.fullmatch(r"[a-f0-9]{40}", matches[0][0]):
        raise ValueError("Could not resolve one immutable AndroidX Compose release commit.")
    return matches[0][0]


def verify_target(target: dict, commit: str, output_dir: Path) -> dict:
    base = (
        "https://dl.google.com/dl/android/maven2/"
        + target["group"].replace(".", "/")
        + "/"
        + target["androidModule"]
        + "/"
        + EXPECTED_VERSION
        + "/"
        + target["androidModule"]
        + "-"
        + EXPECTED_VERSION
    )
    archive_url = base + "-sources.jar"
    checksum_url = archive_url + ".sha256"
    checksum_text = fetch_bytes(checksum_url, 4096, "text/plain").decode("utf-8").strip()
    checksum_match = re.match(r"^([a-f0-9]{64})(?:\\s+.*)?$", checksum_text, re.IGNORECASE)
    if not checksum_match:
        raise ValueError("Invalid Google Maven SHA-256 sidecar for " + target["familyId"])
    archive = fetch_bytes(archive_url, MAX_SOURCE_ARCHIVE_BYTES)
    archive_sha256 = hashlib.sha256(archive).hexdigest()
    if archive_sha256 != checksum_match.group(1).lower():
        raise ValueError("Published source archive SHA-256 mismatch for " + target["familyId"])

    entries = []
    with zipfile.ZipFile(__import__("io").BytesIO(archive)) as zipped:
        source_names = sorted(
            name for name in zipped.namelist()
            if name.endswith(".kt") and not name.startswith("/")
        )
        if not source_names:
            raise ValueError("No Kotlin sources in " + target["familyId"] + " source archive.")
        if len(source_names) > 10000:
            raise ValueError("Unexpected source file count in " + target["familyId"])
        for name in source_names:
            repository_path = source_repository_path(target["sourceDirectory"], name)
            published = zipped.read(name)
            repository = fetch_source_file(commit, repository_path)
            entries.append({
                "archivePath": name,
                "repositoryPath": repository_path,
                "archiveGitBlobSha1": git_blob_sha1(published),
                "repositoryGitBlobSha1": git_blob_sha1(repository),
                "matchesByteForByte": published == repository,
                "sizeBytes": len(published),
            })

    mismatches = [entry for entry in entries if not entry["matchesByteForByte"]]
    api_dump = fetch_source_file(commit, target["apiPath"])
    api_header = api_dump.decode("utf-8").splitlines()[:2]
    if len(api_header) < 2 or api_header[0] != "// Signature format: 5.0" or api_header[1] != "// - surface=public":
        raise ValueError("Unexpected public API dump format for " + target["familyId"])
    api_path = output_dir / "api-dumps" / (target["familyId"] + ".current.txt")
    api_path.parent.mkdir(parents=True, exist_ok=True)
    api_path.write_bytes(api_dump)

    return {
        "familyId": target["familyId"],
        "artifact": target["group"] + ":" + target["module"],
        "publishedAndroidVariant": target["group"] + ":" + target["androidModule"],
        "version": EXPECTED_VERSION,
        "sourceArchive": {
            "url": archive_url,
            "checksumUrl": checksum_url,
            "sizeBytes": len(archive),
            "sha256": archive_sha256,
            "publishedSha256": checksum_match.group(1).lower(),
            "sourceFileCount": len(entries),
            "verifiedByteForByte": len(entries) - len(mismatches),
            "mismatchCount": len(mismatches),
            "mismatches": mismatches,
        },
        "apiDump": {
            "repositoryPath": target["apiPath"],
            "vendoredPath": str(api_path),
            "sizeBytes": len(api_dump),
            "sha256": hashlib.sha256(api_dump).hexdigest(),
            "gitBlobSha1": git_blob_sha1(api_dump),
            "signatureFormat": "5.0",
            "surface": "public",
        },
        "result": "passed" if not mismatches else "failed",
    }


def audit(output_dir: Path) -> dict:
    commit = resolve_release_commit()
    library_versions = fetch_source_file(commit, "libraryversions.toml")
    compose_version = parse_compose_version(library_versions)
    if compose_version != EXPECTED_VERSION:
        raise ValueError(
            "The official " + RELEASE_BRANCH + " branch currently declares Compose "
            + compose_version + ", expected " + EXPECTED_VERSION + "."
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    reports = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(verify_target, target, commit, output_dir): target["familyId"]
            for target in TARGETS
        }
        for future in concurrent.futures.as_completed(futures):
            reports.append(future.result())
    reports.sort(key=lambda item: item["familyId"])
    failed = [item["familyId"] for item in reports if item["result"] != "passed"]
    return {
        "schemaVersion": 1,
        "repository": REPOSITORY,
        "releaseBranch": RELEASE_BRANCH,
        "releaseCommit": commit,
        "releaseCommitUrl": "https://github.com/" + REPOSITORY + "/commit/" + commit,
        "libraryVersionsPath": "libraryversions.toml",
        "composeVersionMarker": "COMPOSE = \"" + compose_version + "\"",
        "expectedVersion": EXPECTED_VERSION,
        "targets": reports,
        "result": "passed" if not failed else "failed",
        "failedFamilies": failed,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: audit_androidx_compose_release.py <output-directory>", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    try:
        report = audit(output_dir)
    except Exception as error:
        print("Compose release provenance audit failed: " + str(error), file=sys.stderr)
        return 1
    report_path = output_dir / "compose-release-provenance.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report["result"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
