import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApprovalWorkflowContracts } from './validate-workflow-contracts.rules.mjs';
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
