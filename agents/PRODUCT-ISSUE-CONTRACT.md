# Loculary — Mission Issue Protocol

GitHub Issues provide the durable plan and checkpoint for resumable work. They do not replace Git, implementation evidence or canonical product/architecture decisions.

## 1. When to use a mission Issue

Create or reuse an active Issue for work that needs a durable decision trail, multiple steps, cross-session continuity or meaningful delivery checkpoint. Search existing Issues and related branches/PRs first; reuse an Issue only when it genuinely covers the work. Do not create an Issue for every micro-task.

## 2. Plan proportionate to the work

After the user approves the explained change proposal, write or update the operational plan before or as implementation begins. This plan is for execution, not another approval round. Its detail should match the scope and risk.

Include what is useful for the mission:
- **Objective and expected result** — the user problem and observable outcome.
- **Acceptance criteria** — how completion will be recognized.
- **Decisions and boundaries** — approved direction and exclusions.
- **Ordered work** — coherent tasks and relevant files/areas.
- **Dependencies and risks** — constraints, uncertainty and material trade-offs.
- **Verification** — relevant checks and required delivery evidence.
- **Checkpoint** — actual progress, branch/PR, blockers and next action.

Update the plan when evidence changes the implementation sequence or reveals necessary work. Routine implementation details do not need approval. If evidence materially changes the approved outcome, scope, direction or significant risk, pause the affected work and discuss the decision first. Factual checkpoint updates during read-only investigation are allowed and do not authorize implementation.

## 3. Traceability and evidence

Read the complete active Issue and relevant comments/amendments before planning or resuming. Reconcile the checkpoint with current code and GitHub state; never treat stale Issue text as proof of the current branch, PR, checks or implementation.

For substantial changes, ensure each approved requirement is accounted for by planned work, a justified no-change decision or a tracked follow-up. Ensure material planned changes are grounded in the approved proposal or necessary implementation details. Before delivery, compare the actual diff and results with the proposal and relevant acceptance criteria; record material discrepancies, verification evidence and limitations.

Distinguish observed facts, measurements, deductions, hypotheses, proposals, decisions and unverified details. Do not paste entire source files, reports, logs, secrets or chat transcripts. Git/GitHub remain authoritative for code, branches, PRs, CI and merge state.

## 4. Checkpoints and follow-up

Update the Issue at meaningful milestones and before interruption or completion. Keep it concise but independently resumable: actual state, decisions, changes, verification results, blockers and next action. Do not post empty updates.

For actionable work outside the active mission, search for a matching Issue. Update it if it genuinely covers the finding; otherwise create a dedicated Issue when separate tracking is useful. Record the evidence, consequence, uncertainty and likely next action, and tell the user what was tracked. Tracking does not authorize implementation or silently change priorities.

## 5. Closure and recovery

The Issue, its branch/PR and linked canonical documents or evidence should make the mission recoverable. Close it only when work is completed and verified, explicitly abandoned, or remaining work is durably tracked elsewhere. Record the actual final state, verification and remaining limitations before closure.
