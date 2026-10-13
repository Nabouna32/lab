# Loculary — Architecture and Product Decisions

This file records durable decisions and the reasoning behind them. It should be updated when a decision materially changes.

## DEC-001 — Browser-first processing

**Status:** Accepted

### Decision

Prefer browser-side processing whenever a task can reasonably be completed locally.

### Reason

This reduces server bandwidth and storage requirements, improves privacy, and keeps the product viable with a small infrastructure budget.

### Consequences

Some tools will require browser APIs, WebAssembly, client-side libraries, or local browser storage.

Server-side processing remains available when genuinely necessary.

---

## DEC-002 — Anonymous-first usage

**Status:** Accepted

### Decision

Core tools must work without an account.

### Reason

Loculary is a utility site. Requiring registration before a simple calculation would add unnecessary friction.

### Consequences

Local browser state can provide preferences before authentication.

Accounts add synchronization and personalization rather than basic access.

---

## DEC-003 — Transparent processing status

**Status:** Accepted

### Decision

Every tool should clearly expose where processing occurs and whether data is transmitted externally.

### Reason

Local-first architecture is only valuable to users if they can understand it.

### Consequences

Processing classification becomes part of tool metadata and UI.

---

## DEC-004 — Tool diversity is allowed

**Status:** Accepted

### Decision

A shared platform contract must not force all tools to use the same visual interaction.

### Reason

Loculary's value includes visual, interactive, playful, and specialized experiences.

### Consequences

The platform standardizes infrastructure and trust requirements, while custom tool UIs remain first-class.

---

## DEC-008 — AI is conditional, not foundational

**Status:** Accepted

### Decision

AI may be used for search/intention assistance if it creates enough value to justify cost, latency, privacy, and reliability trade-offs.

### Reason

AI is useful but recurring external API costs and data handling must be justified.

### Consequences

Search architecture should allow an intelligence layer without requiring one from day one.

---

## DEC-009 — Current web stack remains the baseline

**Status:** Accepted

### Decision

Keep Next.js, React, TypeScript, Tailwind CSS, Vercel, and GitHub Actions as the current baseline unless implementation evidence justifies a change. Browser-level E2E automation is governed separately by DEC-049.

### Reason

The existing stack supports the current product requirements and avoids unnecessary migration work.

### Consequences

Architecture should be designed around product requirements rather than framework assumptions.

---

## DEC-011 — Privacy is a product feature

**Status:** Accepted

### Decision

Privacy and transparency are first-class product requirements, not merely compliance documentation.

### Principles

- collect the minimum necessary data;
- prefer local processing;
- never request data a tool does not need;
- disclose every meaningful data transfer;
- provide understandable privacy details;
- support export;
- support account deletion with deletion or strong anonymization where deletion is impossible;
- make non-essential consent refusal easy;
- treat imported and client-provided data as untrusted.

### Reason

Users should be able to understand and control their relationship with Loculary instead of being forced to trust an opaque system.

---

## DEC-012 — Simple consent choices

**Status:** Accepted

### Decision

Consent UX must make refusal of non-essential tracking as easy as acceptance.

### Reason

Privacy controls should not become a maze of partner-by-partner decisions.

### Consequences

Loculary should provide clear high-level choices such as accept, refuse non-essential tracking, or customize, while retaining the granular controls required by the actual legal/provider setup.

---

## DEC-013 — Capability-based tool permissions

**Status:** Accepted

### Decision

Tools must explicitly declare and receive only the browser, network, account-data, and server capabilities they require.

### Reason

A universal toolbox will eventually contain many independent implementations. Capability boundaries reduce accidental data access and limit the impact of a compromised or defective tool.

### Consequences

The Tool contract must include capabilities. Tool execution architecture should enforce these boundaries rather than relying only on developer discipline.

---

## DEC-014 — External integrations are catalogued

**Status:** Accepted

### Decision

Every external API/provider integration must be documented in a traceable catalog.

