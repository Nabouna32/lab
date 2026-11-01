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
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `  ${jobName}:`);
  assert.notEqual(start, -1, `Missing workflow job: ${jobName}`);

  const next = lines.findIndex(
    (line, index) => index > start && /^  [a-zA-Z0-9_-]+:$/.test(line),
  );

  return lines.slice(start, next === -1 ? undefined : next).join("\n");
}

test("the preparation job sets up Node without restoring an unused npm cache", () => {
  const prepare = sectionFor(workflow, "prepare");
  assert.match(prepare, /uses: actions\/setup-node@/);
  assert.match(prepare, /node-version: 24\.21\.0/);
  assert.doesNotMatch(prepare, /cache: npm|cache-dependency-path:/);
});

test("quality and production build retain their npm dependency caches", () => {
  for (const jobName of ["quality", "build"]) {
    const job = sectionFor(workflow, jobName);
    assert.match(job, /cache: npm/);
    assert.match(job, /cache-dependency-path: package-lock\.json/);
    assert.match(job, /run: npm ci/);
  }
});

test("the production build restores the Next.js build cache with bounded keys", () => {
  const build = sectionFor(workflow, "build");
  assert.match(
    build,
    /uses: actions\/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6\.1\.0/,
  );
  assert.match(build, /path: \.next\/cache/);
  assert.match(build, /runner\.os/);
  assert.match(build, /node-24\.21\.0/);
  assert.match(build, /hashFiles\('package-lock\.json'\)/);
  assert.match(build, /hashFiles\('src\/\*\*\/\.js'/);
  assert.match(build, /restore-keys:/);
  assert.match(build, /nextjs-node-24\.21\.0-\$\{\{ hashFiles\('package-lock\.json'\) \}\}-/);
});

test("the npm audit job runs from the lockfile without installing node_modules", () => {
  const audit = sectionFor(surveillance, "audit-dependances");
  assert.match(audit, /uses: actions\/setup-node@/);
  assert.match(audit, /node-version: 24\.21\.0/);
  assert.match(audit, /run: node \.github\/scripts\/run-npm-audit\.mjs/);
  assert.doesNotMatch(audit, /cache: npm|cache-dependency-path:|run: npm ci/);
});

test("the browser surveillance job keeps its npm cache and dependency installation", () => {
  const browser = sectionFor(surveillance, "tests-navigateur");
  assert.match(browser, /cache: npm/);
  assert.match(browser, /cache-dependency-path: package-lock\.json/);
  assert.match(browser, /run: npm ci/);
});
