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
- **DEC-027 — Catalogue Git-backed, réévaluable selon les besoins démontrés.** Le catalogue public reste actuellement versionné dans Git. Réévaluer cette architecture lorsque des besoins concrets, des mesures ou des contraintes éditoriales montrent qu'une autre solution apporte un bénéfice net. Comparer coûts, sécurité, exploitation et maintenabilité ; cette décision historique ne constitue pas une interdiction ni une exigence de validation humaine préalable.
- **DEC-028 — Git est la source de vérité du Design Lab.** Le laboratoire est une galerie locale des composants de production ; les décisions, spécifications et preuves de vérification vivent dans Git. Aucun catalogue ni workflow de maintenance dédié n’est conservé en base sans besoin démontré.

## Design system et qualité de livraison

- **DEC-026 — Material 3 Fidelity et identité visuelle Pixel/Android.** Material 3 Fidelity et les interfaces Pixel/Android actuelles constituent la direction visuelle explicite de Loculary, et non une simple inspiration facultative. L'objectif est une expérience Web de qualité application Android, cohérente et aboutie. Les adaptations Web sont permises et doivent être justifiées ; une réorientation vers un langage visuel substantiellement différent nécessite une validation explicite de l'utilisateur. La direction ne prouve pas la conformité actuelle. Contrat : [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) ; portage : [`material3/README.md`](material3/README.md).
- **DEC-030 — Transfert éphémère de résultat entre outils.** Le transfert local entre outils utilise un mécanisme de session limité et validé, sans données sensibles dans les URLs ni stockage distant.
- **DEC-031 — Scoped JSON path extraction.** L'extraction JSON prend en charge le sous-ensemble de chemins explicitement défini, sans prétendre implémenter tout JSONPath.
- **DEC-032 — Portable backups for local collections.** Les collections locales peuvent être exportées/restaurées via un format JSON versionné, validé et distinct des données synchronisées du compte.
- **DEC-033 — CI adaptative au risque (état historique à réévaluer).** La CI a utilisé une voie ciblée pour certaines modifications de dépendances étroitement classifiées, avec repli sur la suite complète en cas d'ambiguïté. Les tests Playwright ne faisaient pas partie de la CI au moment de la décision initiale (depuis la PR #970). Ces éléments décrivent un état et un arbitrage passés, pas une contrainte permanente : l'agent peut faire évoluer la stratégie, les outils et les contrôles selon le risque réel et la qualité de preuve recherchée.

## Langue et gouvernance du projet

- **DEC-036 — Expérience grand public de qualité AAA, cible d’abord et refontes autorisées.** Loculary vise une expérience Web familière, soignée, fiable et robuste, au niveau d’exigence d’une grande application grand public. Material 3 Fidelity est la direction visuelle explicite ; AndroidX fait autorité pour les contrats qu’il définit, tandis que les parcours non spécifiés s’appuient sur des conventions éprouvées après analyse de références pertinentes. La qualité visuelle et ergonomique ne doit pas être sacrifiée à la facilité d’implémentation. Le code, les composants et les pages existants sont remplaçables. Les refontes structurelles sont préférables aux retouches locales lorsqu’elles servent mieux l’expérience, avec justification et contrôles adaptés. Cette ambition ne prétend pas que la qualité ou l’échelle cible est déjà atteinte. Voir [`VISION.md`](VISION.md), [`UX.md`](UX.md), [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) et [`material3/README.md`](material3/README.md).
- **DEC-035 — AndroidX Compose UI/Foundation comme contrat cible du layout partagé.** Les primitives pertinentes sont portées avec les noms et contrats publics AndroidX quand cela est significatif sur le Web. Les espacements et contraintes propres à Loculary sont centralisés dans des tokens sémantiques ; les compositions produit restent possibles uniquement pour exprimer une convention réelle et demeurent remplaçables. Un nom AndroidX ne suffit pas à prouver la fidélité : version source, différences Web, tests de contrat et validation du rendu doivent être documentés. Voir [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) et [`material3/layout-primitives.md`](material3/layout-primitives.md).
- **DEC-034 — Français pour la communication du projet, anglais pour les conventions de code.** La documentation du dépôt, les GitHub Issues et les pull requests (titres, descriptions et échanges) sont rédigées en français par défaut. Le code, ses identifiants et ses conventions techniques restent en anglais selon les usages de l'écosystème. Cette règle concerne la langue de travail du dépôt, sans modifier les langues prises en charge par l'application ; les détails opérationnels sont définis dans [`AGENTS.md`](../AGENTS.md) et [`I18N.md`](I18N.md).

- **DEC-037 — Migration cible-first vers AndroidX Material 3 Fidelity.** L'existant est une base d'inventaire, pas une contrainte de conservation. Les emoji et caractères Unicode utilisés comme icônes fonctionnelles doivent être remplacés par des icônes Material pertinentes ; le texte éditorial, les données et les illustrations sont évalués selon leur fonction. Les anciennes classes, tokens et composants sont retirés après migration et vérification des références. Les adaptations Web ou produit doivent être justifiées et documentées ; elles ne doivent pas diluer la direction visuelle commune. Les contrats AndroidX épinglés, les tests et la vérification du rendu déterminent la conformité. Voir [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) et [material3/README.md](material3/README.md).
