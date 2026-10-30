# Loculary — Orientation architecturale

## Statut

Ce document définit l'orientation architecturale issue de la phase actuelle de découverte produit. Il distingue volontairement les contraintes produit fermes des détails d'implémentation qui restent ouverts.

## Principe architectural principal

**Le navigateur d'abord.**

Dès qu'une opération utile peut raisonnablement être exécutée dans le navigateur, celui-ci doit s'en charger.

Le serveur n'a pas vocation à devenir un backend généraliste de traitement de fichiers.

## Répartition des responsabilités

### Navigateur

Emplacement privilégié pour :

- les calculs ;
- les conversions ;
- le traitement de texte ;
- les transformations locales de fichiers ;
- le traitement d'images ;
- les visualisations côté client ;
- les simulations interactives ;
- les générateurs aléatoires ;
- les préférences anonymes ;
- les autres opérations pouvant être exécutées localement en toute sécurité.

### Backend / services hébergés

Adaptés pour :

- l'authentification ;
- les métadonnées utilisateur synchronisées ;
- les favoris et les collections ;
- les préférences du compte ;
- les métadonnées du catalogue lorsque cela apporte un bénéfice ;
- l'orchestration de certaines API externes ;
- les opérations qui nécessitent réellement un serveur.

### API externes

Autorisées lorsqu'elles apportent des capacités utiles qui ne peuvent pas raisonnablement être fournies localement.

Exemples possibles :

- météo en temps réel ;
- données publiques ;
- taux de change ;
- enrichissements ciblés.

Les services externes doivent être explicitement déclarés dans les métadonnées de statut de traitement de l'outil.

## Gestion des fichiers

Les téléversements et téléchargements de fichiers volumineux via l'infrastructure Loculary sont volontairement évités par défaut.

Lorsqu'une opération sur un fichier peut être réalisée localement, le parcours privilégié est :

> Appareil de l'utilisateur → navigateur → traitement local → résultat

Aucun téléversement vers Loculary n'est nécessaire.

Un traitement de fichier côté serveur exige une justification produit explicite, car il a des conséquences sur :

- le coût de l'infrastructure ;
- la bande passante ;
- la confidentialité ;
- la surface d'abus ;
- la fiabilité ;
- la complexité opérationnelle.

## Plateforme d'outils

À long terme, la plateforme doit traiter les outils comme des objets métier de premier ordre, plutôt que comme des pages sans lien entre elles.

Une définition conceptuelle d'outil peut contenir :

- un identifiant stable ;
- un nom affiché ;
- une description ;
- une catégorie ;
- des tags ;
- des alias de recherche ;
- des clés de localisation ;
- des métadonnées d'icône et de présentation ;
- un mode de traitement ;
- des dépendances externes ;
- des capacités ;
- des métadonnées SEO ;
- des outils associés ;
- de la documentation ;
- des métadonnées de validation et de test.

Les contrats actuels du catalogue et du registre sont implémentés et testés. Le modèle conceptuel plus large ci-dessus reste une orientation : tous ses champs et toutes ses relations ne sont pas figés.

## Implémentations des outils

La plateforme doit permettre une diversité de traitements métier.

Un contrat partagé pour les outils doit standardiser les aspects d'infrastructure sans exiger que tous les outils aient exactement la même interface.

Les types d'implémentation possibles comprennent :

- des calculatrices déterministes simples ;
- des outils reposant sur des formulaires structurés ;
- des générateurs visuels ;
- des éditeurs interactifs ;
- des traitements locaux de fichiers ;
- des simulations ;
- des outils reposant sur des API.

## Définitions d'outils et expériences spécialisées

Un système de définitions structurées est encouragé lorsque le comportement d'un outil peut être représenté de manière sûre et claire.

Il ne doit toutefois pas devenir un moteur de rendu limité au plus petit dénominateur commun.

Un outil peut nécessiter une implémentation métier spécifique pour prendre en charge :

- une visualisation particulière ;
- une interaction complexe ;
- une animation spécifique ;
- un traitement spécialisé.

