# Loculary — UX Specification

## Current UX direction

**Status:** Accepted. This direction governs where older UX wording conflicts with it.

Loculary's current UX direction is a task-first utility toolbox. Existing UI patterns, prior UX proposals and earlier visual conventions are implementation history, not constraints on the current design.

The product should not be approached as a conventional SaaS landing page, dashboard or generic tool catalog. The target experience is a **modern utility toolbox**: direct, precise, pleasant and highly focused on helping a user accomplish a task.

### User intentions

The experience is organized around three primary user intentions:

1. **Find something** — the user knows, approximately, what they need and searches for it.
2. **Figure out how to do something** — the user knows the goal but not necessarily the appropriate tool; exploration and intent-oriented navigation help.
3. **Discover** — the user wants to browse what Loculary can offer.

These intentions must coexist without allowing discovery content to obstruct task completion.

### Primary UX journey

The preferred journey is:

> **Need → Find or explore → Tool → Action → Result → Next action**

The result is not necessarily the end of the experience. When meaningful, users should be able to copy, download, share, reset, modify, or continue with a complementary tool.

### Homepage direction

The homepage should be **action/search first, discovery in depth**, rather than a conventional marketing landing page.

The primary visual question should be effectively:

> **What do you want to do?**

Search and action-oriented entry points should dominate the initial experience. Popular tools, intentions, categories and discovery content should follow naturally.

Cards and card grids are valid Material 3 composition options, including for category discovery. Choose their variant and density to make destinations easy to scan and select; do not avoid cards by default. Keep search and useful entry points obvious, and use the composition that best communicates Loculary's value rather than relying on a large marketing hero.

### Navigation direction

The primary navigation should remain small and understandable. Search is a first-class entry point, while an Explorer area can provide both:

- intent-oriented discovery such as calculate, convert, transform, create, analyze, verify, generate or measure;
- domain/category-oriented discovery such as images, text, files, development, finance or data.

A large catalog must not become a visually overwhelming grid.

### Tool-page direction

The tool is the central product experience. A typical hierarchy is:

1. concise identity/title;
2. concise explanation;
3. processing/privacy status;
4. primary tool interaction;
5. result;
6. contextual actions;
7. meaningful next tools or actions, when a natural continuation exists;
8. explanation/documentation;

This is a priority hierarchy, not a rigid template. Complex tools may require different compositions.

Documentation must not compete with the primary task.

### Result-first interaction

Results should feel clear, immediate and trustworthy. Feedback for successful processing, copying, reset, validation, errors, progress and cancellation should be explicit and appropriately animated.

The interface should make the transition from input to result understandable without motion or effects that add no meaningful functional, experiential, or identity value.

### Tool-specific interfaces

Loculary must establish a shared visual and interaction language without forcing every tool into the same layout.

Examples:

- calculators may emphasize compact inputs and a prominent result;
- file tools may emphasize drop zones, previews and processing controls;
- generators may emphasize parameters and visual previews;
- analysis tools may emphasize data, visualization and interpretation.

Tool-specific identity is encouraged when it improves comprehension, feedback or enjoyment.

### Visual design direction

The shared visual system follows **Material 3 Expressive**, as defined by DEC-048 and `docs/DESIGN-SYSTEM.md`. Apply its foundations to semantic color, typography, shape, surfaces, elevation, iconography, shared component states and motion, adapted to Loculary's task-first utility toolbox rather than copying a Google product screen or adopting a generic SaaS template.

Loculary intentionally aims to **look and feel like a polished modern Android/Pixel application**, adapted to the Web. Expressive color should be confident and vivid where it communicates action or identity—not uniformly desaturated or pastel. Pair strong accents with quiet tonal surfaces, preserve contrast and semantic hierarchy, and use fluid, meaningful interaction feedback across shared components. Honor reduced-motion preferences and responsive web behavior.

The redesign must challenge existing UI patterns when they prevent a coherent Expressive experience. The objective is not to retokenize the current interface while preserving every existing component; refactor or replace abstractions when justified by the validated design target.

The default semantic color seed is #4285F4, with Roboto as the validated default interface typeface. The official MCU Rainbow scheme is the sole rainbow palette; use its tonal range for expressive surfaces and vivid compact accents, with validated light/dark contrast. The brand mark remains distinct from functional interface icons, and shared consistency must not erase meaningful differences between specialized tools.

### Discovery and next actions

Next actions are distinct from generic discovery. They belong to the task flow and should appear when they provide a natural continuation of the current task.

Recommendations should answer the likely question:

> **What might you want to do next?**

Not every tool needs a next action. When no meaningful continuation exists, the interface should omit the section rather than invent recommendations.

Generic discovery remains a separate product concern and may surface similar, popular, recent or exploratory tools elsewhere in the experience.

### Responsive direction

