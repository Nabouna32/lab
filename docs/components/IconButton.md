# IconButton — Material 3 Fidelity audit

**Status:** implementation updated; browser verification required.  
**Component:** `src/components/ui/IconButton.tsx`  
**Production consumers:** favorites, mobile header search, tool search, unit conversion, number-base conversion and the shared Design Lab.  
**Direction:** DEC-026 — Material 3 Fidelity with current Pixel / Android references, not Material 3 Expressive.

## 1. Purpose and references

IconButton is a compact action with an accessible name. It is a React/CSS web adaptation, not an AndroidX Compose component.

- [Pinned AndroidX IconButton source](https://android.googlesource.com/platform/frameworks/support/%2B/1c9fe3b21eca0f1d2906dddf89028acbbb63b08c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX small icon-button tokens](https://android.googlesource.com/platform/frameworks/support/%2B/a4067b4140d0802f4416d38fa96e2baa68f65af7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [Material 3 icon button guide](https://m3.material.io/components/icon-button/overview)
- [WCAG 2.2 target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

The pinned AndroidX API documents a 48dp minimum interactive target and applies that minimum separately from the small container size. The generated token source identifies a 40dp small container and a 24dp icon. CSS pixels are not dp; Loculary uses 48 CSS px for the native interactive target and 40 CSS px for the visible surface as a deliberate Web adaptation.

## 2. Variants and state

| Loculary variant | Treatment |
|---|---|
| `standard` | Transparent surface; on-surface-variant icon, primary icon when selected |
| `filled` | Primary container / on-primary icon |
| `filled-tonal` | Secondary-container / on-secondary-container icon |
| `outlined` | Transparent surface with outline-variant border |
| `tonal` | Compatibility alias for `filled-tonal`; retain until all call sites are migrated |

Selected filled-tonal state uses `secondary-container` / `on-secondary-container`, including hover and pressed color mixes, for both `filled-tonal` and its `tonal` compatibility alias. This follows the current [AndroidX FilledTonalIconButtonTokens](https://android.googlesource.com/platform/frameworks/support/%2B/db4e85898bcd90a636877cc14d3ca4ba1e9492c7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt). Selected outlined state uses the inverse-surface roles. Disabled content uses on-surface at approximately 38% opacity; filled containers use the disabled on-surface treatment at approximately 10%. These CSS color mixes are source-informed adaptations, not proof of exact rendered color equivalence.

## 3. Geometry and behavior

- The outer native `button` remains at least 48 × 48 CSS px, preserving the clickable target and focus ring.
- A centered 40 × 40 CSS px inner surface receives the variant's fill, border and state styles. This separates the visible container from the interactive target.
- The typical icon size is 24 CSS px. This is a web sizing choice guided by AndroidX's 24dp reference.
- `label` is required and maps to `aria-label`. The optional `selected` prop is only for toggle actions and maps to `aria-pressed`; momentary actions should omit it.
- The native button provides keyboard activation and focus semantics. The visible focus ring stays on the full 48px target.
- Hover, pressed, selected and disabled treatments use semantic color roles. Transitions respect reduced-motion preferences.

## 4. Verification gate

Automated source-contract tests assert the 48px target, 40px visible surface, variant mappings, accessible label and toggle state. They do not prove the actual rendered geometry or interaction quality.

Still required in a browser:

- Light and dark themes, including selected and disabled variants.
- Visible 40px surface centered inside the 48px focus/touch target.
- Keyboard focus and activation, pointer/touch behavior, and screen-reader announcement.
- Contrast of icon, border, focus ring and state layers.
- Narrow layouts and 200% zoom, especially where several icon buttons are adjacent.
- Reduced-motion behavior.

Do not mark the component conformant until those checks have been observed and recorded.