# Material 3 audit — conversation checkpoint

**Date:** 2026-10-15  
**Purpose:** Preserve the decisions, findings, unresolved questions and next steps from the ongoing Loculary Material 3 / Pixel fidelity audit so work can continue in a new conversation without losing context.  
**Status:** Audit/checkpoint only. This document does not claim that the full audit or browser verification is complete.

## 1. Product direction and non-negotiable decisions

- Target: a coherent, reusable **Material 3 Fidelity + current Pixel/Android-inspired** design system for Loculary's production web UI.
- Official Android Developers / Material documentation is the primary authority for component semantics, intended use, roles, states, shape, typography and motion. Use official Material Web documentation/tokens for web-specific details where available. Third-party libraries can inform implementation mechanics but must not define Android conformance.
- Do not confuse a React component with an official Android component. Describe it as a web adaptation of the relevant M3 pattern.
- Use shared production primitives and semantic tokens, not Lab-only styling that must be rewritten before production use.
- Default seed is `#4285F4`; use official Material Color Utilities **Fidelity** for seed-derived semantic roles. Use official MCU **Rainbow** only for deliberate category identity accents, not as a parallel semantic theme or decoration on general surfaces.
- **Roboto** is the validated default interface typeface.
- Do not use M3 Expressive as the chosen direction. Pixel-like does not mean making every surface blue: preserve tonal hierarchy, neutral surfaces and semantic roles.
- Build components when a real Loculary flow needs them; do not implement the entire M3 catalogue just because it exists.
- Work in small, reviewable slices. For each component, document the official source, what is actually verified, the Loculary web adaptation, any deliberate deviation, and acceptance tests. Challenge assumptions rather than silently approving them.

## 2. Design Lab theme and controls

### Confirmed source finding
At the time of the audit, `src/app/[locale]/design-lab/VisualLab.tsx` kept local `useState("light")` state. That state drove `createM3Scheme(seed, "fidelity", theme === "dark", ...)`, Lab tokens and previews. The Lab also exposed its own Light/Dark buttons.

### Decision
- The Lab must follow the **actual resolved site theme** (light/dark/system) using the existing application theme provider/hook.
- Remove the Lab's independent light/dark selector; the global header already owns this setting. Do not leave the Lab using hidden/stale local theme state after removing the visible selector.
- Keep independent experimental controls that are genuinely useful, such as the palette/seed color and preview viewport.
- Audit mock profile/settings examples and status colors to ensure they follow the real selected theme too.
- Do not claim this has been implemented until code is changed and tested.

## 3. Shape, density, color and motion conventions to establish

### Shape
- Use the official M3 **semantic shape scale** as the baseline rather than arbitrary radii per selector.
- Establish shared tokens for relevant roles (e.g. none, extra-small, small, medium, large, extra-large, full), mapped to the actual component families.
- Add the requested **global rounding-degree control** as a Loculary adaptation that scales/adjusts the shared semantic scale coherently. Preserve explicit `none` and `full` semantics; avoid breaking pills/circular controls or component proportions.
- A global rounding control is a product-specific convenience, not an official Android setting. Label that distinction clearly.
- Inventory existing values in `globals.css`, Tailwind classes, shared components and `visual-lab.module.css` before changing them. Lab CSS has locally hard-coded radii and motion values that may diverge from global tokens.

### Color
- Use M3 semantic roles and matching foreground/container pairs (for example, `on-primary-container` on `primary-container`).
- Default filled-tonal button roles are `secondary-container` / `on-secondary-container` unless a documented component variant requires otherwise.
- Keep status roles (success, warning, error, info) semantically distinct from brand/category accents. Do not signal status through color alone.
- Validate actual resolved foreground/background values in both themes. A static test or token name is not proof of rendered contrast or visual fidelity.

### Density and touch targets
- Use default M3 density unless a real product need justifies an explicit compact adaptation.
- Do not shrink necessary touch targets just to make the interface look denser.
- Android's 48 dp touch-target guidance is a reference; dp must not be casually equated with CSS px. Define and test the Web adaptation.

### Motion
- Consolidate shared motion tokens and define durations/curves by transition purpose rather than one-off values.
- Respect `prefers-reduced-motion`; remove nonessential movement without removing state feedback.
- A global motion token is an implementation convention, not proof that each component follows official motion guidance.

## 4. Repository state and current evidence

