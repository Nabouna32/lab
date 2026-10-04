# Loculary — Common Agent Contract

This is the common, mandatory operating contract for every autonomous Loculary agent.
Specialized contracts (audit, tool, feature, and future agent types) refine this contract; they must not weaken it.

## 1. Conversation independence

A ChatGPT conversation is temporary context, not project memory.
The repository and GitHub state are the durable source of truth.
An agent MUST be able to start correctly in a brand-new conversation with only its role/mission launch prompt.

Never assume that:

- a previous chat still exists;
- a previous assistant decision is still valid;
- a branch/PR still exists;
- code or documentation still matches an earlier conversation.

Re-discover the current state from the repository and GitHub every time.

## 2. Mandatory bootstrap gate

Before substantive analysis, coding, auditing, or Git operations, the agent MUST:

1. read this contract;
2. read `AGENTS.md`;
3. read its specialized contract/mission;
4. identify the canonical product/project documents required by that specialization;
5. inspect the current Git state and current `main`;
6. inspect relevant GitHub branches and open PRs when the task can be concurrent;
7. inspect the current implementation relevant to the task;
8. identify existing work, decisions, blockers, and ownership.

The agent MUST NOT begin implementation or audit conclusions while mandatory bootstrap items remain unread.

If a file is missing, inaccessible, or truncated, stop and retrieve the missing content/range before continuing. Never treat a partial tool result as a complete read.

## 3. Source hierarchy

Use sources according to their role:

1. Git/GitHub — actual current implementation and history;
2. canonical project documentation — durable product, architecture, privacy, UX and decision intent;
3. specialized agent contracts/missions — operating procedure and task scope;
4. current audit/worker reports — historical evidence and handoffs;
5. conversation — temporary context only.

When sources disagree, expose the divergence and resolve it according to the project's documented decision process. Never silently rewrite a durable source to hide an implementation mismatch.

## 4. Persistent project memory

Loculary does not depend on ChatGPT conversation memory for correctness.
Its persistent memory is distributed across durable repository/GitHub state:

- contracts and missions under `agents/`;
- canonical product/architecture documentation under `docs/`;
- decisions and discussions;
- `STATUS.md` when present;
- Git branches and commits;
- GitHub pull requests and their descriptions/checks;
- GitHub Issues when a mission uses the shared Issue protocol;
- `agents/ISSUE-ORCHESTRATION-CONTRACT.md` for Issue lifecycle, labels and automation boundaries;
- immutable audit reports and `LATEST.md` pointers;
- implementation/worker handoffs where defined.

A new conversation MUST reconstruct its context from these sources.
Do not create a second informal memory system in chat messages.

## 5. Conversation failure resilience

A conversation ending, truncating, timing out, or otherwise failing is a normal operating condition.

Every resumable mission MUST follow `agents/HANDOFF-CONTRACT.md`.

The agent must persist meaningful progress during the work, not only in its final response. Before and after checkpoint-worthy actions, record the intended action/result in the mission checkpoint and persist it durably according to the specialized contract.

A checkpoint is a recovery aid, not a substitute for Git/GitHub truth. Git/GitHub wins when the checkpoint and repository state disagree.

The agent MUST NOT assume that a final response will ever be produced.

## 5. Rule precedence and anti-skipping

Rules are cumulative unless a higher-authority source explicitly overrides a lower one.
A specialized mission may narrow or add requirements but cannot remove common safety, source-of-truth, verification, ownership, or documentation rules.

Do not skip a rule because:

- it appears repetitive;
- another document probably says the same thing;
- the task looks small;
- the model believes it already knows the rule;
- the conversation is long;
- tool output was truncated.

When a rule matters to the current step, verify it from the canonical source rather than relying on memory.

## 6. Work one validated scope at a time

Before a significant change, establish:

- objective;
- exact scope;
- important consequences;
- decisions already validated;
- decisions still requiring validation.

Do not silently expand scope.
If implementation reveals a consequential decision or unrelated architectural/product issue, stop and surface it.
Routine details inside an already validated scope may be chosen autonomously.

## 7. Concurrency and ownership

Assume other independent ChatGPT conversations may work concurrently.

Before claiming work:

- inspect current `main`;
- inspect relevant branches;
- inspect relevant open PRs;
- identify existing ownership.

Never modify, reset, force-push, close, or merge another worker's branch/PR unless the current task explicitly grants that responsibility.

Branches are ownership boundaries.

## 8. Verification and evidence

Do not claim that something was read, tested, green, merged, verified, or complete unless it was actually verified.

After a change:

1. inspect the diff;
2. run relevant tests/checks;
3. fix failures introduced by the change;
4. re-check scope and documentation consistency;
5. verify GitHub state before reporting PR/CI/merge status.

For audits, distinguish observation, measurement, deduction, proposal and decision as required by the audit contract.

## 9. Documentation continuity

Durable discoveries, decisions, architecture changes, blockers, and handoff state belong in the appropriate repository documentation or GitHub artifact.
Do not rely on a final chat message as the only record of important state.

Do not rewrite historical records to make the current state look cleaner.

## 10. Completion receipt

At the end of a meaningful run, report the durable state succinctly:

- role/mission;
- current state;
- branch/PR when applicable;
- verification performed and actual result;
- blockers or decisions required;
- next resumable action.

The receipt is useful for the user, but it is NOT the persistent memory. The repository/GitHub state remains authoritative.
