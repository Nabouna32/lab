# Typography — AndroidX Material 3 → React/Web

**Status:** implementation in progress; shared token foundation added, site-wide migration and browser verification remain open.

## Upstream authority

- Artifact: `androidx.compose.material3:material3:1.4.0` (stable candidate recorded in [sources.md](../sources.md)).
- Published source archive and SHA-256: see [sources.md](../sources.md#référence-de-portage-et-veille).
- Official API reference: [Compose Material 3 Typography](https://developer.android.com/reference/kotlin/androidx/compose/material3/Typography).
- Official typography guidance: [Material Design 3 — Typography](https://m3.material.io/styles/typography/overview).
- Provenance limitation: the published 1.4.0 source archive is the intended semantic baseline, but its producing AndroidX Git commit and exact API-dump alignment are not verified in the current repository notes. Do not claim those links are identical until proven.

## Canonical 15-role scale

The React/Web design system exposes the AndroidX Material 3 role names as CSS custom properties and semantic classes. Sizes and line heights below are the standard Material 3 typography scale, converted to `rem` for browser zoom and user font-size preferences. Letter spacing is similarly expressed as a rem reference. CSS rem is not Android sp and does not imply physical-size parity.

| Role | Size | Line height | Weight | Tracking |
|---|---:|---:|---:|---:|
| Display Large | 57 | 64 | 400 | -0.25 |
| Display Medium | 45 | 52 | 400 | 0 |
| Display Small | 36 | 44 | 400 | 0 |
| Headline Large | 32 | 40 | 400 | 0 |
| Headline Medium | 28 | 36 | 400 | 0 |
| Headline Small | 24 | 32 | 400 | 0 |
| Title Large | 22 | 28 | 400 | 0 |
| Title Medium | 16 | 24 | 500 | 0.15 |
| Title Small | 14 | 20 | 500 | 0.1 |
| Body Large | 16 | 24 | 400 | 0.5 |
| Body Medium | 14 | 20 | 400 | 0.25 |
| Body Small | 12 | 16 | 400 | 0.4 |
| Label Large | 14 | 20 | 500 | 0.1 |
| Label Medium | 12 | 16 | 500 | 0.5 |
| Label Small | 11 | 16 | 500 | 0.5 |

Numeric values in the table are Android reference magnitudes (sp). The CSS implementation converts them to rem; they must not be described as identical Android units.

## Usage contract

- Use `m3-type-display-large`, `m3-type-headline-medium`, `m3-type-title-large`, `m3-type-body-large`, `m3-type-body-medium`, `m3-type-body-small`, `m3-type-label-large`, and the corresponding remaining roles when a role is semantically appropriate.
- Component defaults must select a role from the pinned AndroidX component contract, not invent local font sizes.
- Keep numeric values, code, IP addresses, hashes, dates and tabular data legible; monospace or tabular numerals are purposeful content treatments, not alternate UI typography scales.
- A genuinely constrained single-line label may use truncation, but it should retain its role. Responsive layout should prefer wrapping/reflow over a new ad-hoc font size.
- Do not add arbitrary font-size, line-height, weight or tracking values when one of the 15 roles satisfies the requirement. If a real exception is required, document its rationale and owner in the relevant component spec.
- Existing Tailwind size classes and CSS literals are migration debt, not an alternate long-term typography API. A temporary Tailwind compatibility mapping now routes standard `text-xs` through `text-9xl` size utilities to these canonical tokens so old screens no longer draw from a second numeric scale. This bridge does not make those class names semantically correct or the migration complete: migrate call sites to `m3-type-*` roles, then remove compatibility aliases once the legacy utilities are gone.

## Web adaptations

- CSS `rem` scales with the browser root size and preserves user zoom. It is not a conversion guarantee for Android `sp`.
- Browser font rasterization, fallback glyph metrics, line breaking, intrinsic control sizing and accessibility APIs differ from Android. Preserve native HTML semantics and WCAG 2.2 AA.
- Roboto is the current Loculary interface font. Font loading and the French/English character repertoire must be verified in production builds; fallback behavior must remain usable if the web font fails.
- Technical content may use the shared monospace role for its content semantics, but should not introduce a new UI text scale.

## Verification checklist

- [ ] Compare each role against the pinned AndroidX Typography defaults and official API docs.
- [ ] Migrate shared UI components and production pages from hard-coded type declarations.
- [ ] Remove obsolete duplicate tokens and one-off sizes after auditing references.
- [ ] Add regression tests for the 15 roles and guard against new unapproved typography literals.
- [ ] Verify light/dark themes, French/English, narrow/mobile and desktop viewports, zoom/reflow, keyboard and screen-reader semantics.
- [ ] Inspect actual browser rendering; CI and static token tests alone do not establish visual parity.

## Current migration status

The canonical CSS tokens/classes exist and selected shared controls now consume them. The site-wide call-site inventory, full migration, obsolete-value cleanup, exact source provenance alignment and real-browser comparison remain incomplete. Do not mark the typography system fully verified until those checks are evidenced.
