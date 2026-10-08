# Loculary — GitHub Issue Protocol

GitHub Issues are a durable orchestration and tracking layer for agent work. They complement, and never replace, repository/Git sources of truth.

## 1. When to use an Issue

An Issue is the durable mission record whenever work spans multiple actions, may cross a conversation boundary, needs follow-up, or represents an actionable audit/product/governance task. It is also the active checkpoint for that work.

A trivial atomic change that starts and finishes in one validated action may omit an Issue.

Do not create an Issue for trivial work solely to satisfy a protocol.

## 2. Issue roles

Use an Issue for:
- product or governance work that needs durable tracking;
- an audit mission when tracking is useful;
- a Feature or Tool mission explicitly run as Issue-driven work;
- actionable follow-up work from an audit;
- cross-agent blockers or handoffs.

For direct autonomous Worker requests, the Worker may operate without an Issue.

## 3. Source hierarchy

Issues are tracking and coordination artifacts.

They do not replace:
1. Git and the current implementation;
2. canonical product/architecture/decision documentation;
3. agent contracts and mission files;
4. checkpoints and handoffs;
5. immutable audit reports;
6. pull requests and CI evidence.

If an Issue conflicts with an authoritative source, update the Issue rather than changing the authoritative source to match it.

## 4. Issue content

Keep an Issue concise and durable. When used as a work item, include as applicable:
- objective;
- type;
- current state;
- validated scope;
- non-goals;
- source/evidence;
- decisions and decisions required;
- current Issue checkpoint state;
- branch/PR;
- verification;
- blockers;
- next action.

Do not paste complete reports, source files, logs, secrets or conversation transcripts.

## 5. Audit follow-up

An audit finding does not automatically become an Issue.

Create or reuse an Issue when a finding is sufficiently actionable to justify durable implementation follow-up.

The Issue must link to the historical audit report and preserve the distinction between:
- observed evidence;
- deduction;
- proposal;
- validated decision;
- implementation work.

An audit finding that still requires a consequential product or architecture decision remains a finding/proposal until that decision is validated.

## 6. Issue-driven Worker

When a Worker is explicitly given an Issue:
1. read the Issue and relevant comments;
2. inspect linked evidence;
3. inspect current main, relevant branches and PRs;
4. inspect the active checkpoint when present;
5. verify that the requested work is still valid;
6. challenge the requested approach;
7. stop for an unvalidated consequential decision.

The Issue is an entry point and coordination record. It is not authorization to take over another Worker or to make an unvalidated decision.

## 7. Ownership and concurrency

Branches are the practical implementation ownership boundary.

Before creating or reusing an Issue:
- search for an existing matching work item;
- inspect its state;
- inspect relevant branches and PRs;
- identify current ownership.

An open Issue does not grant permission to modify another Worker's branch or PR.

## 8. Recovery

An Issue-driven mission can be reconstructed from:

`Issue → checkpoint/handoff → Git branch/PR → canonical documentation`

An autonomous Worker without an Issue can be reconstructed from its checkpoint, branch/PR and GitHub state when those exist.

Never invent an Issue merely to represent global agent state.

## 9. Closing

Close an Issue only when its work is terminal:
- the required decision is recorded;
- the audit report is persisted;
- the implementation PR is merged and verified;
- the mission is explicitly abandoned; or
- remaining work has been moved to a separate durable work item.

Closing an Issue does not delete the underlying repository, report or PR history.

## 10. Prohibited uses

Issues must not become:
- a runtime state database;
- a claim/lease mechanism;
- a second implementation history;
- a replacement for Git branches or PRs;
- automatic authorization for consequential decisions.

For active missions, however, the Issue is intentionally the durable execution checkpoint: update it rather than creating a repository checkpoint file.
