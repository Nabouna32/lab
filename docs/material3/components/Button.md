# Button — AndroidX Material 3 → React port

**Status:** Portage en cours. API names and the initial source-derived contract are explicit; generic action call sites have been migrated and their former local styles removed. Full source-release alignment and browser verification remain open.

## Upstream authority

- [Pinned AndroidX `Button.kt` source](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
- [FilledButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledButtonTokens.kt)
- [ElevatedButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt)
- [FilledTonalButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt)
- [OutlinedButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt)
- [TextButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt)
- [AndroidX Button API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable)
- [AndroidX ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults)
- [Official Compose Material 3 Button guide](https://developer.android.com/develop/ui/compose/components/button)

The pinned source defines five public composables: `Button`, `ElevatedButton`, `FilledTonalButton`, `OutlinedButton` and `TextButton`. Loculary now exports those names separately from `src/components/ui/Button.tsx`. They share a private renderer but each public wrapper fixes its own AndroidX variant. Color customization is exposed through the AndroidX-inspired `colors` prop rather than adding product-specific button variants.

## Source-derived baseline

The pinned `Button.kt` source establishes:

- Minimum width: 58 dp; minimum height: 40 dp.
- Standard content padding: 24 dp horizontal and 8 dp vertical.
- Leading-icon content padding: 16 dp start, 24 dp end, 8 dp vertical.
- TextButton horizontal padding: 12 dp; TextButton with icon: 12 dp start and 16 dp end.
- Icon-to-label spacing: 8 dp; the source's default icon size is token-defined.
- The default text style is Material `labelLarge`.
- Each public variant has its own color/elevation defaults. ElevatedButton has a resting shadow; Button and FilledTonalButton have interaction-dependent elevation; OutlinedButton and TextButton default to no elevation.
- Disabled container and label colors are token-derived per variant. The source tokens use the on-surface role at 10% opacity for disabled containers and on-surface-variant at 38% opacity for disabled labels; ElevatedButton must not retain its enabled surface-container-low color when disabled.
- Disabled colors and elevation come from the matching variant token set, not one generic disabled treatment.

These are Android dp/sp values. The React implementation expresses geometry in CSS units; numerical resemblance is not physical equivalence. CSS color mixing, browser focus rings, native disabled semantics and the pointer-origin ripple are explicit Web adaptations.

## React API

| Export | AndroidX contract | Status |
|---|---|---|
| `Button` | Filled button | Portage en cours |
| `ElevatedButton` | Elevated button | Portage en cours |
| `FilledTonalButton` | Filled tonal button | Portage en cours |
| `OutlinedButton` | Outlined button | Portage en cours |
| `TextButton` | Text button | Portage en cours |
| `colors` prop | Maps to AndroidX `ButtonColors` color roles | Web adaptation, API aligned |

The shared Web props preserve native `button` attributes and add `leadingIcon` for source-aligned content insets and `multiline` as an explicit Web layout extension. Generic action buttons in the expense splitter and the cron-expression and IPv4/IPv6 subnet resets now use `OutlinedButton`; date/time picker confirmation and cancellation use `Button` / `TextButton`; the Snackbar action uses `TextButton`. Their redundant page/component-local action styles were removed. These migrations preserve native button semantics; the Snackbar dismiss icon remains a separate icon-action migration candidate. The ripple is a `WEB-ADAPTATION`: unlike Compose's interaction indication, it is implemented with pointer/keyboard events and CSS. When `prefers-reduced-motion: reduce` is active, the component does not create animated ripples and falls back to the CSS pressed state layer; switching the preference to reduced motion clears active ripple state so hidden animations cannot leave stale entries. The optional `colors` prop accepts `containerColor`, `contentColor`, `disabledContainerColor` and `disabledContentColor`, matching AndroidX `ButtonColors`. CSS color values and semantic tokens are supported; hover/focus state layers derive from the selected content color, while disabled colors remain independently configurable. For destructive actions, use an official button component with semantic error roles (`--error` and `--on-error`) rather than a separate component. Use filled error colors for high-emphasis destructive confirmation and error-colored text/outlined buttons for lower-emphasis actions; don’t mark every reversible removal as destructive. The default HTML `type` is `button`; callers must opt into form submission with `type="submit"`.

## Usage guidance for actions

Use a variant to express hierarchy, not to label business meaning: the official Button API has no dedicated destructive variant. Customize `colors` only when the action semantics justify it, using semantic roles such as `--error` / `--on-error` and explicit disabled colors where required.

- Filled `Button`: primary/high-emphasis action within a group, including final destructive confirmation only when that emphasis is warranted.
- `FilledTonalButton` / `ElevatedButton`: secondary emphasis when their source-defined container/elevation semantics fit; not automatic defaults for every secondary action.
- `OutlinedButton`: visible boundary for a secondary action.
- `TextButton`: low-emphasis contextual action; an error-colored icon and label can signal a secondary destructive action without a filled red surface.
- Navigation must use a real link. Do not use a button merely because its appearance resembles one; share visual foundations while preserving link semantics.

For destructive actions, distinguish reversible detachment from deletion of the underlying resource. Explain irreversible consequences and confirm high-impact actions. See the shared [usage contract](../README.md#usage-contract-for-product-pages-and-agents).

## Important boundary: API capability is not a design prescription

The official Button API has no dedicated destructive variant. Its color customization API does not establish how every deletion flow should look. Do not infer that a delete action should use a filled red button, red text, a trash icon, a red surrounding surface or a particular dialog merely because the action is destructive. First identify the relevant AndroidX component/pattern and official usage context. If AndroidX provides no exact pattern, document the gap and justify the smallest necessary Web/product adaptation. Choose among the five official button variants from their source-defined contracts and the actual context, not from a generic “primary/secondary/delete” label.

When migrating a page, evaluate the complete screen and interaction journey rather than only replacing its button. Verify the real browser rendering against the pinned AndroidX source; automated tests and green CI alone do not prove visual fidelity.

## Evidence labels

- `ANDROIDX`: directly supported by the pinned AndroidX API/source/token.
- `WEB-ADAPTATION`: necessary or intentional Web-specific behavior.
- `LOCULARY-EXTENSION`: product-specific behavior without an AndroidX equivalent.
- `UNVERIFIED`: evidence or browser behavior is not yet established.

## Remaining verification

- [x] Pin `Button.kt` and the five per-variant token files to the declared AndroidX commit `2fb1702c1c62a6059e73d757d9e4eda1044ce21d`. This immutable source snapshot is authoritative for the port; the public API page and component guide are supporting references, not proof that a published artifact is identical to this commit.
- [x] Cross-check the disabled container/content roles and opacity against the pinned token definitions: on-surface at 10% for disabled containers; on-surface-variant at 38% for disabled labels.
- [ ] Cross-check all remaining per-variant container/content roles, state-layer opacity, shape and elevation values against the linked token files.
- [x] Smoke-check the Vercel preview server render in EN and FR: ExpenseSplitter, CronExpression and IPv4/IPv6 subnet tool routes return HTTP 200, and the migrated pages no longer emit the removed local reset styles. [Preview deployment](https://loculary-m6s7954j3-nabouna32.vercel.app). This checks route rendering and emitted markup only; it is not visual or interaction verification.
- [ ] Check the rendered component in light/dark themes and actual computed colors/contrast.
- [ ] Verify pointer ripple origin, clipping, cancellation, keyboard interaction and reduced-motion behavior in a browser. Code-level reduced-motion handling now avoids creating animated ripples and clears active entries when the preference changes; actual browser behavior remains UNVERIFIED.
- [ ] Check FR/EN long labels, constrained widths, 200% zoom and icon alignment.
- [ ] Run component tests, lint, TypeScript, unit tests and production build.
- [x] Audit generic action call sites: ExpenseSplitter, CronExpression, IPv4/IPv6 subnet calculators, DatePickerDialog, TimePickerDialog, Snackbar and the Design Lab audit workbench now use shared variants. Remaining native buttons were classified as distinct component families or intentional Visual Lab mockups; do not convert them mechanically into Button.
- [ ] Validate custom Button colors and all variants in light/dark themes in a browser.

Passing static assertions or a Design Lab preview is not proof of full conformance. Do not mark the port verified until browser evidence and remaining source questions are closed.