### Reason

External dependencies affect privacy, cost, availability, security, and user trust.

### Consequences

The catalog must include provider, domain, purpose, transmitted data, authentication model, policy reference, cost/quota, fallback behavior, and ownership.

---

## DEC-016 — Three-layer product model
**Status:** Accepted

### Decision

Structure the product conceptually around three layers: **Public discovery**, **Tool execution**, and **Personal**.

### Consequences

Anonymous users can use the public and tool layers without an account. Authentication may add synchronized favorites, personal collections and account preferences without creating an account wall. Local-only state remains local unless a separate product requirement justifies otherwise.

---

## DEC-017 — First-class collections and explicit link sharing

**Status:** Accepted

### Decision

Collections are first-class user-owned objects, private by default, with optional sharing through an explicit link. Tool sharing may preserve a blank configuration, configured state, or current result when appropriate.

### Consequences

Sensitive values must not be exposed unintentionally in URLs or shared state. Local anonymous favorites may be merged into the account with deterministic conflict handling.

---

## DEC-018 — Three levels of tool complexity

**Status:** Accepted

### Decision

The platform supports small tools, advanced tools, and mini-applications while keeping common trust, privacy, capability, accessibility, performance, SEO and lifecycle contracts.

### Reason

A universal toolbox must support both tiny deterministic utilities and rich applications without forcing one implementation model on every tool.

---

## DEC-019 — Progressive richness and capability-aware performance

**Status:** Accepted

### Decision

Complexity must be loaded progressively. Heavy tools may use Workers, WebAssembly, chunking/streaming and capability checks, while simple tools remain lightweight. Long-running work should expose truthful progress and cancellation when possible.

### Reason

The product must remain fast and usable on modest devices and slow connections without excluding genuinely useful heavy tools.

---

## DEC-020 — Search is a solution-discovery subsystem

**Status:** Accepted

### Decision

Search is not limited to tool-name matching. It progressively supports catalog matching, aliases/synonyms/tags/categories, typo tolerance, natural-language intent and eventually multi-tool solution discovery. AI remains optional.

### Consequences

Search must remain useful without an AI provider and must expose no-result recovery paths such as related queries, related tools and relevant categories.

---

## DEC-022 — First-class tool registry and dynamic execution route

**Status:** Accepted

### Decision

Published tools are resolved through a central registry that maps stable tool identifiers to independently loadable implementation modules. Public tool URLs use a generic dynamic route rather than one handwritten App Router page per tool.

The registry owns the connection between product catalog entries and executable modules, while the generic ToolPage shell owns shared platform UX.

### Reason

Loculary is intended to grow to a large catalog. Maintaining one route, metadata wiring and page composition per tool would create unnecessary duplication and make cross-cutting platform changes expensive.

A registry also provides a controlled boundary for progressive code loading and future capability enforcement without forcing every tool into a common UI renderer.

### Consequences

- New tools should normally add a catalog entry and a registry module rather than a new route.
- Tool implementations remain custom and first-class.
- Shared platform concerns remain outside individual tool implementations.
- Registry coverage must be validated by automated architecture tests.
- The catalog/database and executable module remain separate concerns.

---

## DEC-023 — Tool-scoped runtime capabilities

**Status:** Accepted

### Decision

Tool capabilities are runtime permissions, not merely catalog metadata. A published tool receives a tool-scoped runtime containing only the capabilities declared by its contract.

Platform/browser capabilities must be exposed through controlled runtime services rather than direct calls from individual tools whenever a reusable abstraction exists.

The `access` policy is a separate axis from processing and uses:

- `anonymous`;
- `account`;
- `premium`.

### Reason

The tool platform is expected to scale to many independently implemented tools. Declarative metadata alone cannot guarantee that an implementation actually respects its declared privacy and capability boundaries.

Separating access from processing also prevents an accidental architectural coupling such as "server-backed means premium".

### Consequences

