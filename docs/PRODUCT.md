# Utiluna — Product Definition

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

1. arrive at Utiluna;
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
- future personalization features.

The product should support anonymous/local usage first and account creation when it adds value.

## Local state and synchronized state

Without an account, useful non-sensitive state may be stored locally in the browser.

With an account, selected metadata can be synchronized.

Tool input/content must not automatically become cloud history. Sensitive content should remain local unless a feature explicitly requires remote processing and clearly explains it.

## Tool catalog

The catalog is expected to become very large.

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

## Advertising

Utiluna is intended to be free and sustainable through advertising.

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

## Product decision authority

The project explicitly authorizes the technical lead/product owner role to make routine and reversible technical, UX, and low-impact product decisions independently.

Consult the user when a decision is genuinely consequential, especially when it materially changes:

- the fundamental product direction;
- long-term cost;
- user data handling;
- legal/compliance exposure;
- business model;
- irreversible public commitments.

This rule is part of the project's operating model.

## Expanded product direction

### Homepage and discovery

The homepage follows an **action/search first, discovery in depth** model. The primary question is effectively “Que voulez-vous faire ?”, followed by popular tools, categories, recent/new content, recommendations, and personalized content where applicable.

Intent-oriented navigation may expose actions such as:

- Calculer
- Convertir
- Transformer
- Créer
- Analyser
- Vérifier
- Générer
- Mesurer
- Découvrir

These are presentation concepts; the internal catalog remains structured with hierarchical categories and centrally managed tags/aliases.

### Search as solution discovery

Search must not require users to know a tool name. It should progressively support exact/prefix matching, descriptions, aliases, synonyms, tags, categories, typo tolerance, related queries, and natural-language intent. Deterministic requests may eventually be prefilled or executed directly where safe.

No-result states should help the user reformulate, discover related tools/categories, and eventually propose a missing tool.

### Anonymous-first personalization

Anonymous users should be able to use core tools and retain appropriate local state such as preferences or favorites. When signing in, local favorites can merge into account favorites with deterministic conflict handling.

Account features should progressively start with favorites and collections. Broader synchronized preferences, compatible history, personalization, community participation, and privacy/data controls remain later capabilities and should not be treated as near-term scope.

### Collections and sharing

Collections are first-class user objects and may be private, shareable, or public by explicit choice. Sharing may expose a blank tool, a configured tool, or a current result/state depending on the tool. Sensitive data must never be exposed unintentionally through sharing URLs or state.

### Tool diversity

The platform defines a common trust, accessibility, processing, SEO, lifecycle, and interaction contract, but tools retain the freedom to have distinct layouts, visualizations, animations, and interaction models. The catalog supports three complexity levels: small tools, advanced tools, and mini-applications.

### Community remains secondary

Community features are intended to improve the catalog, not turn Utiluna into a social network. Public profiles, public collections, proposals, ratings, comments, reports, and contributor attribution remain subordinate to the toolbox experience.
