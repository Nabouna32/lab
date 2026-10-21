# IconButton — AndroidX Material 3 port

**Status:** Portage en cours / verification incomplete.  
**Current React implementation:** must be confirmed from repository code before migration planning.

## Upstream authority

- [Official Material 3 Icon button guide](https://m3.material.io/components/icon-button/overview)
- [AndroidX IconButton source snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX small icon-button tokens snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/a4067b4140d0802f4416d38fa96e2baa68f65af7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

**Version caveat:** source and token references are pinned snapshots, but a single aligned AndroidX artifact version has not yet been established for the React port. Verify API and tokens together before claiming parity.

## Contract and known findings

The previous audit records a React IconButton with variant/state styling and semantic token use. It also notes selected-state behavior for filled-tonal and outlined forms, plus variant-specific disabled colors. These observations must be checked against the pinned source and corresponding token files; CSS mixes are Web adaptations, not proof of exact rendered equivalence.

The port should follow official AndroidX public component names and distinguish standard, filled, filled-tonal, outlined and toggle-specific semantics only where the official API defines them. Loculary-only aliases or extra variants must be labelled as extensions and audited for usage before removal.

## React/Web adaptations

- Use a native button with a meaningful accessible name; decorative icon content must not be the only accessible label.
- Verify keyboard activation, visible focus, disabled non-activation and touch target in context.
- Test actual computed foreground/container/outline colors in light and dark themes.
- If ripple, overlays or motion differ from Compose, document the difference as a Web adaptation and respect reduced-motion preferences.

## Required verification

- [ ] Pin an aligned AndroidX API/source/token version.
- [ ] Map React props and variants to the official API; label extensions.
- [ ] Check enabled, selected/toggle where applicable, hover, focus-visible, pressed and disabled states.
- [ ] Verify icon alignment, container geometry, outline, shape and actual color blends.
- [ ] Check keyboard, accessible name/state, contrast, FR/EN surrounding labels, mobile and 200% zoom.
- [ ] Run component tests, lint, TypeScript and production build.
- [ ] Inspect browser rendering; record observed differences and unresolved questions.
- [ ] Audit and document production call sites before migration.

A matching silhouette or Design Lab screenshot is not enough to mark this component conformant.
