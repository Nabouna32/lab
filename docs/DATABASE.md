# Loculary — Base de données

PostgreSQL est la source de vérité des données durables de compte, du RBAC administratif et des journaux d'audit actuellement déployés. La base peut prendre en charge d'autres domaines produit lorsque leurs exigences justifient le schéma et le coût opérationnel correspondants. Le comportement exécutable reste dans Git ; une base de données n'est pas la destination par défaut de toutes les données produit.

Les domaines de compte déployés comprennent les favoris et les collections personnelles, en plus des données d'identité, de profil et de sécurité administrative. Les préférences synchronisées, les métadonnées éditoriales et l'état de confidentialité ou de consentement ne font pas partie du schéma actuellement déployé ; ne les envisager que lorsque des besoins concrets justifient leur coût.

Les saisies sensibles des outils et le contenu des fichiers ne sont pas stockés par défaut. Après connexion, les favoris anonymes locaux peuvent être fusionnés avec les favoris du compte selon une gestion déterministe des conflits.

## Contraintes du plan Supabase

- Loculary utilise actuellement Supabase avec le plan Free.
- La protection contre les mots de passe divulgués ne peut pas être activée avec le plan Free actuel. Il s'agit d'une limite de l'offre, et non d'une omission de l'implémentation.
- Supabase signale cette situation comme un avertissement Auth au niveau de la plateforme, sous l'identifiant `auth_leaked_password_protection`, et non comme un problème de lint de base de données. Les migrations SQL et les suppressions d'avertissements du lint SQL ne peuvent pas le résoudre. Conserver cette limite Free acceptée dans les audits ; ne pas la signaler de manière répétitive comme un défaut non résolu du dépôt. Réévaluer uniquement si l'offre change ou si l'authentification par e-mail et mot de passe n'est plus utilisée.
- Si le projet passe à une offre qui prend en charge la protection contre les mots de passe divulgués, la réévaluer et l'activer dans le cadre du renforcement de la sécurité.
- Tenir compte des limites du plan Free lors de l'évaluation de l'architecture Supabase, du volume de requêtes, de l'egress, de la taille de la base, des Edge Functions et des autres conceptions sensibles à l'usage.

Toutes les données fournies par le client sont non fiables. Appliquer côté serveur la validation, l'autorisation, les contraintes, l'unicité et la traçabilité.

## Socle implémenté

Le premier socle de compte est désormais déployé dans Supabase : Supabase Auth reste le système d'identité, tandis que `public.profiles` ne stocke que les métadonnées de profil appartenant à l'utilisateur et pouvant être synchronisées sans risque particulier. Les rôles et permissions administratifs définis par le système utilisent des clés stables ; leurs libellés destinés aux utilisateurs appartiennent à la couche i18n de l'application. La Row Level Security limite l'accès au profil à son propriétaire, et le trigger d'insertion sur `auth.users` constitue l'unique mécanisme pris en charge pour créer un profil. Les clients authentifiés ne peuvent pas insérer directement de profils.

Ce socle de compte reste volontairement réduit. Les favoris et les collections personnelles constituent des domaines distincts appartenant au compte. Les collections sont privées par défaut et peuvent être partagées au moyen d'un jeton de lien explicite ; les préférences synchronisées et les données de catalogue ou éditoriales restent des ajouts futurs possibles uniquement si des besoins concrets justifient leur coût en base et en exploitation.

## Limite entre catalogue et base de données

Un catalogue adossé à une base de données est une option future possible, et non une cible active ou une migration planifiée. Le nettoyage d'octobre 2026 a supprimé l'ancien schéma `tool_*` et les permissions de catalogue, ne conservant qu'un socle réduit pour les comptes et l'administration. Le catalogue public reste géré dans Git.

