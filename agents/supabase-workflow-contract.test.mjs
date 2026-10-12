import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parse } from 'yaml';

function workflow(path) {
  return parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
}

test('database validation and production release are manually dispatched only', () => {
  const database = workflow('../.github/workflows/supabase-database.yml');

  assert.deepEqual(Object.keys(database.on), ['workflow_dispatch']);
  assert.equal(database.on.workflow_dispatch.inputs.mode.type, 'choice');
  assert.equal(database.on.workflow_dispatch.inputs.mode.default, 'validate');
  assert.deepEqual(database.on.workflow_dispatch.inputs.mode.options, ['validate', 'release']);

  const validation = database.jobs['validate-database'];
  assert.equal(validation.steps.some((step) => step.run === 'supabase db reset'), true);
  assert.equal(validation.steps.some((step) => step.run === 'supabase db lint --local --fail-on error'), true);
  assert.equal(validation.steps.some((step) => String(step.run ?? '').includes('supabase test db')), true);
  assert.equal(validation.steps.some((step) => step.run === 'bash agents/test-account-deletion-concurrency.sh'), true);

  const requestGuard = database.jobs.request.steps.find((step) => step.name === 'Require main for production release');
  assert.equal(requestGuard.if, "inputs.mode == 'release'");
  assert.equal(requestGuard.run.includes('refs/heads/main'), true);

  const release = database.jobs['production-release'];
  assert.equal(release.if.includes("inputs.mode == 'release'"), true);
  assert.equal(release.if.includes("github.ref == 'refs/heads/main'"), true);
  assert.equal(release.if.includes("needs.validate-database.result == 'success'"), true);
  assert.equal(release.environment, 'supabase-production');
  assert.equal(release.steps.some((step) => String(step.run ?? '').includes('--dry-run')), true);
  assert.equal(release.steps.some((step) => step.run === 'supabase db push --db-url "$SUPABASE_DB_URL"'), true);
});

test('database validation is manual-only and is not a required CI compatibility job', () => {
  const ci = workflow('../.github/workflows/ci.yml');
  const database = workflow('../.github/workflows/supabase-database.yml');

  assert.equal(ci.jobs['supabase-validation'], undefined);
  assert.equal(Object.keys(database.on).length, 1);
  assert.equal(database.on.workflow_dispatch !== undefined, true);
  assert.equal(ci.jobs.validate.steps.some((step) => String(step.run ?? '').includes('supabase-workflow-policy')), false);
});

test('Edge Function lockfile and type checks run for relevant PRs or on demand, not again after merge', () => {
  const functions = workflow('../.github/workflows/supabase-functions.yml');

  assert.equal(functions.on.pull_request.branches.includes('main'), true);
  assert.equal(functions.on.pull_request.paths.includes('supabase/functions/**'), true);
  assert.equal(functions.on.workflow_dispatch !== undefined, true);
  assert.equal(functions.on.push, undefined);
  assert.equal(functions.jobs.validate.steps.some((step) => String(step.run ?? '').includes('deno check --frozen index.ts')), true);
});

test('dependency review blocks vulnerable dependency changes only inside the existing required PR CI check', () => {
  const ci = workflow('../.github/workflows/ci.yml');
  const validate = ci.jobs.validate;
  const detect = validate.steps.find((step) => step.id === 'changes');
  const review = validate.steps.find((step) => step.name === 'Review dependency changes');
  const setupNode = validate.steps.find((step) => step.name === 'Setup Node.js');
  const freshness = validate.steps.find((step) => step.name === 'Verify PR base is current');

  assert.equal(Object.keys(ci.jobs).length, 1);
  assert.equal(validate.name, 'Node.js 24.21.0');
  assert.equal(detect.run.includes('gh api --paginate --slurp'), true);
  assert.equal(detect.run.includes('PR_CHANGED_FILES'), true);
  assert.equal(detect.run.includes('package.json|package-lock.json'), true);
  assert.equal(setupNode.if, "steps.changes.outputs.lightweight_only != 'true'");
  assert.equal(freshness.run.includes('git fetch --no-tags --depth=1 origin main'), true);
  assert.equal(review.if, "github.event_name == 'pull_request' && steps.changes.outputs.dependencies_changed == 'true'");
  assert.equal(review.uses, 'actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294');
  assert.equal(review.with['fail-on-severity'], 'high');
  assert.equal(review.with['fail-on-scopes'], 'runtime, development');
  assert.equal(ci.permissions['pull-requests'], 'read');

  const monitoring = workflow('../.github/workflows/dependency-security-monitoring.yml');
  assert.equal(monitoring.on.push, undefined);
  assert.equal(monitoring.on.schedule.length, 1);
  assert.equal(monitoring.on.workflow_dispatch !== undefined, true);
});

