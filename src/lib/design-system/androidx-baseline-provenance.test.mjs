import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const baseline = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material3-1.4.0.json", import.meta.url),
  "utf8",
));
const watchManifest = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/watch/androidx-main-2026-10-22/manifest.json", import.meta.url),
  "utf8",
));

test("Material 3 stable source provenance is pinned without overstating API alignment", () => {
  assert.equal(baseline.schemaVersion, 1);
  assert.equal(baseline.artifact, "androidx.compose.material3:material3");
  assert.equal(baseline.referenceVersion, "1.4.0");
  assert.equal(baseline.release.status, "stable");
  assert.equal(baseline.release.releaseDate, "2025-09-24");
  assert.match(baseline.release.releaseNotesUrl, /^https:\/\/developer\.android\.com\//);

  assert.match(baseline.sourceArchive.url, /material3-1\.4\.0-sources\.jar$/);
  assert.match(baseline.sourceArchive.checksumUrl, /material3-1\.4\.0-sources\.jar\.sha256$/);
  assert.match(baseline.sourceArchive.gitilesBlobId, /^[a-f0-9]{40}$/);
  assert.match(baseline.sourceArchive.publishedSha256, /^[a-f0-9]{64}$/);
  assert.equal(baseline.sourceArchive.checksumStatus, "verified-against-downloaded-archive");
  assert.equal(baseline.sourceArchive.verification.result, "passed");
  assert.match(baseline.sourceArchive.verification.verifiedCommit, /^[a-f0-9]{40}$/);
  assert.match(baseline.sourceArchive.verification.workflowRun, /^https:\/\/github\.com\/Nabouna32\/lab\/actions\/runs\/\d+$/);

  assert.match(baseline.repositoryApiInspection.commit, /^[a-f0-9]{40}$/);
  assert.equal(baseline.repositoryApiInspection.stableDumpPresentAtPinnedCommit, false);
  assert.equal(baseline.repositoryApiInspection.lastPreReleaseDumpForReferenceVersion.path, "1.4.0-beta03.txt");
  assert.equal(baseline.repositoryApiInspection.latestVersionedDumpAtPinnedCommit.path, "1.5.0-beta01.txt");
  assert.match(baseline.repositoryApiInspection.latestVersionedDumpAtPinnedCommit.gitBlobSha, /^[a-f0-9]{40}$/);
  assert.equal(baseline.repositoryApiInspection.watchDump.role, "watch-only");
  assert.equal(baseline.repositoryApiInspection.watchDump.sha256, watchManifest.source.sha256);
  assert.equal(baseline.repositoryApiInspection.watchDump.path, watchManifest.source.path);
  assert.equal(baseline.repositoryApiInspection.commit, watchManifest.source.commit);

  assert.equal(baseline.apiDumpAlignment.status, "UNVERIFIED");
  assert.equal(baseline.apiDumpAlignment.exactStableDump, null);
  assert.equal(baseline.apiDumpAlignment.repositorySourceCommit, null);
  assert.match(baseline.apiDumpAlignment.reason, /not been established/);
});

const materialComponentsBaseline = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material-components-views-1.14.0.json", import.meta.url),
  "utf8",
));

test("Material Components Views source archive provenance is verified and pinned separately", () => {
  assert.equal(materialComponentsBaseline.artifact, "com.google.android.material:material");
  assert.equal(materialComponentsBaseline.referenceVersion, "1.14.0");
  assert.equal(materialComponentsBaseline.sourceRepository.commit, "66c334b7946dabf33adfe1a2b7cad6bcaa4ea3ad");
  assert.equal(materialComponentsBaseline.sourceArchive.checksumStatus, "verified-against-google-maven-sidecar");
  assert.equal(materialComponentsBaseline.sourceArchive.publishedSha256, "fde0310c43bdc6a30a12b6e288113b123769ee78de0327df559d992c26974067");
  assert.equal(materialComponentsBaseline.sourceArchive.publishedSha1, "b619b8afcf9744457ff2e54e70608cb46be12910");
  assert.equal(materialComponentsBaseline.sourceArchive.gitBlobSha1, "02ca28f3426728ed7b02f89c6d5f1973e9e711d7");
  assert.equal(materialComponentsBaseline.sourceArchive.sizeBytes, 1361931);
  assert.equal(materialComponentsBaseline.sourceArchive.verification.result, "passed");
  assert.equal(materialComponentsBaseline.apiInventory.status, "not-started");
});
