# Material 3 web conventions for Loculary

**Status:** Canonical working convention.  
**Direction:** Material 3 semantic fidelity with current Pixel / Android visual references.  
**Scope:** Shared React/CSS components and their use across Loculary production and Design Lab.  
**Authority:** Official Android Developers / Material guidance defines design semantics. Official Material Web documentation/tokens are used for web-specific component details where relevant. WCAG and native web platform semantics govern web accessibility. A React component in this repository is a Loculary implementation, not an official Android Compose component.

## 1. Source-of-truth hierarchy

1. Official Android Developers guidance and the version-pinned AndroidX Compose Material 3 token/source implementation for component purpose, variants, semantic roles, states, shapes and intended behavior. For this project's Android-M3 fidelity target, AndroidX tokens are the primary source for component colors, states and geometry.
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

Reference: [Material 3 buttons](https://developer.android.com/develop/ui/compose/components/button), [Icon buttons](https://developer.android.com/develop/ui/compose/components/icon-button). The current pinned AndroidX token sources for variant-specific disabled/selected roles are listed in section 12. When AndroidX and Material Web values differ, follow AndroidX for Android-M3 component roles and document any CSS/web adaptation separately.

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
- [ANDROID-M3] Disabled treatment is component- and state-specific. AndroidX CheckboxTokens.kt confirms 38% selected disabled container/checkmark and unselected outline, with a 2dp unselected outline. AndroidX SwitchTokens.kt confirms 12% disabled track opacity, selected disabled handle in surface color, and unselected disabled handle at 38%. See the pinned AndroidX links in section 13. Material Web is the CSS-side cross-check; rendered appearance still requires verification.
- [ANDROID-M3] AndroidX OutlinedTextFieldTokens.kt specifies 38% input/label/supporting text and 12% outline opacity; FilledTextFieldTokens.kt specifies 38% text and 4% disabled container opacity. See the pinned AndroidX links in section 13. Material Web is the CSS-side cross-check. Loculary's TextField, TextArea and native Select are outlined-like web adaptations, not literal Compose components.
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
- [ANDROID-M3] AndroidX [OutlinedSegmentedButtonTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedSegmentedButtonTokens.kt) specifies 40dp height, full outer shape, 1dp outline, secondary-container selected fill, on-secondary-container selected content, and 12% on-surface disabled outline / 38% on-surface disabled content. AndroidX SegmentedButtonDefaults.itemShape uses rounded outer ends and rectangular interior segments. The web primitive now follows these roles; its CSS-pixel height remains a web adaptation.
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


## 13. AndroidX cross-check for shapes, fields, cards and disabled controls

The pinned AndroidX Compose Material 3 sources below corroborate component-specific rules. AndroidX is authoritative for Android-M3 semantics; Material Web is a CSS-side cross-check. Never silently blend conflicting values.

- [ANDROID-M3] [CheckboxTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/CheckboxTokens.kt): 18dp container, 2dp shape, 38% disabled selected container/checkmark and unselected outline, 2dp unselected outline.
- [ANDROID-M3] [SwitchTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SwitchTokens.kt): 12% disabled track opacity; selected disabled handle uses surface, unselected disabled handle uses on-surface at 38%.
- [ANDROID-M3] [OutlinedTextFieldTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedTextFieldTokens.kt): extra-small shape, 38% disabled input/label/supporting text and 12% disabled outline.
- [ANDROID-M3] [FilledTextFieldTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTextFieldTokens.kt): extra-small-top shape, 38% disabled text and 4% disabled container opacity.
- [ANDROID-M3] [ShapeTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt): extra-small 4dp, small 8dp, medium 12dp, large 16dp, extra-large 28dp, full circle, and none 0dp.
- [ANDROID-M3] [ButtonSmallTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonSmallTokens.kt) plus [Button.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt): default button shape is full; pressed shape token is small. Loculary's shared Button now switches to the semantic small token on active press. This is a source-backed shape-role mapping, but CSS interaction timing/animation and the rendered transition still need browser verification.
- [ANDROID-M3] [ElevatedCardTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedCardTokens.kt), [FilledCardTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledCardTokens.kt) and [OutlinedCardTokens.kt](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedCardTokens.kt): medium shape across card variants; elevated uses surface-container-low, filled uses surface-container-highest, outlined uses surface and outline-variant.
- [SOURCE-OBSERVED → source edit made] Lab examples overriding shared component tokens use component-specific disabled roles. Both Checkbox samples expose the rounding-degree control through the semantic 2px web shape token. Their actual contrast in light/dark still needs browser validation.

## 14. Current audit status and limits

- [SOURCE-OBSERVED] Static source and test assertions can confirm that a component references a token or state, but cannot prove final computed color, contrast, layout, focus visibility, browser input behavior or animation quality.
- [LOCULARY-DECISION] The global rounding-degree control is a Lab preview customization, not an Android setting. It affects semantic-token-based components; legacy fixed-radius mockups still need migration.
- [OPEN] The Pixel direction mockup has fixed radii in its primary button, calculator field and result/card surfaces. Map those to full, extra-small and medium semantic roles; keep device-frame and search/icon-specific shape roles open until official mappings are verified.
- [OPEN] Run lint, typecheck, tests and build against the current PR head; then perform browser checks in light/dark, keyboard/pointer, mobile and reduced-motion modes. Do not call the audit complete before these gates pass.

## 15. Slider source comparison: classic M3, newer AndroidX and Pixel fidelity

**Decision correction (2026-10-15):** Do not reject a newer AndroidX/Expressive token solely because the user disliked washed-out colors or under-defined button contours. Those visual complaints are not a blanket rejection of updated geometry or motion. The target is **current Pixel / Android Material fidelity**, with the Loculary-selected Fidelity seed palette and clearly defined, source-backed contours. A component's geometry, color roles, contrast, and motion must be evaluated independently.

- [ANDROID-M3 / official overview] [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en) describes M3 Expressive as an expansion affecting theming, components, motion and typography, and says it complements the Android 16 visual style. This confirms it is broader than a color palette alone; it does **not** mean every Expressive color treatment or every new component token must be adopted blindly.
- [ANDROIDX SOURCE OBSERVATION — classic comparison] [SliderTokens.kt at AOSP revision 4d53400eca9f3ac90c3a3f6cffcbc5bf492ec536](https://android.googlesource.com/platform/frameworks/support/+/4d53400eca9f3ac90c3a3f6cffcbc5bf492ec536/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SliderTokens.kt) records a 4dp track and 20×20dp round thumb.
- [ANDROIDX SOURCE OBSERVATION — newer comparison] [SliderTokens.kt at AndroidX revision b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7](https://github.com/androidx/androidx/blob/b4c15a8e351e6cfa93e90cce2cfbd0dbbe4805a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SliderTokens.kt) records a 16dp track and 4×44dp pill handle. These are two versioned source observations, not proof by themselves that one is the correct choice for every current Pixel surface.
- [LOCULARY-ADAPTATION] The shared web Slider currently uses a 4 CSS-pixel track and 20×20 CSS-pixel round thumb. CSS px are not Android dp. This is a provisional source choice pending comparison against the intended current Pixel/Android 16 reference, not a final rejection of newer official geometry.
- [OPEN] Compare the current AndroidX component implementation and official Android/Pixel reference behavior before locking dimensions. Record source revision and target release when the decision is made. Review visible track/contour, focus, hover/pressed states, thumb alignment, optional tick marks and value indicator, disabled state, light/dark, reduced motion and mobile browsers.

## 16. Linear progress indicator source comparison and motion fidelity

- [ANDROID-M3] [Official progress-indicator guidance](https://developer.android.com/develop/ui/compose/components/progress?hl=en) distinguishes determinate progress from continuously animated indeterminate progress, and linear from circular forms. Use determinate progress only when the operation provides a real completion value.
- [ANDROIDX SOURCE OBSERVATION — classic] The classic AndroidX LinearProgressIndicator token source used in the AOSP history defines 4dp active/track thickness, primary active indicator, primary-container track and square ends: [official AOSP token history](https://android.googlesource.com/platform/frameworks/support/%2B/0d9d96563ae8cc6596912d5d33a55faa520e83c1%5E2..0d9d96563ae8cc6596912d5d33a55faa520e83c1/).
- [ANDROIDX SOURCE OBSERVATION — newer] The later unified ProgressIndicatorTokens use different geometry and track-role values. Do not select either generation by the label “Expressive” alone; compare it to the chosen current Pixel/Android target and record the source revision.
- [SOURCE-OBSERVED] The shared web ProgressIndicator currently uses a 4 CSS-pixel track, primary active indicator, primary-container track and square ends. This remains a provisional source choice until the current Pixel/Android target comparison is complete.
- [LOCULARY-ADAPTATION / OPEN] Its indeterminate mode is currently a single moving segment, not yet demonstrated to match AndroidX's exact segment choreography, timing and easing. Reduced-motion striping is a web accessibility adaptation. The Lab's circular progress and skeleton examples are local CSS demonstrations, not the shared production components and not proof of Android parity.
- [OPEN] Implement a shared circular progress indicator with the appropriate rotating/arc animation only after matching the official AndroidX source for the chosen target. Verify animation timing/easing, determinate updates, reduced motion, announcements, and light/dark rendering.

## 17. Material 3 Expressive and Pixel direction — corrected interpretation

The selected direction is **not** “old/classic tokens only.” It is current Pixel/Android Material fidelity, with the chosen seed-derived **Material Color Utilities Fidelity** semantic palette and explicit control over user-customizable color and rounding. M3 Expressive is an official extension that includes updated components and motion as well as theming; it must be evaluated component by component.

- Do not accept washed-out colors, weak contrast or missing contours just because a screenshot or token family is labelled Expressive.
- Do not reject a newer official shape, dimension or animation merely because it first appeared in an Expressive source.
- For each component, compare the intended Pixel/Android release, official Android Developers guidance, and version-pinned AndroidX implementation. Explain any differences instead of merging incompatible generations of tokens.
- The user's color and rounding controls are Loculary product features, not official Android settings. They must alter the shared semantic tokens used by production and the Lab; they must not erase required borders, selected/disabled distinctions, contrast or component-specific geometry.
- Labels for evidence: `[ANDROID-M3]`, `[ANDROIDX SOURCE OBSERVATION]`, `[WEB STANDARD]`, `[LOCULARY-ADAPTATION]`, `[RUNTIME-VERIFIED]`, and `[OPEN]`. Never claim 100% fidelity from a static screenshot or source-name match alone.


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


## Expressive comparison mode (2026-10-15)

The Design Lab should expose two evidence-backed comparison modes: **Pixel / M3 baseline** and **M3 Expressive**. This is a preview choice, not a silent production-wide migration. Expressive is an official expansion of M3 affecting components, theming, motion and typography ([Android Developers](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en)); it is not a synonym for pastel colors, weak outlines or pill-shaped everything. Change only the properties supported by the chosen version-pinned AndroidX sources. Where no delta is verified, do not invent one. See [M3 Expressive comparison plan](./M3-EXPRESSIVE-COMPARISON-PLAN.md) for inventory, provenance labels, CSS/JS motion strategy and validation requirements.

**Motion implementation boundary:** CSS is suitable for simple transitions/keyframes. Multi-stage, interruptible or state-machine-driven Compose motion may require Web Animations API, JavaScript sequencing/state, or SVG stroke animation. Every adaptation must document the Android source behavior, Web counterpart, reduced-motion fallback and browser test. Never claim exact Android parity from a static CSS match.

## Lab direction selector: Expressive is now reachable (2026-10-15)

Source inspection found that the Lab already had localized `expressiveDirection` labels and CSS rules for `data-direction="expressive"`, but the selector only exposed `pixel` and `utility`. The Expressive direction was therefore unreachable. The selector now exposes three exploratory directions: Pixel / M3, M3 Expressive, and Productivity, with matching localized help text. This is a screen-level design-direction comparison, **not yet proof that every shared production component has a component-by-component Expressive mode**. The next step is to add evidence-backed variants to the shared component showcase where AndroidX sources establish actual deltas; do not confuse the mock screen's stylistic exploration with official component parity.

## Naming correction — official style choices only (2026-10-15)

Removed the **Productivity** direction from Design Lab. It was a Loculary-authored layout adaptation, not an official Material 3 variant, and must not be presented alongside official styles as if it were one. The screen-level preview now uses **M3 Fidelity** and **M3 Expressive** only. This selector is still a screen-level illustration; it is not proof that every shared component has been audited or switched. The long-term component library must offer both versions per component, with component-specific source evidence and no invented Expressive deltas.

### Component audit 01 — Buttons (official API finding)

AndroidX Compose Material 3 exposes a classic Button API with a single `shape` and a separate Expressive API overload accepting `ButtonShapes`, which morphs between normal and pressed shapes. `ButtonDefaults.shapesFor(buttonHeight)`, `contentPaddingFor(buttonHeight)`, `textStyleFor(buttonHeight)`, `iconSizeFor(buttonHeight)` and `iconSpacingFor(buttonHeight)` provide size-aware Expressive recommendations. Source: [AndroidX Button.kt](https://android.googlesource.com/platform/frameworks/support/%2B/155b9eedc7a9732cce0505b492b2c15f5e70d1b9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt) (pinned commit) and [ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults). The current shared Web Button has a 40 CSS-pixel minimum and a full-to-small pressed-radius transition; that is a Web baseline, not a dp equivalence. A real Expressive button specimen must exercise the size-aware variant and document its CSS/JS adaptation. Do not merely recolor it.

### Button family — first component specimen implemented (2026-10-15)

Design Lab now has a component-specific **M3 Fidelity / M3 Expressive** selector in the shared Button gallery. Fidelity keeps the shared 40 CSS-pixel baseline. Expressive uses the AndroidX medium-button token set as a documented Web approximation: 56 CSS px minimum height, 24 CSS px horizontal padding, 16 CSS px vertical padding, 16/24 CSS typography, and a medium corner while pressed; the resting shape remains full. Official token source: [ButtonMediumTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/4fcf7a5467f9d16be2a3d1e31be0ad96a136a7a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonMediumTokens.kt). AndroidX uses dp and platform animation; the Lab uses CSS px and a CSS radius transition, so this is a source-grounded Web adaptation, not a claim of pixel-perfect Android rendering. The selected version currently affects the Button gallery and the screen-level illustrative preview; other component families remain to be audited and must not be presumed Expressive-complete.

### IconButton family — second component specimen implemented (2026-10-15)

The shared-component gallery now provides a separate **M3 Fidelity / M3 Expressive** selector for IconButton, including a real selected/toggle sample. AndroidX source confirms the standard IconButton's typical icon is 24dp and minimum interactive target is 48dp; Expressive APIs add round/square shapes and size families (extra-small through extra-large), with shape morphing for pressed and selected states. Source: [pinned AndroidX IconButton.kt](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt). The Lab's Expressive medium specimen uses a 56 CSS-pixel box, 24 CSS-pixel icon, full resting shape, medium pressed shape and large selected shape. This is a Web approximation of AndroidX token roles, not dp equivalence. Current fidelity component uses a 48 CSS-pixel button box; Android's distinction between the minimum touch target and visual container remains a separate audit item before claiming full parity.

### Checkbox family — third component audited (2026-10-15)

The Design Lab now exposes a component-specific Fidelity/Expressive selector for Checkbox. Inspection of the official AndroidX [Checkbox.kt source](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt) confirms the standard checkbox API uses checked state, enabled state, interaction source and semantic color roles; the source consulted did not establish a distinct default Expressive visual variant for Checkbox. Therefore both selector states intentionally render the same shared component and the Expressive state explains that no delta was verified. Do not invent a larger checkbox or a different shape just to force a visual difference. Existing Web implementation uses an 18 CSS-pixel box, 1px outline (2px unchecked-disabled outline), semantic foreground/background roles, a visible focus ring and a 48px minimum label-row height; these Web values need separate geometry comparison against AndroidX dimensions before claiming full fidelity.

### Switch family — source discovery (2026-10-15)

Reviewed official [AndroidX Switch.kt](https://android.googlesource.com/platform/frameworks/support/%2B/39bdbe03eef999f4c1352f31a90526adad9245ae/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Switch.kt). The standard Switch API exposes checked state, optional thumb content, enabled state, colors and interaction source; the source inspected does not establish a separate default Expressive visual variant. Its motion includes an animated thumb with a Material motion spec, so a Web port must compare thumb travel/timing and not only track colors. Current shared Web switch uses a 52×32 CSS-pixel track and 16×16 thumb with CSS transitions; these are Web dimensions and motion, not a confirmed exact match. Planned selector behavior: both modes remain available, with no invented visual difference until an official default delta is confirmed.

### Switch family — Lab selector added (2026-10-15)

Added a component-specific Fidelity/Expressive selector to the Switch examples. Since no default Expressive visual delta was verified, both choices intentionally use the same shared Switch; Expressive mode explains the reason. Added static regression coverage. The motion audit remains open, and no claim of Android-equivalent thumb timing is made.

### TextField family — official Expressive sample discovery (2026-10-15)

Official AndroidX samples include an Expressive TextField using `TextFieldDefaults.roundedShape` and `TextFieldDefaults.tonalColors()`, and an Expressive OutlinedTextField using `OutlinedTextFieldDefaults.roundedShape`, `tonalColors()` and an inside label position. Source: [AndroidX TextFieldSamples.kt](https://android.googlesource.com/platform/frameworks/support/%2B/androidx-main/compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/TextFieldSamples.kt). This is a real source-backed Expressive option, unlike the removed Productivity style. Loculary's shared TextField currently renders a label above the input, a 56 CSS-pixel minimum height, extra-small corners and a surface background. Its Expressive specimen should add a label-inside/floating treatment, rounded shape and tonal surface as a Web adaptation, while preserving semantic roles, focus visibility, errors, disabled states, units, keyboard behavior and long labels. CSS can handle the simple floating-label states; browser tests must verify focus and prefilled values.

### TextField family — opt-in Expressive specimen implemented (2026-10-15)

Added an opt-in `variant="expressive"` to the shared TextField, keeping `fidelity` as the default. Expressive renders the label inside the field and floats it on focus or when a value is present; it uses the extra-large shape token and a tonal `surface-container-highest` background with semantic foreground, focus, error and disabled roles. The Lab exposes a per-TextField Fidelity/Expressive selector and static regression assertions. This uses CSS state selectors and is a Web adaptation of the official AndroidX Expressive sample, not a claim of exact Compose animation/geometry parity. Browser checks are still required for focus, prefilled value, placeholder, unit suffix, disabled/error, keyboard and long labels.

### Multiline field and selection menu — naming/gap findings (2026-10-15)

The Lab now exposes component-mode selectors for the existing multiline field and selection control, but deliberately marks both as incomplete rather than pretending they are official Android components. Android Material's field family is a multiline TextField/OutlinedTextField, not a distinct `TextArea` component. The current `Select` renders a native HTML `<select>`, not AndroidX `ExposedDropdownMenu`; the real M3 dropdown/menu primitive must be added as a shared component. Both controls' selectors currently explain this gap and do not invent an Expressive visual delta. Regression tests ensure the gap remains explicit. Next work: implement a true shared exposed dropdown with keyboard navigation, selection semantics, focus management, dismiss behavior, and M3 shape/color states; then audit multiline TextField behavior and its Expressive anatomy.

### Multiline field and selection menu — naming/gap findings (2026-10-15)

The Lab now exposes component-mode selectors for the existing multiline field and selection control, but deliberately marks both as incomplete rather than pretending they are official Android components. Android Material's field family is a multiline TextField/OutlinedTextField, not a distinct `TextArea` component. The current `Select` renders a native HTML `<select>`, not AndroidX `ExposedDropdownMenu`; the real M3 dropdown/menu primitive must be added as a shared component. Both controls' selectors currently explain this gap and do not invent an Expressive visual delta. Regression tests ensure the gap remains explicit. Next work: implement a true shared exposed dropdown with keyboard navigation, selection semantics, focus management, dismiss behavior, and M3 shape/color states; then audit multiline TextField behavior and its Expressive anatomy.

## Component conformance labels — mandatory status vocabulary (2026-10-15)

Do not use “100% Android” to describe a React/CSS component. AndroidX Compose components run on Android and cannot be literally transplanted into the Web. Use the following precise labels instead:

- **AndroidX-native implementation — 100%**: only valid when the actual AndroidX component is used in an Android target. No Loculary React component currently qualifies.
- **Android-source-backed Web adaptation**: behavior and visual decisions are traced to official Android/AndroidX source, but browser/platform differences remain.
- **Partial / parity gap**: a native HTML control, a visual mock-up, or a component missing important Android behavior.
- **Not yet audited**: evidence is insufficient; do not infer fidelity from appearance.

Record status separately for API/semantics, visuals/tokens, interaction/lifecycle, accessibility, responsive behavior, and automated/browser verification. A status can be “source-backed” in one dimension and “gap” in another. Never mark a component fully conformant until all required dimensions are verified, and never equate a screenshot resemblance with behavioral parity.

### Snackbar — official source review and Web adaptation (2026-10-15)

Official references:
- Android Developers, Snackbar guide: https://developer.android.com/develop/ui/compose/components/snackbar
- AndroidX source, Snackbar.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Snackbar.kt
- AndroidX source, SnackbarHost.kt: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SnackbarHost.kt

Android's model is not just a dark rounded rectangle. It includes a message, optional single action, optional dismiss affordance, default semantic color roles/shape/elevation/typography, a host/state lifecycle, and action-sensitive timeout behavior. The official API documents that a snackbar with an action should not time out by itself; the host/state API owns display and dismissal. The source also defines a maximum container width of 600 dp and uses tokenized one-line/two-line layout and spacing.

Loculary now has a shared src/components/ui/Snackbar.tsx and token-driven CSS, used by the Design Lab instead of its previous local mock-up. It supports message, optional action, explicit dismissal, a 4-second timeout only when no action is present, and prefers-reduced-motion. Fidelity and Expressive can be selected, but both currently render the same appearance because the reviewed AndroidX source did not establish a separate default Expressive Snackbar style. This is deliberately a **source-backed Web adaptation, not 100% Android/AndroidX implementation**.

Remaining parity gaps: a shared app-level host/queue analogous to SnackbarHostState, placement/insets analogous to Scaffold, replacement/queue policy, swipe dismissal, exact AndroidX token geometry and animation, action/dismiss focus behavior, and browser/screen-reader tests. Do not promote the component to fully conformant until these are implemented or explicitly scoped out and accepted.


### Exposed dropdown menu — source review and implementation status (2026-10-15)

Official references:
- Android Developers menu guide: https://developer.android.com/develop/ui/compose/components/menu
- AndroidX API reference: https://developer.android.com/reference/kotlin/androidx/compose/material3/ExposedDropdownMenuBox.composable
- AndroidX source: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ExposedDropdownMenu.kt
- AndroidX MenuTokens: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MenuTokens.kt

Android's exposed dropdown is anchored to a TextField/OutlinedTextField using ExposedDropdownMenuBox, ExposedDropdownMenu and menuAnchor semantics. AndroidX menu tokens use surfaceContainer, level-2 elevation, and extra-small corner shape; the documented API handles expanded state and dismissal requests. This is distinct from a native HTML select.

Loculary replaced the shared Lab's native select with src/components/ui/ExposedDropdownMenu.tsx and a token-driven stylesheet. The Web component provides combobox/listbox/option semantics, active-descendant state, ArrowUp/ArrowDown, Home/End, Enter/Space selection, Escape/Tab dismissal, outside-pointer dismissal, disabled options, selection indication, error/helper text and reduced-motion support. The Expressive selector is present, but its rounded/tonal Web styling is an informed adaptation, not proof of a separate AndroidX Expressive default for this exact control.

Status: **Android-source-informed Web adaptation; not 100% Android/Compose parity**. Remaining: match the actual ExposedDropdownMenuBox/TextField anchor anatomy, measure and position popup like Compose across viewport edges, add focus/assistive-technology tests, verify scrolling and long labels, pin exact token values, test browser behavior, and audit how an editable/autocomplete variant differs from a selection-only field.
