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
- anonymous preferences;
- other operations that can safely run locally.

### Backend / hosted services

Appropriate for:

- authentication;
- synchronized user metadata;
- favorites and collections;
- account preferences;
- catalog metadata when beneficial;
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

The implemented account provider is Supabase email/password authentication. Core tools remain usable anonymously. Additional sign-in providers are optional future work, not a current requirement; add one only when a demonstrated user need justifies the extra account, configuration and support surface.

### Implemented account authentication architecture

Loculary uses Supabase Auth with the Next.js App Router and PKCE for email confirmation and recovery links. Server Components, Server Actions and Route Handlers use the SSR Supabase client; identity checks use `getClaims()` for route/session protection and `getUser()` where a fresh Auth user record is required. The Proxy refreshes Auth state on account, Auth and administrative routes.

Account data is intentionally small: Supabase Auth owns credentials, email verification, sessions and the canonical email address; `public.profiles` stores only display name and locale. Profile RLS requires both ownership and a live `auth.sessions` row, so a revoked session cannot continue to read or modify profile data while its JWT is still unexpired.

Password recovery uses Supabase's PKCE reset flow. Password changes from the signed-in account require the current password. Email changes use Supabase's native confirmation flow and do not bypass Secure Email Change protections.

Account deletion is a server-side Supabase Edge Function authenticated with the user's JWT. It permanently deletes the Auth user with the server-only secret key, allowing Auth cascades to remove account-owned rows. The read-only `check_account_deletion` preflight provides the normal UX check; it is not authoritative because its transaction ends before the Auth Admin request. A `BEFORE DELETE` trigger on `auth.users` is authoritative: it shares the transaction-scoped advisory lock with guarded `super_admin` role removal, rejects deletion of the last `super_admin`, and clears polymorphic user-target references in `admin_audit_log` in the same transaction. The `actor_user_id` foreign key uses `ON DELETE SET NULL`. If deletion is rejected, audit cleanup rolls back with it. Local Supabase CI exercises concurrent role removal/deletion and both successful ordinary-user deletion and last-super-admin rejection through the Auth Admin API.

## Database

The deployed database currently supports:

- account identity/profile metadata;
- favorites and personal collections;
- administrative RBAC and audit data.

Synchronized preferences, tool metadata and privacy-conscious analytics remain possible future domains only when justified by concrete requirements.

Supabase/PostgreSQL is the current database platform for the deployed account, administrative RBAC and audit foundation. The public tool catalog remains Git-backed, and the legacy database catalog schema is not deployed; no catalog migration is currently scheduled.

A database-backed catalog may be reconsidered when a concrete product or operational need cannot be served well by the Git-backed model. Relevant evidence includes a demonstrated publishing workflow that needs authorized edits without code deployment, a measured search/build/delivery bottleneck, or administration and audit requirements that Git cannot reasonably meet. Catalog size by itself is not sufficient justification. See DEC-030 for the decision criteria.

Catalog storage and delivery must remain separate from executable tool implementations. Git/code remains authoritative for registry modules, processing mode, capabilities and actual tool logic. Any future data-store change must preserve that boundary and justify its operational cost.

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
- Node.js tests, linting, type checking, and production builds as the automated validation baseline.

Browser-level E2E, Playwright and screenshot automation are out of scope unless the user explicitly revisits that decision.

This is the current baseline, not an immutable commitment.

Any major technology change must be justified against the product's browser-first, SEO, performance, maintainability, and cost requirements.

## Expanded platform model

### Three product layers

The architecture should preserve a clear separation between:

1. **Public discovery** — catalog, search, categories, SEO, related tools;
2. **Tool execution** — inputs, processing, results, actions, sharing;
3. **Personal layer** — identity, preferences, favorites and collections.

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

Use the least powerful persistence layer that satisfies the requirement: React/local state for transient state, URL state for safe shareable configuration, localStorage for small preferences, IndexedDB for larger local structured state, and account-backed persistence for selected cross-device metadata such as favorites, collections and theme preference. Sensitive raw tool content should remain local by default.

When local and account state are merged, the synchronization strategy and conflict behavior must be deterministic and explicit.

### Search and solution discovery

Search is a platform subsystem rather than a simple filter. It should support catalog matching, aliases/synonyms/tags/categories, typo tolerance, intent, and eventually a solution-engine layer that can connect multiple tools. AI may sit behind this abstraction but must remain optional.

### External services

Every external API/provider should be traceable through an integration catalog containing purpose, domain, transmitted data, authentication model, cost/quota, fallback behavior, ownership, and relevant policy references. Provider-specific analytics implementations should remain behind abstractions.

### Resilience and performance

External tools should use appropriate timeout, controlled retry, fallback, and clear error patterns. The platform should progressively load tools, enforce page/tool performance budgets, support graceful degradation, and test simple tools and heavy mini-applications separately.

### Future clients

Web remains the primary product. Android and other clients are future surfaces. Shared domain/tool logic may be extracted when it has immediate value, but the web architecture must not acquire costly abstractions solely for hypothetical clients.
