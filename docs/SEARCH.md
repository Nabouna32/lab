# Loculary — Search

Search is both catalog navigation and, progressively, solution discovery.

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