Cette spécificité concerne d'abord la logique métier et le rendu du résultat. L'interface doit continuer à s'appuyer sur les composants AndroidX et leurs adaptations Web, ainsi que sur les patterns éprouvés correspondants. Ne créer une composition d'interface propre à Loculary qu'en l'absence démontrée d'une solution adaptée ; une telle exception doit rester rare et justifiée.

La plateforme doit traiter les outils spécialisés comme des cas de premier ordre, et non comme des contournements.

## Modèle de confidentialité

L'architecture doit exposer l'emplacement du traitement sous forme de métadonnées explicites.

Un outil doit déclarer s'il est :

- exclusivement local ;
- adossé à un service externe ;
- traité côté serveur ;
- hybride.

Ces métadonnées peuvent alimenter :

- les indicateurs de l'interface ;
- les détails de confidentialité ;
- les filtres de recherche ;
- la documentation ;
- les audits.

## Modèle d'état

Utiliser l'état local du navigateur lorsque la synchronisation avec un compte n'est pas nécessaire.

Les mécanismes de stockage local envisageables comprennent :

- `localStorage` pour les petites préférences et les collections locales privées, qui ne contiennent que les noms des collections et les identifiants des outils ;
- IndexedDB pour les états locaux structurés et plus volumineux.

Les collections locales peuvent être exportées sous forme de sauvegarde JSON versionnée et restaurées de manière additive dans le navigateur. L'import vérifie le format et les limites, filtre les identifiants d'outils absents du catalogue publié actuel et crée de nouveaux identifiants locaux ; les collections associées à un compte ne sont jamais incluses dans cette sauvegarde locale.

Le choix final doit dépendre des besoins réels en matière de données.

Par défaut, l'état associé à un compte doit stocker des métadonnées plutôt que le contenu brut et sensible des outils.

## Architecture de recherche

La recherche doit être conçue comme un système de premier ordre, et non comme un simple filtre textuel.

Le catalogue doit prendre en charge :

- les noms exacts ;
- les alias ;
- les descriptions ;
- les catégories ;
- les tags ;
- la localisation ;
- les associations d'intentions ;
- les outils associés.

Le catalogue modélise les intentions séparément des catégories, avec des associations plusieurs-à-plusieurs entre les intentions et les outils.

## Authentification

Le fournisseur d'authentification actuellement implémenté est Supabase Auth avec e-mail et mot de passe. Les outils principaux restent accessibles anonymement. D'autres fournisseurs de connexion sont des évolutions facultatives, et non un besoin actuel ; n'en ajouter que si un besoin utilisateur démontré justifie la surface supplémentaire de compte, de configuration et de support.

### Architecture d'authentification du compte implémentée

Loculary utilise Supabase Auth avec Next.js App Router et PKCE pour les liens de confirmation d'e-mail et de récupération. Les Server Components, Server Actions et Route Handlers utilisent le client Supabase SSR ; les contrôles d'identité utilisent `getClaims()` pour la protection des routes et des sessions, et `getUser()` lorsqu'un enregistrement utilisateur Auth récent est nécessaire. Le Proxy actualise l'état Auth sur les routes de compte, d'authentification et d'administration.

Les données du compte sont volontairement limitées : Supabase Auth gère les identifiants, la vérification de l'adresse e-mail, les sessions et l'adresse e-mail de référence ; `public.profiles` ne stocke que le nom affiché et la locale. La RLS du profil exige à la fois la propriété de l'enregistrement et une ligne active dans `auth.sessions`, afin qu'une session révoquée ne puisse plus lire ni modifier les données du profil même si son JWT n'a pas encore expiré.

La récupération du mot de passe utilise le flux de réinitialisation PKCE de Supabase. Le changement de mot de passe depuis un compte connecté exige le mot de passe actuel. Le changement d'adresse e-mail utilise le flux natif de confirmation Supabase et ne contourne pas les protections Secure Email Change.

