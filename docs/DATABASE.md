# Loculary — Database

PostgreSQL is the planned relational source of truth for durable product, account and community data. Executable behavior remains in Git; business metadata and operational state live in the database.

Expected domains include users/auth identities, preferences, languages/translations, tools and versions, lifecycle state, categories/tags, examples/SEO content, favorites, collections, history metadata, ratings, comments, reports, moderation, proposals, contributors, permissions, audit logs, analytics metadata and privacy/consent state.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.


## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and a database trigger creates the profile when an Auth user is created.

This is intentionally a small first step. Catalog/editorial data, favorites, collections, preferences, community data and administration will be designed and moved into the database incrementally after the code/database boundary is reviewed.


## Catalog database boundary

The editable tool catalog foundation is deployed and seeded with the current 12-tool catalog. `tool_catalog` stores stable product identity, slug, visual icon, complexity, access and lifecycle; translation, category, tag, alias and relation tables store editable discovery/editorial data.

The database catalog is deliberately not a second implementation of a tool. The stable tool ID bridges database catalog records to the Git-backed registry. Database metadata may change product/editorial information, but it cannot grant capabilities, change processing location, replace executable modules or redefine technical behavior.

Public reads expose published catalog entries. Administrative reads can include unpublished entries, with separate catalog read, manage and publish permissions. Localized editable product content uses `tool_translations`; system administration labels remain in application i18n.

## Administration foundation

Administrative authorization now has a database foundation separate from executable tool behavior. Roles, permissions, role bindings, user-role assignments and the administrative audit log are stored in Supabase with Row Level Security. The first roles are `super_admin` and `admin`. No automatic first-user bootstrap exists; administrator assignment must be explicit.


## Account lifecycle security

- `public.profiles.id` references `auth.users.id` with `ON DELETE CASCADE`.
- Profile RLS is owner-only and additionally requires a live Auth session recorded in `auth.sessions`.
- `admin_user_roles.user_id` cascades with the Auth user; `assigned_by` becomes null when the assigning account is deleted.
- `admin_audit_log.actor_user_id` is nullable and uses `ON DELETE SET NULL` so security audit history cannot block account deletion. User target IDs are cleared during self-deletion preparation.
- `private.prepare_account_deletion` is callable only by an authenticated user for their own UUID, requires a live session, and refuses deletion of the last `super_admin`.
- The final Auth deletion is performed server-side by the `account-delete` Edge Function with the project secret key; no secret key is exposed to the browser.
