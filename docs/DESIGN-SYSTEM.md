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

### 2.5 Expressive app personality

Loculary should feel like a **real application with a distinct personality**, not merely a highly polished collection of web pages.

The visual direction therefore intentionally allows:

- expressive but coherent color;
- visible interaction feedback;
- purposeful transitions and spatial continuity;
- pleasant loading and waiting states;
- micro-interactions and decorative details whose primary value may be experiential rather than functional;
- tool-specific visual character when the task benefits from it.

The product does not adopt a rule that every visual element must have a strictly utilitarian purpose. Beauty, delight, character and perceived quality are legitimate product outcomes.

The corresponding guardrail is **evaluate rather than suppress preemptively**: real usage, accessibility, responsiveness, performance and repeated-use experience may justify reducing, changing or removing an element after implementation. The initial design should not be artificially made austere merely because an element is decorative.

The visual language may take inspiration from strong application design systems such as Fluent and Material, but Loculary must develop its own synthesis rather than reproduce either system or inherit their conventions wholesale.

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

### 3.5 Expressive use of color

Color is allowed to contribute materially to Loculary's identity and atmosphere, not only to encode status or affordance.

However, expressive color remains governed by semantic roles at the platform level. The system should avoid arbitrary per-tool palettes that fragment product identity or make status meanings inconsistent.

The intended balance is **expressive, not multicolored by default**: color may be visually prominent when it strengthens hierarchy, identity or enjoyment, while ordinary UI still benefits from a controlled semantic vocabulary.

## 4. Typography

Typography is governed by semantic roles while remaining composable through the existing CSS/Tailwind layer.

### 4.1 Platform roles

The system should expose a deliberately small semantic vocabulary covering:

- display;
- page title;
- tool title;
- section title;
- body;
- supporting text;
- metadata;
- label;
- control text;
- result value;
- result supporting text.

Roles describe intent and hierarchy, not mandatory visual values. They should not become a catalogue of arbitrary text sizes.

Typography is **functional by default and expressive where hierarchy or identity justifies it**. Large titles, tool identity and important results may use stronger typographic expression without turning ordinary utility UI into marketing-style presentation.

Not every role is required on every screen, and multiple roles may intentionally share the same underlying typographic level.

### 4.2 Typeface foundation

The current platform uses Geist Sans and Geist Mono.

Geist remains the current candidate for the primary interface typeface, but the design contract does not make the current typeface an irreversible product decision. The implementation worker may evaluate an alternative family or combination when real UI evidence shows that it would better support Loculary's readability, personality or tool ecosystem.

Geist Mono, or another monospace family if later validated, should be treated as a semantic technical role rather than a stylistic shortcut. Appropriate uses include:

- code;
- commands;
- technical identifiers;
- structured technical values;
- data where monospace alignment materially helps comprehension.

The choice of typeface must serve the semantic roles rather than the other way around.

### 4.3 Result hierarchy

Result value is a first-class role because results are often the central moment of a Loculary tool.

Implementations should be able to give a primary result materially stronger typographic hierarchy than surrounding labels, explanations or metadata without inventing tool-specific heading scales.

Result typography may be expressive when it improves recognition, delight or perceived quality, while remaining readable and responsive.

### 4.4 Tool-specific typography

Tools may intentionally depart from platform typography when typography is part of the tool's function or identity.

Examples include:

- code editors;
- terminal-like tools;
- typography tools;
- data-heavy interfaces;
- visual generators.

Such departures should remain deliberate rather than becoming accidental copies of arbitrary utility classes.

### 4.5 Content and localization

Typography must tolerate:

- longer translations;
- different word lengths;
- pluralization;
- user-generated content;
- dynamic values;
- responsive width changes.

No typography contract may depend on English-only line lengths or fixed dimensions that fail under localization.

## 5. Spacing and layout rhythm

Spacing is a foundation for hierarchy, density and perceived quality, not merely a collection of numeric gaps.

The design system should govern the **meaning and relationship** of spacing rather than create a token for every possible pixel value.

### 5.1 Semantic spacing tiers

The platform should distinguish a deliberately small vocabulary of spatial roles:

- **compact** — tightly related control parts, labels and small inline groups;
- **standard** — normal internal spacing between related elements within a component or control group;
- **comfortable** — separation between related blocks or component groups where additional breathing room improves scanability;
- **section** — separation between major sections of one composition;
- **page** — major outer rhythm between primary page regions or composition stages.

These tiers describe intent. Multiple tiers may share the same underlying implementation value when the resulting hierarchy remains clear.

The goal is not to force every component to use a unique spacing token.

### 5.2 Spacing as hierarchy

Spacing should communicate relationships before decorative containers are introduced.

Prefer:

- tighter spacing for elements that belong together;
- larger spacing when moving between conceptual groups;
- deliberate asymmetry when it strengthens hierarchy or composition;
- open space when it improves focus, rhythm or perceived quality.

Do not add padding, borders or cards merely to create separation that spacing already communicates.

Spacing may be expressive: generous whitespace can contribute to a premium or calm composition, while compact density can be appropriate for data-heavy or advanced tools.

### 5.3 Internal, inter-component and compositional spacing

Workers should distinguish three spatial responsibilities:

1. **internal spacing** — relationships inside a control or primitive;
2. **inter-component spacing** — relationships between adjacent reusable elements;
3. **compositional spacing** — relationships between larger regions such as tool input, result, documentation and next actions.

These responsibilities may use the same underlying scale, but should not be conflated when deciding layout hierarchy.

### 5.4 Density is contextual

Loculary does not require one global density.

Density may legitimately vary according to:

