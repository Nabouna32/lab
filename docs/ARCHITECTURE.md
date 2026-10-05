# Loculary — Architecture Direction

## Status

This document defines the architectural direction from the current product discovery phase. It intentionally separates firm product constraints from implementation details that remain open.

## Primary architecture principle

**Browser-first processing.**

Whenever a useful operation can reasonably run in the browser, the browser should perform it.

The server is not intended to become a general-purpose file-processing backend.

## Responsibility split

### Browser

Preferred location for:

- calculations;
- conversions;
- text processing;
- local file transformations;
- image processing;
- client-side visualization;
- interactive simulations;
- random generators;
- local history;
- anonymous preferences;
- other operations that can safely run locally.

### Backend / hosted services

Appropriate for:

- authentication;
- synchronized user metadata;
- favorites and collections;
- account preferences;
- optional synchronized history;
- catalog metadata when beneficial;
- community features;
- moderation;
- lightweight analytics;
- selected external API orchestration;
- operations that genuinely require a server.

### External APIs

Allowed when they provide meaningful capabilities that cannot reasonably be provided locally.

Examples may include:

- live weather;
- public data;
- exchange rates;
- selected enrichment;
- future AI-assisted search.

External services must be explicit in the tool's processing-status metadata.

## File handling

Large file uploads/downloads through Loculary infrastructure are intentionally avoided as a default architecture.

If a file operation can be performed locally, the preferred flow is:

> User device → browser → local processing → result

No Loculary upload is required.

A server-side file workflow requires explicit product justification because it affects:

- infrastructure cost;
- bandwidth;
- privacy;
- abuse surface;
- reliability;
- operational complexity.

## Tool platform

The long-term platform should treat tools as first-class domain objects rather than unrelated pages.

A conceptual tool definition may contain:

- stable identifier;
- display name;
- description;
- category;
- tags;
- search aliases;
- localization keys;
- icon/visual metadata;
- processing mode;
- external dependencies;
- capabilities;
- SEO metadata;
- related tools;
- documentation;
- contribution attribution;
- validation/test metadata.

The exact schema is not frozen yet.

## Tool implementations

The platform must allow diversity.

A shared tool contract should standardize infrastructure concerns without requiring every tool to share the same UI.

Possible implementation classes include:

- simple deterministic calculators;
- structured form tools;
- visual generators;
- interactive editors;
- local file processors;
- simulations;
- API-backed tools;
- future AI-assisted tools.

## Tool definitions vs custom experiences

A structured definition system is encouraged for tools whose behavior can be represented safely and clearly.

However, it must not become a lowest-common-denominator renderer.

A tool may opt into a custom implementation when it needs:

- unique visualization;
- complex interaction;
- custom animation;
- specialized processing;
- non-standard layout.

The platform should make custom tools first-class rather than treating them as hacks.

## Privacy model

The architecture should expose processing location as explicit metadata.

A tool should declare whether it is:

- local-only;
- external-service backed;
- server-backed;
- hybrid.

This metadata can drive:

- UI indicators;
- privacy details;
- search filters;
- documentation;
- auditing.

## State model

Use local browser state where account synchronization is unnecessary.

Candidate local storage layers include:

- localStorage for small preferences;
- IndexedDB for larger structured local state.

The final choice should be based on the actual data requirements.

Account-backed state should store metadata rather than raw sensitive tool content by default.

## Search architecture

Search should be designed as a first-class system rather than a simple text filter.

The catalog should support:

- exact names;
- aliases;
- descriptions;
- categories;
- tags;
- localization;
- intent associations;
- related tools.

The catalog should model intents separately from categories, with many-to-many associations between intents and tools. Natural-language intent resolution may later generate or rank candidates through the search subsystem without changing the underlying catalog semantics.

AI can be added behind the search abstraction if its value justifies cost and privacy trade-offs.

## Authentication

Authentication should support popular providers in addition to a low-friction account option.

Initial provider selection remains an implementation decision.

Anonymous usage is mandatory for core functionality.

### Implemented account authentication architecture

Loculary uses Supabase Auth with the Next.js App Router and PKCE for email confirmation and recovery links. Server Components, Server Actions and Route Handlers use the SSR Supabase client; identity checks use `getClaims()` for route/session protection and `getUser()` where a fresh Auth user record is required. The Proxy refreshes Auth state on account, Auth and administrative routes.

Account data is intentionally small: Supabase Auth owns credentials, email verification, sessions and the canonical email address; `public.profiles` stores only display name and locale. Profile RLS requires both ownership and a live `auth.sessions` row, so a revoked session cannot continue to read or modify profile data while its JWT is still unexpired.

Password recovery uses Supabase's PKCE reset flow. Password changes from the signed-in account require the current password. Email changes use Supabase's native confirmation flow and do not bypass Secure Email Change protections.

Account deletion is a server-side Supabase Edge Function authenticated with the user's JWT. It permanently deletes the Auth user with the server-only secret key, allowing Auth cascades to remove account-owned rows. Administrative audit records are retained for security/integrity but direct actor/target user references are anonymized. Deleting the last `super_admin` is blocked until another super administrator exists, with account deletion and `super_admin` role removal serialized at the database layer to preserve that invariant under concurrent requests.

