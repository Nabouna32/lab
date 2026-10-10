import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('the required database check is a skipped compatibility shim, not a validation result', () => {
  const ci = workflow('../.github/workflows/ci.yml');

  assert.equal(ci.jobs['supabase-validation'].name, 'Validate Supabase migrations');
  assert.equal(ci.jobs['supabase-validation'].if, '${{ false }}');
  assert.equal(ci.jobs['supabase-validation'].steps.length, 1);
  assert.equal(ci.jobs['detect-changes'].outputs.supabase_validate, undefined);
  assert.equal(ci.jobs['detect-changes'].steps.some((step) => String(step.run ?? '').includes('supabase-workflow-policy')), false);
});

test('Edge Function lockfile and type checks run for relevant PRs or on demand, not again after merge', () => {
  const functions = workflow('../.github/workflows/supabase-functions.yml');

  assert.equal(functions.on.pull_request.branches.includes('main'), true);
  assert.equal(functions.on.pull_request.paths.includes('supabase/functions/**'), true);
  assert.equal(functions.on.workflow_dispatch !== undefined, true);
  assert.equal(functions.on.push, undefined);
  assert.equal(functions.jobs.validate.steps.some((step) => String(step.run ?? '').includes('deno check --frozen index.ts')), true);
});

test('post-merge dependency review starts only when npm manifests or lockfile change', () => {
  const dependencyReview = workflow('../.github/workflows/dependency-review.yml');

  assert.deepEqual(dependencyReview.on.push.paths, ['package.json', 'package-lock.json']);
  assert.equal(dependencyReview.on.pull_request, undefined);
});

test('scheduled npm audit reads the lockfile without installing the full dependency tree', () => {
  const audit = workflow('../.github/workflows/dependency-security-monitoring.yml');
  const steps = audit.jobs['npm-audit'].steps;

  assert.equal(steps.some((step) => step.run === 'npm ci'), false);
  assert.equal(steps.some((step) => step.run === 'npm audit --audit-level=high'), true);
  assert.equal(audit.on.schedule.length, 1);
  assert.equal(audit.on.workflow_dispatch !== undefined, true);
});

test('manual browser workflows do not retain obsolete path detection or full git history fetches', () => {
  const e2e = workflow('../.github/workflows/e2e.yml');
  const productionBrowser = workflow('../.github/workflows/production-browser.yml');
  const screenshots = workflow('../.github/workflows/production-screenshots.yml');

  assert.deepEqual(Object.keys(e2e.on), ['workflow_dispatch']);
  assert.equal(e2e.jobs.browser.steps.some((step) => step.name === 'Detect documentation-only change'), false);
  for (const parsed of [e2e, productionBrowser, screenshots]) {
    for (const job of Object.values(parsed.jobs)) {
      for (const step of job.steps) {
        assert.notEqual(step.with?.['fetch-depth'], 0);
      }
    }
  }
});
