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
  assert.ok(prepare.includes("node-version: 24.21.0"));
  assert.ok(!prepare.includes("cache: npm"));
  assert.ok(!prepare.includes("cache-dependency-path:"));
});

test("quality and production build retain their npm dependency caches", () => {
  for (const jobName of ["quality", "build"]) {
    const job = sectionFor(workflow, jobName);
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
  assert.ok(build.includes("node-24.21.0"));
  assert.ok(build.includes("hashFiles('package-lock.json')"));
  assert.ok(build.includes("hashFiles('src/**/*.js'"));
  assert.ok(build.includes("restore-keys:"));
  assert.ok(build.includes("nextjs-node-24.21.0-${{ hashFiles('package-lock.json') }}-"));
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
  assert.ok(audit.includes("node-version: 24.21.0"));
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
