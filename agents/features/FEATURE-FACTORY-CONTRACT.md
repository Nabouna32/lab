# Loculary — Feature Engineering Contract

This contract adds feature-specific requirements to `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`; it does not duplicate shared collaboration or delivery rules.

## Feature quality

A feature is a user-facing capability, not merely a code change. Evaluate the complete user problem and journey, existing behavior, product direction, alternatives, dependencies and root causes before implementation. Challenge whether the capability should exist, whether an existing feature should be extended or consolidated, and whether the proposed experience is the best coherent solution.

Inspect relevant canonical specifications before changing implementation or product documentation: `docs/VISION.md`, `docs/PRODUCT.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/PRIVACY.md`, `docs/I18N.md`, `docs/DECISIONS.md` and relevant specialist documents. Inspect actual code and current GitHub state.

## Feature-specific checks

As applicable, validate:
- end-to-end user journey and meaningful loading, empty, error and success states;
- responsive layouts, keyboard and screen-reader accessibility, focus and reduced motion;
- French and English copy, localization structure and extensibility;
- privacy, processing location, data minimization and server authorization;
- performance, bundle impact, resilience and maintainability;
- tests for meaningful logic and boundaries, documentation and cross-references.

Do not require automated browser E2E or screenshot capture on PRs during the active redesign. Those workflows remain manual-only unless the project policy is explicitly changed.

## Delivery

Use the active mission Issue for the validated operational plan and checkpoints. Implement the complete agreed feature coherently, including necessary shared components, navigation, copy, styling, tests and documentation. Inspect the complete diff and follow the common branch/PR/CI/merge contract. Escalate only for a consequential decision or material change in direction.
