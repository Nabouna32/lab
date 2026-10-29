import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const familyCatalog = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/families.json", import.meta.url),
  "utf8",
));
const inspection = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/repository-api-inspection-5901d750.json", import.meta.url),
  "utf8",
));
const material3Baseline = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material3-1.4.0.json", import.meta.url),
  "utf8",
));

test("pinned API-directory inspection covers every selected stable baseline", () => {
  const selected = familyCatalog.families.filter(
    (family) => family.referenceVersionStatus === "selected-official-stable",
  );

  assert.equal(inspection.repository, "androidx/androidx");
  assert.match(inspection.commit, /^[a-f0-9]{40}$/);
  assert.ok(inspection.families.length > 0);
  assert.ok(inspection.families.length <= selected.length);
  assert.equal(new Set(inspection.families.map((family) => family.id)).size, inspection.families.length);

  for (const record of inspection.families) {
    const family = selected.find((candidate) => candidate.id === record.id);
    assert.ok(family, "inspection must map to a selected family: " + record.id);
    assert.equal(record.artifact, family.artifact);
    assert.equal(record.referenceVersion, family.referenceVersion);
    assert.equal(record.exactStableDumpPresentAtPinnedCommit, false);
    assert.equal(record.exactStableDumpPath, null);

    assert.match(record.latestVersionedDump.gitBlobSha, /^[a-f0-9]{40}$/);
    assert.match(record.currentDump.gitBlobSha, /^[a-f0-9]{40}$/);
    assert.equal(
      record.latestVersionedDump.url,
      `https://github.com/androidx/androidx/blob/${inspection.commit}/${record.latestVersionedDump.path}`,
    );
    assert.equal(
      record.currentDump.url,
      `https://github.com/androidx/androidx/blob/${inspection.commit}/${record.currentDump.path}`,
    );
    assert.ok(record.currentDump.path.endsWith("/current.txt"));
  }
});

test("Material 3 stable and watch manifests remain separate and consistent", () => {
  const material3 = inspection.families.find(
    (family) => family.id === "compose-material3-mobile",
  );

  assert.ok(material3);
  assert.equal(material3.referenceVersion, material3Baseline.referenceVersion);
  assert.equal(
    material3.latestVersionedDump.gitBlobSha,
    material3Baseline.repositoryApiInspection.latestVersionedDumpAtPinnedCommit.gitBlobSha,
  );
  assert.equal(
    material3.currentDump.path,
    material3Baseline.repositoryApiInspection.watchDump.path,
  );
  assert.equal(
    material3Baseline.repositoryApiInspection.watchDump.role,
    "watch-only",
  );
  assert.equal(material3Baseline.apiDumpAlignment.status, "UNVERIFIED");
});