Repository: [Nabouna32/lab](https://github.com/Nabouna32/lab)  
Main commit observed during audit: `2cec3f9a7aa4db7a375a4bf49e4e5c058f6463fa`.

Shared UI files observed under `src/components/ui/`:
- `Button.tsx`, `Card.tsx`, `Checkbox.tsx`, `ClearButton.tsx`, `CollectionIcon.tsx`, `CopyButton.tsx`, `IconButton.tsx`, `MaterialIcon.tsx`, `Panel.tsx`, `ResultPanel.tsx`, `SegmentedControl.tsx`, `Select.tsx`, `StarIcon.tsx`, `Switch.tsx`, `TextArea.tsx`, `TextField.tsx`, `ValidationMessage.tsx`.

Relevant tests observed:
- `src/lib/contrast-checker.test.ts`
- `src/lib/design-system/button-m3-conformance.test.mjs`
- `src/lib/design-system/material-components.test.mjs`

Relevant theme files:
- `src/components/theme/ThemeProvider.tsx` uses a next-themes provider with `class`, `defaultTheme="system"`, `enableSystem`.
- `src/components/theme/ThemeToggle.tsx` offers system/light/dark.
- `src/app/[locale]/design-lab/VisualLab.tsx`
- `src/app/[locale]/design-lab/visual-lab.module.css`
- `src/app/globals.css`
- `src/lib/design-system/rainbow-tones.ts` and `m3-theme.ts`
- Contract: `docs/DESIGN-SYSTEM.md`
- Existing audit: `docs/M3-CONFORMANCE-AUDIT.md`

Existing audit document already records prior source-review findings and fixes: Fidelity vs Expressive source-of-truth conflict, generated error roles, tonal button foreground/container roles, Lab and production color pairings, mixed-content result surfaces, shared icon consistency, shared Checkbox/Switch, and status contrast. Treat those as **documented source-review claims**, not as proof that every route or state was visually verified. Read the existing audit and design contract before repeating or superseding their conclusions.

## 5. Shared components: current review matrix

| Component/family | Current state seen in source | Audit / acceptance requirements |
|---|---|---|
| Button | Shared variants include filled, elevated, filled-tonal, outlined and text, plus legacy aliases. | Verify each call site's intent; role pairing; focus-visible, hover, pressed, disabled/loading; text/icon spacing; wrapping; touch target; state-layer treatment. Do not solve all states with whole-element brightness filters. |
| IconButton | Shared primitive exists; icon-only actions require accessible labels. | Verify momentary vs toggle behavior, selected state, accessible name, keyboard behavior, target dimensions and all themes. |
| SegmentedControl | Shared primitive exists. | Verify single-choice semantics, selected/unselected roles, long labels/wrapping, narrow widths and keyboard behavior. |
| Checkbox | Shared primitive exists; raw checkbox use was identified in PasswordGenerator before PR #723. | Verify native/ARIA semantics, label association, focus, mixed state if supported, disabled state, touch target and contrast. |
| Switch | Shared primitive exists. | Use for true binary settings, not independent multi-select or mutually exclusive choice. Verify state semantics, disabled styling, keyboard operation and persistence when used for actual preferences. |
| TextField / TextArea | Shared primitives exist. | Check visible labels, `aria-describedby` relationships, error/helper association, invalid/disabled/focus states, input mode/autofill, long strings and zoom. |
| Select | Shared primitive is a native `<select>`. | Do not replace it just to look more custom. Check label/description, disabled/focus, keyboard and platform behavior. |
| ValidationMessage | Shared primitive exists; alert semantics were observed. | Ensure live announcement is appropriate (avoid repetitive/assertive announcements); connect errors to their fields and keep visible text. |
| Card / Panel / ResultPanel | All exist; some responsibilities may overlap. | Document roles and intended composition; avoid nested containers without hierarchy; test neutral/mixed-content surfaces in light/dark. |
| CopyButton / ClearButton | Shared wrappers exist. | Check real success/failure feedback and announcements, action timing, repeated activation and whether Snackbar is warranted. |
| Slider / ProgressIndicator | Proposed in open PR #723, **not present on main at the time of this check**. | Inspect PR and reconcile safely before duplicating. Slider needs visible label/value, native range semantics, keyboard, track/thumb and touch verification. Progress needs real determinate values or indeterminate mode, and reduced-motion behavior. |
| Snackbar / Dialog / Tooltip | Not found in the initially scanned shared UI directory; examples may exist in Lab or elsewhere. | Complete repository-wide call-site/flow inventory before declaring missing. Add only where real use cases recur; dialog needs focus management and safe cancel/confirm; tooltip must not be the only label. |
| Radio group / chips / tabs / navigation drawer / bottom sheet / FAB | Candidate families, not confirmed requirements. | Map to real product flows and current architecture before adding. No catalogue-completeness project. |
| Search/navigation | Search and app shell use multiple local components. | Inventory call sites; verify combobox/listbox or link semantics as appropriate, ARIA synchronization, keyboard/focus restoration, Escape/outside dismissal, result announcements and unclipped responsive overlays. |
| Typography | Roboto is the chosen default. | Define semantic roles and responsive values; verify French/English long strings, line-height, wrapping and zoom. |
| Icons | Shared Material Symbols Outlined path exists; brand/flag/QR and content identity are exceptions. | Keep functional actions consistent, accessible names and decorative hiding. Do not replace category content symbols automatically with action icons. |

## 6. Known issues and user-reported visual problems to revisit

These were raised by the user in the Lab review and must not be treated as resolved unless verified against current code and rendered behavior:

- “Continuer le dialogue” and the lower Lab “continuer” button were hard to read.
- “Action tonal” had low contrast.
- Section 03 dialogue preview did not reflect an earlier fix.
- Selected buttons in “formulaire et choix” and selectable filters wrapped unexpectedly.
- “Focus clavier” and “Rejouer l’animation” had corner radii inconsistent with nearby buttons.
- Enable/disable controls unexpectedly stayed blue after the palette changed, rather than following intended semantic states.
- Light/dark orchestration and a previous SVG crash were reported.
- The preview title had an unwanted blue background in a previous iteration.
- User explicitly clarified that a visible keyboard-focus example in the Lab is intentional even when not actively focused; the complaint was about inconsistent rounding, not the permanent visibility of the focus demo.
- Palette/color/shape/font-size previews should be retained only if they support useful component testing; remove ornamental or redundant controls, but do not remove useful interactive components.
- Language selection seemed misplaced on the Lab page; reassess placement as part of composition audit.
- User wants to choose arbitrary test colors through a palette picker and adjust the global rounding degree.

## 7. Official reference policy

Use official Android Developers references first, then official Material Web where relevant. Primary references include:
- [Material 3 theming](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Buttons](https://developer.android.com/develop/ui/compose/components/button)
- [Icon buttons](https://developer.android.com/develop/ui/compose/components/icon-button)
- [Segmented buttons](https://developer.android.com/develop/ui/compose/components/segmented-button)
- [Checkbox](https://developer.android.com/develop/ui/compose/components/checkbox)
- [Switch](https://developer.android.com/develop/ui/compose/components/switch)
- [Slider](https://developer.android.com/develop/ui/compose/components/slider)
- [Text input](https://developer.android.com/develop/ui/compose/text/user-input)
- [Progress indicators](https://developer.android.com/develop/ui/compose/components/progress)
- [Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar)
- [Dialog](https://developer.android.com/develop/ui/compose/components/dialog)
- [Tooltip](https://developer.android.com/develop/ui/compose/components/tooltip)
- [Cards](https://developer.android.com/develop/ui/compose/components/card)
- [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/apps)
- [Official Material Web components](https://material-web.dev/)

The 48 dp Android touch-target guideline is a useful reference, not an automatic 48 CSS-pixel rule. Compose APIs/examples describe native semantics and must be adapted to HTML/ARIA and browser interactions rather than copied literally.

## 8. PR #723 — ported and closed without merging

PR: [#723 — feat(ui): add shared M3 slider and progress indicators](https://github.com/Nabouna32/lab/pull/723)  
Branch: `feat/m3-slider-progress`  
Observed source head SHA: `efdb3032a72f89ed45fb8e99ae76417a4e5a70d1`.

- PR #723 was closed by user request after its changes were ported into PR #729. It was not merged.
- The port was reconciled into the current main-based files rather than copying the stale PR branch wholesale.
- Porting does not certify conformance. Review the current PR #729 diff, wait for an actual CI run, and complete browser/keyboard/touch checks before considering a merge.
- Do not reopen or merge #723 unless the user explicitly asks.
## 9. Verification status — be precise

This conversation's audit is primarily static source/document review. Do **not** claim the following were completed unless a later run records evidence:
- complete repository-wide usage inventory;
- browser rendering/screenshots;
- keyboard-only interaction checks;
- screen-reader testing;
- responsive checks at mobile/tablet/desktop and zoom;
- visual comparison to current Pixel UI;
- cross-browser touch/slider alignment checks;
- current CI/lint/typecheck/test/build success;
- full computed-color contrast for every component state.

Static tests and contrast unit tests are useful but do not establish full rendered conformance. Record commands/results, browsers/viewports, routes, theme and states whenever runtime verification is performed.

## 10. Next steps for the next conversation

1. Read this checkpoint, `docs/DESIGN-SYSTEM.md`, `docs/M3-CONFORMANCE-AUDIT.md`, DEC-026 and PR #723 discussion/diff before making changes.
2. PR #723 is closed without merging. Continue reviewing the port in PR #729 and verify the current head with CI and browser checks; do not merge until the user asks.
3. Complete a repository-wide usage inventory of existing shared primitives and local controls, starting with the actual call sites, not just filenames.
4. Inspect Lab theme flow and all local shape/motion overrides. Propose a convention before implementing: site theme as source of truth; semantic M3 shape scale; global rounding degree as a Loculary adaptation; shared motion tokens and reduced-motion behavior.
5. Produce a component-by-component audit matrix: official source, source-level evidence, actual gap, product-specific adaptation, acceptance tests, verification status.
6. Resolve user-reported Lab defects above against current code. Do not treat a previous CSS patch as complete if the relevant preview/section does not actually consume it.
7. Keep changes small and explicit. No blanket redesign, no invented Android rules, no claiming visual validation without running it.
8. Add/update tests and docs as each implementation slice lands; then run lint, typecheck, tests and build, and do actual browser checks for both themes and responsive layouts.

**Checkpoint authoring note:** This document captures discoveries and decisions; it is not a claim that the audit is finished or that PR #723 has merged.


## Update — PR #723 port into this checkpoint PR

The user requested that PR #723's changes be brought into PR #729 without merging either PR. The checkpoint PR now contains the shared `Slider` and `ProgressIndicator` files, their CSS, the PasswordGenerator and ImageCompressor call-site updates, checkbox updates, Lab CSS changes, and the design-system/audit documentation updates where they apply cleanly to current `main`.

**Ported into the current files:** the Lab demo now uses shared Slider/ProgressIndicator/Checkbox and includes disabled-state examples; Checkbox, Switch and field disabled states use component-specific semantic roles; regression assertions cover the controls and call sites. These changes were applied on top of current `main` files rather than copying the stale PR branch wholesale. **Validation is still pending:** run lint, typecheck, tests and build, then do browser-level visual/keyboard/mobile checks. PR #723 is closed without merging; PR #729 remains open and unmerged.

## New canonical document

[`docs/M3-CONVENTIONS.md`](./M3-CONVENTIONS.md) now consolidates the officially sourced M3 guidance and Loculary-specific decisions into a reusable convention: semantic color roles, Fidelity vs category Rainbow, typography, semantic shapes and global rounding degree, density/touch targets, button/selection/input/slider/progress contracts, motion/reduced motion, Design Lab requirements and acceptance criteria.


## PR #729 integration snapshot (2026-10-15)

- PR #729 title: **feat(ui): port M3 slider/progress and document design conventions**; it remains open and has not been merged.
- The branch includes all 13 file paths changed by PR #723, ported onto the current main-based file versions, plus this checkpoint and `docs/M3-CONVENTIONS.md`.
- Current changed-file inventory includes the shared Slider/ProgressIndicator components and styles, Checkbox/Switch, the Lab and its CSS, PasswordGenerator, ImageCompressor, regression tests, `docs/DESIGN-SYSTEM.md` and `docs/M3-CONFORMANCE-AUDIT.md`.
- GitHub Actions CI run [#2268](https://github.com/Nabouna32/lab/actions/runs/38692392905) was still in progress at the latest check. Do not claim typecheck/tests/build passed until the run completes and its conclusions are inspected.
- GitHub's mergeability signal for PR #729 fluctuated during successive updates, so do not rely on a stale snapshot as proof of readiness or of a specific conflict. The user explicitly asked to leave it unmerged. Wait for CI and review the current base/head diff before any future merge; never force-update to bypass conflicts.
- No browser-level validation has been performed in this workflow. Continue to treat Chromium, Firefox, mobile touch, keyboard/focus, assistive technology, light/dark and responsive checks as outstanding.
## Update — audit continuation and PR lifecycle (2026-10-15)

### Pull requests
- PR #723 is now closed without merging because its implementation was ported into PR #729. Link: https://github.com/Nabouna32/lab/pull/723.
- PR #729 remains open and unmerged by explicit user instruction. Continue the audit and fixes on docs/m3-audit-conversation-checkpoint; do not merge until the user asks after audit completion.
- Closing #723 does not mean its implementation is approved or verified; the port still needs CI and browser validation.

### Confirmed new source observations and changes
- VisualLab.tsx had a local useState("light") and its own Light/Dark selector. The source was changed to read resolvedTheme from @teispace/next-themes and the local selector was removed. This aligns with the product decision that the Lab follows the app's global theme. Runtime/typecheck/build verification is still open.
- CI run 38692497438 failed in src/lib/design-system/material-components.test.mjs with duplicate top-level const labCss declaration. The test file also repeated declarations for image source, slider source/CSS and progress source/CSS. Duplicate declarations were removed in commit 3ba963371a9e287b82079d90aefa68689ddffdab. Wait for a new CI run and inspect the exact failure/result; do not claim success yet.
- Source review found a cross-browser focus-token inconsistency in slider.module.css: WebKit uses --slider-focus-ring with fallback, while Firefox's ::-moz-range-thumb uses --focus-ring directly. This should be corrected in the next implementation slice.
- Disabled values are component/state-specific first-party Material Web tokens, not universal Android rules: Checkbox selected/unselected container/icon treatment uses 38%; Switch track layers use 12%, selected handle uses surface at 100%, and unselected handle uses on-surface at 38%; outlined text fields use 38% text and 12% outline, while filled text-field container opacity is 4%. The 48 CSS-pixel slider height is a Loculary web decision, not an Android dp equivalence.

### Evidence discipline — mandatory
Every new convention/audit finding must state whether it is [ANDROID-M3], [MATERIAL-WEB], [WEB-STANDARD], [LOCULARY-DECISION], [SOURCE-OBSERVED], [RUNTIME-VERIFIED] or [OPEN]. Link the official source and only claim what it explicitly supports. A static source assertion or successful CI does not prove rendered M3 fidelity. The evidence-label definitions and slider/progress distinctions are in M3-CONVENTIONS.md.
## Update — second source-review slice (2026-10-15)

- **Switch disabled states:** review of the actual first-party Material Web component source showed that the track layers use 12% opacity, the selected handle uses surface at 100%, and the unselected handle uses on-surface at 38%. The implementation now distinguishes selected/unselected disabled track colors and handle roles; a static regression assertion covers the token split. This is Material Web guidance, not a universal Android Compose rule; browser appearance remains unverified.
- **Slider Firefox focus:** aligned the Firefox thumb focus ring with the component-overridable token already used by WebKit and added a static assertion. No Firefox browser test has been run.
- **ValidationMessage / Lab:** the Lab's always-visible illustrative validation message used a component that defaults to role=alert. Added an optional role contract and removed the live-region role only for the static Lab example. Production call sites still default to alert; review each flow for whether assertive announcement is appropriate.
- **Tests updated:** added source-level checks for resolved site theme, non-alert Lab validation sample, slider focus token and Switch disabled outline. These are static regression checks only; they do not prove runtime behavior.
- **CI status:** no workflow run is currently associated with the newest branch head through the available run query. The last completed run failed on duplicate top-level declarations in the test module; those duplicates were removed. Do not claim the latest test suite/build passed until an actual run is available.

## Update — official Material Web shape and field-state audit (2026-10-15)

- Added shared shape variables using the version-pinned first-party Material Web shape tokens: none 0px, extra-small 4px, small 8px, medium 12px, large 16px, extra-large 28px and full 9999px. These are CSS-pixel web tokens, not Android dp conversions.
- Checkbox now uses the Material Web 18px container, 2px shape and 18px check icon. Its disabled checked and unchecked states use different opacity/outline behavior. The 48px wrapper remains a Loculary touch-target choice.
- TextField, TextArea and Select now use the shared extra-small shape token and component-specific disabled roles based on first-party Material Web tokens: outlined text/labels 38%, outline 12%, and filled-field container opacity 4% (the latter is documented for provenance; these Loculary controls are outlined-like).
- The global rounding-degree control remains unimplemented. Continue mapping existing buttons, cards, panels, dialogs and Lab-only compositions to semantic shape roles; do not claim the shape audit complete.
- ValidationMessage still defaults to role=alert for conditional production errors; the static Lab sample opts out. Review each production use for announcement timing/urgency.