Réexaminer l'utilisation d'une base de données pour le catalogue lorsqu'un besoin concret ne peut pas être correctement satisfait par Git, par exemple la publication éditoriale sans déploiement de code, des goulots d'étranglement mesurés dans la recherche, le build ou la distribution, ou des besoins d'administration et d'audit auxquels le workflow actuel ne répond pas raisonnablement. La taille du catalogue seule ne constitue pas un déclencheur. Comparer l'ensemble des coûts opérationnels, de sécurité, de confidentialité et de maintenance, puis choisir l'architecture la mieux justifiée dans le cadre du mandat autonome. DEC-027 consigne le choix actuel de Git comme source du catalogue et ses critères de réévaluation ; cette décision n'est ni une interdiction permanente ni une obligation d'obtenir une approbation humaine.

Le comportement exécutable des outils reste dans Git et le code : les modules du registre, le mode de traitement, les capacités et le comportement technique ne sont jamais déplacés dans la base de données au seul motif que le stockage des métadonnées éditables change.

La base de production actuelle ne contient aucune des tables `tool_catalog`, `tool_translations`, `tool_categories`, `tool_tags`, `tool_aliases` ou `tool_relations`, ni aucune permission administrative `catalog.*`.

## Socle actuel de production

La migration initiale du socle de production est `20261008195413_clean_application_foundation` ; les migrations suivantes étendent ce socle. Les tables publiques actuellement déployées comprennent le socle conservé pour les comptes, le RBAC administratif et l'audit, ainsi que les favoris du compte :

- `public.profiles`
- `public.admin_roles`
- `public.admin_permissions`
- `public.admin_role_permissions`
- `public.admin_user_roles`
- `public.admin_audit_log`
- `public.user_favorites`
- `public.user_collections`
- `public.user_collection_items`

Les neuf tables publiques listées ont la Row Level Security activée. `public.user_favorites` est définie par la migration `20261013180750_user_favorites` et est appliquée en production avec des politiques de lecture, insertion et suppression réservées au propriétaire, ainsi que des permissions de table réservées aux utilisateurs authentifiés. Les collections personnelles sont définies par les migrations `20261013193627_user_collections` et `20261013193734_user_collections_policy_performance` ; elles et leurs éléments sont privés par défaut pour leur propriétaire, tandis qu'un jeton de partage explicite accorde un accès en lecture à la collection sélectionnée et à ses éléments. Les propriétaires authentifiés peuvent gérer leurs collections et leurs éléments grâce à des permissions de table au moindre privilège et à la RLS. L'ancien schéma de catalogue et les permissions associées ont été supprimés lors du nettoyage précédant le lancement. Le socle du dépôt est conçu pour être rejoué localement depuis une base vierge ; la production utilise déjà l'identité de migration correspondante.

## Socle d'administration

L'autorisation administrative dispose désormais d'un socle en base de données, distinct du comportement exécutable des outils. Les rôles, permissions, associations de permissions, affectations de rôles aux utilisateurs et journal d'audit administratif sont stockés dans Supabase avec la Row Level Security. Les premiers rôles sont `super_admin` et `admin`. Aucun bootstrap automatique du premier utilisateur n'existe ; l'attribution d'un rôle administrateur doit être explicite.

## Sécurité du cycle de vie des comptes

