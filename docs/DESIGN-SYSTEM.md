# Loculary — Design System Contract

**Status:** Draft specification  
**Scope:** Product / UX / visual-system contract  
**Canonical direction:** DEC-046 — Expressive Utility  
**Related decisions:** DEC-034, DEC-004, DEC-005, DEC-006, DEC-019  
**Implementation status:** Not implemented by this document

## 1. Purpose

This document defines the visual-system contract that turns Loculary's validated visual direction into durable rules that product, design and implementation workers can apply consistently.

The contract exists to create **coherence without uniformity**.

Loculary is a modern digital utility toolbox. Its platform should feel recognisably Loculary, while individual tools may use different compositions, visualizations, interaction models and levels of visual expression when their nature warrants it.

This document is a governance layer, not a component catalogue and not a CSS implementation specification.

## 2. Product principles

### 2.1 Expressive Utility

Loculary is utility-first but not visually austere.

The intended experience is:

- modern;
- polished;
- app-like;
- lively;
- precise;
- visually clear;
- responsive;
- pleasant to use.

Visual richness is a product capability. It may serve functional, experiential, identity, spatial or purely aesthetic purposes.

When two solutions are otherwise coherent, workers should generally prefer the richer solution when its additional visual expression materially improves perceived quality, continuity, character or enjoyment.

This does **not** mean animation or decoration should be added indiscriminately.

### 2.2 Optimize before suppressing

Performance is a product constraint, but performance cost alone is not a reason to reject visual richness.

The expected sequence is:

1. design the intended experience;
2. implement it coherently;
3. optimize the implementation;
4. measure the real cost;
5. reduce or remove elements when evidence shows that they are excessive, distracting, inaccessible or materially harmful.

A lighter implementation is not automatically a better experience.

### 2.3 Coherence without lowest-common-denominator UI

Platform conventions should make Loculary feel like one product.

They must not force every tool into the same card, panel, layout or animation pattern.

Shared infrastructure should establish trust and consistency. Tool-specific composition should express the nature of the task.

### 2.4 Accessibility is an adaptation layer

Accessibility requirements are part of the product contract.

In particular:

- keyboard interaction must remain complete;
- focus must remain visible and meaningful;
- semantic HTML and accessible names must be preserved;
- contrast must meet the project accessibility target;
- status must not rely on color alone;
- responsive behavior must remain usable;
- i18n must not depend on fixed English/French dimensions;
- `prefers-reduced-motion: reduce` must be respected.

Reduced motion is an accessibility adaptation of the visual experience. It is not the default visual philosophy for users who do not request it.

## 3. Semantic color system

Color is governed semantically rather than by component-specific palette decisions.

### 3.1 Core roles

The platform must provide semantic roles for:

- background;
- foreground;
- surface;
- surface-muted;
- border;
- border-subtle;
- accent;
- accent-foreground;
- focus;
- info;
- info-soft;
- info-foreground;
- success;
- success-soft;
- success-foreground;
- warning;
- warning-soft;
- warning-foreground;
- danger;
- danger-soft;
- danger-foreground.

The exact CSS variable names remain an implementation concern, but consumers must not depend on raw theme colors when a semantic role exists.

### 3.2 Foreground pairing

Status colors that can carry text, icons or interactive controls require explicit foreground semantics.

A status token is incomplete if a component must guess whether global foreground, white or black is appropriate.

This rule specifically prevents undefined roles such as a consumer requesting a status foreground token that the theme does not provide.

### 3.3 Theme compatibility

Light and dark themes are separate semantic mappings of the same roles.

A component must not assume that:

- accent means dark;
- foreground means black;
- accent text can always be white;
- a status background has the same contrast relationship in every theme.

Theme-specific contrast must be validated from the actual resolved tokens.

### 3.4 Literal colors

Literal colors remain valid when color is part of the content itself, for example:

- image/palette previews;
- generated visual content;
- syntax highlighting;
- data visualization;
- user-selected colors.

They should not replace platform semantic roles for ordinary UI.

## 4. Typography

Typography is governed by semantic roles while remaining composable through the existing CSS/Tailwind layer.

### 4.1 Platform roles

The system should expose a small vocabulary covering at least:

- page title;
- tool title;
- section title;
- body;
- supporting text;
- metadata;
- label;
- control text;
- result value;
- result supporting text;
- editorial heading/body.

Roles describe intent, not mandatory visual values.

### 4.2 Tool-specific typography

Tools may intentionally depart from platform typography when typography is part of the tool's function or identity.

Examples include:

- code editors;
- terminal-like tools;
- typography tools;
- data-heavy interfaces;
- visual generators.

Such departures should remain deliberate rather than becoming accidental copies of arbitrary Tailwind values.

