# IconButton — AndroidX Material 3 port

**Status:** Portage en cours / verification incomplete.  
**Current React implementation:** `src/components/ui/IconButton.tsx` exposes the eight official action/toggle names separately. This aligns the public API distinction, but does not establish source parity for the current CSS state tokens.

## Upstream authority

- [Official Material 3 Icon button guide](https://m3.material.io/components/icon-button/overview)
- [AndroidX IconButton source snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX small icon-button tokens snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/a4067b4140d0802f4416d38fa96e2baa68f65af7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

**Version caveat:** source and token references are pinned snapshots, but a single aligned AndroidX artifact version has not yet been established for the React port. Verify API and tokens together before claiming parity.

## Contract and known findings

AndroidX exposes distinct public composables for `IconButton`, `FilledIconButton`, `FilledTonalIconButton`, `OutlinedIconButton` and the corresponding `IconToggleButton`, `FilledIconToggleButton`, `FilledTonalIconToggleButton`, `OutlinedIconToggleButton`. Action buttons are not toggles: checked state belongs to the toggle APIs, not a `selected` prop on a generic variant-based button. The React API now follows this separation. The existing CSS state colors and outlined selected-state treatment remain unverified against the source token implementations; do not treat this API migration as completed visual or behavioral parity.

The port should follow official AndroidX public component names and distinguish standard, filled, filled-tonal, outlined and toggle-specific semantics only where the official API defines them. Loculary-only aliases or extra variants must be labelled as extensions and audited for usage before removal.

## React/Web adaptations

- Use a native button with a meaningful accessible name; decorative icon content must not be the only accessible label.
- Verify keyboard activation, visible focus, disabled non-activation and touch target in context.
- Test actual computed foreground/container/outline colors in light and dark themes.
- If ripple, overlays or motion differ from Compose, document the difference as a Web adaptation and respect reduced-motion preferences.

## Required verification

- [ ] Pin an aligned AndroidX API/source/token version.
- [x] Separate the eight official action/toggle component names in the React public API; remove the generic `variant` prop and non-official `tonal` alias.
- [ ] Complete the source-derived props and token mapping for each variant; label Web extensions.
- [ ] Check enabled, selected/toggle where applicable, hover, focus-visible, pressed and disabled states.
- [ ] Verify icon alignment, container geometry, outline, shape and actual color blends.
- [ ] Check keyboard, accessible name/state, contrast, FR/EN surrounding labels, mobile and 200% zoom.
- [ ] Run component tests, lint, TypeScript and production build.
- [ ] Inspect browser rendering; record observed differences and unresolved questions.
- [x] Migrate the known production call sites and Design Lab specimens from generic variant/selected props to named action or toggle components.
- [ ] Complete the exhaustive production call-site inventory and validate the remaining CSS state tokens.

A matching silhouette or Design Lab screenshot is not enough to mark this component conformant.
