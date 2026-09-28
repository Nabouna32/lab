# Loculary — Tool Quality Contract

The tool quality contract is the minimum machine-checkable baseline for a catalog entry. It complements the broader product, UX, accessibility, performance, SEO and privacy specifications.

## Automated metadata checks

Every tool must have:

- a unique `id` and URL-safe kebab-case `slug`;
- at least one category, with the first category acting as the primary route/category;
- French name and description;
- SEO title and description for every enabled locale;
- a positive integer version;
- unique, non-empty tags and aliases;
- explicit processing metadata;
- capabilities consistent with its processing mode;
- truthful offline and sharing declarations;
- valid related-tool references;
- an explicit lifecycle;
- accessibility marked as required.

Published tools additionally must be available and require tests.

## Processing consistency

The validator enforces these minimum invariants:

- `local` processing cannot declare external providers and requires `local-processing`;
- `external`, `server` and `hybrid` processing require network access and an external provider;
- `hybrid` processing also requires local processing capability;
- offline tools must be local and must not require network access;
- local tools may only use no storage or local storage;
- community tools must identify their contributor.

## Scope

This contract intentionally validates metadata and cross-field invariants that can be checked without coupling the catalog to a specific page implementation.

Runtime and page-level quality remains governed by the existing specifications:

- accessibility: `docs/ACCESSIBILITY.md`;
- performance: `docs/PERFORMANCE.md`;
- UX: `docs/UX.md`;
- SEO: `docs/SEO.md`;
- privacy/processing: `docs/PRIVACY.md`;
- tool model: `docs/TOOL_ARCHITECTURE.md`.

The contract should grow when a requirement becomes stable enough to validate automatically. It must not turn into a lowest-common-denominator renderer or weaken the broader product requirements.