- La création des profils est effectuée par le trigger `private.handle_new_user()` sur `auth.users` ; le rôle `authenticated` ne possède ni privilège direct `INSERT` ni politique d'insertion sur les profils. La fonction trigger n'est pas directement exécutable par `anon` ou `authenticated`.
- Les privilèges des fonctions suivent le moindre privilège par défaut pour les fonctions créées par le propriétaire des migrations applicatives `postgres` : les droits globaux `EXECUTE` accordés à `PUBLIC` et les droits par défaut propres aux schémas `anon`, `authenticated` et `service_role` dans `public` sont révoqués. Chaque RPC exposée doit accorder explicitement `EXECUTE` à son appelant prévu dans la migration qui la définit. Les fonctions trigger ne doivent pas recevoir de droits d'exécution directs via l'API, sauf si elles constituent également une RPC volontairement prise en charge.
- `public.profiles.id` référence `auth.users.id` avec `ON DELETE CASCADE`.
- La RLS des profils est réservée au propriétaire et exige également une session Auth active enregistrée dans `auth.sessions`.
- `admin_user_roles.user_id` est supprimé en cascade avec l'utilisateur Auth ; `assigned_by` devient `NULL` lorsque le compte ayant attribué le rôle est supprimé.
- `admin_audit_log.actor_user_id` accepte `NULL` et utilise `ON DELETE SET NULL` afin que l'historique d'audit de sécurité ne puisse pas bloquer la suppression d'un compte. Les références polymorphes aux utilisateurs dans `target_id` sont effacées par le trigger `BEFORE DELETE ON auth.users` dans la transaction de suppression Auth.
- `public.check_account_deletion` est l'unique précontrôle en lecture seule permettant à un utilisateur authentifié de demander la suppression de son propre UUID ; il exige une session active et refuse la suppression du dernier `super_admin`. L'ancien alias de compatibilité `public.prepare_account_deletion` est supprimé par une migration ultérieure.
- `private.guard_auth_user_deletion` est la protection faisant autorité pour la suppression. Elle prend le même verrou consultatif PostgreSQL limité à la transaction que `private.remove_admin_role`, revérifie l'invariant du dernier `super_admin` et efface les références cibles dans le journal d'audit. Le nettoyage des références à l'acteur est géré par la clé étrangère. Une suppression refusée annule les modifications du trigger. Le script dédié `.github/scripts/test-account-deletion-concurrency.sh` teste la course entre suppression de compte et retrait de rôle, ainsi que les chemins de succès et de refus de l'API Auth Admin lorsqu'il est exécuté contre une stack Supabase locale ; une migration directe en production n'exécute pas automatiquement ce test.
- La suppression Auth finale est effectuée côté serveur par l'Edge Function `account-delete` avec la clé secrète du projet ; aucune clé secrète n'est exposée au navigateur.

## Migrations Supabase

Les migrations de schéma sont appliquées par l'assistant au moyen du connecteur Supabase disponible ; il n'existe pas de workflow distinct de livraison de base de données dans GitHub Actions. Le SQL des migrations reste versionné dans Git.

Pour chaque changement, examiner le SQL et son impact avant application, puis vérifier la version de migration enregistrée à distance ainsi que l'état du schéma et de la sécurité concernés. Ne rapporter que les contrôles réellement effectués ; appliquer une migration ne signifie pas que les tests locaux, pgTAP ou les tests de concurrence ont été exécutés.

### Sauvegardes avant une opération destructive

L'organisation Supabase de Loculary utilise le **plan Free** (état vérifié via la Management API). Selon la documentation officielle Supabase, ce plan ne bénéficie pas des sauvegardes quotidiennes automatiques des offres payantes ; Supabase recommande des exports réguliers avec le CLI et une copie hors site. Avant une opération présentant un risque réel de perte de données, établir une sauvegarde indépendante des données concernées, vérifier que les fichiers sont complets et non vides, conserver leurs empreintes SHA-256 hors du dépôt et tester la restauration dans un environnement isolé lorsque cela est possible. Ne jamais présenter un export partiel comme une sauvegarde complète : `supabase db dump` exclut notamment les schémas gérés `auth`, `storage` et ceux créés par les extensions. Les identifiants de connexion et les fichiers de sauvegarde ne doivent jamais être publiés dans GitHub ou dans les conversations.

Le connecteur Supabase disponible permet de consulter et modifier le schéma, mais ne fournit pas d'opération d'export ou de restauration de sauvegarde. Si une sauvegarde vérifiable est nécessaire et qu'aucun mécanisme adapté n'est accessible, demander l'export à l'opérateur avant l'opération destructive ; ne jamais prétendre qu'un point de restauration existe sans preuve.

Le script conservé `.github/scripts/test-account-deletion-concurrency.sh` et les tests pgTAP restent utiles comme tests de non-régression, mais ils ne sont pas exécutés automatiquement par le connecteur. La CI GitHub Actions principale (`../.github/workflows/ci.yml`) exécute conditionnellement `deno check --frozen index.ts` pour les Edge Functions actuellement répertoriées lorsque des fichiers sous `supabase/functions/**` changent ou lorsque le workflow est déclenché manuellement. Elle ne déploie pas les fonctions et n'applique pas les migrations de base de données. Maintenir cette description alignée sur le workflow réel plutôt que sur un fichier de workflow distinct.

## Favoris du compte

