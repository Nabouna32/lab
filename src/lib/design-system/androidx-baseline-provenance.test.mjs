import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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

  const releaseSnapshot = baseline.repositoryApiInspection.releaseBranchSnapshot;
  assert.equal(releaseSnapshot.repository, "androidx/androidx");
  assert.equal(releaseSnapshot.branch, "androidx-compose-material3-release");
  assert.equal(releaseSnapshot.commit, "5113b82a4ed6416d6344efa50e41db8cb65928ff");
  assert.equal(releaseSnapshot.libraryVersionMarker, 'COMPOSE_MATERIAL3 = "1.4.0"');
  assert.equal(releaseSnapshot.apiDumpPath, "compose/material3/material3/api/current.txt");
  assert.equal(releaseSnapshot.apiDumpGitBlobSha1, "fd45e9feea96a631c0f8b7ac82f88ee9ce999029");
  assert.equal(releaseSnapshot.identicalToLastVersionedPrereleaseDump.gitBlobSha1, releaseSnapshot.apiDumpGitBlobSha1);

  const stableApiDump = readFileSync(new URL(
    "../../../docs/material3/catalog/baselines/material3-1.4.0-api.txt",
    import.meta.url,
  ));
  const stableApiBlobSha1 = createHash("sha1")
    .update(Buffer.from("blob " + stableApiDump.length + "\0"))
    .update(stableApiDump)
    .digest("hex");
  assert.equal(stableApiBlobSha1, releaseSnapshot.apiDumpGitBlobSha1);
  assert.match(stableApiDump.toString("utf8").slice(0, 40), /Signature format: 4\.0/);

  assert.equal(baseline.apiDumpAlignment.status, "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_VERIFIED_METHODS_MATCH_OTHER_API_DECLARATIONS_PENDING");
  assert.equal(baseline.apiDumpAlignment.exactStableDump.path, "compose/material3/material3/api/current.txt");
  assert.equal(baseline.apiDumpAlignment.exactStableDump.commit, releaseSnapshot.commit);
  assert.equal(baseline.apiDumpAlignment.repositorySourceCommit, releaseSnapshot.commit);
  assert.equal(baseline.publishedAndroidVariant.verification.sourceCommit.verifiedByteForByte, 249);
  assert.equal(baseline.publishedAndroidVariant.verification.sourceCommit.mismatchCount, 0);
  assert.match(baseline.apiDumpAlignment.reason, /Exact descriptors for source-level methods, constructors, fields and properties are not yet independently compared/);
});

const material3AndroidInventory = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material3-android-1.4.0-api-inventory.json", import.meta.url),
  "utf8",
));

test("Material 3 Android derived inventory is reproducible and does not claim Kotlin API parity", () => {
  assert.equal(material3AndroidInventory.schemaVersion, 1);
  assert.equal(material3AndroidInventory.artifact, "androidx.compose.material3:material3-android");
  assert.equal(material3AndroidInventory.referenceVersion, "1.4.0");
  assert.equal(material3AndroidInventory.sourceArchive.kotlinSourceFiles, 249);
  assert.deepEqual(material3AndroidInventory.sourceArchive.sourceFilesBySet, {
    androidMain: 25,
    commonMain: 218,
    jvmMain: 6,
  });
  assert.equal(material3AndroidInventory.androidAar.classFiles, 1367);
  assert.equal(material3AndroidInventory.androidAar.publicJvmClasses, 633);
  assert.equal(material3AndroidInventory.androidAar.publicProtectedJvmFields, 892);
  assert.equal(material3AndroidInventory.androidAar.publicProtectedJvmMethods, 8360);
  assert.equal(material3AndroidInventory.androidAar.classFilesMappedToPublishedSourceFile, 1353);
  assert.equal(material3AndroidInventory.androidAar.classFilesWithoutSourceFileMatch.length, 14);
  assert.equal(material3AndroidInventory.gradleModuleMetadata.common.variantCount, 12);
  assert.equal(material3AndroidInventory.gradleModuleMetadata.android.component.module, "material3");
  assert.equal(material3AndroidInventory.interpretation.apiDumpAlignment, "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_VERIFIED_METHODS_MATCH_OTHER_API_DECLARATIONS_PENDING");
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.apiClassCount, 232);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.binaryClassMatches, 232);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.apiMethodCount, 1802);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.sourceLevelNameMatches, 807);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.bytecodeOnlyDescriptorMatches, 995);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.missingClasses.length, 0);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.missingMethods.length, 0);
  assert.match(material3AndroidInventory.interpretation.methodSurfaceComparison, /995\/995 @BytecodeOnly JVM descriptors match exactly/);
  assert.equal(material3AndroidInventory.officialApiDump.commit, "5113b82a4ed6416d6344efa50e41db8cb65928ff");
  assert.equal(material3AndroidInventory.officialApiDump.gitBlobSha1, "fd45e9feea96a631c0f8b7ac82f88ee9ce999029");
  assert.equal(material3AndroidInventory.officialApiDump.libraryVersionMarker, 'COMPOSE_MATERIAL3 = "1.4.0"');
  assert.equal(material3AndroidInventory.sourceRepositoryCommit.commit, "5113b82a4ed6416d6344efa50e41db8cb65928ff");
  assert.equal(material3AndroidInventory.sourceRepositoryCommit.totalKotlinSourceFiles, 249);
  assert.equal(material3AndroidInventory.sourceRepositoryCommit.verifiedByteForByte, 249);
  assert.equal(material3AndroidInventory.sourceRepositoryCommit.mismatchCount, 0);
  assert.match(material3AndroidInventory.interpretation.binarySurface, /not a Kotlin public API dump/);
  assert.match(material3AndroidInventory.interpretation.sourceMapping, /does not prove declaration-level API equivalence/);
});

