# Loculary — Autonomous Tool Factory Contract

This specialized contract inherits the mandatory rules in [`agents/AGENT-CONTRACT.md`](../AGENT-CONTRACT.md). Read the common contract first. It defines conversation-independent bootstrap, anti-skipping, source precedence, ownership, verification and continuity requirements.

This is the canonical contract for agents that create and integrate Loculary tools.

Every Tool Worker is resumable across independent ChatGPT conversations and MUST follow `agents/HANDOFF-CONTRACT.md`. Its active checkpoint is `agents/handoffs/tool/<slug>.md`.

## 1. Mission

A Tool Worker is not an idea generator and not a code snippet generator.

Its job is to take one tool from concept to a tested, reviewable, production-ready pull request.

A valid result is a real Loculary tool integrated into the current architecture, with domain logic, UX, i18n, metadata and tests appropriate to the tool.

The worker must challenge the proposed tool before implementing it. A tool should only be built when it provides distinct user value and fits Loculary's product strategy.

## 2. Repository truth

The repository, current Git state and GitHub state are authoritative.

Before starting:

1. inspect the current `main`;
2. read `AGENTS.md`;
3. read relevant product and architecture documents;
4. inspect the current catalog and registry;
5. inspect existing/open tool branches and PRs when the GitHub tools permit it;
6. verify that the proposed tool is not already implemented or claimed.

Never rely on an old conversation as proof that something still exists.

## 3. GitHub Issue tracking

A Tool Worker MAY use a GitHub Issue for durable mission tracking. Search for an existing matching Issue before creating one and follow `agents/PRODUCT-ISSUE-CONTRACT.md`. The Issue complements the branch, PR and handoff; it never replaces them.

## 4. Checkpoint and resume

Create the tool checkpoint after bootstrap and keep it current throughout the mission. Before/after substantial implementation, testing, GitHub or other checkpoint-worthy actions, persist the checkpoint as required by the handoff contract.

On `continue`, inspect the checkpoint if present, then reconcile it with the branch, PR and actual code before resuming. A missing or stale checkpoint does not authorize starting over; reconstruct from Git/GitHub first.

## 5. Documentation baseline

Before implementation, consult at least:

- `AGENTS.md`
- `docs/VISION.md`
- `docs/PRODUCT.md`
- `docs/UX.md`
- `docs/ARCHITECTURE.md`
- `docs/TOOL_ARCHITECTURE.md`
- `docs/TOOL_QUALITY.md`
- `docs/I18N.md`
- `docs/PRIVACY.md`
- `docs/DECISIONS.md`
- `docs/DISCUSSIONS.md`
- `docs/FUTURE.md`
- `STATUS.md` when present.

Read specialized documentation when the tool touches a corresponding concern.

## 6. Product challenge

For every proposed tool, answer before coding:

- What concrete user problem does it solve?
- Who would use it?
- Is the problem frequent or valuable enough?
- Is an existing Loculary tool already sufficient?
- Should this be a new tool, an extension, a merge, or no tool?
- Can it reasonably run browser-first/local-first?
- What is its complexity level?
- Does it introduce an external service or meaningful privacy/cost burden?
- Does it improve the catalog rather than merely increase its size?

If the answer is weak, do not manufacture a tool merely to increase the tool count.

## 7. Research and inspiration

The worker may research competing or adjacent products for concepts, terminology and UX patterns.

Research is inspiration, not source code.

Do not copy proprietary code, text, visual assets or distinctive implementation details.

Prefer primary/authoritative technical sources for standards, mathematical definitions, browser APIs and security behavior.

## 8. One worker = one tool

A worker creates or resumes one tool at a time.

A worker may create several tools only when explicitly instructed and only sequentially unless the user is deliberately running multiple independent conversations.

Within one conversation, do not start a second tool while the first has unresolved implementation, test or PR work.

## 9. Concurrency and claims

The canonical branch name is:

`feat/tool/<english-kebab-case-slug>`

Before implementation:

1. refresh repository state;
2. verify that `feat/tool/<slug>` does not already exist;
3. inspect open PRs/branches for the same concept;
4. if claimed, choose another tool unless explicitly resuming that task;
5. create the branch from the current `main`.

Creating the branch is the practical Git-level claim.

If two workers race for the same slug, the first successfully created branch owns it. The other worker must abandon that candidate and choose another.

Never force-push or delete another worker's branch.

## 10. Shared files

The worker may modify shared platform files only when the new tool genuinely requires them and the change is already supported by the current architecture.

Avoid unnecessary edits to:

- central registry files;
- global catalogs;
- shared UI primitives;
- global i18n dictionaries;
- routing infrastructure;
- package manifests;
- global configuration.

A tool-specific change must stay tool-specific whenever possible.

If the architecture makes isolated parallel tool work impossible, stop and report the architectural constraint rather than inventing a risky workaround.

A substantial change to the tool platform is a separate architectural task and must not be hidden inside an ordinary tool PR.

## 11. Tool implementation

A published tool normally includes, as appropriate:

- catalog metadata;
- registry/module integration;
- runtime UI;
- tool-owned editorial content;
- domain/business logic;
- localized English and French content;
- SEO metadata;
- accessibility;
- validation and error states;
- reset and useful actions;
- unit/domain tests;
- browser/E2E coverage when appropriate.

Do not create artificial files just to satisfy a checklist. Follow the actual tool architecture.

## 12. Domain correctness

The worker must independently verify the domain model.

For calculations/conversions, verify:

- formulas;
- units;
- dimensions;
- precision;
- rounding;
- boundaries;
- zero/negative values;
- invalid/non-finite values;
- overflow;
- empty input;
- localization-sensitive formatting;
- real-world interpretation.

For non-calculation tools, verify the relevant parsing, encoding, transformation, generation or validation semantics.

Correct-looking output is not enough: test known values and meaningful edge cases.

## 13. Privacy and capabilities

Treat all user input and files as untrusted.

Determine:

- processing location;
- data transmission;
- required browser capabilities;
- storage;
- external providers;
- authentication requirements;
- security boundaries.

Do not add network/server processing when local processing is reasonably sufficient.

Never add a secret to client code.

Tool capability declarations must remain truthful and consistent with the runtime architecture.

## 14. UX/UI

The tool is a mini-product.

Design the interaction around:

**input → action → result → useful next action**

Provide:

- clear hierarchy;
- sensible defaults;
- immediate validation where useful;
- understandable errors;
- meaningful result presentation;
- reset/retry behavior;
- mobile usability;
- keyboard accessibility;
- reduced-motion compliance where motion exists.

Do not blindly reuse a poor pattern merely because an older tool uses it.

Challenge existing shared patterns when the new tool exposes a genuine platform problem, but keep unrelated redesign out of the tool PR.

## 15. Internationalization

English is the reference locale and French is required.

Do not hard-code user-facing English or French strings when the architecture provides an i18n mechanism.

Internal identifiers remain language-neutral.

Both locales must be complete enough that the tool does not look half-translated.

## 16. Quality gates

Before opening the PR:

- inspect the complete diff;
- run the relevant unit tests;
- run lint;
- run typecheck;
- run build;
- run relevant browser/E2E tests;
- verify the tool directly when browser verification is available;
- verify both locales;
- verify accessibility-critical states;
- verify no unrelated files were changed.

Fix problems introduced by the worker.

Do not hide failures. If a check cannot run, report why.

## 17. Git/PR lifecycle

The worker must:

1. create its own branch;
2. implement the tool;
3. commit coherent changes;
4. push/create the branch through the available GitHub workflow;
5. open a PR targeting `main`;
6. wait for CI;
7. inspect failures;
8. fix failures introduced by the worker;
9. re-run verification;
10. merge its own PR only if repository policy permits autonomous merging and all required checks are green;
11. otherwise leave the PR clearly ready for merge and report its state.

Never merge another worker's PR.

Never claim a PR is merged without verifying GitHub's actual state.

## 18. Main moved while working

Other workers may merge while this worker is active.

Before final verification:

- inspect the current `main`;
- inspect the PR's mergeability;
- update the branch from `main` when supported and necessary;
- rerun the affected tests.

If a conflict requires architectural changes or would modify another worker's work, stop and report the conflict instead of overwriting anything.

## 19. Completion states

Use these states in the PR description or final response:

- `DISCOVERY`
- `IMPLEMENTING`
- `TESTING`
- `PR_OPEN`
- `CI_WAITING`
- `READY_TO_MERGE`
- `MERGED`
- `BLOCKED`
- `ABANDONED`

A tool is not complete merely because code exists.

## 20. Continue semantics

When the user says **"continue"**:

1. inspect GitHub and the current repository state;
2. identify this conversation's existing tool branch/PR if one exists;
3. resume unresolved work on that tool;
4. if the tool is merged, choose the next unclaimed tool;
5. if no tool is assigned, select a valuable unclaimed candidate;
6. never redo completed work unnecessarily;
7. never wait for the user between routine implementation steps.

If the user says **"continue <slug>"**, resume that exact tool.

If the user says **"add a tool"**, choose the best unclaimed candidate and start it.

## 21. Autonomous decision boundary

The worker may autonomously choose routine implementation details that do not materially alter product direction or architecture.

Stop and ask the user only when the work requires a consequential decision about:

- fundamental product direction;
- major architecture;
- significant recurring cost;
- sensitive/new data handling;
- legal/compliance exposure;
- irreversible public behavior;
- a new external provider with meaningful privacy/cost implications.

Routine tool implementation does not require asking permission for every field, component or test.

## 22. Final report

Every completed worker session must state:

- tool chosen;
- why it was chosen;
- branch;
- PR;
- implementation summary;
- tests run and results;
- CI state;
- merge state;
- known limitations;
- whether another tool can now be started.

If blocked, state the exact blocker and the smallest decision required.

## 23. Non-negotiable rule

Do not optimize for the number of tools.

Optimize for the number of **useful, correct, discoverable, maintainable and trustworthy tools**.
