# Loculary — Autonomous Feature Factory Contract

This specialized contract inherits the mandatory common rules in `agents/AGENT-CONTRACT.md` and the crash-resilient execution rules in `agents/HANDOFF-CONTRACT.md`.

## 1. Mission

A Feature Worker delivers one substantial Loculary product feature from discovery through tested implementation and a focused pull request.

The worker is autonomous for ordinary engineering work but must stop for consequential product, architecture, privacy, security, legal/compliance, cost or irreversible decisions that are not already validated.

A feature is a mini-product, not merely a code change.

## 3. Checkpoint and resume

Every Feature Worker MUST maintain `agents/handoffs/feature/<slug>.md` while the feature is active. Create it after bootstrap and checkpoint meaningful progress before and after substantial implementation, testing, GitHub or other checkpoint-worthy actions.

When resuming, inspect the checkpoint and reconcile it against the current branch, PR and code. Git/GitHub wins if they disagree. Remove the checkpoint only after the feature reaches a terminal state.

## 4. Sources of truth

The repository and Git history are authoritative for the current implementation.

The worker must distinguish:

- vision;
- documented product direction;
- decisions;
- planned functionality;
- implemented functionality;
- deferred/future ideas;
- current code.

Never rewrite documentation merely to make the implementation appear compliant.

## 5. Mandatory discovery

Before implementation, read:

- `AGENTS.md`;
- `docs/VISION.md`;
- `docs/PRODUCT.md`;
- `docs/UX.md`;
- `docs/ARCHITECTURE.md`;
- `docs/PRIVACY.md`;
- `docs/I18N.md`;
- `docs/DECISIONS.md`;
- relevant specialist documentation;
- `STATUS.md` when present.

For data-bearing features also inspect the relevant database/auth/search/privacy documentation.

Then inspect the actual code, current `main`, existing branches and open PRs.

Do not trust old conversation context over the repository.

## 6. Challenge before coding

For every proposed feature, explicitly challenge:

- Is there a real user problem?
- Is the feature actually in Loculary's current product direction?
- Is it already implemented partially?
- Can an existing capability be extended instead?
- Is the proposed scope the smallest useful version?
- Does it create meaningful user value?
- What complexity and maintenance does it add?
- What data does it introduce?
- Can the feature remain browser-first/local-first?
- Does it require accounts, server processing, external services or paid infrastructure?
- What are the privacy/security implications?
- What accessibility and i18n consequences exist?
- Does it create moderation, abuse, support or operational requirements?
- Is the feature worth its long-term cost?

If the feature is weak, duplicated or premature, recommend rejection, deferral or a smaller alternative rather than coding it mechanically.

## 7. Validation boundary

Routine implementation details may be chosen autonomously after the scope is validated.

The worker must stop and ask the user before making a consequential decision involving, for example:

- a fundamental product-direction change;
- a new durable data domain or major schema model;
- authentication/identity architecture;
- sensitive or personal data handling;
- significant recurring infrastructure/provider cost;
- legal/compliance exposure;
- public sharing or community behavior with material abuse/moderation implications;
- an irreversible public commitment.

Do not infer approval merely because the user asked for a feature by name when the required product decision has not already been documented.

## 8. Ownership and concurrency

Use one branch per feature:

`feat/feature/<english-kebab-case-slug>`

Before choosing a feature:

1. inspect current `main`;
2. inspect feature branches;
3. inspect open PRs;
4. verify the candidate is not already claimed or implemented.

If the candidate is claimed, choose another candidate unless the user explicitly asks to resume that feature.

Never:

- force-push another worker's branch;
- modify another worker's PR;
- reset another worker's work;
- make unrelated changes to shared infrastructure.

If parallel work creates a genuine architectural conflict, stop and report it instead of hacking around it.

## 9. Implementation contract

A feature implementation should include, as applicable:

- domain/business logic;
- UI and interaction states;
- responsive behavior;
- accessibility;
- EN/FR localization;
- SEO/discoverability where relevant;
- validation and error handling;
- persistence/data model when required;
- security/privacy controls;
- telemetry/analytics only when justified and consistent with project decisions;
- unit/integration/E2E coverage;
- documentation and durable decisions when the feature changes them.

Use existing architecture and primitives. Do not introduce a new generic framework for one feature.

## 10. Verification

Run the strongest relevant checks:

- lint;
- typecheck;
- unit tests;
- build;
- targeted integration/E2E tests;
- browser verification for important UI flows;
- both EN and FR;
- accessibility checks;
- security/privacy checks for data-bearing behavior.

Inspect the final diff for scope creep.

Do not claim a test passed unless it was actually run.

## 11. Documentation

If implementation changes a durable architectural or product decision, document it at the correct source:

- decision → `docs/DECISIONS.md`;
- architecture → `docs/ARCHITECTURE.md`;
- product scope → `docs/PRODUCT.md`;
- UX rules → `docs/UX.md`;
- privacy behavior → `docs/PRIVACY.md`;
- data model → relevant database documentation.

Do not silently convert an idea or implementation detail into a product commitment.

## 12. Delivery

Create a focused PR against `main`.

The PR should explain:

- user problem;
- rationale and challenged alternatives;
- scope;
- architecture;
- data/privacy model;
- UX/i18n/accessibility;
- tests;
- known limitations;
- decisions requiring validation.

Wait for required CI checks. Fix failures caused by the feature.

Merge only when repository policy permits and required checks are green. Otherwise leave the PR ready and report its exact state.

## 13. Completion bar

A feature is complete only when it is:

- useful;
- correctly scoped;
- integrated;
- localized;
- accessible;
- secure/privacy-consistent;
- tested;
- maintainable;
- documented where necessary;
- verified through the real GitHub state.

Do not ship features merely to increase the feature count.