## Database

A database is expected to become useful for:

- users;
- favorites;
- collections;
- synchronized preferences;
- community proposals;
- ratings;
- comments;
- moderation state;
- tool metadata where appropriate;
- privacy-conscious analytics data.

The initial database technology and hosting provider remain open until the implementation requirements are sufficiently known.

A small paid database/infrastructure budget is acceptable once product revenue or traffic justifies it.

### Large-catalog readiness

The catalog is expected to grow to thousands or potentially tens of thousands of tools. The architecture must therefore be designed for large-catalog operation from the outset rather than retrofitted after the catalog becomes large.

Catalog storage/delivery and executable tool implementations remain separate concerns. The catalog layer should be evaluated for:

- indexed and filtered retrieval;
- localized metadata and search;
- publication/lifecycle workflows;
- relations and intent/discovery data;
- caching and invalidation;
- progressive loading and payload size;
- administration and auditability;
- reliability and operational cost.

The editable catalog follows the database boundary established by DEC-027, while executable tool implementations remain in Git. Large-catalog concerns such as indexing, caching, progressive loading, payload size, reliability and operational cost must be designed into the catalog architecture.

A migration must not move executable tool behavior into the database merely because catalog data moves there. Git/code remains the authority for executable implementations.

## Community architecture

Community functionality should be isolated enough that it cannot compromise the core tool experience.

Potential entities:

- tool proposal;
- contribution;
- rating;
- comment;
- moderation action;
- contributor attribution.

All user-generated content requires validation/moderation.

## Analytics architecture

Analytics should measure product behavior without collecting tool input content by default.

The system should be capable of answering questions such as:

- Which tools are used?
- Which searches produce no useful result?
- Which tools have poor engagement?
- Which categories are growing?
- Where are technical failures occurring?

The exact provider is not decided yet.

## Technology baseline

The current repository uses:

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS;
- Vercel for production hosting;
- GitHub Actions for CI;
- Playwright for browser-level validation.

This is the current baseline, not an immutable commitment.

Any major technology change must be justified against the product's browser-first, SEO, performance, maintainability, and cost requirements.

## Future Android client

The web platform remains primary.

Tool/domain logic should be separated from browser-specific infrastructure when doing so is inexpensive and useful, but the architecture must not introduce abstractions solely for a hypothetical future mobile client.

## Expanded platform model

### Three product layers

The architecture should preserve a clear separation between:

1. **Public discovery** — catalog, search, categories, SEO, related tools;
2. **Tool execution** — inputs, processing, results, actions, sharing;
3. **Personal layer** — identity, preferences, favorites, collections, history, personalization, community participation.

This separation allows anonymous-first usage while providing a coherent path to authenticated personalization.

### Tool complexity levels

The platform supports three implementation levels:

- **small tools** for deterministic/simple tasks;
- **advanced tools** for richer analysis, editing, processing, or technical workflows;
- **mini-applications** for multi-step or state-rich experiences.

All levels share platform contracts for trust, privacy, capabilities, accessibility, performance, SEO, lifecycle, and discovery. Complexity should not force the entire platform to pay the cost of the heaviest tool.

### Capability model

Tool capabilities should be explicit and eventually enforceable. Examples include local processing, file input, clipboard, camera, microphone, geolocation, external network/API access, account data, and server/database access. A tool should receive only the capabilities it requires.

### Browser processing escalation

For heavier local workloads, prefer progressive escalation: main-thread processing for small tasks, Web Workers for expensive work, WebAssembly where justified, and chunking/streaming for large local datasets. Long-running operations should expose truthful progress and cancellation when technically possible.

### State and synchronization

Use the least powerful persistence layer that satisfies the requirement: React/local state for transient state, URL state for safe shareable configuration, localStorage for small preferences, IndexedDB for larger local structured state, and account-backed persistence for selected cross-device metadata. Sensitive raw tool content should remain local by default.

When local and account state are merged, the synchronization strategy and conflict behavior must be deterministic and explicit.

### Search and solution discovery

Search is a platform subsystem rather than a simple filter. It should support catalog matching, aliases/synonyms/tags/categories, typo tolerance, intent, and eventually a solution-engine layer that can connect multiple tools. AI may sit behind this abstraction but must remain optional.

### External services

Every external API/provider should be traceable through an integration catalog containing purpose, domain, transmitted data, authentication model, cost/quota, fallback behavior, ownership, and relevant policy references. Provider-specific analytics and advertising implementations should also remain behind abstractions.

### Resilience and performance

External tools should use appropriate timeout, controlled retry, fallback, and clear error patterns. The platform should progressively load tools, enforce page/tool performance budgets, support graceful degradation, and test simple tools and heavy mini-applications separately.

### Future clients

Web remains the primary product. Android and other clients are future surfaces. Shared domain/tool logic may be extracted when it has immediate value, but the web architecture must not acquire costly abstractions solely for hypothetical clients.
