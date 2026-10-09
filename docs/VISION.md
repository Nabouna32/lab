# Loculary — Product Vision

## Purpose

Loculary is a universal browser-based toolbox: a large, continuously growing collection of useful tools that people can discover and use immediately.

The product goal is not simply to maximize the number of tools. The goal is to make a very large catalog feel **organized, understandable, modern, fast, visual, and pleasant to explore**.

The core user journey is:

> **I have a need → I find the right tool → I use it immediately → I get the expected result.**

## Product promise

Loculary should feel like a digital toolbox that is always worth opening when a user needs to calculate, convert, generate, analyze, visualize, decide, create, compare, test, or otherwise accomplish a small task.

A working positioning statement is:

> **Loculary — une boîte à outils numérique, simple à utiliser, immense à explorer.**

This wording is intentionally provisional. The product name remains **Loculary**.

## Product principles

### 1. Tool-first

The tool and its useful result are the primary content of a tool page. Supporting information must not prevent immediate use.

### 2. Local-first

When a task can reasonably be completed entirely in the browser, it should be processed locally. This reduces infrastructure cost, improves privacy, and can make tools work without sending user data to a server.

### 3. Transparent by design

Every tool must clearly communicate where processing happens and whether external services are involved.

Examples:

- **🔒 100 % local — vos données restent sur votre appareil**
- **🌐 Service externe — certaines données sont transmises à une API**
- **☁️ Serveur Loculary — ce traitement nécessite notre infrastructure**
- **🔒 + 🌐 Hybride — traitement local complété par un service externe**

The exact visual language is an implementation detail; the transparency requirement is not.

### 4. Simple by default, powerful when needed

Loculary should serve a casual user without training while still supporting advanced users.

### 5. Visual when visual helps

Results should be presented visually when that improves comprehension, confidence, or enjoyment. Visual design must not become decoration that slows or obscures the task.

### 6. Material 3 shared visual foundation

Loculary adopts **Material 3 Expressive** as the shared visual and interaction direction for its web platform. Expressive color, shape, typography, motion and component behavior should give the product a distinctive, lively, Android-inspired feel while preserving Loculary's task-first utility experience.

The default appearance is an **expressive multicolor palette with indigo seed #3F51B5**. Users should be able to choose among curated palettes in appearance settings. The seed is an input to accessible semantic tonal mappings, not a requirement to paint every primary role with the literal seed color. Light and dark themes must each use deliberate mappings, and success, warning, error and other status colors must retain their semantic meaning.

The shared direction covers navigation and headers, buttons, fields, switches, selection controls, menus, dialogs/popups, cards, feedback, typography, icons, surfaces and motion. Coherence comes from shared foundations and behavior, not from making every screen or tool identical. Specialized tool interfaces remain valid when they serve the task and preserve accessibility, localization, responsiveness, performance and trust requirements. The goal is a native-feeling web application, not a pixel-for-pixel copy of Android.

Curated palette preference should work locally for anonymous users and synchronize to the account when signed-in preference persistence is implemented. This is a product direction, not a claim that palette settings or account synchronization already exist. WCAG 2.2 AA and reduced-motion preferences remain mandatory.

### 7. Broad functional ambition

Loculary is not limited to calculators or converters. Any useful browser-realizable tool can belong in the catalog: technical, practical, creative, educational, analytical, visual, playful, emotional, symbolic, or other categories.

The practical boundary is technical feasibility, legal/safety constraints, operational cost, and product quality.

### 8. Free and sustainable

The core service is intended to remain free to users and may be funded primarily through advertising.

Advertising must not materially obstruct use of the tools.

If revenue becomes meaningful, a portion can be reinvested into infrastructure, development, reliability, and user experience.

## The Loculary duality

The catalog may eventually expose a deliberate spectrum between two complementary dimensions:

**Concrete / Utility**

- calculation
- measurement
- finance
- data
- development
- networking
- files
- productivity

