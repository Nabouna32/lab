# Loculary — Database

PostgreSQL is the planned relational source of truth for durable product, account and community data. Executable behavior remains in Git; business metadata and operational state live in the database.

Expected domains include users/auth identities, preferences, languages/translations, tools and versions, lifecycle state, categories/tags, examples/SEO content, favorites, collections, history metadata, ratings, comments, reports, moderation, proposals, contributors, permissions, audit logs, analytics metadata and privacy/consent state.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.


## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and the `auth.users` insert trigger is the sole supported profile-creation path. Authenticated clients do not insert profiles directly.

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

- Profile creation is performed by the `private.handle_new_user()` trigger on `auth.users`; `authenticated` has no direct `INSERT` privilege or profile INSERT policy. The trigger function is not directly executable by `anon` or `authenticated`.
- Function privileges are least-privilege by default for functions created by the `postgres` application migration owner: global default `EXECUTE` for `PUBLIC` and schema-specific default grants to `anon`, `authenticated` and `service_role` in `public` are revoked. Each exposed RPC must explicitly grant `EXECUTE` to its intended caller in its defining migration. Trigger functions should not receive direct API execution grants unless they are also an intentionally supported RPC.
- `public.profiles.id` references `auth.users.id` with `ON DELETE CASCADE`.
- Profile RLS is owner-only and additionally requires a live Auth session recorded in `auth.sessions`.
- `admin_user_roles.user_id` cascades with the Auth user; `assigned_by` becomes null when the assigning account is deleted.
- `admin_audit_log.actor_user_id` is nullable and uses `ON DELETE SET NULL` so security audit history cannot block account deletion. Polymorphic user `target_id` references are cleared by the `BEFORE DELETE ON auth.users` trigger inside the Auth deletion transaction.
- `public.check_account_deletion` is the sole read-only preflight for an authenticated user deleting their own UUID; it requires a live session and refuses deletion of the last `super_admin`. The obsolete `public.prepare_account_deletion` compatibility alias is removed by a forward migration.
- `private.guard_auth_user_deletion` is the authoritative deletion guard. It takes the same transaction-scoped PostgreSQL advisory lock as `private.remove_admin_role`, rechecks the last-`super_admin` invariant, and clears audit target references. Actor-reference cleanup is handled by the foreign key. A rejected deletion rolls back all trigger changes. The dedicated `.github/scripts/test-account-deletion-concurrency.sh` script exercises the concurrent deletion/role-removal race and the Auth Admin API success/rejection paths when run against a local Supabase stack; a direct production migration does not execute this test automatically.
- The final Auth deletion is performed server-side by the `account-delete` Edge Function with the project secret key; no secret key is exposed to the browser.

## Supabase migrations and production verification

Database migrations are applied directly through the Supabase connector rather than through a separate GitHub Actions release workflow. The migration SQL and its exact version remain versioned in Git; direct application does not remove the need for review or verification.

1. **Prepare and review the migration in Git first.** Inspect the SQL, privileges, RLS policies, triggers, constraints, data impact and rollback/forward-fix implications. Do not apply consequential or destructive changes without explicit user approval.
2. **Apply through the Supabase connector only after review.** Use the migration operation for DDL; do not substitute ad-hoc SQL execution for a versioned schema migration.
3. **Immediately verify the remote migration registry.** Read the version and name actually recorded by Supabase. Align the migration filename in Git to the exact remote version if the connector generated a different timestamp; never guess a timestamp or assume the requested name guarantees the version.
4. **Verify production state.** Inspect the affected schema objects, grants, RLS policies and relevant security/performance advisors. Report precisely which checks were run. Do not claim local replay, pgTAP, lint or concurrency tests passed unless they were actually executed.
5. **Commit the aligned migration and documentation in Git.** Review the final diff for SQL and version consistency. If a migration has already been applied remotely, do not reapply it just to make Git history look consistent.

The retained `.github/scripts/test-account-deletion-concurrency.sh` script can be run against a local Supabase stack to exercise the account-deletion race and Auth Admin API paths. Keep the script and pgTAP tests as useful regression checks; they are not automatically run by direct connector-based production migrations.

The separate [Supabase Edge Functions CI](../.github/workflows/supabase-functions.yml) remains automatic for pull requests that touch `supabase/functions/**`. It validates locked dependencies and types; it does not deploy Edge Functions or apply database migrations.

## Favorites schema

The versioned migration `20261013034700_user_favorites.sql` introduces a minimal `public.user_favorites` table with a stable text tool ID, an Auth-user owner, creation timestamp, a composite user/tool primary key, owner-only RLS and only the SELECT/INSERT/DELETE privileges needed by the client. Auth user deletion cascades to favorites. The tool registry remains Git-backed; no catalog table or catalog foreign key is introduced.

**Production status:** this migration is prepared in Git for review and has not been applied to production. Follow the migration verification procedure above only after separate explicit approval.