- Tool modules must use the platform runtime for capabilities that have a runtime abstraction.
- The runtime currently enforces clipboard access.
- Future browser, persistence, network and account capabilities should use the same controlled boundary.
- Tool metadata remains authoritative for the declared requirement, while executable platform services enforce the actual permission at runtime.

## DEC-025 — Granular admin RBAC in the database

**Status:** Accepted

### Decision

Administrative access is modeled with database-backed roles and granular permissions rather than a single administrator flag. Roles bundle permissions, while user-role assignments determine who receives them.

The first foundation includes `super_admin` and `admin` roles, permissions for dashboard access, user administration and audit access, and an audit log. Administrative authorization is enforced server-side and in database policies; hiding an interface element is not considered an authorization boundary.

### Reason

Loculary will eventually have several administrative areas with different responsibilities. A single `is_admin` flag would make delegation and least-privilege access difficult and would force a later migration.

### Consequences

- The database stores roles, permissions, role-permission bindings and user-role assignments.
- Sensitive administrative data is protected by Row Level Security.
- The first administrator must be assigned explicitly; there is no automatic "first user becomes admin" bootstrap.
- Executable tool behavior remains in Git/code and is not moved into the database by this decision.
- The model can grow with future administration areas without changing the basic authorization mechanism.

## DEC-026 — System administration labels belong to application i18n

**Status:** Accepted

### Decision

Administrative roles and permissions are identified in the database by stable technical keys only. Human-readable names and descriptions for those system-defined objects belong to the application i18n layer rather than PostgreSQL columns.

### Reason

System roles and permissions are part of the application contract, not editable content. Storing one natural language description in the database would make localization incomplete and couple authorization data to a single language.

### Consequences

- `admin_roles` and `admin_permissions` store stable keys and operational metadata only.
- User-facing labels and descriptions are translated through the normal locale system.
- Future editable catalog/editorial content may use database translation tables because that content is intentionally administrable.
- Authorization logic continues to use stable keys and never depends on translated text.

## DEC-028 — Explicit decimal and binary file-size units

**Status:** Accepted

### Decision

File-size conversions distinguish decimal SI units from binary IEC units. Decimal units use powers of 1,000 (kB, MB, GB, TB; ko, Mo, Go, To in French). Binary units use powers of 1,024 and the IEC prefixes (KiB, MiB, GiB, TiB; Kio, Mio, Gio, Tio in French).

Internet transfer rates remain decimal and are expressed in bits per second or their byte-per-second equivalents.

### Reason

Using 1,024 while displaying decimal labels such as kB/ko makes the displayed unit ambiguous. Supporting both conventions lets the tool handle the real conventions users encounter without silently changing the meaning of a unit.

### Consequences

- 1 ko = 1,000 o and 1 Kio = 1,024 o.
- 1 Mo = 1,000,000 o and 1 Mio = 1,048,576 o.
- Download-time calculations continue to use decimal file sizes and decimal network speeds.
- Speed conversion continues to use decimal units and preserves the 8-bit-per-byte relationship.

## DEC-030 — English is the product translation fallback

**Status:** Accepted

### Decision

English is the fallback language for localized tool content when the requested locale has no translation. French remains a fully supported initial language, but missing translations must not fall back to French.

Tool localized content therefore requires both French and English entries. Additional languages may be partial and fall back to English until translated.

### Reason

Loculary is designed as an international product. English provides a neutral shared fallback as more languages are introduced, while French remains fully supported as the user's current native development language and one of the initial product languages.

### Consequences

- `getToolContent()` falls back to English.
- Tool content contracts require both `fr` and `en`.
- New locales do not inherit French content accidentally.
- French translations remain unchanged and are still used whenever the locale is `fr`.

## DEC-031 — Translation status is an explicit readiness signal

**Status:** Accepted

### Decision

