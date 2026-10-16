# Button — Material 3 Fidelity audit

**Status:** implementation batch in progress; browser verification still required.  
**Component:** `src/components/ui/Button.tsx`  
**Design Lab specimen:** `src/app/[locale]/design-lab/audit/ComponentLivePreview.tsx`, preview key `button`  
**Direction:** DEC-026 — Material 3 Fidelity with current Pixel / Android references, not Material 3 Expressive.

## 1. Purpose and references

Loculary's `Button` is a React/CSS web adaptation of the Material 3 button family, not the AndroidX Compose implementation. AndroidX defines the visual and semantic reference; HTML button semantics, keyboard interaction, browser layout, zoom and responsive behavior remain web-native concerns.

- [Material 3 buttons guide](https://developer.android.com/develop/ui/compose/components/button?hl=en)
- [AndroidX Button API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable)
- [AndroidX ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults)
- [AndroidX Button source, pinned snapshot](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
- Secondary Web cross-checks, not visual authorities: [MDUI Button](https://www.mdui.org/en/docs/2/components/button) and [MUI Button API](https://mui.com/material-ui/api/button/). MDUI documents M3 variants; MUI has its own React API and variant vocabulary. Use both only to compare Web implementation and accessibility ergonomics. If either differs from Android/AndroidX, record the discrepancy and discuss the trade-off before adopting it.
- [Material 3 theming](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [WCAG 2.2 reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) · [contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

The exact AndroidX artifact version is not pinned in Loculary dependencies. Re-check version-sensitive details before claiming exact version parity.

## 2. Variants

| Loculary variant | Relationship | Notes |
|---|---|---|
| `filled` | Official M3 concept | Primary container / on-primary content |
| `elevated` | Official M3 concept | Low surface container, primary content and elevation |
| `filled-tonal` | Official M3 concept | Secondary container / on-secondary-container content |
| `outlined` | Official M3 concept | Outline, transparent background, primary content |
| `text` | Official M3 concept | No visible resting container; smaller horizontal padding |
| `danger` | Loculary extension | Destructive action; not an official M3 variant |
| `primary`, `tonal`, `secondary`, `ghost` | Compatibility aliases | Map to filled, filled-tonal, outlined and text; retain until call sites are audited |

Disabled is a state for every variant, not a sixth variant. A plain Button is not inherently a toggle and has no selected state. Loading/expanded/selected semantics belong to the calling interaction unless a separate API is approved.

## 3. Approved geometry and layout

These are CSS-pixel web values, not physical conversions from Android dp/sp:

- Minimum height 40px; minimum width 58px.
- Standard horizontal padding 24px; text-button horizontal padding 12px.
- With a leading icon, use 16px start / 24px end for standard variants, and 12px start / 16px end for text buttons, matching AndroidX content-padding defaults. The `leadingIcon` prop signals that the caller renders a leading icon; it does not render the icon itself.
- Vertical padding 8px; icon/label gap 8px.
- Typography baseline: 14px, weight 500, 20px line-height, approximately 0.1px letter spacing.
- Shape stays full/pill through hover, focus and press. Pressed shape morphing is excluded from the selected Fidelity direction.
- Labels stay on one line by default so icon/arrow composition remains stable and action groups can wrap their buttons rather than silently wrapping labels.
- The opt-in `multiline` prop allows wrapping and preserves intentional newlines. The caller should constrain the width when wrapping is desired; the prop does not replace a responsive parent layout.

These values are web adaptations guided by AndroidX defaults; CSS px and Android dp/sp are not interchangeable guarantees.

## 4. Colors and states

Use semantic tokens, not literal palette values. Verify all variants in light and dark themes.

- Filled: primary / on-primary.
- Elevated: surface-container-low / primary, elevation level 1 at rest/focus/press, level 2 on hover, and no shadow when disabled.
- Filled tonal: secondary-container / on-secondary-container; no resting elevation, level 1 on hover, and no shadow while focused, pressed or disabled.
- Filled: no resting elevation, level 1 on hover, and no shadow while focused, pressed or disabled.
- Outlined/text: primary content, transparent resting background; outlined uses the outline role.
- Hover/press/focus: state-layer-like color treatments using the relevant foreground/primary role; focus keeps a visible focus ring as well as a subtle 10% focus layer.
- Elevation is state-based rather than static: Loculary uses the existing semantic shadow tokens as a web adaptation of AndroidX elevation levels.
- Disabled container/border: approximately 12% on-surface; disabled content approximately 38% on-surface.
- Reduced motion: remove transitions when requested.
- Danger: Loculary-specific error treatment, not an official M3 variant.

Static source assertions do not prove final contrast or exact color blending. Verify computed colors in both themes in the browser.

## 5. Content, icons and wrapping

The Design Lab must exercise the real component with text-only content, leading icon, trailing arrow, both icons, short/long French and English labels, constrained width, default single-line behavior, opt-in wrapping, explicit line breaks, disabled variants, hover, focus-visible and pressed states.

Use `multiline` only when the layout has a meaningful width constraint and a multi-line label is intentional. Check icon/arrow spacing and label readability at narrow widths and 200% zoom.

## 6. Accessibility and behavior

- Use the native `button` element; default type is `button`, and callers choose `submit` deliberately.
- Preserve native disabled behavior; a disabled button must not activate.
- Keep visible focus apparent in both themes.
- Icon-only actions should use `IconButton` or have a meaningful accessible name.
- Do not use `aria-pressed` to imply a toggle unless the caller deliberately implements a toggle contract.
- Verify Tab focus, Enter/Space activation, hover, pressed and disabled behavior, reduced motion, responsive reflow and accessible naming.
- Check hit-target size and spacing in context. A 40px visual minimum does not prove every context meets all target-size recommendations.

## 7. Design Lab contract

The `button` specimen uses the production Button and exposes:
- all five canonical variants and the clearly labelled Loculary `danger` extension;
- an enabled/disabled toggle and a dedicated disabled row for every canonical variant;
- short/long labels, leading icon, trailing arrow and combined icon+arrow;
- constrained width, opt-in wrapping and explicit line break;
- natural hover, keyboard focus-visible and pressed states.

The Lab is an inspection surface, not proof of conformance. Test desktop/tablet/mobile stages, light/dark themes, keyboard navigation and browser zoom. The preview also provides contextual French/English verification instructions that react to the selected Button scenarios (long labels, icons, constrained width and wrapping), alongside baseline checks for Android Material 3 reference fidelity, keyboard states, disabled behavior, zoom and reduced motion. Record observed differences rather than assuming the specimen passes.

## 8. Verification checklist

- [ ] Official sources and variant semantics reviewed.
- [ ] Leading-icon content padding checked for standard and text variants.
- [ ] State-based elevation and focus layer checked against the pinned AndroidX snapshot.
- [ ] Source-contract tests pass; lint and TypeScript pass.
- [ ] Production build passes.
- [ ] Lab checked in light/dark themes.
- [ ] Hover, focus-visible, pressed and disabled checked for every canonical variant.
- [ ] French/English long labels, icons/arrows, explicit line breaks and constrained widths checked.
- [ ] Narrow viewport and 200% zoom checked; no unintended horizontal overflow.
- [ ] Computed colors/contrast checked in both themes.
- [ ] Keyboard activation, disabled non-activation and accessible naming checked.
- [ ] Remaining differences recorded as accepted adaptations or open issues.

## 9. Decision record

Approved for this implementation batch:
1. Keep pressed shape stable in Material 3 Fidelity.
2. Keep one-line labels by default; expose `multiline` opt-in for wrapping/intentional line breaks.
3. Align geometry with AndroidX references while treating CSS px as web values: 58px minimum width, 24px standard horizontal padding and 12px for text buttons.
4. Include Button, relevant tests and consumers, dedicated documentation, live Design Lab specimens and useful PostgreSQL audit records.

**Not claimed:** 100% Android parity. Native Compose ripple/window behavior, physical dp/sp equivalence, exact device rendering and assistive-technology parity cannot be guaranteed by matching CSS classes alone. The final status must reflect only checks actually performed.
