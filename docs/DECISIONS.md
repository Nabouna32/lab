# Utiluna — Architecture and Product Decisions

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

Utiluna is a utility site. Requiring registration before a simple calculation would add unnecessary friction.

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

Utiluna's value includes visual, interactive, playful, and specialized experiences.

### Consequences

The platform standardizes infrastructure and trust requirements, while custom tool UIs remain first-class.

---

## DEC-005 — Sober and playful modes

**Status:** Accepted

### Decision

Provide a user-selectable sober/playful presentation style.

### Reason

Some users want maximum efficiency; others enjoy richer interactions. The product should support both without forcing either style.

### Consequences

Animations and visual effects must remain accessible and must respect reduced-motion preferences.

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

**Status:** Accepted

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

Users should be able to understand and control their relationship with Utiluna instead of being forced to trust an opaque system.

---

## DEC-012 — Simple consent choices

**Status:** Accepted

### Decision

Consent UX must make refusal of non-essential tracking as easy as acceptance.

### Reason

Privacy controls should not become a maze of partner-by-partner decisions.

### Consequences

Utiluna should provide clear high-level choices such as accept, refuse non-essential tracking, or customize, while retaining the granular controls required by the actual legal/provider setup.

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

Authenticated users should have a dedicated dashboard showing the data Utiluna stores or associates with their account and the relevant privacy/consent choices.

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

Utiluna is intended to grow to a large catalog. Maintaining one route, metadata wiring and page composition per tool would create unnecessary duplication and make cross-cutting platform changes expensive.

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

Utiluna needs accounts and an administration surface eventually, but executable tool behavior must remain in Git until the code/database boundary is explicitly designed. Starting with the account foundation creates the necessary platform layer without coupling the tool engine to the database prematurely.

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

Utiluna will eventually have several administrative areas with different responsibilities. A single `is_admin` flag would make delegation and least-privilege access difficult and would force a later migration.

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

Utiluna needs an administrable catalog that can scale to a large number of tools without moving executable code into a database. The database is well suited to search, administration, publication workflows and editable product content, while Git remains the safer and clearer source of executable behavior.

### Consequences

- The stable tool ID links database catalog records to the Git-backed registry.
- Public catalog reads expose only published tools.
- Administrative permissions distinguish catalog reading, editing and publishing.
- Database metadata must never be interpreted as permission to use a capability that the executable module does not actually declare.
- Localized editable product content uses database translation rows; system labels remain in application i18n.
