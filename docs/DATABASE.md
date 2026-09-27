# Utiluna — Database

PostgreSQL is the planned relational source of truth for durable product, account and community data. Executable behavior remains in Git; business metadata and operational state live in the database.

Expected domains include users/auth identities, preferences, languages/translations, tools and versions, lifecycle state, categories/tags, examples/SEO content, favorites, collections, history metadata, ratings, comments, reports, moderation, proposals, contributors, permissions, audit logs, analytics metadata and privacy/consent state.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.

## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and a database trigger creates the profile when an Auth user is created.

The editable tool catalog foundation is now also deployed and seeded with the current catalog snapshot. It separates catalog/editorial data from executable tool behavior: `tool_catalog` stores stable identity, URL slug, visual icon, complexity, access and lifecycle; translation, category, tag, alias and relation tables store editable discovery/editorial data. Technical capabilities, processing mode, browser requirements and executable implementation remain authoritative in Git.

## Catalog database boundary

The database catalog is deliberately **not** a second implementation of a tool.

The stable tool ID is the bridge between the database catalog and the Git-backed registry. The database may change what a published tool is called, how it is categorized, which aliases help users find it, its SEO text, its lifecycle or other editable product metadata. It cannot grant a tool a capability, make a local tool network-enabled, change its processing location, or replace its executable module.

Public reads expose published catalog entries and their related editable metadata. Administrative reads can include unpublished entries. Catalog administration uses the existing database-backed RBAC model with separate read, manage and publish permissions.

Localized catalog/editorial text belongs in `tool_translations`; system administration labels continue to belong to application i18n because they are part of the application contract rather than editable product content.

## Administration foundation

Administrative authorization now has a database foundation separate from executable tool behavior. Roles, permissions, role bindings, user-role assignments and the administrative audit log are stored in Supabase with Row Level Security. The first roles are `super_admin` and `admin`. No automatic first-user bootstrap exists; administrator assignment must be explicit.
