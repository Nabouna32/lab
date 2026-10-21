# Loculary — décisions structurantes

Ce registre contient uniquement les décisions encore utiles pour guider le produit et l'architecture. Les contrats détaillés vivent dans les documents canoniques ; les tâches et incidents actifs vivent dans GitHub Issues. L'historique des versions supprimées reste disponible dans Git.

## Produit et confidentialité

- **DEC-001 — Browser-first processing.** Privilégier le traitement local lorsqu'il répond au besoin ; envoyer des données à un serveur ou fournisseur externe seulement lorsque nécessaire et annoncé.
- **DEC-002 — Anonymous-first usage.** Les outils publics restent utilisables sans compte ; le compte apporte des fonctions personnelles ou synchronisées facultatives.
- **DEC-003 — Transparent processing status.** Expliquer honnêtement où et comment un traitement est exécuté.
- **DEC-004 — Tool diversity is allowed.** Les outils peuvent avoir des compositions et interactions spécifiques à leur tâche, tout en respectant les contrats transversaux.
- **DEC-005 — AI is conditional, not foundational.** L'IA n'est utilisée que lorsqu'elle apporte une valeur démontrable ; le produit ne dépend pas d'elle pour ses fonctions essentielles.
- **DEC-006 — Privacy is a product feature.** Minimiser collecte, transfert, conservation et exposition des données.
- **DEC-007 — Simple consent choices.** Le consentement doit être explicite, compréhensible et limité à ce qui est nécessaire.
- **DEC-008 — Capability-based tool permissions.** Déclarer les capacités nécessaires à chaque outil et limiter les autorisations à ces besoins.
- **DEC-009 — External integrations are catalogued.** Les fournisseurs externes et leurs usages doivent être déclarés dans le catalogue des outils.
- **DEC-010 — Three-layer product model.** Distinguer plateforme, découverte/catalogue et outils spécialisés.
- **DEC-011 — First-class collections and explicit link sharing.** Les collections sont des objets utilisateur ; leur partage est explicite et distinct de leur confidentialité par défaut.
- **DEC-012 — Three levels of tool complexity.** Adapter l'architecture au niveau de complexité des outils plutôt que d'imposer une seule structure.
- **DEC-020 — Task-first toolbox and intention-based discovery.** L'action et la recherche priment ; la découverte par intention aide les personnes qui ne connaissent pas le nom d'un outil.
- **DEC-023 — Next actions are contextual and optional.** Les actions suivantes doivent être pertinentes pour le résultat et ne pas interrompre la tâche.
- **DEC-024 — Intents are first-class discovery objects.** Les intentions sont un modèle explicite de découverte, pas seulement des mots-clés.
- **DEC-029 — Persistent labels remain the default for shared Web tool fields.** Les libellés persistants sont une adaptation Web délibérée pour les formulaires et calculateurs actuels ; ils ne doivent pas être présentés comme une reproduction exacte de l'anatomie AndroidX `OutlinedTextField`.

## Architecture, outils et données

- **DEC-013 — First-class tool registry and dynamic execution route.** Le catalogue typé et le registre d'exécution sont explicites ; les routes de découverte ne doivent pas dupliquer les implémentations.
- **DEC-014 — Tool-scoped runtime capabilities.** Les capacités d'exécution sont limitées à chaque outil.
- **DEC-015 — Granular admin RBAC in the database.** L'administration est protégée côté serveur par des rôles et permissions en base.
- **DEC-016 — System administration labels belong to application i18n.** Les libellés d'administration suivent l'internationalisation de l'application.
- **DEC-017 — Explicit decimal and binary file-size units.** Les unités décimales et binaires sont nommées sans ambiguïté.
- **DEC-018 — English is the product translation fallback.** L'anglais est la langue de repli des traductions.
- **DEC-019 — Translation status is an explicit readiness signal.** La disponibilité des traductions doit être vérifiable, pas déduite du seul affichage.
- **DEC-021 — English reference locale and fully localized public tool URLs.** L'anglais sert de locale de référence et les URLs publiques des outils sont localisées.
- **DEC-022 — Complete account lifecycle and deletion semantics.** Création, accès, suppression et effets sur les données de compte doivent avoir des sémantiques explicites.
- **DEC-025 — Clean Supabase application foundation.** Supabase porte les domaines de compte et de sécurité déployés ; le catalogue public des outils reste versionné dans Git.
- **DEC-027 — Database-backed catalog is conditional on demonstrated need.** Ne pas réintroduire de catalogue public en base sans besoin démontré, comparaison des coûts et validation explicite.
- **DEC-028 — Supabase is the operational record for Design Lab maintenance.** Supabase conserve le registre opérationnel du Design Lab ; Git reste la source de vérité du code, des migrations, des tests et des spécifications.

## Design system et qualité de livraison

- **DEC-026 — Material 3 Fidelity and Pixel-inspired interface.** La direction partagée est Material 3 Fidelity et les interfaces Pixel/Android actuelles, pas Material 3 Expressive. Le contrat de base est dans [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) et le portage AndroidX est suivi dans [`material3/README.md`](material3/README.md). La direction ne prouve pas la conformité actuelle.
- **DEC-030 — Transfert éphémère de résultat entre outils.** Le transfert local entre outils utilise un mécanisme de session limité et validé, sans données sensibles dans les URLs ni stockage distant.
- **DEC-031 — Scoped JSON path extraction.** L'extraction JSON prend en charge le sous-ensemble de chemins explicitement défini, sans prétendre implémenter tout JSONPath.
- **DEC-032 — Portable backups for local collections.** Les collections locales peuvent être exportées/restaurées via un format JSON versionné, validé et distinct des données synchronisées du compte.
- **DEC-033 — Risk-adaptive dependency CI.** La CI n'utilise une voie ciblée que pour les changements de dépendances étroitement classifiés et vérifiés ; tout cas ambigu revient à la suite complète. Les tests Playwright ne font pas partie de la CI actuelle depuis la PR #970.
