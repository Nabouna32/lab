import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const baseline = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material3-1.4.0.json", import.meta.url),
  "utf8",
));

test("Material 3 stable release API and published sources share one immutable commit", () => {
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

  const exactStableDump = baseline.apiDumpAlignment.exactStableDump;
  assert.equal(baseline.apiDumpAlignment.status, "VERIFIED");
  assert.equal(exactStableDump.repository, "androidx/androidx");
  assert.equal(exactStableDump.branch, "androidx-compose-material3-release");
  assert.equal(exactStableDump.commit, "5113b82a4ed6416d6344efa50e41db8cb65928ff");
  assert.equal(exactStableDump.path, "compose/material3/material3/api/current.txt");
  assert.equal(exactStableDump.gitBlobSha1, "fd45e9feea96a631c0f8b7ac82f88ee9ce999029");
  assert.equal(exactStableDump.signatureFormat, "4.0");
  assert.equal(baseline.apiDumpAlignment.repositorySourceCommit, exactStableDump.commit);
  assert.equal(baseline.publishedAndroidVariant.verification.sourceCommit.verifiedByteForByte, 249);
  assert.equal(baseline.publishedAndroidVariant.verification.sourceCommit.mismatchCount, 0);
  assert.match(baseline.apiDumpAlignment.reason, /807 source-level methods/);

  const stableApiDump = readFileSync(new URL(
    "../../../docs/material3/catalog/baselines/material3-1.4.0-api.txt",
    import.meta.url,
  ));
  const stableApiBlobSha1 = createHash("sha1")
    .update(Buffer.from("blob " + stableApiDump.length + "\\0"))
    .update(stableApiDump)
    .digest("hex");
  assert.equal(stableApiBlobSha1, exactStableDump.gitBlobSha1);
  assert.match(stableApiDump.toString("utf8").slice(0, 40), /Signature format: 4\\.0/);
});

const material3AndroidInventory = JSON.parse(readFileSync(
  new URL("../../../docs/material3/catalog/baselines/material3-android-1.4.0-api-inventory.json", import.meta.url),
  "utf8",
));

test("Material 3 Android derived inventory verifies every API declaration without claiming port parity", () => {
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
  assert.equal(material3AndroidInventory.interpretation.apiDumpAlignment, "VERIFIED");
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.apiClassCount, 232);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.binaryClassMatches, 232);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.apiMethodCount, 1802);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.sourceLevelMethodCount, 807);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.sourceLevelDescriptorMatches, 807);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.bytecodeOnlyDescriptorMatches, 995);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.constructorCount, 104);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.constructorDescriptorMatches, 104);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.kotlinOnlyConstructorCount, 34);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.kotlinOnlyConstructorMatches, 34);
  assert.ok(material3AndroidInventory.apiDumpBinaryComparison.sourceLevelBytecodeOnlyMatches > 0);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.fieldCount, 74);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.fieldDescriptorMatches, 74);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.propertyCount, 669);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.propertyAccessorMatches, 669);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.status, "exact-declarations-match");
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.missingClasses.length, 0);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.missingMembers.length, 0);
  assert.equal(material3AndroidInventory.apiDumpBinaryComparison.unsupportedSignatures.length, 0);
  assert.match(material3AndroidInventory.interpretation.declarationComparison, /995\/995 @BytecodeOnly descriptors match/);
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
  assert.equal(baseline.apiDumpAlignment.status, "VERIFIED");
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
