# Loculary — Material 3 Expressive Design System Contract

**Status:** Accepted production design direction; detailed tokens and implementation remain to be validated  
**Canonical direction:** DEC-048 — Material 3 Expressive as Loculary's shared design-system foundation  
**Related decisions:** DEC-004, DEC-034, DEC-048  
**Scope:** Shared platform UX, foundations and reusable components  
**Implementation status:** This document defines intent; it does not claim that the current production UI already conforms to M3 Expressive.

## 1. Purpose and hierarchy

Loculary adopts **Material 3 Expressive** as the reference for its shared platform experience. Expressive foundations shape navigation, controls, typography, semantic color, shape, elevation, iconography, interaction states and motion into a distinctive, lively and coherent interface suited to a responsive web utility toolbox.

This is a production direction, not merely an experimental palette. Use M3 Expressive guidance across shared foundations and components, adapting Android-oriented patterns to the Web rather than reproducing Android screens literally.

**Loculary's deliberate target is the look and feel of a polished modern Android/Pixel app.** This is an intentional product choice, not just a loose source of inspiration: the web interface should feel tactile, lively and application-like through component shapes, iconography, typography, responsive navigation, feedback, state transitions and motion. Adapt platform patterns to web conventions; do not imitate individual Android screens or compromise keyboard, pointer, touch, browser navigation or responsive behavior.

#### Expressive color and motion in practice

- Use the blue-seeded semantic scheme and official MCU Rainbow tones with confidence. The interface must not drift into an all-pastel, uniformly muted or washed-out look. Prefer vivid, saturated accents for primary actions, selected states, category markers and small expressive surfaces; use softer tonal containers for larger areas and dense content.
- Strong color is a hierarchy tool, not decoration everywhere. Preserve semantic roles, readable foregrounds, contrast, focus visibility and calm surfaces around the task. Never force every component to use a different rainbow color.
- Use Material-like shape, component state and motion as one coherent system: clear pressed/selected/focused/disabled feedback, fluid but brief transitions, and spatial continuity where it helps users understand a change. Motion may add delight, but should not delay the task or become noise.
- Honor `prefers-reduced-motion`, keyboard navigation, screen readers, WCAG 2.2 AA, light/dark parity and mobile/tablet/desktop behavior. Reduced motion must remove nonessential movement without removing state feedback.
- Build from shared tokens and components first. Do not introduce per-screen palettes, arbitrary one-off motion curves or inconsistent icon families to simulate Expressive design.

The design-system contract follows this hierarchy:

1. **Expressive foundations** — semantic color roles, typography hierarchy, shape, elevation, iconography, motion and states.
2. **Shared behavior** — accessible, responsive and predictable navigation and reusable controls.
3. **Loculary composition** — the homepage, explorer, tool shell and other platform surfaces apply those foundations to Loculary's task-first journeys.
4. **Tool-specific UI** — specialized tools may use different layouts, density, visualizations and interactions when their task requires it.

M3 Expressive is a design reference, not a requirement to adopt a particular React component package or reproduce Google's product UI. The implementation may use the existing web stack or replace individual abstractions where evidence supports doing so.

## 2. Product and composition principles

### 2.1 Utility-first, Expressive-consistent

Loculary is a digital toolbox. Shared UI should feel coherent and familiar while keeping the tool and its result central. Design consistency comes from foundations, hierarchy and behavior—not from placing everything inside identical cards.

### 2.2 Preserve meaningful tool diversity

DEC-004 remains active. A calculator, image editor, data analysis tool and visual generator do not need the same composition. Specialized layouts, visualizations and task-specific interactions remain allowed when they improve the tool. They must respect shared platform navigation, accessibility, localization and trust requirements.

### 2.3 Challenge the current implementation

Existing screens, CSS tokens and shared primitives are not immutable. If their structure prevents a coherent M3 Expressive implementation, a focused refactor or replacement is preferable to layering variants onto a weak abstraction. Do not rewrite unrelated areas merely because a redesign is underway.

