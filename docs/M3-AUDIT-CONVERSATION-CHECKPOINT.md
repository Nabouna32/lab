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
- Disabled values are component/state-specific and now cross-checked against pinned AndroidX M3 tokens: Checkbox selected container/checkmark and unselected outline use 38%; Switch track layers use 12%, selected handle uses surface at 100%, unselected handle uses on-surface at 38%; outlined fields use 38% text and 12% outline; filled field container opacity is 4%. Material Web is the web-side cross-check. The 48 CSS-pixel slider height remains a Loculary web decision, not an Android dp equivalence.

### Evidence discipline — mandatory
Every new convention/audit finding must state whether it is [ANDROID-M3], [MATERIAL-WEB], [WEB-STANDARD], [LOCULARY-DECISION], [SOURCE-OBSERVED], [RUNTIME-VERIFIED] or [OPEN]. Link the official source and only claim what it explicitly supports. A static source assertion or successful CI does not prove rendered M3 fidelity. The evidence-label definitions and slider/progress distinctions are in M3-CONVENTIONS.md.
## Update — second source-review slice (2026-10-15)

- **Switch disabled states:** pinned AndroidX SwitchTokens confirm 12% track opacity, selected handle surface at 100%, and unselected handle on-surface at 38%; Material Web corroborates the web implementation. The component distinguishes selected/unselected disabled track colors and handle roles; browser appearance remains unverified.
- **Slider Firefox focus:** aligned the Firefox thumb focus ring with the component-overridable token already used by WebKit and added a static assertion. No Firefox browser test has been run.
- **ValidationMessage / Lab:** the Lab's always-visible illustrative validation message used a component that defaults to role=alert. Added an optional role contract and removed the live-region role only for the static Lab example. Production call sites still default to alert; review each flow for whether assertive announcement is appropriate.
- **Tests updated:** added source-level checks for resolved site theme, non-alert Lab validation sample, slider focus token and Switch disabled outline. These are static regression checks only; they do not prove runtime behavior.
- **CI status:** no workflow run is currently associated with the newest branch head through the available run query. The last completed run failed on duplicate top-level declarations in the test module; those duplicates were removed. Do not claim the latest test suite/build passed until an actual run is available.

## Update — official Material Web shape and field-state audit (2026-10-15)

- Added shared shape variables using the version-pinned first-party Material Web shape tokens: none 0px, extra-small 4px, small 8px, medium 12px, large 16px, extra-large 28px and full 9999px. These are CSS-pixel web tokens, not Android dp conversions.
- Checkbox now uses the Material Web 18px container, 2px shape and 18px check icon. Its disabled checked and unchecked states use different opacity/outline behavior. The 48px wrapper remains a Loculary touch-target choice.
- TextField, TextArea and Select use the shared extra-small shape token and component-specific disabled roles confirmed by AndroidX outlined/filled text-field tokens: outlined text/labels 38%, outline 12%, and filled-field container opacity 4% (the latter is documented for provenance; these Loculary controls are outlined-like).
- The rounding-degree preview control is now implemented for semantic-token-based shared components and token-driven compositions. It is a Loculary-specific Lab experiment, not an Android setting. Legacy mockups and tool-local containers still use some fixed radii; map or explicitly exempt them before claiming global coverage.
- ValidationMessage still defaults to role=alert for conditional production errors; the static Lab sample opts out. Review each production use for announcement timing/urgency.
## Update — Card roles and surface-family shape mapping (2026-10-15)

- The shared Card now uses first-party Material Web roles: elevated = surface-container-low + level-1-like shadow, filled = surface-container-highest, outlined = surface + outline-variant. All three use the medium shape token from the official token source.
- Linked cards now have an explicit keyboard focus ring. This is source-level evidence only; rendered focus contrast and clipping still need browser checks.
- Panel and ResultPanel use the medium shape token as a Loculary consistency decision; they are not claimed as official Android components.
- Remaining shape audit: migrate or explicitly exempt fixed radii in button-like Lab mockups, menus/dialogs, chips, nested cards and tool-local containers so the new rounding-degree preview control has consistent coverage.
## Update — segmented-control audit slice (2026-10-15)

