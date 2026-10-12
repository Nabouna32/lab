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

After the plan is finalized and reconciled, present a concise decision brief in the conversation before requesting approval, following the common work contract. Summarize the plan and meaningful trade-offs in the user's language; do not make the user open the Issue to understand the decision.

## 3. Decision-to-plan traceability

Before presenting a plan for validation, read the complete active Issue body and all relevant comments, amendments and decisions. Reconcile chronology and identify requirements, constraints, dependencies, risks and unresolved questions. Compare the plan against every applicable Issue requirement: map each to a task, a justified no-change rationale or an explicit unresolved/deferral. Then compare the plan back to the Issue to ensure every material change is grounded in a validated decision or a necessary implementation detail. Map important acceptance criteria to concrete verification evidence. Repeat the review until coverage and consistency are complete.

During implementation and before delivery, compare actual changes and results against the Issue decisions, validated plan and acceptance criteria. Record discrepancies and actual verification evidence; routine adjustments consistent with the validated direction are autonomous, while consequential direction or risk changes require validation.

## 4. Plan validation and fresh-conversation handoff

Approval of a recommendation is not approval of the implementation plan. The conversational decision brief must clearly request approval of the concrete plan, not just agreement with the direction. Begin implementation only after the user explicitly validates that plan.

After plan validation, follow the default and exception defined in the common work contract and DEC-050 in `docs/DECISIONS.md`: a generic “validé, continue” does not cancel the fresh-conversation handoff. The ready-to-copy prompt points to this Issue and asks the new conversation to read the complete Issue/comments and repository instructions, reconstruct GitHub state, verify the plan remains valid, and implement autonomously. It is a launch instruction, not a second plan, and must not assume stale branch, commit, PR or CI state.

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


## 8. Issue-label lifecycle

`agents/AGENT-CONTRACT.md` §10 is the single canonical source for label taxonomy and the operational checklist. Apply it to mission Issues without duplicating its general requirements here.

### Creation and triage

- Choose exactly one state and one type from the canonical taxonomy. Select the type by the Issue's primary outcome and the state by its actual readiness; add relevant area labels only when useful.
- For a newly discovered nonconforming open Issue, correct its labels at the next meaningful touch. The automated live-label workflow detects drift and only repairs unambiguous unknown labels when a single canonical label already determines the intended family value.

### Checkpoints, transitions and blockers

- Apply the canonical checklist at mission start/resumption, meaningful checkpoints, state transitions and before interruption. The Issue body must remain independently resumable and consistent with actual work.
- When the state is `state:waiting`, `state:blocked` or `state:deferred`, use explicit fields in the Issue body: **Reason**, **Resumption / unblock / review condition**, and **Next action**. Explain the specific external dependency, internal prerequisite, or deliberate postponement respectively.
- The live-label workflow reports missing labels and competing canonical labels for explicit human resolution; it must not infer the intended state or type from prose.

### Closure and reopening

- Close completed or intentionally abandoned work using GitHub's native state and an appropriate native close reason. Never use `state:completed`.
- On reopening, re-triage the Issue and restore exactly one appropriate state label and one type label. Verify the labels actually stored by GitHub.
