import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://dl.google.com/dl/android/maven2/androidx/compose/material3";
const ALLOWED_HOSTS = new Set(["dl.google.com", "maven.google.com", "storage.googleapis.com"]);
const MAX_ARTIFACT_BYTES = 50 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 30_000;

export const RELEASE_ARTIFACTS = Object.freeze([
  {
    fileName: "material3-android-1.4.0-sources.jar",
    url: BASE + "/material3-android/1.4.0/material3-android-1.4.0-sources.jar",
    kind: "source-archive",
  },
  {
    fileName: "material3-android-1.4.0.aar",
    url: BASE + "/material3-android/1.4.0/material3-android-1.4.0.aar",
    kind: "android-binary",
  },
  {
    fileName: "material3-1.4.0.module",
    url: BASE + "/material3/1.4.0/material3-1.4.0.module",
    kind: "gradle-module-metadata",
    expectedModule: "material3",
  },
  {
    fileName: "material3-android-1.4.0.module",
    url: BASE + "/material3-android/1.4.0/material3-android-1.4.0.module",
    kind: "gradle-module-metadata",
    expectedModule: "material3-android",
  },
]);

function trustedUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(label + " must be a valid URL.");
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname) || url.username || url.password) {
    throw new Error(label + " must use HTTPS on an approved Google Maven host.");
  }
  return url;
}

async function readBoundedBody(response, label) {
  const length = Number(response.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_ARTIFACT_BYTES) {
    throw new Error(label + " exceeds the " + MAX_ARTIFACT_BYTES + "-byte safety limit.");
  }
  if (!response.body) throw new Error(label + " has no response body.");
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_ARTIFACT_BYTES) {
        await reader.cancel();
        throw new Error(label + " exceeds the " + MAX_ARTIFACT_BYTES + "-byte safety limit.");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

async function fetchTrustedBytes(value, label, fetchImpl) {
  let url = trustedUrl(value, label);
  for (let count = 0; count <= MAX_REDIRECTS; count += 1) {
    const response = await fetchImpl(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: "application/octet-stream, text/plain;q=0.9" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location) throw new Error(label + " returned a redirect without a Location header.");
      if (count === MAX_REDIRECTS) throw new Error(label + " exceeded the redirect limit.");
      url = trustedUrl(new URL(location, url).toString(), label + " redirect URL");
      continue;
    }
    if (!response.ok) throw new Error(label + " returned HTTP " + response.status + ".");
    return readBoundedBody(response, label);
  }
  throw new Error(label + " exceeded the redirect limit.");
}

function parsePublishedSha256(bytes, label) {
  const match = bytes.toString("utf8").trim().match(/^([a-f0-9]{64})(?:\s+.*)?$/i);
  if (!match) throw new Error(label + " does not contain one valid SHA-256 checksum.");
  return match[1].toLowerCase();
}

function hashes(bytes) {
  return {
    sha256: createHash("sha256").update(bytes).digest("hex"),
    gitBlobSha1: createHash("sha1")
      .update(Buffer.from("blob " + bytes.length + "\0"))
      .update(bytes)
      .digest("hex"),
    sizeBytes: bytes.length,
  };
}

function validateArtifactBytes(artifact, bytes) {
  if (artifact.kind === "gradle-module-metadata") {
    let metadata;
    try {
      metadata = JSON.parse(bytes.toString("utf8"));
    } catch {
      throw new Error(artifact.fileName + " is not valid JSON Gradle module metadata.");
    }
    const component = metadata.component;
    if (
      component?.group !== "androidx.compose.material3" ||
      component?.module !== artifact.expectedModule ||
      component?.version !== "1.4.0"
    ) {
      throw new Error(artifact.fileName + " declares an unexpected Gradle component identity: " + JSON.stringify(component ?? null));
    }
    return {
      component: component.group + ":" + component.module + ":" + component.version,
      variants: Array.isArray(metadata.variants) ? metadata.variants.length : 0,
    };
  }
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(artifact.fileName + " is not a ZIP/JAR/AAR archive.");
  }
  return { archiveSignature: "PK" };
}

export async function fetchMaterial3ReleaseArtifacts({
  outputDirectory,
  fetchImpl = fetch,
  artifacts = RELEASE_ARTIFACTS,
}) {
  if (typeof outputDirectory !== "string" || !outputDirectory.trim()) {
    throw new Error("outputDirectory is required.");
  }
  if (!Array.isArray(artifacts) || artifacts.length !== 4) {
    throw new Error("Exactly four pinned Material 3 release artifacts are required.");
  }
  await mkdir(outputDirectory, { recursive: true });
  const results = [];
  for (const artifact of artifacts) {
    const [bytes, checksumBytes] = await Promise.all([
      fetchTrustedBytes(artifact.url, artifact.fileName, fetchImpl),
      fetchTrustedBytes(artifact.url + ".sha256", artifact.fileName + " checksum", fetchImpl),
    ]);
    const publishedSha256 = parsePublishedSha256(checksumBytes, artifact.fileName + " checksum");
    const calculated = hashes(bytes);
    if (calculated.sha256 !== publishedSha256) {
      throw new Error(artifact.fileName + " does not match the published Google Maven SHA-256.");
    }
    const metadata = validateArtifactBytes(artifact, bytes);
    await writeFile(path.join(outputDirectory, artifact.fileName), bytes, { flag: "wx" });
    results.push({
      fileName: artifact.fileName,
      url: artifact.url,
      kind: artifact.kind,
      publishedSha256,
      ...calculated,
      ...metadata,
      status: "verified",
    });
  }
  const report = {
    schemaVersion: 1,
    artifact: "androidx.compose.material3:material3",
    referenceVersion: "1.4.0",
    source: "Google Maven published artifacts and SHA-256 sidecars",
    artifacts: results,
  };
  await writeFile(path.join(outputDirectory, "verification.json"), JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  return report;
}

async function main() {
  const outputDirectory = process.argv[2];
  if (!outputDirectory) {
    throw new Error("Usage: node .github/scripts/fetch-material3-release-artifacts.mjs <output-directory>");
  }
  const report = await fetchMaterial3ReleaseArtifacts({ outputDirectory });
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}

if (process.argv[1] && import.meta.url === new URL("file://" + process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write("Material 3 artifact retrieval failed: " + error.message + "\n");
    process.exitCode = 1;
  });
}
