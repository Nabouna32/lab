#!/usr/bin/env python3
"""Compare published Compose sources JARs with the immutable AndroidX release tree."""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import tarfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path, PurePosixPath

GITILES_BASE = "https://android.googlesource.com/platform/frameworks/support"
ALLOWED_HOSTS = {"android.googlesource.com", "storage.googleapis.com"}
MAX_ARCHIVE_BYTES = 40 * 1024 * 1024
MAX_SOURCE_ARCHIVE_BYTES = 10 * 1024 * 1024
REQUEST_TIMEOUT_SECONDS = 30

FAMILIES = (
    {
        "familyId": "compose-ui",
        "androidModule": "ui-android",
        "modulePath": "compose/ui/ui",
    },
    {
        "familyId": "compose-ui-text",
        "androidModule": "ui-text-android",
        "modulePath": "compose/ui/ui-text",
    },
    {
        "familyId": "compose-foundation",
        "androidModule": "foundation-android",
        "modulePath": "compose/foundation/foundation",
    },
    {
        "familyId": "compose-foundation-layout",
        "androidModule": "foundation-layout-android",
        "modulePath": "compose/foundation/foundation-layout",
    },
)
SOURCE_SETS = {"commonMain", "androidMain", "jvmAndAndroidMain"}
GENERATED_PROGUARD_SOURCE = {
    "familyId": "compose-ui",
    "archivePath": "androidMain/androidx/inspection/compose/ui/ProguardDetection.kt",
    "generatorPath": "inspection/inspection-gradle-plugin/src/main/kotlin/androidx/inspection/gradle/GenerateProguardDetectionFileTask.kt",
    "generatorGitBlobSha1": "67176de62ef82e4a142a8cc264345a3366a3ad38",
    "packageName": "androidx.inspection.compose.ui",
}


class TrustedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):
        parsed = urllib.parse.urlparse(new_url)
        if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
            raise ValueError("Gitiles redirected to an untrusted URL.")
        return super().redirect_request(request, file_pointer, code, message, headers, new_url)