**Exploration / Expression**

- creative tools
- random and decision tools
- playful experiences
- emotional or introspective tools
- symbolic or spiritual tools
- visual generators

These are not mutually exclusive categories. They describe different ways an interaction can be useful or meaningful.

## Long-term platform vision

The web application is the primary product. The architecture should avoid unnecessary coupling that would make a future Android application impractical.

A future Android client is a possibility, not an MVP constraint.

## Non-goals

At the current stage, Loculary is not:

- a mandatory-account product;
- a file-hosting service;
- a general-purpose cloud processing platform;
- an AI product by default;
- a social network;
- a promise that every tool must use the same visual treatment.

## Success feeling

The most important long-term product outcome is the user's feeling after using Loculary:

> **“That was easy, useful, and nicely made.”**

This is intentionally a product-quality goal rather than a single metric.

## Expanded product direction

Loculary is not merely a large list of utilities. The long-term product model is a **universal environment for solving needs** through micro-tools, advanced tools, and mini-applications.

The intended journey is:

> **Besoin → Loculary → recherche/découverte → outil(s) → résultat → action/partage/sauvegarde**

The working positioning may evolve, but the product promise is that Loculary helps users find simply how to accomplish something.

### Universal scope

Any useful browser-realizable tool may belong in the catalog, including technical, practical, creative, analytical, visual, educational, playful, emotional, introspective, symbolic, or spiritual experiences, subject to technical feasibility, safety/legal constraints, cost, and product quality. Symbolic or spiritual tools must be presented honestly rather than as scientific facts when they are not scientific claims.

### Progressive richness

The product should expose complexity progressively. Users should not pay in loading time, memory, cognitive load, or interface complexity for capabilities they do not need.

### Personal Loculary

Over time, authenticated users should be able to create a personalized Loculary space with favorites, collections, history, hidden tools, ordering, visible elements, theme, animation level, density/style, personalized home, privacy preferences, and other non-mode personalization preferences where useful.

### Three product layers

- **Public:** search, catalog, discovery.
- **Tool:** execution, result, explanation, actions, sharing.
- **Personal:** favorites, collections, history, preferences, personalization, profile.

Anonymous use must remain useful; personal features add depth rather than create an account wall.

### Long-term solution engine

The long-term ambition can evolve from finding a tool to solving a need. A complex request may eventually lead to several complementary tools or a composed workflow. This is future direction, not a requirement that the MVP implement multi-tool orchestration.


## UX/UI direction reset — 2026-09-28

Loculary's UX/UI direction has been explicitly reconsidered from first principles. Previous UX specifications and existing interface patterns are historical implementation context rather than constraints on the new design.

The intended experience is a **modern utility toolbox** rather than a generic SaaS landing page, dashboard or cold catalog.

The experience is organized around three user intentions:

- **Find something** — search for a known or approximately known need.
- **Figure out how to do something** — explore by intention when the user does not know the tool name.
- **Discover** — browse the possibilities offered by Loculary.

The preferred journey is:

> **Need → Find or explore → Tool → Action → Result → Next action**

The homepage should therefore foreground the user's action or need, especially search, and let discovery deepen below that primary entry point. A large marketing hero, excessive decorative sections and card-heavy layouts are not goals in themselves.

Tool pages should make the task the dominant experience. The primary interaction and result take precedence over documentation and discovery content. Results should lead naturally to relevant actions such as copying, downloading, resetting, sharing or continuing with another tool when applicable.

The platform should establish a coherent visual language without forcing every tool into an identical layout. Small utilities, advanced tools and mini-applications may use different compositions and visual treatments when this improves usability, comprehension or enjoyment.

The new visual direction should derive its sense of quality from hierarchy, typography, spacing, density, precision, feedback and purposeful motion rather than generic SaaS decoration.

This is an explicit evolution of the product's UX/UI direction. It does not change the browser-first, privacy, accessibility, internationalization, anonymous-first or tool-first product principles.
