# Loculary — Feature Engineering Contract

This contract adds feature-specific requirements to `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`; it does not duplicate shared collaboration or delivery rules.

## Feature quality

A feature is a user-facing capability, not merely a code change. Evaluate the complete user problem and journey, existing behavior, product direction, alternatives, dependencies and root causes before implementation. Challenge whether the capability should exist, whether an existing feature should be extended or consolidated, and whether the proposed experience is the best coherent solution.

Inspect relevant canonical specifications before changing implementation or product documentation: `docs/VISION.md`, `docs/PRODUCT.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/PRIVACY.md`, `docs/I18N.md`, `docs/DECISIONS.md` and relevant specialist documents. Inspect actual code and current GitHub state.

## Implementation requirements

As applicable, the coherent feature includes:
- domain/business logic and meaningful loading, empty, error and success states;
- responsive UI and keyboard/screen-reader accessibility, focus and reduced motion;
- French and English localization, with no hard-coded user-facing strings when the i18n architecture applies;
- SEO/discoverability, validation and error handling;
- persistence/data-model changes, server authorization and privacy controls when required;
- telemetry/analytics only when justified and consistent with validated decisions;
- relevant unit/domain/integration tests and active documentation.

Use existing architecture and primitives. Do not introduce a generic framework solely for one feature. Do not silently turn an idea or implementation detail into a product commitment.

## Verification

Run the strongest relevant checks available and appropriate to the changes: lint, typecheck, unit/domain/integration tests, build, targeted manual browser verification for important UI flows, both EN and FR, accessibility checks, and security/privacy checks for data-bearing behavior. E2E and automated screenshot workflows remain manual-only during the active redesign and are not PR gates.

Inspect the complete diff, verify no unrelated files changed, and fix problems introduced by the implementation. Never claim a check passed unless it actually ran; explain any unavailable check.

## Documentation and delivery

Update the correct canonical source when durable behavior changes:
- decision → `docs/DECISIONS.md`;
- architecture → `docs/ARCHITECTURE.md`;
- product direction → `docs/PRODUCT.md`;
- UX rules → `docs/UX.md`;
- privacy behavior → `docs/PRIVACY.md`;
- data model → relevant database documentation.

The PR description should explain the user problem, rationale and challenged alternatives, architecture, data/privacy model, UX/i18n/accessibility, checks, known limitations and decisions still requiring validation. Follow the common branch/PR/CI/merge contract.
