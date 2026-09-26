# Utiluna — UX Specification

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
7. secondary documentation;
8. related tools;
9. optional community information;
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

A visual treatment should have functional value. Animation must not be used merely because it is possible.

## Tool modes

Utiluna supports two user-facing expression modes:

### Sober

- restrained motion;
- minimal decorative effects;
- fast feedback;
- information-first presentation.

### Playful

- richer transitions;
- micro-interactions;
- visual feedback;
- optional decorative personality;
- suitable for fun, creative, or exploratory tools.

The two modes must preserve the same functionality.

Respect accessibility preferences such as reduced motion regardless of the selected style.

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

## Processing transparency

Every tool should expose a concise status indicator.

Examples:

> 🟢 **Traitement local** — vos données restent sur votre appareil.

> 🔵 **Service externe** — certaines données sont transmises à un service externe.

> 🔵 **Serveur Utiluna** — ce traitement nécessite notre infrastructure.

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

## Related tools

A tool page may expose:

- similar tools;
- complementary tools;
- popular nearby tools;
- recently used tools.

Relationships should be meaningful rather than generated solely to fill page space.

## Expanded experience direction

### Homepage experience

The default homepage should foreground the user's action or need rather than a wall of categories. Search/action is primary; discovery depth follows through popular tools, categories, suggestions, recent tools, and personalized content for authenticated users.

### Result-first interaction

The recommended hierarchy is:

1. inputs;
2. primary result;
3. actions;
4. explanation;
5. documentation;
6. related/discovery content.

For simple tools, the result should appear with minimal interaction. “How did we get this result?” can be available as an expandable secondary explanation.

### Tool-specific identity

A common design system should establish trust and consistency without making every tool visually identical. Small utilities may be compact; advanced tools and mini-applications may use richer layouts. Visual and animation identity can vary by tool when this improves comprehension or enjoyment.

### Personal experience

Authenticated users should eventually be able to hide/reorder tools and page elements, customize the home, choose theme and animation level, adjust density/style, manage favorites and collections, and control privacy/history behavior. These controls should enhance the experience without making anonymous usage feel second-class.

### Contextual tone

A professional tool can remain sober while a creative or exploratory tool can be more expressive. Contextual tone is an optional future capability and must remain subordinate to clarity and the user's selected experience mode.

### Feedback and lightweight trust signals

Where useful, tool pages may provide lightweight feedback such as “Cet outil vous a été utile ? 👍 👎” and authenticated ratings without distracting from the task.

### Mobile and advertising

Mobile is a first-class experience, not a compressed desktop layout. Advertising must never sit between the primary input and result, cover controls, or create forced interaction. Wide desktop layouts may use side rails; smaller layouts should prefer non-intrusive alternatives or omit the placement when necessary.
