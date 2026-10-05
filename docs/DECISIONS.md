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

Local browser state can provide history and preferences before authentication.

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

## DEC-005 — Sober and playful modes

**Status:** Superseded — deferred

### Decision

The previously accepted user-selectable Sober/Playful presentation style is no longer part of the current product scope. It may be reconsidered much later, but no current implementation, architecture or UX requirement should assume that this mode exists.

The current direction is a single modern, polished and visually engaging experience in which individual tools may use appropriate visual identity, animation, transitions and micro-interactions.

### Reason

The product should first establish a coherent modern visual language rather than introduce a global presentation-mode choice. This preserves room for distinctive tool experiences without forcing an artificial Sober/Playful split.

### Consequences

Animations and visual effects remain valid product capabilities and must respect accessibility and reduced-motion preferences. Any future return to selectable presentation modes requires a new explicit product decision.

---

## DEC-006 — Advertising must remain subordinate

**Status:** Accepted

### Decision

Advertising can fund the free product, but it must not obstruct the primary tool experience.

### Reason

The product needs a sustainable business model without undermining the reason users visit it.

### Consequences

Desktop side placements are preferred where space permits. Alternative placements may be used on smaller screens.

---

## DEC-007 — Optional community

**Status:** Accepted as future direction

### Decision

A moderated community layer may allow tool proposals, ideas, ratings, comments, and contributor attribution.

### Reason

User participation can improve discovery and give the catalog a living, interactive character.

### Consequences

A database, moderation workflow, abuse controls, and contribution metadata will eventually be required.

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

**Status:** Accepted provisionally

### Decision

Continue with Next.js, React, TypeScript, Tailwind CSS, Vercel, GitHub Actions, and Playwright unless implementation evidence justifies a change.

### Reason

The existing stack supports the current product requirements and avoids unnecessary migration work.

### Consequences

Architecture should be designed around product requirements rather than framework assumptions.

---

## DEC-010 — Tech lead / product owner autonomy

**Status:** Superseded by DEC-033

### Decision

The project grants the technical lead/product owner authority to make routine, reversible technical, UX, and low-impact product decisions without asking for approval.

### Consult the user when

A decision materially affects:

- fundamental product direction;
- long-term cost;
- user data handling;
- legal/compliance exposure;
- business model;
- irreversible public commitments.

### Reason

This allows the project to move quickly while preserving user control over consequential decisions.


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
- provide a transparency/data dashboard for authenticated users;
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

## DEC-015 — User data transparency dashboard

**Status:** Accepted as product direction

### Decision

Authenticated users should have a dedicated dashboard showing the data Loculary stores or associates with their account and the relevant privacy/consent choices.

### Reason

Users should not need to navigate obscure settings or infer what is stored.

### Consequences

The data model must maintain clear ownership and deletion/export boundaries across identity, preferences, product data, community content, analytics, and security/moderation records.


---

## DEC-016 — Three-layer product model
**Status:** Accepted

### Decision

Structure the product conceptually around three layers: **Public discovery**, **Tool execution**, and **Personal**.

### Consequences

Anonymous users can use the public and tool layers without an account. Authentication adds favorites, collections, history, preferences, personalization and community capabilities without creating an account wall.

---

## DEC-017 — First-class collections and safe sharing

**Status:** Accepted

### Decision

Collections are first-class user objects and may be private, shareable, or public by explicit choice. Tool sharing may preserve a blank configuration, configured state, or current result when appropriate.

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

Search must remain useful without an AI provider and must expose no-result recovery paths such as related queries, related tools and eventually tool proposals.

---

## DEC-021 — Product brainstorming is durable historical context

**Status:** Accepted

### Decision

The validated brainstorming document is preserved as an immutable historical/contextual record of the product exploration. Its content may be propagated into canonical specifications and decisions, but the brainstorming document itself must not be rewritten to reflect later implementation changes.

### Consequences

Canonical docs describe the current accepted direction; the brainstorming document preserves the richer original reasoning and ideas. Future agents must distinguish historical intent from currently committed scope.


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


## DEC-024 — Account foundation before catalog migration

**Status:** Accepted

### Decision

Introduce the database and authenticated account foundation before moving existing tool/catalog behavior out of Git. The first database scope is intentionally limited to user identity integration and minimal profile metadata.

### Reason