const materialComponentsBaseline = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material-components-views-1.14.0.json", import.meta.url),
  "utf8",
));

test("Material 3 Android release artifacts are independently pinned without claiming API parity", () => {
  const android = baseline.publishedAndroidVariant;
  assert.equal(android.artifact, "androidx.compose.material3:material3-android");
  assert.equal(android.referenceVersion, "1.4.0");
  assert.match(android.sourceArchive.url, /material3-android-1\.4\.0-sources\.jar$/);
  assert.match(android.sourceArchive.publishedSha256, /^[a-f0-9]{64}$/);
  assert.match(android.sourceArchive.gitBlobSha1, /^[a-f0-9]{40}$/);
  assert.equal(android.sourceArchive.sizeBytes, 703105);
  assert.equal(android.sourceArchive.checksumStatus, "verified-against-google-maven-sidecar");
  assert.match(android.aar.url, /material3-android-1\.4\.0\.aar$/);
  assert.match(android.aar.publishedSha256, /^[a-f0-9]{64}$/);
  assert.match(android.aar.gitBlobSha1, /^[a-f0-9]{40}$/);
  assert.equal(android.aar.sizeBytes, 5167765);
  assert.equal(android.aar.checksumStatus, "verified-against-google-maven-sidecar");
  assert.equal(android.moduleMetadata.common.component, "androidx.compose.material3:material3:1.4.0");
  assert.equal(android.moduleMetadata.common.variantCount, 12);
  assert.equal(android.moduleMetadata.android.component, "androidx.compose.material3:material3:1.4.0");
  assert.equal(android.moduleMetadata.android.variantCount, 3);
  assert.equal(android.moduleMetadata.android.componentRedirect, "../../material3/1.4.0/material3-1.4.0.module");
  assert.equal(android.verification.result, "passed");
  assert.match(android.verification.workflowRun, /^https:\/\/github\.com\/Nabouna32\/lab\/actions\/runs\/\d+$/);
  assert.match(android.verification.verifiedCommit, /^[a-f0-9]{40}$/);
  assert.match(android.verification.artifactUrl, /^https:\/\/github\.com\/Nabouna32\/lab\/actions\/runs\/\d+\/artifacts\/\d+$/);
  assert.equal(baseline.apiDumpAlignment.status, "OFFICIAL_STABLE_DUMP_AND_SOURCE_COMMIT_VERIFIED_METHODS_MATCH_OTHER_API_DECLARATIONS_PENDING");
});

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
  assert.equal(materialComponentsBaseline.apiInventory.status, "provisional-not-exhaustive");
  assert.equal(materialComponentsBaseline.apiInventory.reportPath, "docs/material3/catalog/baselines/material-components-views-1.14.0-api-inventory.json");
});
