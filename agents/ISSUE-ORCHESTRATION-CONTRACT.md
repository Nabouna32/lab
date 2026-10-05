# Issue orchestration contract

This contract defines when GitHub Issues are used as durable work items without making Issues a second source of truth.

## 1. Issue role

A GitHub Issue is a durable, human-readable work item used when work benefits from cross-conversation coordination, explicit follow-up, or durable assignment.

An Issue is **not mandatory for every Worker action**.

Use an Issue when:
- an audit finding becomes actionable implementation work;
- a feature or tool is explicitly delivered as an orchestrated mission;
- a governance or agent-system task needs durable follow-up;
- the work must be handed from one conversation/agent to another through GitHub.

For a direct autonomous Worker request, an Issue may be absent.

The authoritative state remains distributed by role:
- product intent: canonical `docs/` and validated decisions;
- implementation: Git branch and commits;
- delivery: pull request, CI and merge state from GitHub;
- active recovery: checkpoint/handoff;
- audit evidence: immutable report and `LATEST.md`.

The Issue links these artifacts and summarizes the work. It never replaces them.

## 2. Worker modes

Workers operate in one of two modes.

### Autonomous Worker

The user directly asks a Worker to perform work without providing an Issue.

Durable workflow:

`Worker → checkpoint → branch → implementation → PR → CI/verification → merge → checkpoint cleanup`

An Issue is optional.

### Issue-driven Worker

The user or Meta-Agent explicitly gives the Worker an Issue to process.

Durable workflow:

`Issue → Worker bootstrap → checkpoint → branch → implementation → PR → CI/verification → merge → checkpoint cleanup → Issue completion`

The Issue is the durable entry point and coordination record.

The Worker must never assume that an Issue is authorization to make an unvalidated consequential product, architecture, security, privacy, legal or cost decision.

## 3. Audit finding → Issue

An audit finding does not automatically become an Issue.

The audit keeps:
- evidence and analysis in its immutable historical report;
- active progress in its temporary `WORKING.md`;
- proposals and decisions in their appropriate canonical locations.

Create or reuse an Issue only when a finding is sufficiently actionable to justify durable implementation follow-up.

The Issue must link back to the audit report and identify:
- the verified finding;
- its severity when applicable;
- the intended scope;
- decisions already validated;
- decisions still requiring validation;
- the expected next action.

A proposal that still requires a product or architecture decision remains a proposal until that decision is made.

## 4. Issue-driven Worker bootstrap

When told to process an Issue:

1. read the common and specialized Worker contracts;
2. read the Issue and recent relevant comments;
3. inspect linked audit/report/documentation evidence;
4. inspect current `main`, relevant branches and open PRs;
5. inspect any active checkpoint linked to the work;
6. verify that the Issue's underlying problem or requested work is still valid;
7. challenge the requested approach and identify alternatives when relevant;
8. proceed only within the validated scope.

If the finding is already fixed, obsolete, duplicated, or otherwise no longer actionable, do not create unnecessary implementation work. Record the evidence and resolve the Issue according to its actual state.

If the Issue is underspecified or requires a consequential decision that has not been validated, stop and request that decision.

An open Issue is not permission to take over another Worker’s branch or PR.

## 5. Issue body

When an Issue is used as a work item, keep a compact stable structure:

- **Work / Mission**
- **Type**
- **State**
- **Objective**
- **Scope**
- **Non-goals**
- **Source / Evidence**
- **Decisions**
- **Checkpoint**
- **Branch / PR**
- **Verification**
- **Blockers**
- **Next action**

Do not paste large reports, source files, logs, secrets or conversation transcripts.

For audit-derived work, **Source / Evidence** should link to the historical audit report.

## 6. States and labels

Use the existing human-readable labels where available:
- `type:product`
- `type:audit`
- `type:feature`
- `type:tool`
- `type:agent-system`
- `state:discovery`
- `state:awaiting-validation`
- `state:implementing`
- `state:testing`
- `state:blocked`
- `state:ready-to-merge`
- `state:completed`
- `state:abandoned`
- `needs:decision`
- `needs:investigation`
- `needs:fix`

Labels are navigation aids, not an authoritative state machine. If a label is unavailable, keep the state explicit in the Issue body.

Delivery facts such as PR open, CI status and merge state must be verified from GitHub rather than inferred from labels.

## 7. Ownership and concurrency

The Git branch is the practical implementation ownership boundary.

Before starting Issue-driven implementation:
1. inspect current `main`;
2. inspect relevant branches and PRs;
3. identify existing ownership;
4. inspect any linked checkpoint;
5. choose or create the Worker branch only when ownership is clear.

If another Worker owns the branch or PR, stop and report the conflict.

Never force-push, reset, overwrite, or close another Worker’s implementation.

## 8. Recovery

On a new conversation:
1. identify the Issue when the work is Issue-driven;
2. inspect its current body and relevant comments;
3. inspect the active checkpoint when present;
4. inspect branch and PR state;
5. inspect canonical documents and current `main`;
6. reconstruct the real state from those durable sources.

If the Issue disagrees with Git/GitHub or canonical documentation, correct the Issue rather than the authoritative source.

If there is no Issue, reconstruct an autonomous Worker task from its checkpoint, branch/PR and GitHub state when those exist. Do not invent an Issue merely to represent global state.

## 9. Cross-agent handoff

When the same work changes Worker or conversation:
- keep the same Issue when it exists;
- keep the existing branch/PR when ownership legitimately continues;
- link the new checkpoint;
- preserve previous evidence;
- do not duplicate the work into a second Issue without a real ownership or scope change.

When an audit finding becomes implementation work, link the implementation Issue to the audit Issue/report when applicable.

## 10. Completion

An Issue-driven implementation is terminal only when:
- the intended durable artifact is persisted;
- the implementation/PR state is resolved when applicable;
- required CI/verification is green;
- required decisions are recorded;
- the active checkpoint has been removed after terminal verification;
- no unresolved next action remains, or that action is tracked separately.

For implementation work, do not mark an Issue completed while the final PR is still open or required CI is unresolved.

Close the Issue only after the actual GitHub state and required verification support completion.

## 11. What Issues must not become

Issues must not become:
- a runtime state database;
- a claim/lease system;
- a second implementation history;
- a replacement for checkpoints;
- a replacement for Git branches or PRs;
- an automatic authorization mechanism for consequential decisions.

The system must remain correct without any external runtime or database-backed Issue dispatcher.
