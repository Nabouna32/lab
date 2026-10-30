# Loculary — Database

PostgreSQL is the source of truth for the durable account, administrative RBAC and audit data currently deployed. It may support additional product domains when their requirements justify the schema and operational cost. Executable behavior remains in Git; a database is not the default destination for every kind of product data.

The deployed account domains include favorites and personal collections alongside identity/profile and administrative security data. Synchronized preferences, editorial metadata and privacy/consent state are not part of the current deployed schema; consider them only when concrete requirements justify their cost.

Sensitive tool inputs and file contents are not stored by default. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

## Supabase plan constraints

- Loculary currently uses Supabase on the Free Plan.
- Leaked-password protection cannot be enabled on the current Free Plan. This is a plan limitation, not an unaddressed implementation omission.
- Supabase reports this as the platform-level Auth advisor finding `auth_leaked_password_protection`, not as a database lint. SQL migrations and database-lint suppression cannot resolve it. Keep it recorded as an accepted Free-plan limitation in audits; do not report it repeatedly as an unresolved repository defect. Reassess only if the plan changes or email/password authentication is no longer used.
- If the project moves to a plan that supports leaked-password protection, re-evaluate and enable it as part of security hardening.
- Consider Free-plan limits when evaluating Supabase architecture, request volume, egress, database size, Edge Functions and other usage-sensitive designs.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. System-defined administrative roles and permissions use stable keys; their user-facing labels belong to the application i18n layer. Row Level Security restricts profile access to the owning user, and the `auth.users` insert trigger is the sole supported profile-creation path. Authenticated clients do not insert profiles directly.

This remains an intentionally small account foundation. Favorites and personal collections are separate account-owned domains. Collections are private by default and can be shared through an explicit link token; synchronized preferences and catalog/editorial data remain possible future additions only when concrete requirements justify their database and operational costs.


## Database catalog boundary

A database-backed catalog is a possible future option, not an active target or scheduled migration. The October 2026 clean-cut removed the legacy `tool_*` schema and catalog permissions, leaving a small account/administration foundation. The public catalog remains Git-backed.

Reconsider a database catalog only when a concrete requirement cannot be served well by Git, such as authorized editorial publishing without code deployment, measured search/build/delivery bottlenecks, or administration/audit needs that the current workflow cannot reasonably meet. Catalog size alone is not a trigger. DEC-027 records the decision and its criteria. No public tool-catalog tables should be reintroduced before a separately reviewed design and explicit approval. The Design Lab is now a local component gallery; it has no separate database-backed catalogue or maintenance workflow.

Executable tool behavior remains in Git/code: registry modules, processing mode, capabilities and technical behavior are never moved into the database merely because editable metadata changes storage.

The current production database contains no `tool_catalog`, `tool_translations`, `tool_categories`, `tool_tags`, `tool_aliases` or `tool_relations` tables, and no `catalog.*` administrative permissions.

## Current production baseline

The initial production foundation migration is `20261008195413_clean_application_foundation`; subsequent migrations extend that baseline. The current deployed public tables include the retained account, administrative RBAC and audit foundation, plus account favorites:

- `public.profiles`
- `public.admin_roles`
- `public.admin_permissions`
- `public.admin_role_permissions`
- `public.admin_user_roles`
- `public.admin_audit_log`
- `public.user_favorites`
- `public.user_collections`
- `public.user_collection_items`

All nine listed public tables have Row Level Security enabled. `public.user_favorites` is defined by migration `20261013180750_user_favorites` and is applied in production with owner-only read/insert/delete policies and authenticated-only table grants. Personal collections are defined by migrations `20261013193627_user_collections` and `20261013193734_user_collections_policy_performance`; collections and their items are private to their owner by default, while an explicit share token grants read access to the selected collection and its items. Authenticated owners can manage their collections and collection items through least-privilege table grants and RLS. The legacy catalog schema and catalog permissions were removed during the pre-launch clean-cut. The repository baseline is designed for fresh local replay; production already uses the corresponding baseline migration identity.

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

### Sauvegardes avant opération destructive

L’organisation Supabase de Loculary est sur le **Free Plan** (état vérifié via la Management API). Selon la documentation officielle Supabase, ce plan ne bénéficie pas des sauvegardes quotidiennes automatiques des plans payants ; Supabase recommande des exports réguliers avec le CLI et une copie hors site. Avant une opération présentant un risque réel de perte de données, établir une sauvegarde indépendante des données concernées, vérifier que les fichiers sont complets et non vides, conserver leurs empreintes SHA-256 hors du dépôt, et tester la restauration dans un environnement isolé lorsque cela est possible. Ne jamais présenter un export partiel comme une sauvegarde complète : `supabase db dump` exclut notamment les schémas gérés `auth`, `storage` et ceux créés par les extensions. Les identifiants de connexion et les fichiers de sauvegarde ne doivent jamais être publiés dans GitHub ou dans les conversations.

Le connecteur Supabase disponible permet de consulter et modifier le schéma, mais ne fournit pas d’opération d’export/restauration de sauvegarde. Si une sauvegarde vérifiable est nécessaire et qu’aucun mécanisme adapté n’est accessible, demander l’export à l’opérateur avant l’opération destructive ; ne jamais prétendre qu’un point de restauration existe sans preuve.

The retained `.github/scripts/test-account-deletion-concurrency.sh` script and pgTAP tests remain useful regression checks, but are not run automatically by the connector. The main [GitHub Actions CI](../.github/workflows/ci.yml) conditionally runs `deno check --frozen index.ts` for the currently listed Edge Functions when files under `supabase/functions/**` change or the workflow is dispatched. It does not deploy functions or apply database migrations. Keep this description aligned with the actual workflow rather than a separate workflow file.


