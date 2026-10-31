import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflowPath = new URL("../workflows/ci.yml", import.meta.url);
const surveillancePath = new URL("../workflows/surveillance.yml", import.meta.url);
const codeqlPath = new URL("../workflows/codeql.yml", import.meta.url);
const navigationCssPath = new URL("../../src/components/layout/AdaptiveAppNavigation.module.css", import.meta.url);
const workflow = readFileSync(workflowPath, "utf8");
const surveillance = readFileSync(surveillancePath, "utf8");
const codeql = readFileSync(codeqlPath, "utf8");
const navigationCss = readFileSync(navigationCssPath, "utf8");

function sectionFor(source, jobName) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `  ${jobName}:`);
  assert.notEqual(start, -1, `Missing workflow job: ${jobName}`);

  const next = lines.findIndex(
    (line, index) => index > start && /^  [a-zA-Z0-9_-]+:$/.test(line),
  );

  return lines.slice(start, next === -1 ? undefined : next).join("\n");
}

test("the PR workflow keeps the fast validation path separate from surveillance", () => {
  const triggers = workflow.slice(0, workflow.indexOf("\njobs:"));
  assert.match(triggers, /^  pull_request:/m);
  assert.match(triggers, /^  workflow_dispatch:/m);
  assert.doesNotMatch(triggers, /^  schedule:/m);
  assert.doesNotMatch(workflow, /^  npm-audit:$/m);
  assert.doesNotMatch(workflow, /material3-browser-smoke|playwright test|axe-core regression/);
  assert.match(workflow, /needs: \[prepare, quality, build, supabase-functions, supabase-database\]/);
  assert.doesNotMatch(workflow, /NPM_AUDIT_RESULT|needs\.npm-audit/);
});

test("daily surveillance audits npm and runs pinned Playwright Chromium on the selected ref", () => {
  const triggers = surveillance.slice(0, surveillance.indexOf("\njobs:"));
  assert.match(triggers, /^  schedule:/m);
  assert.match(triggers, /cron: "30 3 \* \* \*"/);
  assert.match(triggers, /^  workflow_dispatch:/m);
  assert.match(triggers, /required: false/);
  assert.match(triggers, /default: ""/);
  assert.doesNotMatch(triggers, /default: "main"/);
  assert.ok(triggers.includes('description: "Révision facultative ; laisser vide pour utiliser la branche choisie dans le sélecteur GitHub"'));
  assert.equal((surveillance.match(/ref: \$\{\{ inputs\.ref \|\| github\.ref \}\}/g) || []).length, 2);
  assert.match(surveillance, /ref: \$\{\{ inputs\.ref \|\| github\.ref \}\}/);
  assert.match(sectionFor(surveillance, "audit-dependances"), /run: node \.github\/scripts\/run-npm-audit\.mjs/);
  const browser = sectionFor(surveillance, "tests-navigateur");
  assert.match(browser, /@playwright\/test@1\.64\.1/);
  assert.match(browser, /npx playwright install --with-deps chromium/);
  assert.match(browser, /npx playwright test/);
  assert.doesNotMatch(surveillance, /material3-browser-smoke/);
  assert.match(browser, /if: failure\(\)/);
  assert.doesNotMatch(browser, /if: always\(\)/);
  assert.doesNotMatch(surveillance, /vercel deploy|supabase db push|deploy --prod/i);
});

test("Supabase Edge Functions and database inputs receive independent, targeted validation", () => {
  const functions = sectionFor(workflow, "supabase-functions");
  const database = sectionFor(workflow, "supabase-database");
  assert.match(workflow, /supabase_functions_changed/);
  assert.match(workflow, /supabase_database_changed/);
  assert.match(functions, /find supabase\/functions .* -name index\.ts/);
  assert.match(functions, /deno check --frozen index\.ts/);
  assert.match(database, /supabase\/setup-cli@45a513f8c64c0bc8e0e3dfe572b5c95be85f6359/);
  assert.match(database, /version: 2\.122\.0/);
  assert.match(database, /supabase db start/);
  assert.match(database, /supabase test db --local/);
  assert.match(database, /supabase db lint --local --fail-on error/);
  assert.doesNotMatch(database, /supabase link|supabase db push|config push/i);
});

test("CodeQL scans main pushes and its weekly schedule without running on pull requests", () => {
  const triggers = codeql.slice(0, codeql.indexOf("\njobs:"));
  assert.match(triggers, /^  push:/m);
  assert.match(triggers, /^  schedule:/m);
  assert.doesNotMatch(triggers, /^  pull_request:/m);
});

test("CodeQL pins actions and uses only the permissions required by this public repository", () => {
  assert.ok(codeql.includes("uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1"));
  assert.ok(codeql.includes("uses: github/codeql-action/init@9b3254085494b55a0f7c4c2b3d2d52cc712ce370 # v4.39.1"));
  assert.ok(codeql.includes("uses: github/codeql-action/analyze@9b3254085494b55a0f7c4c2b3d2d52cc712ce370 # v4.39.1"));
  const permissions = codeql.slice(codeql.indexOf("    permissions:"), codeql.indexOf("    strategy:"));
  assert.match(permissions, /contents: read/);
  assert.match(permissions, /security-events: write/);
  assert.doesNotMatch(permissions, /actions:|packages:/);
});

function ruleFor(source, selector) {
  const start = source.indexOf(selector);
  assert.notEqual(start, -1, "Missing CSS selector: " + selector);
  const end = source.indexOf("}", start);
  assert.notEqual(end, -1, "Unclosed CSS rule: " + selector);
  return source.slice(start, end + 1);
}

test("adaptive navigation follows Material 3 indicator, typography and color roles", () => {
  const mobileItem = ruleFor(navigationCss, ".mobileItem {");
  const mobileIcon = ruleFor(navigationCss, ".mobileIcon {");
  const mobileSelected = ruleFor(navigationCss, '.mobileItem[data-selected="true"] {');
  const mobileLabel = ruleFor(navigationCss, ".mobileLabel {");
  assert.match(mobileItem, /min-height: 64px/);
  assert.match(mobileIcon, /width: 56px/);
  assert.match(mobileIcon, /height: 32px/);
  assert.match(mobileSelected, /color: var\(--secondary\)/);
  assert.match(mobileLabel, /m3-type-label-medium/);

  const railStart = navigationCss.indexOf("@media (min-width: 768px) and (max-width: 1199.98px)");
  const drawerStart = navigationCss.indexOf("@media (min-width: 1200px)");
  assert.ok(railStart >= 0 && drawerStart > railStart);
  const rail = navigationCss.slice(railStart, drawerStart);
  const railSelected = ruleFor(rail, '.desktopItem[data-selected="true"] {');
  const railIcon = ruleFor(rail, ".desktopIcon {");
  assert.match(railSelected, /color: var\(--secondary\)/);
  assert.match(railSelected, /background: transparent/);
  assert.match(railIcon, /width: 56px/);
  assert.match(railIcon, /height: 32px/);
  assert.match(rail, /m3-type-label-medium/);

  const drawer = navigationCss.slice(drawerStart);
  assert.match(ruleFor(drawer, ".desktopItem {"), /min-height: 56px/);
  assert.match(ruleFor(drawer, ".desktopLabel {"), /m3-type-label-large/);
});