- Removed the shared SegmentedControl's optional secondary description line. This was a Loculary extension, not a documented M3 segment feature, and it contributed to label wrapping/uneven control height.
- Percentage and Video Bitrate now place the selected mode description below the segmented group; mobile select options preserve the explanation.
- Segment labels are single-line by product decision. Interior segments use the AndroidX-documented rectangular shape; the earlier small-radius implementation was removed. Test long French strings and keyboard navigation in a browser before considering this slice verified.
## Update — field geometry and numeric step (2026-10-15)

- TextField and Select now use a 56px minimum height based on the version-pinned first-party Material Web outlined field/select tokens. This is a Material Web CSS-pixel value, not a claim of dp equivalence.
- Fixed a source-order bug in TextField: spreading an undefined step prop after step="any" could override the intended decimal default. Explicit caller step values are preserved; number inputs otherwise default to step="any". This is a web-platform behavior correction.
- Static assertions cover these source contracts. Browser/form validation is still pending.

## Update — rounding-degree preview and theme ownership (2026-10-15)

- Added a 0–100% rounding-degree slider to the Design Lab. It scales shared semantic shape tokens and token-driven compositions; 100% is the current first-party Material Web CSS-pixel baseline and 0% squares the semantic corners. Full/pill semantics remain full.
- This is a Loculary-specific preview control, not an Android setting. Several handcrafted Lab mockups and tool-local containers still use fixed radii, so coverage is not yet global. Keep this explicitly open.
- Fixed a stale theme-toggle handler left in the profile mockup after removing the Lab's independent theme selector. The mock preference now changes only its own sample state; the real theme remains the app's resolved theme.
- Updated Lab Checkbox/Switch palette overrides to match component-specific disabled token roles. Browser verification of light/dark and rounding extremes remains outstanding.

## CI feedback — source fixes applied, current head unverified (2026-10-15)

- Typecheck failed on earlier runs 38695462704 and 38695137845 because VisualLab still referenced the removed setTheme setter and two Switch style objects used the removed --switch-disabled-track key.
- Fixed both: the phone-profile sample now toggles only its mock preference state, and all Lab Switch styles use the selected/unselected disabled track variables plus the palette-specific selected handle token.
- Those runs predate the fixes. No current-head green result is confirmed yet; continue without merging and verify the latest SHA when CI reports it.
## Update — Lab selection-state isolation (2026-10-15)

- Found and fixed an unintended coupling: the raw radio-group demo and the shared segmented-control demo shared sampleRadio state. The segmented preview now uses sampleLayout, independent from the radio selection. Added a static regression assertion; manual browser interaction remains outstanding.

## Update — AndroidX button-state tokens (2026-10-15)

- Audited the current pinned AndroidX Compose Material 3 token source, not just Material Web. Disabled button values differ by variant: filled/elevated/text/outlined use 10% container/outline opacity with on-surface-variant text at 38%; filled-tonal uses 12% container and on-surface text at 38%. Icon-button roles also differ by variant.
- Button and IconButton source now reflect those AndroidX distinctions. IconButton selected state now uses primary icon/no added container for standard, secondary/on-secondary for filled-tonal, and inverse-surface/inverse-on-surface for outlined; hover/pressed state layers follow those selected roles.
- The danger button remains a Loculary-specific variant, not an official Android M3 component.
- [OPEN] Browser verification of actual state layers/contrast remains outstanding; the latest typecheck failures reported earlier were on older heads, and no current-head green run is confirmed yet.
## Source hierarchy clarified

For Android-M3 component roles and state values, pinned AndroidX Compose Material 3 token sources are authoritative. Material Web token files are the first-party web-side cross-check. When values differ, follow AndroidX for Android-M3 fidelity and record the web adaptation instead of blending values. CSS pixels and HTML/ARIA behavior remain web-specific.
## Update — CI-found Lab checkbox token issue (2026-10-15)

- Run 38697118090 failed typecheck due to a duplicate --checkbox-container-shape property in the enabled Lab checkbox sample. The disabled sample was also still using the stale 12% selected-container blend and on-surface checkmark.
- Corrected both samples: one rounding token per sample, 38% on-surface selected disabled container, 38% surface checkmark, and rounding-degree override in both samples. Added static regression checks.
- The failure is from an older head. Do not claim green CI until a run for the latest commit finishes.