`translationStatus` is a product readiness signal for each enabled locale. It is not derived automatically from matching translation keys, content structure, or fallback behavior.
- **`complete`** means the currently supported user-facing translation scope for that locale has been reviewed and explicitly declared complete.
- **`partial`** means the locale is usable, but completeness has not been established by that review or at least one user-facing translation domain is intentionally incomplete.

A locale may therefore have complete technical structures and still remain `partial` until its translation scope has been reviewed.

### Reason

Structural i18n tests can verify that translations exist and remain coherent, but they cannot determine whether wording, terminology, editorial quality, or every user-facing translation domain has been product-reviewed.

### Consequences

- The current English status remains `partial`; this step does not claim that the English translation is complete.
- French remains `complete` as the currently declared fully reviewed initial language.
- Future translation work may change a locale from `partial` to `complete` only when the supported user-facing scope has been reviewed.
- Structural tests protect translation integrity but do not automatically promote a locale's readiness status.

## DEC-034 — UX direction reset and user-intention architecture

**Status:** Accepted

### Decision

Loculary is formally restarting its UX/UI design direction from first principles.

The product is treated as a digital utility toolbox rather than a conventional SaaS landing page or dashboard. Catalog composition may use Material 3 cards when they support discovery and task clarity, rather than following a generic template.

The experience is organized around three primary user intentions:

1. **Find something** — search for a known or approximately known need.
2. **Figure out how to do something** — explore by intention when the user knows the goal but not the tool.
3. **Discover** — browse the catalog and learn what Loculary can do.

The preferred primary journey is:

> **Need → Find or explore → Tool → Action → Result → Next action**

The homepage is action/search-first, with discovery following in depth. The tool page prioritizes the task, result and useful actions. Documentation and contextual next actions remain secondary to the primary task.

The platform must provide a common visual and interaction language without forcing every tool into an identical layout. Individual tools may use distinct compositions, visualizations, animations and interaction models when this improves comprehension, feedback, enjoyment or tool character.

Visual direction is governed by DEC-048 — Material 3 Expressive as Loculary's shared design-system foundation.

### Reason

The existing UX can be functional while still feeling like a conventional web template or catalog. A superficial visual refresh would preserve that structural problem.

The product needs a clearer identity centered on accomplishing tasks quickly while retaining the ability to explore a very large catalog.

### Consequences

- Existing UX/UI patterns are not protected merely because they already exist.
- Future redesign work may remove, merge, move or replace existing screens and components.
- Search is a primary product entry point rather than merely a header utility.
- Explorer/navigation must support both intention-oriented and category-oriented discovery.
- Tool pages must prioritize interaction and results over editorial content.
- Next actions must represent useful continuations rather than generic filler.
- Responsive layouts must be designed as first-class desktop, tablet and mobile experiences.
- Shared visual foundations and motion are governed by DEC-048; this structural UX decision does not require identical compositions across tools.
- Core product constraints such as browser-first processing, privacy, accessibility, internationalization and anonymous-first usage remain unchanged.

## DEC-036 — English reference locale and fully localized public tool URLs

**Status:** Accepted

### Decision

English is Loculary's reference locale and default locale for the initial launch. French is the second launch locale. Both locales must be complete before launch; additional locales may be added later.

Public tool URLs are fully localized and independent of category membership:

- English tools: `/en/tools/<tool-slug>`
- French tools: `/fr/outils/<outil>`
- English categories: `/en/categories/<category-slug>`
- French categories: `/fr/categories/<categorie>`

A tool's URL does not include a category. Category associations are a separate many-to-many discovery dimension and do not determine the tool's public identity or route.

Internal code identifiers remain English and language-neutral. Localized route segments are presentation/routing data and must never replace internal identifiers.

The language selector must resolve the same resource to its equivalent localized URL. Canonical URLs, hreflang alternates, internal links, breadcrumbs and the sitemap must all use the localized public URL for the active locale.

No legacy redirects are required for the pre-launch route structure. Future redirects for public URL changes after launch should be decided when a concrete change is planned.

### Reason

