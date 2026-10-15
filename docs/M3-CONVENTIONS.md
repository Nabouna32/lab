# Material 3 web conventions for Loculary

**Status:** Canonical working convention.  
**Direction:** Material 3 semantic fidelity with current Pixel / Android visual references.  
**Scope:** Shared React/CSS components and their use across Loculary production and Design Lab.  
**Authority:** Official Android Developers / Material guidance defines design semantics. Official Material Web documentation/tokens are used for web-specific component details where relevant. WCAG and native web platform semantics govern web accessibility. A React component in this repository is a Loculary implementation, not an official Android Compose component.

## 1. Source-of-truth hierarchy

1. Official Android Developers / Material 3 docs for component purpose, variants, semantic roles, states, shapes and intended behavior.
2. Official Material Web documentation and design tokens for web-specific implementation details when available.
3. WCAG and HTML/ARIA specifications for web semantics, keyboard and assistive-technology behavior.
4. Loculary's accepted design contract and documented product decisions for adaptations (e.g. seed color, global rounding-degree control, layout and density).
5. Actual source inspection, automated tests and browser/runtime checks to determine what Loculary really does.

Never label an unverified assumption as an official M3 rule. Compose dp values, APIs and interaction examples cannot be copied literally into CSS/React without a deliberate web adaptation. Record any intentional deviation and why it exists.

## 2. Design direction and color system

- Use the validated blue seed `#4285F4` with Material Color Utilities **Fidelity** for seed-derived semantic interface roles.
- Keep Material Color Utilities **Rainbow** for intentional category identity only; it must not become a second semantic theme or decorate general interface surfaces.
- Use semantic role tokens rather than per-component hardcoded palette values. A foreground must be chosen for its actual background/container role (e.g. `on-primary-container` on `primary-container`).
- Default filled-tonal buttons use `secondary-container` and `on-secondary-container`, unless a different documented variant is explicitly intended.
- Keep success, warning, error and informational status semantics independent of brand/category accents. Status must not be communicated by color alone.
- Test resolved light and dark colors, opacity blends, disabled states, focus indicators, borders and selected states. Token names or static assertions alone do not prove rendered contrast.
- The Lab's test palette must flow through the same semantic component variables as production. It may override tokens for preview purposes, but must not require one-off component rewrites.