Desktop, tablet and mobile are distinct first-class compositions. Mobile must not be treated as a compressed desktop layout, and tablet layouts must not fall into an awkward intermediate state.

The responsive design must preserve the hierarchy of search, tool interaction, result and actions at every viewport.

### Architecture consequence

The UX redesign may remove, merge, move or replace existing screens and components when the new user journey benefits from doing so. Existing routes and UI components are not themselves UX requirements.

The redesign must still preserve core product constraints such as anonymous access to core tools, processing transparency, accessibility, internationalization and browser-first behavior.

## Core rule

A user opening a tool should immediately see:

1. the tool;
2. the primary inputs/actions;
3. the result area.

The page must not make the user scroll through marketing or documentation before using the tool.

## Standard tool-page hierarchy

A typical tool page should follow this conceptual order:

1. title;
2. concise explanation;
3. processing/privacy status;
4. primary tool interface;
5. result;
6. common actions;
7. contextual next actions, when a natural continuation exists;
8. secondary documentation;
9. optional discovery/community information;
10. advertising that does not interfere with the primary task.

Not every tool needs every section.

## Above-the-fold rule

When viewport size reasonably permits it, the primary tool and its result should be visible without unnecessary scrolling.

Complex tools may require scrolling; the rule is to prioritize the task, not to force an artificial layout.

## Visual results

A result may be:

- textual;
- numerical;
- tabular;
- graphical;
- animated;
- interactive;
- visual.

The tool author should choose the representation that best communicates the result.

A visual treatment may provide functional, experiential, identity, or purely aesthetic value. Animation may be purely visual when it improves perceived quality, spatial continuity, delight, or the character of the tool. During initial design and implementation, richer visual treatments and motion are encouraged rather than suppressed preemptively; later audits may identify elements that should be reduced or removed based on real UX, accessibility, or performance evidence.

## Visual expression and motion

Loculary's shared visual language follows **Material 3 Expressive** as defined by DEC-048 and `docs/DESIGN-SYSTEM.md`. Expressive foundations apply across navigation and headers, buttons, fields, switches, menus, dialogs/popups, cards, feedback, typography, semantic color, iconography, interaction states, surfaces and motion.

The intended feel is a polished, responsive web application with the clarity and immediacy of a modern Android app, not a literal Android screen replica. Shared behavior and foundations should be consistent, while tool-specific interfaces may use specialized layouts, visualizations or density when these better serve the task. Preserve the task-first journey and platform-wide accessibility, localization, responsiveness, performance and trust requirements.

Use expressive shape, color and motion to clarify hierarchy, state changes and spatial continuity—not as decoration on every element. Respect system reduced-motion preferences. The default semantic palette uses the blue seed #4285F4, with Roboto as the validated default interface typeface. Use the official MCU Rainbow scheme as the sole rainbow palette for both expressive surfaces and vivid compact accents, choosing tones appropriate to each context. Validate light/dark contrast and preserve independent semantic status colors. Exact mappings and implementation tokens belong in the canonical design-system contract.

## Input validation

Invalid input should be prevented or identified clearly.

For constrained fields:

- prevent impossible input when this improves usability;
- provide immediate, understandable feedback;
- do not silently transform meaningful user input into a different value.

Validation must be accessible and understandable.

## Results

Results should be visually prominent.

Where relevant, provide:

- primary result;
- useful secondary values;
- formula or reasoning;
- copy action;
- reset action;
- share action.

The formula/explanation is useful but should not visually compete with the main result.

## Documentation

Tool documentation is secondary to the tool itself.

Long-form help may be presented using accordions or expandable sections.

Possible sections:

- How it works;
- Formula;
- Examples;
- Edge cases;
- FAQ;
- Privacy/processing details.

Documentation should still be real page content so users and search engines can understand the tool.

### Explanations and examples

Keep the primary task and result visually dominant. Offer formulas, reasoning and longer explanations as secondary content that users can choose to open when they want more detail. Where relevant, connect explanations to the user's actual inputs or result. Use a small number of realistic examples that clarify distinct cases; avoid artificial or repetitive example lists. Every text block must help users understand or use the tool—SEO alone is not a reason to add filler or lengthen a page.

## Processing transparency

Every tool should expose a concise status indicator.

Examples:

> 🟢 **Traitement local** — vos données restent sur votre appareil.

> 🔵 **Service externe** — certaines données sont transmises à un service externe.

> 🔵 **Serveur Loculary** — ce traitement nécessite notre infrastructure.

> 🟡 **Traitement hybride** — le traitement local est complété par un service externe.

The indicator should support a tooltip and/or dedicated detail view.

The detail view should explain:

- where processing occurs;
- what data leaves the device;
- which service receives it;
- why transmission is necessary;
- whether data is stored;
- relevant retention behavior;
- important limitations.

This is a core trust feature, not merely technical documentation.

## Copy, reset, and share