The product is intended to launch with English and French as first-class languages. Separate namespaces remove the route collision between a category and a tool, while making tool URLs stable when category associations change and leaving a clean path for adding future locales.

### Consequences

- `defaultLocale` is `en`.
- Every published tool has an explicit English and French route slug; missing slugs must fail validation rather than silently falling back to internal IDs.
- Every published category has an English and French route slug.
- English is the naming reference for new internal identifiers and public route conventions.
- URL generation must be centralized rather than assembled ad hoc throughout UI components.
- Public tool routes use the current generic route shape without category-bearing segments.

## DEC-037 — Complete account lifecycle and deletion semantics

**Status:** Accepted

### Decision

Loculary's account system is complete for the current product scope using Supabase Auth as the identity/session authority and `public.profiles` as the minimal application profile store. Email/password authentication, email confirmation, PKCE password recovery, signed-in password changes, native email-change confirmation, profile/locale management, logout and permanent self-deletion are supported.

Account deletion permanently removes the Auth user. User-owned rows that reference `auth.users` cascade as defined by their foreign keys. Administrative audit history is retained for security/integrity, but direct references to the deleted user are anonymized. The last `super_admin` account cannot self-delete until another super administrator exists.

Sensitive account operations are authorized server-side; UI state is never treated as authorization. Profile RLS additionally requires a live Auth session, and the account deletion service uses a server-only Supabase secret.

### Reason

The account system must be complete without introducing unnecessary personal-data domains or weakening Supabase's native confirmation and session protections.

### Consequences

- Password reset and email confirmation use PKCE callback routes.
- Account deletion is irreversible and explicitly confirmed by the user.
- Audit history survives account deletion in anonymized form.
- Future user-owned tables must define explicit deletion/retention semantics before being added to the account lifecycle.
- Deleting the last super administrator is intentionally blocked to preserve administrative recoverability. The database serializes self-deletion and `super_admin` role removal checks so concurrent operations cannot bypass this invariant.

## DEC-042 — Next actions are contextual and optional

**Status:** Accepted

### Decision

Loculary treats **Next actions** as a contextual continuation of the user's current task, rather than as a mandatory "Related Tools" section.

A tool may expose next actions only when a natural and useful continuation exists. A tool is not required to provide recommendations when no meaningful continuation can be identified.

Next actions should primarily be complementary or workflow-continuing actions: they help the user refine, validate, transform, calculate, or otherwise continue from the current result. Generic similarity, popularity, recency or shared catalog metadata must not by themselves justify presenting an item as a next action.

Generic discovery remains a separate product concern and must not be conflated with contextual next actions.

### Reason

The previous "Related Tools" concept mixed similarity, complementarity and continuation. Treating all three as the same product concept risks producing recommendations that are technically related but not useful to the user's immediate task.

The accepted UX journey is therefore interpreted as:

> **Need → Find or explore → Tool → Action → Result → Next action**

where the final step is conditional on there being a meaningful continuation.

### Consequences

- Next actions are optional and may be absent from a tool page.
- The default product semantics are continuation/complementarity, not generic similarity.
- The recommendation engine is an implementation mechanism and must not define the product meaning of a next action.
- Generic discovery can still exist elsewhere in the product without being mislabeled as a next action.
- Existing "Related Tools" UI and relation logic must be evaluated against this decision; implementation changes must follow the normal discussion and decision process.
- Related tools are not a mandatory generic section and are not placed after documentation by default.

## DEC-045 — Intents are first-class discovery objects

**Status:** Accepted

### Decision

Loculary models **intent as a first-class discovery object**, distinct from the category hierarchy.

An intent represents what the user wants to accomplish and may be associated with multiple tools, including tools from different categories. Intent is therefore not a shortcut to one category.

The initial intent catalog may use curated editorial associations between intents and tools. Future deterministic metadata-based candidate generation or ranking may enrich discovery when justified by catalog scale and search evidence, without changing the underlying product semantics.

### Reason

