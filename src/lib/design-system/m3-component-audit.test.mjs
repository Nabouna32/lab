import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const registry = readFileSync(new URL("./m3-component-audit.ts", import.meta.url), "utf8");
const workbench = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentAuditWorkbench.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../../app/[locale]/design-lab/audit/page.tsx", import.meta.url), "utf8");

test("The component audit registry defaults every catalog entry to unverified", () => {
  assert.match(registry, /status: "unverified"/);
  assert.match(registry, /verification: \["not-started"\]/);
  assert.match(registry, /implementationType: "unclassified"/);
  assert.match(registry, /productionUsage: "unknown"/);
  assert.match(registry, /sourceFiles: \[\]/);
  assert.match(registry, /officialReferences: \[\]/);
  assert.match(registry, /confirmedDiscrepancies: \[\]/);
  assert.match(registry, /conformant-within-verified-scope/);
  assert.match(registry, /Historical leads from the previous Markdown audit/);
});

test("The workbench distinguishes historical leads from current verified evidence", () => {
  assert.match(workbench, /historicalAuditLeads/);
  assert.match(workbench, /Never proves conformance|never proves conformance/i);
  assert.match(workbench, /t\.verificationEmpty/);
  assert.match(workbench, /t\.discrepanciesEmpty/);
  assert.match(workbench, /t\.sourcesEmpty/);
  assert.match(workbench, /t\.refsEmpty/);
  assert.match(route, /isLocale\(locale\)/);
  assert.match(route, /robots: \{ index: false, follow: false/);
});

test("The registry includes separate component entries for the current core button family", () => {
  for (const name of ["Button", "ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton", "IconButton"]) {
    assert.ok(registry.includes(`"${name}"`), `Missing component inventory entry: ${name}`);
  }
});
