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

### 6. Material 3 Expressive shared visual foundation

Loculary adopts **Material 3 Expressive** as the shared visual and interaction direction for its web platform. The intended feel is distinctive, lively and Android-inspired: a polished web application that remains task-first rather than copying Android screens literally.

The detailed visual contract—including the blue seed, official MCU Rainbow palette, Roboto, semantic colors, light/dark contrast, components and motion—is maintained in [docs/DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Shared foundations should create coherence without forcing every tool into an identical layout. Specialized interfaces remain valid when they better serve the task and preserve accessibility, localization, responsiveness, performance and trust.

Appearance preferences should work locally for anonymous users and synchronize to an account when signed-in preference persistence is implemented. This is a product direction, not a claim that the feature already exists. WCAG 2.2 AA and reduced-motion preferences remain mandatory.

### 7. Broad functional ambition

Loculary is not limited to calculators or converters. Any useful browser-realizable tool can belong in the catalog: technical, practical, creative, educational, analytical, visual, playful, emotional, symbolic, or other categories.

The practical boundary is technical feasibility, legal/safety constraints, operational cost, and product quality.

### Helpful explanations and editorial quality

Loculary should deliver the useful result first while letting curious users understand more without forcing an explanation on everyone. When an explanation adds value, contextualize it using the user's actual inputs or result where appropriate. Prefer one realistic, relevant example over a list of repetitive or artificial examples. Every explanatory or editorial passage must help users understand, decide or use the tool; never add filler solely to lengthen a page or target search engines. Hide unnecessary complexity from the primary interaction without removing advanced capability that genuinely helps.

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

## Future evolution

Loculary may evolve from helping users find one useful tool to helping them solve broader needs through complementary tools or composed workflows. Favorites, collections and light/dark theme preferences should remain optional additions that do not make an account mandatory for core use. Further directions should be evaluated on demonstrated user value, feasibility and operating cost.
