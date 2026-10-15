# Material 3 / Pixel implementation audit

**Date:** 2026-10-14  
**Canonical direction:** DEC-026 — Material 3 Fidelity + current Pixel / Android patterns  
**Scope:** Production foundations, shared UI primitives, application shell, search/navigation, tool shell, account UI, status feedback and the Design Lab.  
**Audit type:** Static source review against official references. This is not a claim that every route has been visually inspected in a running browser; browser-level light/dark, keyboard, responsive and contrast verification remains an explicit acceptance gate.

## Executive summary

The implementation has useful shared tokens and primitives, but its code does not consistently follow the accepted design contract. The most important issue was a source-of-truth conflict: the contract selected **MCU Fidelity**, while the production theme generator and a test still required **MCU Expressive**. The production tonal button also used the primary container roles instead of the default Material filled-tonal button roles. Several Design Lab elements placed primary-colored content on primary-container surfaces.

The first correction pass changes the production scheme to Fidelity, generates error roles from that same scheme, corrects the production tonal button and fixes the identified Lab foreground/container pairings. Remaining findings and component candidates are tracked below; they must not be treated as already fixed.

## Method and authority

Use sources in this order:

1. Official Material 3 guidance and Android Developers component documentation for semantics, roles, states and intended use.
2. Official Material Web component documentation for web-specific component variants and tokens where available.
3. Loculary's accepted design contract and DEC-026 for product decisions (blue seed #4285F4, Fidelity semantic scheme, official MCU Rainbow only for category identity, Roboto, Pixel-inspired core M3).
4. Browser inspection and automated tests for the actual Loculary implementation.

Android Compose examples are authoritative for M3 design semantics, but Compose APIs and native interaction models must not be copied literally into HTML. The implementation must preserve web semantics, keyboard/pointer behavior and accessibility. Expressive is a distinct option, not the selected production direction.

## Confirmed findings

| Priority | Area | Evidence in repository | Required correction / status |
|---|---|---|---|
| P0 | Production theme variant | src/lib/design-system/rainbow-tones.ts instantiated SchemeExpressive, although DEC-026 and docs/DESIGN-SYSTEM.md specify Fidelity. src/lib/tools/categories.test.ts explicitly asserted Expressive. | **Corrected in this pass:** production semantic roles and test expectation now use SchemeFidelity. Verify generated light/dark role values and representative screens before declaring palette work complete. |
| P0 | Error roles | src/app/globals.css hardcoded light/dark error, on-error and error-container values separately from the generated scheme. | **Corrected in this pass:** error roles are emitted from the same Fidelity scheme and bound through semantic CSS variables. Keep fallbacks only for resilient rendering. |
| P1 | Filled tonal button | src/components/ui/Button.tsx used primary-container / on-primary-container for its tonal variant. The standard Material filled-tonal button uses secondary-container roles by default. | **Corrected in this pass:** uses secondary-container / on-secondary-container. Review hover/pressed state layers separately; changing brightness on the whole element is not yet a complete M3 state-layer implementation. |
| P1 | Foreground/container pairing in Lab | src/app/[locale]/design-lab/visual-lab.module.css used primary as foreground on primary-container in several badges, icon tiles, selected chips, result panels and motion samples. | **Corrected in this pass:** affected primary-container content uses on-primary-container. The Lab remains a prototype and is not evidence of production conformance. |
| P1 | Production foreground/container pairing | Explorer intent chips, theme selection, the desktop menu's saved-space icon, collection save action, search/home hover states and the account danger link mixed a container background with a different foreground role or an unrelated surface foreground. | **Corrected in this pass:** container states use the matching on-container role; broad cards and suggestion chips use neutral surface states where mixed content makes a container foreground inappropriate. |
| P1 | Mixed-content result surfaces | Shared ResultPanel and several calculator result areas used the primary container while combining on-surface, muted and error text roles. | **Corrected in this pass:** these result surfaces use a neutral surface-container role with the accent retained as a restrained border; the editorial callout uses on-primary-container for its primary container. |
| P1 | Functional icon consistency | The site had Unicode action glyphs and separately drawn SVG icons across search, navigation, account, category cards, favorites/collections, language selection and the Design Lab. | **Corrected for the shared UI in this pass:** shared Material Symbols Outlined paths now cover copy/reset, processing status, theme, search, navigation, account, favorites/collections, language, conversion, breadcrumbs, disclosure controls and Lab controls. Remaining SVGs found by source search are brand artwork, the app icon, actual flag assets and generated QR output; tool/category emoji remain content identity, not action icons. Keep auditing newly added components against this shared source. |
| P1 | Shared stateful controls | PasswordGenerator and the Lab gallery used raw checkboxes/range inputs, and the Lab used a one-off green switch and a hand-built progress bar. | **Source edits made; runtime verification open:** shared Checkbox and Switch use theme-overridable semantic roles and component-specific disabled states based on first-party Material Web tokens. Checkbox selected/unselected disabled treatment is distinct; Switch selected/unselected track and handle roles are distinct. PasswordGenerator and the Lab use the shared Checkbox, and the Lab switch follows its selected preview palette. Do not add fake account preferences without persistence, and do not use a switch for multi-select lists or substitute it for radio/segmented choices. |
| P1 | Shared slider and progress | PasswordGenerator and ImageCompressor used raw range inputs; the Lab had a one-off slider/progress bar, and ImageCompressor showed a busy state without an indeterminate progress indicator. | **Implemented and wired:** shared Slider has a native range input, accessible label/value text, 48px interaction height, semantic active/inactive track roles and visible focus. ProgressIndicator supports determinate and indeterminate states with a reduced-motion fallback. PasswordGenerator, ImageCompressor and the Lab use the shared controls; verify browser rendering and assistive-technology announcements. |
| P1 | Feedback components | Copy/clear and processing feedback exist, but no shared production Snackbar, Dialog or Tooltip primitive was found in the scanned UI components; these examples exist in the Lab only. Some result/status messages are implemented independently in pages and tools. | Open: inventory actual flows and consolidate only where repeated behavior warrants it. Prioritize accessible transient feedback for copy/reset, confirmation dialogs for destructive actions, and tooltips only where they add information not already available to keyboard/touch users. |
| P2 | Custom status palette | globals.css defines success, warning and info colors separately from MCU roles. The light success pair initially measured 4.44:1 against its soft background, just below the WCAG AA 4.5:1 threshold for normal text. | **Corrected and regression-tested:** light success foreground changed from #087f5b to #087755 (4.93:1). The status contrast test checks info, success and warning in both themes; measured ratios are 4.81:1 or higher after correction. Keep separate semantic status roles and never communicate status by color alone. |
| P2 | Component state styling | Buttons and icon buttons have consistent focus rings, but hover brightness filters and active scaling are used broadly. | Open: compare enabled, hover, focus-visible, pressed, selected, disabled and loading states with official component guidance. Keep state feedback subtle and respect reduced motion. |
| P2 | Shared primitive coverage | Existing primitives include Button, IconButton, SegmentedControl, TextField, TextArea, Select, Checkbox, Switch, Slider, ProgressIndicator, MaterialIcon, Card and Panel; several tool/page controls are implemented locally. | Open: build an inventory of call sites and decide which local patterns truly recur before adding abstractions. Do not force specialized tool interfaces into a generic renderer. |

## Component inventory and audit checklist