## Update — SegmentedControl source correction (2026-10-15)

- Cross-checked official AndroidX OutlinedSegmentedButtonTokens.kt and SegmentedButtonDefaults.itemShape. The documented geometry is 40dp high, full rounded outer ends and rectangular interior segments; the selected fill/content roles are secondary-container/on-secondary-container. Disabled outline/content use on-surface at 12%/38%.
- Replaced the old outer bordered/padded capsule with per-segment borders, shared edges, outer-end rounding and square interior corners. Added optional disabled item state and selected hover/pressed layers.
- The previous small-rounded interior corners were not source-backed and are removed. Single-line labels remain a Loculary web layout decision. Browser checks for long labels, disabled boundaries, focus and keyboard navigation remain open.

## Provenance correction

Earlier checkpoint notes that described Checkbox/Switch/field disabled values as Material Web-only or “not Android-confirmed” are superseded by the pinned AndroidX token cross-check in M3-CONVENTIONS.md. AndroidX is authoritative for Android-M3 semantics; Material Web is the CSS-side cross-check.
## Update — Pixel mockup shape-token migration

- Found fixed radii in the Pixel direction preview for the primary button, calculator field and result/card surfaces. These prevent the Lab rounding-degree control from applying consistently.
- Migrate the button to full, field to extra-small and card/result surfaces to medium semantic shape roles. Device-frame and search/icon shapes remain open pending source-backed role mapping.

## Resume point — pinned AndroidX token audit (2026-10-15)

- Closed duplicate PR #723 without merging it; its changes were ported into PR #729. PR #729 remains open and unmerged.
- Confirmed the official AndroidX token source revision used for this slice: b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7.
- Added the official AndroidX button pressed-shape mapping: default full, pressed small. The shared Button now uses the semantic small shape token on active press; browser animation/timing verification is still open.
- Updated stale Button/IconButton conformance assertions and corrected an over-escaped regex found by CI. Previous CI run failed; latest head needs a fresh CI result.
- Continue by inspecting the newest workflow run for the current PR head, fixing any remaining errors, then continue source-backed component audit. Keep AndroidX facts separate from Material Web values and Loculary adaptations.

## Slider audit — source version pinned to non-Expressive style (2026-10-15)

- Found a source-version trap: the newer AndroidX SliderTokens snapshot uses a 16dp track and a 4×44dp pill handle. That is the newer Expressive design direction and conflicts with the project's explicit non-Expressive Pixel-style target.
- Pinned the classic/non-Expressive reference to the official AOSP SliderTokens source at revision 4d53400eca9f3ac90c3a3f6cffcbc5bf492ec536: 4dp track, 20×20dp round thumb, primary active and surface-variant inactive track; disabled track roles 38%/12%.
- Loculary's 4px track and 20px thumb are web adaptations, not dp conversions. Tick markers and value-indicator bubble are not implemented; browser checks remain open.
## Progress indicator audit (2026-10-15)

- Selected the official classic/non-Expressive LinearProgressIndicator token baseline: 4dp thickness, primary active indicator, primary-container track and square ends.
- The shared web component previously used rounded ends and surface-variant track, which matched neither the pinned classic token mapping nor the newer unified token mapping consistently. It now uses square ends and primary-container track.
- CSS px are not dp; the web implementation is an adaptation. Browser validation and circular parity remain open.
## IconButton follow-up (2026-10-15)

- Corrected a semantic role drift in the standard IconButton: unselected hover now keeps on-surface-variant rather than switching to general foreground.
- Corrected the selected outlined toggle: its border is removed when selected, matching AndroidX OutlinedIconToggleButton's default border behavior.
- Static assertions updated. Browser verification of state-layer and border rendering remains open.
## Resume update — current static test corrections (2026-10-15)

