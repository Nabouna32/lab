# Loculary — Design system

**Direction:** Material 3 Fidelity, with current Pixel / Android UI as visual reference.  
**Decision:** [DEC-026](DECISIONS.md#dec-026--material-3-fidelity-and-pixel-inspired-interface).  
**Status:** target contract; production-wide conformance is not yet established.

## Purpose and authority

This document owns shared design foundations and cross-component rules. AndroidX Jetpack Compose Material 3 is the primary source for component contracts; official Android Developers guidance supplies usage context. Sources must be pinned to a version or commit for each component port. Material Web and other React libraries are comparisons only, never substitute authorities.

The target is a faithful React/Web port of AndroidX Compose Material 3 components—not merely a visual imitation. Each component has a separate specification under [`material3/components/`](material3/README.md). A component must not be called source-faithful until its API, states, behavior, rendering and differences have been checked against its pinned source.

## Foundations

- Use Material Color Utilities **Fidelity** for seed-derived semantic color roles, with the current seed documented in implementation; the seed is not a literal color to apply everywhere.
- Use MCU Rainbow only for category identity, not as a second semantic theme.
- Use semantic roles and matching `on-*` foregrounds. Never hard-code palette colors into shared components when a semantic role exists.
- Light and dark themes must implement the same role contract. Verify computed colors and contrast, including disabled, focus, border and overlay states.
- Use Material role-based typography and the Material/Pixel visual language. Roboto is the current interface reference; technical content may use a monospace role where useful.
- Use semantic shape and elevation roles consistently. Values copied from Material Web CSS tokens must be labelled as Web values, not represented as Android dp/sp conversions.
- Use Material Symbols consistently for functional interface icons. Icons need accessible names when they convey an action; do not substitute emoji or arbitrary Unicode for standard controls.
- Shared components must support responsive layout, French and English text, keyboard and pointer input, visible focus, appropriate screen-reader semantics, WCAG 2.2 AA, and `prefers-reduced-motion`.

## Layout and spacing

The target layout API is a faithful Web port of the relevant public AndroidX Compose UI/Foundation APIs, not a collection of page-specific Tailwind spacing decisions.

- Treat AndroidX Compose UI/Foundation as the source of truth for the public contracts of `Modifier`, `Alignment`, `Arrangement`, `Column`, `Row`, `Box`, and `Spacer`. Pin the exact published artifact/API snapshot and record Web differences before claiming fidelity.
- Port source-backed primitives first, test their contracts, and then migrate Loculary page compositions to them. Keep one canonical layout implementation; do not introduce parallel custom stacks or spacing helpers that duplicate AndroidX behavior.
- Centralize Loculary-specific design decisions—responsive page gutters, content width presets, page section rhythm and other product conventions—in semantic tokens. CSS/Tailwind values that encode these decisions must reference the tokens rather than reintroduce per-page numeric drift.
- A product composition such as `PageContainer` is allowed only to express a real Loculary-level convention. It is not an AndroidX API and must remain replaceable: implement it on top of the shared primitives where appropriate, and remove it if it only duplicates their behavior.
- Do not treat Android `Dp` values as CSS pixels without an explicit, documented conversion strategy. Preserve Compose's measurement, modifier ordering, layout direction, arrangement and alignment semantics where meaningful; document differences required by browser layout.
- Migrate shared site shells and pages incrementally, then tool pages and embedded forms where the change is safe. Keep task-specific compositions when they serve a real need, but source their spacing and constraints from shared APIs/tokens.
- Verify responsive behavior, French/English content expansion, light/dark themes, RTL-sensitive logical spacing, keyboard/screen-reader behavior and reduced motion as applicable. Static token tests alone do not prove rendered parity.

The current partial port and known gaps are tracked in [the layout primitives specification](material3/layout-primitives.md). Its status is not a claim of AndroidX parity.

## Source and fidelity rules

For every ported component:

1. Name it after the official public AndroidX Compose Material 3 component/API. Do not invent Loculary-only names for an Android component. Product-specific extensions must be explicitly named and documented as extensions.
2. Record the exact upstream repository, file path, immutable commit or release, public API reference, and relevant official usage guidance.
3. Derive variants, parameters, defaults, tokens, states and transitions from the pinned source. Distinguish API facts from visual interpretation.
4. Record every Web adaptation and why it is needed. Label it `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION`, or `UNVERIFIED`.
5. Verify all applicable states and interactions; screenshots alone are not proof of conformance.
6. Do not mark a component conformant while material source questions, required behavior, tests or known differences remain unresolved.

## Whole-screen fidelity gate

Component-level fidelity and page-level fidelity are separate acceptance criteria. A page can use several correct components and still fail because its hierarchy, surfaces, spacing or action grouping diverge from the source-backed target.

When a screen is in scope, review the complete user journey and composition: layout, hierarchy, surfaces, spacing, typography, semantic colors, icons, action groups, dialogs, feedback states, responsive behavior and accessibility. Do not stop at adding an icon or replacing one button while leaving the surrounding page inconsistent.

Do not infer a visual treatment from a business label. In particular, “delete” alone does not prescribe a filled error button, red text, a trash icon, a red container or a confirmation dialog. Identify the relevant AndroidX component/pattern and official usage context. If no exact native pattern exists, state that and justify the smallest necessary Web/product adaptation. A color customization exposed by an API is not, by itself, proof that the selected treatment matches Android.

Compare the actual browser result with the pinned reference and record the themes, locales, viewports and states checked. Tests, token assertions and successful CI are not proof of visual parity. Uninspected browser output remains UNVERIFIED.

## Accessibility and quality

- Preserve native HTML semantics where possible; map Android semantics to appropriate HTML/ARIA behavior rather than copying platform APIs blindly.
- Keyboard operation, focus visibility/restoration, accessible names and state announcements are part of the contract, not optional polish.
- Respect reduced-motion preferences without removing essential state feedback.
- Test actual rendered contrast and responsive reflow in both themes. A token or static source assertion does not prove rendered accessibility.
- Keep task-specific tool layouts diverse where needed; shared design foundations do not require identical page compositions.

## Current implementation status

This document describes the target, not a claim that the current site conforms. Component-specific status and evidence belong in [the Material 3 porting index](material3/README.md). The production migration is a separate step after each component passes its own porting gate.
