import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCiChanges, parseChangedPathsNul } from './classify-ci-changes.mjs';

test('classifies documentation-only changes as lightweight', () => {
  assert.deepEqual(classifyCiChanges(['README.md', 'docs/guide.txt'], 2), {
    lightweight_only: true,
    dependencies_changed: false,
    governance_changed: false,
    supabase_changed: false,
  });
});

test('classifies governance documentation as lightweight and governance-touched', () => {
  assert.deepEqual(classifyCiChanges(['AGENTS.md', 'docs/DECISIONS.md'], 2), {
    lightweight_only: true,
    dependencies_changed: false,
    governance_changed: true,
    supabase_changed: false,
  });
});

test('workflow changes require full CI while still exercising classifier tests', () => {
  assert.deepEqual(classifyCiChanges(['.github/workflows/ci.yml'], 1), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: true,
    supabase_changed: false,
  });
});

test('CI tooling changes require full CI and exercise classifier tests', () => {
  assert.deepEqual(classifyCiChanges(['.github/scripts/classify-ci-changes.mjs'], 1), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: true,
    supabase_changed: false,
  });
});

test('runtime changes force the full suite even when mixed with documentation', () => {
  assert.deepEqual(classifyCiChanges(['README.md', 'src/app/page.tsx'], 2), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: false,
    supabase_changed: false,
  });
});

test('governance mixed with runtime still marks governance but disables lightweight mode', () => {
  assert.deepEqual(classifyCiChanges(['AGENTS.md', 'src/app/page.tsx'], 2), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: true,
    supabase_changed: false,
  });
});

test('dependency manifests disable lightweight mode and trigger dependency review', () => {
  assert.deepEqual(classifyCiChanges(['package.json', 'package-lock.json'], 2), {
    lightweight_only: false,
    dependencies_changed: true,
    governance_changed: false,
    supabase_changed: false,
  });
});

test('dependency changes mixed with governance preserve both flags', () => {
  assert.deepEqual(classifyCiChanges(['AGENTS.md', 'package-lock.json'], 2), {
    lightweight_only: false,
    dependencies_changed: true,
    governance_changed: true,
    supabase_changed: false,
  });
});

test('rejects an empty changed-path list', () => {
  assert.throws(() => classifyCiChanges([], 0), /positive integer|No changed paths/);
});

test('rejects missing, invalid, and inconsistent expected counts', () => {
  for (const count of [undefined, 0, -1, 1.5, '2', NaN]) {
    assert.throws(() => classifyCiChanges(['README.md'], count));
  }
  assert.throws(() => classifyCiChanges(['README.md'], 2), /count mismatch/);
});

test('rejects invalid paths rather than silently classifying them', () => {
  for (const paths of [null, [''], ['README.md', null], ['bad\0path']]) {
    assert.throws(() => classifyCiChanges(paths, 1));
  }
});

test('rejects more than 3,000 changed files before lightweight classification', () => {
  const paths = Array.from({ length: 3001 }, (_, index) => `docs/file-${index}.md`);
  assert.throws(() => classifyCiChanges(paths, 3001), /3000-file listing limit/);
});

test('accepts exactly 3,000 valid changed paths', () => {
  const paths = Array.from({ length: 3000 }, (_, index) => `docs/file-${index}.md`);
  assert.deepEqual(classifyCiChanges(paths, 3000), {
    lightweight_only: true,
    dependencies_changed: false,
    governance_changed: false,
    supabase_changed: false,
  });
});

test('parses NUL-delimited paths without splitting spaces or newlines in filenames', () => {
  const paths = parseChangedPathsNul('docs/a file.md\0docs/line\nbreak.txt\0');
  assert.deepEqual(paths, ['docs/a file.md', 'docs/line\nbreak.txt']);
  assert.equal(classifyCiChanges(paths, 2).lightweight_only, true);
});

test('rejects empty, unterminated, or internally empty NUL-delimited input', () => {
  for (const input of ['', 'README.md', '\0', 'README.md\0\0']) {
    assert.throws(() => parseChangedPathsNul(input));
  }
});

test('marks Supabase Edge Function changes for targeted Deno validation', () => {
  assert.deepEqual(classifyCiChanges(['supabase/functions/account-delete/index.ts'], 1), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: false,
    supabase_changed: true,
  });
});

import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../workflows/ci.yml', import.meta.url), 'utf8');

test('ESLint-only dependency upgrades still run lint while skipping unrelated checks', () => {
  const qualityJob = workflow.slice(workflow.indexOf('  quality:'), workflow.indexOf('  build:'));
  const lintStart = qualityJob.indexOf('- name: Lint');
  const typecheckStart = qualityJob.indexOf('- name: Typecheck');
  assert.ok(lintStart >= 0 && typecheckStart > lintStart, 'the quality job must define lint before typecheck');
  const lintStep = qualityJob.slice(lintStart, typecheckStart);
  assert.ok(lintStep.includes('run: npm run lint'), 'the lint step must execute');
  assert.equal(lintStep.includes('dependency_scope'), false, 'lint must not be skipped for an ESLint-only upgrade');
  assert.ok(qualityJob.includes("needs.prepare.outputs.dependency_scope != 'lint_only'"), 'typecheck and unit tests should be skipped for a verified ESLint-only upgrade');
});

test('production build runs independently and remains covered by the required status gate', () => {
  const buildJob = workflow.slice(workflow.indexOf('  build:'), workflow.indexOf('  supabase:'));
  const gateJob = workflow.slice(workflow.indexOf('  ci:'), workflow.indexOf('  npm-audit:'));
  assert.ok(buildJob.includes('run: npm run build'));
  assert.ok(gateJob.includes('name: Node.js 24.21.0'));
  assert.ok(gateJob.includes('needs: [prepare, quality, build, supabase, npm-audit]'));
  assert.ok(gateJob.includes('NPM_AUDIT_RESULT'));
  assert.ok(gateJob.includes('case "$NPM_AUDIT_RESULT" in'));
  assert.ok(gateJob.includes('The npm audit job must succeed'));
  assert.ok(gateJob.includes('PREPARE_RESULT'));
  assert.ok(gateJob.includes('BUILD_RESULT'));
});

test('governance changes execute every CI tooling test instead of maintaining a partial list', () => {
  assert.ok(workflow.includes('node --test .github/scripts/*.test.mjs'));
  assert.ok(workflow.includes('python3 .github/scripts/test_inspect_material3_android_aar.py'));
  assert.ok(workflow.includes('python3 .github/scripts/test_verify_material3_source_commit.py'));
  assert.ok(workflow.includes('python3 .github/scripts/test_verify_compose_source_archive_alignment.py'));
  assert.equal(workflow.includes('test_inventory_material_components_api.py'), false, 'removed historical Views inventory tests must not remain in CI');
});
