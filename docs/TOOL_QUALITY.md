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

## Scope

This contract intentionally validates metadata and cross-field invariants that can be checked without coupling the catalog to a specific page implementation.

Runtime and page-level quality is covered by the canonical sources below:

- UX, accessibility, responsive behavior and interaction: `docs/UX.md`;
- SEO and editorial requirements: `docs/SEO-EDITORIAL.md`;
- privacy and processing: `docs/PRIVACY.md`;
- tool model and execution contract: `docs/TOOL_ARCHITECTURE.md`;
- performance and rendered-page checks: the runtime and page-level quality section below.

Do not create separate specifications for these topics solely to satisfy this index. Introduce a new document only when a distinct, maintained contract is needed.

The contract should grow when a requirement becomes stable enough to validate automatically. It must not turn into a lowest-common-denominator renderer or weaken the broader product requirements.


## Runtime and page-level quality

- **Accessibility:** keyboard operation, logical and visible focus, semantic structure, accessible names/states, understandable errors, meaningful status announcements, sufficient contrast, non-color-only information, touch targets and responsive reflow. Respect `prefers-reduced-motion`.
- **Performance:** load tools on demand; keep small deterministic tools responsive; use Workers, WebAssembly, chunking or streaming when justified. Measure before removing capabilities and provide truthful progress/cancellation for long operations where feasible.
- **SEO:** public tool pages need useful localized titles/descriptions, canonical URLs, structured headings and appropriate structured data. Keep tools immediately usable; avoid thin mass-produced content.
- These requirements apply to the real rendered experience. Metadata validation or static tests do not replace browser and accessibility checks.