La suppression du compte est effectuée côté serveur par une Edge Function Supabase authentifiée avec le JWT de l'utilisateur. Elle supprime définitivement l'utilisateur Auth avec la clé secrète réservée au serveur, ce qui permet aux suppressions en cascade Auth de retirer les lignes associées au compte. Le contrôle préalable en lecture seule `check_account_deletion` fournit la vérification UX habituelle ; il ne fait pas autorité, car sa transaction se termine avant la requête Auth Admin. Un trigger `BEFORE DELETE` sur `auth.users` fait autorité : il partage le verrou consultatif transactionnel avec la suppression protégée du rôle `super_admin`, refuse la suppression du dernier `super_admin` et efface dans la même transaction les références polymorphes aux utilisateurs dans `admin_audit_log`. La clé étrangère `actor_user_id` utilise `ON DELETE SET NULL`. Si la suppression est refusée, le nettoyage de l'audit est annulé avec elle. La CI Supabase locale teste la concurrence entre suppression de compte et retrait de rôle, ainsi que les cas de suppression réussie d'un utilisateur ordinaire et de refus de suppression du dernier super-administrateur via l'API Auth Admin.

## Base de données

La base de données déployée prend actuellement en charge :

- les métadonnées d'identité et de profil du compte ;
- les favoris et les collections personnelles ;
- le RBAC administratif et les données d'audit.

Les préférences synchronisées ou les métadonnées d'outils supplémentaires ne doivent être envisagées que lorsque des besoins concrets justifient leur coût en base de données et leur coût opérationnel.

Supabase/PostgreSQL est la plateforme de base de données actuelle pour les comptes déployés, le socle RBAC administratif et l'audit. Le catalogue public des outils est actuellement géré dans Git ; l'ancien schéma de catalogue en base de données n'est pas déployé et aucune migration du catalogue n'est planifiée à ce jour. Il s'agit d'une description de l'architecture actuelle, pas d'une contrainte permanente : réévaluer le stockage lorsque des éléments produit ou opérationnels concrets le justifient, selon les critères de coût et de sécurité de DEC-027 et de `docs/DATABASE.md`.

Le stockage et la distribution du catalogue doivent rester distincts des implémentations exécutables des outils. Git et le code restent les sources de vérité des modules du registre, des modes de traitement, des capacités et de la logique réelle des outils. Toute évolution future du stockage doit préserver cette séparation et justifier son coût opérationnel.

## Architecture partagée de mise en page

La mise en page et les espacements sont des responsabilités communes de la plateforme, pas des conventions propres à chaque page.

La cible est un portage React/Web des API publiques pertinentes de layout d'AndroidX Compose UI/Foundation. Les primitives fondées sur les sources définissent le comportement de mise en page ; les tokens CSS sémantiques de Loculary portent les dimensions responsives propres au produit, notamment les gouttières de page et les largeurs de contenu. Le contrat du système de design et l'état du portage sont décrits dans [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) et dans la [spécification des primitives de layout](material3/layout-primitives.md).

Les pages doivent assembler les composants AndroidX et leurs adaptations Web pour former les parcours du produit, sans réimplémenter leurs contrats ni créer une couche parallèle de composants de présentation propres à Loculary. Remplacer les compositions et primitives d'interface existantes par les équivalents AndroidX/Web pertinents, puis supprimer les anciennes implémentations devenues inutiles après vérification des références et des usages. Une exception propre à Loculary n'est acceptable que si aucune solution AndroidX ou adaptation Web pertinente ne couvre le besoin, ou si elle compromet une exigence réelle du Web, de l'accessibilité ou du produit ; elle doit rester rare, minimale et justifiée. Les mises en page doivent s'appuyer sur les primitives partagées et éviter les espacements arbitraires propres à chaque page.

Un portage n'est pas fidèle simplement parce qu'il porte un nom AndroidX. Il faut figer la version des API sources, tester les contrats publics, documenter les différences Web et vérifier le rendu réel dans le navigateur selon les points de rupture responsive, les thèmes clair/sombre, les contenus français/anglais, le sens de lecture et l'accessibilité avant d'affirmer une parité.

## Socle technologique

Le dépôt utilise actuellement :

- Next.js App Router ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- Vercel pour l'hébergement de production ;
- GitHub Actions pour la CI ;
- les tests Node.js, le lint, la vérification des types et les builds de production comme socle de validation automatisée.

Il s'agit du socle actuel, et non d'un engagement immuable.

Tout changement technologique majeur doit être justifié au regard des exigences du produit en matière de priorité au navigateur, de SEO, de performances, de maintenabilité et de coût.
