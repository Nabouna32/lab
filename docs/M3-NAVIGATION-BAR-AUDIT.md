# Material 3 NavigationBar — source audit

**Date:** 2026-10-15  
**Status:** shared Web primitive drafted; integration into the main Design Lab preview remains open.  
**Classification:** source-informed Web adaptation; partial parity; runtime unverified. Not “100% AndroidX”.

## Official Android references

- [Material 3 Navigation bar — Android Developers](https://developer.android.com/develop/ui/compose/components/navigation-bar)
- [Navigation bar API — AndroidX Compose Material 3](https://developer.android.com/reference/kotlin/androidx/compose/material3/NavigationBar.composable)
- [NavigationBarItem API — AndroidX Compose Material 3](https://developer.android.com/reference/kotlin/androidx/compose/material3/NavigationBarItem.composable)
- [Material 3 system insets — Android Developers](https://developer.android.com/develop/ui/compose/system/material-insets)

## Source-confirmed behavior

Android guidance positions a NavigationBar for compact windows and three to five top-level destinations of comparable importance. Each destination has an icon and label, and the selected destination is visibly distinguished. The Compose component also handles Android window insets; a web implementation must instead account for browser layout and safe-area environment variables.

## Web implementation drafted in this branch

- `src/components/ui/NavigationBar.tsx`
- `src/components/ui/NavigationBar.module.css`

The primitive uses native HTML navigation and buttons, an accessible navigation label, a selected-state signal, shared semantic color/shape variables, visible keyboard focus, safe-area bottom padding and reduced-motion handling.

## Explicit gaps

- The component has **not yet replaced** the inline bottom-navigation markup in `VisualLab.tsx`; do not treat the main Lab preview as using this primitive yet.
- The API currently models in-page selection with buttons. Real production destinations should generally be links with real URLs and browser navigation semantics, not buttons that merely imitate links.
- CSS pixel values are web reference values, not Android dp equivalents.
- Exact AndroidX layout, typography metrics, state-layer behavior, ripple, window insets and native motion are not claimed.
- Browser/device and assistive-technology checks have not been performed.

## Acceptance checklist

- [ ] Integrate the shared primitive into the main Lab preview.
- [ ] Verify 3–5 destinations, long labels and narrow viewports without clipping.
- [ ] Verify keyboard focus and selected-state announcements.
- [ ] Verify light/dark semantic foreground/container roles and contrast.
- [ ] Verify safe-area padding on mobile Safari/Android browsers.
- [ ] Decide separately whether production destinations should be links and whether the app shell needs a NavigationRail/Drawer at larger breakpoints.
- [ ] Run lint, typecheck, tests and build on the final branch head.
