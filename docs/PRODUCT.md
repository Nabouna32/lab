# Loculary — Product Definition

## Audience

The primary audience is **everyone who has a small digital task to accomplish**.

Examples include:

- calculating a percentage;
- converting a unit;
- checking download speed;
- transforming a file locally;
- generating something;
- comparing values;
- exploring a visual result;
- making a random decision;
- finding a specialized utility.

The product should not assume professional technical knowledge.

## Core experience

A user should be able to:

1. arrive at Loculary;
2. search or browse;
3. understand what an available tool does;
4. open it;
5. see the tool without unnecessary scrolling;
6. enter data;
7. obtain a clear result;
8. copy, reset, or share the result where relevant;
9. discover related tools if useful.

## Search

Search is a strategic product capability.

The target direction is progressive:

### Level 1 — Catalog search

Match tool names, descriptions, aliases, categories, and tags.

### Level 2 — Intent-aware search

Understand natural requests such as:

> “calculer 25 % de 180”

and identify the appropriate tool.

### Level 3 — Direct task assistance

Where safe and deterministic, search may prefill or directly execute a simple calculation.

### Discovery experience

The homepage is action/search-first, with deeper discovery through popular tools, categories, recent/new content and relevant recommendations. Navigation may expose user intentions such as calculating, converting, transforming, creating, analyzing, verifying, generating, measuring and discovering. An intent expresses a goal, not a category shortcut: one intent may lead to tools across several categories. Initial associations may be curated editorial data; deterministic inference or ranking may enrich them later.

The catalog should be able to grow substantially over time, but storage, indexing, caching, administration and loading strategies must be justified by current scale, measured performance and actual editorial needs. The current catalog remains Git-backed; DEC-051 defines when a database-backed catalog should be reconsidered. Executable tool behavior remains in Git.

Search should progressively support exact/prefix matching, descriptions, aliases, synonyms, tags, categories, typo tolerance, related queries and natural-language intent. Where safe and deterministic, it may prefill or directly execute a task. No-result states should help users reformulate, discover related tools/categories and eventually propose a missing tool.

### AI

External AI may eventually improve intent recognition or tool discovery, but it is **not required for the initial architecture**.

Any AI integration must justify its recurring cost, latency, privacy implications, reliability, and value.

A custom-trained AI is not a current requirement.

## Accounts

Accounts are optional.

Users must be able to use core tools without signing in.

An account can unlock features such as:

- synchronized favorites;
- collections;
- preferences;
- synchronized history where appropriate;
- future personalization features, including optional homepage/tool ordering and appearance preferences.

Anonymous users should be able to retain appropriate local state such as favorites and preferences. When signing in, local favorites can merge into account favorites with deterministic conflict handling. Collections may be private, shareable or public by explicit choice. Sharing may expose a blank tool, configured tool or current result/state depending on the tool; sensitive data must never be exposed unintentionally through URLs or shared state.

Public profiles are an optional future capability, not a prerequisite for accounts or core tool use. If introduced, users must explicitly choose what to expose, and private account data and collections must never become public by default. Theme customization should use curated, accessible choices and validated light/dark semantic mappings rather than assuming arbitrary colors are desirable.

The product should support anonymous/local usage first and account creation when it adds value.

## Local state and synchronized state

Without an account, useful non-sensitive state may be stored locally in the browser.

With an account, selected metadata can be synchronized.

Tool input/content must not automatically become cloud history. Sensitive content should remain local unless a feature explicitly requires remote processing and clearly explains it.

## Tool catalog

The platform supports three levels of tool complexity: small tools, advanced tools and mini-applications. A common framework must standardize navigation, metadata, privacy indicators, accessibility, common actions, analytics boundaries, SEO, error handling, lifecycle and discovery without forcing every tool into the same layout or interaction model.

There is no artificial limit on catalog categories or tool types; implementation complexity must remain proportionate to demonstrated needs.

It may contain:

- calculators;
- converters;
- text tools;
- image tools;
- audio/video tools;
- file tools;
- developer tools;
- date/time tools;
- finance tools;
- statistics;
- networking utilities;
- generators;
- visualizers;
- simulators;
- educational tools;
- creative tools;
- playful tools;
- decision tools;
- emotional/introspective tools;
- symbolic/spiritual tools;
- and other useful browser-realizable utilities.

There is no artificial category limit.

## Tool quality gate

A tool should be considered publishable only when its implementation and metadata meet the project's quality contract.

Expected checks include, as applicable:

- useful name and description;
- category and tags;
- search aliases;
- clear privacy/processing status;
- responsive behavior;
- accessibility;
- validation and error states;
- tests;
- SEO metadata;
- share/reset/copy behavior where relevant;
- performance appropriate to the tool;
- documentation;
- related-tool metadata;
- contribution attribution when applicable.

The exact automated contract will evolve with the tool platform.

Contextual tone and richer educational content are optional tool-level enhancements. They may provide useful background, origins, conventions or differing standards only when they help users understand or complete the task. They must remain secondary to the tool and must not become generic SEO filler.

### Explanation and content quality

- Put the useful result and primary interaction first; make explanations available without making them a barrier to use.
- Where useful, explain a result using the values the user actually entered rather than a disconnected generic explanation.
- Prefer concise, realistic examples that clarify a concept; avoid repetitive examples that add no new understanding.
- Editorial content must provide genuine help. Search visibility is not a justification for filler or artificially lengthened pages.
- Keep advanced options available when they provide real value, but prevent them from overwhelming the default experience.
- A feature, recommendation or content block should exist because it helps the user, not merely because the layout or catalog has room for it.

## Account experience

Loculary remains anonymous-first for core tools. The account layer is an optional personal surface for display name, language preference, authentication, password/email management and account deletion. It must not become a prerequisite for using the core toolbox.

## Tool diversity

A common tool framework must not force every tool to look identical.

The platform should standardize:

- navigation;
- metadata;
- privacy indicators;
- accessibility expectations;
- common actions;
- analytics boundaries;
- SEO;
- error handling;
- lifecycle and discovery.

Individual tools may still have distinctive layouts, visualizations, animations, and interactions.

## Community direction

A future community layer may allow users to:

- propose tool ideas;
- suggest improvements;
- rate tools;
- comment;
- discuss use cases.

Community content must be moderated and validated. It must not be allowed to compromise the quality, safety, or trustworthiness of the catalog.

A contributor may receive visible attribution/credit on an accepted tool or contribution.

The contribution system is a future capability, but the architecture should not make it impossible.

Community exists to improve the catalog, not to turn Loculary into a social network. Public profiles, public collections, proposals, ratings, comments, reports and contributor attribution remain subordinate to finding and using tools.

## Advertising

Loculary is intended to be free and sustainable through advertising.

Preferred principle:

> Advertising is visible, but the tool remains the dominant experience.

Potential desktop placement:

- side rail(s) when sufficient space exists;
- otherwise a less intrusive lower-page placement.

A persistent/sticky advertising unit may be considered when appropriate to the viewport and ad network rules, but it must not cover tool controls, results, navigation, or essential content.

Advertising placement must be responsive and must degrade gracefully on smaller screens.

## Analytics

Analytics are considered useful for product development, because the catalog needs evidence about:

- which tools are actually used;
- which searches fail;
- which tools are discovered but abandoned;
- which categories need improvement;
- performance and reliability issues.

However, analytics should be **privacy-conscious and proportionate**.

The default direction is to measure product usage without collecting the content users enter into tools.

No analytics decision should override the local-first privacy model.

## Internationalization

Initial languages:

- French;
- English.

The architecture must be prepared for additional languages.

Translations must be treated as product content, not scattered hard-coded strings.

## Future mobile client

A native or cross-platform Android application is a possible future product surface.

It should reuse suitable domain/tool logic where practical, but web development must not be slowed down by premature mobile abstractions.
