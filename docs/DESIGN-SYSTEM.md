# Loculary — Material 3 Design System Contract

**Status:** Accepted platform direction; concrete visual tokens and implementation remain to be validated  
**Canonical direction:** DEC-048 — Material 3 as Loculary's shared design-system foundation  
**Related decisions:** DEC-004, DEC-034, DEC-048  
**Scope:** Shared platform UX, foundations and reusable components  
**Implementation status:** This document defines intent; it does not claim that the current UI already conforms to M3.

## 1. Purpose and hierarchy

Loculary adopts **Material 3 (M3)** as the reference system for the shared platform experience. M3 provides the common visual and interaction language for navigation, controls, typography, semantic color, shape, elevation, iconography and motion.

This is an adoption of **Material 3, not Material 3 Expressive**. Do not import M3 Expressive-specific guidance or patterns without a separate decision.

The design-system contract follows this hierarchy:

1. **M3 foundations** — semantic color roles, typography hierarchy, shape, elevation, iconography, motion and states.
2. **Shared behavior** — accessible, responsive and predictable navigation and reusable controls.
3. **Loculary composition** — the homepage, explorer, tool shell and other platform surfaces apply those foundations to Loculary's task-first journeys.
4. **Tool-specific UI** — specialized tools may use different layouts, density, visualizations and interactions when their task requires it.

M3 is a design reference, not a requirement to adopt a particular React component package or reproduce Google's product UI. The implementation may use the existing web stack or replace individual abstractions where evidence supports doing so.

## 2. Product and composition principles

### 2.1 Utility-first, M3-consistent

Loculary is a digital toolbox. Shared UI should feel coherent and familiar while keeping the tool and its result central. Design consistency comes from foundations, hierarchy and behavior—not from placing everything inside identical cards.

### 2.2 Preserve meaningful tool diversity

DEC-004 remains active. A calculator, image editor, data analysis tool and visual generator do not need the same composition. Specialized layouts, visualizations and task-specific interactions remain allowed when they improve the tool. They must respect shared platform navigation, accessibility, localization and trust requirements.

### 2.3 Challenge the current implementation

Existing screens, CSS tokens and shared primitives are not immutable. If their structure prevents a coherent M3 implementation, a focused refactor or replacement is preferable to layering variants onto a weak abstraction. Do not rewrite unrelated areas merely because a redesign is underway.

### 2.4 Brand identity is not the component system

Loculary's logo and wordmark are brand assets. Functional icons, navigation symbols and action icons belong to the interface iconography system. They should be coherent with M3 without forcing the brand mark to look like a generic Material icon. The supplied SVG remains a candidate, not an approved final asset.

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

### 3.3 Brand seed and exact palette remain open

This decision does not select a final brand seed color, primary hue, tonal palette or full light/dark mapping. Those choices require a dedicated visual proposal and contrast review. Do not retain the current blue palette merely because it already exists, and do not replace it with an arbitrary Material default without evaluation.

System dynamic color is not required by this decision. Any future dynamic-color support must have predictable fallbacks and must not compromise Loculary's brand or accessibility.

### 3.4 Status and content colors

Success, warning, informational and other domain-specific colors may be added as explicit semantic roles when the product requires them. Status must never be communicated by color alone. Literal colors remain appropriate when color is itself user content, such as palette previews, generated images, syntax highlighting or data visualization.

## 4. Typography

Typography should follow M3's role-based hierarchy, adapted to the density and task requirements of a utility toolbox. The system should define clear roles for display, headline, title, body and label scales, using the appropriate levels rather than inventing arbitrary per-component sizes.

The concrete typeface, font files, weight mappings, sizes, line heights and letter spacing remain open. Geist Sans/Mono are existing implementation facts, not a validated requirement to keep them or a decision to replace them. Evaluate the current family against the chosen M3 type scale and representative screens before freezing the typeface.

Technical content may use a monospace role where it improves alignment or readability. Results may receive stronger hierarchy when they are the primary outcome of a tool.

Typography must support longer translations, pluralization, dynamic values, user-generated content, responsive widths and future locale expansion. Do not rely on English-only line lengths or fixed heights that clip translated text.