test('scheduled npm audit reads the lockfile without installing the full dependency tree', () => {
  const audit = workflow('../.github/workflows/dependency-security-monitoring.yml');
  const steps = audit.jobs['npm-audit'].steps;

  assert.equal(steps.some((step) => step.run === 'npm ci'), false);
  const auditStep = steps.find((step) => step.name === 'Audit locked dependency graph');
  assert.equal(auditStep.shell, 'bash');
  assert.match(auditStep.run, /npm audit --audit-level=high --json/);
  assert.match(auditStep.run, /report-npm-audit\.mjs npm-audit\.json/);
  assert.match(auditStep.run, /exit "\$audit_status"/);
  assert.equal(audit.on.schedule.length, 1);
  assert.equal(audit.on.workflow_dispatch !== undefined, true);
});


test('npm audit reporter prints advisory metadata, lockfile paths, and fix availability', () => {
  const directory = mkdtempSync(join(tmpdir(), 'npm-audit-report-'));
  const auditPath = join(directory, 'audit.json');
  const lockPath = join(directory, 'package-lock.json');
  const reporterPath = fileURLToPath(new URL('../.github/scripts/report-npm-audit.mjs', import.meta.url));

  try {
    writeFileSync(lockPath, JSON.stringify({
      name: 'loculary',
      version: '0.1.0',
      packages: {
        '': { name: 'loculary', version: '0.1.0', devDependencies: { 'eslint-config-next': '16.3.8' } },
        'node_modules/eslint-config-next': {
          name: 'eslint-config-next',
          version: '16.3.8',
          dependencies: { braces: '^3.0.0' },
        },
        'node_modules/braces': { name: 'braces', version: '3.0.3' },
      },
    }));
    writeFileSync(auditPath, JSON.stringify({
      vulnerabilities: {
        braces: {
          name: 'braces',
          severity: 'high',
          isDirect: false,
          range: '<=3.0.3',
          nodes: ['node_modules/braces'],
          via: ["micromatch", {
            source: 12345,
            name: 'braces',
            title: 'Example stack exhaustion advisory',
            url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
            severity: 'high',
            range: '<=3.0.3',
            cwe: ['CWE-400'],
            cvss: { score: 7.5 },
          }],
          effects: [],
          fixAvailable: false,
        },
      },
      metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 1, critical: 0, total: 1 } },
    }));

    const result = spawnSync(process.execPath, [reporterPath, auditPath, lockPath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /GHSA-vfj7-8cjw-p6xm/);
    assert.match(result.stdout, /braces@<=3\.0\.3/);
    assert.match(result.stdout, /loculary@0\.1\.0 → eslint-config-next@16\.3\.8 → braces@3\.0\.3/);
    assert.match(result.stdout, /Aucun correctif proposé par npm/);
    assert.match(result.stdout, /Avis indirect : vulnérabilité propagée par micromatch/);
    assert.match(result.stdout, /Paquets signalés comme vulnérables : 1/);
    assert.match(result.stdout, /ne représente pas nécessairement des avis distincts/);
    assert.match(result.stdout, /code de sortie de la commande npm audit reste la référence/);
    assert.match(result.stdout, /CWE-400/);
    assert.match(result.stdout, /Score CVSS : 7\.5/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('manual browser workflows do not retain obsolete path detection or full git history fetches', () => {
  const e2e = workflow('../.github/workflows/e2e.yml');
  const productionBrowser = workflow('../.github/workflows/production-browser.yml');
  const screenshots = workflow('../.github/workflows/production-screenshots.yml');

  assert.deepEqual(Object.keys(e2e.on), ['workflow_dispatch']);
  assert.equal(e2e.jobs.browser.steps.some((step) => step.name === 'Detect documentation-only change'), false);
  const artifactUpload = e2e.jobs.browser.steps.find((step) => step.name === 'Upload Playwright report on failure');
  assert.equal(artifactUpload.if, 'failure()');
  assert.equal(e2e.jobs.browser.steps.some((step) => String(step.if ?? '').includes('steps.changes.outputs.docs_only')), false);
  for (const parsed of [e2e, productionBrowser, screenshots]) {
    for (const job of Object.values(parsed.jobs)) {
      for (const step of job.steps) {
        assert.notEqual(step.with?.['fetch-depth'], 0);
      }
    }
  }
});