Loculary needs accounts and an administration surface eventually, but executable tool behavior must remain in Git until the code/database boundary is explicitly designed. Starting with the account foundation creates the necessary platform layer without coupling the tool engine to the database prematurely.

### Consequences

- Supabase Auth is the identity provider.
- User profile metadata is stored in `public.profiles` with Row Level Security.
- Core tools remain anonymous-first.
- Tool/catalog/editorial data is not migrated as part of this step.
- Future administration will use explicit permissions rather than an ad-hoc client-side admin flag.

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

## DEC-027 — Database owns editable catalog/editorial data, not executable behavior

**Status:** Accepted

### Decision

PostgreSQL owns editable tool catalog and editorial data: stable tool identity, slug, visual metadata, lifecycle, access policy, localized names/descriptions/SEO, categories, tags, aliases and relations.

Git/code remains authoritative for executable implementations and technical behavior: registry modules, processing mode, capabilities, browser requirements and actual tool logic.

### Reason

Loculary needs an administrable catalog that can scale to a large number of tools without moving executable code into a database. The database is well suited to search, administration, publication workflows and editable product content, while Git remains the source of executable behavior.

### Consequences

- The stable tool ID links database catalog records to the Git-backed registry.
- Public catalog reads expose only published tools.
- Administrative permissions distinguish catalog reading, editing and publishing.
- Database metadata must never be interpreted as permission to use a capability that the executable module does not actually declare.
- Localized editable product content uses database translation rows; system labels remain in application i18n.

---

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

---

## DEC-029 — Supabase leaked password protection remains disabled on the Free plan

**Status:** Accepted

### Decision

Keep Supabase Auth's leaked password protection disabled while Loculary remains on the Supabase Free plan.

This is an intentional infrastructure limitation, not an outstanding security task. Security audits should treat this setting as a known and accepted constraint rather than repeatedly flagging it for implementation.

### Reason

The feature requires a higher Supabase plan and cannot currently be enabled through the available project tooling on the Free plan. Upgrading solely to enable this feature is not justified at the current project stage.

### Consequences

- Do not repeatedly attempt to enable this setting as part of routine security hardening while the project remains on the Free plan.
- Security audits may mention the accepted limitation for visibility, but should not create a new implementation task unless the Supabase plan changes.
- Revisit the decision if Loculary moves to a plan that provides the feature or if the project's authentication/security requirements materially change.



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

## DEC-032 — Product rename to Loculary

**Status:** Accepted

### Decision

The product's public brand is **Loculary**. The previous name was **Utiluna** and remains only where it is needed to preserve historical decision and project context.

### Reason

The product identity has been explicitly changed while the underlying repository and infrastructure migration are handled separately through the rename workflow.

### Consequences

- Current product-facing documentation and implementation should use Loculary.
- Historical decisions and archives may retain Loculary when that name is part of the historical record.
- Infrastructure names and identifiers are not assumed to change automatically; each migration is handled explicitly.


## DEC-033 — Validated step-by-step collaboration workflow

**Status:** Accepted

### Decision

Loculary work follows an incremental validation model. Before implementation, the assistant presents the step, its objective, intended scope, and relevant consequences for validation. After validation, implementation remains within that scope.

Technical implementation details may be chosen autonomously when they are contained within the validated scope and do not materially alter product direction or architecture. Important product, architectural, or irreversible decisions require user validation.

If implementation reveals an issue that exceeds the validated scope or requires a new consequential decision, work stops and the decision is presented before proceeding.

### Reason

This model preserves user control over consequential changes while allowing efficient execution of routine implementation work. It also makes scope, intent, and durable decisions easier to trace across conversations and contributors.

### Consequences

- DEC-010 is superseded as the current operating model, while its historical rationale remains preserved.
- Project instructions and agent guidance follow this validated-step model.
- New work should be proposed and validated one step at a time when it changes the product or project materially.
- No silent scope expansion is permitted.

## DEC-034 — UX/UI direction reset and user-intention architecture

**Status:** Accepted

### Decision

Loculary is formally restarting its UX/UI design direction from first principles.

The new direction treats Loculary as a **modern digital utility toolbox**, not as a conventional SaaS landing page, dashboard or generic card-based catalog.

The experience is organized around three primary user intentions:

1. **Find something** — search for a known or approximately known need.
2. **Figure out how to do something** — explore by intention when the user knows the goal but not the tool.
3. **Discover** — browse the catalog and learn what Loculary can do.

