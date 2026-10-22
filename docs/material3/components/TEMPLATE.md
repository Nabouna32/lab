# <Official AndroidX component name>

> **Inventory:** <catalog ID / artifact / version>  
> **Source status:** UNVERIFIED  
> **Port status:** À inventorier  
> **Migration status:** À inventorier

## Identity and scope

- Official Kotlin API/package:
- Artifact and version:
- API maturity: stable / experimental / deprecated / unknown
- Related APIs and overloads:
- Explicit exclusions and rationale:

## Pinned evidence

- AndroidX repository and immutable commit:
- Exact Kotlin source paths:
- Exact API dump path and SHA-256:
- Official API reference:
- Official usage/design guidance:
- Evidence that version, source commit, and API dump align:

Do not mark sources verified until the source revision and published API surface are aligned.

## Public contract

Document every relevant public overload, parameter, type, default, annotation, and deprecation from evidence. Link back to the catalog entries. Do not silently omit experimental APIs or overloads.

## Source-derived behavior

- Layout and measurement:
- Tokens, typography, shapes, colors, and elevation:
- State model and defaults:
- Interaction and transition sequence:
- Semantics and accessibility:
- Platform/version differences:
- Unknowns requiring investigation:

Distinguish facts directly established by source from interpretations.

## Loculary audit

- Existing implementation path(s):
- Verified production call sites:
- Existing tests:
- Reuse, replace, or create:
- Relevant design-system decisions:

## React/Web port contract

For each deviation, label it explicitly:

- `ANDROIDX` — behavior directly supported by the pinned AndroidX source.
- `WEB-ADAPTATION` — required or appropriate adaptation to browser/platform semantics.
- `LOCULARY-EXTENSION` — deliberate product-specific addition.
- `UNVERIFIED` — not yet established by evidence.

Describe HTML semantics, keyboard behavior, focus management, ARIA/state announcements, pointer/touch behavior, responsive layout, reduced motion, and FR/EN content as applicable.

## Verification plan and results

- [ ] API and source cross-check
- [ ] Unit/contract tests
- [ ] Keyboard and assistive-technology checks
- [ ] Light and dark theme
- [ ] French and English
- [ ] Relevant viewport sizes and responsive states
- [ ] Reduced motion
- [ ] Real browser comparison against pinned reference
- [ ] Existing production call sites and affected journeys
- [ ] Lint, typecheck, tests, and build as appropriate

For every completed check, record the actual command or environment, result, and remaining limitations. CI green or screenshot similarity alone is not proof of fidelity.

## Gaps and decisions

| Gap | Impact | Evidence/action needed | Status |
|---|---|---|---|

## Lifecycle

Track independently: inventory presence, source review, specification, implementation, verification, and production migration. Never infer one status from another.