The previous implementation reduced each intent to the first available category. That does not represent the user's actual goal and becomes increasingly misleading as the catalog grows.

The new model directly represents the product vision while keeping the implementation simple enough for the current catalog and leaving room for richer search and eventual solution-oriented discovery.

### Consequences

- Intent and category are separate discovery axes.
- One intent may lead to multiple tools and multiple categories.
- Intent associations are editable discovery/editorial data, not executable tool behavior.
- Deterministic inference or ranking is an extension mechanism, not the definition of intent.
- Generic category shortcuts must not be presented as if they fully represent an intent.

## DEC-047 — Clean Supabase application foundation before catalog redesign

**Status:** Accepted

### Decision

The pre-launch Supabase database uses a clean application foundation containing only durable account continuity, administrative RBAC and security audit data. The legacy tool catalog schema and its catalog-specific permissions are removed rather than carried forward as migration archaeology.

The clean baseline migration `20261008195413_clean_application_foundation` is the replayable foundation for fresh environments. Production migration history is aligned to that baseline. Future production migrations are applied through the Supabase connector after review, with the exact remote migration version reconciled against the versioned SQL in Git.

The tool catalog will be reintroduced only through the separately validated catalog redesign; executable tool behavior remains in Git/code.

### Reason

Loculary is pre-launch and the existing catalog data is disposable. Carrying obsolete schema and migration history forward would preserve unnecessary coupling and make future database evolution harder to reason about.

### Consequences

- The production database currently contains only the six retained foundation tables.
- No legacy `tool_*` tables or `catalog.*` permissions should be recreated accidentally.
- Future catalog work must define its new schema and migration path explicitly.
- Direct connector-based migrations must preserve a versioned SQL file in Git and verify the exact remote migration registry immediately after application.
- The separate Edge Functions CI remains responsible only for dependency-lock and type validation of Edge Functions; it does not deploy them or apply database migrations.

## DEC-048 — Material 3 Expressive as Loculary's shared design-system foundation

**Status:** Accepted

### Decision

Loculary adopts **Material 3 Expressive** as the production reference for the shared platform experience. Expressive foundations and component behavior apply to navigation and headers, buttons, fields, switches, selection controls, menus, dialogs/popups, cards, feedback, typography, semantic color, iconography, surfaces, elevation and motion.

The intended experience is a distinctive, polished, Android-inspired web application—not a pixel-for-pixel Android replica and not a generic SaaS template. Material 3 cards are first-class components and must not be avoided by default; use appropriate card variants and compositions where they support discovery, grouping or interaction. Shared foundations establish consistency without forcing every tool into the same layout or interaction model. Specialized tool interfaces remain first-class when their task benefits from a distinct composition or interaction, subject to shared navigation, accessibility, localization, responsiveness and platform behavior.

The default semantic palette uses the blue seed **#4285F4** to generate tonal roles; the seed does not require every primary role to use the literal value. **Roboto** is the validated default interface typeface. Loculary uses the official Material Color Utilities (MCU) Rainbow scheme as its sole rainbow palette. Its tonal range should serve both expressive surfaces/frame backgrounds and vivid compact accents such as category pills, badges and markers; choose tones appropriate to the context and validate foreground contrast. Do not retain a parallel Loculary-specific palette merely to obtain stronger colors. Semantic success, warning and error colors remain independent of the brand seed and Rainbow palette. Light/dark mappings and actual foreground contrast must be validated.

Theme preference should persist locally for anonymous users and synchronize to the user's account when signed-in preference persistence is implemented. This decision records the product direction; it does not claim that palette settings, production tokens or account synchronization have already been implemented.

The Loculary brand mark remains distinct from functional interface iconography. The supplied SVG remains a candidate for further brand exploration, not an approved final logo.

### Reason

Loculary needs a coherent, recognizable visual and interaction language that feels more like a modern application than a conventional web template. Material 3 Expressive provides a stronger basis for expressive color, shape, typography, component behavior and motion while preserving a task-first toolbox and meaningful tool diversity.