The preferred primary journey is:

> **Need → Find or explore → Tool → Action → Result → Next action**

The homepage is therefore action/search-first, with discovery following in depth. The tool page prioritizes the task, result and useful actions. Documentation and related tools remain secondary.

The visual direction is **Modern Utility**: modernity should come primarily from hierarchy, typography, spacing, density, precision, feedback, coherent interaction patterns and purposeful motion rather than generic SaaS decoration.

The platform must provide a common visual and interaction language without forcing every tool into an identical layout. Individual tools may use distinct compositions, visualizations, animations and interaction models when this improves comprehension, feedback or enjoyment.

### Reason

The existing UX can be functional while still feeling like a conventional web template or catalog. A superficial visual refresh would preserve that structural problem.

The product needs a clearer identity centered on accomplishing tasks quickly while retaining the ability to explore a very large catalog.

### Consequences

- Existing UX/UI patterns are no longer protected merely because they already exist.
- Future redesign work may remove, merge, move or replace existing screens and components.
- Search becomes a primary product entry point rather than merely a header utility.
- Explorer/navigation must support both intention-oriented and category-oriented discovery.
- Tool pages must prioritize interaction and results over editorial content.
- Related tools should represent useful next actions rather than generic filler.
- Responsive layouts must be designed as first-class desktop, tablet and mobile experiences.
- Visual design work must avoid adding decoration solely to create an appearance of modernity.
- This decision does not change browser-first processing, privacy, accessibility, internationalization, anonymous-first usage or the separation between tool implementations and platform contracts.


## DEC-035 — Development tool category

**Status:** Accepted

### Decision

Loculary adds a **Development / Développement** catalog category for browser-based developer and data utilities.

The first published tool in this category is the JSON Formatter & Validator. The category is a catalog organization decision; it does not commit the project to implementing every related developer utility.

### Reason

The catalog is intended to grow beyond calculators and converters. Developer/data utilities are a coherent local-first family and fit Loculary's browser-first model particularly well.

### Consequences

- The stable category identifier is `developpement`.
- The category is localized as “Développement” in French and “Development” in English.
- Category identifiers remain stable URL segments while the locale prefix localizes the user-facing route context.
- Future developer tools may reuse this category when they satisfy the normal tool quality gate.


## DEC-036 — English reference locale and fully localized public tool URLs

**Status:** Accepted

### Decision

English is Loculary's reference locale and default locale for the initial launch. French is the second launch locale. Both locales must be complete before launch; additional locales may be added later.

Public tool URLs are fully localized rather than hybrid:

- English: `/en/tools/<english-category>/<english-tool>`
- French: `/fr/outils/<categorie-francaise>/<outil-francais>`

Internal code identifiers remain English and language-neutral. Localized route segments are presentation/routing data and must never replace internal identifiers.

The language selector must resolve the same resource to its equivalent localized URL. Canonical URLs, hreflang alternates, internal links, breadcrumbs and the sitemap must all use the localized public URL for the active locale.

No legacy redirects are required for the pre-launch route structure.

### Reason

The product is intended to launch with English and French as first-class languages. Fully localized URLs keep the public information architecture coherent with the selected language while preserving stable English internal identifiers and a clean path for adding future locales.

### Consequences

- `defaultLocale` is `en`.
- Every published tool has an English and French route slug.
- Every published category has an English and French route slug.
- English is the naming reference for new internal identifiers and public route conventions.
- URL generation must be centralized rather than assembled ad hoc throughout UI components.
- The former decision that used French category identifiers as stable URL segments is superseded for public routing; its historical record remains unchanged.


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

## DEC-038 — Dedicated technology update and modernization audit

**Status:** Accepted

### Decision

Loculary adds a dedicated **Audit 31 — Update / modernisation technologique** to the autonomous audit system.

The audit evaluates runtime versions, frameworks, dependencies, development tooling, CI/CD actions, deployment/platform configuration, browser/Web Platform assumptions, deprecated APIs and migration debt. It does not blindly target the newest available versions: it must distinguish the latest release from the supported, compatible and recommended target for Loculary.

Audit 31 is executed before **Audit 32 — Final / Red Team** when a modernization cycle is undertaken. Audit 32 remains the final transversal audit and is not renumbered.

### Reason

