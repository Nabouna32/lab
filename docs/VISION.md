# Loculary — Vision produit

## Objectif

Loculary est une boîte à outils universelle accessible depuis un navigateur : une collection vaste et en constante expansion d'outils utiles que chacun peut découvrir et utiliser immédiatement.

L'objectif n'est pas simplement de maximiser le nombre d'outils. Il s'agit de rendre un catalogue très vaste **organisé, compréhensible, moderne, rapide, visuel et agréable à explorer**.

Le parcours utilisateur central est le suivant :

> **J'ai un besoin → je trouve le bon outil → je l'utilise immédiatement → j'obtiens le résultat attendu.**

## Promesse produit

Loculary doit être perçu comme une boîte à outils numérique que l'on a envie d'ouvrir dès que l'on a besoin de calculer, convertir, générer, analyser, visualiser, décider, créer, comparer, tester ou accomplir une tâche ponctuelle.

Une proposition de positionnement de travail :

> **Loculary — une boîte à outils numérique, simple à utiliser, immense à explorer.**

Cette formulation est volontairement provisoire. Le nom du produit reste **Loculary**.

## Principes produit

### 1. L'outil d'abord

L'outil et le résultat utile constituent le contenu principal d'une page d'outil. Les informations complémentaires ne doivent pas empêcher son utilisation immédiate.

### 2. Local d'abord

Lorsqu'une tâche peut raisonnablement être réalisée entièrement dans le navigateur, son traitement doit rester local. Cela réduit les coûts d'infrastructure, améliore la confidentialité et permet parfois d'utiliser les outils sans transmettre de données à un serveur.

### 3. La transparence dès la conception

Chaque outil doit indiquer clairement où le traitement est effectué et si des services externes interviennent.

Exemples :

- **🔒 100 % local — vos données restent sur votre appareil**
- **🌐 Service externe — certaines données sont transmises à une API**
- **☁️ Serveur Loculary — ce traitement nécessite notre infrastructure**
- **🔒 + 🌐 Hybride — traitement local complété par un service externe**

Le langage visuel exact relève de l'implémentation ; l'exigence de transparence, elle, ne se négocie pas.

### 4. Simple par défaut, puissant lorsque nécessaire

Loculary doit être accessible à une personne occasionnelle sans apprentissage préalable, tout en restant adapté aux utilisateurs avancés.

### 5. Le visuel lorsqu'il apporte quelque chose

Les résultats doivent être présentés visuellement lorsque cela améliore leur compréhension, la confiance ou le plaisir d'utilisation. Le design visuel ne doit pas devenir une décoration qui ralentit ou masque la tâche.

### 6. Material 3 Fidelity et identité visuelle Pixel

Loculary adopte **la palette Material 3 Fidelity et le langage visuel des interfaces Google Pixel / Android actuelles** comme direction visuelle et interactive commune à sa plateforme Web. L'objectif est une interface fidèle, familière et de qualité Pixel, qui reste centrée sur les tâches et adapte les modèles natifs au Web.