- Fixed the remaining IconButton test expectation: disabled icon color is on-surface at 38%, per the pinned AndroidX IconButton tokens. The unselected hover role remains on-surface-variant.
- Fixed literal bracket regex escaping and shape-token whitespace regexes in the component regression test.
- Current branch is still open/unmerged. Latest head has no confirmed green CI status; rerun/verify CI before any merge.
- Updated the Design Lab progress example to use primary-container (Lab alias primary-soft) for its track. Slider inactive track remains surface-variant, as required by the selected classic slider token baseline.
- Current open items: verify Button color-mix state layers against rendered AndroidX-style states; audit classic progress indeterminate choreography (single moving segment is Loculary-specific); browser-check focus, keyboard, mobile, reduced motion and light/dark contrast.


## User clarification — do not equate dislike of Expressive colors with rejecting newer geometry (2026-10-15)

The user clarified that what they disliked about M3 Expressive was its washed-out color treatment and the lack of clear contours on some buttons. They are open to newer shapes/dimensions/animations if these are genuinely part of current Pixel/Android Material fidelity. Earlier checkpoint language that treated newer Expressive dimensions as a categorical exclusion is superseded.

- Target: current Pixel / Android Material fidelity, using the already chosen Material Color Utilities Fidelity semantic palette and user-controlled color/rounding.
- Official source: [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en) describes Expressive as an expansion covering theming, components, motion and typography, and connects it to Android 16 visual style. This is not a mandate to use every Expressive variant, nor proof that Expressive means faded colors or no outlines.
- Compare each component against official Android Developers guidance, the selected current AndroidX source revision and the current Pixel target. Keep colors/contrast, outlines, geometry and motion as separate decisions. Never prefer an old token solely because it is old, or a new token solely because it is new.
- Slider source observations (4dp track/20dp round thumb vs 16dp track/4×44dp pill handle) are versioned alternatives, not yet a final decision. Progress-indicator token generations also need comparison. The current web implementations are provisional adaptations until this comparison and browser/device validation are complete.
- The Lab's circular progress and skeleton are hand-authored CSS examples, not shared production components and not evidence of Android motion fidelity. A shared circular progress indicator and source-backed indeterminate animation choreography remain open requirements for the user's full-fidelity goal.
- CI run 38699485234 failed on the test step; lint and typecheck passed, build was skipped. The failing assertion expected the IconButton selected-standard text class to have no hover/pressed suffix; it has been corrected in `material-components.test.mjs`. A fresh CI run must be checked before reporting success.
- PR #729 remains open and unmerged. Do not merge without the user's explicit authorization.


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


## Checkpoint update — 2026-10-15: Expressive comparison and CI status

**User decision:** Design Lab must let the user compare both the current Pixel/M3 baseline and official M3 Expressive differences. Keep the production default unchanged pending validation. Do not interpret dislike of washed-out colors or weak contours as rejection of every Expressive geometry/motion change. Source-check every component against official Android Developers and version-pinned AndroidX Compose Material 3; Material Web is a web cross-check, not the Android source of truth.

