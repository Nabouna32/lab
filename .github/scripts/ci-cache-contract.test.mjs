import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(
  new URL("../workflows/ci.yml", import.meta.url),
  "utf8",
);
const surveillance = readFileSync(
  new URL("../workflows/surveillance.yml", import.meta.url),
  "utf8",
);
const accessibility = readFileSync(
  new URL("../workflows/audit-accessibilite.yml", import.meta.url),
  "utf8",
);
const nodeVersion = readFileSync(new URL("../../.nvmrc", import.meta.url), "utf8").trim();
const packageManifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const packageLock = JSON.parse(readFileSync(new URL("../../package-lock.json", import.meta.url), "utf8"));

function sectionFor(source, jobName) {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => line === "  " + jobName + ":");
  assert.notEqual(start, -1, "Missing workflow job: " + jobName);

  const next = lines.findIndex(
    (line, index) => index > start && /^  [a-zA-Z0-9_-]+:$/.test(line),
  );

  return lines.slice(start, next === -1 ? undefined : next).join("\n");
}

test("the preparation job sets up Node without restoring an unused npm cache", () => {
  const prepare = sectionFor(workflow, "prepare");
  assert.ok(prepare.includes("uses: actions/setup-node@"));
  assert.ok(prepare.includes("node-version-file: .nvmrc"));
  assert.ok(!prepare.includes("cache: npm"));
  assert.ok(!prepare.includes("cache-dependency-path:"));
});

test("quality and production build retain their npm dependency caches", () => {
  for (const jobName of ["quality", "build"]) {
    const job = sectionFor(workflow, jobName);
    assert.ok(job.includes("node-version-file: .nvmrc"));
    assert.ok(job.includes("cache: npm"));
    assert.ok(job.includes("cache-dependency-path: package-lock.json"));
    assert.ok(job.includes("run: npm ci"));
  }
});

test("the production build restores the Next.js build cache with bounded keys", () => {
  const build = sectionFor(workflow, "build");
  assert.ok(build.includes("uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0"));
  assert.ok(build.includes("path: .next/cache"));
  assert.ok(build.includes("runner.os"));
  assert.ok(build.includes("node-26.13.0"));
  assert.ok(build.includes("hashFiles('package-lock.json')"));
  assert.ok(build.includes("hashFiles('src/**/*.js'"));
  assert.ok(build.includes("restore-keys:"));
  assert.ok(build.includes("nextjs-node-26.13.0-${{ hashFiles('package-lock.json') }}-"));
});

test("the scheduled browser build can seed the shared main-branch Next.js cache", () => {
  const browser = sectionFor(surveillance, "tests-navigateur");
  assert.ok(browser.includes("uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0"));
  assert.ok(browser.includes("path: .next/cache"));
  assert.ok(browser.includes("restore-keys:"));
  assert.ok(browser.includes("run: npm run build"));
});

test("the npm audit job runs from the lockfile without installing node_modules", () => {
  const audit = sectionFor(surveillance, "audit-dependances");
  assert.ok(audit.includes("uses: actions/setup-node@"));
  assert.ok(audit.includes("node-version-file: .nvmrc"));
  assert.ok(audit.includes("run: node .github/scripts/run-npm-audit.mjs"));
  assert.ok(!audit.includes("cache: npm"));
  assert.ok(!audit.includes("cache-dependency-path:"));
  assert.ok(!audit.includes("run: npm ci"));
});

test("the browser surveillance job keeps its npm cache and dependency installation", () => {
  const browser = sectionFor(surveillance, "tests-navigateur");
  assert.ok(browser.includes("cache: npm"));
  assert.ok(browser.includes("cache-dependency-path: package-lock.json"));
  assert.ok(browser.includes("run: npm ci"));
});

test("manual dispatch defaults to full validation and offers an explicit build-only scope", () => {
  assert.ok(workflow.includes("  workflow_dispatch:\n    inputs:\n      scope:"));
  assert.ok(workflow.includes("        default: full"));
  assert.ok(workflow.includes("          - full\n          - build-only"));
});

test("build-only dispatch skips quality and Supabase while keeping production build enabled", () => {
  const quality = sectionFor(workflow, "quality");
  const build = sectionFor(workflow, "build");
  const functions = sectionFor(workflow, "supabase-functions");
  const database = sectionFor(workflow, "supabase-database");

  assert.ok(quality.includes("github.event_name != 'workflow_dispatch' || inputs.scope == 'full'"));
  assert.ok(functions.includes("github.event_name == 'workflow_dispatch' && inputs.scope == 'full'"));
  assert.ok(database.includes("github.event_name == 'workflow_dispatch' && inputs.scope == 'full'"));

  assert.ok(build.includes("github.event_name != 'pull_request'"));
  assert.ok(!build.includes("inputs.scope"));
});

test("pull request validation remains independent of the manual dispatch scope", () => {
  const quality = sectionFor(workflow, "quality");
  const functions = sectionFor(workflow, "supabase-functions");
  const database = sectionFor(workflow, "supabase-database");

  assert.ok(quality.includes("github.event_name != 'pull_request'"));
  assert.ok(functions.includes("github.event_name != 'workflow_dispatch' && needs.prepare.outputs.supabase_functions_changed == 'true'"));
  assert.ok(database.includes("github.event_name != 'workflow_dispatch' && needs.prepare.outputs.supabase_database_changed == 'true'"));
});

test("the project Node runtime version is pinned consistently", () => {
  assert.equal(nodeVersion, "26.13.0");
  assert.equal(packageManifest.engines.node, "26.x");
  assert.equal(packageLock.packages[""].engines.node, "26.x");
});

test("all project workflows consume the shared Node version without legacy pins", () => {
  for (const source of [workflow, surveillance, accessibility]) {
    const setupNodeSteps = source.match(/uses: actions\\/setup-node@/g) ?? [];
    const versionFileSteps = source.match(/node-version-file: \.nvmrc/g) ?? [];
    assert.equal(versionFileSteps.length, setupNodeSteps.length);
    assert.ok(!source.includes("node-version:"));
  }
});

test("the optional accessibility audit consumes the shared Node version", () => {
  const audit = sectionFor(accessibility, "audit");
  assert.ok(audit.includes("uses: actions/setup-node@"));
  assert.ok(audit.includes("node-version-file: .nvmrc"));
  assert.ok(!audit.includes("node-version: 24.21.0"));
});
