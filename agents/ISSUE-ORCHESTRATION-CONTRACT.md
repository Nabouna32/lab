# Issue orchestration and automation contract

This contract refines `agents/PRODUCT-ISSUE-CONTRACT.md`. It defines how agents use GitHub Issues as an orchestration layer without making Issues a second source of truth.

## 1. Issue is the mission index

An Issue is the durable, human-readable index for a mission that benefits from cross-conversation coordination.

For `agent-system`, the Issue represents a concrete governance/evolution mission. It does not represent the Meta-Agent itself. The Meta-Agent remains the governance role above operational workers; there is no separate Agent System Worker role.

The authoritative state remains distributed by role:
- product intent: canonical `docs/` and validated decisions;
- implementation: Git branch, commits and PR;
- active recovery: handoff/checkpoint;
- audit evidence: immutable report and `LATEST.md`;
- validation: CI/browser checks.

The Issue links these artifacts and summarizes current status.

The Issue is a **mission index**, not the runtime state store. When an orchestration runtime exists, it may maintain coordination state such as claims, leases, dependencies and resume requests. That runtime must not override Git/GitHub evidence or canonical project decisions.

### State dimensions

Do not collapse all mission information into one state machine. Keep these dimensions conceptually distinct:

- **Mission lifecycle** — whether the mission is ready, active, awaiting a human decision, ready for delivery, merged or completed.
- **Worker execution** — what the current Worker is doing (RUNNING, WAITING_CI, RESUME_REQUIRED, WAITING_HUMAN, etc.).
- **Delivery** — branch, PR, head SHA, CI and merge state as reported by GitHub.
- **Runtime orchestration** — claim, lease, dependency and resume coordination.

The Issue body may summarize these dimensions compactly. It must never present a runtime intent such as RESUME_REQUIRED as proof that a Worker has actually resumed, and it must never present a claimed mission as proof that code or a PR exists.

## 2. Mission types

Use exactly one primary type:
- `product` — product decision or direction mission;
- `audit` — audit mission;
- `feature` — Feature Worker mission;
- `tool` — Tool Worker mission;
- `agent-system` — concrete agent-system/governance mission handled by the Meta-Agent; this is a mission type, not an agent role.

A mission that changes role must not silently change its primary type. Create a linked follow-up Issue when ownership genuinely changes.

## 3. Recommended labels

The canonical label vocabulary is:

### Type
- `type:product`
- `type:audit`
- `type:feature`
- `type:tool`
- `type:agent-system`

### State
- `state:discovery`
- `state:awaiting-validation`
- `state:implementing`
- `state:testing`
- `state:blocked`
- `state:ready-to-merge`
- `state:completed`
- `state:abandoned`

### Attention
- `needs:decision`
- `needs:investigation`
- `needs:fix`

Labels are a navigation aid, not an authoritative state machine. If the GitHub connector cannot create a missing label, the agent must not pretend it exists: keep the Issue body state explicit and continue without the label.

## 4. State model

The existing role-specific Issue states remain human-readable lifecycle states. They are not a universal runtime state machine.

For implementation missions, the orchestration protocol additionally recognizes these execution/runtime concepts:

- READY — eligible for a Worker claim;
- CLAIMED — a Worker currently owns the mission lease;
- RUNNING — the Worker is actively executing;
- WAITING_CI — implementation is delivered and the current PR/head SHA is awaiting CI;
- RESUME_REQUIRED — durable state says a Worker action is required;
- WAITING_HUMAN — a consequential decision is required;
- MERGE_READY — GitHub evidence satisfies merge prerequisites;
- MERGED — GitHub confirms the PR merged;
- COMPLETED — mission-specific cleanup and verification are complete.

These concepts may be represented by Issue state fields, checkpoint state and/or a future runtime state. They must not be treated as competing sources of truth.

A resume request is not a resume confirmation:
- RESUME_REQUIRED / WORKER_RESUME_REQUESTED means work is requested;
- WORKER_RESUMED means a Worker actually resumed and verified the real state.

A CI result is valid only for the corresponding PR/head SHA/run. Older CI results must not be applied to a newer commit.


### Product
`DISCOVERY → PROPOSAL → AWAITING_VALIDATION → DECIDED → SPEC_READY → IMPLEMENTATION_HANDOFF → CLOSED`

### Audit
`DISCOVERY → RUNNING → FINDINGS_READY → AWAITING_DECISION → FOLLOW_UP → COMPLETED`

An audit can finish at `COMPLETED` without implementation if findings are informational, rejected, deferred, or already addressed.

### Feature / Tool
`DISCOVERY → IMPLEMENTING → TESTING → PR_OPEN → CI_WAITING → READY_TO_MERGE → MERGED`

Terminal alternatives are `BLOCKED` and `ABANDONED`.

The Issue state must never claim `MERGED`, `COMPLETED` or `READY_TO_MERGE` without corresponding GitHub evidence.

## 5. Issue body as a compact state record

When an Issue is used as a mission tracker, keep a stable structure:

- **Mission**
- **Type**
- **State**
- **Objective**
- **Scope**
- **Non-goals**
- **Decisions**
- **Current checkpoint**
- **Canonical artifacts**
- **Branch / PR**
- **Verification**
- **Blockers**
- **Next action**

Do not paste large reports, source files, logs, secrets or full conversation transcripts.

## 6. Comments

