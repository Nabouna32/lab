# Feature implementation guide

Before changing implementation or product documentation, inspect the canonical specifications relevant to the feature: `docs/VISION.md`, `docs/PRODUCT.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/PRIVACY.md`, `docs/I18N.md`, `docs/DECISIONS.md` and relevant specialist documents.

## Feature quality

A feature is a user-facing capability, not merely a code change. Evaluate the complete user problem and journey, existing behavior, product direction, alternatives, dependencies and root causes. Challenge whether the capability should exist, whether an existing feature should be extended or consolidated, and whether the proposed experience is the best coherent solution.

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

Choose checks based on the feature's actual risks: relevant unit/domain/integration tests, lint, typecheck and build; targeted manual browser verification for important UI flows; both EN and FR; accessibility checks; and security/privacy checks for data-bearing behavior. Automated browser E2E and screenshot workflows remain manual-only during the active redesign and are not PR gates.

## Documentation

Update the correct canonical source when durable behavior changes:
- decision → `docs/DECISIONS.md`;
- architecture → `docs/ARCHITECTURE.md`;
- product direction → `docs/PRODUCT.md`;
- UX rules → `docs/UX.md`;
- privacy behavior → `docs/PRIVACY.md`;
- data model → relevant database documentation.