### Consequences

- `docs/DESIGN-SYSTEM.md` defines the Expressive platform contract, palette rules and Loculary-specific boundaries.
- `docs/VISION.md`, `docs/UX.md` and `docs/PROJECT_INSTRUCTIONS.md` must remain consistent with this direction.
- Shared components and screens may be refactored or replaced when required for a coherent M3 Expressive implementation; the direction does not require preserving current abstractions.
- DEC-004 remains in force: shared foundations and behavior do not require identical compositions across specialized tools.
- Accessibility, WCAG 2.2 AA, reduced motion, responsive desktop/tablet/mobile behavior, localization, privacy and performance remain mandatory.
- Adoption is not proof of implementation. Production migration, palette settings, preference persistence, account synchronization and visual/accessibility verification remain implementation work and must not be described as complete without evidence.

## DEC-049 — Defer browser E2E and screenshot automation during active redesign

**Status:** Accepted

### Decision

Remove the manually triggered Playwright E2E, production-browser validation, and production-screenshot workflows, along with their browser tests and the Playwright dependency. Keep the existing CI baseline: Node.js tests, lint, TypeScript checks, production build, dependency/security checks, and targeted Supabase Edge Function validation.

Do not reintroduce browser E2E or screenshot automation as a default project requirement. Reconsider a narrowly scoped browser check only when the interface and key journeys have stabilized and a concrete regression risk demonstrates that its value exceeds its maintenance cost.

### Reason

Loculary is actively being redesigned. UI selectors, page structure, labels, and expected flows change frequently, so browser tests can become stale and fail for reasons that do not represent product regressions. Maintaining and diagnosing those constraints creates disproportionate friction for a project maintained by one human and one AI assistant. The manual workflows also duplicate production-browser coverage and screenshot capture around the same test file.

### Consequences

- The `e2e/` directory and the three browser/screenshot workflows are removed.
- `@playwright/test` and its lockfile-only dependencies are removed.
- Unit-level and repository-level automated checks remain the primary regression safeguards.
- Screenshots and browser artifacts are not required inputs to routine assistant work.
- Any future browser automation must be small, justified by a concrete failure mode, and kept aligned with the current product rather than treated as a permanent checklist.

## DEC-051 — Database-backed catalog is conditional on demonstrated need

**Status:** Accepted

### Decision

The public tool catalog remains Git-backed. PostgreSQL is not a committed destination for editable catalog data and no migration is scheduled by default. Editable metadata and executable behavior must remain separate if a database-backed catalog is later justified.

Reconsider a database-backed catalog when at least one concrete product or operational requirement is demonstrated that the current Git-backed workflow cannot reasonably serve. Evidence may include:

- authorized editorial publishing or lifecycle management that must happen without code deployment;
- measured search, build, catalog-delivery or performance bottlenecks that a database-backed design is likely to resolve;
- administration, auditability or collaboration requirements that cannot be met proportionately by the current workflow.

Catalog size or an aspiration to support thousands of tools is not, by itself, sufficient justification. Any proposal must compare the actual benefits with schema/migration work, operational complexity, security, performance and maintenance cost. Before implementation, define the proposed scope and acceptance criteria, review the schema and migration path, and obtain explicit approval for the consequential architecture change.

Git/code remains authoritative for executable tool implementations, registry modules, processing mode, capabilities and technical behavior, regardless of where editable metadata is stored.

### Reason

The deployed product currently uses a Git-backed catalog, and the database catalog schema was deliberately removed during the October 2026 clean-cut. Building the database catalog without a demonstrated publishing, search or operational need would add cost and complexity before proving its value.

### Consequences

- The catalog remains Git-backed until the criteria above are met and a new implementation proposal is approved.
- Product and architecture documents must describe database catalog storage as conditional, not inevitable.
- No catalog schema or production migration is authorized by this decision.
