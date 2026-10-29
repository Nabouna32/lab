import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const manifest = JSON.parse(readFileSync(
  new URL("../../docs/material3/catalog/baselines/material-components-views-1.14.0.json", import.meta.url),
  "utf8",
));
const report = JSON.parse(readFileSync(
  new URL("../../docs/material3/catalog/baselines/material-components-views-1.14.0-api-inventory.json", import.meta.url),
  "utf8",
));

test("MDC binary inventory is pinned to the official 1.14.0 Maven coordinate", () => {
  assert.equal(manifest.artifact, "com.google.android.material:material");
  assert.equal(manifest.referenceVersion, "1.14.0");
  assert.match(manifest.binaryArchive.url, /material-1\.14\.0\.aar$/);
  assert.equal(manifest.apiInventory.status, "provisional-not-exhaustive");
  assert.equal(manifest.apiInventory.publicApiDumpInTag, false);
  assert.equal(manifest.apiInventory.reportPath, "docs/material3/catalog/baselines/material-components-views-1.14.0-api-inventory.json");
});

test("MDC AAR provenance and generated index are pinned to verified Google Maven bytes", () => {
  assert.equal(manifest.binaryArchive.checksumStatus, "verified-against-google-maven-sidecars");
  assert.equal(manifest.binaryArchive.publishedSha256, "19e8fab43df6870f8e4322059624384be0279da56dc910529ff591dc674008cd");
  assert.equal(manifest.binaryArchive.publishedSha1, "b44cfc942dbe846c607aa50738e2bb1272796f8c");
  assert.equal(manifest.binaryArchive.sizeBytes, 2741429);
  assert.equal(report.status, "provisional-not-exhaustive");
  assert.equal(report.provenance.aarSha256, manifest.binaryArchive.publishedSha256);
  assert.equal(report.summary.binaryClassFiles, 1107);
  assert.equal(report.summary.publicOrProtectedTypes, 523);
  assert.equal(report.summary.publicOrProtectedMembers, 6012);
  assert.equal(report.summary.javapFailures, 0);
  assert.equal(report.summary.membersWithoutSourceAnnotationContextMatch, 525);
});
