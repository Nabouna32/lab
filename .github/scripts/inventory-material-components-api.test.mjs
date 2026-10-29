import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const manifest = JSON.parse(readFileSync(
  new URL("../../docs/material3/catalog/baselines/material-components-views-1.14.0.json", import.meta.url),
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