## Account favorites

The account-favorites migration is versioned at `supabase/migrations/20261013180750_user_favorites.sql` and is applied in production. It creates `public.user_favorites` with owner-only Row Level Security, least-privilege authenticated access, a composite primary key and Auth-account deletion cascade. The deployed migration version, table, three owner-only policies and authenticated table grants were verified directly during the 2026-10-13 audit. The pgTAP regression test is `supabase/tests/user_favorites.sql`; it is not run by the standard GitHub Actions CI and was not executed during that production-state check.

## Personal collections

Personal collections are implemented in the application and deployed in Supabase. `public.user_collections` stores the owner, name and optional unique share token; `public.user_collection_items` associates tool IDs with a collection. Both tables have RLS enabled. Owners can create, rename and delete their collections and add/remove tools. Reads by anonymous users are limited to collections whose explicit share token is supplied in the `x-loculary-share-token` request header; the corresponding policy exposes only the shared collection and its items. Account deletion cascades to the collections and their items.

The schema is defined by `supabase/migrations/20261013193627_user_collections.sql`, with policy-performance adjustments in `supabase/migrations/20261013193734_user_collections_policy_performance.sql` and the request-scoped share-token helper in `supabase/migrations/20261029111421_optimize_collection_rls_and_remove_unused_index.sql`. The RBAC foreign-key index is preserved by `supabase/migrations/20261029111441_restore_admin_role_permissions_fk_index.sql`. The regression test is `supabase/tests/user_collections.sql`; it is not part of the standard GitHub Actions CI and was not executed as part of this production-state audit.

## Design Lab

Le laboratoire est une galerie locale de composants partagés. Il ne stocke ni catalogue, ni observations, ni état de vérification dans Supabase : le code, les spécifications et les tests versionnés dans Git sont les seules sources de vérité.

La migration `20261029110714_retire_design_lab_audit.sql` retire les tables et fonctions propres à l’ancien workflow. Son préfixe correspond à la version effectivement enregistrée en production le 2026-10-29. Les migrations historiques restent dans Git pour préserver la traçabilité. Les permissions `audit.read` et `audit.write` sont conservées : elles protègent respectivement la lecture et l’écriture du journal d’audit administratif.


## Conservation des journaux opérationnels

**État de production vérifié le 30 octobre 2026 :**

- `public.admin_audit_log` : 1 entrée.
- `private.admin_audit_log_retention_holds` : table présente, RLS activé, aucune policy ni privilège API accordé ; 0 exception enregistrée.
- `cron.job` : le job `loculary-log-retention-6m` existe sous l'identifiant 2, actif, exécuté par `postgres`, chaque jour à 03:00 UTC, avec la commande exacte `select private.prune_retained_logs();`.
- `cron.job_run_details` : 806 lignes ; plus ancienne exécution le 4 octobre 2026 à 22:10 UTC, plus récente le 5 octobre à 11:35 UTC ; 0 exécution terminée antérieure au seuil de six mois et 0 exécution incomplète.
- `pg_cron` 1.6.4 est installé.
- L'historique distant `supabase_migrations.schema_migrations` contient `20261030030000 / log_retention_policy`. Les journaux PostgreSQL attestent la création de la table privée et des deux fonctions le 30 octobre à 03:31:30 UTC. La configuration effective du job a été confirmée par une lecture SQL directe de `cron.job`.
- Les 46 assertions de `supabase/tests/log_retention.sql` ont été exécutées avec succès le 30 octobre dans une transaction explicitement annulée (`BEGIN` / `ROLLBACK`). Le contrôle a confirmé `assertion_count = 46`, `all_passed = true` et aucune assertion en échec. Le test a installé pgTAP uniquement dans cette transaction ; l'extension n'est pas conservée en production après le rollback.
- Le test a été corrigé pour comparer les rôles avec des casts explicites vers `text` et fournir des `runid` négatifs explicites aux fixtures `cron.job_run_details`, sans nécessiter le privilège d'utilisation de `cron.runid_seq`. Ces corrections sont livrées dans une PR dédiée en attente de CI et de fusion.

**Politique définie par le code versionné :**

- Six mois glissants pour `public.admin_audit_log` et les exécutions terminées de `cron.job_run_details`.
- Une exception administrative peut aller jusqu'à douze mois après l'événement, uniquement pour `security_incident`, `legal_obligation` ou `internal_investigation`, avec une référence non personnelle au format `INC-YYYY-NNN`.
- Les exceptions sont stockées dans le schéma privé, sans accès API, et expirent automatiquement. Les exécutions cron incomplètes sont préservées.
- Le job quotidien appelle uniquement `private.prune_retained_logs()`. Les logs gérés par Supabase et Vercel ne sont pas purgés par Loculary ; leurs durées dépendent des forfaits souscrits. Aucun Log Drain ni changement de forfait n'est prévu.

**État de validation : migration enregistrée, job actif et tests transactionnels réussis.**

La sauvegarde indépendante préalable et l'identité de l'opérateur ayant déclenché l'application de la migration ne sont pas confirmées dans l'issue #1051. Le premier passage du job après sa création n'est pas encore observé : la migration a été enregistrée à 03:31 UTC, après l'horaire quotidien de 03:00 UTC. Le prochain passage nominal est donc attendu le 31 octobre 2026 à 03:00 UTC.

Le test transactionnel n'a laissé aucune modification persistante : le décompte du journal administratif reste à 1, celui des exceptions reste à 0 et les 806 exécutions cron sont inchangées. Ne pas réappliquer la migration, modifier le job ou lancer de purge manuelle. Reprendre après confirmation de l'origine de l'application et de la sauvegarde préalable, puis vérifier le premier passage planifié avant de synchroniser la politique publique FR/EN.