Use comments for meaningful state transitions or human/agent decisions that should remain visible in the mission timeline.

Prefer updating the compact state in the Issue body for current status, and comments for events:
- mission claimed;
- important decision validated;
- blocker discovered;
- PR opened;
- CI failed;
- CI recovered;
- mission completed.

Do not emit a comment for every shell command or trivial checkpoint.

## 7. Ownership and claiming

A mission claim is a coordination primitive, not a Git branch claim by itself.

For roles using Git branches as their implementation ownership boundary, the branch remains authoritative for code ownership. A runtime claim must be reconciled with the actual branch/PR before work begins.

When a future runtime uses leases:

- a claim has an owner and lease expiry;
- only one active claim may exist for a mission;
- lease expiry creates a **recovery candidate**, not automatic permission to overwrite another Worker;
- the recovering Worker must inspect Git/GitHub/checkpoint state before modifying anything;
- claims must be idempotent and transactional.

For audits, the claim prevents duplicate active execution while docs/audits/<audit-id>/WORKING.md remains the audit's durable working state.

Before creating or claiming:
1. search for an existing matching Issue;
2. inspect its state and recent comments;
3. inspect relevant branches and PRs;
4. verify ownership.

An open Issue is not permission to take over an active branch.

If another worker owns the branch/PR, report the conflict and stop.

## 8. Crash recovery

On a new conversation:
1. identify the mission Issue when available;
2. read its current state;
3. inspect the active handoff/checkpoint;
4. inspect branch and PR;
5. inspect canonical docs and current `main`;
6. reconstruct the real state.

If the Issue disagrees with Git/GitHub or canonical documentation, correct the Issue rather than the authoritative source.

For `agent-system` missions, the recovery chain is `Issue → agent-system checkpoint → Git branch/PR → canonical contracts/decisions`. This recovers mission state, not a separate global Meta-Agent memory.

## 9. Automation boundary

The orchestration layer may derive or request:

- READY missions;
- dependency readiness;
- lease/claim status;
- RESUME_REQUIRED;
- WAITING_HUMAN;
- candidate recovery after lease expiry.

It must not invent project facts. GitHub remains authoritative for PR, CI and merge state.

External events must carry stable source identity where available (source, source_event_id, and for CI run_id, pr_number, head_sha) so duplicate delivery can be ignored safely.


Agents may autonomously:
- search/create/reuse/update mission Issues;
- add available labels;
- add concise status comments;
- link branches, PRs, reports and checkpoints;
- close terminal Issues when the contract's completion condition is actually verified.

Agents must not autonomously:
- approve a consequential product decision merely because an Issue requests it;
- treat an Issue label as authorization to implement;
- close an Issue while the underlying mission is still unresolved;
- rewrite canonical product decisions to match an Issue.

## 10. GitHub Projects

GitHub Projects are optional visualization/orchestration only.

They must not become a required dependency for agent correctness. If Project API access becomes available, use it to visualize/filter Issue state and workload. Do not store unique mission truth only in a Project field.

The current ChatGPT GitHub connector exposes Issue/PR operations but no GitHub Project-specific operations. Therefore the agent system must work fully without Projects.

## 11. Cross-agent handoff

When a mission changes owner:
- keep the original Issue when the mission remains conceptually the same;
- update the current owner/state;
- link the next worker's branch/PR/checkpoint;
- preserve the previous agent's evidence;
- do not copy the entire history into a new Issue.

For an audit finding that becomes implementation work, link the correction Feature/Tool Issue to the audit Issue and historical report.

## 12. Completion

A mission Issue is terminal only when:
- the canonical artifact is persisted;
- implementation/PR state is resolved when applicable;
- required CI/verification is green;
- required decisions are recorded;
- the active checkpoint has been removed from the final merged implementation/cleanup change;
- the next action is either unnecessary or tracked by a separate Issue.

For implementation missions, the Issue MUST remain non-terminal while the final PR is open or awaiting CI. The terminal Issue state is applied only after the PR containing the checkpoint cleanup has merged and its verification is confirmed.

Then set the appropriate terminal state and close the Issue with an explicit reason.

### Runtime event vocabulary

A future orchestration runtime may record events such as:

MISSION_CREATED, MISSION_READY, MISSION_CLAIMED, MISSION_STARTED, PR_OPENED, CI_STARTED, CI_FAILED, CI_PASSED, RESUME_REQUIRED, WORKER_RESUME_REQUESTED, WORKER_RESUMED, HUMAN_DECISION_REQUIRED, HUMAN_DECISION_RECORDED, MERGE_READY, PR_MERGED, MISSION_COMPLETED, MISSION_ABANDONED, WORKER_LEASE_EXPIRED.

Events are history, not authoritative project state. The current mission state is derived from durable coordination state plus Git/GitHub evidence.


A mission Issue is terminal only when:
- the canonical artifact is persisted;
- implementation/PR state is resolved when applicable;
- required CI/verification is green;
- required decisions are recorded;
- the active checkpoint has been removed from the final merged implementation/cleanup change;
- the next action is either unnecessary or tracked by a separate Issue.

For implementation missions, the Issue MUST remain non-terminal while the final PR is open or awaiting CI. The terminal Issue state is applied only after the PR containing the checkpoint cleanup has merged and its verification is confirmed.

Then set the appropriate terminal state and close the Issue with an explicit reason.