Le contrat visuel détaillé — notamment la couleur de base bleue, les couleurs sémantiques M3 Fidelity, Roboto, les contrastes clair/sombre, les composants et le mouvement — est défini dans [docs/DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Les fondations communes assurent la cohérence sans imposer une composition de page identique à tous les outils. Les interfaces spécialisées restent possibles lorsqu'elles répondent mieux à la tâche, tout en respectant l'accessibilité, l'internationalisation, le responsive, les performances et la confiance.

Cette direction est volontairement ambitieuse : Loculary doit donner l'impression d'une application Android moderne et soignée portée sur le Web, avec le niveau d'exigence d'un grand produit grand public — et non d'un simple site Web utilisant les couleurs Material. Nous visons une **expérience produit de niveau AAA** : des détails cohérents, des comportements prévisibles, une excellente ergonomie, ainsi que des performances et une fiabilité adaptées à un produit susceptible de toucher un large public. Il s'agit d'une ambition de qualité, pas d'une affirmation sur l'échelle ou le niveau de conformité actuels.

AndroidX définit la référence dès qu'un contrat officiel de composant ou de comportement s'applique. Au-delà de ce périmètre, privilégier les conventions éprouvées des applications grand public reconnues pour leur qualité : réglages et parcours de compte familiers, hiérarchie claire de l'information, navigation prévisible, Material Symbols reconnaissables, lignes d'action concises, retours cohérents pour les états de chargement, vide, erreur et succès, et formulaires bien conçus. Étudier plusieurs références crédibles et tenir compte de la tâche de l'utilisateur ; ne pas inventer une convention différente sans raison et ne pas copier intégralement une autre application. Des références comme ChatGPT pour Android peuvent éclairer les décisions produit, mais ne prévalent jamais sur les contrats AndroidX, les sémantiques du Web, l'accessibilité, la confidentialité ou les performances.

**Les refactorisations et refontes substantielles de pages font partie des options attendues**, et ne sont pas des exceptions. Le code existant, les mises en page, les abstractions et les choix visuels ne sont que des points de départ ; ils peuvent être remplacés lorsque c'est la voie la plus claire vers une expérience familière, cohérente et digne d'un produit de qualité. Ne conserver ni code historique ni structure de page simplement parce qu'ils existent déjà. Préserver les particularités UX propres à un outil uniquement lorsqu'elles servent mieux les utilisateurs.

La préférence de thème clair/sombre doit fonctionner localement pour les utilisateurs anonymes et se synchroniser avec un compte lorsque la persistance des préférences de compte sera implémentée. Il s'agit d'une direction produit, pas d'une affirmation selon laquelle la fonctionnalité existe déjà. WCAG 2.2 AA et les préférences de réduction des animations restent obligatoires.

### 7. Une ambition fonctionnelle large

Loculary ne se limite pas aux calculatrices et aux convertisseurs. Tout outil utile réalisable dans un navigateur peut intégrer le catalogue : technique, pratique, créatif, éducatif, analytique, visuel, ludique, émotionnel, symbolique ou relevant d'autres domaines.

Les limites pratiques sont la faisabilité technique, les contraintes légales et de sécurité, le coût opérationnel et la qualité du produit.

### Explications utiles et qualité éditoriale

Loculary doit fournir le résultat utile en premier, tout en permettant aux personnes curieuses d'en comprendre davantage sans imposer une explication à tout le monde. Lorsqu'une explication apporte une valeur réelle, la contextualiser si possible à partir des données saisies ou du résultat de l'utilisateur. Préférer un exemple réaliste et pertinent à une liste d'exemples répétitifs ou artificiels. Chaque explication ou contenu éditorial doit aider à comprendre, décider ou utiliser l'outil ; ne jamais ajouter de remplissage dans le seul but d'allonger une page ou de cibler les moteurs de recherche. Masquer la complexité inutile dans l'interaction principale sans supprimer les capacités avancées qui apportent une réelle utilité.

## La dualité de Loculary

Le catalogue pourra à terme proposer un éventail volontaire entre deux dimensions complémentaires :

**Concret / Utilitaire**

- calcul ;
- mesure ;
- finance ;
- données ;
- développement ;
- réseau ;
- fichiers ;
- productivité.

**Exploration / Expression**

- outils créatifs ;
- outils de hasard et d'aide à la décision ;
- expériences ludiques ;
- outils émotionnels ou introspectifs ;
- outils symboliques ou spirituels ;
- générateurs visuels.

Ces dimensions ne sont pas des catégories mutuellement exclusives. Elles décrivent différentes façons dont une interaction peut être utile ou porteuse de sens.

## Vision à long terme de la plateforme

L'application Web est le produit principal. Garder son domaine métier et sa logique d'outils faciles à maintenir, sans ajouter d'abstractions pour des clients hypothétiques.

## Hors objectifs

À ce stade, Loculary n'est pas :

- un produit qui impose la création d'un compte ;
- un service d'hébergement de fichiers ;
- une plateforme généraliste de traitement cloud ;
- un produit d'IA par défaut ;
- un réseau social ;
- une promesse selon laquelle chaque outil doit utiliser exactement le même traitement visuel.

## Ressenti attendu

Le résultat produit le plus important à long terme est le sentiment de l'utilisateur après avoir utilisé Loculary :

> **« C'était simple, utile et bien réalisé. »**

Il s'agit volontairement d'un objectif de qualité produit plutôt que d'un indicateur unique.

## Continuité produit

Les favoris, les collections et les préférences de thème clair/sombre restent des fonctionnalités facultatives qui ne rendent pas la création d'un compte obligatoire pour l'utilisation principale. Les évolutions produit doivent être évaluées selon la valeur utilisateur démontrée, la faisabilité, la confidentialité et le coût opérationnel.
