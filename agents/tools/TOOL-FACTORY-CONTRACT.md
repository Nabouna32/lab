# Loculary — Tool Engineering Contract

This contract adds tool-specific requirements to `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`; it does not duplicate shared collaboration or delivery rules.

## Tool correctness and value

A tool is a product capability with domain-specific correctness obligations. Challenge whether it solves a real user need, whether the catalog already covers it, and whether extending or consolidating an existing capability would be better. Inspect the current catalog, registry, actual implementation, canonical product/architecture/UX/privacy/i18n documents and relevant decisions.

## Tool-specific checks

As applicable, verify:
- formulas, units, conversion factors, rounding, precision, numerical stability, boundary conditions and invalid inputs;
- clear names, descriptions, categories, tags, aliases, related tools and localized metadata;
- local vs remote processing, privacy classification, data transmission, file handling and capability requirements;
- browser/API support, permission denial, unavailable capabilities and graceful fallback;
- validation, error, loading, progress, cancellation, copy/reset/share and result states;
- accessibility, responsive behavior, French and English localization, SEO and performance;
- meaningful unit/integration tests for domain logic and boundaries.

Do not introduce a tool merely to satisfy a technical preference. Do not require automated browser E2E or screenshots on PRs during the active redesign; these remain manual-only.

## Delivery

Use the active mission Issue for the validated operational plan and checkpoints. Implement the complete agreed tool, including catalog/registry wiring, domain logic, UX, metadata, tests and documentation that are necessary for a coherent result. Inspect the full diff and follow the common branch/PR/CI/merge contract. Escalate only for a consequential decision or material change in direction.