Common actions should be available when meaningful:

- **Copy** for copyable results;
- **Reset** for stateful tools;
- **Share** for reproducible tool state.

Share URLs must be designed carefully so that sensitive content is not unintentionally exposed.

## Responsive design

Desktop and mobile are both first-class experiences.

The application should not be designed as desktop-only and then merely compressed.

When viewport width is insufficient for side advertising, side advertising should disappear rather than reduce the usable tool area below an acceptable level.

## Advertising UX

Advertising must remain visually and functionally subordinate to the tool.

Preferred behavior:

- side rail(s) on sufficiently wide desktop layouts;
- alternative lower-page placement on narrower layouts;
- no obstruction of inputs, results, navigation, or critical controls;
- no autoplay audio;
- no deceptive interaction;
- no forced interaction with ads.

A sticky lower ad may be considered where technically and commercially appropriate, provided it does not cover essential UI and includes appropriate spacing.

## Accessibility

Accessibility is a product requirement.

Tool interfaces should support:

- keyboard navigation;
- semantic controls;
- visible focus;
- appropriate labels;
- understandable validation errors;
- sufficient contrast;
- reduced-motion preferences;
- screen-reader-compatible status updates where needed.

## SEO and discoverability

Each meaningful public tool should be a real, stable, indexable page.

Tool pages should have:

- useful titles;
- descriptions;
- canonical URLs;
- Open Graph metadata;
- structured data where appropriate;
- unique explanatory content;
- internal links to relevant tools;
- sitemap inclusion when indexable.

SEO must never justify making the primary tool difficult to reach.

## Next actions

A tool page may expose **next actions** when a natural continuation of the user's task exists.

Next actions are not required on every tool page. They should be shown only when they can answer a useful question such as:

> **What might I want to do next?**

A next action should normally continue or complement the current task rather than merely resemble the current tool.

Examples include:

- continuing a transformation or conversion workflow;
- using a complementary calculation;
- refining or validating the current result;
- moving to the next obvious step of a multi-tool workflow.

Generic similarity, popularity or catalog discovery must not be presented as a next action merely to fill available space. A tool may legitimately expose no next actions.

The underlying recommendation mechanism is an implementation detail. The product meaning is the usefulness of the continuation, not the fact that two tools happen to share metadata or a category.

### Intent and category discovery

Intent-oriented entry points represent **what the user wants to accomplish**, not a category shortcut. A first-class intent may lead to several relevant tools, including tools from different categories, as the catalog grows.

The UX must never imply that one category fully represents an intent. Initial intent-to-tool associations may be curated editorial data; later deterministic discovery may enrich them without changing the product semantics.

## Personal experience and contextual content

Authenticated users may eventually hide or reorder tools and page elements, customize the homepage, choose theme and animation level, adjust density/style, manage favorites and collections, and control privacy/history behavior. These controls should enhance the experience without making anonymous usage feel second-class.

Contextual tone is an optional future capability: a professional tool may remain restrained while a creative or exploratory tool may be more expressive. It must remain subordinate to clarity, usability and accessibility and does not depend on a user-selectable presentation mode.

Where useful, tool pages may offer lightweight feedback such as “Cet outil vous a été utile ? 👍 👎” or authenticated ratings without distracting from the task.


## Public header, navigation popovers and mobile search

The public header keeps the homepage task-first: the current homepage body and canonical palette are not changed as part of header/footer work. The shared SVG brand mark is distinct from functional icons; use `LocularyLogo` rather than duplicating logo markup.

### Hamburger disclosure

The current header panel contains both navigation and settings, so it uses disclosure/popover behavior rather than claiming ARIA `menu` semantics without the corresponding keyboard model.

- Theme choices and the language selector do not close the panel. Locale changes can recreate the root layout, so the open state is handed off once through tab-scoped session state; it is not a long-lived preference and is cleared by the next menu interaction. The panel then updates to the selected language.
- Ordinary destination links close the panel as navigation begins.
- Pointer interaction outside the panel and Escape dismiss it.
- Escape restores focus to the trigger. Outside dismissal must not pull focus away from the element the user clicked.
- When closed, panel descendants must be removed from keyboard interaction, not merely visually faded or marked `aria-hidden`.

### Mobile header search

- Opening the search places focus in the search input.
- Outside pointer, explicit close and route change close the panel. Escape first dismisses an active suggestions/error surface; a subsequent Escape closes the panel.
- Escape that closes the panel and explicit close return focus to the search trigger; Escape that only dismisses suggestions keeps focus in the field. Outside dismissal preserves the user's pointer/focus target.
- Keep the interaction non-modal unless the implementation actually provides modal behavior and its full focus handling.
- Test the behavior in French and English and at mobile/tablet/desktop breakpoints. Prefer native links/buttons, visible focus and touch targets around 48 CSS px on mobile.

