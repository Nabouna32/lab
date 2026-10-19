# Material 3 / Pixel implementation audit

**Date:** 2026-10-15  
**Canonical direction:** DEC-026 — Material 3 Fidelity + current Pixel / Android patterns  
**Scope:** Production foundations, shared UI primitives, application shell, search/navigation, tool shell, account UI, status feedback and the Design Lab.  
**Audit type:** Static source review against official references. This is not a claim that every route has been visually inspected in a running browser; browser-level light/dark, keyboard, responsive and contrast verification remains an explicit acceptance gate.

## Active mission checkpoint — Material 3 Fidelity (2026-10-15)

**Mission:** [Issue #731 — audit and converge on Material 3 Fidelity](https://github.com/Nabouna32/lab/issues/731)  
**Approved scope for Lot 0:** documentation and workflow framing only; no production UI changes.  
**Canonical direction:** DEC-026 / `docs/DESIGN-SYSTEM.md` — Material 3 Fidelity with current Pixel / Android references. Material 3 Expressive is not the selected direction.  
**Checkpoint ownership:** this file is the transversal component/fidelity status register; Issue #731 is the mission decision and progress log; each component's detailed contract and decisions live in `docs/components/<Component>.md`. Link to those contracts here instead of duplicating their full audits.

### How to read this audit

- **Observed** means directly confirmed in source, tests, repository state or a cited official reference.
- **Inference** means a reasoned conclusion from observed evidence; keep it labelled as such.
- **Decision** means a user-approved product or implementation choice.
- **Not audited** means presence/inventory only; no conformance claim.
- **Partial** means concrete elements exist but identified gaps or required checks remain.
- **Needs correction** means a specific, evidence-backed mismatch is recorded.
- **Verification required** means browser, device, accessibility or runtime evidence is still missing.
- **Conformant within verified scope** may be used only with explicit evidence and the exact scope tested. A component file or Design Lab specimen is never sufficient evidence on its own.

### Initial source inventory — 61 shared UI TSX files

The following inventory was read from `src/components/ui` on `main`. This is a file-presence inventory, **not** a declaration that all entries are official Material 3 components, used in production, or conformant. The next audit must map actual imports/call sites and distinguish official M3 components, web adaptations, Loculary-specific helpers, Lab-only specimens and experimental/version-sensitive APIs.

| Family | Files observed | Initial status |
|---|---|---|
| Foundations and icons | `MaterialIcon`, `CollectionIcon`, `StarIcon` | Inventory confirmed; audit icon coverage, source/licence, missing glyphs and real consumers |
| Buttons and actions | `Button`, `IconButton`, `FloatingActionButton`, `FloatingActionButtonMenu`, `FloatingToolbar`, `ButtonGroup`, `SplitButton`, `ToggleButton`, `SegmentedButtonGroup`, `SegmentedControl`, `ClearButton`, `CopyButton` | Inventory confirmed; audit official variant semantics, duplication/aliases, states and production usage |
| Selection and chips | `Checkbox`, `TriStateCheckbox`, `RadioButton`, `Switch`, `Slider`, `RangeSlider`, `Chip`, `Select`, `ExposedDropdownMenu`, `Tabs` | Inventory confirmed; audit semantics, keyboard behavior, touch targets, and overlapping abstractions |
| Text, date/time and search input | `TextField`, `TextArea`, `MaterialTextField`, `DatePicker`, `DatePickerDialog`, `TimePicker`, `TimePickerDialog`, `SearchBar`, `AppBarWithSearch`, `DropdownMenu` | Inventory confirmed; audit labels/errors, focus, native-web adaptation boundaries and version-sensitive API claims |
| Navigation and scaffolds | `TopAppBar`, `BottomAppBar`, `NavigationBar`, `NavigationRail`, `WideNavigationRail`, `NavigationDrawer`, `NavigationSuiteScaffold`, `Scaffold`, `BottomSheetScaffold`, `ModalBottomSheet` | Inventory confirmed; audit adaptive behavior, modality, insets, focus management and production need |
| Surfaces and content | `Card`, `Panel`, `ResultPanel`, `ListItem`, `Divider`, `Carousel` | Inventory confirmed; audit semantic role, nested surfaces, composition and exact consumer needs |
| Feedback and progress | `Badge`, `Snackbar`, `AlertDialog`, `Tooltip`, `ProgressIndicator`, `CircularProgressIndicator`, `ValidationMessage` | Inventory confirmed; audit announcements, focus, lifecycle, variants and state behavior |
| Gestures and adaptive interactions | `SwipeToDismissBox`, `PullToRefreshBox`, `ScrollField` | Inventory confirmed; audit browser gesture limitations and whether the API belongs in the chosen core direction |
| App-specific utility wrappers | `CollectionIcon`, `StarIcon`, `ClearButton`, `CopyButton`, `Panel`, `ResultPanel`, `ValidationMessage` | Inventory confirmed; determine if each wrapper expresses stable product semantics or duplicates a simpler primitive |

**Inventory note:** families intentionally overlap where a component could reasonably be classified by both implementation role and user-facing behavior. The next pass must deduplicate by component identity when recording status; do not treat the grouped table as a count of distinct audited variants. `ScrollField` is documented later in this file as an experimental Expressive API and is not a reason to expand the selected Fidelity direction.

### Operating protocol — autonomous delivery mandate (updated 2026-10-19)

1. Investigate source, actual production call sites, tests and official references. Distinguish direct evidence, inference and missing runtime proof.
2. Choose and implement the next coherent, evidence-backed batch autonomously; the current project mandate supersedes the historical requirement for explicit approval of every component batch.
3. Pause only when a finding requires a consequential product/architecture choice, a new recurring cost, a production security/privacy decision, destructive data work or an irreversible external commitment. Continue independent work while that boundary is blocked.
4. Use a dedicated branch and one PR at a time where practical. Review the complete diff and verify the exact PR head through required CI before merge. Never weaken protections to force delivery.
5. Update this register with source links, status, exact verification evidence and remaining gaps; update Issue #731 and `docs/PROJECT-STATE.md` with the merge/CI/deployment evidence and next priority.
6. Browser, responsive, light/dark, keyboard, screen-reader and contrast checks remain required where applicable. If the environment cannot run them, mark them as not verified rather than inferring conformance from source or CI.

### Lot 0 source findings and recommended next audit

- **Observed:** production semantic roles are generated from `SchemeFidelity` in `src/lib/design-system/rainbow-tones.ts`; the unit test `src/lib/tools/categories.test.ts` asserts Fidelity and the secondary-container roles for filled-tonal buttons.
- **Observed:** `Button` exposes official-looking variants plus compatibility/app-specific names (`primary`, `tonal`, `secondary`, `ghost`, `danger`). Their mapping and migration impact have not yet been fully audited.
- **Observed:** `IconButton` keeps `tonal` as an alias for `filled-tonal`; selected/toggle behavior and call-site usage need review.
- **Observed:** the Design Lab theme explorer still contains Expressive as one of several comparison schemes. That alone is not a production adoption, but the intended boundary between exploratory comparison and the selected product direction should be explicit.
- **Inference / challenge:** the current repository has a broad catalogue of 61 shared UI TSX files, including recent adaptations of advanced or experimental AndroidX APIs. Expanding this catalogue further before measuring actual production usage risks optimizing for catalogue completeness rather than user value and maintainability.
- **Initial Lot 1 recommendation:** audit the foundation-to-consumer path first: generated Fidelity semantic tokens and light/dark role wiring, `MaterialIcon`, `Button` and `IconButton`, plus their real production call sites and tests. The read-only findings are recorded below; no production code was changed.
- **Not verified in Lot 0:** local commands, CI, live browser rendering, device behavior, computed contrast, screen-reader behavior and the actual usage graph for all 61 files. No conformance claim is made for these areas.

---

## Lot 1 read-only audit — foundations and core actions (2026-10-15)

**Scope:** source-level review of generated Fidelity roles, light/dark wiring, MaterialIcon, Button, IconButton, relevant tests and representative production consumers. No production code changed.

### Confirmed source findings

- **Fidelity generation is wired at the application root.** `src/app/[locale]/layout.tsx` calls `getLocularyThemeStyle()` and applies the generated light/dark custom properties to the locale `<html>`. `src/lib/design-system/rainbow-tones.ts` creates light and dark `SchemeFidelity` instances from seed `#4285F4`; category accents use `SchemeRainbow`. `src/app/globals.css` switches semantic aliases under `.dark`, while `src/components/theme/ThemeProvider.tsx` configures the theme class and system preference.
- **Existing automated coverage is mostly source-contract coverage for this path.** `src/lib/tools/categories.test.ts` asserts the seed, Fidelity constructors, token wiring and filled-tonal role pairing. `src/lib/design-system/button-m3-conformance.test.mjs` asserts component source strings and selected consumer wiring. This is useful regression protection, but passing those assertions does not prove the computed browser colors, rendered shape, state layers, accessibility tree or visual parity.
- **MaterialIcon is a shared, typed SVG path map.** `src/components/ui/MaterialIcon.tsx` derives `MaterialIconName` from the available paths, inherits `currentColor`, and defaults to `aria-hidden="true"`. Audit actual name coverage and whether meaningful standalone icons override decorative semantics; no icon-map defect is concluded in this read-only pass.
- **Button and IconButton are production foundations, not Lab-only components.** Search results show them consumed across tool implementations, search, account/admin flows, favorites and collections; IconButton also appears in mobile search and unit/base converters. Changes to their shared contracts therefore have broad reach and need a call-site migration plan.
- **Button has five canonical-looking treatments plus compatibility/app-specific names.** `filled`, `elevated`, `filled-tonal`, `outlined` and `text` are present. `primary` aliases `filled`, `secondary` aliases `outlined`, `ghost` aliases `text`, and `tonal` aliases `filled-tonal`; `danger` is an app-specific destructive treatment. Several real call sites still use `primary`, `secondary` and `ghost`, so deleting aliases immediately would be a breaking migration, not a safe cleanup.
- **IconButton also retains `tonal` as an alias for `filled-tonal`.** Its selected outlined treatment uses inverse-surface roles. Whether this exactly matches the intended current AndroidX toggle-button state is **open**, not asserted as a defect here.
- **Expressive remains visible in exploration code.** The Design Lab still has a Fidelity/Expressive comparison and the theme explorer still lists `SchemeExpressive`; `ScrollField` is explicitly documented as an experimental Expressive-family API. These are not evidence that production's semantic scheme is Expressive. Per the current direction, no new Expressive work is proposed in this mission; whether to hide or remove exploratory controls is a separate product/UI scope decision.

### Priority finding — pressed-shape morph in the shared Button

- **Observed implementation:** `src/components/ui/Button.tsx` starts from `rounded-full` and adds `active:rounded-[var(--shape-corner-small)]`, with `border-radius` included in the transition list. This makes the shared production button change shape on press.
- **Observed test contract:** `src/lib/design-system/button-m3-conformance.test.mjs` explicitly requires both `active:rounded-[var(--shape-corner-small)]` and the border-radius transition. The test therefore protects this behavior rather than merely tolerating it.
- **Official reference:** the current AndroidX Material 3 `Button.kt` defines the default `ButtonDefaults.shape` as the round container shape; its shape-morphing `ButtonShapes` / pressed-shape API is annotated `@ExperimentalMaterial3ExpressiveApi`. Sources: [AndroidX Button.kt, pinned source revision](https://android.googlesource.com/platform/frameworks/support/+/dd849e200f5046c2f2ca904e821fc9d42cbd0256/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt) and [AndroidX Button.kt, shape-morphing API reference in source](https://android.googlesource.com/platform/frameworks/support/+/edd8bafb328feda384a1048242a66d77f12b6699/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt).
- **Conclusion:** this is a concrete Fidelity mismatch candidate, not a proven visual-runtime failure. The shared default currently imports an Expressive-style pressed-shape change into the base button, while the test calls it a conformance requirement. The cleanest first implementation is likely to keep the base Button shape stable on press, remove the border-radius transition from the base component, and update the test to protect the Fidelity behavior instead. The Lab's opt-in Expressive preview would need to be considered separately; it must not silently dictate the production default.

### Recommendation and next approval boundary

**Proposed Lot 2 — narrow Button Fidelity correction (not yet implemented):**

1. Remove the base `Button` pressed-shape morph and its now-unneeded border-radius transition.
2. Replace the test assertions that mandate that morph with assertions that the canonical base variants retain a stable shape while preserving focus, disabled, color-state and reduced-motion behavior.
3. Leave compatibility aliases, IconButton selected-state colors, Design Lab Expressive controls and other component families untouched in this batch.
4. Inspect the complete diff and run the focused button conformance tests plus the repository's required CI. Do not claim browser parity without browser evidence.

**Trade-off:** this is a small, high-leverage correction to a shared primitive and avoids broad call-site churn. It does not solve the API alias debt or establish complete button fidelity; those remain separate follow-ups. The implementation is waiting for explicit user approval.

**Verification limits:** this was a read-only source audit. No local tests, browser rendering, computed-color measurement, keyboard/device session or screen-reader validation was run.

---

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
- [DEC-028 — accepted 2026-10-19] Keep the persistent external label as the default Web adaptation for task-first calculator/account forms. Call-site evidence: 16 calculator components, 36 field instances, 22 explicit placeholders/examples, 4 unit suffixes and 26 invalid-state descriptions. This differs from AndroidX OutlinedTextField anatomy and is **not** claimed as exact M3 parity. Do not globally migrate to integrated floating labels without browser evidence of a user benefit. Continue checking `aria-describedby`, `aria-invalid`, native autofill/input modes, keyboard, long labels and light/dark rendering.


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

**Switch implementation:** Design Lab now exposes both modes and explicitly preserves the same rendering until a source-backed difference is established. Added a regression assertion for the selector and parity note. Thumb motion and geometry remain unverified against Android runtime.

### Component 05 — TextField: source-backed Expressive difference identified

Official AndroidX sample source: https://android.googlesource.com/platform/frameworks/support/%2B/androidx-main/compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/TextFieldSamples.kt. Expressive samples use rounded shapes and tonal colors; the Expressive outlined field sample also uses an inside label position. Current shared Loculary TextField places the label above the input and uses an extra-small shape, so it is not an equivalent composition. Plan: add an opt-in `variant="expressive"` to the shared component with an inside/floating label, rounded tonal surface and semantic focus/error/disabled roles. The Fidelity default must remain unchanged; CSS is a web adaptation and requires browser verification.

**TextField implementation checkpoint:** added opt-in `variant="expressive"` with floating inside label, extra-large shape token and tonal surface. Default remains Fidelity, preserving existing call sites. The Design Lab selector is wired to the shared component. Added static assertions for default variant and Expressive anatomy. Not yet browser-validated; verify label overlap/floating with empty, focused, prefilled, disabled/error and unit cases before treating the adaptation as complete.

### Component 06 — Multiline field and dropdown gap

The gallery now exposes per-component mode controls, with honest notes on incomplete parity. `TextArea` is a Loculary Web API name; Android's corresponding M3 component is a multiline TextField/OutlinedTextField. `Select` currently renders a native HTML select, not the AndroidX ExposedDropdownMenu pattern. These are **not yet full Material 3 components**. Added regression coverage to prevent the Lab from implying otherwise. Next: add a shared M3 dropdown/menu primitive with proper keyboard/focus/selection/dismiss semantics, and implement multiline TextField anatomy from AndroidX source. The current selectors are audit markers, not completed Expressive variants.

### Component 06 — Multiline field and dropdown gap

The gallery now exposes per-component mode controls, with honest notes on incomplete parity. `TextArea` is a Loculary Web API name; Android's corresponding M3 component is a multiline TextField/OutlinedTextField. `Select` currently renders a native HTML select, not the AndroidX ExposedDropdownMenu pattern. These are not yet full Material 3 components. Added regression coverage to prevent the Lab from implying otherwise. Next: add a shared M3 dropdown/menu primitive with proper keyboard/focus/selection/dismiss semantics, and implement multiline TextField anatomy from AndroidX source. The current selectors are audit markers, not completed Expressive variants.

## Conformance ledger — explicit implementation status (2026-10-15)

**Meaning of “100%”:** no Loculary React/CSS component is an AndroidX-native implementation. The site runs on the Web. The table below therefore distinguishes source-backed Web work from full Android runtime parity; “100% Android implementation” is **none at this time**.

| Component | Current implementation | Official-source evidence | Status / remaining gate |
|---|---|---|---|
| Button | Shared React primitive; Fidelity/Expressive comparison in Lab | AndroidX Button API and token source consulted | **Source-backed Web adaptation**; verify every variant/state, min target, focus, ripple/motion and responsive wrapping in browser |
| IconButton | Shared React primitive; selectable sample and Lab comparison | AndroidX IconButton source consulted | **Source-backed Web adaptation**; verify selected/disabled/focus/pressed morph and touch target |
| Checkbox | Shared React primitive; Lab mode control | AndroidX Checkbox source consulted; no separate default Expressive appearance confirmed | **Partial Web parity**; same visual mode intentionally, inspect semantics/indeterminate/focus and compare all state tokens |
| Switch | Shared React primitive; Lab mode control | AndroidX Switch source confirms token/motion-spec behavior | **Partial Web parity**; thumb motion and state geometry still require verification; no invented Expressive delta |
| TextField | Shared primitive; opt-in Expressive anatomy | Official AndroidX Expressive samples consulted | **Source-backed Web adaptation**; floating-label CSS is not Compose layout/motion; browser-test empty/focused/prefilled/error/disabled/unit cases |
| Multiline TextField (TextArea Web wrapper) | Existing native textarea wrapper | Android M3 field family includes multiline TextField/OutlinedTextField | **Parity gap**; Web name is not a separate official Android M3 component; implement/audit multiline anatomy and states |
| Exposed dropdown (replacing shared Select specimen) | Shared React component with combobox/listbox semantics and keyboard selection | Official AndroidX ExposedDropdownMenuBox source and MenuTokens consulted | **Source-informed Web adaptation**; popup positioning/insets, anchor anatomy, Compose motion and accessibility/browser validation remain open |
| Snackbar | New shared Snackbar.tsx used by Lab; action-aware timeout and dismiss | Official Android Developers guide and AndroidX Snackbar.kt/SnackbarHost.kt | **Source-backed Web adaptation**; no app-level queue/host, Scaffold insets, swipe dismissal, exact token geometry/motion, or browser accessibility validation yet |
| SegmentedButton / SegmentedControl | Shared single-choice React control with radio-group keyboard semantics | AndroidX SegmentedButton.kt and OutlinedSegmentedButtonTokens.kt inspected | **Source-backed Web adaptation (single-choice only)**; multi-choice variant, checked-icon motion, exact overlapping borders and browser/accessibility verification remain open |
| Cards, panels, top bar, navigation rail, FAB, menus, dialog, bottom sheet, progress indicators | A mix of shared primitives and Lab-only examples | Source coverage is incomplete by component | **Partial / not yet audited**; Lab mock-ups must not be counted as implemented shared components |

### Snackbar audit (2026-10-15)

AndroidX Snackbar is a visual component used with SnackbarHost/SnackbarHostState, usually in Scaffold; it is not equivalent to any arbitrary alert/toast box. Official source describes one optional action and optional dismiss affordance, token-driven shape/colors/elevation/typography, a 600 dp maximum width, and action-bearing snackbars that do not self-timeout. Loculary's old Lab-only sampleSnackbar was replaced with the shared Snackbar Web component. The Web adaptation uses the theme's inverse-surface roles, an action, explicit dismiss, a 4-second timeout only without an action, and reduced-motion support. Both Lab modes remain visually equal until official source supports a separate Expressive default.

Token follow-up: AndroidX SnackbarTokens confirms inverse-surface container, inverse-on-surface text/icon, inverse-primary action, extra-small shape, level-3 elevation, Body Medium supporting text, Label Large action text, 48 dp one-line height, 68 dp two-line height, 600 dp max width, 16 dp horizontal spacing and 14 dp vertical spacing. CSS now maps the roles and approximate width/min-height/padding; CSS px and box layout are not guaranteed to equal Android dp. **Not complete:** no SnackbarHostState-equivalent shared queue, replacement policy, Scaffold/insets placement, swipe dismissal, exact Compose motion/elevation, or browser/assistive-technology verification. Do not mark “100% Android”.


### Exposed dropdown audit (2026-10-15)

The official AndroidX ExposedDropdownMenuBox source and MenuTokens were inspected before replacing the shared Lab native select. The Lab now uses a shared ExposedDropdownMenu Web adaptation with combobox/listbox/option semantics; ArrowUp/ArrowDown, Home/End, Enter/Space, Escape and Tab handling; outside-pointer dismissal; disabled options; selected indication; helper/error text; and reduced-motion handling.

Token evidence: AndroidX MenuTokens maps the menu container to surfaceContainer, level-2 elevation and extra-small corner shape. The current CSS references semantic tokens but still uses CSS approximations for elevation and dimensions. The component is **not 100% Android/Compose parity**: it is not the Compose popup, does not yet reproduce Android's TextField menuAnchor behavior or edge-aware popup placement, and needs browser/assistive-technology validation. Editable/autocomplete behavior is not implemented.


### SegmentedButton audit (2026-10-15)

AndroidX source/token review confirms: 40 dp row minimum height, 1 dp outline, Label Large typography, 18 dp icon, selected Secondary Container / On Secondary Container roles, unselected Outline / On Surface roles, and Corner Full base shape. AndroidX itemShape uses the base shape for a single item and the outside corners, with rectangular inner segments. Therefore the full outer shape in Loculary is correct; it was retained after reading the actual token file.

The shared component now has radio-group/single-choice semantics, roving tab stop, arrow navigation, Home/End, disabled items and selected state. It is **not full AndroidX parity**: multi-choice segmented buttons are not implemented; check-icon reveal animation, exact border overlap, complete interaction color tokens, and browser/screen-reader validation remain open.


### Validation status (2026-10-15)

A previous CI run failed during the lint/test stage because two assertions were stale; they have been corrected, and a literal escaped-newline issue in the test source has also been fixed. The current branch head has no fresh workflow run associated with it, so these edits are **unverified by CI**. Browser, keyboard, responsive and screen-reader validation also remain outstanding. Keep every new component in Web-adaptation status until validation completes.


### Shared dimension-token layer (2026-10-15)

Added CSS reference tokens in src/app/globals.css for spacing, segmented-button minimum height, standard/medium button heights, Web hit target, Snackbar dimensions, icon sizes, outline width and Label Large/Body Medium typography. SegmentedControl and Snackbar consume these tokens. The token comments preserve AndroidX reference magnitudes (dp/sp) while explicitly warning that rem/CSS px are not physically equivalent to Android dp/sp. This is **shared Web reference-token infrastructure**, not a native Android unit system and not yet a complete extraction of all component tokens.

- Source for dp/density: https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/Dp
- Source for Android screen density: https://developer.android.com/training/multiscreen/screendensities
- Material 3 source hierarchy and theming: https://developer.android.com/develop/ui/compose/designsystems/material3

Status: **partial implementation**. Token magnitudes have initial source annotations, but the full token catalogue still needs pinned AndroidX source/version per component, migration of hardcoded component dimensions, computed-style and browser testing, responsive/zoom checks, and contrast/accessibility verification. No component is promoted to “100% Android” merely because it consumes these tokens.


### Multiline TextField / TextArea audit (2026-10-15)

AndroidX TextField API and samples were reviewed. Compose's component is TextField configured for multiline entry, not a separate official component called TextArea. Loculary's shared TextArea remains a Web convenience adaptation. It now has Fidelity/Expressive selectors wired into the Lab, shared tokens, helper/error associations, and disabled/error states. The 8rem minimum height is explicitly a Loculary specimen choice, not an AndroidX token.

Status: **source-informed Web adaptation**. Not yet complete: exact Compose multiline line/min-line/max-line behavior, supporting-text/counter anatomy, full state-token mapping, browser autofill/IME, text scaling, and keyboard/screen-reader validation. Do not label this component 100% Android.

## Modal bottom sheet — 2026-10-15

**Official AndroidX reference:** [Material 3 bottom sheets](https://developer.android.com/develop/ui/compose/components/bottom-sheets), [ModalBottomSheet API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ModalBottomSheet.composable), and [Material window insets](https://developer.android.com/develop/ui/compose/system/material-insets).

- **Source-confirmed:** the modal sheet is an overlay; background app interaction is disabled; dismiss is explicitly handled; sheet state can be shown/hidden programmatically; Material handles bottom window insets. Partial expansion is a separately documented, experimental option.
- **Implemented:** shared `ModalBottomSheet` Web adaptation; dialog ARIA semantics, keyboard Escape, Tab focus containment, focus restoration, backdrop dismissal, body scroll lock, safe-area padding and reduced-motion CSS. The Design Lab now uses this shared component rather than the former inline-only panel.
- **Not implemented / open:** swipe/drag dismissal, partial expansion, Compose `SheetState`, exact motion and system insets, robust assistive-technology isolation across browsers, and browser/device validation.
- **Conformance classification:** **source-informed Web adaptation; partial functional parity; runtime unverified**. The Lab's prior inline panel was a visual mockup, not a modal bottom sheet.
- **Next checks:** focus and screen-reader behavior, backdrop touch, long-content scroll, safe areas and viewport resize, theme contrast, reduced motion. Do not mark as 100% AndroidX.

## Alert dialog — 2026-10-15

**Official AndroidX references:** [Dialog guide](https://developer.android.com/develop/ui/compose/components/dialog), [AlertDialog API](https://developer.android.com/reference/kotlin/androidx/compose/material3/AlertDialog.composable), [BasicAlertDialog API](https://developer.android.com/reference/kotlin/androidx/compose/material3/BasicAlertDialog.composable), and [AlertDialogDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/AlertDialogDefaults).

- **Source-confirmed:** standard `AlertDialog` has semantic slots for title, body, optional icon, confirm action and dismiss action; custom `Dialog` content requires its own surface/layout. AndroidX exposes shape, container/content colors and tonal elevation.
- **Implemented:** shared `AlertDialog` Web adaptation with `alertdialog` role, modal ARIA semantics, title/description references, cancel-first focus, Escape/backdrop dismissal, Tab focus containment, focus restoration and body scroll lock. Added a destructive-confirmation specimen to the Design Lab; its confirm action only dismisses the demo.
- **Not implemented / open:** Compose `DialogProperties`, exact AndroidX dimensions/elevation/motion, platform back handling, robust cross-browser screen-reader validation, and browser/device testing.
- **Conformance classification:** **source-informed Web adaptation; partial functional parity; runtime unverified**. No claim of native Android or full AndroidX parity.
- **Next checks:** focus order/restoration, screen-reader announcement, outside click, long text, narrow layout, light/dark contrast and reduced motion.



## Lab specimen names — 2026-10-15

The Design Lab now labels specimens with exact names and explicit fidelity categories: shared primitive, Web adaptation, or local mockup. Shared components currently named in the Lab include Button, IconButton, TextField, TextArea (Web wrapper), ExposedDropdownMenu, Select (native HTML wrapper), ClearButton, CopyButton, Checkbox, Switch, Slider, ProgressIndicator, SegmentedControl, ValidationMessage, Card, Panel, ResultPanel, Snackbar, ModalBottomSheet, AlertDialog, and NavigationBar. Mockups in the extended gallery are deliberately labelled as mockups. This naming makes bug reports actionable without falsely implying full AndroidX parity.


### NavigationRail — AndroidX audit and Web adaptation (2026-10-15)

**Official source:** https://developer.android.com/develop/ui/compose/components/navigation-rail and https://developer.android.com/develop/ui/compose/system/material-insets.

- **Source-confirmed:** AndroidX `NavigationRail` and `NavigationRailItem` are intended for top-level destinations on larger screens and landscape layouts; the documented rail typically exposes 3–7 destinations. Android applies vertical and start system insets.
- **Implemented:** added shared `src/components/ui/NavigationRail.tsx` and `NavigationRail.module.css`; integrated it into the extended Lab gallery with selected state, icon/label, optional badge, focus-visible, hover/press states, semantic theme tokens and reduced-motion handling. Visible identifier now classifies it as a Web adaptation, not a mockup.
- **Web adaptation choices:** 80 CSS-pixel rail width and CSS spacing approximate the Android layout; CSS px are not dp. Local selection uses buttons and `aria-current`; real route destinations should use links or router navigation semantics.
- **Not yet parity-complete:** exact AndroidX dimensions, FAB placement, rail header/scroll behavior, window inset integration, all badge variants and Compose motion curves are not validated. Runtime keyboard, zoom, screen reader, mobile browser and responsive layout checks remain open.
- **Status:** shared, source-informed Web adaptation; partial parity; CI/runtime validation required. Do not claim 100% AndroidX parity.


### NavigationDrawer — AndroidX audit and Web adaptation (2026-10-15)

**Official sources:** https://developer.android.com/develop/ui/compose/components/drawer, https://developer.android.com/reference/kotlin/androidx/compose/material3/ModalNavigationDrawer.composable, and https://developer.android.com/develop/ui/compose/system/material-insets.

- **Source-confirmed:** Material 3 distinguishes modal drawers (overlay content) from standard drawers (share layout space). AndroidX provides drawer state/open-close control, navigation items, and drawer sheets; modal interaction and window insets are part of the component behavior.
- **Implemented:** added shared `src/components/ui/NavigationDrawer.tsx` and `NavigationDrawer.module.css`; Lab specimen includes grouped destinations, selection, scrim dismissal, Escape handling, Tab focus containment, focus restoration, body scroll lock, entry/scrim animation, reduced-motion handling, and modal/standard layout modes.
- **Web adaptation choices:** CSS width, scrim opacity, elevation/shadow, shape and motion timings are not exact dp/elevation/Compose-motion equivalents. The component currently supports modal and standard modes; it does not yet reproduce the separate dismissible drawer behavior, Android `DrawerState`, edge-swipe gestures, predictive back, or platform insets.
- **Accessibility gap:** background content is not yet made inert/hidden from all assistive technology in every browser; verify focus and screen-reader isolation before production use. Standard mode also needs responsive integration checks.
- **Status:** shared, source-informed Web adaptation; partial functional parity, not native Compose. CI, browser, mobile and assistive-technology validation required.


### CircularProgressIndicator — AndroidX audit and Web adaptation (2026-10-15)

**Official source:** https://developer.android.com/develop/ui/compose/components/progress and https://developer.android.com/reference/kotlin/androidx/compose/material3/CircularProgressIndicator.composable.

- **Source-confirmed:** Material 3 offers determinate and indeterminate circular indicators. Determinate progress must reflect real progress; indeterminate mode communicates activity without implying a percentage. The Compose API uses a progress fraction in the range 0.0–1.0 and exposes indicator/track colors and stroke-related options.
- **Implemented:** added shared `src/components/ui/CircularProgressIndicator.tsx` and `circular-progress-indicator.module.css`; integrated the determinate version into the Lab and connected it to the existing sample progress slider. The component provides `role=progressbar`, accessible label/min/max/current value, SVG stroke rendering, animated indeterminate mode and reduced-motion fallback.
- **Web adaptation choices:** the public Web API accepts percentage values (0–100), and size/stroke width are CSS pixels; neither is a direct Android dp/API equivalence. The indeterminate keyframes are a source-informed approximation, not copied/verified AndroidX motion timing. Stroke caps and exact track/color behavior need comparison against the targeted AndroidX version.
- **Not yet complete:** no dedicated interactive indeterminate specimen, no pinned AndroidX version/source token comparison, no automated SVG visual regression, and no browser/screen-reader/device validation. Reduced-motion mode deliberately stops continuous animation and displays a static arc; confirm this fallback remains understandable.
- **Status:** shared, source-informed Web adaptation; partial parity, not native Compose. Do not claim 100% fidelity until visual/motion comparison and runtime checks pass.


## Full AndroidX component coverage scope — 2026-10-15

The audit scope is not limited to production call sites. The complete working component-family inventory and required variants are tracked in [M3-COMPONENT-INVENTORY.md](./M3-COMPONENT-INVENTORY.md), based on the official [Compose Material component catalogue](https://developer.android.com/develop/ui/compose/components?hl=en) and [Material 3 API reference](https://developer.android.com/reference/kotlin/androidx/compose/material3). Every family/variant must be integrated into the Design Lab, implemented as a source-informed Web adaptation or explicitly tracked as incomplete; no local mockup is considered complete merely because it looks plausible. Each audit must cover state transitions, motion, accessibility, keyboard/gesture behavior, light/dark tokens, responsive insets, and CSS-vs-dp/sp limitations.


## Floating action button family — 2026-10-15

Official AndroidX source: https://developer.android.com/develop/ui/compose/components/fab and https://developer.android.com/reference/kotlin/androidx/compose/material3/FloatingActionButtonDefaults.

Implemented a shared Web adaptation with small, regular, large and extended variants and integrated all four into the Lab. This is not native Compose. CSS pixel dimensions and shadows are not dp/elevation equivalents. Exact AndroidX state-dependent elevation, extended-FAB collapse/expand, official motion timing and runtime accessibility remain unverified. Status: partial parity; validate current-head CI and browser/device behavior.


## Badge / BadgedBox — 2026-10-15

Official source: https://developer.android.com/reference/kotlin/androidx/compose/material3/Badge and https://developer.android.com/develop/ui/compose/components?hl=en. Added shared Badge and BadgedBox Web adaptations and Lab specimens for a dot, count and anchored badge. The Lab notification icon now uses BadgedBox instead of a CSS-only dot. Exact offsets/dimensions, count overflow, role-specific colors and screen-reader behavior remain to be validated. Status: partial Web parity; CI/runtime checks pending.


## Tooltip family — 2026-10-15

Official source: https://developer.android.com/develop/ui/compose/components/tooltip and https://developer.android.com/reference/kotlin/androidx/compose/material3/TooltipBox.composable. Added a shared Tooltip Web adaptation with plain and rich forms, pointer/focus triggers, a touch-hold attempt, Escape dismissal, ARIA description association, entry motion and reduced-motion handling. Lab mockup replaced by live specimens. Still missing exact AndroidX caret/position/elevation/motion, robust touch long-press lifecycle, outside dismissal, optional rich actions, and validated assistive-technology behavior. Status: partial parity; current-head CI/runtime checks pending.


## Carousel — 2026-10-15

Official sources: https://developer.android.com/develop/ui/compose/components/carousel and https://developer.android.com/reference/kotlin/androidx/compose/material3/carousel/package-summary. Added a shared Carousel Web adaptation with uncontained and multi-browse specimens, horizontal scroll snapping, group/slide semantics, arrow-key scrolling and reduced-motion-aware scroll behavior. The current multi-browse item widths are a CSS approximation rather than AndroidX's window-aware layout algorithm; fling/state/parallax/masking and exact animation remain incomplete. Browser/device and assistive-technology validation required.


## TopAppBar family — 2026-10-15

Official source: https://developer.android.com/develop/ui/compose/components/app-bars. Added a shared TopAppBar Web adaptation with small, center-aligned, medium and large variants and integrated them into the Lab. Automatic scroll collapse, exact geometry/typography, system insets, action overflow and Compose motion remain incomplete. Status: partial parity; responsive, semantic and scroll validation required.


## BottomAppBar — 2026-10-15

Official source: https://developer.android.com/develop/ui/compose/components/app-bars. Added shared BottomAppBar Web adaptation with actions, custom content and FAB slots; integrated a specimen into the Lab. CSS includes safe-area padding and semantic surface roles. Exact AndroidX geometry/elevation, FAB cutout placement, window insets and motion remain incomplete. Validate current-head CI and browser/device behavior.


## Scaffold — 2026-10-15

Official source: https://developer.android.com/develop/ui/compose/components/scaffold. Added shared Scaffold Web composition with top/bottom bars, navigation rail, content and FAB slots and integrated it into the Lab. It does not yet reproduce AndroidX inner padding/inset handling, snackbar placement, modal navigation state or all overlap rules. Status: partial Web adaptation; runtime validation required.


## ListItem / Divider — 2026-10-15

Official sources: https://developer.android.com/reference/kotlin/androidx/compose/material3/ListItem.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/HorizontalDivider.composable. Added shared ListItem and Divider Web adaptations, replaced the static list rows and horizontal separator in the Lab, and added a vertical divider specimen. Exact dimensions, slot spacing, inset variants, semantics and text scaling remain to verify.


## Chip family — 2026-10-15

Official source: https://developer.android.com/develop/ui/compose/components/chip. Added shared Chip Web adaptation for Assist, ElevatedAssist, Filter, ElevatedFilter, Input and Suggestion variants. The Lab's local filter/suggestion mockups are replaced with the shared component. Exact shapes, state tokens, touch targets, removal semantics and motion remain to audit against the pinned AndroidX source; runtime checks pending.


## RadioButton — 2026-10-15

Official source: https://developer.android.com/reference/kotlin/androidx/compose/material3/RadioButton.composable. Added a shared RadioButton Web adaptation and replaced the Lab's native-radio-only sample. Native input preserves browser radio-group keyboard behavior; M3 indicator, focus, hover, disabled and reduced-motion styles are included. Exact dimensions/state animation and screen-reader behavior remain to validate.


## Tabs — 2026-10-15

Official AndroidX references: [Tabs guide](https://developer.android.com/develop/ui/compose/components/tabs?hl=en), [PrimaryTabRow API](https://developer.android.com/reference/kotlin/androidx/compose/material3/PrimaryTabRow.composable), [SecondaryTabRow API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SecondaryTabRow.composable), [PrimaryScrollableTabRow API](https://developer.android.com/reference/kotlin/androidx/compose/material3/PrimaryScrollableTabRow.composable), [SecondaryScrollableTabRow API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SecondaryScrollableTabRow.composable).

Added `src/components/ui/Tabs.tsx` and its CSS module as a shared React/CSS adaptation, with primary/secondary and scrollable variants, selected-state semantics, roving tab focus, arrow/Home/End navigation, disabled-item skipping and reduced-motion fallback. The Design Lab's local tab mockup is replaced with these shared specimens. This is **not** native Compose and does not yet establish exact visual/motion parity. Automated checks and browser validation remain pending.


## DatePicker / DateRangePicker — 2026-10-15

Official source: [AndroidX date pickers guide](https://developer.android.com/develop/ui/compose/components/datepickers?hl=en).

Added `src/components/ui/DatePicker.tsx` and CSS as a shared Web adaptation for single date and date-range selection. The Lab also shows a native HTML `input[type=date]` variant, explicitly labelled as a browser wrapper rather than AndroidX modal input. Month navigation, selected/today state and min/max bounds are implemented. **Incomplete:** DatePickerDialog, calendar grid keyboard behavior, exact dimensions/motion, RTL and assistive-technology parity. Do not mark this family complete yet.


## TimePicker / TimeInput — 2026-10-15

Official sources: [Time pickers guide](https://developer.android.com/develop/ui/compose/components/time-pickers?hl=en), [time-picker dialogs](https://developer.android.com/develop/ui/compose/components/time-pickers-dialogs?hl=en). Added a shared dial-style `TimePicker` Web adaptation and native HTML time-input wrapper in the Lab. The dial supports hour/minute selection; the input wrapper is explicitly not claimed to match AndroidX `TimeInput`. Current official documentation describes these APIs as experimental, and the TimeInput API reference points to a 1.5.0 alpha introduction; check the exact pinned AndroidX version before making compatibility claims. Exact dial parity, dialog integration, locale/12-hour behavior and accessibility remain to validate.


## SearchBar — 2026-10-15

Official sources: [Search bar guide](https://developer.android.com/develop/ui/compose/components/search-bar?hl=en), [SearchBar API reference](https://developer.android.com/reference/kotlin/androidx/compose/material3/SearchBar.composable). Added a shared Web adaptation for docked suggestions and a full-screen search specimen, including query submission, clear, Escape and arrow-key suggestion selection. **API-version caution:** the older SearchBar overload is deprecated in the current API reference; the current direction uses SearchBarState and expanded docked/full-screen composables. This adaptation does not claim direct API parity. Insets, IME, transitions, focus restoration, RTL and assistive-technology behavior remain unverified.


## TriStateCheckbox — 2026-10-15

Official source: [AndroidX Material 3 TriStateCheckbox API](https://developer.android.com/reference/kotlin/androidx/compose/material3/TriStateCheckbox.composable). Extended the shared Checkbox with a native indeterminate property and mixed-state minus mark, and added a shared `TriStateCheckbox` wrapper plus Lab specimen. This represents the checked/unchecked/indeterminate state model; exact animation, parent-child propagation behavior, and assistive-technology parity still require runtime verification.


## RangeSlider — 2026-10-15

Official sources: [AndroidX RangeSlider API](https://developer.android.com/reference/kotlin/androidx/compose/material3/RangeSlider.composable), [Slider guide](https://developer.android.com/develop/ui/compose/components/slider?hl=en). Added a shared two-thumb `RangeSlider` Web adaptation with native range inputs, independent minimum/maximum accessible names, bounded values, steps and optional minimum gap. It is not claimed to match Compose track/tick geometry or gesture arbitration; pointer testing, RTL, screen-reader behavior and exact visual parity remain open.


## ToggleButton / SplitButtonLayout — 2026-10-15

Official sources: [ToggleButton API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ToggleButton.composable), [SplitButtonLayout API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SplitButtonLayout.composable). Added shared Web adaptations and Lab specimens for toggle-button styles and split actions. The current ToggleButton API describes state-driven shape morphing and multiple sizes; current SplitButtonLayout reference records introduction in Material3 1.5.0-alpha29. These are not native Compose implementations; exact morphing, size tokens, menu semantics and version availability remain to validate.


## TextField / SecureTextField — 2026-10-15

Official references: [TextField](https://developer.android.com/reference/kotlin/androidx/compose/material3/TextField.composable), [OutlinedTextField](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedTextField.composable), [SecureTextField](https://developer.android.com/reference/kotlin/androidx/compose/material3/SecureTextField.composable), [OutlinedSecureTextField](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedSecureTextField.composable). Added a shared `MaterialTextField` adaptation and Lab examples for filled/outlined, supporting/error text, counter and secure password fields. Secure mode blocks common copy/cut/drag events, but must not be described as equivalent to native AndroidX secure input. Exact label/outline motion, text scaling, IME/autofill, context menu and assistive-technology behavior remain unverified.


## DropdownMenu / DropdownMenuItem — 2026-10-15

Official sources: [Menus guide](https://developer.android.com/develop/ui/compose/components/menu?hl=en), [DropdownMenuItem API](https://developer.android.com/reference/kotlin/androidx/compose/material3/DropdownMenuItem.composable). Replaced the Lab's local dropdown mockup with the shared `DropdownMenu` adaptation. It includes keyboard opening/navigation, disabled items, separators, group labels, single-select radio items, multi-select checkable items, outside dismissal and focus restoration after selection. Exact AndroidX popup anchoring/window behavior, typeahead, scroll/insets, RTL and assistive-technology parity remain unverified. Newer SelectableDropdownMenuItem/CheckableDropdownMenuItem APIs require version verification.


## SwipeToDismissBox — 2026-10-15

Official source: [AndroidX Material 3 SwipeToDismissBox API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SwipeToDismissBox.composable). Added a shared Web adaptation with horizontal pointer gesture, configurable direction, threshold-based dismissal and a visible keyboard-accessible dismiss action. This is not Compose's state/gesture implementation; nested scrolling, pointer cancellation, RTL, exact motion and screen-reader behavior remain to validate.


## FloatingActionButtonMenu — 2026-10-15

Official sources: [FloatingActionButtonMenu](https://developer.android.com/reference/kotlin/androidx/compose/material3/FloatingActionButtonMenu.composable), [FloatingActionButtonMenuItem](https://developer.android.com/reference/kotlin/androidx/compose/material3/FloatingActionButtonMenuItem.composable). Added a shared Web adaptation and Lab specimen for expandable quick actions with staggered entrance motion, Escape dismissal and focus restoration on selection. Current API reference lists FloatingActionButtonMenuItem as introduced in Material3 1.5.0-alpha29; check the pinned version. Exact toggle-button morphing, motion, back handling, RTL and screen-reader parity remain open.


## AppBarWithSearch — 2026-10-15

Official source: [AndroidX AppBarWithSearch API](https://developer.android.com/reference/kotlin/androidx/compose/material3/AppBarWithSearch.composable). Added a shared Web composition using the shared SearchBar with navigation action and sticky app-bar layout. It does not implement AndroidX SearchBarState, nested-scroll behavior or platform window insets. Exact scroll behavior, elevation, shape/motion, full-screen pairing, RTL and assistive-technology parity remain open.


## WideNavigationRail / ModalWideNavigationRail — 2026-10-15

Official sources: [WideNavigationRail API](https://developer.android.com/reference/kotlin/androidx/compose/material3/WideNavigationRail.composable), [ModalWideNavigationRail API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ModalWideNavigationRail.composable). Added standard wide and modal wide-rail Web adaptations in the Lab. The modal variant includes scrim, Escape dismissal and focus containment/restore, but is not native Compose. Current API reference lists ModalWideNavigationRail as introduced in Material3 1.5.0-beta01; check the pinned version. Adaptive breakpoints, insets, animation, RTL and screen-reader behavior remain open.


## PullToRefreshBox — 2026-10-15

Official sources: [PullToRefreshBox API](https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/PullToRefreshBox.composable), [pullToRefresh modifier](https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/pullToRefresh.modifier). Added a shared Web adaptation with pull-distance indicator, controlled refreshing state, reduced-motion behavior and an explicit refresh button. Browser nested-scroll/overscroll arbitration differs from Compose; pointer behavior must be tested on touch devices before considering this family conformant.


## BottomSheetScaffold — 2026-10-15

Official source: [AndroidX BottomSheetScaffold API](https://developer.android.com/reference/kotlin/androidx/compose/material3/BottomSheetScaffold.composable). Added a persistent bottom-sheet Web adaptation with controlled collapsed/expanded state, keyboard-accessible handle and vertical drag threshold. This does not replicate Compose nested scroll, velocity/anchor state, window insets or exact motion. Runtime gesture, RTL and assistive-technology validation remain open.


## TimePickerDialog — 2026-10-15

Official source: [AndroidX TimePickerDialog API](https://developer.android.com/reference/kotlin/androidx/compose/material3/TimePickerDialog.composable). Added a modal Web adaptation with draft time, confirm/cancel actions, Escape dismissal and focus management. It is not native Compose window behavior; exact dialog geometry, time-picker animation/state, locale, back handling and screen-reader parity remain to validate.


## SegmentedButton rows — 2026-10-15

Official sources: [SegmentedButton API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SegmentedButton.composable), [SingleChoiceSegmentedButtonRow API](https://developer.android.com/reference/kotlin/androidx/compose/material3/SingleChoiceSegmentedButtonRow.composable). Added a shared single-/multi-choice segmented-button adaptation and Lab specimens. It is distinct from the existing generic SegmentedControl wrapper; exact item shape calculation, icon variants, spacing, RTL and assistive-technology parity remain unverified.


## FloatingToolbar — 2026-10-15

Official sources: [HorizontalFloatingToolbar](https://developer.android.com/reference/kotlin/androidx/compose/material3/HorizontalFloatingToolbar.composable), [VerticalFloatingToolbar](https://developer.android.com/reference/kotlin/androidx/compose/material3/VerticalFloatingToolbar.composable). Added shared horizontal/vertical Web adaptations and Lab specimens. The current API exposes scroll behavior and floating-toolbar state; the reference lists FloatingToolbarState as introduced in Material3 1.5.0-beta01. Scroll-driven collapse, nested scroll, touch-exploration behavior, exact elevation/shape, RTL and screen-reader parity remain open.


## Button and IconButton variant inventory — 2026-10-15

Official references include [Button](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable), [FilledIconButton](https://developer.android.com/reference/kotlin/androidx/compose/material3/FilledIconButton.composable), [FilledTonalIconButton](https://developer.android.com/reference/kotlin/androidx/compose/material3/FilledTonalIconButton.composable), [OutlinedIconButton](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedIconButton.composable) and [IconToggleButton](https://developer.android.com/reference/kotlin/androidx/compose/material3/IconToggleButton.composable). Lab identifier coverage now lists official filled/elevated/tonal/outlined/text and icon-toggle variants; interactive examples show selected states for each icon-button style. The app's `danger` button style is explicitly an app-specific semantic extension, not an official Material 3 variant.


## DismissibleNavigationDrawer / PermanentNavigationDrawer — 2026-10-15

Official sources: [DismissibleNavigationDrawer](https://developer.android.com/reference/kotlin/androidx/compose/material3/DismissibleNavigationDrawer.composable), [PermanentNavigationDrawer](https://developer.android.com/reference/kotlin/androidx/compose/material3/PermanentNavigationDrawer.composable). Extended the shared drawer with dismissible in-layout and permanent variants, and added Lab specimens. Exact layout measurement/content shifting, adaptive breakpoints, insets, state animation, RTL and screen-reader behavior remain unverified.


## ScrollField — 2026-10-15

Official sources: [ScrollField API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ScrollField.composable), [ScrollFieldState](https://developer.android.com/reference/kotlin/androidx/compose/material3/ScrollFieldState). Added an isolated Web wheel-selector specimen. This is an experimental Material3 Expressive API (state added in 1.5.0-alpha19; defaults in 1.5.0-alpha29), not part of the default Pixel-fidelity style direction. Exact Compose PagerState snapping, animation/velocity, TalkBack announcements, touch/RTL and visual parity remain unverified.


## ButtonGroup — 2026-10-15

Official sources: [ButtonGroup API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonGroup.composable), [ButtonGroupScope](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonGroupScope). Added an isolated Web adaptation with selected items, modest width emphasis and overflow menu. This is a recent API (scope/DSL listed in Material3 1.5.0-alpha29); the fixed maxVisible demo threshold is not AndroidX's measured adaptive overflow or compression behavior. Exact animation, layout measurement, keyboard/menu state and version availability remain open.


## NavigationSuiteScaffold — 2026-10-15

Official source: [AndroidX adaptive NavigationSuiteScaffold API](https://developer.android.com/reference/kotlin/androidx/compose/material3/adaptive/navigationsuite/NavigationSuiteScaffold.composable). Added a shared Web adaptation that switches between NavigationBar, NavigationRail and PermanentNavigationDrawer using CSS viewport breakpoints. The official adaptive navigation suite is a separate artifact (release page lists 1.5.0-beta01); current CSS thresholds are approximations, not WindowSizeClass/dp parity. Exact adaptive type overrides, insets, RTL, state preservation and device behavior remain open.


## CI lint follow-up — DatePickerDialog / TimePickerDialog / DatePicker (2026-10-15)

- Fixed React lint errors caused by synchronously resetting draft state inside effects. Each dialog now mounts its draft-owning content only while open; its draft state initializes from the current external value, and unmounting on dismiss discards cancelled edits. A keyed inner session also refreshes when the external selection changes.
- The modal side-effect effect now manages focus, Escape/Tab handling and body scroll only; it no longer calls state setters synchronously.
- Replaced unsupported `aria-pressed` on the calendar's `gridcell` role with `aria-selected`. The calendar's broader grid/row semantics still deserve a dedicated accessibility pass.
- Validation status: fixes committed to the PR branch; waiting for the resulting GitHub Actions run. Do not call CI green until that run completes successfully.


## CI typecheck follow-up — Badge content guard (2026-10-15)

- The post-lint CI run found TS2367 in `Badge.tsx`: comparing the `ReactNode` union directly with `false` was rejected by TypeScript 6.
- Rewrote the guard to narrow booleans with `typeof content === "boolean"`, preserving the intended behavior (null/undefined and `false` render the dot; other nodes render content).
- Lint passed in the same run; typecheck failure prevented tests/build from running. Await a new complete CI run.


## CI test repair — refresh stale Lab selectors (2026-10-15)

- Added a visible `ComponentIdentifier` beside the indeterminate `CircularProgressIndicator` specimen so that its official API name is explicit.
- Updated source-contract tests to match the current shared specimen composition rather than removed identifiers/props: progress label formatting, the combined NavigationRail/FAB identifier, Checkbox's disabled mixed-state border logic, and the current DropdownMenu trigger composition.
- Narrowed the ModalBottomSheet test's forbidden-name check so the separate, valid `BottomSheetScaffold` state is not mistaken for an obsolete modal-sheet mockup.
- Tests/build have not yet completed successfully on the latest source; this is a test-contract repair, not a claim of runtime parity.

## Button — 2026-10-16

**Detailed contract:** [`docs/components/Button.md`](components/Button.md)  
**Implementation:** `src/components/ui/Button.tsx`  
**Live specimen:** `src/app/[locale]/design-lab/audit/ComponentLivePreview.tsx` (preview key `button`)  
**Initial status:** verification required; this section records the approved implementation direction, not a claim of full conformance.

- Approved direction: stable shape while pressed; 40px minimum height and 58px minimum width as web CSS values; 24px horizontal padding for standard variants and 12px for text buttons.
- Standard labels remain single-line by default. The explicit `multiline` prop opts into wrapping/intentional line breaks when the caller supplies a constrained width.
- The live preview covers the five canonical variants, disabled states, Loculary's destructive extension, leading icons, trailing arrows, long labels, constrained width and opt-in multiline behavior. Hover, keyboard focus and pressed states are exercised through real pointer/keyboard interaction.
- AndroidX sources define the design reference; React/CSS behavior remains a web adaptation. Exact visual parity, resolved light/dark contrast, responsive/zoom behavior and assistive-technology behavior require runtime verification.
- Do not mark the implementation conformant until automated checks and browser verification provide evidence.

## IconButton — separate visible surface from interactive target (2026-10-19)

- **Observed:** the shared Web `IconButton` previously applied `48px × 48px` to the button's visible background/border, making the visible filled/outlined surface larger than the small Material 3 icon-button container.
- **Official source:** the pinned [AndroidX IconButton.kt](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt) documents a 48dp minimum interactive target and applies `minimumInteractiveComponentSize()` separately from `smallContainerSize()`. The generated [SmallIconButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/a4067b4140d0802f4416d38fa96e2baa68f65af7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt) defines a 40dp container and 24dp icon. These are Android reference values, not CSS-pixel equivalences.
- **Delivered:** [PR #755](https://github.com/Nabouna32/lab/pull/755) retains a 48 CSS-pixel native button target/focus ring and moves fill, border and state styling onto a centered 40 CSS-pixel child surface. Hover, pressed and disabled styling follows the outer button state. The child surface is hidden from the accessibility tree because the native button has its explicit accessible label.
- **Regression coverage:** `button-m3-conformance.test.mjs` asserts both dimensions, the state-driven surface and the accessible toggle contract. Existing call sites retain their API; no per-consumer sizing overrides are required.
- **Status:** merged to `main` in commit `3bf5a2730304c6f7d826b564bd6f113dea373dba`. Full CI passed on exact PR head `77737d3de3874c9b7512e33aa83cb21cf25db612` ([run #39211948341](https://github.com/Nabouna32/lab/actions/runs/39211948341), attempt 2). Vercel production deployment is `READY` ([deployment](https://vercel.com/nabouna32/loculary/7uCPESpNGf21miYQnkAuZjNtL4z5)). Browser verification of surface geometry, touch targeting, keyboard focus, selected/disabled states and light/dark themes remains open; do not claim full visual conformance before that check.

## TextField — label color must follow the invalid state (2026-10-19)

- **Observed:** the shared `TextField` already styles the input border/ring through `aria-invalid`, but the default Fidelity label stayed in its normal foreground color. The opt-in floating-label variant also needed to keep disabled-label color higher priority than the error treatment.
- **Official evidence:** the pinned [AndroidX OutlinedTextField.kt](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/OutlinedTextField.kt) documents that `isError` colors the label and other field indicators with the error role. This is a state-color correction, not a claim that Loculary's separate-label default has the complete AndroidX outlined-field anatomy.
- **Anatomy decision:** [DEC-028](../DECISIONS.md#dec-028--persistent-labels-remain-the-default-for-shared-web-tool-fields) keeps persistent labels as an intentional Web adaptation for launch; this does not close the visual-parity gap by claiming an outlined floating-label component.
- **Delivered:** [PR #756](https://github.com/Nabouna32/lab/pull/756) derives invalid state from the existing `aria-invalid` prop, colors both Fidelity and Expressive labels with the semantic danger role while enabled, and preserves the disabled label treatment. No public API, DOM order or layout changes.
- **Regression coverage:** source-contract test asserts the error label role and disabled-state precedence. Full lint, TypeScript, test and build checks passed on the exact PR head in [run #39212527879](https://github.com/Nabouna32/lab/actions/runs/39212527879). Vercel production deployment for merge commit `e4642448af1e9d3e3dc0162a39cdbc01ee10c753` is `READY` ([deployment](https://vercel.com/nabouna32/loculary/HxZMjgMhAjCPTUrakXLAyy3w6oGz)). Browser verification remains open.

## TextArea and Select — labels follow invalid state (2026-10-19)

- **Observed:** the shared `TextArea` and labelled native `Select` style invalid borders through `aria-invalid` (or the TextArea's `error` prop), but their visible labels remained in the normal foreground color.
- **Evidence:** AndroidX [OutlinedTextField.kt](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/OutlinedTextField.kt) explicitly describes error coloring for the label and other field indicators. This is a cross-control state-consistency fix, not a claim that the Web controls have full Compose parity.
- **Change in progress:** make each label follow its control's existing invalid state while preserving disabled-label color precedence. TextArea's error message and `aria-describedby` behavior remain unchanged; Select's optional label and native select semantics remain unchanged.
- **Regression coverage:** source-contract tests cover the error-role and disabled-precedence branches. Full CI and production deployment verification are pending; browser checks remain necessary.
