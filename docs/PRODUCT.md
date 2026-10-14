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

### Discovery experience

The homepage is action/search-first, with deeper discovery through popular tools, categories, recent/new content and relevant recommendations. Navigation may expose user intentions such as calculating, converting, transforming, creating, analyzing, verifying, generating, measuring and discovering. An intent expresses a goal, not a category shortcut: one intent may lead to tools across several categories. Initial associations may be curated editorial data; deterministic inference or ranking may enrich them later.

The catalog should be able to grow substantially over time, but storage, indexing, caching, administration and loading strategies must be justified by current scale, measured performance and actual editorial needs. The current catalog remains Git-backed; DEC-030 defines when a database-backed catalog should be reconsidered. Executable tool behavior remains in Git.

Search supports exact/prefix matching, descriptions, aliases, synonyms, tags, categories, typo tolerance, related queries and natural-language intent. No-result states help users reformulate, discover related tools/categories and identify useful alternatives when no direct match exists.

## Accounts

Accounts are optional.

Users must be able to use core tools without signing in.

An account can unlock features such as:

- favorites synchronized with the account;
- personal collections, with optional sharing by link;
- account preferences; theme preference synchronization remains future work.

Anonymous users can retain favorites locally, and signing in merges local favorites into account favorites with deterministic conflict handling. Signed-in users can create, rename and delete personal collections, add or remove tools, and optionally share a collection through an explicit link. Collections are private by default; a share token grants read access only to the selected collection and its items. Do not put sensitive tool input or result data into collections or shared links. The light/dark theme preference currently works locally; account synchronization of that preference remains unimplemented.

The product should support anonymous/local usage first and account creation when it adds value.

## Local state and synchronized state

Without an account, useful non-sensitive state may be stored locally in the browser.

With an account, selected metadata can be synchronized.

Tool input and content must not be synchronized or stored by default. Sensitive content should remain local unless a feature explicitly requires remote processing and clearly explains it.

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

The exact automated contract will evolve with the tool platform.

### Explanation and content quality

- Put the useful result and primary interaction first; make explanations available without making them a barrier to use.
- Where useful, explain a result using the values the user actually entered rather than a disconnected generic explanation.
- Prefer concise, realistic examples that clarify a concept; avoid repetitive examples that add no new understanding.
- Editorial content must provide genuine help. Search visibility is not a justification for filler or artificially lengthened pages.
- Keep advanced options available when they provide real value, but prevent them from overwhelming the default experience.
- A feature, recommendation or content block should exist because it helps the user, not merely because the layout or catalog has room for it.

## Account experience

Loculary remains anonymous-first for core tools. The account layer is an optional personal surface for display name, language preference, authentication, password/email management, favorites and account deletion. Keep its settings straightforward; do not add a dedicated privacy dashboard. It must not become a prerequisite for using the core toolbox.

## Tool diversity

A common tool framework must not force every tool to look identical.

The platform should standardize:

- navigation;
- metadata;
- privacy indicators;
- accessibility expectations;
- common actions;
- SEO;
- error handling;
- lifecycle and discovery.

Individual tools may still have distinctive layouts, visualizations, animations, and interactions.

## Internationalization

Initial languages:

- French;
- English.

The architecture must be prepared for additional languages.

Translations must be treated as product content, not scattered hard-coded strings.
