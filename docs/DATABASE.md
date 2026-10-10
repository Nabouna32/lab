# Loculary — Database

PostgreSQL is the planned relational source of truth for durable product, account and community data. Executable behavior remains in Git; business metadata and operational state live in the database.

Expected domains include users/auth identities, preferences, languages/translations, tools and versions, lifecycle state, categories/tags, examples/SEO content, favorites, collections, history metadata, ratings, comments, reports, moderation, proposals, contributors, permissions, audit logs, analytics metadata and privacy/consent state.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.


## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and a database trigger creates the profile when an Auth user is created.

This is intentionally a small first step. Catalog/editorial data, favorites, collections, preferences, community data and administration will be designed and moved into the database incrementally after the code/database boundary is reviewed.


## Database catalog boundary

The catalog/editorial database boundary remains an accepted target architecture, but it is **not currently deployed**. The October 2026 clean-cut intentionally removed the legacy `tool_*` schema and catalog permissions so the database could return to a small, deterministic account/administration foundation before the catalog is redesigned.

The future catalog must remain separate from executable tool behavior: Git/code remains authoritative for registry modules, processing mode, capabilities and technical behavior, while database data may own editable discovery/editorial metadata. The validated catalog redesign is tracked separately and must define the new schema before any catalog tables are reintroduced.

The current production database therefore contains no `tool_catalog`, `tool_translations`, `tool_categories`, `tool_tags`, `tool_aliases` or `tool_relations` tables, and no `catalog.*` administrative permissions.

## Current production baseline

The current Supabase production baseline is the clean application foundation migration `20261008195413_clean_application_foundation`. It contains only the retained account, administrative RBAC and audit foundation:

- `public.profiles`
- `public.admin_roles`
- `public.admin_permissions`
- `public.admin_role_permissions`
- `public.admin_user_roles`
- `public.admin_audit_log`

All six public foundation tables have Row Level Security enabled. The legacy catalog schema and catalog permissions were removed during the pre-launch clean-cut. The repository baseline is designed for fresh local replay; production already uses the corresponding baseline migration identity.

## Administration foundation

Administrative authorization now has a database foundation separate from executable tool behavior. Roles, permissions, role bindings, user-role assignments and the administrative audit log are stored in Supabase with Row Level Security. The first roles are `super_admin` and `admin`. No automatic first-user bootstrap exists; administrator assignment must be explicit.


## Account lifecycle security

- `public.profiles.id` references `auth.users.id` with `ON DELETE CASCADE`.
- Profile RLS is owner-only and additionally requires a live Auth session recorded in `auth.sessions`.
- `admin_user_roles.user_id` cascades with the Auth user; `assigned_by` becomes null when the assigning account is deleted.
- `admin_audit_log.actor_user_id` is nullable and uses `ON DELETE SET NULL` so security audit history cannot block account deletion. Polymorphic user `target_id` references are cleared by the `BEFORE DELETE ON auth.users` trigger inside the Auth deletion transaction.
- `public.check_account_deletion` is a read-only preflight for an authenticated user deleting their own UUID; it requires a live session and refuses deletion of the last `super_admin`. `public.prepare_account_deletion` remains as a read-only compatibility alias for an older deployed Edge Function.
- `private.guard_auth_user_deletion` is the authoritative deletion guard. It takes the same transaction-scoped PostgreSQL advisory lock as `private.remove_admin_role`, rechecks the last-`super_admin` invariant, and clears audit target references. Actor-reference cleanup is handled by the foreign key. A rejected deletion rolls back all trigger changes. Local Supabase CI verifies the concurrent deletion/role-removal race and the actual Auth Admin API success/rejection paths.
- The final Auth deletion is performed server-side by the `account-delete` Edge Function with the project secret key; no secret key is exposed to the browser.