The existing dependency/supply-chain audit identifies dependency health and risk, while the final red-team audit evaluates the project transversally. Neither has the specific mission of systematically determining which parts of the technical stack should now be upgraded, migrated, replaced or deliberately kept.

A dedicated modernization pass reduces the risk of accumulating obsolete tooling or missing important supported-version migrations while avoiding indiscriminate upgrades.

### Consequences

- Audit 20 remains responsible for dependency and supply-chain health.
- Audit 31 evaluates update and modernization opportunities across the broader technical stack.
- Major framework/runtime/infrastructure migrations remain subject to explicit validation when they materially affect architecture, cost, privacy, security or product direction.
- Audit 32 must document what should be preserved, not only what should change.
- Audit 31 remains the final cross-domain red-team pass after validated modernization work.
\n

## DEC-039 — Agent product governance and GitHub Issue orchestration

**Status:** Accepted

### Decision

Loculary adds a dedicated **Product / Documentation / Decision Agent** responsible for product direction, product reasoning, documentation governance and preparation of validated implementation specifications.

GitHub Issues are adopted as a shared **orchestration and tracking layer** for agent missions when useful. Issues may track product decisions, audits, Feature Worker missions, Tool Worker missions and cross-agent blockers.

Issues do not replace the repository/Git source of truth, canonical documentation, active handoff checkpoints, immutable audit reports or pull requests. Audit findings remain evidence/recommendations until the appropriate product or technical decision is explicitly validated.

### Reason

A dedicated product role prevents product direction and durable documentation from becoming accidental by-products of implementation workers or audit reports. Issues provide a durable, conversation-independent index for work that spans agents and ChatGPT conversations without duplicating the detailed state already held in Git and repository documentation.

### Consequences

- Product discussions can be resumed from repository documentation and an optional tracking Issue.
- Audit missions may use Issues to expose concise status, findings, decisions and follow-up work while retaining reports and WORKING.md as their canonical artifacts.
- Feature and Tool Workers may use Issues for mission tracking while branch/PR/Git state remains authoritative for implementation.
- A future GitHub Project, if supported by the available integration, should remain a visualization/orchestration layer rather than a required source of truth.
- The Product Agent must not silently implement consequential product decisions; user validation remains required.


## DEC-040 — PostgreSQL runtime orchestration boundary

**Status:** Superseded

### Decision

The project previously used Supabase PostgreSQL as a runtime coordination layer for the autonomous agent system, isolated from product data and subordinate to Git/GitHub as the implementation and delivery authority.

That runtime was subsequently removed after an architecture challenge established that the current ChatGPT execution model does not provide a reliable external mechanism for waking/resuming a new Worker conversation. Keeping the runtime without a real consumer added operational state, security surface and maintenance cost without providing the promised recovery capability.

The historical runtime implementation remains preserved in Git history and migration history for traceability. It is no longer part of the active production architecture.

### Reason

A coordination runtime is justified only when it has a real execution consumer. The current Worker protocol already uses durable Issues, checkpoints, Git branches/PRs and CI as recoverable sources of truth. Removing an unused runtime is simpler and more reliable than maintaining infrastructure that cannot complete the wake/resume loop.

### Consequences

- Git/GitHub, canonical documentation and checkpoints remain the durable sources of truth.
- Workers do not depend on Supabase for mission execution.
- Historical runtime migrations and decision history are retained for auditability.
- A future runtime may be reconsidered only when a real wake/resume adapter and its security model are available and validated.

---

## DEC-041 — Free-plan agent dispatcher runtime

**Status:** Superseded

### Decision

The previously implemented Free-plan PostgreSQL/pg_cron dispatcher and authenticated agent-dispatcher Edge Function are retired and removed from the active architecture.

### Reason

The dispatcher depended on the PostgreSQL runtime coordination layer that had no real Worker wake/resume consumer. Keeping it would preserve dead infrastructure rather than improve autonomous execution.

### Consequences

- The production pg_cron dispatcher, runtime PostgreSQL objects and deployed agent-dispatcher source are being removed.
- The repository retains the historical migrations and decision record; they are not replayed or deleted.
- No Loculary application tables, account/auth objects, tool catalog objects, unrelated Edge Functions or unrelated cron jobs are affected.
- A new dispatcher must be justified by a real end-to-end wake/resume mechanism before reintroduction.
