# Material 3 AndroidX component coverage inventory

**Status:** working inventory, 2026-10-15  
**Scope:** official AndroidX Jetpack Compose Material 3 component API, adapted for the Loculary React/CSS Web Design Lab. This is not a claim of native Compose implementation or complete parity.  
**Primary sources:** [Compose Material components catalogue](https://developer.android.com/develop/ui/compose/components?hl=en), [AndroidX Material 3 API reference](https://developer.android.com/reference/kotlin/androidx/compose/material3), [Compose Material 3 release notes](https://developer.android.com/jetpack/androidx/releases/compose-material3).

## Status vocabulary

- **Shared Web adaptation:** reusable React/CSS primitive exists; AndroidX parity still needs per-component verification.
- **Lab mockup:** visual/interaction sample only; replace with a source-informed shared Web adaptation.
- **Web wrapper:** uses browser-native behavior and must not be represented as a native Android implementation.
- **Missing:** not yet represented adequately in the Lab.
- **Audit required:** an implementation exists, but variant/state/motion/accessibility coverage is not yet confirmed.

## Official component families and current known coverage

The list below is deliberately broader than the current production call sites. Components must be represented in the Lab even when Loculary does not yet use them in production, because the Lab is the planned review surface for the future refactor.

| Official AndroidX family / API | Current known Lab status | Required work |
|---|---|---|
| Button: Button, ElevatedButton, FilledTonalButton, OutlinedButton, TextButton | Shared Button with variant aliases | Audit API naming, token/state mapping, shapes, pressed motion, disabled and focus states; remove non-M3 aliases from the M3 specimen contract where safe |
| Icon buttons: standard, filled, filled-tonal, outlined, toggle | Shared IconButton | Verify every official variant and selected/toggle behavior against AndroidX |
| SegmentedButton / SingleChoiceSegmentedButtonRow / MultiChoiceSegmentedButtonRow | Shared SegmentedButtonGroup Web adaptation for single and multi selection | Verify official item shapes, borders, selected colors, keyboard semantics, RTL and version-specific API |
| Toggle buttons: filled, tonal, outlined, elevated; five sizes | Shared ToggleButton Web adaptation; all four styles and multiple sizes in Lab | Audit official size tokens, checked colors, morphing shapes and interaction states |
| SplitButtonLayout + split button variants | Shared SplitButton Web adaptation; filled and outlined specimens in Lab | Verify pinned API version, shape/spacing, primary/secondary action semantics, menu separation and keyboard behavior |
| FAB: small, regular, large, extended | Shared Web adaptation; all four types in Lab | Audit exact AndroidX size, shape, tonal color, state elevation, extended expansion and motion |
| FloatingActionButtonMenu / MenuItem / ToggleFloatingActionButton | Shared Web adaptation; staggered quick-action menu in Lab | Verify pinned API version, item composition, shape/color, staggered motion, keyboard and dismissal |
| Badge / BadgedBox | Shared Web adaptation; dot, count and anchored specimens | Audit exact dimensions/offsets, count overflow, role colors and screen-reader semantics |
| Linear progress indicator | Shared ProgressIndicator | Audit official determinate/indeterminate motion, track, segment geometry, semantics and reduced motion |
| Circular progress indicator | Shared Web adaptation | Audit AndroidX motion/stroke, size variants, indeterminate specimen and semantics |
| Snackbar | Shared Web adaptation | Audit queue/lifecycle, swipe dismissal, action behavior, timing, insets and motion |
| Tooltip: plain/rich | Shared Web adaptation; plain/rich specimens | Audit touch long-press lifecycle, outside dismissal, caret/position, rich actions and screen-reader behavior |
| Bottom sheets: ModalBottomSheet, BottomSheetScaffold | ModalBottomSheet adaptation | Audit drag/partial expansion, state, insets, nested scroll, scrim and animation |
| Cards: filled, elevated, outlined | Shared Card, additional Panel/ResultPanel | Confirm which are true M3 Card variants versus Loculary content compositions |
| Carousel: HorizontalMultiBrowseCarousel / HorizontalUncontainedCarousel | Shared Web adaptation; both layouts in Lab | Replace fixed multi-browse ratios with window-aware sizing; audit fling, state, mask/parallax, semantics and motion |
| Dialogs: AlertDialog, BasicAlertDialog/Dialog patterns | Shared AlertDialog adaptation | Audit properties, layout, dismissal, focus, motion and platform back behavior |
| Dividers: horizontal/vertical | Shared Web adaptation; both orientations in Lab | Audit exact inset/spacing behavior and semantic roles |
| Lists / list items | Shared Web adaptation; one/two/three-line slots in Lab | Audit exact slot spacing, density, leading/trailing variants and text scaling |
| Scaffold | Shared Web composition; top/bottom bars, rail, content and FAB in Lab | Add equivalent inner padding/inset consumption, snackbar integration and overlap/placement rules |
| Top app bars: small, center-aligned, medium, large | Shared Web adaptation; all four variants in Lab | Implement automatic scroll behavior, exact insets/geometry, action overflow and collapse/expand motion |
| Bottom app bar | Shared Web adaptation; actions + FAB specimen | Audit exact AndroidX geometry/elevation, FAB placement, insets and motion |
| Navigation bar | Shared Web adaptation | Audit 3–5 destinations, selection, icon-only/label variants, routes and safe areas |
| Navigation rail / WideNavigationRail / ModalWideNavigationRail | Shared narrow NavigationRail + wide standard/modal Web adaptations | Verify current API versions, 3–7 destinations, state/motion, header/footer/FAB, modal focus, insets and responsive layout |
| Navigation drawers: modal, dismissible, permanent | Shared Web adaptation, partial variants | Separate official behavior patterns; implement drawer state, gesture/back behavior, responsive layout and assistive-technology isolation |
| Tabs: primary/secondary, fixed/scrollable | Shared Tabs Web adaptation; primary, secondary and scrollable specimens in Lab | Audit exact indicator geometry/motion, RTL and screen-reader behavior |
| Checkbox / TriStateCheckbox | Shared Checkbox + TriStateCheckbox Web adaptation; mixed state shown in Lab | Verify parent-child state propagation, mixed-state accessibility, animation and minimum target |
| Chips: assist/elevated assist/filter/elevated filter/input/suggestion/elevated suggestion | Shared Web adaptation; all seven variants in Lab | Audit exact geometry, state tokens, touch targets, input removal semantics and motion |
| Date picker / date range picker / date picker dialog | Shared DatePicker + modal DatePickerDialog Web adaptations; single, range, native input and modal specimens in Lab | Verify grid keyboard, locale, RTL, exact dialog motion/dimensions and browser parity |
| Menus: DropdownMenu / DropdownMenuItem / SelectableDropdownMenuItem / CheckableDropdownMenuItem | Shared DropdownMenu adaptation; standard items, dividers, selected and disabled states | Audit latest API version, anchor positioning, selection semantics, focus, keyboard, scroll and dismissal |
| Radio button | Shared Web adaptation in a native radio group | Audit exact dimensions, state animation, touch target and assistive-technology semantics |
| Slider / RangeSlider | Shared Slider + RangeSlider Web adaptation; two-thumb range specimen in Lab | Audit exact track/thumb/tick geometry, value bubble, drag behavior, discrete steps and screen-reader announcements |
| Switch | Shared Switch | Audit M3 state layers, thumb/track/icon transitions, disabled/focus semantics and motion |
| TimePicker / TimeInput / TimePickerDialog | Shared TimePicker + modal dialog Web adaptations; dial, native input and modal specimens in Lab | Verify AndroidX version availability, exact dial geometry, keyboard and native dialog parity |
| Search: SearchBar, expanded docked/full-screen patterns, AppBarWithSearch | Shared SearchBar + AppBarWithSearch Web adaptations; docked/full-screen and app-bar composition in Lab | Audit current SearchBarState API/version, scroll behavior, insets/transition, focus management and semantics |
| TextField / OutlinedTextField / SecureTextField / OutlinedSecureTextField | Shared MaterialTextField Web adaptation; filled, outlined, error, counter and secure specimens in Lab | Audit floating-label/outline geometry, text scaling, IME/autofill, context-menu protection and accessibility |
| SwipeToDismissBox | Shared Web adaptation with horizontal swipe and explicit accessible dismiss action | Verify gesture thresholds/directions, RTL, nested scrolling, exact motion and screen-reader parity |
| Surface / Text / layout and theming APIs | Tokens and several primitives exist | Audit tonal/shadow elevation, semantic colors, typography roles and composition behavior; these are foundations, not gallery-only widgets |
| PullToRefreshBox / pullToRefresh modifier | Shared Web adaptation; pull state and accessible refresh action in Lab | Verify touch/nested-scroll arbitration, threshold, indicator motion, RTL and native device behavior |

## Non-Material Loculary utilities

ClearButton, CopyButton, ValidationMessage, Panel, ResultPanel, and the current skeleton loader may be useful product primitives, but they are not automatically official Material 3 components. Keep them out of the official M3 component count and label them as Loculary utilities/compositions where they remain needed. They must not be presented as invented AndroidX components.

## Component audit checklist

For each component/variant, record:

1. Official guide and AndroidX API/token source, including a pinned AndroidX release/source revision.
2. Purpose, when to use it, variants and component composition.
3. Container/indicator dimensions and shape; identify dp/sp references separately from CSS px/rem approximations.
4. Color roles for light/dark and all state layers.
5. Typography and icon behavior.
6. Enabled, disabled, hovered, focused, pressed, selected, error, indeterminate and dragged states as applicable.
7. Animation curves, durations, state transitions, gesture behavior and reduced-motion fallback.
8. Keyboard navigation, ARIA/native semantics, focus restoration, screen-reader behavior and target size.
9. Responsive/inset behavior, zoom/text scaling and localization.
10. Lab integration, automated tests, browser/device validation, known gaps and explicit parity status.

**No “100% Android” status without evidence.** A Web adaptation can target functional and visual parity but remains subject to browser/platform differences. CSS pixels are not Android dp, and browser semantics/animation APIs do not automatically reproduce Android window, gesture, IME or accessibility behavior.


## Tabs — 2026-10-15

- **Official API family:** `Tab`, `PrimaryTabRow`, `SecondaryTabRow`, `PrimaryScrollableTabRow`, `SecondaryScrollableTabRow`. The older generic `TabRow` and `ScrollableTabRow` APIs are deprecated in favor of primary/secondary variants in current AndroidX references.
- **Official source:** https://developer.android.com/develop/ui/compose/components/tabs?hl=en and https://developer.android.com/reference/kotlin/androidx/compose/material3/PrimaryTabRow.composable
- **Lab:** integrated shared `Tabs` Web adaptation with primary, secondary, and scrollable specimens; the previous locally styled tab mockup is no longer the displayed sample.
- **Verified in code:** selected-state ARIA, single selected tab in the roving tab stop, Left/Right/Home/End keyboard handling, disabled tabs skipped during keyboard navigation, responsive horizontal scrolling, reduced-motion CSS fallback.
- **Web adaptation / not yet verified:** indicator motion is CSS rather than Compose animation; scroll-to-selected behavior, icon/text two-line edge cases, exact AndroidX dimensions, accessibility-tree parity, and browser/device behavior remain to validate. The shared component renders the selected item's content as a linked tab panel.
- **Acceptance gate:** run lint/typecheck/tests/build; test keyboard and screen reader behavior in a browser, including RTL and zoom; compare against official AndroidX source for exact token and motion parity.


## DatePicker / DateRangePicker — 2026-10-15

- **Official source:** https://developer.android.com/develop/ui/compose/components/datepickers?hl=en
- **Official API family:** `DatePicker`, `DateRangePicker`, and `DatePickerDialog`; supported presentations include docked calendar, modal calendar, and modal input. `DatePickerDialog` is a container, not a distinct selection model.
- **Lab:** shared `DatePicker` Web adaptation includes a month calendar for single-date selection and range selection, plus an explicitly labelled native HTML date-input mode.
- **Verified in code:** month navigation, localized month/day labels, min/max constraints, selected/today states, date range selection, controlled value callbacks, native date-input constraints.
- **Known gaps:** no AndroidX-equivalent modal `DatePickerDialog` yet; input mode uses browser-native UI; calendar keyboard grid navigation, exact AndroidX day-cell dimensions/shape/motion, locale week conventions, RTL, accessibility tree and browser/device parity remain to validate. The current calendar is not yet certified as fully conformant.
- **Acceptance gate:** add modal focus management and grid keyboard navigation, then run tests/build and browser/screen-reader checks.


## TimePicker / TimeInput — 2026-10-15

- **Official source:** https://developer.android.com/develop/ui/compose/components/time-pickers?hl=en and https://developer.android.com/develop/ui/compose/components/time-pickers-dialogs?hl=en
- **Official API family:** `TimePicker` (dial) and `TimeInput` (text entry); the current guide marks them experimental. The current API reference records TimeInput as added in a 1.5.0 alpha, so do not assume availability in the pinned stable dependency without checking its exact version.
- **Lab:** shared `TimePicker` Web adaptation includes an interactive clock dial, hour/minute selection and an explicitly labelled native HTML `input[type=time]` wrapper.
- **Not yet verified:** exact AndroidX dial layout, minute selection behavior, 12/24-hour locale conventions, TimeInput segmented-field parity, dialog integration, keyboard/screen-reader behavior, and browser/device rendering.


## SearchBar / expanded search — 2026-10-15

- **Official source:** https://developer.android.com/develop/ui/compose/components/search-bar?hl=en and https://developer.android.com/reference/kotlin/androidx/compose/material3/SearchBar.composable
- **API caveat:** the current AndroidX reference marks the older SearchBar overload deprecated in favor of `SearchBarState`, `ExpandedFullScreenSearchBar`, and `ExpandedDockedSearchBar`. SearchBar is experimental in the current guide.
- **Lab:** shared `SearchBar` Web adaptation includes docked suggestions and a full-screen presentation, controlled query, selection, clear action, Enter submission, Escape dismissal and arrow-key suggestion navigation.
- **Not yet verified:** exact current AndroidX state API parity, transition/shape animation, IME behavior, focus restoration, full-screen system insets, RTL and screen-reader/browser behavior. Do not claim Compose parity.


## TriStateCheckbox — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/TriStateCheckbox.composable
- **Official behavior:** tri-state values are checked, unchecked and indeterminate; the indeterminate state commonly reflects a parent whose child checkboxes are only partially selected.
- **Lab:** added a shared `TriStateCheckbox` wrapper over the existing shared Checkbox, using the native HTML checkbox `indeterminate` property and a distinct minus mark.
- **Not yet verified:** exact AndroidX mixed-state motion/colors, full parent-child propagation example, screen-reader/browser parity and disabled mixed state.


## RangeSlider — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/RangeSlider.composable and https://developer.android.com/develop/ui/compose/components/slider?hl=en
- **Official behavior:** selects two bounded values that cannot cross; supports continuous/discrete ranges and exposes start/end values separately.
- **Lab:** added shared `RangeSlider` with two native range inputs, min/max bounds, step support, a configurable minimum gap and distinct accessible labels/value text.
- **Not yet verified:** exact AndroidX thumb/track/tick geometry, pointer-drag arbitration between overlapping native inputs, touch target, focus states, discrete tick marks, value bubble, RTL and assistive-technology behavior.


## ToggleButton / SplitButtonLayout — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/ToggleButton.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/SplitButtonLayout.composable
- **ToggleButton:** checked-state button; current API exposes filled, tonal, outlined and elevated variants, five sizes, optional icon, and state/interaction-driven shape morphing.
- **SplitButtonLayout:** groups a leading primary action and trailing related secondary action. Current reference records its introduction in Material3 1.5.0-alpha29; confirm the pinned version before claiming stable availability.
- **Lab:** shared Web adaptations show four toggle styles and filled/outlined split groups with an illustrative menu. The menu is a Web demonstration and is not part of SplitButtonLayout itself.
- **Not yet verified:** exact size tokens/shape morphing, elevation and color transitions, focus/keyboard/menu dismissal, screen-reader semantics and pinned AndroidX availability.


## TextField / SecureTextField — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/TextField.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedTextField.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/SecureTextField.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedSecureTextField.composable
- **Lab:** added shared `MaterialTextField` adaptation with filled/outlined variants, floating labels, leading/trailing content, prefix/suffix, supporting/error text, optional character counter, and secure password entry with reveal toggle.
- **Security qualification:** secure mode prevents common copy/cut/drag events and uses password autocomplete defaults, but browser behavior and platform accessibility differ; it is not a substitute for AndroidX SecureTextField's native input protections.
- **Not yet verified:** exact filled/outlined container and label motion, focused border thickness, text scaling, IME/autofill, selection/context menu behavior, screen readers and RTL.


## DropdownMenu / DropdownMenuItem — 2026-10-15

- **Official source:** https://developer.android.com/develop/ui/compose/components/menu?hl=en and https://developer.android.com/reference/kotlin/androidx/compose/material3/DropdownMenuItem.composable
- **Lab:** replaced the local menu mockup with shared `DropdownMenu` / item adaptations supporting outside dismissal, Escape, ArrowUp/Down, Home/End, disabled entries, separators, leading icons, selected/checkable items and focus restoration after selection.
- **Newer API caveat:** current AndroidX API reference also lists `SelectableDropdownMenuItem` and `CheckableDropdownMenuItem`, introduced in 1.5.0 beta; verify the pinned version before using those APIs.
- **Not yet verified:** exact popup positioning, edge collision, native window behavior, scroll/insets, typeahead, screen-reader announcements, RTL and browser/device parity.


## SwipeToDismissBox — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/SwipeToDismissBox.composable
- **Lab:** shared `SwipeToDismissBox` adaptation supports horizontal pointer gestures, direction configuration, threshold-based dismissal, reduced-motion CSS, and a visible keyboard-accessible dismiss button.
- **Not yet verified:** AndroidX state/confirm behavior, nested scroll and pointer-cancel interactions, RTL direction, exact background/animation, screen-reader action semantics and browser/device gesture behavior.


## FloatingActionButtonMenu — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/FloatingActionButtonMenu.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/FloatingActionButtonMenuItem.composable
- **API version:** current reference lists FloatingActionButtonMenuItem as added in Material3 1.5.0-alpha29; confirm exact dependency version.
- **Lab:** shared Web adaptation with expandable FAB, labelled quick-action items, staggered entrance animation, Escape dismissal, focus restoration on selection and reduced-motion fallback.
- **Not yet verified:** exact ToggleFloatingActionButton state/shape morphing, AndroidX item arrangement, colors, motion timing, back handling, RTL and assistive-technology behavior.


## AppBarWithSearch — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/AppBarWithSearch.composable
- **Official behavior:** app-bar integration of SearchBar with navigation/actions, window insets and optional scroll behavior; should be paired with an expanded search composable.
- **Lab:** added a shared Web composition that combines a sticky app-bar shell, navigation action and shared SearchBar.
- **Not yet verified:** current SearchBarState API, nested-scroll behavior, exact insets/tonal elevation, collapsed shape/motion, full-screen search pairing, RTL and browser/device parity.


## WideNavigationRail / ModalWideNavigationRail — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/WideNavigationRail.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/ModalWideNavigationRail.composable
- **Lab:** added a shared Web adaptation with collapsed/expanded standard rail and modal expansion with scrim, Escape dismissal, focus containment and restore.
- **Version caveat:** current API reference lists `ModalWideNavigationRail` as added in Material3 1.5.0-beta01; verify the exact pinned dependency.
- **Not yet verified:** AndroidX state/animation, adaptive breakpoints, item geometry, insets, RTL, back handling and assistive-technology parity.


## PullToRefreshBox — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/PullToRefreshBox.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/pullToRefresh.modifier
- **Lab:** shared Web adaptation includes a pull-distance indicator, controlled refreshing state, reduced-motion spinner fallback and an explicit “refresh now” button for accessibility.
- **Known limitation:** native nested-scroll arbitration and overscroll differ between browsers. Pointer-driven pull behavior is not yet verified on touch devices; do not mark this family complete until mobile scroll/refresh interactions are tested.


## BottomSheetScaffold — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/BottomSheetScaffold.composable
- **Lab:** added shared persistent-sheet Web adaptation with collapsed/expanded states, unique linked IDs, keyboard-accessible handle, vertical drag threshold and reduced-motion CSS.
- **Not yet verified:** AndroidX nested scroll/state, peek height and anchor semantics, drag resistance/velocity, insets, accessibility announcements, RTL and browser/device gesture parity.


## TimePickerDialog — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/TimePickerDialog.composable
- **Lab:** added a modal Web adaptation with draft time, confirm/cancel, Escape dismissal, focus containment/restore and shared TimePicker dial.
- **Not yet verified:** exact AndroidX dialog dimensions/shape, time-picker state/animation, native back handling, 12/24-hour locale behavior and assistive-technology parity.


## SegmentedButton rows — 2026-10-15

- **Official source:** https://developer.android.com/reference/kotlin/androidx/compose/material3/SegmentedButton.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/SingleChoiceSegmentedButtonRow.composable
- **Lab:** added shared `SegmentedButtonGroup` adaptation for single choice and multi choice, with linked border geometry, selected state, disabled items, keyboard arrow/Home/End navigation and reduced-motion fallback.
- **Not yet verified:** exact AndroidX item shape calculation, layout spacing, icon-only variants, role/selection semantics, RTL and assistive-technology parity.


## HorizontalFloatingToolbar / VerticalFloatingToolbar — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/HorizontalFloatingToolbar.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/VerticalFloatingToolbar.composable
- **Lab:** added shared horizontal/vertical floating toolbar Web adaptation with expandable/collapsible actions, keyboard-operable buttons and reduced-motion entrance fallback.
- **Version caveat:** current API reference lists FloatingToolbarState as added in Material3 1.5.0-beta01; verify the pinned version for the toolbar/scroll behavior APIs.
- **Not yet verified:** scroll-driven collapse/exit behavior, nested scroll, touch-exploration expansion, exact shape/elevation, RTL, placement and assistive-technology parity.


## Button / IconButton / IconToggleButton variants — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/FilledIconButton.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/FilledTonalIconButton.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedIconButton.composable, https://developer.android.com/reference/kotlin/androidx/compose/material3/IconToggleButton.composable
- **Lab:** updated the identifier inventory to list the official button and icon-button variants, and added selected-state examples for standard, filled, filled-tonal and outlined icon buttons.
- **Custom extension:** `Button variant="danger"` is app-specific semantic styling, not a built-in Material 3 button variant; the Lab now labels it explicitly.
- **Not yet verified:** all icon-toggle variants' selected colors/shape/motion and exact icon button dimensions remain to validate against the pinned AndroidX source.


## DismissibleNavigationDrawer / PermanentNavigationDrawer — 2026-10-15

- **Official sources:** https://developer.android.com/reference/kotlin/androidx/compose/material3/DismissibleNavigationDrawer.composable and https://developer.android.com/reference/kotlin/androidx/compose/material3/PermanentNavigationDrawer.composable
- **Lab:** extended the shared drawer adaptation with in-layout dismissible and permanent modes, alongside the existing modal mode.
- **Not yet verified:** exact content shifting/measurement, adaptive breakpoints, window insets, nested scroll, drawer state/animation, RTL and browser/screen-reader behavior.
