# Loculary — GitHub Issue Protocol

GitHub Issues are a durable orchestration and tracking layer for agent work. They complement, and never replace, repository/Git sources of truth.

## 1. Source hierarchy

Use:
1. Git/code for actual implementation;
2. canonical docs for durable product/architecture intent;
3. contracts and mission files for operating rules;
4. Issues for mission tracking, coordination and concise status;
5. conversation for temporary context.

An Issue must never be treated as authoritative merely because it is newer than a repository document.

## 2. When to use an Issue

Create or reuse an Issue when a mission benefits from durable tracking across conversations, agents or PRs.

Good candidates:
- product decisions or proposals spanning multiple conversations;
- audits;
- Feature Worker missions;
- Tool Worker missions;
- cross-agent blockers;
- follow-up work from findings.

Do not create an Issue for every trivial action.

## 3. Issue identity

An Issue should have a stable, concise title identifying the mission, for example:
- product: decide <topic>
- audit 12: <mission>
- feature: <slug>
- tool: <slug>
- agent-system: <topic>

If an existing Issue already represents the same mission, reuse it rather than creating a duplicate.

## 4. Required mission information

When an Issue is used as a mission tracker, keep it concise and include:
- objective;
- current state;
- validated scope or scope under discussion;
- decisions required;
- links to canonical files;
- branch/PR links when they exist;
- latest meaningful status.

Do not duplicate the complete report, implementation or documentation.

## 5. Audit Issues

An audit Issue MAY track:
- audit ID and mission;
- target/current main SHA when the audit starts;
- audit state;
- active checkpoint/report paths;
- concise findings and severity counts;
- decisions required;
- resulting correction PRs;
- completion status.

The immutable audit report remains the historical evidence. WORKING.md remains the recovery checkpoint. The Issue is a navigational/tracking layer.

Audit workers MUST NOT treat Issue comments as a substitute for WORKING.md or the historical report.

## 6. Worker Issues

Feature and Tool Workers MAY use an Issue to track:
DISCOVERY → IMPLEMENTING → TESTING → PR_OPEN → CI_WAITING → READY_TO_MERGE → MERGED/BLOCKED/ABANDONED.

The branch, PR and Git history remain authoritative for implementation state.

## 7. Updates and concurrency

Before creating or claiming a mission:
- search for an existing matching Issue;
- inspect its state and recent comments;
- inspect branches and PRs;
- identify ownership.

Do not claim another worker's mission merely because an Issue is open.

An Issue can coordinate ownership, but the branch/PR ownership boundary remains decisive for implementation.

## 8. Crash recovery

A new conversation should be able to reconstruct a mission from:
Issue → checkpoint/handoff → Git branch/PR → canonical docs.

If these disagree, Git/GitHub implementation state and canonical documentation take precedence according to their roles.

## 9. Issue hygiene

Keep Issues:
- concise;
- current enough to navigate;
- free of secrets and private data;
- linked to durable repository artifacts;
- explicit about blockers and decisions.

Do not rewrite history to make an Issue look cleaner. Correct stale status with an explicit update.

## 10. Closing

Close an Issue only when its mission is terminal:
- product decision recorded and no implementation remains in scope;
- audit completed and report persisted;
- worker PR merged or mission explicitly abandoned;
- blocker moved to a separately tracked mission.

Closing an Issue does not delete the underlying Git/report history.
