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
  assert.match(baseline.sourceArchive.checksumStatus, /not-rehashed/);

  assert.match(baseline.repositoryApiInspection.commit, /^[a-f0-9]{40}$/);
  assert.equal(baseline.repositoryApiInspection.stableDumpPresentAtPinnedCommit, false);
  assert.equal(baseline.repositoryApiInspection.nearestVersionedDump, "1.4.0-beta03.txt");
  assert.equal(baseline.repositoryApiInspection.watchDump.role, "watch-only");
  assert.equal(baseline.repositoryApiInspection.watchDump.sha256, watchManifest.source.sha256);
  assert.equal(baseline.repositoryApiInspection.watchDump.path, watchManifest.source.path);
  assert.equal(baseline.repositoryApiInspection.commit, watchManifest.source.commit);

  assert.equal(baseline.apiDumpAlignment.status, "UNVERIFIED");
  assert.equal(baseline.apiDumpAlignment.exactStableDump, null);
  assert.equal(baseline.apiDumpAlignment.repositorySourceCommit, null);
  assert.match(baseline.apiDumpAlignment.reason, /not been established/);
});
