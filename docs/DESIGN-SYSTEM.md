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

The platform should maintain a deliberately small **semantic** radius vocabulary rather than expose a mechanical ladder of generic numeric sizes.

The initial semantic roles are:

- **subtle** — small rounding for compact controls, technical surfaces or elements where containment should remain restrained;
- **standard** — the normal platform radius for reusable controls and contained surfaces;
- **prominent** — stronger rounding for major compositions, result surfaces or expressive containers where the shape contributes to the visual hierarchy;
- **pill** — fully rounded treatment for controls or compact elements whose interaction model benefits from a capsule shape.

These roles describe visual intent, not mandatory pixel values. Multiple roles may map to the same concrete value when the resulting hierarchy remains clear.

The current implementation's `sm/md/lg/xl/2xl` ladder is evidence to audit, not the target contract. Shared/platform components should consume semantic radius roles rather than selecting generic levels mechanically.

Tool-local radius choices remain allowed when they are part of an intentional visual composition or when the content itself requires a distinct shape.

Arbitrary radius values should require a clear reason. Repeated local values expressing the same stable relationship should be consolidated into a semantic role rather than preserved as stylistic drift.

The system should also avoid making every surface strongly rounded. Radius is one compositional signal among spacing, surface contrast, border and elevation.

### 6.3 Elevation and depth

Elevation describes a **relationship in depth**, not a requirement to add a shadow.

The initial semantic vocabulary is:

- **flat** — participates directly in the surrounding surface hierarchy without perceptible floating depth;
- **raised** — visually separated from its surrounding context through surface contrast, border, subtle shadow or a combination of these;
- **floating** — clearly above the surrounding composition, appropriate for transient overlays, menus, popovers, dialogs or intentionally prominent interactive surfaces.

These roles describe hierarchy and spatial relationship. They do not prescribe one universal shadow formula.

A raised surface may therefore use:

- surface contrast without a shadow;
- a border without a shadow;
- a restrained shadow;
- or a deliberate combination.

Floating surfaces normally require stronger depth cues, but the implementation should still avoid gratuitous blur or shadow.

Elevation should communicate hierarchy, interaction state or spatial continuity rather than simulate depth everywhere.

The current `shadow-sm/md/lg` values are implementation evidence, not permanent product tokens. Concrete shadows should be validated in both light and dark themes because the same numerical shadow treatment does not necessarily produce the same perceived depth across themes.

The design system should not introduce a dedicated `surface-elevated` color role merely to support this model at this stage. Surface contrast is one possible implementation of elevation; whether an additional semantic surface role is actually necessary should be decided from implementation evidence.

### 6.4 Depth, containment and expressive composition

Depth should reinforce the composition rather than turn Loculary into a collection of floating cards.

Prefer flatter composition when:

- spacing already communicates grouping;
- content is part of the page canvas;
- additional depth would create visual noise;
- the tool benefits from an open workspace.

Use stronger depth when it materially improves:

- result emphasis;
- task grouping;
- transient-layer clarity;
- interaction feedback;
- spatial continuity;
- the perceived quality or character of an intentionally expressive composition.

Radius and elevation should therefore be considered together with spacing, surfaces and composition. A prominent radius does not automatically require a floating elevation, and a raised surface does not automatically require a large radius.

### 6.5 Theme adaptation

Light and dark themes must preserve the semantic roles while using theme-appropriate concrete mappings.

Dark mode must not be treated as a simple inversion of light-mode shadows or surface colors. In particular:

- perceived depth depends on surrounding luminance and contrast;
- strong shadows can become muddy or visually heavy on dark surfaces;
- surface contrast may communicate depth more effectively than a large shadow;
- focus and interaction states must remain distinguishable from depth cues.

Concrete radius values can normally remain shared across themes, while elevation treatment may require different shadow opacity, spread or surface contrast.

### 6.6 Interaction and state relationship

Elevation may change with interaction when that change communicates a meaningful spatial state.

Examples include:

- a menu becoming floating when opened;
- a draggable surface becoming raised while actively manipulated;
- a result surface becoming more prominent when newly revealed;
- a selected control gaining surface separation without requiring a generic shadow.

These are behavioral/compositional decisions, not permission to animate every elevation change.