def fetch_trusted_bytes(url: str, max_bytes: int) -> bytes:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("Gitiles URL must use HTTPS on android.googlesource.com.")
    opener = urllib.request.build_opener(TrustedRedirectHandler())
    request = urllib.request.Request(url, headers={"Accept": "application/octet-stream"})
    with opener.open(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        final_url = urllib.parse.urlparse(response.geturl())
        if final_url.scheme != "https" or final_url.hostname not in ALLOWED_HOSTS:
            raise ValueError("Gitiles response ended at an untrusted URL.")
        length = response.headers.get("Content-Length")
        if length and int(length) > max_bytes:
            raise ValueError("Gitiles response exceeds the configured size limit.")
        body = response.read(max_bytes + 1)
        if len(body) > max_bytes:
            raise ValueError("Gitiles response exceeds the configured size limit.")
        return body


def fetch_gitiles_archive(commit: str, module_path: str) -> dict[str, bytes]:
    url = f"{GITILES_BASE}/+archive/{commit}/{module_path}.tar.gz"
    archive_bytes = fetch_trusted_bytes(url, MAX_ARCHIVE_BYTES)
    files: dict[str, bytes] = {}
    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as archive:
        for member in archive.getmembers():
            if not member.isfile():
                continue
            member_path = PurePosixPath(member.name)
            if member_path.is_absolute() or ".." in member_path.parts:
                raise ValueError("Gitiles archive contains an unsafe path.")
            stream = archive.extractfile(member)
            if stream is None:
                raise ValueError(f"Gitiles archive member {member.name} has no readable body.")
            files[str(member_path)] = stream.read()
    return files


def source_tree_candidates(jar_path: str) -> list[str]:
    parts = PurePosixPath(jar_path).parts
    if len(parts) < 2 or parts[0] not in SOURCE_SETS:
        raise ValueError(f"Unsupported source archive entry: {jar_path}")
    source_set, relative = parts[0], PurePosixPath(*parts[1:])
    language_roots = ("java", "kotlin") if relative.suffix == ".java" else ("kotlin", "java")
    return [
        candidate
        for language_root in language_roots
        for candidate in (f"{source_set}/{language_root}/{relative}", f"src/{source_set}/{language_root}/{relative}")
    ]


def generated_proguard_detection_source(package_name: str) -> bytes:
    # Exact output of AndroidX GenerateProguardDetectionFileTask.trimIndent() for androidx.compose.ui:ui.
    return (
        f"package {package_name};\n\n"
        "/**\n"
        " * Purposely empty, unused class that would be removed by proguard.\n"
        " *\n"
        " * We use this class to detect if a target app was proguarded or not, because if it was,\n"
        " * it likely means we can't reliably inspect it, since library's methods used only by\n"
        " * an inspector would get removed. Instead, we'll need to tell users that app\n"
        " * inspection isn't available for the current app and that they should rebuild it\n"
        " * again without proguarding to continue.\n"
        " */\n"
        " private class ProguardDetection {}"
    ).encode("utf-8")


def compare_source_archive(
    jar_bytes: bytes,
    source_tree: dict[str, bytes],
    license_bytes: bytes | None = None,
    generated_sources: dict[str, bytes] | None = None,
) -> dict:
    matched = []
    missing = []
    mismatched = []
    ignored = []

    with zipfile.ZipFile(io.BytesIO(jar_bytes)) as jar:
        entries = [entry for entry in jar.infolist() if not entry.is_dir()]
        for entry in entries:
            name = entry.filename
            entry_path = PurePosixPath(name)
            if entry_path.is_absolute() or ".." in entry_path.parts:
                raise ValueError("Source JAR contains an unsafe path.")
            if name == "META-INF/MANIFEST.MF":
                ignored.append(name)
                continue
            if name.startswith("META-INF/androidx/") and name.endswith("/LICENSE.txt"):
                jar_license = jar.read(name)
                if license_bytes is None:
                    missing.append({"archivePath": name, "repositoryPath": "LICENSE.txt"})
                elif jar_license == license_bytes:
                    matched.append({"archivePath": name, "repositoryPath": "LICENSE.txt"})
                else:
                    mismatched.append({
                        "archivePath": name,
                        "repositoryPath": "LICENSE.txt",
                        "archiveSha256": hashlib.sha256(jar_license).hexdigest(),
                        "repositorySha256": hashlib.sha256(license_bytes).hexdigest(),
                    })
                continue

            generated = (generated_sources or {}).get(name)
            if generated is not None:
                archive_bytes = jar.read(name)
                if archive_bytes == generated:
                    matched.append({"archivePath": name, "repositoryPath": "verified AndroidX generated source"})
                else:
                    mismatched.append({
                        "archivePath": name,
                        "repositoryPath": "verified AndroidX generated source",
                        "archiveSha256": hashlib.sha256(archive_bytes).hexdigest(),
                        "repositorySha256": hashlib.sha256(generated).hexdigest(),
                        "archiveSizeBytes": len(archive_bytes),
                        "repositorySizeBytes": len(generated),
                    })
                continue

            candidates = source_tree_candidates(name)
            repository_path = next((candidate for candidate in candidates if candidate in source_tree), None)
            if repository_path is None:
                missing.append({"archivePath": name, "repositoryCandidates": candidates})
                continue
            archive_bytes = jar.read(name)
            repository_bytes = source_tree[repository_path]
            if archive_bytes == repository_bytes:
                matched.append({"archivePath": name, "repositoryPath": repository_path})
            else:
                mismatched.append({
                    "archivePath": name,
                    "repositoryPath": repository_path,
                    "archiveSha256": hashlib.sha256(archive_bytes).hexdigest(),
                    "repositorySha256": hashlib.sha256(repository_bytes).hexdigest(),
                    "archiveSizeBytes": len(archive_bytes),
                    "repositorySizeBytes": len(repository_bytes),
                })

    return {
        "jarEntryCount": len(entries),
        "matchedFileCount": len(matched),
        "ignoredEntryCount": len(ignored),
        "missingEntries": missing,
        "mismatchedEntries": mismatched,
        "matchedFiles": matched,
        "ignoredEntries": ignored,
        "status": "verified-byte-for-byte" if not missing and not mismatched else "unverified",
    }


def verify_family(family: dict, archives_directory: Path, publication: dict, commit: str) -> dict:
    jar_name = f"{family['androidModule']}-1.12.1-sources.jar"
    jar_path = archives_directory / jar_name
    if not jar_path.is_file():
        raise FileNotFoundError(f"Missing verified Google Maven source archive: {jar_path}")

    jar_bytes = jar_path.read_bytes()
    digest = hashlib.sha256(jar_bytes).hexdigest()
    published_family = next(
        (item for item in publication["families"] if item["familyId"] == family["familyId"]),
        None,
    )
    if published_family is None:
        raise ValueError(f"Publication report is missing {family['familyId']}.")
    expected_archive = published_family["sourcesArchive"]
    if digest != expected_archive["sha256"] or len(jar_bytes) != expected_archive["sizeBytes"]:
        raise ValueError(f"{family['familyId']} source archive differs from the previously verified Google Maven publication.")

    source_tree = fetch_gitiles_archive(commit, family["modulePath"] + "/src")
    # AndroidX keeps the canonical Apache license at the repository root, not per module.
    license_path = "LICENSE.txt"
    license_url = f"{GITILES_BASE}/+/{commit}/{license_path}?format=TEXT"
    license_encoded = fetch_trusted_bytes(license_url, 1024 * 1024)
    license_bytes = base64.b64decode(b"".join(license_encoded.split()), validate=False)

    generated_sources = {}
    if family["familyId"] == GENERATED_PROGUARD_SOURCE["familyId"]:
        generator_url = f"{GITILES_BASE}/+/{commit}/{GENERATED_PROGUARD_SOURCE['generatorPath']}?format=TEXT"
        generator_encoded = fetch_trusted_bytes(generator_url, 1024 * 1024)
        generator_bytes = base64.b64decode(b"".join(generator_encoded.split()), validate=False)
        generator_blob = hashlib.sha1(
            b"blob " + str(len(generator_bytes)).encode("ascii") + b"\\0" + generator_bytes
        ).hexdigest()
        if generator_blob != GENERATED_PROGUARD_SOURCE["generatorGitBlobSha1"]:
            raise ValueError("AndroidX ProguardDetection generator differs from the pinned release source.")
        generated_sources[GENERATED_PROGUARD_SOURCE["archivePath"]] = generated_proguard_detection_source(
            GENERATED_PROGUARD_SOURCE["packageName"]
        )

    comparison = compare_source_archive(jar_bytes, source_tree, license_bytes, generated_sources)
    return {
        "familyId": family["familyId"],
        "androidModule": family["androidModule"],
        "modulePath": family["modulePath"],
        "releaseCommit": commit,
        "sourceArchive": {
            "fileName": jar_name,
            "sha256": digest,
            "sizeBytes": len(jar_bytes),
            "publishedUrl": expected_archive["url"],
        },
        "repositorySourceFileCount": len(source_tree),
        **comparison,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--archives-dir", required=True, type=Path)
    parser.add_argument("--publication-report", required=True, type=Path)
    parser.add_argument("--provenance-manifest", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    publication = json.loads(args.publication_report.read_text(encoding="utf-8"))
    manifest = json.loads(args.provenance_manifest.read_text(encoding="utf-8"))
    commit = manifest["releaseCommit"]
    results = []
    for family in FAMILIES:
        try:
            results.append(verify_family(family, args.archives_dir, publication, commit))
        except Exception as error:  # Preserve diagnostics for the CI artifact before failing closed.
            results.append({
                "familyId": family["familyId"],
                "releaseCommit": commit,
                "status": "error",
                "error": str(error),
            })
    report = {
        "schemaVersion": 1,
        "referenceVersion": manifest["referenceVersion"],
        "releaseCommit": commit,
        "status": "verified-byte-for-byte" if len(results) == len(FAMILIES) and all(item["status"] == "verified-byte-for-byte" for item in results) else "unverified",
        "families": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if report["status"] == "verified-byte-for-byte" else 1


if __name__ == "__main__":
    raise SystemExit(main())
