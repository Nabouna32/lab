# Loculary — Autonomous Tool Factory

This directory defines the repository-local protocol for creating Loculary tools through one or more independent ChatGPT sessions.

## Purpose

The user may open several ChatGPT conversations at the same time and give each conversation the same worker mission. Each conversation is an independent **Tool Worker** operating against the real repository.

The workers coordinate through Git/GitHub, not through the conversation history.

The intended user interaction is deliberately small:

- **"Ajoute un outil"** — choose and build one valuable tool not already claimed.
- **"Ajoute plusieurs outils"** — choose one unclaimed tool for this worker; the user can give the same instruction to other chats.
- **"Continue"** — inspect the repository, current branches and PRs, then resume the worker's unfinished task or choose the next unclaimed tool.
- **"Continue sur cet outil: <slug>"** — resume a specific tool branch/PR.

A worker must never assume that another conversation is idle. The repository and GitHub state are authoritative.

## Files

- `TOOL-FACTORY-CONTRACT.md` — canonical rules shared by all tool-creation agents.
- `TOOL-WORKER.md` — the reusable autonomous prompt to give to each ChatGPT conversation.
- `TOOL-ORCHESTRATOR.md` — optional coordinator protocol for a conversation that supervises several workers.
- `claims/` — optional durable claim records when a task needs an explicit product/tool claim.
- `queue/` — optional future backlog; its entries are proposals, not automatic commitments.

## Parallelism model

Every worker owns exactly one tool branch at a time:

`feat/tool/<slug>`

The branch name is the primary concurrency lock. A worker must first verify that the branch does not already exist. If it exists, that tool is considered claimed and the worker chooses another tool unless explicitly asked to resume it.

A worker must not:

- work on another worker's branch;
- modify another worker's PR;
- reuse another worker's tool slug;
- reset or force-push another worker's branch;
- rewrite another worker's files.

Workers should keep tool-specific changes isolated and minimize edits to shared platform files. Shared architecture changes are never smuggled into a tool PR; they are proposed separately when necessary.

## Important limitation

The repository protocol does not spawn ChatGPT conversations automatically. ChatGPT sessions remain separate. The protocol makes those sessions safe to run concurrently by giving them the same deterministic rules and using Git/GitHub as their shared state.

The user therefore only needs to open several chats and give each the worker prompt. Each chat can then operate autonomously and independently.
