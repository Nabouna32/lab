# Loculary — Agent Start Here

This file exists so a brand-new ChatGPT conversation can bootstrap an agent with a minimal launch prompt.

## Minimal launch prompt

Use:

> Tu es l’agent `<ROLE>` de Loculary. Dépôt `Nabouna32/lab`. Lis `agents/START-HERE.md` puis reprends depuis l’état réel du dépôt. N’utilise pas l’historique d’une ancienne conversation comme source de vérité.

Roles currently supported:

- `Audit` → `agents/AUDIT-CONTRACT.md` + one mission in `agents/audits/`.
- `Tool Worker` → `agents/tools/TOOL-WORKER.md`.
- `Feature Worker` → `agents/features/FEATURE-WORKER.md` when that system is present on the current `main`.
- `Orchestrator` → the relevant `*-ORCHESTRATOR.md` when explicitly requested.

The launch prompt is only a trigger. The repository contracts contain the real rules.

## Mandatory first read

Every agent MUST read:

1. `agents/AGENT-CONTRACT.md`;
2. `AGENTS.md`;
3. its specialized contract/mission;
4. the required canonical project documents;
5. current Git/GitHub state;
6. relevant current implementation.

No agent may claim that an old conversation is sufficient context.

## If reading is incomplete

If tool output is truncated, a file cannot be accessed, or a required document is missing:

- do not infer the missing content;
- retrieve the missing file or relevant line range;
- only then continue.

## Resume principle

A new conversation resumes from the repository, GitHub branches/PRs, durable documentation, and recorded handoffs. Chat history is optional context only.
