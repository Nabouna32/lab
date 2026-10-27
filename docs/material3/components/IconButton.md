# IconButton — AndroidX Material 3 port

**Status:** Portage en cours / verification incomplete.  
**Current React implementation:** `src/components/ui/IconButton.tsx` exposes the eight official action/toggle names separately, uses separate action/toggle color roles, exposes AndroidX-inspired `colors` overrides and a Web-adapted `shape` prop, and shares the bounded pointer/keyboard ripple adaptation. Full source parity is not claimed until browser behavior is verified.

## Upstream authority

- [Official Material 3 Icon button guide](https://m3.material.io/components/icon-button/overview)
- [AndroidX IconButton source snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX `SmallIconButtonTokens.kt` at the same source revision](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [AndroidX `FilledIconButtonTokens.kt` at the same source revision](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledIconButtonTokens.kt)
- [AndroidX `FilledTonalIconButtonTokens.kt` at the same source revision](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt)
- [AndroidX `OutlinedIconButtonTokens.kt` at the same source revision](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedIconButtonTokens.kt)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

**Version caveat:** the API and component-token files are pinned to the same AndroidX source commit. The corresponding Maven artifact version is not inferred from Git metadata, so claims are scoped to this source snapshot rather than a declared artifact release.

## Contract and known findings

AndroidX exposes distinct public composables for `IconButton`, `FilledIconButton`, `FilledTonalIconButton`, `OutlinedIconButton` and the corresponding `IconToggleButton`, `FilledIconToggleButton`, `FilledTonalIconToggleButton`, `OutlinedIconToggleButton`. Action buttons are not toggles: checked state belongs to the toggle APIs, not a `selected` prop on a generic variant-based button. The React API now follows this separation. The action and toggle CSS mappings now use separate state contracts. Source-token audit against the pinned AndroidX commit corrects several previously inaccurate defaults: `FilledIconButton` uses primary/on-primary; its disabled container is on-surface at 10% and its disabled icon is on-surface-variant at 38%. `FilledIconToggleButton` unchecked uses surface-container/on-surface-variant and checked uses primary/on-primary. `FilledTonalIconButton` uses secondary-container/on-secondary-container; its toggle is unchecked with those same roles and checked with secondary/on-secondary. `OutlinedIconButton` uses outline-variant for its enabled outline; the disabled outline uses on-surface at 12%, while its disabled icon uses on-surface at 38%. CSS blending remains a Web adaptation. Hover/focus/pressed layers are expressed with CSS color mixing (8%/12%/12%); this remains a Web adaptation, not pixel-identical Compose rendering.

The port should follow official AndroidX public component names and distinguish standard, filled, filled-tonal, outlined and toggle-specific semantics only where the official API defines them. Loculary-only aliases or extra variants must be labelled as extensions and audited for usage before removal.

## React/Web adaptations

- Use a native button with a meaningful accessible name; decorative icon content must not be the only accessible label.
- Verify keyboard activation, visible focus, disabled non-activation and touch target in context.
- Test actual computed foreground/container/outline colors in light and dark themes.
- The shared ripple is a Web adaptation of Compose `ripple()`: it is clipped to the 40px visual surface while the native button retains a 48px minimum touch target. Toggle controls expose the AndroidX checkbox role/state (`role="checkbox"`, `aria-checked`) rather than treating a checked action as a generic pressed button. Keyboard activation and reduced-motion behavior remain required. `shape` maps Compose `Shape` to CSS `border-radius`; `colors` accepts AndroidX-inspired default/disabled and toggle-checked color roles, expressed as CSS colors.

## Required verification

- [x] Pin the API and component-token source references to the same AndroidX commit (artifact release mapping remains unspecified).
- [x] Separate the eight official action/toggle component names in the React public API; remove the generic `variant` prop and non-official `tonal` alias.
- [x] Map action/toggle enabled, checked/unchecked and disabled color roles from the pinned AndroidX implementation and token references; label CSS state layers as a Web adaptation.
- [x] Expose AndroidX-inspired `colors` overrides for default, disabled and checked roles; map `shape` to CSS `border-radius` as an explicit Web adaptation.
- [ ] Verify override behavior, shape clipping and computed styles in a browser.
- [x] Implement distinct action and toggle color roles for enabled, checked/unchecked and disabled states; add hover, focus-visible and pressed state layers.
- [ ] Verify computed hover, focus-visible, pressed and disabled rendering in a browser.
- [ ] Verify icon alignment, container geometry, outline, shape and actual color blends.
- [ ] Check keyboard, accessible name/state, contrast, FR/EN surrounding labels, mobile and 200% zoom.
- [ ] Run component tests, lint, TypeScript and production build.
- [ ] Inspect browser rendering; record observed differences and unresolved questions.
- [x] Migrate the known production call sites and Design Lab specimens from generic variant/selected props to named action or toggle components.
- [ ] Complete the exhaustive production call-site inventory and verify all CSS state tokens and actual browser rendering.

A matching silhouette or Design Lab screenshot is not enough to mark this component conformant.
