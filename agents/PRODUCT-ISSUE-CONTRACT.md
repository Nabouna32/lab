# Loculary — Mission Issue Protocol

GitHub Issues provide the durable operational plan and checkpoint for resumable work. They do not replace Git, implementation evidence or canonical product/architecture decisions.

## 1. Mission Issue

Every resumable repository mission requires an active Issue. Search existing Issues and related branches/PRs before creating one; reuse an Issue only when it genuinely covers the work.

## 2. Operational plan

After the user has explicitly approved the explained change proposal, write the concrete operational plan in this mission Issue before or as implementation begins. The plan is an internal execution document for the assistant, not a document the user must validate.

Include, as applicable:

- **Objective and expected outcome** — the user problem and observable result.
- **Acceptance criteria** — conditions that establish completion.
- **Approved decisions and boundaries** — the agreed direction and exclusions that must not be silently changed.
- **Ordered work** — coherent tasks, files/areas, removals/consolidations and cross-cutting updates.
- **Dependencies and risks** — concurrent work, constraints, uncertainty and material trade-offs.
- **Verification plan** — targeted checks, expected evidence, CI and delivery requirements.
- **Current state and next action** — actual progress, branch/PR and remaining work.

The plan is a living operational checkpoint. Update it when evidence reveals necessary technical work or changes to the execution sequence. Routine implementation details do not require user approval. If new evidence materially changes the approved outcome, scope, direction or significant risk, pause the affected work and discuss the new decision before proceeding.

The Issue can be updated during read-only investigation to preserve factual checkpoints. Such updates record state; they do not authorize implementation.

## 3. Traceability and verification

Read the complete active Issue body and relevant comments/amendments before planning or resuming. Reconcile chronology and compare every approved requirement against the operational plan: map it to planned work, a justified no-change rationale or an explicit follow-up. Check in the opposite direction that every material planned change is grounded in the approved proposal or is a necessary implementation detail. Map important acceptance criteria to concrete verification evidence.

During implementation and before delivery, compare actual changes and results against the approved proposal, Issue and acceptance criteria. Record discrepancies, evidence and limitations. Routine adjustments consistent with the approved outcome are autonomous; consequential direction or risk changes require discussion.

## 4. Approval and fresh-conversation handoff

Before any repository modification, present the user with a detailed, accessible explanation of the proposed changes: the concrete problem, expected result, why each change is needed, materially different alternatives, recommendation, trade-offs, risks, uncertainties, exclusions and supporting evidence. The user must be able to decide without opening this Issue, audit reports or code.

The explicit green light applies to this explained proposal. It does not ask the user to approve read-only investigation, an audit, the implementation method or the operational plan. After approval, the assistant writes and uses the detailed Issue plan and implements autonomously.

After approval of the proposed changes, follow the default and explicit same-conversation exception in the common work contract and DEC-050 in `docs/DECISIONS.md`: provide a ready-to-copy prompt for a fresh implementation conversation by default, because discussion and investigation may have consumed much of the available context. The user may instead explicitly ask to continue in the current conversation. The prompt points to this Issue and asks the new conversation to read the complete Issue/comments and repository instructions, reconstruct GitHub state, verify that the approved outcome remains valid, and implement autonomously. It is a launch instruction, not a second plan, and must not assume stale branch, commit, PR or CI state.

## 5. Checkpoints and evidence

Update the Issue at meaningful milestones and before interruption or completion. Keep it concise but independently resumable. Record actual changes, exact branch/PR, verification commands or workflows and their observed results, blockers, decisions and next action. Distinguish observed facts, measurements, deductions, hypotheses, proposals, decisions and unverified details.

Do not paste entire source files, reports, logs, secrets or chat transcripts. Git/GitHub are authoritative for code, branches, PRs, CI and merge state.

## 6. Actionable discoveries

For actionable work not completed in the current mission:
1. Search for a matching existing Issue.
2. Update it if it genuinely covers the finding; otherwise create a dedicated Issue.
3. Record evidence, consequence, uncertainty and likely next action.
4. Tell the user what was tracked and why.

Tracking does not silently change priority or authorize implementation. Do not dismiss actionable findings as too minor.

## 7. Closure and recovery

A mission must be recoverable from the Issue, its branch/PR and linked canonical documents/evidence. Close it only when completed and verified, explicitly abandoned, or remaining work is durably tracked elsewhere. Before closure, record actual final state, verification and any remaining limitations.
