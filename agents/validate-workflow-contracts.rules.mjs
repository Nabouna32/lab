export function validateApprovalWorkflowContracts(sources) {
  const errors = [];
  const activeSources = [
    sources.rootRules, sources.start, sources.common, sources.issueContract,
    sources.featureGuide, sources.toolGuide, sources.productGuide, sources.decisions,
  ].map((source) => String(source ?? '')).join('\n');
  const staleRules = [
    [/implementation-plan approval are distinct/i, 'separate implementation-plan approval'],
    [/Begin implementation only after the concrete plan is explicitly validated/i, 'plan validation as implementation gate'],
    [/Obtain explicit validation of that concrete plan/i, 'explicit approval of the technical plan'],
    [/Ask for explicit plan approval/i, 'request to approve the technical plan'],
    [/After plan validation/i, 'handoff or execution tied to plan validation'],
    [/provide a ready-to-copy handoff prompt for a fresh implementation conversation by default/i, 'mandatory fresh-conversation handoff'],
    [/Plan validation and fresh-conversation handoff/i, 'old Issue-contract approval model'],
    [/explicit plan validation/i, 'explicit plan validation as a required step'],
  ];
  for (const [pattern, label] of staleRules) {
    if (pattern.test(activeSources)) errors.push('Obsolete approval workflow remains: ' + label);
  }
  const required = [
    [sources.common, "Read-only investigation, audits, source inspection, factual checkpoint updates to the mission Issue and comparison of options are the assistant's responsibility", 'Autonomous read-only investigation'],
    [sources.common, 'Approval is for the explained change proposal, not the investigation, audit, implementation method or operational plan', 'Approval boundary'],
    [sources.common, 'The plan records outcome, acceptance criteria, decisions, ordered tasks, files/areas, dependencies, risks and verification. It is an internal execution document, not an approval request', 'Internal operational plan'],
    [sources.common, 'If new evidence means the implementation would materially change the approved outcome, scope, direction or significant risk, pause the affected work', 'Material-change escalation'],
    [sources.common, 'Do not require a handoff prompt by default', 'No mandatory conversation handoff'],
    [sources.issueContract, 'The plan is an internal execution document for the assistant, not a document the user must validate', 'Issue plan ownership'],
    [sources.issueContract, 'The Issue can be updated during read-only investigation to preserve factual checkpoints. Such updates record state; they do not authorize implementation', 'Checkpoint authorization boundary'],
    [sources.decisions, '## DEC-050 — No mandatory fresh-conversation handoff', 'DEC-050 continuity decision'],
  ];
  for (const [source, phrase, label] of required) {
    if (!String(source ?? '').includes(phrase)) errors.push('Missing workflow invariant: ' + label);
  }
  return errors;
}
