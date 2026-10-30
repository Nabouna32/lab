# IconButton — AndroidX Material 3 port

**Status:** Portage en cours / verification incomplete.  
**Current React implementation:** `src/components/ui/IconButton.tsx` exposes the eight official action/toggle names separately, uses separate action/toggle color roles, exposes AndroidX-inspired `colors` overrides and a Web-adapted `shape` prop, and shares the bounded pointer/keyboard ripple adaptation. Full source parity is not claimed until browser behavior is verified.

## Upstream authority

- [Official Material 3 Icon button guide](https://m3.material.io/components/icon-button/overview)
- [AndroidX IconButton.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX IconButtonDefaults.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButtonDefaults.kt)
- [AndroidX IconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/IconButtonTokens.kt)
- [AndroidX StateTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- [AndroidX Ripple.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Ripple.kt)
- [AndroidX `SmallIconButtonTokens.kt` at the same source revision](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [AndroidX `FilledIconButtonTokens.kt` at the same source revision](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledIconButtonTokens.kt)
- [AndroidX `FilledTonalIconButtonTokens.kt` at the same source revision](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt)
- [AndroidX `OutlinedIconButtonTokens.kt` at the same source revision](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedIconButtonTokens.kt)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

**Stable baseline:** Compose Material 3 1.4.0, source commit `5113b82a4ed6416d6344efa50e41db8cb65928ff`. The published source archive was compared with 249 Kotlin files from this commit, with zero mismatches; see the [Material 3 1.4.0 provenance manifest](../catalog/baselines/material3-1.4.0.json).

## Contract and known findings

AndroidX exposes distinct public composables for `IconButton`, `FilledIconButton`, `FilledTonalIconButton`, `OutlinedIconButton` and the corresponding four toggle components. Action buttons are not toggles: checked state belongs to the toggle APIs, not a `selected` prop on a generic variant-based button.

The stable 1.4.0 source establishes these state contracts:
- Standard `IconButton`: disabled content follows `LocalContentColor` at 38% (the default surface context uses `onSurfaceVariant`).
- `FilledIconButton` and `FilledTonalIconButton`: disabled container `onSurface` at 10%, disabled icon `onSurface` at 38%.
- The Web outlined variants deliberately use the spec-recommended/vibrant color mapping: `outlineVariant` border and `onSurfaceVariant` enabled content. The disabled outline is `outlineVariant` at 38%; the disabled icon uses `onSurface` at 38%. The checked outlined toggle uses `onSurface` at 10% for its disabled container.
- Standard toggles inherit `LocalContentColor` at 38% when disabled; filled and filled-tonal toggles use `onSurface` at 38%.
- State layers use hover 8%, focus 10%, pressed 10%. `RippleDefaults.RippleAlpha` uses the same `StateTokens` values; the Web ripple uses 10% pressed opacity.

The React implementation keeps separate action/toggle roles and declares its outlined vibrant mapping. CSS color mixing remains a Web adaptation, not pixel-identical Compose rendering.

The port should follow official AndroidX public component names and distinguish standard, filled, filled-tonal, outlined and toggle-specific semantics only where the official API defines them. Loculary-only aliases or extra variants must be labelled as extensions and audited for usage before removal.

## React/Web adaptations

- Use a native button with a meaningful accessible name; decorative icon content must not be the only accessible label. The AndroidX `enabled` parameter maps to the native `disabled` attribute; `disabled` is retained as an explicit Web compatibility alias.
- Verify keyboard activation, visible focus, disabled non-activation and touch target in context.
- Test actual computed foreground/container/outline colors in light and dark themes.
- The shared ripple is a Web adaptation of Compose `ripple()`: it is clipped to the 40px visual surface while the native button retains a 48px minimum touch target. Toggle controls retain native button semantics and expose their checked state with `aria-pressed`, the established Web pattern for toggle buttons; they are not exposed as checkboxes. Keyboard activation and reduced-motion behavior remain required. `shape` maps Compose `Shape` to CSS `border-radius`; `colors` accepts AndroidX-inspired default/disabled and toggle-checked color roles, expressed as CSS colors.

## Required verification

- [x] Pin the API and component-token references to the stable Material 3 1.4.0 source commit, verified against the published source archive.
- [x] Separate the eight official action/toggle component names in the React public API; remove the generic `variant` prop and non-official `tonal` alias.
- [x] Map action/toggle enabled, checked/unchecked and disabled color roles from the pinned AndroidX implementation and token references; label CSS state layers as a Web adaptation.
- [x] Expose AndroidX-inspired `colors` overrides for default, disabled and checked roles; map `shape` to CSS `border-radius` as an explicit Web adaptation.
- [x] Expose the source `border` override only on outlined variants; map `BorderStroke` to CSS `border`, with `null` removing the outline.
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
