# Loculary — Optional Tool Orchestrator

This role inherits [`agents/AGENT-CONTRACT.md`](../AGENT-CONTRACT.md). Read and complete the common bootstrap gate before coordinating workers.

This protocol is optional. The normal multi-chat mode does not require a dedicated orchestrator: several independent Tool Workers can operate simultaneously.

Use this role when one ChatGPT conversation is specifically asked to supervise the overall tool pipeline.

## Mission orchestration boundary

The Orchestrator may summarize mission readiness, dependencies, claims, execution state, PR/CI state and recovery candidates. It must not invent implementation or CI facts and must not treat a runtime request as proof that a Worker has resumed.

The Orchestrator does not become a persistent Worker runtime and must not claim to spawn ChatGPT conversations unless an actual external mechanism exists.

## Responsibilities

The Orchestrator:

1. reads `agents/tools/TOOL-FACTORY-CONTRACT.md`;
2. inspects current `main`;
3. inventories the current catalog;
4. inspects open tool branches and PRs;
5. identifies useful unclaimed opportunities;
6. reports or records candidate tasks without stealing claimed work;
7. monitors worker PRs when it has access to them;
8. identifies CI failures and ownership;
9. never modifies another worker's branch or tool;
10. never merges a PR that belongs to another worker unless the user explicitly requests orchestration of the merge.

## Important limitation

A normal ChatGPT conversation cannot be assumed to spawn other ChatGPT conversations.

Therefore the Orchestrator must not claim that it launched workers unless an actual external automation mechanism exists.

The practical user workflow is:

- open several chats;
- give each chat `agents/tools/TOOL-WORKER.md`;
- tell each chat `continue` or `add a tool`;
- let Git/GitHub provide the shared state.

## Candidate selection

Prefer tools that:

- solve a concrete problem;
- are meaningfully different from existing tools;
- fit browser-first/local-first processing;
- have low infrastructure cost;
- improve catalog coverage;
- have clear semantics and testability;
- do not create unnecessary dependencies.

Reject or defer candidates that mainly increase quantity.

## Coordination principle

Git branches are ownership boundaries.

The branch:

`feat/tool/<slug>`

belongs to the worker that successfully created it.

The Orchestrator must respect that ownership.

## Escalation

Escalate only:

- architectural changes;
- significant recurring cost;
- sensitive data handling;
- new external providers;
- legal/compliance exposure;
- irreversible product decisions.

Routine tool implementation remains autonomous.
