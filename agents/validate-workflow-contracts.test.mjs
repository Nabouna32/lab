import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApprovalWorkflowContracts, validateAuditCatalogue, validateAuditMetadata } from './validate-workflow-contracts.rules.mjs';
const audit = (id, name, content = '') => ({ id, name, content });
function metadata(id, name, options = {}) {
  const slug = name.replace(/^\d{2}-/, '').replace(/\.md$/, '');
  return [
    '- **Audit ID:** ' + (options.id ?? String(id).padStart(2, '0')),
    '- **Slug:** ' + (options.slug ?? slug),
    '- **Mission:** ' + (options.procedure ?? 'agents/audits/' + name),
    '- **' + (options.reportLabel ?? 'Rapports') + ':** ' + (options.report ?? 'docs/audits/' + String(id).padStart(2, '0') + '-' + slug + '/'),
  ].join('\n');
}
const audits = [audit(1, '01-alpha.md', metadata(1, '01-alpha.md')), audit(99, '99-final-launch.md', metadata(99, '99-final-launch.md', { id: '99', reportLabel: 'New reports' }))];
const catalogue = (lines) => '# Audits\n\n## Procedure catalogue\n\n' + lines.join('\n') + '\n\n## Requirements\n';
const validCatalogue = catalogue(['- [01 — Alpha](./01-alpha.md)', '- [99 — Final](./99-final-launch.md)']);

test('accepts French/English metadata labels and inline-code formatting', () => {
  const tick = String.fromCharCode(96);
  const fixtures = [audit(1, '01-alpha.md', metadata(1, '01-alpha.md', { id: tick+'01'+tick, slug: tick+'alpha'+tick, procedure: tick+'agents/audits/01-alpha.md'+tick, report: tick+'docs/audits/01-alpha/'+tick })), audits[1]];
  assert.deepEqual(validateAuditMetadata(fixtures), []);
});
test('rejects missing and duplicate metadata lines with expected diagnostics', () => {
  const missing = audit(1, '01-alpha.md', '- **Audit ID:** 01\n- **Slug:** alpha\n- **Mission:** agents/audits/01-alpha.md');
  const duplicate = audit(1, '01-alpha.md', metadata(1, '01-alpha.md') + '\n- **Slug:** wrong');
  const errors = validateAuditMetadata([missing, duplicate]);
  assert.ok(errors.some((e) => e.includes('report path metadata') && e.includes('found 0')));
  assert.ok(errors.some((e) => e.includes('slug metadata') && e.includes('found 2')));
});
test('rejects mismatched ID, slug and procedure/report paths', () => {
  const fixture = audit(1, '01-alpha.md', metadata(1, '01-alpha.md', { id: '02', slug: 'wrong', procedure: 'agents/audits/02-wrong.md', report: 'docs/audits/02-wrong/' }));
  const errors = validateAuditMetadata([fixture]);
  for (const expected of ['ID metadata', 'slug metadata', 'procedure path metadata', 'report path metadata']) assert.ok(errors.some((e) => e.includes(expected) && e.includes('expected exact value')), expected);
});
test('rejects missing catalogue entries and stale targets', () => {
  const errors = validateAuditCatalogue(audits, catalogue(['- [01 — Alpha](./01-alpha.md)', '- [02 — Stale](./02-stale.md)']));
  assert.ok(errors.some((e) => e.includes('points to a missing procedure: 02-stale.md')));
  assert.ok(errors.some((e) => e.includes('99-final-launch.md must appear exactly once')));
});
test('rejects duplicate catalogue IDs and targets', () => {
  const errors = validateAuditCatalogue(audits, catalogue(['- [01 — Alpha](./01-alpha.md)', '- [01 — Duplicate](./01-alpha.md)', '- [99 — Final](./99-final-launch.md)']));
  assert.ok(errors.some((e) => e.includes('Duplicate audit catalogue ID: 01')));
  assert.ok(errors.some((e) => e.includes('Duplicate audit catalogue target: 01-alpha.md')));
});
test('rejects ID/target mismatches and invalid link paths', () => {
  const errors = validateAuditCatalogue(audits, catalogue(['- [02 — Alpha](./01-alpha.md)', '- [99 — Final](../99-final-launch.md)']));
  assert.ok(errors.some((e) => e.includes('label ID 02 does not match target 01-alpha.md')));
  assert.ok(errors.some((e) => e.includes('relative numbered procedure path: ../99-final-launch.md')));
});
test('rejects malformed or non-numbered entries', () => {
  const errors = validateAuditCatalogue(audits, catalogue(['- Alpha without a numbered link', '- [99 — Final](./99-final-launch.md)']));
  assert.ok(errors.some((e) => e.includes('Malformed or non-numbered entry')));
});
test('accepts a complete one-to-one catalogue', () => assert.deepEqual(validateAuditCatalogue(audits, validCatalogue), []));


const validApprovalSources = {
  rootRules: '',
  start: '',
  common: [
    "Read-only investigation, audits, source inspection, factual checkpoint updates to the mission Issue and comparison of options are the assistant's responsibility",
    "Approval is for the explained change proposal, not the investigation, audit, implementation method or operational plan",
    "The plan records outcome, acceptance criteria, decisions, ordered tasks, files/areas, dependencies, risks and verification. It is an internal execution document, not an approval request",
    "If new evidence means the implementation would materially change the approved outcome, scope, direction or significant risk, pause the affected work",
    "Do not require a handoff prompt by default",
  ].join("\n"),
  issueContract: [
    "The plan is an internal execution document for the assistant, not a document the user must validate",
    "The Issue can be updated during read-only investigation to preserve factual checkpoints. Such updates record state; they do not authorize implementation",
  ].join("\n"),
  featureGuide: '',
  toolGuide: '',
  productGuide: '',
  decisions: '## DEC-050 — No mandatory fresh-conversation handoff',
};

test('accepts the proposal-approval boundary, internal plan, escalation and optional handoff', () => {
  assert.deepEqual(validateApprovalWorkflowContracts(validApprovalSources), []);
});

test('rejects the old plan-approval gate', () => {
  const errors = validateApprovalWorkflowContracts({
    ...validApprovalSources,
    common: validApprovalSources.common + "\nBegin implementation only after the concrete plan is explicitly validated.",
  });
  assert.ok(errors.some((error) => error.includes('plan validation as implementation gate')));
});

test('rejects mandatory fresh-conversation handoff', () => {
  const errors = validateApprovalWorkflowContracts({
    ...validApprovalSources,
    common: validApprovalSources.common + "\nAfter the user approves the proposed changes, provide a ready-to-copy handoff prompt for a fresh implementation conversation by default",
  });
  assert.ok(errors.some((error) => error.includes('mandatory fresh-conversation handoff')));
});

test('rejects missing internal-plan and continuity safeguards', () => {
  const errors = validateApprovalWorkflowContracts({
    ...validApprovalSources,
    issueContract: '',
    decisions: '',
  });
  assert.ok(errors.some((error) => error.includes('Issue plan ownership')));
  assert.ok(errors.some((error) => error.includes('DEC-050 continuity decision')));
});