| Family | Current implementation surface | Audit focus |
|---|---|---|
| Color and theme | rainbow-tones.ts, globals.css, m3-theme.ts, category color helpers | Fidelity vs Expressive, complete light/dark roles, role pairing, category-only Rainbow usage, contrast of actual computed values |
| Buttons | ui/Button.tsx, ui/IconButton.tsx, ui/SegmentedControl.tsx, account submit buttons, local tool actions | M3 variant intent, semantic color roles, icon/text spacing, state layers, disabled/loading behavior, hit targets |
| Selection | ui/SegmentedControl.tsx, shared Checkbox/Switch/Slider, selected chips in search/Lab | Single-choice vs multi-choice semantics, selected state, keyboard operation, labels, touch target and contrast |
| Text input | ui/TextField.tsx, ui/TextArea.tsx, ui/Select.tsx, search inputs and tool-local fields | Visible labels, helper/error association, invalid/disabled/focus states, mobile keyboard hints, autofill, long labels and zoom |
| Cards and surfaces | ui/Card.tsx, ui/Panel.tsx, ToolCard, CategoryCard, result panels | Elevated/filled/outlined roles, unnecessary nesting, surface-container mapping, dark theme, interaction semantics |
| Navigation | Header, desktop menu, mobile header search, Footer, Breadcrumbs, tool navigation | Disclosure vs menu semantics, focus restoration, Escape/outside dismissal, active destination, responsive composition |
| Search | ToolSearch, SearchResultsClient, header search | Combobox/listbox semantics, synchronized ARIA state, result announcements, loading/empty/error states, anchored unclipped overlay |
| Tool shell | ToolPageHeader, ToolProcessingStatus, ToolSection, ProgressIndicator and shared runtime actions | Consistent tool identity, privacy/processing disclosure, result-first hierarchy, long-running work, cancellation/progress where applicable |
| Feedback | CopyButton, ClearButton, FavoriteButton, status messages in pages/tools | Success/failure confirmation, announcements, transient vs persistent messages, deduplication and action timing |
| Account/preferences | Account pages, ThemeToggle, shared Switch/Checkbox and local form controls | Reusable switch for on/off settings, validation/error presentation, destructive confirmation, persistence state |
| Typography and shape | Global font and radius tokens plus page-level Tailwind values | Roboto roles, line height, localization, density, consistent shape vocabulary, no clipping at narrow widths |
| Motion | Global view transitions, CSS transitions/animations, Lab motion examples | Cause/effect, duration/easing, reduced-motion behavior, no essential information conveyed only through motion |
| Icons | Inline SVG, emoji category identity, Unicode glyphs | One functional icon language, consistent size/weight, accessible names, decorative hiding, selected/toggled state |

## Components worth adding — only when tied to real flows

1. **Switch — implemented.** Use for persistent binary preferences; do not add fake account preferences without real persistence.
2. **Checkbox — implemented.** PasswordGenerator and the Lab gallery use the shared component; continue migrating any new raw checkboxes.
3. **Progress indicator — linear version implemented.** ImageCompressor uses the indeterminate form while work is in progress, and the Lab demonstrates determinate progress. Never invent a percentage when the work is indeterminate; circular progress remains a candidate only if a real flow needs it.
4. **Snackbar / transient feedback** — for brief results such as copy/reset when an inline status is not better.
5. **Dialog** — for decisions requiring focus and a clear confirmation/cancel path, especially destructive actions.
6. **Tooltip** — only for supplementary information, not as the sole label or explanation of an essential action.
7. **Radio group** — for mutually exclusive choices when a segmented control is not appropriate.
8. **Slider — implemented.** Used for password length, image quality and the Lab sample; verify behavior on mobile browsers and keyboard/assistive technology.
9. **Tabs / bottom sheet / navigation drawer** — evaluate against real information architecture and responsive needs; do not add just because Android has them.

A component should be added when it improves a real product flow and can be implemented with its complete semantics and states. The design contract explicitly rejects building the whole M3 catalogue preemptively.

## Official references

