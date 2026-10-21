# Button — AndroidX Material 3 port

**Status:** Portage en cours / verification incomplete.  
**Current React implementation:** `src/components/ui/Button.tsx`  
**Design Lab:** `src/app/[locale]/design-lab/audit/ComponentLivePreview.tsx`, preview key `button`.

## Upstream authority

- [Official Material 3 Button guide](https://developer.android.com/develop/ui/compose/components/button)
- [AndroidX Button API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable)
- [AndroidX ButtonDefaults API](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults)
- [Pinned AndroidX Button.kt source](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)

**Version caveat:** the repository does not pin an AndroidX dependency version for the React port. The source snapshot above is a reference snapshot, not evidence of parity with a declared artifact version. Reconcile source, API docs and relevant token files before asserting full fidelity.

## Component identity and variants

AndroidX's public Button family includes Filled, Elevated, FilledTonal, Outlined and Text button composables. The React port should expose source-aligned names/semantics. Current Loculary variant names and compatibility aliases must be audited against actual call sites before any breaking API cleanup.

Current implementation vocabulary recorded by the previous audit:
- Canonical variants: `filled`, `elevated`, `filled-tonal`, `outlined`, `text`.
- Loculary extension: `danger` (not an official AndroidX Material 3 variant).
- Compatibility aliases previously present: `primary`, `tonal`, `secondary`, `ghost`; usage and removal safety are not yet established.

A normal Button is not inherently a toggle. Selected/toggle behavior must use the corresponding official component contract when one exists; do not overload Button semantics.

## Source-derived contract to verify

The existing audit records these CSS/Web baseline values and behaviors. They are **previously recorded implementation findings, not yet a complete verified contract**:

- Minimum height 40 CSS px and minimum width 58 CSS px.
- Standard horizontal padding 24 px; text variant 12 px.
- With leading icon: standard 16 px start / 24 px end; text 12 px start / 16 px end.
- Vertical padding 8 px; icon/label gap 8 px.
- Typography baseline 14 px / weight 500 / 20 px line-height / about 0.1 px letter spacing.
- Shape remains pill-shaped through interaction; pressed shape morphing is excluded from the selected Fidelity direction.
- Labels are single-line by default; opt-in wrapping must be explicitly tested.
- Semantic color roles, state layers, focus indication and state-based elevation vary by variant.
- Disabled colors differ by variant in the pinned AndroidX token sources; verify against the matching token files rather than applying one shared disabled treatment.

CSS pixels are Web values and must not be described as exact Android dp/sp conversions.

## React/Web adaptations

- Preserve native HTML `button` semantics, native disabled behavior, and explicit `type="button"` default; submit behavior must be intentional.
- Keep keyboard activation, focus visibility, responsive reflow and accessible naming correct for the Web.
- Pointer-origin ripple and reduced-motion behavior are Web implementation choices; verify their lifecycle and do not claim timing/rendering identity with Compose.
- `danger` and any compatibility aliases are Loculary-specific. Keep them separate from official AndroidX semantics and remove aliases only after a call-site audit.

## Required verification

- [ ] Confirm the pinned AndroidX source and public API describe the same release/commit; include relevant `ButtonDefaults` and token sources.
- [ ] Map each public React prop and variant to an official API concept or label it as a Web/Loculary extension.
- [ ] Check enabled/disabled, hover, focus-visible, pressed, leading/trailing icon and relevant layout cases.
- [ ] Verify ripple clipping/origin/cancel behavior and reduced-motion handling in a browser.
- [ ] Check computed colors, contrast and elevation in light and dark themes.
- [ ] Check FR/EN long labels, constrained widths, 200% zoom and keyboard activation.
- [ ] Run component tests, lint, TypeScript and production build.
- [ ] Record deviations as `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION` or `UNVERIFIED`.
- [ ] Audit production call sites; migrate only after the port passes its gate.

Passing static tests or a Design Lab specimen is not by itself proof of full component conformance.
