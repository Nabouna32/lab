import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const workflowPath = new URL("../workflows/ci.yml", import.meta.url);
const surveillancePath = new URL("../workflows/surveillance.yml", import.meta.url);
const codeqlPath = new URL("../workflows/codeql.yml", import.meta.url);
const axeAuditPath = new URL("../workflows/audit-accessibilite.yml", import.meta.url);
const browserSpecPath = new URL("../browser/material3.spec.mjs", import.meta.url);
const axeAuditSpecPath = new URL("../browser/material3-axe-audit.spec.mjs", import.meta.url);
const workflow = readFileSync(workflowPath, "utf8");
const surveillance = readFileSync(surveillancePath, "utf8");
const codeql = readFileSync(codeqlPath, "utf8");
const axeAudit = readFileSync(axeAuditPath, "utf8");
const browserSpec = readFileSync(browserSpecPath, "utf8");
const axeAuditSpec = readFileSync(axeAuditSpecPath, "utf8");

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

test("post-merge and daily surveillance audit npm and run pinned Playwright Chromium on main", () => {
  const triggers = surveillance.slice(0, surveillance.indexOf("\njobs:"));
  assert.match(triggers, /^  push:/m);
  assert.match(triggers, /branches:\n      - main/);
  assert.doesNotMatch(triggers, /^  pull_request:/m);
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
  assert.match(browser, /if: always\(\)/);
  assert.doesNotMatch(browser, /if: failure\(\)/);
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

test("CodeQL cancels obsolete push scans without coupling them to scheduled scans", () => {
  const concurrency = codeql.slice(codeql.indexOf("\nconcurrency:"), codeql.indexOf("\njobs:"));
  assert.match(concurrency, /group: codeql-\$\{\{ github\.workflow \}\}-\$\{\{ github\.ref \}\}-\$\{\{ github\.event_name \}\}/);
  assert.match(concurrency, /cancel-in-progress: true/);
});

test("CodeQL pins actions, limits permissions, and hardens its analysis job", () => {
  assert.ok(codeql.includes("uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1"));
  assert.ok(codeql.includes("uses: github/codeql-action/init@9b3254085494b55a0f7c4c2b3d2d52cc712ce370 # v4.39.1"));
  assert.ok(codeql.includes("uses: github/codeql-action/analyze@9b3254085494b55a0f7c4c2b3d2d52cc712ce370 # v4.39.1"));
  const permissions = codeql.slice(codeql.indexOf("    permissions:"), codeql.indexOf("    strategy:"));
  assert.match(permissions, /contents: read/);
  assert.match(permissions, /security-events: write/);
  assert.doesNotMatch(permissions, /actions:|packages:/);

  const checkout = codeql.slice(
    codeql.indexOf("    - name: Checkout repository"),
    codeql.indexOf("\n\n    # Add any setup steps"),
  );
  assert.match(checkout, /with:\s+persist-credentials: false/);
  assert.match(codeql, /^    timeout-minutes: 15$/m);
  assert.match(codeql, /- language: python\s+display_language: Python\s+build-mode: none/);
});

test("Playwright Chromium runs after main updates and daily/manual, never on pull requests", () => {
  const browserPath = new URL("../workflows/browser-validation.yml", import.meta.url);
  assert.equal(existsSync(browserPath), false, "The duplicate pull-request browser workflow must stay removed");
  assert.doesNotMatch(workflow, /playwright test|axe-core regression/i);
  assert.match(surveillance, /npx playwright test/);
  assert.match(surveillance, /^  push:/m);
  assert.match(surveillance, /^  schedule:/m);
  assert.match(surveillance, /^  workflow_dispatch:/m);
  assert.doesNotMatch(surveillance.slice(0, surveillance.indexOf("\\njobs:")), /^  pull_request:/m);
});

test("axe-core produit un rapport informatif après mise à jour de main ou sur demande", () => {
  assert.doesNotMatch(browserSpec, /axe-core|runAxe|axePath|window\.axe/);
  assert.match(axeAuditSpec, /axe-core/);
  assert.match(axeAuditSpec, /wcag22aa/);
  assert.match(axeAuditSpec, /Rapport indicatif uniquement/);
  assert.match(axeAuditSpec, /writeFileSync\(resolve\(reportDirectory/);
  assert.doesNotMatch(axeAuditSpec, /expect\(result\.violations/);
  const triggers = axeAudit.slice(0, axeAudit.indexOf("\njobs:"));
  assert.match(triggers, /^  push:/m);
  assert.match(triggers, /branches:[\\s\\S]*?      - main/);
  assert.match(triggers, /^  workflow_dispatch:/m);
  assert.doesNotMatch(triggers, /^  (pull_request|schedule):/m);
  assert.match(axeAudit, /npx playwright test \.github\/browser\/material3-axe-audit\.spec\.mjs/);
  assert.match(axeAudit, /if: always\(\)/);
  assert.match(axeAudit, /artifacts\/browser\/axe-reports\//);
  assert.doesNotMatch(axeAudit, /expect\(result\.violations/);
  assert.match(axeAudit, /cancel-in-progress: true/);
  assert.doesNotMatch(surveillance, /material3-axe-audit|axe-core/);
});

test("workflow and job display names explain the checks in French", () => {
  assert.ok(workflow.includes("name: Détection des changements et contrôles préalables"));
  assert.ok(workflow.includes("name: Lint, vérification TypeScript et tests unitaires"));
  assert.ok(workflow.includes("name: Construction de l'application de production"));
  assert.ok(workflow.includes("name: Vérification des fonctions Edge Supabase (Deno)"));
  assert.ok(workflow.includes("name: Validation de la base Supabase — migrations, tests pgTAP et analyse SQL"));
  assert.ok(workflow.includes("name: Vérification finale des contrôles applicables"));

  assert.ok(surveillance.includes("name: Surveillance du projet"));
  assert.ok(surveillance.includes("name: Audit de sécurité des dépendances npm"));
  assert.ok(surveillance.includes("name: Tests navigateur — parcours critiques et contrôles d'accessibilité"));

  assert.ok(codeql.includes("name: Analyse de sécurité du code"));
  assert.ok(codeql.includes("display_language: GitHub Actions"));
  assert.ok(codeql.includes("display_language: JavaScript / TypeScript"));
  assert.ok(codeql.includes("display_language: Python"));
});
