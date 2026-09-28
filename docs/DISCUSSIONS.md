# Loculary — Discussions and Deferred Ideas

This file preserves important ideas discussed during product discovery that are not yet durable implementation decisions. Ideas are not discarded merely because they are deferred.

## DISC-001 — Progressive/offline capability
**Status:** Accepted direction, implementation to be validated

Identify tools that can work fully offline and expose a clear indicator such as **📴 Fonctionne hors connexion**. Offline capability must not exclude useful tools that genuinely require a network.

## DISC-002 — Progressive loading for the large catalog
**Status:** Accepted direction

Thousands of tools must not mean thousands of implementations are loaded initially. Tools should be code-split and loaded on demand.

## DISC-003 — Heavy local processing
**Status:** Accepted direction

Heavy browser-side tools may use Web Workers, WebAssembly, chunking/streaming, and other appropriate techniques without forcing simple tools to pay the complexity cost.

## DISC-004 — PWA
**Status:** Candidate future capability

A Progressive Web App (PWA) is a website that can behave more like an installable application: home-screen installation, app-like launch, and selected offline capabilities.

My current recommendation is to **anticipate PWA compatibility but not make it an MVP dependency**. We should first build an excellent normal web experience, then add PWA capabilities where they provide real value.

## DISC-005 — Device capability awareness
**Status:** Accepted principle

Support modest devices without making the whole product visually or functionally inferior.

Use progressive enhancement:
- normal experience remains attractive;
- lightweight tools should work broadly;
- heavy tools may detect relevant capabilities;
- users should receive clear minimum/recommended requirements when needed;
- a heavy tool may disable itself or offer a lighter mode when the device cannot reasonably run it.

Avoid arbitrary device exclusion.

## DISC-006 — Performance budgets
**Status:** Accepted direction

Performance is a product constraint at platform/page, tool, and heavy mini-application levels. Simple tools should remain exceptionally fast; heavier tools may have higher justified budgets.

## DISC-007 — Progressive richness
**Status:** Accepted

> **La richesse doit être progressive.**

Users should not pay in complexity, loading time, memory usage, or cognitive load for features they do not need.

## DISC-008 — Graceful degradation
**Status:** Accepted direction

Prefer reduced animation, lighter rendering, local fallback, alternative workflow, clear requirement messages, and cancellation where feasible over silent failure.

## DISC-009 — Long-running operations
**Status:** Accepted direction

Provide truthful progress when measurable and explicit stages otherwise. Where technically possible, long-running operations should be cancellable.

## DISC-010 — Core Web Vitals and accessibility
**Status:** Accepted

Core Web Vitals are important platform health indicators. WCAG 2.2 AA is the target accessibility level. System reduced-motion preferences can reduce or disable non-essential animation.

## DISC-011 — Resilient external tools
**Status:** Accepted direction

External-service tools should use standardized resilience patterns where appropriate: timeout, controlled retry, circuit breaking when justified, fallback, clear user errors, and technical logging.

## DISC-012 — Performance testing
**Status:** Accepted direction

Performance validation should eventually exist at tool, page, and platform levels.

## DISC-013 — Future public child mode
**Status:** Future / not current scope

A child-oriented mode may eventually adapt vocabulary, complexity, explanations, animation, tool selection, safety, privacy, and advertising. It should be treated as a serious child-safety/privacy/legal/advertising product decision, not a casual theme.

## DISC-014 — Public user profile
**Status:** Future / not current scope

An authenticated user may eventually have an optional public profile containing selected elements such as pseudonym, avatar/photo, interests, favorite tools, public collections, and contributions. It must remain subordinate to the toolbox and not turn Loculary into a social network.

## DISC-015 — User-created themes
**Status:** Future capability

The personalization system may eventually allow users to create or customize themes beyond light/dark/system.

## DISC-016 — Personal Loculary space
**Status:** Accepted direction

Authenticated users should eventually personalize their Loculary space: hidden tools, ordering/layout, visible elements, theme, density/style, personalized home, favorites, collections, history/privacy settings, and contextual tool tone where feasible.

## DISC-017 — Shared/private collections
**Status:** Accepted direction

Users should eventually create collections that are private, shareable, or public by explicit choice.

## DISC-018 — Sharing modes
**Status:** Accepted direction

Where relevant, sharing should support a blank tool, configured tool, or current result/state. Sensitive data must not be exposed unintentionally.

## DISC-019 — Search as solution engine
**Status:** Accepted direction

