# SEO editorial policy

## Purpose

Loculary indexes pages because they help a person complete a distinct task, not simply because a route exists or a resource is published. Search visibility is a product decision as well as a technical one.

## Page families

- **Tool pages:** the primary search landing pages. Each locale needs a task-specific title and description, a working tool, accurate instructions or examples appropriate to the tool, and transparent processing/limitations information where relevant.
- **Category pages:** eligible categories are included automatically when they have published tools and localized editorial descriptions. A single-tool category is not automatically excluded; assess its distinct user value and overlap with tool pages instead of using an arbitrary count threshold.
- **Guided workflows:** index when the steps connect into a meaningful task with a clear outcome; do not generate near-duplicate workflows to target keyword variations.
- **Navigation, search, filters, personal and account pages:** remain excluded where their URLs are personalized, parameterized, duplicative or not useful as independent search landings.

## Indexability policy

- Each locale's tool SEO metadata declares `indexable: true | false`. The catalog validator rejects missing decisions. A non-indexable localized tool page emits `noindex, follow` and is omitted from the shared sitemap inventory.
- Category SEO descriptions live in `src/lib/seo/category-policy.ts`. A category must have useful French and English descriptions to qualify for automatic indexability; unknown categories fail closed until their localized metadata exists.
- Category indexability defaults to **included** when localized editorial metadata exists. `excludedCategorySeoReasons` is the exception list: each exclusion must include a concrete reason and is reviewed as content and category coverage evolve.
- The sitemap inventory additionally requires at least one published tool in a category. Empty categories do not enter the sitemap.
- A page that is not indexable can remain accessible and useful through in-product navigation.
- Do not use word count or tool count as a universal quality threshold. Assess task coverage, specificity, correctness, usability, localization, and duplication instead.
- Never invent a translation or add an alternate-language URL that is not actually available.

## Current category decisions

The current catalog contains seven categories. All seven currently have localized editorial descriptions and are eligible for indexing, including Video. Its single-tool count is not by itself sufficient reason to exclude it. The sitemap includes only categories with published tools.

## Review checklist for new or changed pages

1. What concrete task or question does the page solve?
2. Is that intent distinct from other indexable pages, in both French and English?
3. Does the page provide useful information or functionality beyond a list of links and generic copy?
4. Are claims, formulas, examples, supported formats, limitations and privacy statements accurate?
5. Are title, description, canonical URL and alternate-language links correct?
6. Are useful localized descriptions present in every published locale?
7. Does the shared sitemap include only indexable, canonical public URLs with published content?
8. If an exclusion is necessary, is its reason explicit and reviewable?
9. Do automated tests cover the decision and its effects?

## Scope and limitations

This policy describes the product's intended behavior; it does not prove that search engines have indexed a page or that the page ranks well. Search Console data and a final production domain will be needed to assess impressions, queries, indexing status and actual search performance. Editorial review remains a human quality judgment; automated checks can enforce localization and structural eligibility but cannot prove usefulness or accuracy.