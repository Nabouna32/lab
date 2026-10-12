import test from 'node:test';
import assert from 'node:assert/strict';
import { validateIssueLabels } from './issue-label-lifecycle.mjs';

const issue = (labels, body = '', number = 42) => ({ number, html_url: 'https://github.com/Nabouna32/lab/issues/' + number, labels: labels.map((name) => ({ name })), body });

test('accepts a compliant Issue without requesting mutation', () => {
  assert.deepEqual(validateIssueLabels(issue(['state:implementing', 'type:maintenance', 'area:workflow'])), {
    errors: [], removableLabels: [], valid: true,
  });
});

test('identifies a missing state or type without guessing a replacement', () => {
  const state = validateIssueLabels(issue(['type:maintenance']));
  assert.equal(state.valid, false);
  assert.match(state.errors.join('\n'), /state: missing canonical label/);
  const type = validateIssueLabels(issue(['state:ready']));
  assert.match(type.errors.join('\n'), /type: missing canonical label/);
  assert.deepEqual(state.removableLabels, []);
});

test('classifies one canonical label plus unknown labels as deterministic cleanup', () => {
  const result = validateIssueLabels(issue(['state:ready', 'state:queued', 'type:maintenance', 'type:legacy']));
  assert.deepEqual(result.removableLabels, ['state:queued', 'type:legacy']);
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, false);
});

test('does not choose between multiple canonical state or type labels', () => {
  const result = validateIssueLabels(issue(['state:ready', 'state:blocked', 'type:bug', 'type:maintenance']));
  assert.match(result.errors.join('\n'), /multiple canonical labels.*state:ready, state:blocked/);
  assert.match(result.errors.join('\n'), /multiple canonical labels.*type:bug, type:maintenance/);
  assert.deepEqual(result.removableLabels, []);
});

test('requires explicit structured fields for waiting, blocked and deferred Issues', () => {
  for (const state of ['state:waiting', 'state:blocked', 'state:deferred']) {
    const result = validateIssueLabels(issue([state, 'type:maintenance']));
    assert.equal(result.valid, false);
    assert.match(result.errors.join('\n'), /Reason/);
    assert.match(result.errors.join('\n'), /Resumption \/ unblock \/ review condition/);
    assert.match(result.errors.join('\n'), /Next action/);
  }
});

test('accepts explicit structured fields with equivalent explanatory prose', () => {
  const body = [
    '- **Reason:** awaiting an external answer',
    '- **Resumption / unblock / review condition:** response received',
    '- **Next action:** follow up next week',
  ].join('\n');
  assert.deepEqual(validateIssueLabels(issue(['state:waiting', 'type:audit'], body)), {
    errors: [], removableLabels: [], valid: true,
  });
});

test('rejects empty structured fields', () => {
  const body = [
    '- **Reason:**',
    '- **Resumption / unblock / review condition:** ',
    '- **Next action:**',
  ].join('\n');
  const result = validateIssueLabels(issue(['state:blocked', 'type:bug'], body));
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
});