### 4.3 Content and localization

Typography must tolerate:

- longer translations;
- different word lengths;
- pluralization;
- user-generated content;
- dynamic values.

No typography contract may depend on English-only line lengths.

## 5. Spacing and layout rhythm

Loculary should use a coherent spacing rhythm for platform surfaces.

The design system should govern the **meaning** of spacing tiers rather than create a token for every possible pixel value.

At minimum, implementations should distinguish:

- compact control spacing;
- standard component spacing;
- comfortable section spacing;
- major page-section spacing.

Direct low-level utility composition remains allowed.

Arbitrary spacing values should be exceptional and justified by a real visual or functional requirement.

## 6. Surfaces, radii and elevation

### 6.1 Surfaces

Platform surfaces should use semantic roles and composable primitives.

The system should avoid making every piece of content a card.

Use stronger containment when it improves:

- task grouping;
- result emphasis;
- hierarchy;
- interaction affordance;
- scanability.

Prefer open composition when containment would add visual noise.

### 6.2 Radius vocabulary

The platform should maintain a small semantic radius vocabulary.

Shared/platform components should prefer semantic radius roles.

Tool-local radius choices remain allowed when they are part of an intentional visual composition.

Arbitrary radius values should require a clear reason rather than being introduced as casual stylistic variation.

### 6.3 Elevation

Elevation should remain restrained.

A small number of semantic levels is preferred over a large shadow catalogue.

Elevation should communicate hierarchy or interaction state, not simulate depth everywhere.

## 7. Responsive behavior

Responsive design is first-class.

The system should describe breakpoint intent rather than require a new breakpoint for every layout problem.

Workers should reason about at least:

- narrow/mobile;
- compact/tablet;
- wide desktop.

The actual Tailwind breakpoint implementation may remain the platform mechanism.

Responsive adaptation may change:

- layout;
- density;
- navigation exposure;
- control grouping;
- typography scale;
- visual composition.

It must not silently remove essential tool capability merely to fit a viewport.

## 8. Motion system

### 8.1 Motion goals

Motion should make Loculary feel like a polished application.

It may provide:

- state feedback;
- spatial continuity;
- hierarchy;
- perceived responsiveness;
- tool identity;
- delight;
- ambient character;
- visual polish.

Purely visual motion is valid when it materially improves the experience.

### 8.2 Semantic motion vocabulary

The platform should provide a deliberately small vocabulary for:

- fast interaction feedback;
- standard transitions;
- slower spatial transitions;
- easing families;
- movement/intensity levels.

The goal is not to build a large animation framework.

### 8.3 Motion rules

Motion should:

- remain subordinate to the task;
- preserve interaction responsiveness;
- avoid unnecessary repetition;
- avoid causing layout instability;
- work across responsive layouts;
- have an intentional reduced-motion adaptation.

Workers should not reject motion solely because it is decorative.

They should reject or simplify it when evidence shows that it:

- obstructs the task;
- creates confusion;
- materially harms performance;
- causes accessibility problems;
- becomes visual noise.

## 9. Iconography

### 9.1 Platform identity

Platform-level icons should use a coherent visual treatment.

This includes:

- global navigation;
- catalogue identity;
- category identity;
- shared tool metadata;
- common actions.

The preferred platform treatment is a consistent icon primitive/registry rather than arbitrary emoji or Unicode glyphs.

### 9.2 Tool identity

Tools may use custom visual symbols, diagrams, previews and iconography when these are part of the tool experience.

The platform contract therefore separates:

**platform identity** → coherent icon treatment  
**tool content/identity** → expressive visual freedom within accessibility constraints

### 9.3 Accessibility

Icons must not be the sole carrier of essential meaning.

Decorative icons should not create redundant accessible names.

Interactive icon-only controls require accessible names and predictable focus behavior.

## 10. Composition model

Loculary should define patterns by **interaction role**, not by visual shape alone.

Useful composition roles include:

- discovery;
- execution/input;
- result;
- transformation/editor;
- visualization;
- advanced/mini-application.

A tool may combine multiple roles.

### 10.1 Shared shell

The shared ToolPage infrastructure should continue to provide common platform concerns such as:

- navigation/context;
- tool identity;
- processing/privacy disclosure where applicable;
- execution/result hierarchy;
- responsive behavior;
- common secondary content.

### 10.2 Tool-specific composition

The execution area may diverge substantially when the task requires it.

Examples:

- calculator → compact input/result hierarchy;
- image tool → visual canvas and preview;
- editor → workspace-oriented layout;
- generator → iterative output/result composition;
- mini-application → richer persistent workspace.

The design system must not turn these into variants of one universal component.

### 10.3 Recipes over mega-components

Repeated interaction structures may become documented recipes or small composable primitives.

