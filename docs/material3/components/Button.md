# Button — AndroidX Material 3 → React port

**Status:** Portage en cours. API names and the initial source-derived contract are now explicit; full browser verification and production call-site review remain open.

## Upstream authority

- [Pinned AndroidX `Button.kt` source](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
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

The shared Web props preserve native `button` attributes and add `leadingIcon` for source-aligned content insets and `multiline` as an explicit Web layout extension. The optional `colors` prop accepts `containerColor`, `contentColor`, `disabledContainerColor` and `disabledContentColor`, matching AndroidX `ButtonColors`. CSS color values and semantic tokens are supported; hover/focus state layers derive from the selected content color, while disabled colors remain independently configurable. For destructive actions, use an official button component with semantic error roles (`--error` and `--on-error`) rather than a separate component. Use filled error colors for high-emphasis destructive confirmation and error-colored text/outlined buttons for lower-emphasis actions; don’t mark every reversible removal as destructive. The default HTML `type` is `button`; callers must opt into form submission with `type="submit"`.

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

- [ ] Align the source snapshot, API reference and relevant per-variant token files to a declared AndroidX release/commit.
- [ ] Verify the exact variant token values for colors, disabled opacity, state layers, shape and elevation.
- [ ] Check the rendered component in light/dark themes and actual computed colors/contrast.
- [ ] Verify pointer ripple origin, clipping, cancellation, keyboard interaction and reduced-motion behavior in a browser.
- [ ] Check FR/EN long labels, constrained widths, 200% zoom and icon alignment.
- [ ] Run component tests, lint, TypeScript, unit tests and production build.
- [ ] Review production call sites to ensure the five AndroidX variants use their matching named exports and validate custom colors in light/dark themes.

Passing static assertions or a Design Lab preview is not proof of full conformance. Do not mark the port verified until browser evidence and remaining source questions are closed.
