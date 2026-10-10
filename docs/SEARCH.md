# Loculary — Search

Search is both catalog navigation and, progressively, solution discovery.

## Search field and suggestion surface

- A search field exposes one clear action when the query is non-empty. Use a consistent, labelled icon button; avoid showing both browser-native and custom clear controls.
- The mobile header search panel closes on outside pointer, Escape (after dismissing its suggestion/status popup) or navigation. A separate close icon is not needed when it duplicates these dismissal paths. Outside-pointer dismissal must not steal focus from the control the user clicked.
- Suggestions appear in an elevated surface anchored to the field, above nearby page content and outside clipping/stacking contexts that would hide it. Recalculate its viewport position when scrolling or resizing; keep it within the visible viewport and respect mobile keyboard changes where supported.
- Follow the Material 3 SearchBar model for a clear field-to-suggestions relationship, but adapt it to web semantics. A combobox controls a real listbox of selectable suggestions; loading, error and no-result feedback are separate status content rather than fake listbox options. Keep `aria-expanded`, `aria-controls`, active descendant, keyboard navigation and Escape behavior synchronized with the actual visible state.
- Suggestion rows use the shared semantic surface/elevation/shape/focus tokens, a clear primary title, secondary category/description and a distinct active state in both themes. Preserve the same ranking and selection behavior across French and English.

## Catalog search navigation

- Search matches localized tool names and descriptions, aliases, tags and categories using the existing deterministic catalog ranking.
- Selecting a suggestion opens that tool directly.
- Submitting a query with exactly one current match opens that tool directly. If the match list is ambiguous (multiple matches), or no match is found, submission opens the localized results page: `/fr/recherche#q=...` or `/en/search#q=...`.
- The results page lists every published catalog match, not just the small suggestion subset. A no-result page explains the outcome and offers localized example queries. The query is kept in the URL fragment so the result state can be revisited without sending the search term in the HTTP request.
- The trailing round arrow and Enter submit the same query. Enter while a suggestion is explicitly highlighted opens that selected tool.
- Search-result URLs are transient discovery states, not standalone SEO landing pages; they should not be indexed. The static all-tools catalog route remains separate from query results.

Matching layers: exact/prefix text; descriptions, aliases, synonyms, tags and categories; typo tolerance and related queries; natural-language intent; optional AI only when its cost, privacy, latency and reliability are justified.

Examples such as “calculer 17 % de 283” should lead to the relevant tool. A no-result state should propose related queries/tools and eventually “Proposer un outil”.

A future solution engine may transform a need into a sequence of existing tools, without making AI foundational. Tags are centrally managed with aliases to avoid vocabulary duplication. Tools may belong to multiple categories.
