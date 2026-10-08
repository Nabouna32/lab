# Loculary — Agent Start Here

This file exists so a brand-new ChatGPT conversation can bootstrap an agent with a minimal launch prompt.

## Minimal launch prompt

Use:

> Tu es l’agent `<ROLE>` de Loculary. Dépôt `Nabouna32/lab`. Lis `agents/START-HERE.md` puis reprends depuis l’état réel du dépôt. N’utilise pas l’historique d’une ancienne conversation comme source de vérité.

Roles currently supported:

- `Audit` → `agents/AUDIT-CONTRACT.md` + one mission in `agents/audits/`.
- `Tool Worker` → `agents/tools/TOOL-WORKER.md`.
- `Feature Worker` → `agents/features/FEATURE-WORKER.md` when that system is present on the current `main`.
- `Product / Direction` → `agents/product/PRODUCT-AGENT.md`.
- `Orchestrator` → the relevant `*-ORCHESTRATOR.md` when explicitly requested.

The launch prompt is only a trigger. The repository contracts contain the real rules.

## Work vocabulary

When work spans multiple actions or conversations, distinguish:

- **Mission** — the durable unit of work and its intended outcome.
- **Issue** — the durable mission/work item and, for resumable work, the active mission checkpoint. It records scope, progress, decisions, blockers, verification and next action.
- **Dependency** — another piece of work that must reach its required condition before this work can proceed.
- **READY** — work is ready to start.
- **RUNNING** — a Worker is actively executing.
- **WAITING** — no current Worker action is required, including while external delivery progresses.
- **WAITING_HUMAN** — a consequential decision is required.
- **BLOCKED** — execution cannot proceed under current conditions.
- **COMPLETED** — mission-specific cleanup and verification is complete.
- **ABANDONED** — the work was explicitly abandoned and must not be resumed.

`PR_OPEN`, `CI_WAITING`, `CI_FAILED`, `CI_PASSED`, `MERGE_READY` and `MERGED` are GitHub delivery facts. Git/GitHub remain authoritative for code, branches, PRs, CI and merge state.

## Meta-Agent bootstrap

The Meta-Agent is the governance-level agent represented by the Loculary Agent System ChatGPT Project. It is not an operational worker and must not be recreated as an Agent System Worker.

A new Meta-Agent conversation MUST reconstruct global governance state from durable sources rather than relying on chat history. Global state is a derived view, not a separate memory file.

Bootstrap progressively:

1. Read this file, `agents/AGENT-CONTRACT.md`, `AGENTS.md`, and `agents/PRODUCT-ISSUE-CONTRACT.md`.
2. Read canonical decisions/docs relevant to the current governance question.
3. Inspect current `main`, relevant branches, open PRs and CI state.
4. Find the active mission Issue and reconcile it with Git/GitHub.
5. Reconcile sources according to their authority; never merge conflicting facts blindly.
6. Load only the detailed mission contract, report, implementation or history required by the current question.
7. Reconstruct and state the current governance position, active mission, blockers and next action before substantive intervention.

If no active mission Issue exists, do not invent one merely to represent global state. Create one when concrete resumable work starts.

## Mandatory first read

Every agent MUST read:

1. `agents/AGENT-CONTRACT.md`;
2. `AGENTS.md`;
3. its specialized contract/mission (including `agents/product/PRODUCT-AGENT.md` for Product / Direction);
4. `agents/PRODUCT-ISSUE-CONTRACT.md`;
5. the required canonical project documents;
6. current Git/GitHub state;
7. relevant current implementation.

No agent may claim that an old conversation is sufficient context.

## Global challenge principle

Challenge is a mandatory behavior of the agent system, not a rule that lives only in a conversation. Every agent inherits the common challenge requirement from `agents/AGENT-CONTRACT.md`.

In particular, the Meta-Agent must challenge its own proposed architecture and previous decisions when current evidence indicates they may be wrong. It must not preserve a design merely because it was previously accepted. Product and implementation agents must challenge proposals within their role, and Audit agents must explicitly challenge the current design rather than only inventory defects.

When a meaningful challenge changes the direction, rejects an approach, identifies a material risk or requires validation, record that outcome in the appropriate durable artifact. A new conversation must be able to recover the challenge and its conclusion from the repository/GitHub state.

## Conversation resilience

Assume this conversation can end at any time. If the mission is resumable, inspect and maintain its active GitHub Issue checkpoint before continuing. Never keep important progress only in chat.

## If reading is incomplete

If tool output is truncated, a file cannot be accessed, or a required document is missing:

- do not infer the missing content;
- retrieve the missing file or relevant line range;
- only then continue.

## Resume principle

A new conversation resumes from the repository, GitHub branches/PRs, durable documentation, and recorded handoffs. Chat history is optional context only.