### 2.4 Brand identity is not the component system

Loculary's logo and wordmark are brand assets. Functional icons, navigation symbols and action icons belong to the interface iconography system. They should be coherent with the Material 3 Expressive interface language without forcing the brand mark to look like a generic Material icon. The supplied SVG remains a candidate, not an approved final asset.

## 3. Color and themes

### 3.1 Semantic tonal roles

The platform must use semantic roles based on M3's tonal color model rather than choosing arbitrary colors independently in each component. The role set must cover, as applicable:

- primary and on-primary;
- primary container and on-primary-container;
- secondary and on-secondary;
- secondary container and on-secondary-container;
- tertiary and on-tertiary;
- tertiary container and on-tertiary-container;
- background and on-background;
- surface and on-surface;
- surface variants and their foregrounds;
- outline and outline-variant;
- inverse surface, inverse foreground and inverse primary;
- error and on-error;
- error container and on-error-container;
- focus and other required interaction-state indicators.

The concrete CSS variable names and exact mappings are implementation details. Use the current official M3 role definitions as the reference when implementing tokens; do not invent a second parallel vocabulary without a demonstrated need.

### 3.2 Light and dark themes

Light and dark themes must implement the same semantic contract with theme-appropriate tonal mappings. Components must not assume that a role always resolves to white, black, a dark shade or a fixed contrast relationship.

Theme support must be tested using the actual resolved colors, including text, icons, borders, focus indicators, disabled states, overlays and status messages.

### 3.3 Default palette

The default appearance uses the blue seed **#4285F4** to generate semantic tonal roles and the official Material Color Utilities (MCU) Rainbow scheme. The seed is an input, not a mandate to use that literal value for every primary component. Generate or select complete light/dark role mappings deliberately and validate their actual contrast and state clarity.

Use the **official MCU Rainbow scheme as Loculary's single rainbow palette**. Its tonal range should serve both expressive surfaces/frame backgrounds and vivid category differentiation: use softer tones for large surfaces and stronger, more saturated tones for compact accents such as pills, badges and markers where they remain legible. Do not keep a parallel Loculary-specific palette merely to obtain vivid colors; first use the official scheme's available tones. Avoid rainbow decoration on every component, and validate foreground contrast for each use. Semantic success, warning and error colors remain independent of the brand seed and Rainbow palette.

The light/dark theme preference is local-first for anonymous users and may be synchronized with the signed-in account when account-preference persistence is implemented. This document does not claim that the settings UI or synchronization already exists.

### 3.4 Status and content colors

Success, warning, informational and other domain-specific colors may be added as explicit semantic roles when the product requires them. Status must never be communicated by color alone. Literal colors remain appropriate when color is itself user content, such as palette previews, generated images, syntax highlighting or data visualization.

## 4. Typography

Typography should follow M3's role-based hierarchy, adapted to the density and task requirements of a utility toolbox. The system should define clear roles for display, headline, title, body and label scales, using the appropriate levels rather than inventing arbitrary per-component sizes.

**Roboto is the validated default interface typeface**, consistent with the Material/Android reference. The M3 type scale, weight mappings, sizes, line heights and letter spacing still require implementation and responsive validation. Geist Sans/Mono may remain appropriate for existing technical or monospace use where they serve a clear purpose, but they are not the default interface family.

Technical content may use a monospace role where it improves alignment or readability. Results may receive stronger hierarchy when they are the primary outcome of a tool.

Typography must support longer translations, pluralization, dynamic values, user-generated content, responsive widths and future locale expansion. Do not rely on English-only line lengths or fixed heights that clip translated text.

## 5. Shape, surfaces and elevation

Use M3's shape and surface principles to express hierarchy and interaction. Concrete shape tokens and values remain implementation choices to validate against representative Loculary screens.

