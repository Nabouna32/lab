# Tool implementation guide

Read `AGENTS.md`, `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`, then the relevant catalog, tool, UX, privacy, i18n and architecture specifications.

Challenge the user problem, whether a tool is needed, catalog duplication and alternatives. In addition to shared UX/accessibility/i18n/security/performance checks, verify domain correctness (formulas, units, precision, limits, edge cases), browser capabilities, processing/privacy classification, data handling and error states.

Use the mission Issue for the internal implementation plan and checkpoints. After the user approves the explained change proposal, implement the full agreed tool, test domain boundaries and both initial locales where relevant, update catalog/documentation, inspect the complete diff and deliver through the normal branch/PR/CI workflow. Do not ask the user to approve the plan. Routine technical steps do not need repeated approval; pause and discuss if new evidence materially changes the approved outcome or significant risk.

Automated browser E2E and screenshots remain manual-only during the active redesign and are not PR gates.


---

## Tool-specific engineering requirements

## Tool correctness and value

A tool is a product capability with domain-specific correctness obligations. Challenge whether it solves a real user need, whether the catalog already covers it, and whether extending or consolidating an existing capability would be better. Inspect the current catalog, registry, actual implementation, canonical product/architecture/UX/privacy/i18n documents and relevant decisions.

A published tool normally includes the catalog metadata, registry/module integration, runtime UI, tool-owned editorial content, domain logic, localized English/French content, SEO metadata, accessibility, validation/error states, reset and useful actions, and domain tests. Follow the real architecture; do not create artificial files merely to satisfy a checklist.

## Domain correctness

Independently verify the domain model. For calculations and conversions, test formulas, units, conversion factors and dimensions, precision, rounding, boundaries, zero/negative values, invalid/non-finite values, overflow, empty input, localized formatting and real-world interpretation. For other tools, verify relevant parsing, encoding, transformation, generation or validation semantics. Test known values and meaningful edge cases; plausible-looking output is not proof of correctness.

## Privacy and capabilities

Treat all user input and files as untrusted. Determine processing location, network transmission, storage, external providers, required browser capabilities, authentication and security boundaries. Do not add server/network processing when local processing is reasonably sufficient. Never place secrets in client code. Capability declarations must truthfully match the runtime architecture. Handle denied or unavailable browser capabilities explicitly.

## UX/UI and localization

Design the tool around **input → action → result → useful next action**. Provide clear hierarchy, sensible defaults, immediate validation where useful, understandable errors, meaningful results, reset/retry behavior and mobile usability. Support keyboard access and reduced motion where relevant. Do not blindly reuse a poor shared pattern; challenge it when the new tool reveals a genuine platform issue, but avoid unrelated redesign in the tool change.

English is the reference locale and French is required. Use the established i18n mechanism instead of hard-coded user-facing strings. Internal identifiers remain language-neutral, and both locales must be complete enough that the tool does not look partially translated.

## Verification and delivery

Before delivery, inspect the complete diff and run relevant unit/domain tests, lint, typecheck and build; verify both locales and accessibility-critical states. Perform targeted manual browser verification when available and useful. Do not add or require automated E2E or screenshots as PR gates during the active redesign; dispatch manual workflows only when the task warrants it. Fix introduced problems and report any check that could not run without hiding failures.

Update catalog/registry wiring, metadata and documentation consistently. The PR should explain the user problem, rationale and alternatives, domain model/correctness, privacy and processing, UX/i18n/accessibility, checks and limitations. Follow the common branch/PR/CI/merge contract.