Avoid creating large variant-heavy components whose main purpose is to encode every possible tool shape.

## 11. Loculary visual signature

Loculary should develop a restrained signature that distinguishes it from a generic minimalist developer-tool aesthetic.

The signature should emerge primarily from:

- typography;
- semantic color;
- iconography;
- hierarchy;
- spacing/density;
- result emphasis;
- purposeful motion;
- interaction feedback;
- composition quality.

It should **not** depend on:

- a marketing hero;
- decorative gradients everywhere;
- arbitrary color coding per tool;
- card walls;
- visual noise.

The exact signature motif remains a design exploration to be validated against real UI examples.

## 12. Design-system governance

### 12.1 What is governed

The platform contract governs product-level invariants:

- semantic color;
- typography roles;
- spacing rhythm;
- radius tiers;
- elevation;
- motion vocabulary;
- responsive intent;
- icon treatment;
- accessibility behavior;
- i18n-compatible component APIs.

### 12.2 What remains flexible

Workers may choose locally:

- exact Tailwind composition;
- tool-specific layouts;
- visualization techniques;
- custom animations;
- content-specific colors;
- tool-specific typography;
- bespoke interaction details.

The constraint is intentionality and compatibility with the platform contract.

### 12.3 Validation

Where practical, automated checks should detect high-confidence contract violations such as:

- undefined semantic tokens;
- platform components bypassing required semantic foreground roles;
- invalid accessibility primitives;
- accidental hard-coded UI strings;
- prohibited platform icon patterns.

Automation should remain lightweight. The goal is to catch drift, not create a design-system compiler.

## 13. Accessibility and internationalization requirements

Every implementation derived from this contract must preserve:

- WCAG 2.2 AA project target;
- keyboard operation;
- visible focus;
- semantic status communication;
- sufficient contrast in every supported theme;
- reduced-motion behavior;
- responsive usability;
- French and English localization;
- expansion for longer translated strings;
- accessible names for icon-only controls.

Visual richness never overrides these requirements.

## 14. Performance requirements

Visual richness must remain compatible with the performance contract.

Workers should:

- prefer code-splitting for heavy tool experiences;
- avoid unnecessary main-thread work;
- preserve responsive interaction;
- optimize animations rather than deleting them prematurely;
- use progressive loading where appropriate;
- validate heavy visual experiences on representative lower-capability devices.

A performance concern should result first in optimization or adaptation. Removal of visual expression is a later decision supported by evidence.

## 15. Non-goals

This contract does not define:

- exact brand colors;
- exact pixel values for every token;
- exact animation durations/easings;
- a mandatory icon library;
- a universal ToolPage component;
- a complete component catalogue;
- a per-tool visual theme system;
- a return to Sober/Playful modes;
- implementation details for CSS/Tailwind;
- visual-regression CI policy.

Those may be specified separately when evidence and product validation justify them.

## 16. Implementation boundary

This document establishes product/design intent.

It does not authorize an implementation worker to:

- redesign unrelated screens;
- migrate every component at once;
- replace Tailwind;
- introduce a heavyweight design-system runtime;
- alter product vision;
- change privacy or data-processing behavior;
- create a different visual direction.

Implementation should proceed through small, independently verifiable steps.

## 17. Current open design decisions

The following remain explicit decisions rather than assumptions:

1. the final semantic color taxonomy and exact token mapping;
2. the final typography-role values;
3. the final spacing/radius/elevation token values;
4. the exact motion easing/intensity vocabulary;
5. the exact platform icon library/treatment;
6. the concrete Loculary signature motif;
7. the appropriate semantic ToolPage composition variants;
8. the scope and CI policy for visual regression.

These details must remain coherent with DEC-046 and must not reinterpret the validated rich-by-default direction.

## 18. Recommended implementation sequence

Once the remaining design details are validated, implementation should proceed in this order:

1. semantic token correctness and theme contrast;
2. platform typography and spacing roles;
3. iconography foundation;
4. motion/easing primitives;
5. semantic composition recipes;
6. restrained Loculary signature exploration;
7. visual validation matrix;
8. cleanup and governance checks.

Each step should be independently validated and should avoid unrelated migration.

## 19. Relationship to canonical documents

This contract operationalizes, but does not replace:

- `docs/VISION.md`;
- `docs/PRODUCT.md`;
- `docs/UX.md`;
- `docs/ACCESSIBILITY.md`;
- `docs/PERFORMANCE.md`;
- `docs/I18N.md`;
- `docs/DECISIONS.md`.

Where a conflict appears, the canonical decision and product documents remain authoritative until a new decision is explicitly validated.

Audit findings remain evidence and recommendations; they do not become requirements merely because they appear in an audit report.