Search should eventually understand a need rather than only a tool name. Example: “Mes photos sont trop lourdes pour un email” could lead toward relevant tools such as image compression. This may evolve toward multi-tool solution composition without requiring AI as the foundation.

## DISC-020 — Contextual tool tone
**Status:** Future capability

Tool tone may adapt to context while preserving clarity, usability and accessibility.

## DISC-021 — Rich contextual documentation
**Status:** Future capability

Some tools may include optional educational/contextual content such as history, origins, conventions, or explanations of differing standards. This remains secondary to the tool.

## DISC-022 — Visual identity exploration
**Status:** Future design work

Loculary should receive a real visual identity exploration rather than only a generic UI color palette: logo, typography, iconography, motion language, and the relationship between shared design and individual tool identities.

## DISC-023 — Three-level tool model
**Status:** Accepted direction

The catalog supports small tools, advanced tools, and mini-applications. All share platform trust/infrastructure contracts while allowing increasing implementation complexity.

## DISC-024 — Tool-specific visual identity
**Status:** Accepted direction

Tools may have their own visual/animation identity when useful, while respecting common accessibility, navigation, privacy, and interaction rules.

## DISC-025 — Personal history strategy
**Status:** Accepted direction

History may combine recently used tools, parameters/results when appropriate, local-only history, and synchronized metadata for authenticated users. Sensitive raw content should not synchronize by default.

## DISC-026 — Anonymous favorites merge
**Status:** Accepted direction

Anonymous local favorites may be merged into the authenticated account when a user signs in, with conflict handling.

## DISC-027 — Account personalization and privacy
**Status:** Accepted direction

Privacy and experience settings should be user-configurable rather than fixed globally.

## DISC-028 — Multi-language architecture
**Status:** Accepted direction

Support many languages over time with a language registry, progressive enablement, fallback language, partial translation handling, localized SEO, and future RTL support. French and English are initial languages.

## DISC-029 — Tool translation/content layers
**Status:** Accepted direction

Separate global UI locale files, tool-specific metadata/content, and larger editorial/documentation content. No hard-coded user-facing French strings in tool logic.

## DISC-030 — Community contributor attribution
**Status:** Accepted direction

Future contributor roles include original author, contributor, translator, improver, and maintainer. Contributor information should not clutter primary tool use.

## DISC-031 — Community moderation
**Status:** Accepted direction

Community features use authenticated participation, anti-spam, reporting, moderation status/history, and appropriate user controls.

## DISC-032 — Account-only ratings/comments
**Status:** Accepted direction

Ratings and comments require authentication. Anonymous users can still use tools and keep local personal state.

## DISC-033 — Tool lifecycle
**Status:** Accepted direction

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.

## DISC-034 — Community proposal lifecycle
**Status:** Accepted direction

Proposal → automatic validation → review → moderation/human validation → publish. Proposals may also be rejected, merged, transformed, or paused.

## DISC-035 — Granular permissions and audit
**Status:** Accepted direction

Administrative permissions should be granular. Sensitive changes should produce an audit trail recording who changed what, when, and why.

## DISC-036 — Tool capability contract
**Status:** Accepted direction

The Tool contract exposes capabilities such as local processing, file input, clipboard, camera, microphone, geolocation, external network, account data, and server/database access. Capability access should be enforced.

## DISC-037 — Server/client trust boundary
**Status:** Accepted

All client-provided data is untrusted. Client validation improves UX but never replaces server-side validation and authorization.

## DISC-038 — Ads abstraction
**Status:** Accepted direction

Advertising uses a provider abstraction so the provider can change or be disabled without modifying individual tools.

## DISC-039 — Analytics abstraction
**Status:** Accepted direction

Analytics use a provider-independent event interface so privacy/provider decisions can evolve without coupling the catalog to one vendor.

## DISC-040 — External API catalog
**Status:** Accepted direction

External providers are catalogued with data transmitted, purpose, domain, privacy policy, cost/quota, fallback behavior, ownership, and authentication model.

## DISC-041 — Data transparency dashboard
**Status:** Accepted direction

Authenticated users should inspect account-associated data, privacy/consent choices, retention/deletion state, and relevant connected services from one understandable dashboard.

## DISC-042 — PWA evaluation criteria
**Status:** Candidate evaluation

If PWA work is pursued, evaluate offline value, install UX, cache/storage complexity, update reliability, mobile/browser support, and impact on normal web performance.
