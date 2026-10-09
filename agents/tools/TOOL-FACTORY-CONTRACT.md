# Loculary — Tool Creation Workflow

This specialized contract inherits the mandatory rules in [`agents/AGENT-CONTRACT.md`](../AGENT-CONTRACT.md). Read the common contract first. It defines conversation-independent bootstrap, anti-skipping, source precedence, ownership, verification and continuity requirements.

This is the canonical procedure for the assistant creating and integrating Loculary tools.

Every assistant is resumable across independent ChatGPT conversations and MUST follow `agents/PRODUCT-ISSUE-CONTRACT.md`. Its active GitHub Issue is the mission checkpoint.

## 1. Mission

A assistant is not an idea generator and not a code snippet generator.

Its job is to take one tool from concept to a tested, reviewable, production-ready pull request.

A valid result is a real Loculary tool integrated into the current architecture, with domain logic, UX, i18n, metadata and tests appropriate to the tool.

The assistant must challenge the proposed tool before implementing it. A tool should only be built when it provides distinct user value and fits Loculary's product strategy.

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

A assistant does not require a GitHub Issue for every tool request.

Use an Issue according to `agents/PRODUCT-ISSUE-CONTRACT.md` when:
- the tool work is a multi-step or resumable mission requiring a durable checkpoint;
- the tool is being resumed or handed off through GitHub;
- the work originates from an actionable audit finding;
- durable cross-conversation coordination benefits from an Issue.

For a direct autonomous tool request, the assistant may proceed without an Issue.

When an Issue is provided, treat it as the durable mission record and follow `agents/PRODUCT-ISSUE-CONTRACT.md`. Verify the requested work against the current repository and challenge it before implementation.

The Issue is the mission checkpoint and coordination record. It never replaces Git/code, the branch, PR or CI as implementation/delivery sources of truth.

## 4. Checkpoint and resume

Create the tool Issue checkpoint after bootstrap and keep it current throughout the mission. Before/after substantial implementation, testing, GitHub or other Issue checkpoint-worthy actions, persist the Issue checkpoint according to `agents/PRODUCT-ISSUE-CONTRACT.md`.

On `continue`, inspect the Issue, then reconcile it with the branch, PR and actual code before resuming. A missing or stale Issue does not authorize starting over; reconstruct from Git/GitHub first.

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

The assistant may research competing or adjacent products for concepts, terminology and UX patterns.

Research is inspiration, not source code.

Do not copy proprietary code, text, visual assets or distinctive implementation details.

Prefer primary/authoritative technical sources for standards, mathematical definitions, browser APIs and security behavior.

## 8. One tool at a time

Handle one tool mission at a time. Do not automatically choose another tool when the current one is complete; wait for the user's next direction. A new tool, extension or refactor must be evaluated on its own value and validated scope.

## 9. Branch and scope ownership

Before implementation, refresh repository state, inspect current main, branches, open PRs and the active Issue, then create a dedicated branch from current main when required. Keep the change isolated to the validated tool scope. If shared architecture changes are necessary, assess whether they require a separate consequential decision rather than hiding them in an ordinary tool change.

## 10. Shared files

Modify shared platform files only when the tool genuinely requires it and the change is supported by the validated architecture. Avoid unrelated edits to registries, catalogs, shared UI, global i18n, routing, package manifests and global configuration. If safe implementation requires a substantial platform change, stop and present the architectural choice for validation.

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

The assistant must independently verify the domain model.

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

Fix problems introduced by the assistant.

Do not hide failures. If a check cannot run, report why.

## 17. Git/PR lifecycle

The assistant must:

1. create its own branch;
2. implement the tool;
3. commit coherent changes;
4. push/create the branch through the available GitHub workflow;
5. open a PR targeting `main`;
6. immediately enable GitHub auto-merge using the repository's configured merge method;
7. wait for required CI/checks through the auto-merge lifecycle;
8. inspect failures;
9. fix failures introduced by the assistant;
10. re-run verification;
11. do not manually merge a PR that has auto-merge enabled; GitHub performs the merge once all required protections are satisfied;
12. if auto-merge cannot be enabled because of an explicit repository-policy or human-validation requirement, leave the PR clearly ready for the appropriate next action and report the concrete blocker.

Never merge a PR outside the validated mission.

Never claim a PR is merged without verifying GitHub's actual state.

## 18. Main changes during work

Before final verification, inspect current main and PR mergeability. Reconcile the branch with changes that landed meanwhile and rerun affected checks. If a conflict requires a consequential architectural change or risks overwriting unrelated work, stop and ask how to proceed.

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

When the user says "continue", inspect the active Issue, branch, PR and current repository state, then resume the unresolved current mission. Do not restart completed work or automatically select a new tool. If the current tool is complete and no next task was specified, report completion and ask what the user wants to tackle next. If the user says "add a tool", evaluate candidates and recommend the most valuable option before proceeding within the validated scope.

## 21. Autonomous decision boundary

The assistant may autonomously choose routine implementation details that do not materially alter product direction or architecture.

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

Every completed implementation session must state:

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
