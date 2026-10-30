import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  fetchMaterial3ReleaseArtifacts,
  RELEASE_ARTIFACTS,
} from "./fetch-material3-release-artifacts.mjs";

const zipBytes = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00]);
const moduleBytes = (name, url) => Buffer.from(JSON.stringify({
  formatVersion: "1.1",
  component: {
    ...(url ? { url } : {}),
    group: "androidx.compose.material3",
    module: name,
    version: "1.4.0",
  },
  variants: [],
}));
const fixtureBytes = new Map([
  [RELEASE_ARTIFACTS[0].fileName, zipBytes],
  [RELEASE_ARTIFACTS[1].fileName, zipBytes],
  [RELEASE_ARTIFACTS[2].fileName, moduleBytes("material3")],
  [RELEASE_ARTIFACTS[3].fileName, moduleBytes("material3", "../../material3/1.4.0/material3-1.4.0.module")],
]);

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function fixtureFetch({ tamperChecksumFor, replaceBytesFor } = {}) {
  return async (url) => {
    const fileName = url.pathname.split("/").at(-1).replace(/\.sha256$/, "");
    let bytes = fixtureBytes.get(fileName);
    if (!bytes) return new Response("not found", { status: 404 });
    if (replaceBytesFor === fileName) bytes = Buffer.from("not-an-archive");
    if (url.pathname.endsWith(".sha256")) {
      const digest = tamperChecksumFor === fileName ? "0".repeat(64) : sha256(bytes);
      return new Response(digest + "  " + fileName + "\n", { status: 200 });
    }
    return new Response(bytes, { status: 200 });
  };
}

async function withTempDirectory(run) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "material3-artifacts-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("downloads the four pinned artifacts and verifies their published SHA-256 sidecars", async () => {
  await withTempDirectory(async (outputDirectory) => {
    const report = await fetchMaterial3ReleaseArtifacts({
      outputDirectory,
      fetchImpl: fixtureFetch(),
    });
    assert.equal(report.artifacts.length, 4);
    assert.ok(report.artifacts.every((artifact) => artifact.status === "verified"));
    assert.equal(report.artifacts[2].component, "androidx.compose.material3:material3:1.4.0");
    assert.equal(report.artifacts[3].component, "androidx.compose.material3:material3:1.4.0");
    assert.equal(report.artifacts[3].metadataUrl, "../../material3/1.4.0/material3-1.4.0.module");
    const files = await readdir(outputDirectory);
    assert.equal(files.length, 5);
    assert.ok(files.includes("verification.json"));
    const saved = await readFile(path.join(outputDirectory, RELEASE_ARTIFACTS[0].fileName));
    assert.deepEqual(saved, zipBytes);
  });
});

test("rejects a binary that does not match the published checksum", async () => {
  await withTempDirectory(async (outputDirectory) => {
    await assert.rejects(
      fetchMaterial3ReleaseArtifacts({
        outputDirectory,
        fetchImpl: fixtureFetch({ tamperChecksumFor: RELEASE_ARTIFACTS[1].fileName }),
      }),
      /does not match the published Google Maven SHA-256/,
    );
  });
});

test("rejects an archive that is not a ZIP/JAR/AAR", async () => {
  await withTempDirectory(async (outputDirectory) => {
    await assert.rejects(
      fetchMaterial3ReleaseArtifacts({
        outputDirectory,
        fetchImpl: fixtureFetch({ replaceBytesFor: RELEASE_ARTIFACTS[0].fileName }),
      }),
      /is not a ZIP\/JAR\/AAR archive/,
    );
  });
});

test("rejects Gradle metadata for a different artifact or version", async () => {
  await withTempDirectory(async (outputDirectory) => {
    const invalidArtifacts = RELEASE_ARTIFACTS.map((artifact) => ({ ...artifact }));
    invalidArtifacts[2] = {
      ...invalidArtifacts[2],
      expectedModule: "different-module",
    };
    await assert.rejects(
      fetchMaterial3ReleaseArtifacts({
        outputDirectory,
        fetchImpl: fixtureFetch(),
        artifacts: invalidArtifacts,
      }),
      /unexpected Gradle component identity/,
    );
  });
});

test("rejects an untrusted artifact host before requesting it", async () => {
  await withTempDirectory(async (outputDirectory) => {
    const invalidArtifacts = RELEASE_ARTIFACTS.map((artifact) => ({ ...artifact }));
    invalidArtifacts[0] = {
      ...invalidArtifacts[0],
      url: "https://example.com/material3-android-1.4.0-sources.jar",
    };
    const requestedHosts = [];
    await assert.rejects(
      fetchMaterial3ReleaseArtifacts({
        outputDirectory,
        fetchImpl: async (url) => {
          requestedHosts.push(url.hostname);
          return new Response("unexpected");
        },
        artifacts: invalidArtifacts,
      }),
      /approved Google Maven host/,
    );
    assert.equal(requestedHosts.includes("example.com"), false);
  });
});

test("rejects redirects to untrusted hosts before requesting the destination", async () => {
  await withTempDirectory(async (outputDirectory) => {
    const requestedHosts = [];
    await assert.rejects(
      fetchMaterial3ReleaseArtifacts({
        outputDirectory,
        fetchImpl: async (url) => {
          requestedHosts.push(url.hostname);
          if (url.pathname.endsWith(".sha256")) {
            return new Response("0".repeat(64) + "\n", { status: 200 });
          }
          return new Response(null, {
            status: 302,
            headers: { location: "https://example.com/redirected-artifact.jar" },
          });
        },
      }),
      /approved Google Maven host/,
    );
    assert.equal(requestedHosts.includes("example.com"), false);
  });
});