## 5. Shape, surfaces and elevation

Use M3's shape and surface principles to express hierarchy and interaction. Concrete shape tokens and values remain implementation choices to validate against representative Loculary screens.

- Do not round every element by default.
- Do not turn every region into a card.
- Use containment when it clarifies grouping, result emphasis or interaction.
- Use open composition when spacing and hierarchy already communicate relationships.
- Use elevation and overlays to communicate meaningful depth or transient interaction, not as decoration on every surface.
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

The platform should provide coherent variants and state behavior instead of component-specific visual inventions. Do not implement every M3 component just because it exists in the specification; include components based on real product needs.

Interactive components must define, where applicable:

- enabled, hover, focus, pressed, selected and disabled states;
- keyboard behavior and focus management;
- loading, success, error and validation feedback;
- accessible name, role, value and state;
- touch-friendly target size;
- responsive behavior and content overflow.

A semantic HTML control or small focused component is preferable to a custom interaction abstraction when it already meets the contract. Refactor when the current primitive cannot express the required M3 behavior cleanly; do not preserve weak abstractions only to minimize the diff.

## 8. Motion and feedback

Use M3 motion principles to clarify cause and effect, state transitions and spatial relationships. Motion is not mandatory on every interaction and must not delay task completion.

Motion should:
- communicate state or spatial continuity when useful;
- remain quick and non-obstructive for frequent utility workflows;
- avoid gratuitous movement and competing animations;
- respect `prefers-reduced-motion`;
- preserve essential information when animation is reduced or removed;
- remain responsive on lower-capability devices.

Exact durations, easing curves and transition recipes remain open for implementation and validation. Do not assume M3 Expressive motion guidance is part of this decision.

## 9. Responsive composition

Desktop, tablet and mobile are first-class experiences. Do not design a desktop interface and merely compress it.

Responsive behavior should preserve task hierarchy and useful interaction targets. Recompose navigation, tool controls, result areas, dialogs and menus when the viewport changes. Test long localized strings, zoom, narrow widths, touch interaction and landscape layouts.

Advertising or secondary content must not reduce the usable tool area below an acceptable level or obstruct inputs, results, navigation or critical controls.

## 10. Accessibility, localization and quality

M3 adoption does not replace Loculary's product quality requirements. All shared UI and tool interfaces must continue to support:

- WCAG 2.2 AA as the project target;
- complete keyboard operation and visible focus;
- semantic HTML and assistive-technology names/states;
- sufficient text and non-text contrast in every theme;
- understandable validation and error feedback;
- reduced-motion preferences;
- French and English initially, with extensible localization and future RTL support;
- longer translations without clipping or broken layouts;
- privacy and processing transparency where relevant.

Test behavior, not just visual resemblance to M3. A visually similar component that breaks keyboard navigation, localization or task flow is not compliant with this contract.

## 11. Validation before freezing visual tokens

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

The review should verify consistency with M3, task clarity, visual distinction between hierarchy levels, tool-specific flexibility, accessibility, responsiveness and the usefulness of the resulting interactions.

## 12. Governance and implementation boundary

This document establishes the current product/design contract; it does not prove that the application has been migrated.

Open details include the final color seed and mappings, typeface, exact token values, component inventory, package/loading choices, final logo treatment and migration sequencing. Consequential brand or visual choices should be proposed for validation before they become fixed requirements.

Implementation should be staged into small, verifiable scopes. Workers may refactor or replace existing components when necessary to meet this contract, but must not silently change unrelated product behavior, privacy, architecture or scope.

## 13. Relationship to canonical documents

This contract is governed by DEC-048 and must remain coherent with:

- `docs/UX.md`;
- `docs/PROJECT_INSTRUCTIONS.md`;
- `docs/ACCESSIBILITY.md`;
- `docs/PERFORMANCE.md`;
- `docs/I18N.md`;
- `docs/DECISIONS.md`.

When a conflict is found, surface it and resolve it through the documented decision process rather than silently retaining obsolete guidance.
