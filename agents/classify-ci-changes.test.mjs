import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCiChanges, parseChangedPathsNul } from './classify-ci-changes.mjs';

test('classifies documentation-only changes as lightweight', () => {
  assert.deepEqual(classifyCiChanges(['README.md', 'docs/guide.txt'], 2), {
    lightweight_only: true,
    dependencies_changed: false,
    governance_changed: false,
  });
});

test('classifies governance-only changes as lightweight and governance-touched', () => {
  assert.deepEqual(classifyCiChanges(['agents/START-HERE.md', '.github/workflows/ci.yml'], 2), {
    lightweight_only: true,
    dependencies_changed: false,
    governance_changed: true,
  });
});

test('runtime changes force the full suite even when mixed with documentation', () => {
  assert.deepEqual(classifyCiChanges(['README.md', 'src/app/page.tsx'], 2), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: false,
  });
});

test('governance mixed with runtime still marks governance but disables lightweight mode', () => {
  assert.deepEqual(classifyCiChanges(['agents/START-HERE.md', 'src/app/page.tsx'], 2), {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: true,
  });
});

test('dependency manifests force the full suite and dependency review', () => {
  assert.deepEqual(classifyCiChanges(['package.json', 'package-lock.json'], 2), {
    lightweight_only: false,
    dependencies_changed: true,
    governance_changed: false,
  });
});

test('dependency changes mixed with governance preserve both flags', () => {
  assert.deepEqual(classifyCiChanges(['agents/START-HERE.md', 'package-lock.json'], 2), {
    lightweight_only: false,
    dependencies_changed: true,
    governance_changed: true,
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
  });
});

test('parses NUL-delimited paths without splitting spaces or newlines in filenames', () => {
  assert.deepEqual(parseChangedPathsNul('docs/a file.md\0docs/line\nbreak.txt\0'), [
    'docs/a file.md',
    'docs/line\nbreak.txt',
  ]);
});

test('rejects empty, unterminated, or internally empty NUL-delimited input', () => {
  for (const input of ['', 'README.md', '\0', 'README.md\0\0']) {
    assert.throws(() => parseChangedPathsNul(input));
  }
});