- task complexity;
- information volume;
- interaction frequency;
- viewport size;
- tool identity;
- result prominence.

A calculator, a data-heavy analysis tool and a visual generator should not be forced into the same spatial density merely for platform consistency.

The platform should provide a coherent rhythm while allowing tool-specific density within that rhythm.

### 5.5 Responsive spatial intent

Responsive behavior should preserve relationships rather than simply multiply or divide every spacing value by a breakpoint.

On narrower layouts, workers may:

- reduce non-essential outer spacing;
- tighten repeated controls when needed;
- stack groups that were previously horizontal;
- preserve larger separation around primary results or major task boundaries;
- recompose the page when compression would damage hierarchy.

On wider layouts, additional space may be used to improve hierarchy, focus and visual balance rather than simply increasing every gap.

### 5.6 Concrete values remain implementation evidence

The design contract intentionally does not lock a universal numeric spacing scale at this stage.

Implementation workers should evaluate the existing UI and representative target compositions before choosing concrete values. A conventional 4/8-based scale may be useful, but it is not a product requirement.

The implementation should prefer a small semantic token set and eliminate arbitrary values where they do not serve a real visual or functional purpose.

Direct low-level utility composition remains allowed when a value is genuinely local and justified. Repeated arbitrary values that express a stable relationship should instead be promoted to an appropriate semantic role.

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

### 6.4 Interaction states and focus

The foundation must define a coherent interaction-state vocabulary covering, as applicable:

- default;
- hover;
- focus-visible;
- pressed;
- selected;
- disabled;
- loading;
- success;
- warning;
- error;
- dragging/active where the primitive requires it.

Focus is a first-class foundation rather than only a color token. Its treatment must remain visible and meaningful across themes and component types, and must not depend on color alone.

Shared interaction states should make the interface feel responsive and app-like while allowing tool-specific controls to express richer states when their task requires them.

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

### 8.4 Motion as part of Loculary's signature

Motion is allowed to be part of the recognisable Loculary experience, not merely an implementation detail of individual controls.

A future implementation should therefore consider a coherent **motion signature** covering how interfaces:

- enter and leave;
- reveal results;
- communicate loading and waiting;
- transition between related states or contexts;
- respond to direct manipulation;
- express tool-specific character.

This does not require every interaction to animate. The goal is a recognisable movement language, with intentional moments of stillness as well as motion.

The signature must remain adaptable to responsive layouts and reduced-motion preferences. Its quality should be evaluated through real use rather than judged solely from isolated component examples.

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

### 10.4 Target architecture: foundations → behavior → composition → tool

The validated target architecture is a layered system:

1. **Foundations** — semantic color, typography, spacing, radius, elevation, focus, motion and responsive intent.
2. **Behavioral primitives** — reusable interaction behavior such as actions, inputs, selection, feedback, disclosure and navigation.
3. **Composition recipes** — reusable structures organized around interaction roles such as discovery, execution, result, editing, visualization and mini-app workspaces.
4. **Tool-specific UI** — the actual task experience, with freedom to diverge substantially when the nature of the tool requires it.

This is a **design-system architecture decision**, not a requirement to preserve the current component tree.

The current implementation is evidence to audit, not a target architecture to reproduce.

A current primitive may therefore be:

- retained when it already expresses the intended contract;
- refactored when its abstraction is useful but its behavior or visual model is insufficient;
- decomposed when it combines unrelated responsibilities;
- replaced when its abstraction actively conflicts with the target system;
- removed when it creates duplication, rigidity or misleading reuse.

The implementation worker must optimize for the quality and coherence of the target system rather than the maximum preservation of existing components.

In particular, the worker must not treat `Card`, `Panel`, `ResultPanel`, `ToolPage` or any other existing component as architecturally sacred merely because it already exists.

Refactoring or replacing an existing primitive is an expected and valid outcome when the audit demonstrates that doing so is the cleaner path to the validated product direction.

### 10.5 Reuse boundary

Reuse should follow **shared behavior and product meaning**, not superficial visual similarity.

A primitive is a good candidate for platform reuse when it provides stable behavior, accessibility semantics, interaction states or a genuinely recurring visual role.

A composition should remain a recipe when its structure is recurring but its content, density or visual expression legitimately varies.

A tool-specific implementation should remain local when forcing it into a platform abstraction would reduce clarity, expressiveness or task quality.

The system should prefer a small number of strong abstractions over either extreme:

- duplicating every control independently; or
- creating a universal component with enough variants to encode the entire product.

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

### 16.1 Refactor-first when the existing abstraction is wrong

Implementation workers must not interpret this specification as a request to cosmetically retokenize the current UI.

When the current component architecture prevents the target system from being expressed cleanly, the worker should propose and, within the validated implementation scope, execute the necessary refactor or replacement.

A successful implementation is therefore not measured by:

- how many existing components survive unchanged;
- how few files are touched;
- whether existing visual patterns can be preserved through additional variants.

It is measured by whether the resulting system:

- expresses the validated Expressive Utility direction;
- provides coherent foundations;
- exposes reusable behavior without over-abstraction;
- preserves legitimate tool-specific freedom;
- remains accessible, localized, responsive and performant;
- is simpler or more coherent where refactoring was justified.

Workers should still avoid unrelated redesign and uncontrolled migration. Refactoring is encouraged **when it is directly necessary to achieve the validated design-system target**.


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

1. the exact semantic color token mapping and contrast-validated values;
2. the final typography-role values;
3. the final spacing/radius/elevation token values;
4. the exact motion easing/intensity vocabulary and concrete motion signature recipes;
5. the exact platform icon library/treatment;
6. the concrete Loculary signature motif beyond the validated expressive color/motion direction;
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
