# Button — AndroidX Material 3 → React port

**Status:** Portage en cours. The five variant token roles, dimensions, elevation levels and state-layer opacities have been cross-checked against the pinned AndroidX source. Browser visual/interaction verification and the remaining site-wide button inventory are still open.

## Upstream authority

- [Pinned AndroidX `Button.kt` source](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
- [FilledButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledButtonTokens.kt)
- [ElevatedButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt)
- [FilledTonalButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt)
- [OutlinedButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt)
- [TextButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt)
- [StateTokens](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- [Surface](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Surface.kt)
- [ColorScheme](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt)
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
- Icon size: 18 dp; icon-to-label spacing: 8 dp.
- `labelLarge`: 14 sp, medium weight, 20 sp line height and 0.1 sp letter spacing.
- State layer opacities from `StateTokens`: hover 8%, focus 12%, pressed 12%; the AndroidX ripple alpha is not a fixed 10%.
- The default text style is Material `labelLarge`.
- Each public variant has its own color/elevation defaults. ElevatedButton uses `surface` with the `surfaceTint` overlay at 1 dp by default and 3 dp on hover; Button and FilledTonalButton use elevation 0 by default and 1 dp on hover; OutlinedButton and TextButton default to no elevation.
- Disabled container and label colors are token-derived per variant. The source tokens use on-surface at 12% opacity for disabled containers and on-surface at 38% opacity for disabled labels. ElevatedButton uses `surface` plus the `surfaceTint` tonal overlay at its 1 dp resting elevation and 3 dp hovered elevation; when disabled, it uses the same 12% on-surface container as the other filled variants.
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

The shared Web props preserve native `button` attributes and add `leadingIcon` for source-aligned content insets and `multiline` as an explicit Web layout extension. `AppLink` consumes the same `material-button-variant-styles.ts` contract and `ButtonRipple` interaction for `filled`, `elevated`, `filled-tonal`, `outlined` and `text` appearances while always rendering a Next.js anchor. Keyboard activation remains anchor-native (Enter, not Space). This is a `WEB-ADAPTATION`: visual variants are shared, but navigation semantics are never replaced by button semantics. The footer now uses the TextButton appearance; account sign-in and registration use filled/outlined appearances, and the delete-account entry uses a low-emphasis text appearance with the semantic error foreground. The old account-only `AccountActionLink` and its test assertions were removed after migrating its call sites. Generic action buttons in the expense splitter and the cron-expression and IPv4/IPv6 subnet resets now use `OutlinedButton`; date/time picker confirmation and cancellation use `Button` / `TextButton`; the Snackbar action uses `TextButton`. Their redundant page/component-local action styles were removed. These migrations preserve native button semantics; the Snackbar dismiss icon remains a separate icon-action migration candidate. The ripple is a `WEB-ADAPTATION`: unlike Compose's interaction indication, it is implemented with pointer/keyboard events and CSS. When `prefers-reduced-motion: reduce` is active, the component does not create animated ripples and falls back to the CSS pressed state layer; switching the preference to reduced motion clears active ripple state so hidden animations cannot leave stale entries. The optional `colors` prop accepts `containerColor`, `contentColor`, `disabledContainerColor` and `disabledContentColor`, matching AndroidX `ButtonColors`. CSS color values and semantic tokens are supported; hover/focus state layers derive from the selected content color, while disabled colors remain independently configurable. For destructive actions, use an official button component with semantic error roles (`--error` and `--on-error`) rather than a separate component. Use filled error colors for high-emphasis destructive confirmation and error-colored text/outlined buttons for lower-emphasis actions; don’t mark every reversible removal as destructive. The default HTML `type` is `button`; callers must opt into form submission with `type="submit"`.

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
- [x] Cross-check the disabled container/content roles and opacity against the pinned token definitions: on-surface at 12% for disabled containers; on-surface at 38% for disabled labels; ElevatedButton uses surfaceTint tonal elevation.
- [x] Cross-check all five variants’ container/content roles, shape, dimensions and elevation values against the pinned variant tokens, `StateTokens`, `Button.kt`, `Surface.kt` and `ColorScheme.kt`. The Web implementation maps surface tonal elevation to CSS color mixing at the source-defined 1 dp / 3 dp levels; actual browser color output remains to be visually checked.
- [x] Smoke-check the Vercel preview server render in EN and FR: ExpenseSplitter, CronExpression and IPv4/IPv6 subnet tool routes return HTTP 200, and the migrated pages no longer emit the removed local reset styles. [Preview deployment](https://loculary-m6s7954j3-nabouna32.vercel.app). This checks route rendering and emitted markup only; it is not visual or interaction verification.
- [ ] Check the rendered component and button-styled anchors in light/dark themes and actual computed colors/contrast.
- [ ] Verify pointer ripple origin, clipping, cancellation, keyboard interaction and reduced-motion behavior in a browser. Code-level reduced-motion handling now avoids creating animated ripples and clears active entries when the preference changes; actual browser behavior remains UNVERIFIED.
- [ ] Check FR/EN long labels, constrained widths, 200% zoom and icon alignment.
- [x] Vercel TypeScript check and production build succeeded for commit `093f0cc` after the token/style changes.
- [ ] Run `npm run lint` and `npm test` against the latest branch commit; the GitHub Actions run has not been observed for these connector-created commits.
- [x] Migrate generic action buttons to shared variants in ExpenseSplitter, CronExpression, IPv4/IPv6 subnet calculators, DatePickerDialog, TimePickerDialog, Snackbar action, Design Lab audit workbench, RecentTools, ModalBottomSheet and PullToRefreshBox. Remove the duplicated local action styles where the shared component owns the treatment.
- [ ] Complete the site-wide native-button inventory by checking every production call site against its real interaction and the pinned AndroidX source before classifying it. Initial candidates for the next component lots include icon-only actions (header/search, Snackbar dismiss, date navigation, swipe-to-dismiss), selection controls (theme, hash-generator modes, time-picker fields), and compound controls (SplitButton, ButtonGroup, FAB). These are candidates, not completed audits; do not preserve custom implementations just because they already exist, and do not force component-specific controls into generic Button.
- [ ] Validate custom Button colors and all variants in light/dark themes in a browser.

Passing static assertions or a Design Lab preview is not proof of full conformance. Do not mark the port verified until browser evidence and remaining source questions are closed.