**Official source finding:** Android Developers explicitly describes Expressive as an expansion of M3 affecting theming, components, motion and typography ([guide](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en)). The official component catalog includes buttons, FAB, icon buttons, segmented buttons, badges, progress, snackbar, navigation components, tabs, checkbox, chips, date/time pickers, menus, radio, sliders, switch, search and text fields ([catalog](https://developer.android.com/develop/ui/compose/components?hl=en)). This provides the inventory seed; actual inclusion must be decided against Loculary usage and product journeys.

**CI status correction:** workflow run [38704035198](https://github.com/Nabouna32/lab/actions/runs/38704035198) is completed **failure**, not pending: lint and typecheck passed, tests failed, build skipped. Next action is to retrieve the failing test logs, fix the real failing assertion/test and rerun. Do not claim CI green and do not merge PR #729 without explicit user approval.

**Implementation plan:** see [M3-EXPRESSIVE-COMPARISON-PLAN.md](./M3-EXPRESSIVE-COMPARISON-PLAN.md). It specifies two preview modes, provenance labels, component audit order, source/version pinning, and a CSS/Web Animations/JavaScript/SVG strategy for motion that CSS alone cannot reproduce. Current status remains plan documented; no claim that the two-mode selector or complete audit is already implemented.

## Checkpoint update — Expressive direction selector wired (2026-10-15)

**Discovery:** `VisualLab.tsx` already defined localized Expressive labels and the CSS module already contained an Expressive screen style, but the selectable directions were only `pixel` and `utility`; the Expressive style was unreachable.

**Change committed:** the Lab screen selector now offers three directions — Pixel / M3, M3 Expressive and Productivity — and displays the matching help text. Added a static regression test to ensure the Expressive option and CSS target remain reachable. This preserves Productivity rather than replacing it.

**Important limitation:** this change unlocks the existing exploratory screen comparison only. It does not yet mean every shared production primitive can be toggled between AndroidX-confirmed baseline and Expressive variants. That component-level mode remains part of the ongoing audit and must be driven by verified AndroidX differences, not a global CSS filter.

**Validation:** the previous run 38704035198 failed on stale assertions; some assertions were updated, and the Expressive-selector regression test was added. The latest commit has not yet been validated by a new green CI run. No merge.

## Checkpoint — official style naming and first component source audit (2026-10-15)

**User correction accepted:** Productivity is not an official Material 3 style and must not be presented as a third official choice. Removed it. The preview now offers **M3 Fidelity** and **M3 Expressive** only. Keep any Loculary-specific layout explorations explicitly labeled as adaptations, never as official Android variants.

**First component audited: Button family.** Official AndroidX source exposes classic `shape` and Expressive `ButtonShapes` overloads, including interaction-driven shape morphing and height-aware helpers for shapes, padding, typography and icon spacing/sizing. Pinned source: https://android.googlesource.com/platform/frameworks/support/%2B/155b9eedc7a9732cce0505b492b2c15f5e70d1b9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt ; API: https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults. Current shared Web button uses a 40 CSS-pixel minimum (not dp), full resting radius and small pressed radius. Next: add a component-specific Fidelity/Expressive control and build the Expressive specimen using verified size-aware behavior; document any Web animation approximation and test both states.

**Validation:** source, CSS and regression-test edits are committed to this branch; no new green CI run has yet validated the latest head. PR #729 remains open/unmerged.

## Checkpoint — Button comparison control added (2026-10-15)

The screen preview no longer offers the non-official Productivity direction. Its official modes are named **M3 Fidelity** and **M3 Expressive**.

**Button component change:** the shared Button gallery now has its own Fidelity/Expressive selector. Fidelity shows the existing 40 CSS-pixel web baseline. Expressive shows a medium-size adaptation from pinned AndroidX ButtonMediumTokens: 56dp container, 24dp leading/trailing space, 16dp top/bottom padding, 24dp icon size, full resting shape and medium pressed shape. Web CSS uses CSS-pixel approximations and radius transition; it is not claimed to be exact Android rendering. Added regression assertions. Source: https://android.googlesource.com/platform/frameworks/support/%2B/4fcf7a5467f9d16be2a3d1e31be0ad96a136a7a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonMediumTokens.kt.

**Scope honesty:** this is the first component-specific comparison only. The selector has not yet been implemented for every component family. Next audit the five button variants / IconButton, then controls and surfaces one family at a time; after each family, update the canonical docs and checkpoint. No latest-head green CI or browser verification is confirmed.

## Checkpoint — IconButton family audited and comparison added (2026-10-15)

**Official source finding:** AndroidX IconButton source documents a typical 24dp icon and 48dp minimum interactive target. Expressive IconButton APIs add size families (extra-small to extra-large), round/square shapes and state-driven shape morphing, including a separate checked shape for toggle buttons. Source: https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt.

**Lab implementation:** added a component-specific Fidelity/Expressive selector and an interactive selected/favorite IconButton. Expressive medium preview maps 56dp to 56 CSS px, uses a 24px icon, full resting shape, medium pressed shape and large selected shape. CSS respects reduced-motion. This is a documented Web approximation, not exact Android parity.

**Gap:** the current shared Web IconButton's visible box is 48 CSS px, while AndroidX composes a minimum touch target around a smaller visual container. This needs a separate fidelity correction and browser geometry test; this Lab-only change does not alter production behavior. Static test added; CI/browser validation still pending.

## Checkpoint — Checkbox component audit (2026-10-15)

**Official source checked:** https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt. The reviewed standard Checkbox API confirms state, enabled behavior, interaction source and semantic color roles, but no distinct default Expressive rendering delta was verified. Added a Checkbox-specific Fidelity/Expressive selector in the Lab; Expressive explicitly explains that the same component is retained because no verified delta was found. Do not invent styling differences.

**Current Web geometry to verify:** 18 CSS-pixel checkbox box, explicit 1px/2px outline treatment, focus ring and 48 CSS-pixel minimum label row. Exact AndroidX geometry/animation comparison remains open. Static test added; CI/browser validation remains pending.

## Source discovery — Switch family (2026-10-15)

Checked official AndroidX Switch.kt: https://android.googlesource.com/platform/frameworks/support/%2B/39bdbe03eef999f4c1352f31a90526adad9245ae/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Switch.kt. No default Expressive-specific rendering difference was verified. AndroidX does specify animated thumb behavior via a Material motion spec. Loculary currently uses a 52×32 CSS-pixel track and 16×16 CSS-pixel thumb with CSS transitions; compare travel, dimensions, easing and interruption against source/runtime before claiming parity. The Lab should expose the two modes but keep identical visuals until evidence supports a change.

**Switch Lab change:** added the per-component Fidelity/Expressive selector. Because official source review found no separate default Expressive appearance, the selector intentionally retains identical visuals and explains the open thumb-motion audit. Static test added. No green CI confirmed.

## Source discovery — TextField family (2026-10-15)

Official AndroidX TextFieldSamples includes Expressive variants: rounded shape + tonal colors for TextField; rounded shape + tonal colors + inside label position for OutlinedTextField. Source: https://android.googlesource.com/platform/frameworks/support/%2B/androidx-main/compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/TextFieldSamples.kt. Loculary's current shared TextField has an external label and extra-small shape, so the Expressive specimen must differ in anatomy, not just radius. Next implementation: opt-in Expressive variant with floating inside label and tonal container while retaining accessible focus, error/disabled roles, numeric/unit behavior and default Fidelity. Browser tests are required.

**TextField change committed:** shared TextField now accepts `variant="fidelity" | "expressive"` with Fidelity as default. Expressive mode uses a floating inside label, extra-large shape token and tonal surface role; Lab now offers a component-specific selector. Existing call sites remain on Fidelity by default. Added static regression assertions. This is a CSS/Web adaptation of AndroidX Expressive sample behavior; browser checks for focus, prefilled values, placeholder, unit suffix, disabled/error, numeric keyboard and long labels are still required.

## Checkpoint — multiline field and Select parity gaps (2026-10-15)

Added per-component Fidelity/Expressive selectors around the current TextArea and Select examples. The controls disclose that these are not finished official Android equivalents: Android M3 uses a multiline TextField/OutlinedTextField rather than a separate TextArea component; the current Select is a native HTML select, not AndroidX ExposedDropdownMenu. No fake Expressive variation was added. A regression test protects this distinction. Next: implement a shared M3 dropdown/menu with keyboard, focus, selection and dismissal behavior, and complete multiline TextField support. Do not claim 100% Android fidelity until these gaps are closed.

## Checkpoint — explicit conformance labels and Snackbar component (2026-10-15)

User requirement: each component must clearly say whether it is implemented, faithfully reproduced from official Android source, a Web-only style imitation, or still incomplete. Prefer searching Android Developers and AndroidX source before calling something an adaptation.

### Classification rule

A React/CSS implementation is never literally an AndroidX-native component. No current Loculary Web component should be labeled “100% Android implementation”. Instead, track source evidence and completion by dimension: API/semantics, visual tokens, interactions/lifecycle, accessibility, responsive behavior, automated tests, and browser verification. “Source-backed Web adaptation” is not the same as “fully conformant”.

### Snackbar discovery and implementation

Sources checked:
- Android Developers guide: https://developer.android.com/develop/ui/compose/components/snackbar
- AndroidX Snackbar.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Snackbar.kt
- AndroidX SnackbarHost.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SnackbarHost.kt

Findings: Android's component is paired with SnackbarHost/SnackbarHostState (usually inside Scaffold); supports a message, one optional action, and optional dismiss affordance; uses tokenized shape/color/elevation/typography; has one-/two-line layouts and a 600 dp max width. The official API says action-bearing snackbars should not self-timeout. No distinct default Expressive Snackbar visual treatment was confirmed in the source reviewed, so the Lab does not invent one.

Changes committed on this branch:
- Added shared src/components/ui/Snackbar.tsx with message, optional action, explicit dismiss, 4-second timeout only when no action exists, and role=status/polite live announcement.
- Added src/components/ui/Snackbar.module.css with theme-token roles and reduced-motion handling.
- Replaced the Lab-only snackbar mock-up with the shared component and added a per-component Fidelity/Expressive selector. The selector intentionally shows parity rather than a made-up Expressive style.
- Added static regression assertions for the component API and disclosed parity gaps.

Status: **source-backed Web adaptation; not 100% Android/AndroidX implementation**. Still missing: shared app-level host/queue and replacement policy, Scaffold-equivalent insets/placement, swipe dismissal, exact AndroidX geometry and motion, focus/assistive-technology checks, and browser tests. No CI/browser run is confirmed yet. The static test file has been edited but its execution is not confirmed.

Next audit order: (1) implement the AndroidX ExposedDropdownMenu-equivalent Web component and keyboard/focus/selection/dismiss behavior; (2) audit multiline TextField anatomy; (3) audit segmented buttons, dialogs, menus, bottom sheets, navigation, and progress components against pinned AndroidX source. Update this checkpoint and ledger after each finding.


## Checkpoint — exposed dropdown source review and Web implementation (2026-10-15)

Sources reviewed before implementation:
- Android Developers menus: https://developer.android.com/develop/ui/compose/components/menu
- AndroidX ExposedDropdownMenuBox API: https://developer.android.com/reference/kotlin/androidx/compose/material3/ExposedDropdownMenuBox.composable
- AndroidX ExposedDropdownMenu source: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ExposedDropdownMenu.kt
- AndroidX MenuTokens: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MenuTokens.kt

Findings: an Android exposed dropdown is a menu anchored to a TextField/OutlinedTextField via ExposedDropdownMenuBox/menuAnchor; it is not a native select. MenuTokens map the container to surfaceContainer, level-2 elevation and extra-small corner shape.

Changes committed:
- Added shared ExposedDropdownMenu.tsx and ExposedDropdownMenu.module.css.
- Replaced the shared Select specimen in Design Lab with the new component.
- Implemented ARIA combobox/listbox/option semantics, active-descendant state, arrow navigation, Home/End, Enter/Space selection, Escape/Tab dismissal, outside-pointer dismissal, disabled options, selected indication, error/helper text and reduced-motion handling.
- Added regression assertions for source attribution and keyboard/accessibility semantics.

Status: **Android-source-informed Web adaptation; not 100% Android/Compose parity**. Still open: true Compose popup placement/edge handling, TextField menu-anchor anatomy, exact token geometry/elevation/motion, screen-reader and browser testing, long/scrolling menus, and editable autocomplete behavior. The component selector's Expressive styling is an informed Web comparison, not proof of a distinct AndroidX Expressive default.

Next: test/fix Snackbar and dropdown, then implement/audit multiline TextField anatomy. Continue with segmented buttons, menus, dialogs, bottom sheets, navigation, and progress indicators against pinned official AndroidX source.


### Snackbar token source follow-up

The official AndroidX SnackbarTokens.kt was inspected: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SnackbarTokens.kt. It specifies inverseSurface container, inverseOnSurface supporting text/icon, inversePrimary action, extraSmall shape, level-3 elevation, Body Medium message text, Label Large action text, 48 dp single-line height, 68 dp two-line height, 600 dp maximum width, 16 dp horizontal spacing and 14 dp vertical spacing. The Web stylesheet now maps the semantic roles and approximate max-width/min-height/vertical padding. CSS pixels, browser font metrics and box layout are not identical to Android dp/Compose measurement; remaining gaps are documented rather than claiming parity.


## Checkpoint — SegmentedButton source audit and semantics (2026-10-15)

Sources reviewed:
- Android Developers segmented button guide: https://developer.android.com/develop/ui/compose/components/segmented-button
- AndroidX SegmentedButton.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SegmentedButton.kt
- AndroidX OutlinedSegmentedButtonTokens.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedSegmentedButtonTokens.kt

Confirmed tokens/behavior: 40 dp minimum row height, 1 dp border, Label Large typography, 18 dp icon, selected Secondary Container / On Secondary Container roles, unselected Outline / On Surface roles, Corner Full base shape. itemShape uses the base shape for a single segment and the outside edges; inner segments are rectangular. The source confirms the existing full outer corners, so those were restored after checking the exact token file rather than guessing a smaller radius.

Changes: shared SegmentedControl now uses radio-group semantics, roving tab stop, ArrowLeft/Right/Up/Down, Home/End, disabled-option skipping and selected state. Regression assertions were updated for these semantics and source-backed shape.

Status: **source-backed Web adaptation for single choice only**. Remaining: multi-choice variant, checked icon and its motion, exact border overlap, complete state colors, browser and screen-reader validation. No claim of 100% AndroidX parity.


## Validation note — CI failure diagnosed, assertions corrected (2026-10-15)

The first CI run associated with this work reached lint and failed in two existing/static assertions: one expected an exact class string that no longer matched the IconButton implementation, and one assumed spacing-free formatting around the Lab direction comparison. Both assertions were updated to match the actual source contract. During the follow-up edits, two groups of test assertions had literal escaped newline sequences; these have now been converted back into real source lines.

Important: the failed run was on an earlier commit and later API-created commits have no fresh workflow run associated with their current HEAD. Therefore **the latest code is not yet validated by CI**, and no browser run has been performed. Do not treat these fixes as passing tests. Next step is to obtain a fresh CI execution and resolve any typecheck/build/test issues before considering these components complete.


## Checkpoint — dp/sp to CSS strategy and first shared dimension tokens (2026-10-15)

Decision: Android dp and sp are source units, not CSS units. Compose converts dp through Android density; Web uses CSS reference pixels/rem and browser zoom/root-size behavior. Numeric matching is a documented visual-reference mapping only, not physical-size equivalence.

Sources:
- AndroidX Dp API: https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/Dp
- Android screen-density guide: https://developer.android.com/training/multiscreen/screendensities
- Android Material 3 theme system: https://developer.android.com/develop/ui/compose/designsystems/material3

Implemented in this checkpoint:
- Added shared CSS reference tokens in src/app/globals.css for spacing, segmented-button height, standard/medium button heights, touch target, Snackbar height/max-width/padding, icon sizes, outline width and Label Large/Body Medium type scale.
- Migrated shared SegmentedControl and Snackbar CSS to consume these tokens.
- Added regression assertions for token existence and component use.
- Documented that e.g. Android 40 dp -> 2.5rem at a default 16px root is only a reference-scale convention, not a density conversion. Keep original dp/sp magnitudes in docs and use rem/semantic tokens in CSS.

Status: **shared Web token layer partially implemented; not 100% Android**. Current commit still requires fresh CI, browser testing, source/version pinning for each token and migration of remaining hardcoded values. The eventual site refactor remains deferred: first complete the Lab's reusable theme/components/tokens and their conformance statuses, then consume that stable system in production.


## Checkpoint — multiline TextField source audit (2026-10-15)

Official AndroidX TextField API/source and samples were reviewed:
- https://developer.android.com/reference/kotlin/androidx/compose/material3/TextField.composable
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/TextField.kt
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/samples/TextFieldSamples.kt

Finding: Compose does not provide a separate Material 3 component named TextArea. Use TextField configured for multiline input (minLines/maxLines and the desired filled/outlined style). Loculary's TextArea remains a Web adaptation/convenience name.

Implemented: TextArea now supports Fidelity/Expressive variants, uses shared spacing/shape/color/type tokens, exposes helper/error copy with aria-describedby, and has disabled/error states. Design Lab now passes the selected variant into the shared component. Its 8rem minimum height is labeled as Loculary Web specimen sizing, not an AndroidX token.

Status: **source-informed Web adaptation; not 100% AndroidX parity**. Remaining: line-count behavior and exact multiline anatomy, supporting text/counter, exact state tokens, browser autofill/IME, text zoom, keyboard/screen-reader checks. CI and browser testing still need to run on the latest branch head.
