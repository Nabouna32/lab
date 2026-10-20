import test from "node:test";
import assert from "node:assert/strict";
import { extractHighSeverityFindings, findIntroducedFindings } from "./dependency-audit-diff.mjs";

const report = (vulnerabilities) => ({ vulnerabilities });

test("ignores low and moderate advisories", () => {
  assert.deepEqual(
    [...extractHighSeverityFindings(report({
      low: { severity: "low", via: [{ url: "https://example.test/low" }] },
      moderate: { severity: "moderate", via: [{ url: "https://example.test/moderate" }] },
    }))],
    [],
  );
});

test("detects a newly introduced high advisory", () => {
  const base = report({});
  const head = report({
    "new-package": { severity: "high", via: [{ url: "https://github.com/advisories/GHSA-new" }] },
  });
  assert.deepEqual(findIntroducedFindings(base, head), [
    "new-package|high|https://github.com/advisories/GHSA-new",
  ]);
});

test("does not fail on a high advisory already present in the base lockfile", () => {
  const existing = report({
    braces: { severity: "high", via: [{ url: "https://github.com/advisories/GHSA-existing" }] },
  });
  assert.deepEqual(findIntroducedFindings(existing, existing), []);
});

test("detects severity increases and newly affected packages", () => {
  const base = report({
    "shared-package": { severity: "moderate", via: [{ url: "https://github.com/advisories/GHSA-shared" }] },
  });
  const head = report({
    "shared-package": { severity: "high", via: [{ url: "https://github.com/advisories/GHSA-shared" }] },
    "new-path-package": { severity: "high", via: [{ url: "https://github.com/advisories/GHSA-new-path" }] },
  });
  assert.deepEqual(findIntroducedFindings(base, head), [
    "new-path-package|high|https://github.com/advisories/GHSA-new-path",
    "shared-package|high|https://github.com/advisories/GHSA-shared",
  ]);
});

test("fails closed when the audit report is missing or invalid", () => {
  assert.throws(() => extractHighSeverityFindings(null), /no vulnerability report/);
  assert.throws(() => extractHighSeverityFindings({ error: { summary: "registry unavailable" } }), /no vulnerability report/);
  assert.throws(() => extractHighSeverityFindings({ vulnerabilities: {}, error: { summary: "registry unavailable" } }), /npm audit failed/);
});
