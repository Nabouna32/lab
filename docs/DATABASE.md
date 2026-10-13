# Loculary — Database

PostgreSQL is the source of truth for the durable account, administrative RBAC and audit data currently deployed. It may support additional product or community domains when their requirements justify the schema and operational cost. Executable behavior remains in Git; a database is not the default destination for every kind of product data.

Potential future domains include synchronized preferences, favorites, collections, community records, moderation, editorial metadata, analytics metadata and privacy/consent state. These are candidates, not commitments to deploy them all.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.


## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and the `auth.users` insert trigger is the sole supported profile-creation path. Authenticated clients do not insert profiles directly.

This is intentionally a small first step. Catalog/editorial data, favorites, collections, preferences, community data and administration will be designed and moved into the database incrementally after the code/database boundary is reviewed.


## Database catalog boundary

A database-backed catalog is a possible future option, not an active target or scheduled migration. The October 2026 clean-cut removed the legacy `tool_*` schema and catalog permissions, leaving a small account/administration foundation. The public catalog remains Git-backed.

Reconsider a database catalog only when a concrete requirement cannot be served well by Git, such as authorized editorial publishing without code deployment, measured search/build/delivery bottlenecks, or administration/audit needs that the current workflow cannot reasonably meet. Catalog size alone is not a trigger. DEC-051 records the decision and its criteria. No catalog tables should be reintroduced before a separately reviewed design and explicit approval.

Executable tool behavior remains in Git/code: registry modules, processing mode, capabilities and technical behavior are never moved into the database merely because editable metadata changes storage.

The current production database contains no `tool_catalog`, `tool_translations`, `tool_categories`, `tool_tags`, `tool_aliases` or `tool_relations` tables, and no `catalog.*` administrative permissions.

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

## Supabase migrations

Schema migrations are applied by the assistant through the available Supabase connector; there is no separate GitHub Actions database-release workflow. Migration SQL remains versioned in Git.

For each change, review its SQL and impact before applying it, obtain explicit user approval for consequential or destructive operations, and verify the migration version recorded remotely plus the affected schema/security state. Report only checks actually performed; applying a migration does not mean local tests or pgTAP/concurrency checks ran.

The retained `.github/scripts/test-account-deletion-concurrency.sh` script and pgTAP tests remain useful regression checks, but are not run automatically by the connector. The separate [Supabase Edge Functions CI](../.github/workflows/supabase-functions.yml) validates locked dependencies and types for changes under `supabase/functions/**`; it does not deploy functions or apply database migrations.