Motion may reinforce a depth transition when it improves spatial continuity, subject to the motion contract and reduced-motion adaptation.

### 6.7 Interaction states and focus

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

Motion is a first-class foundation because Loculary is intended to feel like a polished application rather than a static collection of pages.

### 8.1 Motion goals

Motion may provide:

- state feedback;
- spatial continuity;
- hierarchy and emphasis;
- perceived responsiveness;
- tool identity;
- delight;
- ambient character;
- visual polish.

Purely visual motion is valid when it materially improves perceived quality, character or enjoyment.

Motion is not required for every interaction. Intentional stillness is part of the movement language too.

### 8.2 Motion intent families

The platform should use a small semantic vocabulary based on **why motion exists**, not on the component that happens to use it.

The initial families are:

- **feedback** — confirms an interaction or state change, such as press, selection, validation or completion;
- **transition** — moves between related interface states without implying a change in spatial hierarchy;
- **spatial** — communicates movement through the interface or a change in depth, containment or context;
- **reveal** — introduces a newly available result, output, explanation or content region;
- **loading** — communicates waiting, progress or an active process;
- **manipulation** — responds to direct user movement such as dragging, resizing or repositioning;
- **ambient** — provides restrained decorative or identity motion whose primary value is experiential.

These families are semantic intent, not mandatory animation components. A single primitive may support several families, and a tool may create a local motion pattern when its task requires it.

### 8.3 Motion dimensions

A motion treatment should be describable through a small set of independent semantic dimensions:

**Speed**

- **fast** — immediate interaction feedback;
- **standard** — ordinary state and interface transitions;
- **slow** — deliberate spatial or compositional movement where the additional time supports comprehension or character.

**Intensity**

- **subtle** — small movement or opacity/scale change that keeps attention on the task;
- **standard** — clearly perceptible movement used for ordinary transitions and feedback;
- **expressive** — stronger movement reserved for meaningful emphasis, identity, reveal or intentionally decorative moments.

**Easing**

The system should provide a small set of semantic easing families rather than exposing arbitrary curves as the default vocabulary:

- **standard** — general-purpose movement;
- **enter** — movement into the visible composition;
- **exit** — movement out of the visible composition;
- **spatial** — movement that represents continuity through position or depth.

Concrete durations, distances, easing curves and overshoot values remain implementation evidence and are not fixed by this contract.

The dimensions are intentionally independent. For example, an expressive result reveal may use a standard speed, while a subtle control feedback may use fast speed. This prevents the vocabulary from becoming a catalogue of named animations.

### 8.4 Motion rules

Motion should:

- remain subordinate to the task while still allowing expressive moments;
- preserve interaction responsiveness;
- communicate meaningful state, hierarchy or spatial continuity when those are relevant;
- avoid unnecessary repetition;
- avoid causing layout instability;
- remain coherent across responsive compositions;
- adapt intentionally to reduced-motion preferences.

Workers should not reject motion solely because it is decorative or non-essential.

They should reject or simplify a motion treatment when evidence shows that it:

- obstructs the task;
- creates confusion or false feedback;
- materially harms responsiveness or performance;
- causes an accessibility problem;
- becomes repetitive or visually noisy;
- makes repeated-use workflows feel slower than necessary.

Optimization should preserve the intended motion character whenever technically reasonable.

### 8.5 Responsive and reduced-motion adaptation

Motion must be treated as responsive behavior, not a fixed desktop animation layer.

On smaller or constrained layouts, implementations may:

- reduce travel distance;
- simplify multi-element choreography;
- avoid animations that depend on unavailable spatial relationships;
- preserve the key state/reveal cue while simplifying secondary movement.

Reduced-motion adaptation should preserve the conceptual meaning of the interaction wherever possible.

For example, a result reveal may retain immediate visual hierarchy and state change while removing or shortening movement. A loading state may remain clearly animated when the user has not requested reduced motion, but must not depend on continuous motion to communicate an essential state.

`prefers-reduced-motion: reduce` is an accessibility adaptation, not the default visual direction.

### 8.6 Motion and depth relationship

Motion may reinforce the depth and containment model defined in section 6.

Examples include:

- a menu moving into a floating state;
- a dragged surface responding to direct manipulation;
- a result moving from an in-progress state into a prominent result state;
- an overlay entering from the spatial relationship implied by its origin.

The movement should explain the relationship rather than merely decorate the state change.

Not every elevation or radius change should animate.

### 8.7 Loculary motion signature

Motion is allowed to become part of the recognisable Loculary experience rather than remaining a collection of unrelated component animations.

A future implementation should evaluate a coherent signature across:

- entry and exit;
- result reveal;
- loading and waiting;
- related state/context transitions;
- direct manipulation;
- tool-specific character;
- selected ambient or decorative moments.

The signature should be recognizable through **relationships** between these moments — for example, consistent movement character and hierarchy — rather than through one mandatory animation repeated everywhere.

Tool-specific motion may diverge when it improves comprehension or enjoyment, provided it remains compatible with the platform vocabulary and accessibility/performance contract.

The quality of the signature must be evaluated in real compositions and repeated use, not only through isolated component demos.

### 8.8 Motion governance

Platform motion primitives should expose semantic intent and dimensions rather than raw animation details wherever a shared abstraction exists.

Workers may use custom motion when:

- the tool's task requires a distinct interaction;
- the content itself is visual or spatial;
- a custom effect contributes meaningfully to tool character;
- a local composition would become less clear through forced platform reuse.

Custom motion should still document its intent and remain compatible with accessibility, responsiveness and performance requirements.

The system should avoid both extremes:

- a large animation library containing a named effect for every interaction;
- unrestricted ad-hoc animations that fragment Loculary's movement language.

### 8.9 Concrete values remain open

The design contract intentionally does not lock the current implementation's `120ms`, `180ms` and `240ms` values as the final motion scale.

Those values are implementation evidence only.

Final durations, distances, easing curves, intensity mappings and concrete motion-signature recipes should be chosen after representative target compositions exist and can be evaluated across:

- common interactions;
- result-heavy tools;
- loading/waiting states;
- mobile and desktop;
- light and dark themes;
- repeated-use workflows;
- reduced-motion adaptation;
- representative lower-capability devices.

This keeps the motion foundation concrete enough for a Worker to implement coherently without prematurely freezing values that have not yet been validated in the target experience.

## 9. Iconography

Iconography is a platform foundation because icons carry navigation, action, status and tool identity across a large utility product.

### 9.1 Platform identity

Platform-level icons should use a coherent visual treatment for:

- global navigation;
- catalogue and discovery;
- category identity;
- shared tool metadata;
- common actions;
- common interface states.

The platform should prefer one coherent icon source/treatment for shared UI rather than assembling unrelated icon families.

The exact icon library is intentionally **not mandated by this contract yet**. Selection should be based on:

- visual coherence with the Loculary typography and motion direction;
- sufficient coverage of common utility actions and navigation;
- consistent geometry and optical weight;
- accessibility support and predictable semantics;
- stroke/fill consistency appropriate to the target visual language;
- tree-shaking or equivalent delivery characteristics;
- licensing and long-term availability;
- compatibility with the existing React/Next.js architecture without requiring a heavyweight runtime.

The current absence of a dedicated platform icon library is implementation evidence, not a requirement to introduce one immediately.

### 9.2 Icon roles and semantics

Icons should be treated according to their semantic role:

- **navigation** — identifies a destination or navigation concept;
- **action** — communicates an operation such as copy, reset, download or share;
- **status** — reinforces information such as success, warning, error or processing;
- **disclosure** — communicates expandable or collapsible state;
- **identity** — represents a tool, category or product concept;
- **decorative** — contributes to visual composition without carrying essential meaning.

The icon's role should determine its accessibility behavior and visual treatment. A visual similarity between two icons is not sufficient reason to use the same semantic icon.

### 9.3 Visual treatment

Platform icons should share a coherent:

- geometric language;
- optical weight;
- stroke/fill behavior;
- corner and terminal treatment;
- alignment behavior;
- active/inactive treatment.

Icons should normally be optically aligned with their surrounding text and controls rather than positioned only by their mathematical bounding box.

Icon size should be expressed through semantic interface roles rather than a large catalogue of arbitrary pixel sizes. Multiple roles may intentionally share the same concrete size.

