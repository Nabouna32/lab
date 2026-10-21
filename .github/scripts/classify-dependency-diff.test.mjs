import test from "node:test";
import assert from "node:assert/strict";
import { classifyDependencyDiff } from "./classify-dependency-diff.mjs";

const base = {
  name: "loculary",
  scripts: { lint: "eslint", test: "node --test" },
  dependencies: { next: "16.4.2", react: "19.3.1" },
  devDependencies: { eslint: "9.39.5", typescript: "~6.0.3", "@playwright/test": "1.64.1" },
};

test("allows the targeted lint path only for an isolated ESLint manifest update", () => {
  const head = structuredClone(base);
  head.devDependencies.eslint = "10.13.0";
  assert.equal(classifyDependencyDiff(base, head, true), "lint_only");
});

test("falls back to full CI when dependency manifests are not the only changed files", () => {
  const head = structuredClone(base);
  head.devDependencies.eslint = "10.13.0";
  assert.equal(classifyDependencyDiff(base, head, false), "full");
});

test("falls back to full CI when another dependency changes too", () => {
  const head = structuredClone(base);
  head.devDependencies.eslint = "10.13.0";
  head.dependencies.next = "16.4.3";
  assert.equal(classifyDependencyDiff(base, head, true), "full");
});

test("falls back to full CI when package metadata or scripts change", () => {
  const head = structuredClone(base);
  head.devDependencies.eslint = "10.13.0";
  head.scripts.lint = "eslint --max-warnings=0";
  assert.equal(classifyDependencyDiff(base, head, true), "full");
});

test("falls back to full CI when ESLint is added or removed rather than upgraded", () => {
  const head = structuredClone(base);
  delete head.devDependencies.eslint;
  assert.equal(classifyDependencyDiff(base, head, true), "full");
  assert.equal(classifyDependencyDiff(base, { ...base, devDependencies: { typescript: "~6.0.3" } }, true), "full");
});

test("falls back to full CI when the lockfile or manifest diff is ambiguous", () => {
  const head = structuredClone(base);
  head.devDependencies.eslint = "10.13.0";
  assert.equal(classifyDependencyDiff(base, head, false), "full");
  assert.equal(classifyDependencyDiff(base, base, true), "full");
});
