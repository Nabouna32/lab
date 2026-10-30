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
  const inspectedIds = inspection.families.map((family) => family.id).sort();
  const expectedInspectedIds = selected
    .filter((family) => family.id !== "material-components-views")
    .map((family) => family.id)
    .sort();

  assert.equal(inspection.families.length, 21);
  assert.deepEqual(inspectedIds, expectedInspectedIds);
  assert.equal(new Set(inspectedIds).size, inspection.families.length);
  assert.equal(inspection.scopeNote.includes("separate repository"), true);

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
  assert.equal(
    material3Baseline.apiDumpAlignment.status,
    "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_PINNED_BINARY_API_COMPARISON_PENDING",
  );
  assert.equal(
    material3Baseline.repositoryApiInspection.releaseBranchSnapshot.commit,
    "5113b82a4ed6416d6344efa50e41db8cb65928ff",
  );
  assert.equal(
    material3Baseline.repositoryApiInspection.releaseBranchSnapshot.libraryVersionMarker,
    'COMPOSE_MATERIAL3 = "1.4.0"',
  );
});
