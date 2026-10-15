# Material 3 Expressive comparison plan for Loculary


## Audit continuation — Android current / Expressive comparison (2026-10-15)

### User decision: expose both evidence-backed variants in Design Lab

The user requests two selectable comparison modes where official Android sources document a meaningful difference: (1) current Pixel/Material 3 baseline and (2) current Material 3 Expressive. This is a **comparison mode**, not a decision to replace the production default. Do not add a toggle that merely changes a label or decorative preview; it must drive the same shared component primitives used in production.

Official Android Developers describes Expressive as an expansion of Material 3 affecting theming, components, motion and typography, and says it complements Android 16's visual style: https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en . Component catalog: https://developer.android.com/develop/ui/compose/components?hl=en . Current AndroidX implementation example: https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt . The `androidx-main` links are moving references; before asserting exact parity, pin a commit/tag or release matching the implementation selected for the Lab and record it in the source matrix.

### Comparison contract

- The Lab mode selector is global to the component showcase and offers **Pixel / M3 baseline** and **M3 Expressive**. Production continues to use the explicitly selected default until the user validates a change.
- Only switch a property when AndroidX sources establish a difference for that component/version: component API/shape tokens, dimensions, typography, color roles or motion. Do not apply a generic “Expressive = pastel, oversized, pill-shaped” filter.
- Keep the selected seed/theme and semantic color roles coherent in both modes. A mode switch must not replace semantic foreground/background pairs with arbitrary colors.
- Show source and confidence labels: AndroidX-confirmed, official guide only, Loculary web adaptation, or open/unverified. Separate appearance differences from interaction/motion differences.
- Add a component to the Expressive comparison only when evidence exists; where no verified delta exists, show the same implementation and explicitly state “no verified difference identified” rather than fabricate one.
- Tests must verify both modes, independent demo state, keyboard/focus, disabled/selected/error states, long French labels, light/dark and reduced motion. Add browser screenshots/runtime checks where available.

### Initial source-backed component inventory and next audit queue

The official Android Compose catalog includes Buttons, FAB, IconButton, SegmentedButton, Badges, Progress indicators, Snackbar, Navigation bar/rail/drawer, Tabs, Checkbox, Chips, Date picker, Menus, Radio buttons, Sliders, Switch, Time picker, Search, Text fields, lists and grids. API reference also exposes components such as split buttons, short navigation bars, secure text fields and segmented list items. These are candidates to compare against actual Loculary usage, not an instruction to implement every Android API indiscriminately.

Audit in this order:
1. Existing shared components already in production and Lab: Button/IconButton, checkbox/switch, radio/segmented controls, Slider, linear ProgressIndicator, Card, TextField/TextArea/Select, search, tooltip/popover/dialog/snackbar, tabs/navigation and chips/badges.
2. Cross-cutting theme/tokens: semantic colors and contrast, shapes/rounding control, typography, surface/elevation, iconography, density/targets, focus/pressed/hover/disabled/selected/error/loading and reduced motion.
3. Missing but product-relevant Android patterns: circular progress, FAB/extended FAB, date/time pickers, menus, navigation drawer/rail/bar, tabs, radio, filter/input chips, badge, dialog, snackbar, tooltip, list item and bottom sheet. Decide inclusion from real product journeys and accessibility, not catalog completeness alone.

### CSS feasibility and animation strategy

CSS can handle many static geometry, colors, borders, typography and simple transitions. It is not sufficient by itself for every Compose animation, state machine or spring/timing behavior. For each motion, record the AndroidX animation spec/state transitions and implement a deliberate Web counterpart:
- CSS transitions/keyframes for simple opacity, transform, color and shape interpolation.
- Web Animations API or a maintained animation library when imperative sequencing, cancellation, interruption or lifecycle control is needed.
- JavaScript requestAnimationFrame or a small explicit state machine for complex multi-stage progress choreography when CSS keyframes cannot faithfully reproduce timing/state behavior.
- SVG/canvas only when stroke geometry or drawing is needed; avoid adding canvas when SVG/CSS suffices.
- Respect `prefers-reduced-motion`, keep state changes understandable without motion, and test tab/background changes and unmount cleanup.
- If exact Android behavior depends on Compose runtime, physics, platform ripple or Android system APIs that do not exist on the Web, document that exact parity is impossible in CSS alone and specify the Web adaptation rather than claiming equivalence.

### Validation snapshot

Workflow run 38704035198 has completed with **failure**: lint and typecheck passed; the test step failed; build was skipped. Therefore this is not a green CI checkpoint. Retrieve test logs, identify the actual failing assertion(s), fix them on the audit branch and rerun before claiming success. Do not merge PR #729 without the user's explicit approval.

### Source references checked 2026-10-15

- Android M3 / Expressive overview: https://developer.android.com/develop/ui/compose/designsystems/material3?hl=en
- Official Compose component catalog: https://developer.android.com/develop/ui/compose/components?hl=en
- Progress indicator semantics and determinate/indeterminate behavior: https://developer.android.com/develop/ui/compose/components/progress
- Segmented button single-/multi-select patterns: https://developer.android.com/develop/ui/compose/components/segmented-button?hl=en
- AndroidX Button implementation (current branch; moving): https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt

**Status boundary:** this entry records the user's requested plan and newly checked official source guidance. It does not claim the two-mode selector, component audit, browser verification or fixes have already been implemented.


## Audit 01 — Buttons (2026-10-15)

**Official source:** pinned AndroidX Compose Material 3 Button.kt at https://android.googlesource.com/platform/frameworks/support/%2B/155b9eedc7a9732cce0505b492b2c15f5e70d1b9/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt and [ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults).

**Confirmed difference in API/behavior:** classic button overloads accept a single `shape`; Expressive overloads accept `ButtonShapes` and morph between the normal and pressed shapes. Expressive provides height-aware recommended helpers for shapes, content padding, text style, icon size and spacing. This is a component-specific API/behavior difference, not a blanket color/shape preset.

**Loculary baseline found:** shared `src/components/ui/Button.tsx` sets 40 CSS px minimum height, 64 CSS px minimum width, full resting corners and a small active corner. Those are Web implementation choices and must not be described as dp equivalents. The component-specific Expressive specimen should compare the baseline with a height-aware variant; CSS border-radius transitions can approximate simple corner interpolation, while any more complex timing must be tested and documented. Status: source finding recorded; dedicated selector/specimen and browser parity checks still to do.

**Naming rule:** only offer M3 Fidelity and M3 Expressive as official style modes. Any Loculary-only Productivity/compact composition is an adaptation and must not appear as an official Material mode.

### Button family — Web specimen implementation (2026-10-15)

Implemented a per-component Fidelity/Expressive selector in the Button gallery. The Expressive specimen uses medium-size AndroidX tokens from [ButtonMediumTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/4fcf7a5467f9d16be2a3d1e31be0ad96a136a7a7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonMediumTokens.kt): 56dp height, 24dp horizontal padding, 16dp vertical padding, 24dp icon size, full resting shape and medium pressed shape. The Web specimen maps dimensions to CSS px and uses a CSS radius transition. This is an explicit Web approximation, not dp equivalence or proof of identical Android motion. Static regression coverage was added; CI/browser checks are still pending.

### IconButton family — Web specimen implementation (2026-10-15)

Official source: [AndroidX IconButton.kt](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt). Confirmed: 24dp typical icon; 48dp minimum interactive target; Expressive size families and round/square shapes; pressed and selected shape morphs.

Added a component-specific selector and interactive selected IconButton to the shared gallery. Expressive medium specimen uses 56 CSS px box, 24 CSS px icon, full rest shape, medium pressed shape and large selected shape; reduced motion disables the radius transition. CSS px are explicitly not claimed as dp equivalents. Open issue: shared Web IconButton currently applies the 48 CSS px size to the visible box rather than clearly separating visual container and hit target. Audit/fix that anatomy before claiming full Fidelity parity.

### Checkbox family — source finding (2026-10-15)

Pinned AndroidX source: [Checkbox.kt](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt). No default Expressive-specific rendering delta was confirmed in the source inspected. The Lab now provides the component mode selector but deliberately renders the same shared Checkbox for both options and explains why. Existing web geometry (18 CSS px box, explicit outline widths, 48 CSS px minimum label row) still needs a precise comparison against AndroidX source/runtime before full Fidelity is claimed.

### Switch family — source finding (2026-10-15)

Pinned source reviewed: [AndroidX Switch.kt](https://android.googlesource.com/platform/frameworks/support/%2B/39bdbe03eef999f4c1352f31a90526adad9245ae/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Switch.kt). No distinct default Expressive visual variant was confirmed. AndroidX uses a Material motion spec for thumb animation; the Web component currently uses CSS transitions. Fidelity work must compare track/thumb dimensions, travel distance, easing, interruption and reduced-motion behavior. Until an official delta is verified, both style modes should render the same Switch rather than inventing one.

**Switch Lab status:** per-component Fidelity/Expressive selector is now present. Both modes deliberately render the shared component identically until a verified default Expressive delta is found. A regression assertion covers this. Next: verify thumb geometry and motion against AndroidX runtime and document the Web adaptation.

### TextField family — source finding (2026-10-15)

Official source: [AndroidX TextFieldSamples.kt](https://android.googlesource.com/platform/frameworks/support/%2B/androidx-main/compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/TextFieldSamples.kt). The Expressive sample uses rounded shape and tonal colors; the outlined Expressive sample also demonstrates inside label positioning. This establishes a real variant to compare. Current Loculary shared TextField uses an external label and extra-small corners. Add an opt-in Expressive variant with floating inside label and tonal container; preserve existing Fidelity default and all input semantics. Use CSS for the simple focus/value label states, then browser-test focus, prefilled/default values, disabled/error states, numeric keyboard and unit suffix.

**TextField specimen implemented:** opt-in `variant="expressive"` with floating inside label, rounded extra-large shape token and tonal container; default remains Fidelity. The Lab selector drives the shared component. Static assertions added. CSS handles focus/value floating states; exact AndroidX motion and geometry are not claimed. Browser test matrix: empty/placeholder, focused, prefilled, disabled, invalid, unit suffix, numeric input and long French labels.