- [Material 3 theming, semantic roles, contrast and elevation — Android Developers](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr)
- [Material 3 ColorScheme API — Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)
- [Material 3 components catalogue — Android Developers](https://developer.android.com/develop/ui/compose/components)
- [Buttons — Material Web](https://github.com/material-components/material-web/blob/main/docs/components/button.md)
- [Icon buttons — Material Web](https://github.com/material-components/material-web/blob/main/docs/components/icon-button.md)
- [Switch — Material Web](https://github.com/material-components/material-web/blob/main/docs/components/switch.md)
- [Icon buttons — Android Developers](https://developer.android.com/develop/ui/compose/components/icon-button?hl=fr)
- [Checkbox — Android Developers](https://developer.android.com/develop/ui/compose/components/checkbox?hl=fr)
- [Switch — Android Developers](https://developer.android.com/develop/ui/compose/components/switch?hl=fr)
- [Segmented buttons — Android Developers](https://developer.android.com/develop/ui/compose/components/segmented-button?hl=fr)
- [Chips — Android Developers](https://developer.android.com/develop/ui/compose/components/chip?hl=fr)
- [Progress indicators — Android Developers](https://developer.android.com/develop/ui/compose/components/progress?hl=fr)
- [Snackbar API — Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/material3/Snackbar.composable)
- [Material Symbols — Google Fonts](https://fonts.google.com/icons)
- [Material Symbols SVG source and Apache-2.0 license — marella/material-symbols](https://github.com/marella/material-symbols/tree/main/svg/400/outlined)
- [Material Web checkbox design tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-checkbox.scss)
- [Material Web switch design tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-switch.scss)
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/)

## Acceptance gate before calling the system conformant

- [ ] The production theme uses Fidelity for semantic seed-derived roles; Rainbow remains category identity only.
- [ ] Foreground/background pairings use the matching on-* role and are checked using actual resolved light/dark colors.
- [ ] Contrast is verified for text, icons, borders, focus indicators, selected/disabled states and status messages.
- [ ] Each shared component is reviewed in every applicable state, not only its default screenshot.
- [ ] Keyboard, focus restoration, screen-reader names/states and live feedback are verified.
- [ ] Reduced-motion preferences suppress nonessential motion without removing state feedback.
- [ ] French and English strings fit without clipping at mobile, tablet, desktop and zoomed layouts.
- [ ] Representative compositions are checked: home/search, explorer, account/preferences, compact tool, result-heavy tool and advanced tool.
- [ ] Automated lint, typecheck, tests and build pass after each implementation slice.
- [ ] Any remaining deviation is recorded as an intentional Loculary decision, not mislabeled as an Android rule.

## Follow-up audit — expanded component coverage (2026-10-14)

This section records the next static pass. It distinguishes **confirmed source findings** from **browser checks still required**; it does not claim a screenshot-based or runtime visual audit.

### Confirmed follow-up finding

| Priority | Area | Evidence | Correction / remaining verification |
|---|---|---|---|
| P1 | Pixel preview bottom navigation | `src/app/[locale]/design-lab/visual-lab.module.css` used the primary color for the selected navigation label while the selected indicator already used secondary-container roles. Navigation buttons also lacked an explicit 48px minimum height and dedicated Pixel hover/pressed/focus states. | **Corrected on the follow-up branch:** selected label now uses the Lab surface foreground; selected icon indicator retains secondary-container / on-secondary-container; items have a 48px minimum height and explicit hover, pressed and focus-visible treatment. Verify actual contrast and wrapping at mobile widths in a running browser. |

### Expanded audit inventory

Every family below is in scope. A family being listed does **not** mean every instance has already been inspected or passed.

| Family | Production call sites / primitives to inventory | Required checks |
|---|---|---|
| Theme foundations | `rainbow-tones.ts`, `m3-theme.ts`, `globals.css`, theme toggle, category-role helpers | Fidelity scheme consistency; complete light/dark roles; generated foreground/container pairs; no hard-coded per-component palette; seed/contrast-level behavior; no Rainbow colors outside category identity unless explicitly approved |
| Buttons and actions | `ui/Button.tsx`, `ui/IconButton.tsx`, account forms, search actions, all tool-local buttons, Lab examples | Correct filled / filled-tonal / outlined / text / elevated intent; paired semantic roles; hover, focus-visible, pressed, disabled, loading; keyboard activation; icon spacing; minimum target size; no whole-element brightness filter as a substitute for a defined state layer |
| Navigation and app shell | desktop/mobile headers, breadcrumbs, menus, theme/language menus, bottom navigation examples, account navigation | Correct selected vs unselected semantics; readable labels; responsive adaptation; menu focus and Escape behavior; active route semantics; safe-area insets where applicable; no selected state communicated by color alone |
| Text inputs and search | `TextField`, `TextArea`, `Select`, mobile search, tool-local inputs | Persistent visible labels; helper/error association; invalid, disabled and focus states; placeholder contrast; numeric keyboard hints; autofill; keyboard behavior; no placeholder used as the only label |
| Selection controls | `Checkbox`, `Switch`, segmented controls, chips, native select/radio groups and raw tool checkboxes | Correct single-choice vs multi-choice vs on/off semantics; label and description association; checked/selected contrast; keyboard operation; disabled state; touch target; no switch used for multi-select or navigation |
| Surfaces and data display | `Card`, `Panel`, result panels, calculator outputs, tool sections, empty states, category cards | Surface-container hierarchy; appropriate `onSurface` / `onSurfaceVariant`; mixed-content panels stay neutral; tonal elevation only when meaningful; borders not overused; content hierarchy and overflow |
| Feedback and status | copy/reset feedback, loading indicators, validation, success/warning/error panels, snackbar, dialogs | Reusable pattern where behavior repeats; status text/icons plus color; announcement semantics; snackbar dismissal and timing; confirmation for destructive actions; no fake success feedback |
| Overlays and disclosure | dialogs, bottom sheets, popovers, tooltips, collapsible sections, dropdown menus | Focus management and return; Escape/outside-click behavior; accessible name; stacking and clipping; scroll locking; pointer and keyboard parity; tooltip not required to reveal essential information |
| Icons and imagery | `MaterialIcon`, navigation/action icons, tool/category identity, logos, flags, QR output | One shared functional icon source; correct size and optical alignment; `currentColor` and semantic role; decorative vs labelled accessible name; intentional exceptions documented; no custom inline SVG for standard actions |
| Typography and shape | global type styles, headings, helper text, button labels, radii | Roboto and defined type scale; readable hierarchy at zoom; line-height and wrapping; consistent component shape; no clipped labels at localization or 200% zoom |
| Motion and state layers | global motion tokens, button transitions, screen transitions, Lab motion demo | Distinct enabled/hover/focus/pressed/selected/disabled/loading states; reduced-motion support; no unnecessary scaling or brightness filters; no motion that delays interaction |
| Accessibility and responsive behavior | all shared primitives and routes, mobile/tablet/desktop layouts | WCAG 2.2 AA contrast for text and UI components; keyboard-only walkthrough; visible focus; screen-reader names and status announcements; 200% zoom/reflow; target size; reduced motion; light/dark parity |
| Forms and account settings | login/account forms, preferences, destructive and save actions | Field-level validation and error text; submit/loading/disabled states; real persistence before claiming a preference is saved; confirmation where loss/destruction is possible; correct autocomplete and password behavior |
| Specialized tools | calculators, converters, generators, image/file tools, result/export controls | Preserve task-specific layouts; use shared primitives where behavior repeats; audit each unique state and output; don't force every tool into a generic card/template |

### Evidence-based color rules

- For content placed on a filled role, use its paired foreground role: `primary` with `onPrimary`, `primaryContainer` with `onPrimaryContainer`, and likewise for secondary, tertiary, error and inverse surfaces.
- For neutral mixed-content panels, prefer the appropriate surface role with `onSurface` / `onSurfaceVariant`; do not use a colorful container if some text or icons still inherit unrelated neutral colors.
- A generated Material scheme is a starting point, not proof that custom CSS overrides, opacity, overlays, disabled states or gradients remain accessible. Test the rendered pairings.
- Use state layers / subtle state-specific colors rather than indiscriminate brightness filters that alter the entire component and its content.
- Keep contrast and role pairing separate from brand preference: a chosen blue seed does not justify using the primary color for every label or active state.

### Official references used for this pass

- Android Developers, [Material 3 design system and color accessibility](https://developer.android.com/develop/ui/compose/designsystems/material3): semantic roles, correct foreground/container pairings, dynamic color and the need to re-check customized components.
- Android Developers, [Navigation bar](https://developer.android.com/develop/ui/compose/components/navigation-bar): intended use for 3–5 destinations on compact layouts and selected destination semantics.
- Android Developers, [NavigationBarItem API](https://developer.android.com/reference/kotlin/androidx/compose/material3/NavigationBarItem.composable): selected state, label, icon, and component color configuration.
- Android Developers, [Material 3 Surface API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Surface.composable): surface content color, tonal elevation and the distinction between tonal and shadow elevation.

These references guide design semantics. Native Compose behavior is not assumed to transfer automatically to HTML; web accessibility and interaction behavior must be tested in the browser.

### Acceptance gate remains open

- [ ] Run the repository's relevant test suite, lint, typecheck and production build.
- [ ] Inspect every production route at mobile, tablet and desktop widths in both themes.
- [ ] Inspect every interactive component in enabled, hover, focus-visible, pressed, selected, disabled, loading and error states where applicable.
- [ ] Measure rendered text and non-text contrast, including generated palette seeds and dark mode.
- [ ] Perform keyboard-only and screen-reader checks for navigation, dialogs, menus, fields and transient feedback.
- [ ] Confirm reduced-motion behavior and 200% zoom/reflow.
- [ ] Re-run the source inventory when new UI components or one-off tool controls are added.

### Additional confirmed shared-action finding

| Priority | Area | Evidence | Correction / remaining verification |
|---|---|---|---|
| P1 | Hover contrast on shared actions | `Button.tsx`, `IconButton.tsx`, `FavoriteButton.tsx`, `AccountActionLink.tsx` and the signed-out Collections call-to-action used `hover:brightness` on the whole element. This changes the foreground and container together, rather than expressing a Material state layer, and can make text/icons harder to read. | **Corrected on the follow-up branch:** primary, tonal, neutral and danger actions now use explicit semantic color mixes for hover/pressed states without dimming their foreground content. Added regression assertions. Verify generated CSS and actual contrast in both themes after the production build. |

### Additional confirmed foundation finding — incomplete surface-role aliases

| Priority | Area | Evidence | Correction / remaining verification |
|---|---|---|---|
| P1 | Production semantic surface roles | `rainbow-tones.ts` generated the full Fidelity scheme internally but exposed only a subset of neutral surface roles through CSS aliases. Components could not consistently request modern M3 roles such as `surfaceContainerHighest`, `surfaceDim`, `surfaceBright` or `onSurface` through the shared semantic token layer. The shared Switch consequently used the older `surface-variant` role for its unchecked track. | **Corrected on the follow-up branch:** expose `on-background`, `on-surface`, surface dim/bright, all five surface-container levels and surface tint in generated tokens and light/dark CSS aliases. The shared Switch now uses `surface-container-highest`, with the old role retained only as a resilient fallback. Regression tests guard the aliases. |

The added Fidelity contrast regression uses the production MCU scheme version (2025) and checks core foreground/container pairs across three representative seeds and both themes. This automated test complements—not replaces—contrast checks on actual rendered components, especially custom opacity, disabled states, state layers and borders.


## Follow-up audit — buttons and icon buttons (2026-10-15)

### Verified against official references

- [Material 3 buttons (Android Developers)](https://developer.android.com/develop/ui/compose/components/button?hl=fr): M3 defines filled, elevated, filled tonal, outlined and text variants. The web implementation must preserve these semantic distinctions without copying Compose APIs into React.
- [Material 3 IconButton API](https://developer.android.com/reference/kotlin/androidx/compose/material3/IconButton.composable): the documented standard touch target is at least 48×48 dp and the typical icon is 24×24 dp.
- [Material 3 Button API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable): the official API exposes content padding and size defaults; use the current M3 baseline as a reference, then verify actual web rendering.

### Newly confirmed source-level findings

| Priority | Finding | Correction in this pass | Remaining validation |
|---|---|---|---|
| P1 | Button labels could wrap because the shared primitive did not prevent wrapping; its default sizing had no minimum width and used 20px horizontal padding, while the label weight was heavier than the usual M3 label treatment. | Added min-w-16, whitespace-nowrap, shrink-0, 24px horizontal padding, 14px/20px medium label typography, and retained the 40px minimum height. Action groups must wrap as groups rather than squeeze individual labels. | Check long French/English labels at mobile widths and 200% zoom; custom per-call-site classes can still override defaults. |
| P1 | The shared Button API lacked an elevated M3 variant. | Added elevated using a low surface-container role and restrained elevation. primary remains a compatibility name for filled; danger, secondary, and ghost are explicitly documented as app-specific compatibility variants, not canonical M3 button names. | Inventory and migrate compatibility variants by action intent; don't rename call sites mechanically. |
| P1 | IconButton size="compact" produced a 40×40px target, below the 48×48px Android M3 minimum touch target guidance. | Kept the compatibility prop but enforced a 48×48px interactive target for all sizes; documented 24px as the typical icon size. | Inspect the visual container and surrounding layout in browser; confirm adjacent targets don't overlap. |
| P1 | IconButton had no explicit toggle state contract. | Added optional selected; only toggle actions should pass it, exposing aria-pressed and selected semantic colors. | Audit all call sites to distinguish momentary actions from toggles and verify selected state in the running UI. |
| P1 | Existing tests checked colors and broad patterns but not button dimensions, label wrapping or toggle semantics. | Added focused source regression tests for the shared primitives. | Browser tests and screenshot review are still required; source tests do not prove pixel-perfect rendering. |

### Current confidence boundary

This is a static source audit against official Android/Material references, not a claim that the app has been visually verified in a live browser. A web implementation can faithfully implement M3 patterns, but these React components are Loculary-owned components, not Google's native Compose components. Before declaring full conformance, run the site at narrow mobile, tablet and desktop widths in light/dark themes; inspect computed dimensions, focus/pressed/disabled/selected states, keyboard behavior, localization, and 200% zoom. Continue auditing all shared components and local button-like controls using the inventory above.


Additional call-site fixes in this pass:
- Legacy `secondary` and `ghost` Button names now map to the canonical outlined and text visual treatments instead of maintaining separate non-M3 styles.
- The Unit Converter's icon-only swap action now uses the shared IconButton and Material Symbols icon instead of a text glyph inside a general Button.
- Removed the local 36px sizing override from the admin role action so the shared control owns its dimensions.
- Selected icon-button colors are variant-aware; selecting a filled button no longer incorrectly replaces its primary container with the tonal container.


### Official web implementation decision

The current `Button` and `IconButton` are Loculary-owned React primitives; they are **not** imported Google Material Web components. The official `@material/web` project does provide M3 web components, but its own README states that the project is in maintenance mode pending new maintainers ([official repository](https://github.com/material-components/material-web)). Do not claim the current primitives are official components, and do not wholesale-replace the React controls without a compatibility review of Next.js SSR/hydration, form semantics, dynamic Loculary color roles, accessibility and bundle impact. For now, align the React primitives to the documented M3 variants/tokens and keep this migration decision explicit for a separate architecture review.

The canonical API names are now exposed for `filled`, `elevated`, `filled-tonal`, `outlined` and `text`; old `primary` / `tonal` and app-specific names remain as compatibility aliases while call sites migrate by intent.

Disabled-state follow-up: both shared primitives now use explicit semantic disabled container/content/border roles instead of applying a uniform opacity to the entire control. This is intended to preserve the M3 distinction between disabled container and disabled label/icon; computed contrast and rendered appearance still need browser verification.


### Follow-up call-site audit: favorites

The compact favorite toggle previously used a local 40×40px button, below the 48×48px M3 icon-button touch target documented by Android. It now delegates to the shared `IconButton` when compact and the shared `Button` when labeled, preserving the pressed/busy/disabled semantics and using the canonical filled-tonal/outlined treatments. A regression test guards against reintroducing the undersized local control.

- The number-base converter's swap action now uses the shared outlined `IconButton` with a 24px Material Symbols icon instead of a one-off button style.

- Theme and language dropdown triggers are disclosure summaries rather than native buttons, so they remain disclosure controls; their icon-only hit areas are now 48×48px and circular to match the M3 icon-button target geometry.

- The mobile header search trigger now uses the shared `IconButton` rather than a parallel local style. The shared primitive accepts a button ref so Escape-close focus restoration still returns to the trigger; the open state is also exposed as a selected toggle state.
- The compact favorite icon now renders at the documented 24px glyph size, not merely a 24px CSS box around a 20px glyph.


### Follow-up: collection and favorite list actions

The collection create/rename/add/remove/share/copy/delete actions and the labeled remove-favorite action now use the shared `Button` variants instead of repeating local padding, state-layer and disabled-opacity classes. The collection selector remains a bespoke selectable card because it is a large selection surface, not a standard M3 action button. The navigation link to the account remains a link to preserve its navigation semantics.

- The Design Lab token bridge now maps `error` / `on-error` from the selected generated scheme as well, so shared destructive buttons don't fall back to production/global colors while previewing another palette.


## Follow-up — Slider, ProgressIndicator and disabled state tokens (PR #723 port)

The source-level convention and implementation intent for these additions are recorded in [`docs/M3-CONVENTIONS.md`](./M3-CONVENTIONS.md). Official references: [Android Material 3 Slider](https://developer.android.com/develop/ui/compose/components/slider), [Android Material 3 progress indicators](https://developer.android.com/develop/ui/compose/components/progress), [Material Web checkbox tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-checkbox.scss) and [Material Web switch tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-switch.scss).

- **Slider:** a shared native `input[type="range"]` with visible label/value, `aria-valuetext`, semantic active/inactive tracks, visible focus and a 48px interaction height. The 48px height is a Loculary web implementation choice informed by Android touch-target guidance; it is not a claim that 48 dp equals 48 CSS px.
- **ProgressIndicator:** shared linear determinate/indeterminate implementation. Only determinate values expose `aria-valuenow`; indeterminate work does not invent a percentage. CSS includes a reduced-motion fallback.
- **Checkbox/Switch disabled state:** use component-specific AndroidX M3 token patterns, cross-checked against Material Web. Checkbox: selected disabled container/checkmark and unselected outline use 38% opacity; unselected outline is 2dp and selected outline is absent. Switch: disabled track layers use 12%, selected handle uses surface at 100%, and unselected handle uses on-surface at 38%. Validate actual rendering in both themes.
- **Call sites intended by PR #723:** PasswordGenerator, ImageCompressor and Design Lab. Browser checks in Chromium, Firefox and mobile touch, plus keyboard/assistive-technology verification, remain outstanding.
- **Port status in PR #729:** shared Slider/ProgressIndicator, tool call sites, Lab demo, disabled-state examples, semantic control styling, and regression assertions have been ported into current-main-based files. This is a source edit, not a verified pass: CI/tests/build and browser checks still need to run. PR #723 is closed without merging; PR #729 remains open and unmerged.

## Canonical conventions

See [`docs/M3-CONVENTIONS.md`](./M3-CONVENTIONS.md) for the detailed source hierarchy, semantics, implementation constraints and acceptance checklist.
## Follow-up — resolved Lab theme source and CI test regression (2026-10-15)

- [SOURCE-OBSERVED → source edit made] Design Lab theme: VisualLab.tsx previously initialized a separate local theme state to "light" and exposed its own Light/Dark selector, even though the app already provides a global theme setting. The component has now been changed to read resolvedTheme from the existing @teispace/next-themes provider and the duplicate selector has been removed. [OPEN] Typecheck/build and runtime behavior still need to confirm the provider API and system-theme transitions work correctly; do not mark the theme issue fully verified yet.
- [SOURCE-OBSERVED] CI regression: the first CI run for the port reached lint and typecheck successfully, then failed in src/lib/design-system/material-components.test.mjs with SyntaxError: Identifier 'labCss' has already been declared. The merged test edits had duplicate top-level declarations for labCss, imageSource, sliderSource, sliderCss, progressSource and progressCss.
- Source correction committed: removed duplicate declaration lines, keeping one declaration for each source. A new CI run must confirm the test file parses and the suite passes. The prior failure is not a product-component test failure; it is a test-module syntax failure.
- [OPEN] Slider CSS follow-up: the Firefox focus-thumb rule currently references var(--focus-ring) directly while the WebKit rule uses var(--slider-focus-ring, var(--focus-ring)). Review this inconsistency and correct it before calling the shared slider theme-overridable across browsers.
- [ANDROID-M3] Disabled values are component-specific and confirmed by pinned AndroidX tokens; Material Web corroborates the web implementation. Checkbox uses 38% selected container/checkmark and unselected outline, with a 2dp unselected outline. Switch uses 12% track opacity, surface selected handle and 38% unselected handle. Outlined fields use 38% text and 12% outline; filled-field container opacity is 4%. See the pinned sources in M3-CONVENTIONS.md.
## Follow-up — state token and validation announcement corrections (2026-10-15)

- [ANDROID-M3 + SOURCE-OBSERVED] Pinned AndroidX SwitchTokens confirm disabled track opacity 12%, selected handle surface color, and unselected handle on-surface at 38%; Material Web corroborates this web-side. The implementation distinguishes selected/unselected disabled track colors and handle roles. [OPEN] Computed colors and visual rendering still need browser verification.
- [SOURCE-OBSERVED → source edit made] The shared Slider Firefox thumb focus ring used the global focus token directly while WebKit used the component-overridable slider focus token with fallback. Both now use the same override/fallback contract; a static regression assertion checks for the shared token. [OPEN] Actual Firefox rendering remains unverified.
- [SOURCE-OBSERVED → source edit made] The Design Lab always-visible validation sample used the shared ValidationMessage whose default role is alert. That made an illustrative, non-error example an assertive live region. ValidationMessage now supports alert/status/no role; the Lab preview opts out of the live role while production call sites keep the default alert behavior. Regression assertions cover this contract. Review whether each production validation flow really warrants an assertive alert as part of the wider accessibility audit.
- [OPEN] CI has not yet reported a run for the newest branch head. The previous completed run failed due to duplicate test declarations; the syntax correction and the new regression assertions must be verified by an actual test run before considering this slice green.

## Follow-up — official Material Web shape and field-token evidence (2026-10-15)

- [MATERIAL-WEB] Added shared semantic shape variables based on the version-pinned first-party Material Web system-shape token file: none 0px, extra-small 4px, small 8px, medium 12px, large 16px, extra-large 28px, full 9999px. TextField, TextArea and Select now use the extra-small token instead of the legacy 16px radius. This is Material Web web-token provenance, not an Android dp conversion.
- [MATERIAL-WEB] Shared Checkbox geometry now follows first-party Material Web tokens: 18px container, 2px corners, 18px icon. The 48px wrapper is a Loculary web target-size choice.
- [MATERIAL-WEB] Outlined field tokens distinguish 38% disabled input/label/supporting text from 12% outline; filled field tokens specify 4% disabled container opacity. TextField, TextArea and Select no longer fade the entire disabled control to 60%; labels, text, placeholder/unit and borders use distinct semantic treatments.
- [OPEN] Verify CSS compilation, computed color blends, field/checkbox geometry and both themes in browsers. The global rounding-degree control and shape mapping for buttons/cards/panels/dialogs/Lab compositions remain open.
## Follow-up — Card source conformance (2026-10-15)

- [MATERIAL-WEB] Version-pinned first-party card token sources confirm medium shape for elevated, filled and outlined cards. Their surface roles differ: elevated uses surface-container-low and level-1 elevation; filled uses surface-container-highest and level-0; outlined uses surface with outline-variant and level-0. Shared Card now uses these roles and the medium shape token.
- [SOURCE-OBSERVED → source edit made] Linked cards now expose a visible focus ring. The ring is source-level present; browser contrast and clipping remain unverified.
- [LOCULARY-DECISION] Panel and ResultPanel are Loculary compositions, not official named M3 components. They share the medium shape token to keep the surface family coherent.
- [OPEN] Audit nested cards, tool-local rounded containers and Lab mockups before declaring shape mapping complete.
## Follow-up — segmented control and label wrapping (2026-10-15)

- [SOURCE-OBSERVED → source edit made] SegmentedControl had a nonstandard per-segment description row, which compressed labels and could make segments wrap. Removed that optional extension from the shared component. Percentage and Video Bitrate now render the selected mode description outside the segmented group; native mobile select options retain their explanations.
- [LOCULARY-DECISION] Segment labels use whitespace-nowrap to prevent wrapping. Interior segments now use the AndroidX-documented rectangular shape; the earlier small-radius implementation was removed. CSS-pixel dimensions remain web adaptations.
- [OPEN] Verify long French labels at supported widths and keyboard navigation in browsers. Do not claim segmented control conformance based only on static source checks.
## Follow-up — field geometry and numeric-step behavior (2026-10-15)

- [MATERIAL-WEB] Outlined text-field and outlined-select tokens specify a 56px one-line container baseline. Shared TextField and Select now use min-height 56px; TextArea remains row/content-driven.
- [WEB-STANDARD] Source inspection found TextField set step="any" and then spread input props afterward, allowing an undefined step to override the decimal default. The component now destructures step and uses an explicit caller step when present, otherwise step="any" for number fields. Regression assertion added; form behavior still needs runtime testing.

## Follow-up — Lab rounding control and theme regression (2026-10-15)

- [SOURCE-OBSERVED → source edit made] Added a 0–100% rounding-degree slider to the Design Lab. It scales the semantic shape tokens from square corners to the version-pinned Material Web baseline and applies to shared/token-driven components; full coverage is intentionally still open because several legacy Lab mockups use fixed radii.
- [LOCULARY-DECISION] The control is an experimental preview affordance, not an official Android setting. It preserves full/pill shapes as full and does not convert CSS pixels to Android dp.
- [SOURCE-OBSERVED → source edit made] Removed a stale local theme setter left in the Lab profile mockup after the Lab was switched to the app's resolved theme. The mock preference now toggles only its own preview state; the global theme remains controlled by the site header. Added static regression checks.
- [SOURCE-OBSERVED → source edit made] Updated Lab disabled Checkbox/Switch overrides to use the component-specific Material Web token roles, including selected/unselected Switch track and selected handle color. [OPEN] Validate both light/dark palettes and rounding levels in a browser.

## CI feedback — stale theme handler and Lab token types (2026-10-15)

- [SOURCE-OBSERVED] Typecheck in runs 38695462704 and 38695137845 failed on an earlier branch head with three errors: a stale setTheme call in the profile mockup, plus two Lab Switch style objects still using the removed --switch-disabled-track property.
- [SOURCE-OBSERVED → source edit made] The profile mockup now toggles its own automaticTheme sample preference instead of changing the global theme; the old property is gone from both Lab Switch style objects, which now use selected/unselected track tokens and a selected-handle surface token.
- [OPEN] These fixes landed after the failing runs; the latest branch head still needs a fresh typecheck/test/build result. Do not interpret the old failure as current or claim it has passed until a run for the current head is available.
## Follow-up — independent Lab preview state (2026-10-15)

- [SOURCE-OBSERVED → source edit made] The raw radio-group preview and the shared SegmentedControl preview shared the same sampleRadio state. That accidental coupling made two unrelated examples change together. Added sampleLayout state for the segmented control and a regression assertion. [OPEN] Confirm manually in the browser that the two examples now operate independently.

## Follow-up — AndroidX button-token audit (2026-10-15)

- [ANDROID-M3] Inspected version-pinned official AndroidX Compose Material 3 token files at commit b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7. Disabled roles are variant-specific: filled/elevated/text/outlined use 10% container/outline treatment with on-surface-variant text at 38%; filled-tonal uses 12% container with on-surface text at 38%. Outlined icon buttons use outline-variant at 38%; filled and filled-tonal icon buttons use 10% disabled container and on-surface icon at 38%.
- [SOURCE-OBSERVED → source edit made] Button and IconButton now use those AndroidX roles instead of a generalized 12%/38% rule. IconButton selected state now matches the AndroidX roles: standard = primary icon without a new container; filled-tonal = secondary/on-secondary; outlined = inverse-surface/inverse-on-surface, including matching hover/pressed state layers.
- [LOCULARY-DECISION] The destructive danger Button variant is not an official M3 variant; it reuses the disabled role treatment of a filled action.
- [OPEN] Check computed contrast and hover/pressed/disabled states in both themes in a browser. CSS-pixel sizing is not an Android dp equivalence.

## AndroidX source cross-check (2026-10-15)

The previously recorded Checkbox, Switch, outlined-field, shape-scale and Card mappings have now been cross-checked against pinned AndroidX Compose Material 3 sources: CheckboxTokens.kt, SwitchTokens.kt, OutlinedTextFieldTokens.kt, FilledTextFieldTokens.kt, ShapeTokens.kt, and Elevated/Filled/OutlinedCardTokens.kt at commit b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7. These AndroidX files are authoritative for Android-M3 semantics; Material Web is the web-side cross-check. CSS pixel sizes remain Loculary adaptations.
## AndroidX source cross-check (2026-10-15)

The Checkbox, Switch, outlined-field, shape-scale and Card mappings recorded above have been cross-checked against pinned AndroidX Compose Material 3 sources: CheckboxTokens.kt, SwitchTokens.kt, OutlinedTextFieldTokens.kt, FilledTextFieldTokens.kt, ShapeTokens.kt, and Elevated/Filled/OutlinedCardTokens.kt at commit b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7. AndroidX is authoritative for Android-M3 semantics; Material Web is the CSS-side cross-check. CSS pixel sizes remain Loculary adaptations.
## CI feedback — duplicate Lab token property corrected (2026-10-15)

- Run 38697118090 failed TypeScript because the enabled Checkbox preview object contained a duplicate --checkbox-container-shape property. The disabled Checkbox preview also still used the earlier 12% selected-container blend and on-surface checkmark color.
- [SOURCE-OBSERVED → source edit made] Removed the duplicate property, added the rounding-degree token to the disabled sample, and aligned its selected container/checkmark with AndroidX CheckboxTokens (38% on-surface container, 38% surface checkmark). Added regression assertions for both Lab samples.
- [OPEN] These changes are newer than the failing run; a fresh current-head CI result is required.

## Follow-up — SegmentedControl aligned with AndroidX (2026-10-15)

- [ANDROID-M3] Pinned AndroidX OutlinedSegmentedButtonTokens.kt and SegmentedButtonDefaults.itemShape confirm 40dp height, full outer shape with rectangular interior segments, 1dp outline, secondary-container selected fill, on-secondary-container selected content, and disabled outline/content at 12%/38% on-surface.
- [SOURCE-OBSERVED → source edit made] Rebuilt the shared web SegmentedControl around those roles: no outer padded border shell, individual segment borders with shared edges, rounded outer ends/rectangular middle, selected state layers, and optional disabled items. The earlier small-rounded interior corners were not source-backed and have been removed.
- [LOCULARY-DECISION] Labels remain single-line to prevent the reported wrap/height defect. CSS height 40px is a web adaptation, not 40dp equivalence.
- [OPEN] Verify disabled adjacent-segment borders, focus ring, long French labels and keyboard behavior in a browser.

## Provenance correction

Older audit entries above that say the Checkbox/Switch/field disabled values are “not Android-confirmed” are superseded by the pinned AndroidX source cross-check in M3-CONVENTIONS.md. Keep AndroidX as the source of truth for Android-M3 semantics; Material Web remains the web-side cross-check.
## Follow-up — Pixel mockup shape drift (2026-10-15)

- [SOURCE-OBSERVED] The Pixel direction mockup had hard-coded radii for its primary button, calculator field and result/card surfaces, so the Lab rounding-degree control could not affect those elements.
- Map those roles to the documented full button shape, extra-small field shape and medium card/result shape. Leave device-frame/search/icon-specific shapes open unless their official token roles are verified.

## AndroidX token continuation — button shape and CI test corrections (2026-10-15)

- [ANDROID-M3] Verified pinned AndroidX ButtonSmallTokens.kt and Button.kt: default button shape is CornerFull; pressed shape is CornerSmall. Loculary's shared Button now maps the pressed state to --shape-corner-small. The role mapping is source-backed; rendered transition/timing remains open.
- [ANDROID-M3] Rechecked variant disabled roles against the pinned token files: filled/elevated container 10% on-surface and label/icon 38% on-surface-variant; filled-tonal container 12% on-surface and label/icon 38% on-surface; outlined outline-variant 10% and content 38% on-surface-variant; text content 38% on-surface-variant.
- [ANDROID-M3] Rechecked icon toggle tokens: standard selected icon uses primary without a container; filled selected remains primary/on-primary; filled-tonal selected uses secondary/on-secondary; outlined selected uses inverse-surface/inverse-on-surface. Disabled filled variants use 10% on-surface container and 38% on-surface icon; outlined disabled outline is outline-variant at 38%.
- [SOURCE-OBSERVED → source edit made] The last CI failure exposed stale static assertions for pre-audit button/icon-button rules plus an over-escaped shape regex. Updated those assertions to the current token mapping and corrected the regex. A new green run for the current head is not yet confirmed.

## Slider source-version distinction (2026-10-15)

- [ANDROID-M3] The newest inspected AndroidX SliderTokens.kt snapshot uses a 16dp track and 4×44dp pill handle, matching the newer expressive slider. That is not the selected Loculary direction; do not apply those values just because they are newer.
- [ANDROID-M3] The official AOSP snapshot at revision 4d53400eca9f3ac90c3a3f6cffcbc5bf492ec536 documents the classic slider: 4dp track, 20×20dp full-round thumb, primary active track, surface-variant inactive track, disabled active on-surface 38%, disabled inactive on-surface 12%.
- [SOURCE-OBSERVED] Loculary's Slider uses the corresponding classic visual proportions as CSS pixels, explicitly a web adaptation rather than a dp conversion. Native range semantics are retained.
- [OPEN] Discrete tick markers and value-indicator bubble are not implemented; review whether each is needed before calling the component fully equivalent. Browser state and cross-engine rendering checks remain open.
## Progress indicator source-version correction (2026-10-15)

- [ANDROID-M3] Found another version trap: classic LinearProgressIndicator tokens specify primary active indicator, primary-container track, 4dp thickness and square ends. Newer unified ProgressIndicatorTokens uses secondary-container track and full-rounded ends.
- [SOURCE-OBSERVED → source edit made] Changed the shared linear progress component from rounded/surface-variant track to classic square geometry and primary-container track. Its CSS 4px thickness is a web adaptation, not a dp conversion.
- [OPEN] Browser-check light/dark contrast, reduced motion, determinate width and indeterminate motion. Circular progress is not implemented.
## IconButton state correction (2026-10-15)

- [ANDROID-M3] AndroidX standard IconButton keeps on-surface-variant for the unselected hover/pressed icon; the prior Loculary hover changed to the generic foreground role. Corrected to keep the semantic role.
- [ANDROID-M3] AndroidX OutlinedIconToggleButton removes its border when checked. Loculary's selected outlined IconButton now sets a transparent border while using inverse-surface/inverse-on-surface selected roles.
- [OPEN] Browser-check the selected border transition, hover/focus state layers and both themes.
## Final static-test review for this slice (2026-10-15)

- [SOURCE-OBSERVED → source edit made] Manual review of the updated IconButton conformance test found one remaining stale expectation: AndroidX disabled icon content uses on-surface at 38%, not on-surface-variant. Corrected the assertion.
- [OPEN] The last workflow run seen was pending for an earlier head and no status is currently returned for the newest commit. Do not treat the branch as green; obtain a run against the latest SHA before merge.
- [SOURCE-OBSERVED → source edit made] Corrected the Design Lab progress preview override: track color now resolves to the palette's primary-container role, not surface-variant. Added a static assertion for this role bridge.
## State-layer and indeterminate-motion provenance (2026-10-15)

- [LOCULARY-ADAPTATION] Button hover/pressed colors use CSS color-mix (8%/12%) with semantic foreground roles. This is an implementation approximation, not proof of exact Android state-layer output. Compare computed results in both themes.
- [OPEN] The shared linear ProgressIndicator uses one moving segment for indeterminate work, while classic AndroidX uses a more specific animation model. Its color roles, square geometry and ARIA semantics are source-backed; animation choreography and reduced-motion fallback are Loculary web adaptations.


## Follow-up — Pixel fidelity vs Material 3 Expressive source generations (2026-10-15)

- **Decision correction:** the user's objection to Expressive was specifically about washed-out color treatments and some buttons lacking clear contours. It was not a blanket rejection of newer official geometry, component behavior or motion. The target must be current Pixel/Android fidelity with the chosen Fidelity seed palette; evaluate color roles, outlines, geometry and motion independently.
- Official Android guidance describes M3 Expressive as an extension affecting theming, components, motion and typography, and says it complements Android 16 visual style: [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en). This source does not say all Expressive variants are mandatory in every Pixel UI.
- The older 4dp/20dp slider and newer 16dp/4×44dp slider are now recorded as versioned AndroidX source observations, not as an automatic “classic good / Expressive bad” rule. The current Pixel target and source revision must be compared before finalizing the component geometry.
- [OPEN] The shared linear progress animation is not yet AndroidX-motion-conformant; circular progress is currently only a local Lab CSS demonstration, not a shared production primitive. The user's “full fidelity” goal requires implementing and validating the real linear/circular motion behavior against official AndroidX source, including easing, segment choreography, duration and reduced-motion behavior.
- CI run [38699485234](https://github.com/Nabouna32/lab/actions/runs/38699485234) completed with failure: lint and typecheck succeeded, the test step failed, and build was skipped. The failing assertion at `src/lib/design-system/material-components.test.mjs` expected the IconButton selected-standard class string to end immediately after its primary text color; the implementation correctly continues with hover/pressed primary text state classes. The test assertion has been corrected on this branch; a fresh run is required to find any further stale assertions. Do not claim green CI until a current-head run passes.


## AndroidX progress animation source observation (2026-10-15)

- [ANDROIDX SOURCE OBSERVATION — current upstream, not yet revision-pinned] [ProgressIndicator.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ProgressIndicator.kt) shows that the current circular indeterminate indicator is **not** a simple rotating static arc: it combines (1) a continuous 360° global rotation over 6,000 ms with linear easing, (2) an additional 360° rotation in four 90° steps, each 300 ms emphasized-decelerate followed by a hold to the next 1,500 ms boundary, and (3) a sweep/arc-length animation from a minimum to a maximum and back over the same 6,000 ms cycle. The official Android Developers API describes the indeterminate indicator as animated and exposes stroke width, track color, stroke cap and gap size: [CircularProgressIndicator API](https://developer.android.com/reference/kotlin/androidx/compose/material3/CircularProgressIndicator.composable).
- [OPEN] This source was inspected from the moving `androidx-main` branch, so it is evidence for a current upstream implementation, not a reproducible pinned version. Pin the AndroidX commit and target release before treating exact constants as canonical.
- [SOURCE-OBSERVED] Loculary's shared linear indicator still uses a single moving segment, and the Lab's circular indicator is a CSS conic-gradient ring with a numeric label. Neither currently reproduces the upstream circular choreography or full circular API anatomy. Do not describe either as full Android motion fidelity.
- [NEXT] Audit the official AndroidX OutlinedTextField implementation/tokens next, then continue through shared components and real call sites. Every slice must update this convention, conformance audit and conversation checkpoint with source, source revision status, change and remaining runtime checks.


## TextField audit — AndroidX OutlinedTextField anatomy (2026-10-15)

- [ANDROIDX SOURCE OBSERVATION — current upstream, not yet revision-pinned] [OutlinedTextFieldTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedTextFieldTokens.kt) defines a 56dp container, `CornerExtraSmall` shape, 1dp outline, outline color = `outline`, focused outline = `primary` at 2dp, hovered outline = `onSurface` at 1dp, and disabled outline = `onSurface` at 12% opacity/1dp. Input text uses `onSurface` and Body Large; label is Body Large/onSurfaceVariant; supporting text is Body Small/onSurfaceVariant. Disabled input and label use onSurface at 38% opacity.
- [ANDROID-M3] The official Compose text-field pattern exposes a label, input, supporting/error text, and leading/trailing content within a stateful field: [OutlinedTextField.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/OutlinedTextField.kt) and [Android text input guidance](https://developer.android.com/develop/ui/compose/text/user-input). The current Loculary shared `TextField` instead renders a separate label above a bordered input. That can be a valid web form convention, but it is **not** a faithful implementation of the AndroidX OutlinedTextField anatomy.
- [SOURCE-OBSERVED] Current shared `TextField` does have the 56px web baseline, extra-small shape token, native input, numeric `step="any"` default and per-part disabled colors. These are useful behaviors but do not close the floating-label/outlined-anatomy gap; CSS px are not dp.
- [OPEN] Audit every TextField call site before changing the public API. Implement an explicit M3 variant that matches the selected current Android target (floating label integrated into outline, focus/error/hover/disabled states, supporting text, prefix/suffix and leading/trailing icon geometry) while preserving an intentional separate-label form variant only if product design requires it. Verify `aria-describedby`, `aria-invalid`, native autofill/input modes, keyboard, long labels and light/dark rendering. Pin the AndroidX revision before claiming exact token parity.


## Audit continuation — current Pixel/M3 and Expressive modes (2026-10-15)

Official Android guidance describes M3 Expressive as an expansion affecting theming, components, motion and typography ([source](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en)). The audit must compare component-specific source behavior rather than label one entire style good/bad. Design Lab requirement: selectable **Pixel / M3 baseline** and **M3 Expressive** modes, backed by the same shared production components. A toggle is not considered implemented until it changes the relevant component properties and interaction behavior. Source/version, verified delta, Loculary adaptation, tests and unresolved parity limits must be recorded per component.

**CI correction:** workflow run 38704035198 completed with failure. Lint and typecheck passed; tests failed; build was skipped. Green CI is not confirmed. Retrieve test logs, fix the actual failure, and rerun before merge. Detailed audit sequence and motion implementation choices: [M3 Expressive comparison plan](./M3-EXPRESSIVE-COMPARISON-PLAN.md).

## Discovery: Expressive preview was present in CSS but unreachable (2026-10-15)

The Lab's source already contained `expressiveDirection` copy and `data-direction="expressive"` CSS, but the tab list exposed only Pixel and Productivity. Updated `src/app/[locale]/design-lab/VisualLab.tsx` to expose Pixel, Expressive and Productivity, resolve each mode's help text correctly, and added a regression test in `src/lib/design-system/material-components.test.mjs`. The preview is a Loculary-authored exploratory screen, not a verified Android screenshot. Component-level Expressive comparison in the shared-component gallery remains open. CI has not yet been rerun against this latest commit.

## Correction: Productivity was not an official Material 3 variant (2026-10-15)

Removed Productivity from the selectable directions and renamed the two official comparison choices **M3 Fidelity** and **M3 Expressive**. Productivity had been a Loculary layout concept, not an official Android/Material variant, so it should not be offered as a third peer style. Static tests now assert that only the two official mode names are exposed. The existing screen-level preview remains illustrative until component-level comparisons are complete.

### Component 01 — Button family: source evidence recorded

Pinned AndroidX source confirms separate classic `shape` and Expressive `ButtonShapes` overloads; Expressive button shapes morph with interaction and provide height-aware sizing helpers for shape, padding, text style, icon size and icon spacing. Sources: [pinned AndroidX Button.kt](https://android.googlesource.com/platform/frameworks/support/%2B/155b9eedc7a9732cce0505b492b2c15f5e70d1b9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt), [ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults). Current Loculary shared Button's baseline is 40 CSS px (explicitly a Web size) with a full resting shape and small pressed shape. The Expressive specimen should be implemented as a distinct, evidence-backed size/shape behavior, not a global style filter. Browser validation and a green CI run are still pending.

### Button family — implementation checkpoint

Added component-level mode selection in the shared Button gallery. Fidelity displays the shared web baseline; Expressive displays a medium-size adaptation based on AndroidX `ButtonMediumTokens`: 56dp container, 24dp horizontal padding, 16dp vertical padding, 24dp icon token, full resting shape and medium pressed shape. The CSS preview maps these values to CSS px and applies a CSS border-radius transition; docs explicitly disclaim dp equivalence and exact platform animation parity. Pinned token source: https://android.googlesource.com/platform/frameworks/support/%2B/4fcf7a5467f9d16be2a3d1e31be0ad96a136a7a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonMediumTokens.kt. Static regression test added for the selector and web token mapping. Browser/runtime and CI validation remain outstanding.

### Component 02 — IconButton

Official AndroidX source documents a typical 24dp icon and 48dp minimum interactive target. Expressive APIs expose extra-small/small/medium/large/extra-large sizing and round/square shape families; the shape can morph on press, and toggle variants can have a distinct checked shape. Source: https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt.

Added a component-specific Fidelity/Expressive selector around the shared IconButton gallery sample. Expressive uses a 56 CSS-pixel medium-size specimen, 24 CSS-pixel icon, full rest shape, medium pressed shape, large selected shape, and reduced-motion fallback. These are CSS adaptations of AndroidX tokens. **Gap recorded:** the shared Web IconButton currently applies a 48 CSS-pixel box to the visible container; AndroidX separates minimum interactive size from its smaller visual container. Fidelity anatomy still needs correction/verification, but production is not silently changed in this Lab-only preview step.

### Component 03 — Checkbox

Source reviewed: [pinned AndroidX Checkbox.kt](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt). No distinct default Expressive visual delta was verified in this source. The Lab therefore offers both mode choices but intentionally keeps the shared Checkbox rendering identical and states why in Expressive mode; this is preferable to fabricating a difference. Existing web specimen has an 18 CSS-pixel box, semantic checked/disabled roles, explicit focus ring and 48 CSS-pixel minimum label row. Compare exact AndroidX box/stroke/animation dimensions in a later geometry pass; no exact parity claim yet.

### Component 04 — Switch source finding

Official source reviewed: https://android.googlesource.com/platform/frameworks/support/%2B/39bdbe03eef999f4c1352f31a90526adad9245ae/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Switch.kt. No separate default Expressive variant was confirmed. AndroidX source explicitly uses a motion spec for thumb animation; Loculary's shared Web Switch uses CSS transitions for a 52×32 CSS-pixel track and 16×16 thumb. Both modes should therefore share default appearance until a verified difference is found, while the motion audit remains open for timing/travel and interruption behavior.