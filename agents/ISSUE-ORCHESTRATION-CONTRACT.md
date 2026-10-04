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
- the next action is either unnecessary or tracked by a separate Issue.

Then set the appropriate terminal state and close the Issue with an explicit reason.