Official references:
- [Material 3 theming and color roles](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [Material Web](https://material-web.dev/)
- [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## 3. Typography

- Roboto is Loculary's chosen default interface typeface.
- Define a deliberate semantic scale for display/headline/title/body/label/metadata; a product need not use every official M3 text style.
- Use consistent line-height and weight by role. Avoid arbitrary one-off font sizes and weights where a shared role is suitable.
- Check French and English long strings, narrow layouts, text scaling and 200% zoom. Android typography sizes are a reference, not a claim that CSS pixels and Android sp are interchangeable.

Reference: [Material 3 typography and theming](https://developer.android.com/develop/ui/compose/designsystems/material3).

## 4. Shape convention and global rounding degree

### Semantic scale

Use shared tokens mapped to component roles, with a vocabulary corresponding to M3's semantic shape scale: `none`, `extra-small`, `small`, `medium`, `large`, `extra-large` and `full`. The current web baseline uses the first-party Material Web system-shape token values in CSS pixels; these values are not a direct conversion from Android dp. Source: [Material Web system shape tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-sys-shape.scss). A Loculary-specific rounding-degree preview control is now implemented in Design Lab for semantic-token-based shared components and token-driven compositions. It scales the semantic shape values from square (0%) to the Material Web baseline (100%); legacy fixed-radius mockups still need migration, so global coverage is not complete.

Buttons, fields, cards, chips, menus/popovers, dialogs and navigation surfaces must use role-based tokens rather than independent arbitrary radii. Do not apply maximum rounding to every component just because the visual direction is Pixel-inspired.

### Loculary global rounding-degree control

The requested global rounding-degree control is a **Loculary-specific customization**, not an official Android setting. It may adjust the shared semantic scale coherently, but must preserve the intent of explicit `none` and `full` shapes and avoid distorting circular controls, pills, slider thumbs or nested geometry.

- Keep the degree control separate from the semantic token names.
- Define the default degree and its mapping before implementation.
- Apply it through the shared token layer, not by scattering `calc()` expressions across component CSS.
- Allow only documented component-specific exceptions where geometry or accessibility requires them.
- Validate production and Lab in both themes and across compact and wide viewports.

Reference: [Material 3 shapes](https://developer.android.com/develop/ui/compose/designsystems/material3).

## 5. Density and interactive target sizes

- Default to normal M3 density. Compact layouts are allowed only when the product context justifies them and remain usable.
- Android's 48 dp touch-target guidance is not numerically identical to 48 CSS px. Loculary may choose approximately 48 CSS px for important mobile controls as a product convention, but must document and test the web implementation.
- Check target overlap, spacing, zoom/reflow and pointer/touch use. Do not shrink hit areas merely to make the screen look denser.
- A native input may have a smaller visible glyph/track while its interactive wrapper preserves a larger target.

References: [Android accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

## 6. Shared component contracts

### Buttons and icon buttons

- Map intent to one canonical visual variant: filled, elevated, filled-tonal, outlined or text.
- Keep legacy aliases only as documented compatibility mappings; do not treat app-specific names such as `danger`, `secondary` or `ghost` as official M3 variant names.
- Use actual buttons for actions and links for navigation. Icon-only buttons require an accessible name. Toggle icon buttons expose selected state; momentary actions must not pretend to be toggles.
- Verify hover, focus-visible, pressed, selected, disabled and loading states. Avoid whole-element brightness/opacity filters that dim foreground content together with the background.

Reference: [Material 3 buttons](https://developer.android.com/develop/ui/compose/components/button), [Icon buttons](https://developer.android.com/develop/ui/compose/components/icon-button). The current pinned AndroidX token sources for variant-specific disabled/selected roles are listed in section 12. When AndroidX and Material Web values differ, do not blend them silently: follow AndroidX for Android-M3 component roles and label any CSS/web adaptation separately.

### Checkbox, switch and mutually exclusive selection

- Checkbox: independent on/off selection; use native checkbox semantics and a connected accessible label.
- Switch: a true binary setting; expose switch role and checked state. Do not use it for multi-select or mutually exclusive options.
- Radio group / segmented control: mutually exclusive choices; select the control pattern that fits the number of options and available space.
- Disabled styling must be component- and state-specific; never apply one global opacity rule. Use the version-pinned first-party Material Web token files at the end of this document for Checkbox, Switch and text fields. These are Material Web references, not automatic Android Compose rules.

References: [Checkboxes](https://developer.android.com/develop/ui/compose/components/checkbox), [Switches](https://developer.android.com/develop/ui/compose/components/switch), [Segmented buttons](https://developer.android.com/develop/ui/compose/components/segmented-button), [Material Web checkbox tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-checkbox.scss), [Material Web switch tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-switch.scss).

### Slider

- Use a slider for a numeric range where direct manipulation is useful, not for a small list of discrete choices.
- Loculary's shared `Slider` uses a native `input[type="range"]` to retain browser keyboard and form semantics.
- Provide a visible label and value; use `aria-valuetext` when the displayed value needs a human-readable representation; associate any description with the input.
- Define min/max/step correctly, show active/inactive track roles, visible focus and a sufficiently large interaction area. Verify thumb alignment separately in Chromium, Firefox and mobile browsers.
- Disabled styling uses semantic disabled tokens rather than one opacity applied to the whole control.

Reference: [Material 3 sliders](https://developer.android.com/develop/ui/compose/components/slider).

### Progress indicators

- Distinguish **determinate** progress (a real measurable completion value) from **indeterminate** progress (work is happening but completion cannot be measured).
- Never invent a percentage for unknown-duration work.
- Loculary's shared `ProgressIndicator` is a linear web adaptation with `role="progressbar"`, an accessible label and `aria-valuenow` only when a determinate value exists.
- Respect `prefers-reduced-motion`; preserve a meaningful indication of activity when animation is reduced.
- A circular version is not required until a real product flow needs it.

Reference: [Material 3 progress indicators](https://developer.android.com/develop/ui/compose/components/progress).

### Text fields, select and validation

- Prefer native web semantics where they satisfy the interaction. Do not replace a native select solely for cosmetic reasons.
- Provide persistent visible labels; placeholders are not a substitute. Associate helper/error text with the field, expose invalid state where appropriate and preserve keyboard, autofill and mobile input behavior.
- Avoid repeated assertive announcements for routine validation; choose alert/live-region behavior according to urgency.

Reference: [Material 3 text input](https://developer.android.com/develop/ui/compose/text/user-input), plus HTML/ARIA and WCAG guidance.

### Cards, panels and result surfaces

- Elevated, filled and outlined cards are meaningful variants, not interchangeable decorations.
- Use neutral surface/container roles for mixed-content result panels; use colored containers only when all foreground content can use a matching semantic on-role.
- Avoid redundant card-on-card nesting and universal shadows. Define responsibilities for Card, Panel and ResultPanel to avoid overlapping abstractions.

Reference: [Material 3 cards](https://developer.android.com/develop/ui/compose/components/card).

### Snackbar, dialog, tooltip and other candidates

- Add shared feedback/dialog/tooltip components only when actual product flows justify them.
- Snackbar: brief feedback when inline feedback is insufficient; do not hide important errors in a transient message.
- Dialog: use for a consequential choice; web adaptation must manage focus, dismissal, Escape, accessible naming and return focus.
- Tooltip: supplementary content only, never the sole label for an essential action.
- Radio group, tabs, drawer, bottom sheet and FAB remain candidates, not mandatory catalogue items. Map them to real journeys before implementing.

References: [Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar), [Dialog](https://developer.android.com/develop/ui/compose/components/dialog), [Tooltip](https://developer.android.com/develop/ui/compose/components/tooltip).

## 7. Motion and interaction states

- Use shared motion tokens categorized by purpose; durations/curves for web must be sourced or explicitly recorded as Loculary choices rather than guessed from Compose constants.
- Motion should communicate cause/effect and hierarchy, not decorate every element.
- Honor `prefers-reduced-motion: reduce`; essential state changes must remain understandable without animation.
- For every component, review enabled, hover, focus-visible, pressed, selected, disabled, loading, success and error states as applicable.
- Keep visible keyboard focus; verify focus order, focus restoration, Escape behavior and screen-reader announcements in the actual browser.

Reference: [Material 3 design systems](https://developer.android.com/develop/ui/compose/designsystems/material3), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## 8. Design Lab contract

- The Lab must use the same shared production primitives and semantic component contracts.
- Its light/dark mode must follow the application's resolved theme. Do not add an independent Lab theme switch when the global header already owns the setting.
- Seed/palette, viewport and test values may remain experimental Lab controls.
- A test preview may force component state (e.g. visible focus or disabled state) deliberately, but that must be identified as a state demonstration rather than an accidental live-state claim.
- Keep component-specific CSS variables only as explicit token bridges for preview palettes. Avoid a parallel component implementation in Lab CSS.
- Every displayed component should be tested in at least light/dark, enabled/disabled and relevant interaction states before being declared conformant.

## 9. Verification and acceptance gate

For each component record:
1. Official source(s) and the specific rule being applied.
2. Existing Loculary source/call sites and evidence.
3. Canonical shared API/semantic tokens.
4. Intentional Loculary adaptation or deviation.
5. Automated regression tests.
6. Browser verification: theme, viewport, keyboard, pointer/touch, focus, disabled/selected states, reduced motion and localized strings.
7. Known limitations and next step.

Before declaring the design system conformant:
- [ ] Lint, typecheck, tests and build pass.
- [ ] Light and dark theme rendered checks pass for representative production routes.
- [ ] Mobile, tablet, desktop and 200% zoom/reflow checked.
- [ ] Keyboard-only operation and focus restoration checked.
- [ ] Accessible names, roles, values, descriptions and status announcements checked.
- [ ] Contrast checked for actual foreground/background blends, including disabled, focus, border and status states.
- [ ] Reduced-motion behavior checked.
- [ ] Remaining deviations are explicitly documented as product decisions.

**Current limitation:** this convention documents the intended contract and source-review findings. It does not by itself prove the live site passes the acceptance gate.
## 10. Evidence labels — mandatory for future audit entries

Use these labels whenever a finding, token value or implementation rule is recorded. “Official” must always identify which official source and what it actually establishes.

| Label | Meaning | May be described as Android-confirmed? |
|---|---|---|
| [ANDROID-M3] | Directly stated or shown in an official Android Developers / Material 3 source, with a link to the specific component guidance. | Yes, but only for the exact statement supported by that source. |
| [MATERIAL-WEB] | Directly supported by first-party Material Web documentation or source tokens for the web implementation. | No. It is official Material Web guidance, not automatically an Android Compose rule. |
| [WEB-STANDARD] | Supported by HTML, ARIA, WCAG or another named web standard. | No. It governs web implementation/accessibility. |
| [LOCULARY-DECISION] | A deliberate product/design choice (seed, chosen font, CSS size, density, global radius control, palette mapping). | No. |
| [SOURCE-OBSERVED] | Found in repository source or an automated test. This proves only what the code/test contains, not conformance. | No. |
| [RUNTIME-VERIFIED] | Actually exercised in a named browser/device/viewport/theme and recorded with evidence. | No. This proves behavior in the tested environment, not universal conformance. |
| [OPEN] | Unverified, ambiguous, conflicting or not yet checked against the authoritative source. | No. |

### Important distinctions for the current control port

- [ANDROID-M3] Slider purpose: choose a value from a range; Material documents continuous/discrete behavior and optional track/thumb/tick-mark features. Source: [Android Slider](https://developer.android.com/develop/ui/compose/components/slider).
- [ANDROID-M3] Progress purpose: distinguish determinate progress from indeterminate activity; linear and circular forms are documented. Source: [Android progress indicators](https://developer.android.com/develop/ui/compose/components/progress).
- [WEB-STANDARD] The shared slider uses a native HTML range input; its associated visible label and native keyboard semantics come from HTML, with aria-valuetext adding a human-readable value description.
- [LOCULARY-DECISION] The slider's 48 CSS-pixel control height is a web sizing choice. It is not an official Android requirement and is not a claim that 48 CSS px equals 48 dp.
- [MATERIAL-WEB] Disabled treatment is component- and state-specific; do not generalize one opacity to every disabled control. The first-party Material Web token source for [Checkbox](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-checkbox.scss) specifies 38% opacity for the selected disabled container and icon, 38% for the unselected disabled outline/container, a 2px unselected outline, and no outline for selected disabled state. The [Switch token source](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-switch.scss) distinguishes a 12% disabled track, a selected disabled handle with surface color at 100% opacity, and an unselected disabled handle at 38%; its component implementation applies disabled track opacity to the track layers. These are first-party Material Web values, not universal Android Compose rules. Rendered appearance still requires verification.
- [MATERIAL-WEB] For outlined text fields, the [outlined text-field tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-outlined-text-field.scss) specify 38% input/label/supporting text opacity and 12% outline opacity. The [filled text-field tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-filled-text-field.scss) specify 38% input/label opacity and 4% disabled container opacity. Loculary's current text fields/selects are outlined-like adaptations, not literal Material Web components.
- [SOURCE-OBSERVED] The progress component omits aria-valuenow when no finite value is supplied. That is the implementation's current behavior, not by itself proof of a fully accessible progress pattern.
- [OPEN] Chromium, Firefox, mobile touch, keyboard and assistive-technology behavior remain unverified until a recorded run is completed.

Never turn a recommendation, visual resemblance, token name or passing static assertion into an “official Android requirement.” If an official source does not establish the exact pixel value, opacity, radius, animation curve or interaction behavior, mark that detail as a Loculary choice or open question.

## 11. New source-backed form and shape corrections

- [MATERIAL-WEB] The first-party [system shape tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-sys-shape.scss) define none 0px, extra-small 4px, small 8px, medium 12px, large 16px, extra-large 28px and full 9999px for the web implementation. Shared CSS variables now expose this semantic scale. The values are Material Web CSS-pixel tokens, not Android dp-to-CSS-pixel conversions.
- [MATERIAL-WEB] The first-party [checkbox tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-checkbox.scss) define an 18px checkbox container, 2px container shape and 18px icon, plus a 40px state layer. Loculary's shared checkbox now uses the 18px container, 2px shape and 18px check icon while its 48px label wrapper is a [LOCULARY-DECISION] touch-target adaptation.
- [MATERIAL-WEB] Outlined text-field tokens define extra-small container shape, 38% disabled input/label/supporting text and 12% disabled outline. Filled text-field tokens define 38% disabled text and 4% disabled container opacity. Loculary TextField, TextArea and native Select are outlined-like web adaptations; their disabled styles now use per-part semantic colors rather than opacity on the whole control, and their corners now use the shared extra-small shape token.
- [SOURCE-OBSERVED → source edit made] Design Lab now has a rounding-degree preview control (0–100%) that overrides the semantic shape tokens for shared components and token-driven compositions. This is a Loculary-specific preview, not an Android setting. [OPEN] Many legacy Lab mockups and tool-local containers still have fixed radii; do not call the control globally complete until those are mapped or explicitly exempted.
- [MATERIAL-WEB] First-party [card tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-elevated-card.scss), [filled-card tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-filled-card.scss) and [outlined-card tokens](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-outlined-card.scss) all use the medium shape. Their container roles differ: elevated uses surface-container-low with level-1 elevation; filled uses surface-container-highest with no elevation; outlined uses surface with outline-variant and no elevation. Shared Card now uses the matching surface roles, medium shape and a visible keyboard focus ring for linked cards. Browser appearance remains open.
- [LOCULARY-DECISION] Panel and ResultPanel are Loculary-specific compositions, not named official M3 components. They use the medium shape token for consistency; that mapping is a product convention, not an Android requirement.
- [ANDROID-M3] Official Android guidance describes segmented buttons as a compact set of selectable options; it does not establish a second description line inside each segment. See [Android segmented buttons](https://developer.android.com/develop/ui/compose/components/segmented-button).
- [SOURCE-OBSERVED → source edit made] Removed the optional per-segment description from the shared SegmentedControl API because it was a Loculary extension, not an M3 segment feature. The Percentage and Video Bitrate tools now show the selected mode description outside the control; mobile native Select options retain their explanatory text.
- [LOCULARY-DECISION] Segment labels are single-line to avoid inconsistent button height/wrapping. Internal segment corner rounding uses the shared small-shape token; exact segmented-button geometry and keyboard interaction still need comparison with the official Android pattern and web accessibility expectations.
- [MATERIAL-WEB] The first-party [outlined text-field](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-outlined-text-field.scss) and [outlined select](https://github.com/material-components/material-web/blob/5a95667bb70ca5be8785b762fb0303737c3b4ac1/tokens/versions/latest/sass/_md-comp-outlined-select.scss) tokens specify a 56px one-line field container baseline. Shared TextField and Select now use min-height 56px; TextArea remains content/row driven.
- [WEB-STANDARD] TextField now preserves an explicit HTML step value and otherwise defaults number inputs to step="any". Previously, the spread of an undefined step prop could override the intended decimal default. This is an HTML form behavior fix, not an M3 token.
- [SOURCE-OBSERVED → source edit made] Design Lab examples must use independent state unless they intentionally demonstrate linked behavior. The raw radio-group preview and the shared segmented-control preview previously reused the same state value, so interacting with one changed the other. They now have separate state variables and a static regression assertion. This is a Lab interaction fix, not an M3 rule.

## 12. AndroidX button and icon-button state tokens (authoritative for this audit)

The following values come from the official AndroidX Compose Material 3 token sources at commit [b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7](https://github.com/androidx/androidx/tree/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7). They are not interchangeable across variants:

- [ANDROID-M3] **Filled button:** disabled container = on-surface at 10% opacity; disabled label/icon = on-surface-variant at 38%. Source: [FilledButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledButtonTokens.kt).
- [ANDROID-M3] **Elevated button:** disabled container = on-surface at 10%; disabled label/icon = on-surface-variant at 38%; disabled elevation is level 0. Source: [ElevatedButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt).
- [ANDROID-M3] **Filled-tonal button:** disabled container = on-surface at 12%; disabled label/icon = on-surface at 38%. Source: [FilledTonalButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt).
- [ANDROID-M3] **Outlined button:** disabled outline = outline-variant at 10%; disabled label/icon = on-surface-variant at 38%. Source: [OutlinedButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt).
- [ANDROID-M3] **Text button:** disabled label/icon = on-surface-variant at 38%. Source: [TextButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt).
- [ANDROID-M3] **Standard icon button:** selected icon uses primary without adding a container; disabled icon uses on-surface at 38%. Source: [IconButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/IconButtonTokens.kt).
- [ANDROID-M3] **Filled and filled-tonal icon buttons:** disabled container = on-surface at 10%; disabled icon = on-surface at 38%. Filled-tonal selected state uses secondary container color role (secondary) and on-secondary content. Sources: [FilledIconButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledIconButtonTokens.kt) and [FilledTonalIconButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt).
- [ANDROID-M3] **Outlined icon button:** disabled icon = on-surface at 38%, disabled outline = outline-variant at 38%; selected state uses inverse-surface and inverse-on-surface roles. Source: [OutlinedIconButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedIconButtonTokens.kt).

The implementation now encodes these per-variant roles. The destructive Button variant is a Loculary extension and is explicitly not an official M3 button variant. CSS-pixel dimensions and browser state-layer blending remain web adaptations; visual conformance still requires browser checks.
