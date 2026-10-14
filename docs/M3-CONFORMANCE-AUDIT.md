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
| P1 | Functional icon consistency | Shared UI still includes Unicode action glyphs in CopyButton, ClearButton and ToolCard; processing/status presentation also uses emoji. | Open: replace functional action glyphs with one consistent Material Symbols/SVG icon source. Emoji may remain intentional content/category identity where it is not pretending to be a platform action icon. |
| P1 | Shared stateful controls | PasswordGenerator uses raw checkboxes. No shared production Switch primitive was found; settings-like toggles exist only in the Design Lab prototype. | Open: add a reusable accessible M3-style Switch for real on/off preferences and a reusable Checkbox before expanding settings UI. Do not use a switch for multi-select lists or substitute it for radio/segmented choices. |
| P1 | Feedback components | Copy/clear and processing feedback exist, but no shared production Snackbar, Dialog or Tooltip primitive was found in the scanned UI components; these examples exist in the Lab only. Some result/status messages are implemented independently in pages and tools. | Open: inventory actual flows and consolidate only where repeated behavior warrants it. Prioritize accessible transient feedback for copy/reset, confirmation dialogs for destructive actions, and tooltips only where they add information not already available to keyboard/touch users. |
| P2 | Custom status palette | globals.css defines success, warning and info colors separately from MCU roles. Explicit domain/status colors are allowed by the design contract, but their foreground/background contrast and meaning need systematic verification in both themes. | Open: retain separate semantic status roles, test each foreground/background pair, and never communicate status by color alone. Do not force these statuses into the brand/category palette. |
| P2 | Component state styling | Buttons and icon buttons have consistent focus rings, but hover brightness filters and active scaling are used broadly. | Open: compare enabled, hover, focus-visible, pressed, selected, disabled and loading states with official component guidance. Keep state feedback subtle and respect reduced motion. |
| P2 | Shared primitive coverage | Existing primitives include Button, IconButton, SegmentedControl, TextField, TextArea, Select, Card and Panel; several tool/page controls are implemented locally. | Open: build an inventory of call sites and decide which local patterns truly recur before adding abstractions. Do not force specialized tool interfaces into a generic renderer. |

## Component inventory and audit checklist

| Family | Current implementation surface | Audit focus |
|---|---|---|
| Color and theme | rainbow-tones.ts, globals.css, m3-theme.ts, category color helpers | Fidelity vs Expressive, complete light/dark roles, role pairing, category-only Rainbow usage, contrast of actual computed values |
| Buttons | ui/Button.tsx, ui/IconButton.tsx, ui/SegmentedControl.tsx, account submit buttons, local tool actions | M3 variant intent, semantic color roles, icon/text spacing, state layers, disabled/loading behavior, hit targets |
| Selection | ui/SegmentedControl.tsx, raw checkboxes in tools, selected chips in search/Lab | Single-choice vs multi-choice semantics, selected state, keyboard operation, labels, touch target and contrast |
| Text input | ui/TextField.tsx, ui/TextArea.tsx, ui/Select.tsx, search inputs and tool-local fields | Visible labels, helper/error association, invalid/disabled/focus states, mobile keyboard hints, autofill, long labels and zoom |
| Cards and surfaces | ui/Card.tsx, ui/Panel.tsx, ToolCard, CategoryCard, result panels | Elevated/filled/outlined roles, unnecessary nesting, surface-container mapping, dark theme, interaction semantics |
| Navigation | Header, desktop menu, mobile header search, Footer, Breadcrumbs, tool navigation | Disclosure vs menu semantics, focus restoration, Escape/outside dismissal, active destination, responsive composition |
| Search | ToolSearch, SearchResultsClient, header search | Combobox/listbox semantics, synchronized ARIA state, result announcements, loading/empty/error states, anchored unclipped overlay |
| Tool shell | ToolPageHeader, ToolProcessingStatus, ToolSection and shared runtime actions | Consistent tool identity, privacy/processing disclosure, result-first hierarchy, long-running work, cancellation/progress where applicable |
| Feedback | CopyButton, ClearButton, FavoriteButton, status messages in pages/tools | Success/failure confirmation, announcements, transient vs persistent messages, deduplication and action timing |
| Account/preferences | Account pages, ThemeToggle, local form controls | Reusable switch for on/off settings, validation/error presentation, destructive confirmation, persistence state |
| Typography and shape | Global font and radius tokens plus page-level Tailwind values | Roboto roles, line height, localization, density, consistent shape vocabulary, no clipping at narrow widths |
| Motion | Global view transitions, CSS transitions/animations, Lab motion examples | Cause/effect, duration/easing, reduced-motion behavior, no essential information conveyed only through motion |
| Icons | Inline SVG, emoji category identity, Unicode glyphs | One functional icon language, consistent size/weight, accessible names, decorative hiding, selected/toggled state |

## Components worth adding — only when tied to real flows

1. **Switch** — for persistent binary preferences such as a setting that is on/off. This is the clearest missing shared primitive.
2. **Checkbox** — reusable multi-select control; currently raw checkboxes are used in at least one tool.
3. **Progress indicator** — linear/circular and determinate/indeterminate forms for operations that genuinely take time. Never invent a percentage when the work is indeterminate.
4. **Snackbar / transient feedback** — for brief results such as copy/reset when an inline status is not better.
5. **Dialog** — for decisions requiring focus and a clear confirmation/cancel path, especially destructive actions.
6. **Tooltip** — only for supplementary information, not as the sole label or explanation of an essential action.
7. **Radio group** — for mutually exclusive choices when a segmented control is not appropriate.
8. **Slider** — only for continuous numeric parameters where direct manipulation is genuinely useful.
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
