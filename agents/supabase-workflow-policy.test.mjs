import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  classifySupabaseChanges,
  evaluateValidationGate,
  shouldReleaseProduction,
} from './supabase-workflow-policy.mjs';

test('application-only changes do not start database validation or trigger production release', () => {
  assert.deepEqual(classifySupabaseChanges([
    'src/app/page.tsx',
    'src/lib/tools/catalog.ts',
    'docs/UX.md',
  ]), { validate: false, production: false });
});

test('migration changes require validation and production migration handling', () => {
  assert.deepEqual(classifySupabaseChanges([
    'supabase/migrations/20261010000000_example.sql',
  ]), { validate: true, production: true });
});

test('database tests require validation but do not trigger production migration handling', () => {
  assert.deepEqual(classifySupabaseChanges([
    'supabase/tests/database.test.sql',
  ]), { validate: true, production: false });
});

test('database workflow changes require validation but do not themselves trigger a production release', () => {
  assert.deepEqual(classifySupabaseChanges([
    '.github/workflows/supabase-database.yml',
  ]), { validate: true, production: false });
});

test('database config changes require validation and production migration handling', () => {
  assert.deepEqual(classifySupabaseChanges([
    'supabase/config.toml',
  ]), { validate: true, production: true });
});

test('stable validation check succeeds when required database validation succeeds', () => {
  assert.deepEqual(evaluateValidationGate({
    detectionResult: 'success',
    validationRequired: 'true',
    validationResult: 'success',
  }), { passed: true, reason: 'Supabase database validation passed.' });
});

test('stable validation check fails closed when required database validation fails or is skipped', () => {
  for (const validationResult of ['failure', 'cancelled', 'skipped', 'success-with-warnings']) {
    assert.equal(evaluateValidationGate({
      detectionResult: 'success',
      validationRequired: 'true',
      validationResult,
    }).passed, false, `expected ${validationResult} to fail the gate`);
  }
});

test('stable validation check accepts only a skipped validation job for irrelevant changes', () => {
  assert.equal(evaluateValidationGate({
    detectionResult: 'success',
    validationRequired: 'false',
    validationResult: 'skipped',
  }).passed, true);

  assert.equal(evaluateValidationGate({
    detectionResult: 'success',
    validationRequired: 'false',
    validationResult: 'success',
  }).passed, false);
});

test('change detection failures and malformed outputs cannot pass the stable check', () => {
  assert.equal(evaluateValidationGate({
    detectionResult: 'failure',
    validationRequired: 'false',
    validationResult: 'skipped',
  }).passed, false);

  assert.equal(evaluateValidationGate({
    detectionResult: 'success',
    validationRequired: '',
    validationResult: 'skipped',
  }).passed, false);
});

test('production release is allowed only after successful validation for a migration-bearing push to main', () => {
  assert.equal(shouldReleaseProduction({
    eventName: 'push',
    ref: 'refs/heads/main',
    productionRequired: 'true',
    validationResult: 'success',
    validationGatePassed: true,
  }), true);

  const deniedCases = [
    { eventName: 'pull_request', ref: 'refs/heads/main' },
    { eventName: 'workflow_dispatch', ref: 'refs/heads/main' },
    { eventName: 'push', ref: 'refs/heads/feature' },
    { eventName: 'push', ref: 'refs/heads/main', productionRequired: 'false' },
    { eventName: 'push', ref: 'refs/heads/main', validationResult: 'failure' },
    { eventName: 'push', ref: 'refs/heads/main', validationGatePassed: false },
  ];

  for (const override of deniedCases) {
    assert.equal(shouldReleaseProduction({
      eventName: 'push',
      ref: 'refs/heads/main',
      productionRequired: 'true',
      validationResult: 'success',
      validationGatePassed: true,
      ...override,
    }), false, `unexpected release permission for ${JSON.stringify(override)}`);
  }
});

test('workflow CLI writes classification outputs consumed by GitHub Actions', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'supabase-policy-'));
  try {
    const outputPath = path.join(directory, 'output.txt');
    execFileSync(process.execPath, ['agents/supabase-workflow-policy.mjs', 'detect'], {
      env: {
        ...process.env,
        GITHUB_OUTPUT: outputPath,
        CHANGED_FILES: 'src/app/page.tsx\nsupabase/tests/database.test.sql',
      },
    });
    assert.equal(readFileSync(outputPath, 'utf8'), 'validate=true\nproduction=false\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('workflow CLI keeps production release disabled when validation fails', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'supabase-policy-'));
  try {
    const outputPath = path.join(directory, 'output.txt');
    assert.throws(() => execFileSync(process.execPath, ['agents/supabase-workflow-policy.mjs', 'gate'], {
      env: {
        ...process.env,
        GITHUB_OUTPUT: outputPath,
        DETECTION_RESULT: 'success',
        VALIDATION_REQUIRED: 'true',
        VALIDATION_RESULT: 'failure',
        EVENT_NAME: 'push',
        WORKFLOW_REF: 'refs/heads/main',
        PRODUCTION_REQUIRED: 'true',
      },
      stdio: 'pipe',
    }));
    assert.equal(readFileSync(outputPath, 'utf8'), 'production_allowed=false\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});


test('workflow CLI reports a successful no-op and never enables production release for application-only changes', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'supabase-policy-'));
  try {
    const outputPath = path.join(directory, 'output.txt');
    execFileSync(process.execPath, ['agents/supabase-workflow-policy.mjs', 'gate'], {
      env: {
        ...process.env,
        GITHUB_OUTPUT: outputPath,
        DETECTION_RESULT: 'success',
        VALIDATION_REQUIRED: 'false',
        VALIDATION_RESULT: 'skipped',
        EVENT_NAME: 'pull_request',
        WORKFLOW_REF: 'refs/pull/123/merge',
        PRODUCTION_REQUIRED: 'false',
      },
    });
    assert.equal(readFileSync(outputPath, 'utf8'), 'production_allowed=false\\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('GitHub Actions workflow is wired to the tested policy and keeps release fail-closed', async () => {
  const { parse } = await import('yaml');
  const workflowPath = new URL('../.github/workflows/supabase-database.yml', import.meta.url);
  const workflow = parse(readFileSync(workflowPath, 'utf8'));
  const jobs = workflow.jobs;

  assert.equal(jobs['detect-changes'].outputs.validate, '${{ steps.detect.outputs.validate }}');
  assert.equal(jobs['detect-changes'].outputs.production, '${{ steps.detect.outputs.production }}');
  assert.equal(jobs['detect-changes'].steps.find((step) => step.id === 'detect').run.includes('supabase-workflow-policy.mjs detect'), true);
  assert.equal(jobs['run-validation'].if, "needs.detect-changes.outputs.validate == 'true'");
  assert.equal(jobs.validate.if, 'always()');
  assert.equal(jobs.validate.outputs.production_allowed, '${{ steps.gate.outputs.production_allowed }}');
  assert.equal(jobs.validate.steps.find((step) => step.id === 'gate').run, 'node agents/supabase-workflow-policy.mjs gate');
  assert.equal(jobs['production-release'].if.includes("needs.run-validation.result == 'success'"), true);
  assert.equal(jobs['production-release'].if.includes("needs.validate.result == 'success'"), true);
  assert.equal(jobs['production-release'].if.includes("needs.validate.outputs.production_allowed == 'true'"), true);
});