Platform iconography should remain visually legible at the small sizes common to utility controls. Important icons may use stronger visual weight or larger treatment when hierarchy requires it.

The system should avoid using icon size, stroke weight or decorative effects as a substitute for information hierarchy that should instead be expressed through typography, spacing, color or composition.

### 9.4 Accessibility

Icons must not be the sole carrier of essential meaning.

For interactive controls:

- icon-only controls require an accessible name;
- icon + text controls should not duplicate the accessible name unnecessarily;
- stateful icons must expose their state through accessible semantics, not only visual change;
- focus behavior must remain consistent with the platform interaction-state contract.

For decorative icons:

- they should be hidden from assistive technology when they add no information;
- they should not create redundant announcements;
- their removal should not make essential content ambiguous.

Status icons should reinforce, not replace, text or other non-color cues when the state is important.

### 9.5 Iconography and color

Icons may use semantic color when color contributes to hierarchy or state, but color must not be their only meaningful distinction.

Platform actions should not acquire arbitrary colors merely because an icon is present.

Status icons should remain compatible with the semantic status roles defined in section 3 and should remain understandable in light and dark themes.

Tool-specific content may use literal colors when color is part of the content itself.

### 9.6 Responsive, localization and RTL behavior

Icons must remain usable across desktop, tablet and mobile compositions.

Responsive implementations may:

- change icon size when the surrounding control changes role;
- move icons between leading and trailing positions when composition changes;
- simplify decorative iconography when space is constrained;
- preserve the same semantic meaning when labels wrap or disappear.

Icon APIs must not assume fixed English/French text widths.

Directional icons require particular care under localization and RTL support. Icons that communicate physical direction, movement, insertion, indentation or navigation may need mirroring when the meaning is directional. Icons representing an invariant concept should not be mirrored merely because the interface direction changes.

The exact mirroring behavior should therefore follow semantic meaning, not a blanket RTL transform.

### 9.7 Tool identity and custom visuals

Tools may use custom symbols, diagrams, previews, illustrations and bespoke iconography when these are part of the tool experience.

This is especially appropriate when:

- the tool represents domain-specific concepts not covered well by the platform set;
- the visual itself is part of the tool's result;
- a custom symbol materially improves comprehension;
- a tool's identity benefits from a distinct visual treatment;
- the interface is a visualization or mini-application where icons are part of the content model.

Custom tool visuals must still preserve accessibility and should not silently redefine the meaning of platform-level action or status icons.

A tool-specific icon may therefore be expressive without becoming a new platform convention.

### 9.8 Emoji and Unicode glyphs

Emoji and arbitrary Unicode glyphs should not be used as substitutes for platform interface icons.

They vary across operating systems, fonts, rendering environments and visual styles, making them unsuitable as the default platform icon language.

Emoji remain valid when they are intentionally part of user-facing content or product copy rather than acting as a platform control icon.

This rule does not prohibit expressive tool content from displaying emoji when emoji themselves are the content.

### 9.9 Iconography governance

Shared platform icons should come from the selected platform source/treatment wherever an appropriate icon exists.

A custom platform icon may be introduced when:

- the platform source lacks an appropriate concept;
- the concept is specific to Loculary;
- the source icon would communicate the wrong meaning;
- a custom treatment is necessary for a validated visual-system requirement.

Custom additions should document their semantic role and remain compatible with the platform's geometry, optical weight and accessibility rules.

The system should avoid both extremes:

- forcing every tool-specific symbol into the platform icon set;
- allowing unrelated icon families to accumulate in shared UI.

### 9.10 Exact library remains open

The design contract intentionally leaves the exact platform icon library/treatment open.

The implementation worker should evaluate candidate sources against representative platform surfaces and tool compositions before making the final selection. The evaluation should cover:

- common navigation/actions;
- status and disclosure icons;
- small controls and touch targets;
- dark and light themes;
- responsive layouts;
- localized/RTL compositions;
- tree-shaking and bundle impact;
- licensing and maintenance;
- visual fit with the final typography, color and motion foundations.

The result should be recorded as an explicit decision before broad platform adoption rather than inferred from whichever icon source is easiest to install.

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
