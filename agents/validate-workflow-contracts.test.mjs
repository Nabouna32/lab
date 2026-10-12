import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuditCatalogue, validateAuditMetadata, validateIssueLabelPolicy } from './validate-workflow-contracts.rules.mjs';
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

const labelTaxonomy = [
  ['state:ready', 'state:investigating', 'state:implementing', 'state:testing', 'state:blocked', 'state:waiting', 'state:deferred'],
  ['type:bug', 'type:feature', 'type:maintenance', 'type:audit', 'type:documentation'],
  ['area:agent-system', 'area:product', 'area:workflow', 'area:ci', 'area:accessibility', 'area:design'],
  ['dependencies', 'npm', 'github-actions'],
].flat();
const commonLabelContract = (labels = labelTaxonomy) => [
  '## 10. Issue-label lifecycle',
  '',
  '| Label | Role and intended use |',
  '| --- | --- |',
  ...labels.map((label) => '| `' + label + '` | Description. |'),
  '',
  '### State transitions and maintenance',
  'The state labels are maintained.',
].join('\n');
const issueLabelContract = [
  '### Creation and triage',
  '### Checkpoints, transitions and blockers',
  '### Closure and reopening',
  'state:waiting state:deferred resumption next state:blocked prerequisite state:completed',
].join('\n');
const dependabotLabels = 'labels:\n  - dependencies\n  - npm\n  - github-actions\n';

test('accepts the complete canonical issue-label taxonomy and Dependabot labels', () => {
  assert.deepEqual(validateIssueLabelPolicy(commonLabelContract(), issueLabelContract, dependabotLabels), []);
});
test('rejects missing and duplicate taxonomy labels without depending on prose wording', () => {
  const labels = labelTaxonomy.filter((label) => label !== 'state:waiting');
  labels.push('state:ready');
  const errors = validateIssueLabelPolicy(commonLabelContract(labels), issueLabelContract, dependabotLabels);
  assert.ok(errors.some((error) => error.includes('state:waiting exactly once')));
  assert.ok(errors.some((error) => error.includes('state:ready exactly once')));
});
test('rejects unexpected taxonomy labels and missing Dependabot automation labels', () => {
  const errors = validateIssueLabelPolicy(commonLabelContract([...labelTaxonomy, 'state:completed']), issueLabelContract, 'labels:\n  - dependencies\n  - npm\n');
  assert.ok(errors.some((error) => error.includes('Unexpected label') && error.includes('state:completed')));
  assert.ok(errors.some((error) => error.includes('github-actions')));
});
test('requires explicit waiting, deferred, blocked, closure and checkpoint guidance', () => {
  const errors = validateIssueLabelPolicy(commonLabelContract(), '### Creation and triage\n### Closure and reopening', dependabotLabels);
  assert.ok(errors.some((error) => error.includes('Checkpoints, transitions and blockers')));
  assert.ok(errors.some((error) => error.includes('state:waiting')));
});