La migration des favoris du compte est versionnée dans `supabase/migrations/20261013180750_user_favorites.sql` et est appliquée en production. Elle crée `public.user_favorites` avec une Row Level Security réservée au propriétaire, un accès authentifié au moindre privilège, une clé primaire composite et une suppression en cascade avec le compte Auth. La version de migration déployée, la table, les trois politiques réservées au propriétaire et les permissions de table pour les utilisateurs authentifiés ont été vérifiées directement lors de l'audit du 13 octobre 2026. Le test de régression pgTAP est `supabase/tests/user_favorites.sql` ; il ne fait pas partie de la CI GitHub Actions standard et n'a pas été exécuté lors de cette vérification de l'état de production.

## Collections personnelles

Les collections personnelles sont implémentées dans l'application et déployées dans Supabase. `public.user_collections` stocke le propriétaire, le nom et un éventuel jeton de partage unique ; `public.user_collection_items` associe les identifiants d'outils à une collection. Les deux tables ont la RLS activée. Les propriétaires peuvent créer, renommer et supprimer leurs collections, ainsi qu'ajouter ou retirer des outils. Les lectures anonymes sont limitées aux collections dont le jeton de partage explicite est fourni dans l'en-tête de requête `x-loculary-share-token` ; la politique correspondante n'expose que la collection partagée et ses éléments. La suppression du compte entraîne la suppression en cascade des collections et de leurs éléments.

Le schéma est défini par `supabase/migrations/20261013193627_user_collections.sql`, avec des ajustements de performance des politiques dans `supabase/migrations/20261013193734_user_collections_policy_performance.sql` et l'aide au jeton de partage limitée à la requête dans `supabase/migrations/20261029111421_optimize_collection_rls_and_remove_unused_index.sql`. L'index de clé étrangère RBAC est préservé par `supabase/migrations/20261029111441_restore_admin_role_permissions_fk_index.sql`. Le test de régression est `supabase/tests/user_collections.sql` ; il ne fait pas partie de la CI GitHub Actions standard et n'a pas été exécuté dans le cadre de cet audit de l'état de production.

## Design Lab

Le laboratoire est une galerie locale de composants partagés. Il ne stocke dans Supabase ni catalogue, ni observations, ni état de vérification : le code, les spécifications et les tests versionnés dans Git sont les seules sources de vérité.

La migration `20261029110714_retire_design_lab_audit.sql` retire les tables et fonctions propres à l'ancien workflow. Son préfixe correspond à la version effectivement enregistrée en production le 29 octobre 2026. Les migrations historiques restent dans Git pour préserver la traçabilité. Les permissions `audit.read` et `audit.write` sont conservées : elles protègent respectivement la lecture et l'écriture du journal d'audit administratif.

## Conservation des journaux opérationnels

**Politique indiquée comme active en production depuis le 30 octobre 2026 :**

- Douze mois glissants pour `public.admin_audit_log` et les exécutions terminées de `cron.job_run_details`.
- Le job `loculary-log-retention-12m` (id 3) est indiqué comme actif chaque jour à 03:00 UTC et appelle uniquement `private.prune_retained_logs()`.
- La migration `20261030160000 / extend_log_retention_to_12_months` est indiquée comme enregistrée en production.
- L'ancien job `loculary-log-retention-6m` a été retiré. La table d'exceptions et sa fonction ont été supprimées ; aucune archive applicative n'est conservée.
- Les exécutions cron incomplètes sont préservées. Les journaux gérés par Supabase et Vercel ne sont pas purgés par Loculary.
- Aucun archivage ni sauvegarde externe Google Drive n'est configuré pour ces journaux.

**Vérification après migration — 30 octobre 2026 :** 1 entrée dans `public.admin_audit_log`, 806 lignes dans `cron.job_run_details`, aucune ligne alors âgée de plus de douze mois, aucun run du nouveau job encore enregistré. Le premier passage était attendu le 31 octobre à 03:00 UTC. Les 19 assertions pgTAP ont réussi dans une transaction explicitement annulée ; l'extension pgTAP n'a pas été conservée et les compteurs sont restés inchangés après le test.
