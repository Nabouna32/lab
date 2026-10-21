import test from "node:test";
import assert from "node:assert/strict";
import { classifyDependencyDiff } from "./classify-dependency-diff.mjs";

const baseManifest = {
  name: "loculary",
  scripts: { lint: "eslint", test: "node --test" },
  dependencies: { appdep: "1.0.0" },
  devDependencies: { eslint: "9.0.0", "eslint-config-next": "1.0.0", typescript: "1.0.0" },
};
const headManifest = structuredClone(baseManifest);
headManifest.devDependencies.eslint = "10.0.0";

function makeLock(eslintVersion, coreVersion = "1.0.0", typescriptVersion = "1.0.0") {
  return {
    name: "loculary",
    version: "0.1.0",
    lockfileVersion: 3,
    requires: true,
    packages: {
      "": {
        name: "loculary",
        version: "0.1.0",
        dependencies: { appdep: "1.0.0" },
        devDependencies: { eslint: eslintVersion, "eslint-config-next": "1.0.0", typescript: "1.0.0" },
      },
      "node_modules/appdep": { version: "1.0.0" },
      "node_modules/eslint": { version: eslintVersion, dependencies: { "@eslint/core": coreVersion } },
      "node_modules/@eslint/core": { version: coreVersion },
      "node_modules/eslint-config-next": { version: "1.0.0", dependencies: { "@eslint/core": coreVersion } },
      "node_modules/typescript": { version: typescriptVersion },
    },
  };
}
const baseLock = makeLock("9.0.0");
const headLock = makeLock("10.0.0", "2.0.0");

test("allows an isolated ESLint upgrade when every changed lock entry belongs only to lint tooling", () => {
  assert.equal(classifyDependencyDiff(baseManifest, headManifest, baseLock, headLock, true), "lint_only");
});

test("falls back to full CI when dependency manifests are not the only changed files", () => {
  assert.equal(classifyDependencyDiff(baseManifest, headManifest, baseLock, headLock, false), "full");
});

test("falls back to full CI when another direct dependency changes too", () => {
  const manifest = structuredClone(headManifest);
  manifest.dependencies.appdep = "2.0.0";
  assert.equal(classifyDependencyDiff(baseManifest, manifest, baseLock, headLock, true), "full");
});

test("falls back to full CI when package metadata or scripts change", () => {
  const manifest = structuredClone(headManifest);
  manifest.scripts.lint = "eslint --max-warnings=0";
  assert.equal(classifyDependencyDiff(baseManifest, manifest, baseLock, headLock, true), "full");
});

test("falls back to full CI when ESLint is added or removed rather than upgraded", () => {
  const removed = structuredClone(baseManifest);
  delete removed.devDependencies.eslint;
  assert.equal(classifyDependencyDiff(baseManifest, removed, baseLock, headLock, true), "full");

  const addedBase = structuredClone(baseManifest);
  delete addedBase.devDependencies.eslint;
  const addedLock = makeLock(undefined);
  assert.equal(classifyDependencyDiff(addedBase, baseManifest, addedLock, baseLock, true), "full");
});

test("falls back to full CI when lockfile changes escape the lint dependency graph", () => {
  const unrelatedLock = makeLock("10.0.0", "2.0.0", "1.1.0");
  assert.equal(classifyDependencyDiff(baseManifest, headManifest, baseLock, unrelatedLock, true), "full");
});

test("falls back to full CI when the lockfile root does not match the manifest", () => {
  const mismatchedLock = structuredClone(headLock);
  mismatchedLock.packages[""].devDependencies.eslint = "9.0.0";
  assert.equal(classifyDependencyDiff(baseManifest, headManifest, baseLock, mismatchedLock, true), "full");
});

test("falls back to full CI when the lockfile or manifest diff is unchanged or ambiguous", () => {
  assert.equal(classifyDependencyDiff(baseManifest, baseManifest, baseLock, baseLock, true), "full");
  assert.equal(classifyDependencyDiff(baseManifest, headManifest, baseLock, headLock, false), "full");
});
