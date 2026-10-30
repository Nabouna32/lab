# Loculary — Définition du produit

## Public

Le public principal est **toute personne ayant une petite tâche numérique à accomplir**.

Exemples :

- calculer un pourcentage ;
- convertir une unité ;
- vérifier une vitesse de téléchargement ;
- transformer un fichier localement ;
- générer un contenu ;
- comparer des valeurs ;
- explorer un résultat visuel ;
- prendre une décision aléatoire ;
- trouver un utilitaire spécialisé.

Le produit ne doit pas supposer de connaissances techniques professionnelles.

## Expérience principale

Une personne doit pouvoir :

1. arriver sur Loculary ;
2. effectuer une recherche ou parcourir le catalogue ;
3. comprendre le rôle d'un outil disponible ;
4. l'ouvrir ;
5. voir l'outil sans défilement inutile ;
6. saisir des données ;
7. obtenir un résultat clair ;
8. copier le résultat lorsque c'est pertinent ; la réinitialisation et le partage de l'état de l'outil restent des capacités cibles, et non des fonctionnalités universelles déjà disponibles ;
9. découvrir des outils associés si cela présente un intérêt.

## Recherche

La recherche est une capacité stratégique du produit.

La direction cible est progressive :

### Niveau 1 — Recherche dans le catalogue

Faire correspondre les noms, descriptions, alias, catégories et tags des outils.

### Niveau 2 — Recherche tenant compte de l'intention

Comprendre des demandes en langage naturel telles que :

> « calculer 25 % de 180 »

et identifier l'outil approprié.

### Expérience de découverte

La page d'accueil doit permettre d'accéder rapidement aux tâches et à la découverte du catalogue. La recherche, les raccourcis vers des tâches, l'Explorer, les parcours guidés et les outils récents sont des possibilités complémentaires ; leur place et leur présentation doivent suivre les usages réels et les conventions familières des applications Pixel et Android de qualité. Ne pas figer une maquette ou une composition de navigation unique, ni accumuler des entrées au point de gêner l'action principale.

L'Explorer peut combiner une navigation par intention et par catégorie. Les objectifs peuvent inclure calculer, convertir, transformer, créer, analyser, vérifier, générer, mesurer et découvrir. Une intention exprime un objectif, pas un raccourci de catégorie : une même intention peut mener à des outils de plusieurs catégories. Les associations initiales peuvent être des données éditoriales sélectionnées ; une inférence déterministe pourra les enrichir ultérieurement.

Le catalogue doit pouvoir croître fortement au fil du temps, mais le stockage, l'indexation, le cache, l'administration et les stratégies de chargement doivent être justifiés par l'échelle actuelle, les performances mesurées et les besoins éditoriaux réels. Le catalogue actuel reste géré dans Git ; DEC-027 définit les critères qui justifieraient de réévaluer un catalogue adossé à une base de données. Le comportement exécutable des outils reste dans Git.

La recherche prend en charge la correspondance exacte et par préfixe, les descriptions, alias, synonymes, tags, catégories, la tolérance aux fautes, les requêtes associées et les intentions exprimées en langage naturel. Les états sans résultat doivent aider à reformuler la demande, découvrir des outils ou catégories associés et identifier des alternatives utiles lorsqu'aucun résultat direct n'existe.

## Comptes

Les comptes sont facultatifs.

Les utilisateurs doivent pouvoir utiliser les outils principaux sans se connecter.

Un compte peut débloquer des fonctionnalités telles que :

- les favoris synchronisés avec le compte ;
- les collections personnelles, avec partage facultatif par lien ;
- les préférences du compte.

Les utilisateurs anonymes peuvent conserver leurs favoris et créer dans le navigateur des collections privées locales, sans compte. Les collections locales persistent sur cet appareil et ne contiennent que les noms des collections et les identifiants des outils ; elles ne stockent jamais les saisies ni les résultats des outils et ne peuvent pas être partagées par lien. Les utilisateurs connectés peuvent conserver des collections locales à côté des collections synchronisées avec leur compte, choisir pour chaque nouvelle collection si elle reste sur l'appareil ou se synchronise entre appareils, et éventuellement partager les collections synchronisées au moyen d'un lien explicite. Les collections sont privées par défaut ; un jeton de partage donne uniquement un accès en lecture à la collection synchronisée sélectionnée et à ses éléments. La connexion ne téléverse jamais silencieusement les collections locales. Les favoris anonymes sont fusionnés avec les favoris du compte selon une gestion déterministe des conflits. La préférence de thème clair/sombre fonctionne actuellement en local ; sa synchronisation avec le compte n'est pas encore implémentée.

Le produit doit privilégier l'utilisation anonyme et locale, et proposer la création d'un compte lorsqu'elle apporte une réelle valeur.

## État local et état synchronisé

Sans compte, les données utiles et non sensibles peuvent être stockées localement dans le navigateur.

Avec un compte, certaines métadonnées peuvent être synchronisées.

Les saisies et contenus des outils ne doivent pas être synchronisés ni stockés par défaut. Les contenus sensibles doivent rester locaux, sauf si une fonctionnalité exige explicitement un traitement distant et l'explique clairement.