- Cards are first-class Material 3 components and are a normal, encouraged option wherever they help group content, express hierarchy or present an interactive destination. Do not avoid cards by default.
- Choose the appropriate M3 card variant and composition for the content and interaction; the official M3 guidance defines multiple card variants rather than one universal card style. See [Material 3 cards](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Compose screens with cards, open layouts or a mixture according to the task, hierarchy, responsiveness and visual identity. No general rule requires either using cards everywhere or avoiding them.
- Use shape, elevation and overlays deliberately to express hierarchy, interaction and depth; avoid adding visual effects without a purpose.
- Validate surfaces and elevation in both light and dark themes.

The implementation should consolidate repeated stable values into semantic roles rather than preserve a large arbitrary ladder of CSS utility values. Tool-local shapes and surfaces remain possible when they are intentional and do not undermine platform behavior.

## 6. Iconography

Shared platform icons should follow the Material Symbols visual language, using consistent sizing, alignment, stroke/weight treatment and state behavior. The exact package, variable-font configuration and loading strategy are implementation choices, but platform icons should not be a mixture of unrelated icon families without a clear reason.

Icons must communicate the same action consistently across the platform. Common navigation actions—including menu/hamburger, search, back, close, settings and language selection—should use consistent functional symbols and accessible names.

- Icon-only controls require accessible names and usable hit targets.
- Icons must not be the only way to communicate a critical status.
- Decorative icons should be hidden from assistive technology when appropriate.
- Do not use emoji or arbitrary Unicode glyphs as substitutes for platform action icons.
- Tool-specific symbols and visual content remain allowed when they serve the tool's function.
- The Loculary brand mark is not required to be a Material Symbol.

## 7. Shared components and interaction states

Shared components should follow the relevant M3 component guidance where that component exists. This includes buttons, icon buttons, text fields, selection controls, checkboxes, switches, chips, menus, dialogs, tooltips, navigation patterns, tabs and progress indicators as used by the product.

The platform should provide coherent variants and state behavior instead of component-specific visual inventions. Follow M3 Expressive component guidance where it exists, while retaining the underlying M3 semantic and accessibility contracts. Do not implement every component just because it exists in the specification; include components based on real product needs.

Interactive components must define, where applicable:

- enabled, hover, focus, pressed, selected and disabled states;
- keyboard behavior and focus management;
- loading, success, error and validation feedback;
- accessible name, role, value and state;
- touch-friendly target size;
- responsive behavior and content overflow.

A semantic HTML control or small focused component is preferable to a custom interaction abstraction when it already meets the contract. Refactor when the current primitive cannot express the required M3 Expressive behavior cleanly; do not preserve weak abstractions only to minimize the diff.

## 8. Motion and feedback

Use M3 Expressive motion principles to clarify cause and effect, state transitions and spatial relationships. Motion is not mandatory on every interaction and must not delay task completion.

Motion should:
- communicate state or spatial continuity when useful;
- remain quick and non-obstructive for frequent utility workflows;
- avoid gratuitous movement and competing animations;
- respect `prefers-reduced-motion`;
- preserve essential information when animation is reduced or removed;
- remain responsive on lower-capability devices.

Exact durations, easing curves and transition recipes remain open for implementation and validation. Use expressive motion selectively where it improves feedback, spatial continuity or delight; respect reduced-motion preferences and never delay task completion.

## 9. Component architecture and composition

Use a layered architecture that separates reusable behavior from page composition and tool-owned experience:

1. **Foundations** — semantic color, typography, shape, elevation, focus, motion and responsive intent.
2. **Behavioral primitives** — focused reusable interactions such as buttons, fields, selection, disclosure, feedback and navigation.
3. **Composition patterns** — documented structures for discovery, execution/input, results, editing, visualization and advanced workspaces.
4. **Tool-specific UI** — the actual task experience, which may combine or bypass shared composition patterns when a specialized structure is better.

A pattern should be reused because its behavior or structural relationship genuinely recurs, not merely because two elements look similar. Prefer a documented pattern over a new component when code reuse adds little value. Avoid mega-components with many visual variants, arbitrary styling props, hidden business logic or forced DOM structures.

The shared tool shell should own platform concerns such as navigation, tool identity, processing/privacy disclosure, responsive behavior and common secondary content. The tool owns its task-specific controls, result visualization and domain interaction. Refactor or replace existing abstractions when they obstruct the M3 Expressive target; do not preserve them solely to minimize changes.

Do not build the entire M3 Expressive component catalogue preemptively. Select components from actual product needs, validate them in representative tool compositions and keep each migration scope independently verifiable.

## 10. Responsive composition

Desktop, tablet and mobile are first-class experiences. Do not design a desktop interface and merely compress it.

Responsive behavior should preserve task hierarchy and useful interaction targets. Recompose navigation, tool controls, result areas, dialogs and menus when the viewport changes. Test long localized strings, zoom, narrow widths, touch interaction and landscape layouts.

Secondary content must not reduce the usable tool area below an acceptable level or obstruct inputs, results, navigation or critical controls.

## 11. Accessibility, localization and quality

M3 Expressive adoption does not replace Loculary's product quality requirements. All shared UI and tool interfaces must continue to support:

- WCAG 2.2 AA as the project target;
- complete keyboard operation and visible focus;
- semantic HTML and assistive-technology names/states;
- sufficient text and non-text contrast in every theme;
- understandable validation and error feedback;
- reduced-motion preferences;
- French and English initially, with extensible localization and future RTL support;
- longer translations without clipping or broken layouts;
- privacy and processing transparency where relevant.

Test behavior, not just visual resemblance to M3 Expressive. A visually similar component that breaks keyboard navigation, localization or task flow is not compliant with this contract.

## 12. Validation before freezing visual tokens

Before finalizing concrete tokens or migrating the entire shared UI, evaluate representative compositions:

- homepage/search and primary navigation;
- explorer/discovery;
- a compact utility tool;
- a result-heavy tool;
- a data-dense or advanced tool;
- a visual/generator-oriented tool;
- a mini-application/workspace;
- narrow/mobile and wide desktop;
- light and dark themes;
- long localized content and reduced-motion behavior.

The review should verify consistency with M3 Expressive, task clarity, visual distinction between hierarchy levels, tool-specific flexibility, accessibility, responsiveness, the quality of light/dark mappings and the usefulness of the resulting interactions.

## 13. Governance and implementation boundary

This document establishes the current product/design contract; it does not prove that the application has been migrated.

The default semantic color seed is #4285F4 and Roboto is the validated default interface typeface. The official MCU Rainbow scheme is the sole rainbow palette; use its tonal range for both expressive surfaces and vivid compact accents, validating saturation and contrast for each context. Remaining implementation details include complete light/dark tonal mappings, exact token values, component inventory, package/loading choices, final logo treatment and migration sequencing. Validate the resulting palettes and representative screens before freezing concrete tokens.

Implementation should be staged into small, verifiable scopes. Existing components may be refactored or replaced when necessary to meet this contract, but must not silently change unrelated product behavior, privacy, architecture or scope.

## 14. Relationship to canonical documents

This contract is governed by DEC-048 and must remain coherent with:

- `docs/UX.md`;
- `docs/PROJECT_INSTRUCTIONS.md`;
- `docs/ACCESSIBILITY.md`;
- `docs/PERFORMANCE.md`;
- `docs/I18N.md`;
- `docs/DECISIONS.md`.

When a conflict is found, surface it and resolve it through the documented decision process rather than silently retaining obsolete guidance.

## Shared navigation and transient surfaces

- The Loculary mark/wordmark is a brand asset, separate from functional SVG icons. The current SVG in `LocularyLogo` is an initial implementation candidate, not a final brand decision. Use the shared component rather than recreating a letter tile or drawing a brand mark from an interface icon.
- Header popovers that mix navigation links with settings are disclosures, not automatically ARIA `menu` widgets. Use a real menu role only when its full menu keyboard interaction model is implemented.
- Keep the popup open while the user changes an inline setting (for example, light/dark/system theme or language) so related choices can be made without reopening it. Ordinary navigation links close it; clicking outside or pressing Escape dismisses it.
- Closed popovers must not leave their descendants keyboard-focusable. Use `inert` or an equivalent robust hidden-state implementation alongside the appropriate expanded state.
- Escape returns focus to the control that opened a popup when that popup closes. If Escape only dismisses a nested surface (such as search suggestions), focus remains in that surface. An outside pointer action must not steal focus back from the control the user actually selected.
- On mobile, primary icon controls and footer links should provide a practical touch target around 48 CSS px where layout permits. Preserve visible focus, sufficient contrast, responsive fit and reduced-motion preferences.
- Mobile header search opens with focus in the field and closes on outside pointer or route change. Do not add a separate close control when it only duplicates outside dismissal and Escape. Escape first dismisses the suggestions/status popup; a subsequent Escape closes the panel and restores focus to its trigger. Outside pointer dismissal leaves focus with the clicked target.
- A search field has one deliberate clear control. When a consistent custom clear action is needed, suppress browser-native clear UI by using a text input with search-oriented mobile keyboard hints rather than rendering a second clear button beside `type="search"`.
- Suggestion surfaces must remain anchored to their search field, visibly elevated and unclipped by ancestor overflow or stacking contexts. Fix the actual stacking/clipping relationship; do not rely on arbitrary z-index escalation. Keep listbox options semantically separate from loading, error and no-result actions, and synchronize combobox ARIA state with the visible popup.
- Treat Android/Material guidance as a reference adapted to the web platform, not as a mandate to copy native screens or force a navigation drawer where a compact disclosure better fits the small number of destinations and mixed settings.


## 15. Official Material 3 Expressive component matrix

**Reference checked:** 2026-10-11. This matrix separates documented M3 principles from Loculary-specific recommendations and decisions still open. It is a design contract and evaluation basis, not evidence that the current UI conforms.

| Area | Verified official guidance | Loculary application / recommendation | Decision status |
|---|---|---|---|
| Cards and content containers | M3 defines filled, elevated and outlined cards for coherent grouped content; the variants are not interchangeable decoration. [Cards](https://developer.android.com/develop/ui/compose/components/card?hl=fr) | Treat cards as a normal, first-class M3 option. Choose variant, content, density and responsive composition to support discovery, grouping and interaction; combine cards with open layout where that best serves the hierarchy. | Principle confirmed; homepage composition remains open. |
| Buttons | M3 distinguishes filled, tonal, elevated, outlined and text buttons by emphasis and role. [Buttons](https://developer.android.com/develop/ui/compose/quick-guides/content/create-button?hl=en) | Establish one shared hierarchy: strongest action uses the strongest appropriate variant; secondary, alternate and low-emphasis actions use less prominent variants. Do not make every action a large filled CTA or choose variants by appearance alone. Map each existing action to its real task before styling. | Principle confirmed; inventory and mapping remain to be implemented. |
| Icon buttons | M3 documents standard action buttons and toggle buttons, including selected/unselected state. Icons need an unambiguous meaning. [Icon buttons](https://developer.android.com/develop/ui/compose/components/icon-button?hl=fr) | Use a real button with an accessible name for icon-only actions; distinguish momentary actions from toggles and expose toggle state. Use one consistent icon source/style and avoid duplicate clear/close controls. | Principle confirmed; shared web primitive and inventory remain to be implemented. |
| Text fields and forms | M3 provides filled and outlined text-field treatments; the simpler basic field is appropriate only when its missing decoration is intentional. [Text fields](https://developer.android.com/develop/ui/compose/text/user-input) | Choose a small, consistent set of field treatments by context. Preserve visible labels, helper/error text, keyboard behavior and focus. Do not style inputs by ad hoc page-level rules. Web markup, validation and autofill behavior require web-specific verification. | Principle confirmed; exact default variant remains to be evaluated against current forms. |
| Search | M3 documents a persistent search field and an expanded state for suggestions or filtered results; it is recommended when search is a primary task. [Search bar](https://developer.android.com/develop/ui/compose/components/search-bar?hl=fr) | Search is a primary Loculary journey. Preserve a clear field, meaningful leading icon, deliberate trailing action, readable text and an anchored result surface. Choose the correct web accessibility pattern for the actual content (combobox/listbox or ordinary links), keep ARIA state synchronized, and prevent clipping/stacking defects. Do not copy Compose API states literally into web code. | Direction confirmed; current implementation and semantics require correction/verification. |
| Navigation and transient panels | M3 offers navigation drawers, including modal and standard variants, for section navigation and feature discovery. [Navigation drawer](https://developer.android.com/develop/ui/compose/components/drawer?hl=fr) | A drawer is a valid option, not a mandatory M3 pattern. The current header panel mixes navigation and settings, so its disclosure behavior and keyboard model must remain coherent. Compare anchored panel vs mobile drawer/sheet against destination count, screen space, focus behavior and settings persistence; retain the simpler pattern if it better serves the actual navigation. | No drawer decision made; compare compositions before implementation. |
| Typography | M3 uses semantic roles grouped as display, headline, title, body and label, with size levels; the official guide notes that a product may not need all 15 default styles. [Typography and theming](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr) | Keep Roboto as the validated interface typeface. Map headings, body, labels, tool results and metadata to a deliberately reduced semantic scale; remove arbitrary weight/size combinations and check wrapping, line-height and FR/EN long strings. The Android default scale is a reference, not an unverified CSS prescription. | Typeface confirmed; actual role mapping and responsive values remain to be verified. |
| Semantic color and themes | M3 uses semantic roles and tonal palettes; foreground/background roles must be paired deliberately for contrast. [M3 theming and accessibility](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr) | Use the blue #4285F4 seed and official Material Color Utilities Rainbow palette. Use semantic roles rather than scattering literal hex values. Keep success, warning, error and informational meaning independent of brand/category palettes; validate resolved light/dark pairs, focus, disabled and selected states. | Existing palette direction confirmed; complete role/state mapping still needs validation. |
| Shape | M3's shape scale ranges from less-rounded to fully circular shapes; shapes can express hierarchy, state and brand. [M3 theming and shapes](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr) | Define a purposeful shape vocabulary for fields, buttons, cards, chips, popovers and dialogs. Expressive does not mean giving every element the maximum radius. Avoid unrelated one-off radii and verify nested components look intentional. | Principle confirmed; final web tokens remain open. |
| Surfaces and elevation | M3 can distinguish surfaces through tonal elevation as well as shadow elevation; tonal color is not merely a shadow replacement to apply indiscriminately. [M3 surface/elevation guidance](https://developer.android.com/develop/ui/compose/designsystems/material2-material3) | Build hierarchy from background, surface/container roles, borders and restrained shadows. Avoid repeated card-on-card layers and universal shadows; test dark mode separately because tonal mappings change. Do not copy Android elevation numbers directly to CSS. | Principle confirmed; surface/token mapping remains to be verified. |
| Chips and category accents | M3 chips are compact components for attributes, entities, selection, filtering or actions; their role depends on behavior. [M3 component reference](https://developer.android.com/reference/kotlin/androidx/compose/material3/) | Use a chip only when its interaction/meaning matches the pattern. A category link, filter control and status badge are not automatically the same component. Preserve the validated dual rainbow role: MCU tonal surfaces for suitable containers; saturated category colors for compact differentiation. | Direction confirmed; map each current category/status use to the correct semantic role. |
| Interaction states | M3 components expose state-aware behavior such as enabled/disabled, pressed, focused and selected. Theming must preserve readable foreground/background combinations. [M3 theming](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr) | Audit hover, focus-visible, pressed, disabled, selected, loading, success and error states across shared controls and both themes. Do not communicate status by color alone; ensure keyboard focus is visible and state semantics are programmatically exposed. | Required by the contract; inventory and verification pending. |
| Motion | M3 Expressive includes updated motion guidance; Compose exposes standard and expressive motion schemes for different interaction prominence. [M3 Expressive overview](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=fr) · [MotionScheme API](https://developer.android.com/reference/kotlin/androidx/compose/material3/MotionScheme) | Use motion to explain state changes, continuity or important hierarchy—not as decoration on every element. Respect reduced-motion preferences. Compose timings/API are Android-specific; exact web durations and easing are **not verified** by this matrix and must be sourced before tokenizing them. | Principle confirmed; web motion tokens remain unverified/open. |
| Accessibility and touch | Android Material guidance targets at least 48 dp for touch targets. WCAG 2.2 AA sets a web pointer-target minimum of 24 × 24 CSS px with defined exceptions; these units and requirements are not interchangeable. [Android target sizes](https://developer.android.com/develop/ui/compose/accessibility/api-defaults?hl=fr) · [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | Retain the Loculary target of around 48 CSS px for primary mobile controls where layout permits, while meeting WCAG requirements for all targets. Verify keyboard use, focus order, accessible names, popup semantics, contrast, zoom/reflow and reduced motion; do not infer accessibility from visual similarity to Android. | Requirement confirmed; actual rendered behavior must be tested. |
| Icons and brand | Official Material guidance distinguishes current Material Symbols from the older Material Icons library; icons should communicate actions clearly. [Official icon guidance](https://developer.android.com/develop/ui/compose/graphics/images/material) | Keep the Loculary logo/wordmark separate from functional icons. Use a coherent, current icon family and consistent stroke/fill sizing; do not mix unrelated emoji, custom SVGs and icon families without a deliberate content reason. | Principle confirmed; final icon family and current inventory still require review. |

### 15.1 Decisions to discuss from this matrix

1. **Homepage category composition — recommendation:** start from a responsive M3 card composition because categories are meaningful destinations with discoverable identity. Evaluate the hierarchy, density and responsive layout alongside the primary search; the presence or number of cards is not itself a reason to reject the composition. Compact links remain an alternative only if they demonstrably serve discovery and responsive fit better.
2. **Mobile navigation — recommendation:** keep the existing anchored disclosure as the baseline candidate because it combines a small navigation set with inline settings. Compare a modal drawer or sheet only if the actual information architecture or mobile usability demonstrates a benefit. M3 itself does not settle this product-specific choice.
3. **Shared controls — recommendation:** define the semantic variants and states before restyling individual pages, then migrate the header, search and representative tool flows through shared primitives. This reduces visual drift without forcing specialized tools into one layout.

### 15.2 Source and verification boundaries

- The sources above are official Android Developers API/guidance pages and W3C WCAG documentation, checked on 2026-10-11.
- The official M3 overview describes M3 Expressive as an expansion of M3 affecting theming, components, motion and typography. Some M3 web pages depend on JavaScript and did not expose readable content in the research environment; where this matrix uses Android Compose guides, it cites them explicitly rather than pretending they are web CSS specifications.
- This matrix verifies guidance, not Loculary conformance. Actual implementation status requires source inspection and, for visual/interaction claims, a real rendered browser check.
- Do not introduce a component library or copy Android API constants solely because the reference uses Compose. Choose the web implementation only after checking the current repository, official web-platform requirements and the maintenance cost.
