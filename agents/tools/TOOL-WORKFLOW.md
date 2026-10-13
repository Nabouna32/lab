# Tool implementation guide

Inspect the relevant catalog, tool, UX, privacy, i18n and architecture specifications before changing a tool or its documentation. Challenge the user problem, whether a tool is needed, catalog duplication and alternatives.

## Tool correctness and value

A tool is a product capability with domain-specific correctness obligations. In addition to shared UX/accessibility/i18n/security/performance considerations, verify domain correctness (formulas, units, precision, limits and edge cases), browser capabilities, processing/privacy classification, data handling and error states.

A published tool normally includes the catalog metadata, registry/module integration, runtime UI, tool-owned editorial content, domain logic, localized English/French content, SEO metadata, accessibility, validation/error states, reset and useful actions, and domain tests. Follow the real architecture; do not create artificial files merely to satisfy a checklist.

## Domain correctness

Independently verify the domain model. For calculations and conversions, test formulas, units, conversion factors and dimensions, precision, rounding, boundaries, zero/negative values, invalid/non-finite values, overflow, empty input, localized formatting and real-world interpretation. For other tools, verify relevant parsing, encoding, transformation, generation or validation semantics. Plausible-looking output is not proof of correctness.

## Privacy and capabilities

Treat all user input and files as untrusted. Determine processing location, network transmission, storage, external providers, required browser capabilities, authentication and security boundaries. Do not add server/network processing when local processing is reasonably sufficient. Never place secrets in client code. Capability declarations must truthfully match the runtime architecture. Handle denied or unavailable browser capabilities explicitly.

## UX/UI and localization

Design the tool around **input → action → result → useful next action**. Provide clear hierarchy, sensible defaults, immediate validation where useful, understandable errors, meaningful results, reset/retry behavior and mobile usability. Support keyboard access and reduced motion where relevant. Do not blindly reuse a poor shared pattern; challenge it when the new tool reveals a genuine platform issue, but avoid unrelated redesign in the tool change.

English is the reference locale and French is required. Use the established i18n mechanism instead of hard-coded user-facing strings. Internal identifiers remain language-neutral, and both locales must be complete enough that the tool does not look partially translated.

## Verification

Choose checks based on domain risk: relevant unit/domain tests, lint, typecheck and build; verify both locales and accessibility-critical states; perform targeted manual browser verification when available and useful. Automated E2E and screenshot workflows remain manual-only during the active redesign and are not PR gates.

Update catalog/registry wiring, metadata and canonical documentation consistently.
