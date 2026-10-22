# SEO editorial policy

## Purpose

Loculary indexes pages because they help a person complete a distinct task, not simply because a route exists or a resource is published. Search visibility is a product decision as well as a technical one.

## Page families

- **Tool pages:** the primary search landing pages. Each locale needs a task-specific title and description, a working tool, accurate instructions or examples appropriate to the tool, and transparent processing/limitations information where relevant.
- **Category pages:** index only when the category represents a coherent group of tasks and its page description helps users decide whether the group is relevant. A category with a single tool is not automatically an SEO landing page.
- **Guided workflows:** index when the steps connect into a meaningful task with a clear outcome; do not generate near-duplicate workflows to target keyword variations.
- **Navigation, search, filters, personal and account pages:** remain excluded where their URLs are personalized, parameterized, duplicative or not useful as independent search landings.

## Explicit indexability

- Each locale's tool SEO metadata declares `indexable: true | false`. The catalog validator rejects missing decisions. A non-indexable localized tool page emits `noindex, follow` and is omitted from the shared sitemap inventory.
- Category decisions live in `src/lib/seo/category-policy.ts`. A category defaults to non-indexable if it has no explicit policy. The same policy controls its sitemap inclusion, metadata robots directive and localized page description.
- A page that is not indexable can remain accessible and useful through in-product navigation.
- Do not use word count as a universal quality threshold. Assess task coverage, specificity, correctness, usability, localization, and duplication instead.
- Never invent a translation or add an alternate-language URL that is not actually available.

## Current category decisions

The current catalog contains 51 published tools: calculations (7), dates (4), computing (7), files (7), development (20), images (7), and video (1). These counts reflect the catalog at the time this policy was introduced and should be derived from code rather than maintained as documentation.

- Calculations, dates, computing, files, development and images have explicit indexable status and category-specific descriptions in French and English.
- Video remains available in the product but is not indexed as a standalone category landing page yet: it currently groups one tool, so its category page adds limited discovery value beyond that tool page. Revisit this decision when the category's actual breadth or page value changes.

## Review checklist for new or changed pages

1. What concrete task or question does the page solve?
2. Is that intent distinct from other indexable pages, in both French and English?
3. Does the page provide useful information or functionality beyond a list of links and generic copy?
4. Are claims, formulas, examples, supported formats, limitations and privacy statements accurate?
5. Are title, description, canonical URL and alternate-language links correct?
6. Is the page intentionally indexable in each published locale?
7. Does the shared sitemap include only indexable, canonical public URLs?
8. Do automated tests cover the decision and its effects?

## Scope and limitations

This policy describes the product's intended behavior; it does not prove that search engines have indexed a page or that the page ranks well. Search Console data and a final production domain will be needed to assess impressions, queries, indexing status and actual search performance. Editorial review remains a human quality judgment; automated checks can enforce explicit decisions and detect structural defects but cannot prove usefulness or accuracy.