## Catalogue d'outils

La plateforme prend en charge trois niveaux de complexité : les petits outils, les outils avancés et les mini-applications. Un socle commun doit standardiser la navigation, les métadonnées, les indicateurs de confidentialité, l'accessibilité, les actions courantes, le SEO, la gestion des erreurs, le cycle de vie et la découverte, sans imposer une disposition ou un modèle d'interaction identique à tous les outils.

Les composants et comportements d'interface doivent s'appuyer sur AndroidX et ses adaptations Web. Pour les parcours qui ne sont pas couverts par un contrat AndroidX, privilégier les conventions familières et éprouvées des applications Pixel et des applications grand public de qualité. Les outils peuvent avoir des compositions adaptées à leur tâche, mais ne doivent pas réinventer des patterns déjà résolus par des composants ou modèles reconnus.

Aucune limite artificielle n'est imposée aux catégories ou types d'outils ; la complexité d'implémentation doit rester proportionnée aux besoins démontrés.

Le catalogue peut contenir :

- des calculatrices ;
- des convertisseurs ;
- des outils de texte ;
- des outils d'image ;
- des outils audio/vidéo ;
- des outils de fichiers ;
- des outils de développement ;
- des outils de date et d'heure ;
- des outils financiers ;
- des outils statistiques ;
- des utilitaires réseau ;
- des générateurs ;
- des visualiseurs ;
- des simulateurs ;
- des outils éducatifs ;
- des outils créatifs ;
- des outils ludiques ;
- des outils d'aide à la décision ;
- des outils émotionnels ou introspectifs ;
- des outils symboliques ou spirituels ;
- ainsi que tout autre utilitaire utile réalisable dans un navigateur.

## Critères de qualité d'un outil

Un outil ne doit être considéré comme publiable que lorsque son implémentation et ses métadonnées respectent le contrat de qualité du projet.

Les vérifications attendues comprennent, selon le cas :

- un nom et une description utiles ;
- une catégorie et des tags ;
- des alias de recherche ;
- un état de traitement/confidentialité explicite ;
- un comportement responsive ;
- l'accessibilité ;
- la validation et les états d'erreur ;
- des tests ;
- les métadonnées SEO ;
- les comportements de partage, réinitialisation et copie lorsqu'ils sont pertinents ;
- des performances adaptées à l'outil ;
- la documentation ;
- les métadonnées des outils associés.

Le contrat automatisé exact évoluera avec la plateforme d'outils.

### Qualité des explications et des contenus

- Présenter d'abord le résultat utile et l'interaction principale ; rendre les explications accessibles sans en faire un obstacle à l'utilisation.
- Lorsque c'est utile, expliquer un résultat à partir des valeurs réellement saisies plutôt qu'au moyen d'une explication générique sans lien avec le cas.
- Préférer des exemples concis et réalistes qui clarifient un concept ; éviter les exemples répétitifs qui n'apportent aucune compréhension supplémentaire.
- Le contenu éditorial doit apporter une aide réelle. La visibilité dans les moteurs de recherche ne justifie ni le remplissage ni l'allongement artificiel des pages.
- Garder les options avancées disponibles lorsqu'elles apportent une réelle valeur, sans les laisser submerger l'expérience par défaut.
- Une fonctionnalité, une recommandation ou un bloc de contenu doit exister parce qu'il aide l'utilisateur, pas simplement parce que la mise en page ou le catalogue dispose d'espace.

## Expérience du compte

Loculary privilégie l'utilisation anonyme des outils principaux. La couche compte est un espace personnel facultatif pour le nom affiché, la préférence de langue, l'authentification, la gestion du mot de passe et de l'adresse e-mail, les favoris et la suppression du compte. Garder ses réglages simples ; ne pas ajouter de tableau de bord dédié à la confidentialité. Le compte ne doit jamais devenir un prérequis pour utiliser la boîte à outils principale.

## Diversité des outils

Un socle commun ne doit pas obliger tous les outils à avoir exactement la même apparence.

La plateforme doit standardiser :

- la navigation ;
- les métadonnées ;
- les indicateurs de confidentialité ;
- les exigences d'accessibilité ;
- les actions courantes ;
- le SEO ;
- la gestion des erreurs ;
- le cycle de vie et la découverte.

Les outils peuvent conserver des mises en page, visualisations, animations et interactions distinctives lorsque leur tâche le justifie, en s'appuyant sur les composants AndroidX et leurs adaptations Web plutôt que sur des implémentations de présentation parallèles propres à Loculary.

## Internationalisation

Langues initiales :

- anglais ;
- français.

L'anglais est la langue par défaut de l'application. Le français doit être disponible dès la livraison initiale. Les contenus doivent être structurés à partir de données de localisation afin de permettre l'ajout d'autres langues lorsqu'un besoin concret le justifiera, sans s'engager dès maintenant sur une feuille de route linguistique plus large.

Les traductions font partie du contenu produit ; elles ne doivent pas être dispersées sous forme de chaînes codées en dur.
