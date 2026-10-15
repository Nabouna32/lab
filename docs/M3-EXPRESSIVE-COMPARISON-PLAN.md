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
