# AndroidX Material 3 → React porting project

**Reference implementation:** AndroidX Jetpack Compose Material 3.  
**Product direction:** Material 3 Fidelity, not Material 3 Expressive.  
**Project status:** early; Button work exists, but the overall inventory, porting and production migration are incomplete.

## Goal

Build React/Web equivalents of official AndroidX Compose Material 3 components with the highest practical fidelity to their public contracts, visual tokens, states and interactions. Then replace Loculary's current shared UI components with these ports in production routes and tools.

This is not a project to invent components that merely look Material-like. Every claim about Android behavior or appearance must be grounded in a pinned upstream source. Where Android and Web differ, document the adaptation instead of claiming identical implementation.

## Source hierarchy

1. **Primary contract:** AndroidX source code pinned to an immutable commit/release.
2. **Public API:** official AndroidX API reference for the same component.
3. **Usage and design guidance:** official Android Developers / Material 3 documentation.
4. **Secondary comparison only:** Material Web, MDUI, MUI, screenshots or other implementations. They can inform Web trade-offs but cannot override AndroidX without an explicit decision.

Each component specification must contain exact source links and the commit/release used. Do not rely on a mutable `main` link alone. Check source/API alignment before carrying a contract forward to a new AndroidX version.

## Component specification and evidence

Each component gets one file in [`components/`](components/). Minimum sections:

- Official AndroidX component name and public API/package.
- Pinned source files and version/commit; official API and usage references.
- Source-derived API, defaults, variants, tokens, layout, states and interaction transitions.
- React implementation path and existing Loculary call sites, verified from code.
- Explicit differences: `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION`, or `UNVERIFIED`.
- Automated tests for API/state/behavior where practical.
- Browser verification in light/dark themes, FR/EN, relevant viewport sizes, keyboard and assistive technology.
- Remaining gaps and the evidence needed to close them.
- Migration status and a list or verifiable inventory of production call sites replaced.

Do not infer undocumented behavior. If the source does not establish a detail, mark it unverified and investigate rather than inventing a default.

## Lifecycle

Use these distinct statuses:

1. **À inventorier** — candidate identified, scope and existing usage not yet audited.
2. **Sources vérifiées** — public API and pinned upstream sources reviewed.
3. **Portage en cours** — React implementation is being built.
4. **Portage vérifié** — contract, applicable states, tests and browser behavior checked; differences documented.
5. **Migration en cours** — production usages are being replaced.
6. **Migré** — intended production call sites use the port and obsolete implementations are removed where safe.

A port may be verified before it is migrated. A component being used in production does not prove its conformance. Visual similarity alone never qualifies as verification.

## Delivery workflow

Work in small, reviewable component or coherent component-family slices so the work can span multiple conversations without losing the evidence trail:

1. Select a component based on official catalogue coverage and real Loculary usage.
2. Inspect AndroidX source and API, pin exact versions, and write the contract before implementation.
3. Audit the existing React implementation and call sites; decide whether to adapt or replace it.
4. Port behavior and visuals, retaining Web-native semantics where appropriate.
5. Add source-contract and behavior tests; run lint, typecheck, unit tests and build.
6. Inspect real browser rendering and interactions; record actual deviations.
7. Migrate production call sites and verify affected journeys.
8. Update only this component's status and create/follow a focused issue for unresolved work.

Avoid one issue or conversation per tiny observation. Use one focused issue per component or coherent family, and keep evidence in the component spec and code/tests. Close issues only when their acceptance criteria are proven.

## Initial component queue

The inventory is intentionally **not yet declared complete**. The existing historical inventory contains candidate families, but each must be checked against the current official AndroidX catalogue and Loculary code before priorities or coverage are claimed.

- **Existing port work to verify:** Button, IconButton.
- **Candidates to inventory against real usage:** Checkbox, Switch, SegmentedButton, TextField, Select/dropdown, Card, progress indicators, Snackbar, Dialog, Tooltip, chips, navigation components, menus, sliders and date/time components.
- Do not implement every AndroidX component just to complete a catalogue. Prioritize official components actually used or needed by Loculary, then expand when there is a clear product need.

## Current status

| Component | Spec | Port status | Production migration |
|---|---|---|---|
| Button | [Button](components/Button.md) | Five AndroidX-named React exports added; source-token and browser verification remain in progress | Explicit variant call sites migrated; final call-site audit and browser verification remain open |
| IconButton | [IconButton](components/IconButton.md) | Existing implementation; full source-contract and browser verification still required | Not established by this index |
| Other components | Not yet audited | À inventorier | À inventorier |

NavigationBar browser validation is tracked in [issue #977](https://github.com/Nabouna32/lab/issues/977). This does not assert that the component is already source-faithful.
