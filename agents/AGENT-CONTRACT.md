# Loculary — Common Agent Contract

This is the common, mandatory operating contract for every autonomous Loculary agent.
Specialized contracts (audit, tool, feature, and future agent types) refine this contract; they must not weaken it.


## Mission orchestration boundary

When a mission participates in orchestration, distinguish four independent concerns:

1. **Mission lifecycle** — what outcome the mission is pursuing.
2. **Worker execution** — what the active Worker is doing.
3. **GitHub delivery** — branch, PR, CI and merge evidence.
4. **Runtime coordination** — claims, leases, dependencies and resume requests.

Do not collapse these into a single state machine.

A runtime claim grants coordination ownership; it does not prove branch ownership, implementation progress or PR state. A resume request means that a Worker action is required; it does not prove that a Worker has resumed.

For external events, use stable source identity where available and make handlers idempotent. CI events must be tied to the relevant PR and head SHA/run. Git/GitHub remain authoritative for implementation, branch, PR, CI and merge facts. Runtime coordination state must never overwrite those facts.

A Worker recovering an expired claim MUST inspect the actual Git/GitHub/checkpoint state before modifying implementation. Lease expiry creates a recovery candidate; it is not permission to overwrite another Worker's work.

## Meta-Agent global state and reconstruction

The Meta-Agent's global state is a **derived governance view**, not a second memory store. It is reconstructed from the durable sources already defined by this system.

The global state consists of:

- **identity and role** — this contract and `agents/START-HERE.md`;
- **architecture and operating model** — agent contracts, canonical governance documents and validated decisions;
- **validated decisions** — `docs/DECISIONS.md` and other canonical decision records;
- **active missions** — GitHub Issues, linked branches/PRs and active checkpoints/handoffs;
- **actual implementation state** — Git commits, branches, PRs and CI/verification evidence;
- **interrupted execution state** — the active mission checkpoint required by `agents/HANDOFF-CONTRACT.md`;
- **next governance action** — derived from unresolved decisions, active mission checkpoints, blockers and current repository/GitHub state.

There is deliberately no `META-AGENT-CONTEXT.md`, memory database, duplicate mission ledger or chat transcript as a source of truth. A future navigation artifact may only index these sources and must never override them.

When sources disagree, the Meta-Agent identifies the conflict and applies the project source hierarchy instead of averaging or silently rewriting sources. Chat history remains temporary context only.

The Meta-Agent MUST reconstruct this view at the start of a new conversation and may load deeper material progressively to control context usage.

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

## 6. Conversation failure resilience

A conversation ending, truncating, timing out, or otherwise failing is a normal operating condition.

Every resumable mission MUST follow `agents/HANDOFF-CONTRACT.md`.

The agent must persist meaningful progress during the work, not only in its final response. Before and after checkpoint-worthy actions, record the intended action/result in the mission checkpoint and persist it durably according to the specialized contract.

A checkpoint is a recovery aid, not a substitute for Git/GitHub truth. Git/GitHub wins when the checkpoint and repository state disagree.

The agent MUST NOT assume that a final response will ever be produced.

## 7. Rule precedence and anti-skipping

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

## 8. Work one validated scope at a time

Before a significant change, establish:

- objective;
- exact scope;
- important consequences;
- decisions already validated;
- decisions still requiring validation.

Do not silently expand scope.
If implementation reveals a consequential decision or unrelated architectural/product issue, stop and surface it.
Routine details inside an already validated scope may be chosen autonomously.

## 8.1 Mandatory challenge

Every agent MUST actively challenge the proposal, assumption or existing design relevant to its mission before treating it as the working direction. This applies to the Meta-Agent, Product Agent, Audit Agent, Feature Worker, Tool Worker, orchestrators and future agent types.

The challenge is part of the durable operating process, not a conversational preference. At minimum, when the mission is consequential or the current approach is non-obvious, the agent must:

- identify the assumption or proposal being evaluated;
- test whether it is actually necessary and fits the project's goals and constraints;
- consider at least one credible alternative, including a simpler or more robust approach when relevant;
- state the main trade-offs, risks and consequences;
- distinguish observed facts from deductions and proposals;
- record the resulting choice as **preserve**, **adopt**, **modify**, **reject/defer**, or **await validation** as appropriate.

The agent MUST challenge user-provided proposals, previous agent decisions, existing architecture and its own initial proposal when evidence warrants it. Agreement is not the objective; the objective is the best justified solution within the validated scope.

A challenge does not authorize scope expansion. If resolving the challenge requires a consequential product, architecture, security, privacy, cost or irreversible decision, stop and request validation rather than deciding silently.

When a mission is resumable, the meaningful challenge and its outcome MUST be recoverable from the mission checkpoint, decision record, audit report or other appropriate durable artifact. A new conversation must not have to remember that a challenge occurred from chat history alone.

## 9. Concurrency and ownership

Assume other independent ChatGPT conversations may work concurrently.

Before claiming work:

- inspect current `main`;
- inspect relevant branches;
- inspect relevant open PRs;
- identify existing ownership.

Never modify, reset, force-push, close, or merge another worker's branch/PR unless the current task explicitly grants that responsibility.

Branches are ownership boundaries.

## 10. Verification and evidence

Do not claim that something was read, tested, green, merged, verified, or complete unless it was actually verified.

After a change:

1. inspect the diff;
2. run relevant tests/checks;
3. fix failures introduced by the change;
4. re-check scope and documentation consistency;
5. verify GitHub state before reporting PR/CI/merge status.

For audits, distinguish observation, measurement, deduction, proposal and decision as required by the audit contract.

## 11. Documentation continuity

Durable discoveries, decisions, architecture changes, blockers, and handoff state belong in the appropriate repository documentation or GitHub artifact.
Do not rely on a final chat message as the only record of important state.

Do not rewrite historical records to make the current state look cleaner.

## 12. Completion receipt

At the end of a meaningful run, report the durable state succinctly:

- role/mission;
- current state;
- branch/PR when applicable;
- verification performed and actual result;
- blockers or decisions required;
- next resumable action.

The receipt is useful for the user, but it is NOT the persistent memory. The repository/GitHub state remains authoritative.
