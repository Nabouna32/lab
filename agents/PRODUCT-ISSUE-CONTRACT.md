# Loculary — Mission Issue Protocol

GitHub Issues provide the durable operational plan and checkpoint for resumable work. They do not replace Git, implementation evidence or canonical product/architecture decisions.

## 1. Mission Issue

Every resumable repository mission requires an active Issue. Search existing Issues and related branches/PRs before creating one; reuse an Issue only when it genuinely covers the work.

## 2. Operational plan

After the direction is decided and before implementation begins, write the concrete plan in the mission Issue. It must be understandable without the chat and include, as applicable:

- **Objective and expected outcome** — the user problem and what success looks like.
- **Acceptance criteria** — observable conditions for completion.
- **Validated decisions** — current direction and boundaries that must not be silently changed.
- **Ordered work** — coherent implementation tasks, files/areas, required removals/consolidations and cross-cutting updates.
- **Dependencies and risks** — concurrent work, technical constraints, uncertainty and material trade-offs.
- **Verification plan** — targeted checks, expected evidence, CI and delivery requirements.
- **Current state and next action** — exact progress, branch/PR and outstanding work.

The plan is a living operational checkpoint: update it when evidence reveals necessary changes. Routine technical sequencing does not require repeated approval. A material change in direction or risk requires discussion and explicit validation.

## 3. Plan validation and fresh-conversation handoff

Approval of a recommendation is not approval of the implementation plan. Begin implementation only after the user explicitly validates the concrete plan.

After plan validation, provide a ready-to-copy prompt for a fresh conversation by default. It points to this Issue, asks the new conversation to read the complete Issue and relevant comments plus current repository instructions, recheck GitHub state, verify the plan remains valid, and implement autonomously. The prompt is a launch instruction, not a second plan; it must not duplicate the plan or assume a stale branch, commit, PR or CI state.

## 4. Checkpoints and evidence

Update the Issue at meaningful milestones and before interruption or completion. Keep it concise but independently resumable. Record actual changes, exact branch/PR, verification commands or workflows and their observed results, blockers, decisions and next action. Distinguish observed facts, measurements, deductions, hypotheses, proposals, decisions and unverified details.

Do not paste entire source files, reports, logs, secrets or chat transcripts. Git/GitHub are authoritative for code, branches, PRs, CI and merge state.

## 5. Actionable discoveries

For actionable work not completed in the current mission:
1. Search for a matching existing Issue.
2. Update it if it genuinely covers the finding; otherwise create a dedicated Issue.
3. Record evidence, consequence, uncertainty and likely next action.
4. Tell the user what was tracked and why.

Tracking does not silently change priority or authorize implementation. Do not dismiss actionable findings as too minor.

## 6. Closure and recovery

A mission must be recoverable from the Issue, its branch/PR and linked canonical documents/evidence. Close it only when completed and verified, explicitly abandoned, or remaining work is durably tracked elsewhere. Before closure, record actual final state, verification and any remaining limitations.
