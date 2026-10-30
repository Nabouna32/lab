# Loculary — Spécification de l'expérience utilisateur

## Direction générale

**Statut :** approuvée. Cette direction prévaut sur les formulations UX plus anciennes lorsqu'elles se contredisent.

Loculary est une boîte à outils numérique orientée vers l'accomplissement de tâches. Son identité visuelle commune est **Material 3 Fidelity et l'univers des applications Pixel/Android actuelles**. Cette direction est une exigence produit, pas une préférence esthétique facultative.

L'expérience doit être directe, précise, agréable et centrée sur le besoin de l'utilisateur. Loculary ne doit pas être traité comme une page marketing SaaS conventionnelle, un tableau de bord générique ou un simple catalogue de liens.

Les interfaces existantes, leurs compositions, leurs composants et leurs conventions peuvent être remplacés lorsqu'ils ne servent plus la direction produit ou qu'une solution plus fidèle aux modèles éprouvés existe.

## Intentions des utilisateurs

L'expérience doit répondre à trois intentions complémentaires :

1. **Trouver un outil** — la personne sait approximativement ce qu'elle cherche et utilise la recherche.
2. **Comprendre comment accomplir une tâche** — elle connaît son objectif, mais pas nécessairement l'outil adapté ; l'exploration et la navigation par intention l'aident.
3. **Découvrir** — elle souhaite parcourir ce que Loculary peut proposer.

Ces intentions doivent coexister sans que la découverte ne gêne l'accomplissement direct d'une tâche.

## Parcours principal

> **Besoin → Recherche ou exploration → Outil → Action → Résultat → Étape suivante**

Le résultat n'est pas nécessairement la fin de l'expérience. Lorsque cela a du sens, l'utilisateur peut copier, télécharger, partager, réinitialiser ou modifier le résultat, ou poursuivre avec un outil complémentaire.

## Accueil et découverte

La page d'accueil doit permettre de comprendre rapidement ce que Loculary permet de faire et de commencer une tâche sans détour. La recherche, l'exploration du catalogue, les parcours guidés et les accès personnels sont des moyens complémentaires ; leur importance et leur présentation doivent découler des besoins observés, de la richesse du catalogue et des conventions familières des applications grand public de qualité.

Privilégier les modèles éprouvés des applications Pixel et Android lorsque leur usage est pertinent : recherche identifiable, destinations compréhensibles, hiérarchie claire et accès prévisibles. Ne pas inventer une composition inhabituelle pour se distinguer. Ne pas imposer non plus une maquette unique à toutes les évolutions : choisir une composition familière qui sert réellement les tâches principales et reste simple à comprendre dès la première visite.

Les raccourcis vers des outils, les catégories, les intentions, les parcours guidés, les favoris ou les outils récents peuvent être présentés lorsqu'ils facilitent effectivement le choix. Éviter leur accumulation et toute densité qui gênerait l'action principale. Les cartes et grilles de cartes sont des possibilités Material 3 éprouvées ; choisir leurs variantes et leur densité selon le contenu et les usages.

## Navigation et orientation

La navigation doit être immédiatement reconnaissable, prévisible et cohérente avec les conventions AndroidX et les applications Pixel de qualité. Privilégier les composants et modèles de navigation AndroidX adaptés au Web plutôt que de créer un mécanisme propre à Loculary.

Le choix entre barre supérieure, tiroir, rail, navigation inférieure ou un autre modèle pris en charge dépend du nombre et de la priorité des destinations, de l'espace disponible et des usages réels. Aucune combinaison fixe n'est imposée à toutes les pages et à tous les viewports.

La recherche doit rester facile à trouver. L'exploration doit permettre de parcourir le catalogue selon plusieurs repères complémentaires :

- l'intention, par exemple calculer, convertir, transformer, créer, analyser, vérifier, générer ou mesurer ;
- le domaine ou la catégorie, par exemple images, texte, fichiers, développement, finance ou données.

Utiliser les modèles de navigation adaptative éprouvés lorsque le contexte le justifie. Les destinations doivent conserver la sémantique de liens du Web, un état de page courante visible et un comportement accessible au clavier et aux technologies d'assistance. Un catalogue riche doit rester facile à parcourir sans devenir visuellement écrasant.

## Expérience des outils

L'outil et son résultat constituent le cœur de l'expérience. L'utilisateur doit comprendre rapidement ce que l'outil fait, quelles données il attend et comment obtenir le résultat. Les informations de traitement et de confidentialité doivent être accessibles et compréhensibles sans faire obstacle à l'utilisation.

La priorité habituelle est de rendre l'interaction principale et le résultat faciles à repérer, puis de proposer les actions, explications et ressources complémentaires utiles. Cet ordre exprime une intention, pas un modèle de page obligatoire. Les outils complexes ou spécialisés peuvent nécessiter d'autres compositions.

Lorsque la taille du viewport le permet, l'interaction principale et son résultat doivent rester accessibles sans défilement superflu. Ne pas placer de contenu marketing ou documentaire avant l'accès à l'outil.

La documentation ne doit pas concurrencer la tâche principale ni retarder l'accès à l'outil.

### Interfaces adaptées à chaque tâche

Loculary doit conserver un langage visuel et interactif commun sans forcer tous les outils à adopter la même disposition.

À titre d'exemples, un outil de calcul peut mettre en avant des saisies et un résultat synthétique ; un outil de fichiers peut nécessiter une zone de dépôt, des aperçus et des contrôles de traitement ; un générateur peut mettre en avant ses paramètres et son aperçu ; un outil d'analyse peut privilégier les données, leur visualisation et leur interprétation.

Ces différences doivent répondre aux besoins métier et à la compréhension du résultat. Elles ne justifient pas de réinventer des composants ou des patterns communs déjà couverts par AndroidX et ses adaptations Web.

## Direction visuelle et familiarité

Le système visuel partagé suit **Material 3 Fidelity et les modèles actuels des interfaces Pixel / Android**, conformément à DEC-026 et au [contrat du système de design](DESIGN-SYSTEM.md). Loculary doit donner l'impression d'une application Android soignée et pensée pour le Web, et non d'un site générique simplement décoré avec des couleurs Material. Cette direction est obligatoire et ne doit pas être abandonnée par commodité d'implémentation.

Adapter les modèles natifs aux sémantiques du Web plutôt que de copier l'écran complet d'un produit Google ou d'adopter un modèle SaaS générique. Préserver la qualité de l'expérience dans la hiérarchie, les surfaces, les formes, les couleurs tonales, la typographie, l'iconographie, la navigation, les retours d'état, les animations et l'adaptation responsive. Une interface fonctionnelle mais générique, inachevée ou simplifiée sans soin ne répond pas à l'objectif.

**AndroidX est la référence pour les contrats de composants et comportements qu'il définit.** Pour les parcours et compositions non spécifiés par AndroidX, privilégier les conventions familières et éprouvées des applications Pixel et des applications grand public de qualité. Cela concerne notamment les réglages, les comptes, les formulaires, la validation, les confirmations d'actions sensibles, les états de chargement et d'absence de contenu, ainsi que les retours de succès et d'erreur. Étudier des références crédibles et vérifier leur pertinence pour la tâche Loculary ; ne pas copier une application entière et ne pas inventer une convention sans bénéfice utilisateur. Aucune référence externe ne prévaut sur les sémantiques du Web, l'accessibilité, la confidentialité ou les performances.

La marque reste distincte de l'iconographie fonctionnelle. Utiliser les icônes Material appropriées pour les actions et les commandes ; ne pas remplacer les symboles d'interface standards par des emoji ou des caractères Unicode arbitraires.

L'agent peut améliorer librement l'implémentation pour atteindre Material 3 Fidelity : composants, tokens, primitives de layout, structure des pages et dépendances techniques peuvent être remplacés. **Les composants et compositions d'interface propres à Loculary doivent être migrés vers les composants AndroidX pertinents ou leurs adaptations Web, puis supprimés lorsqu'ils deviennent obsolètes.** Une exception n'est acceptable que si aucune solution AndroidX/Web adaptée n'existe ou si son usage compromet une exigence réelle ; elle doit rester très rare, minimale et justifiée.

Une refonte peut être large ou structurelle lorsqu'elle permet d'adopter plus fidèlement les modèles éprouvés et d'améliorer le parcours. Le code et les compositions existants ne sont pas protégés au seul motif qu'ils existent. En revanche, une refonte ne doit pas rechercher l'originalité pour elle-même ni s'éloigner des conventions familières. Remplacer la direction visuelle Material 3 Fidelity par un langage substantiellement différent reste une décision de direction produit qui nécessite une validation explicite de l'utilisateur.

## Résultats et retours d'état

Les résultats doivent être clairs, immédiats et dignes de confiance. Les retours relatifs au traitement, à la copie, à la réinitialisation, à la validation, aux erreurs, à la progression et à l'annulation doivent être explicites et animés de manière appropriée.

L'interface doit rendre compréhensible le passage de la saisie au résultat. Les animations et effets visuels peuvent apporter une valeur fonctionnelle, expérientielle ou identitaire ; ils ne doivent pas gêner l'accomplissement de la tâche. Respecter les préférences système de réduction des animations.

Un résultat peut être textuel, numérique, tabulaire, graphique, animé, interactif ou visuel. Choisir la représentation qui communique le mieux le résultat. Les traitements visuels plus riches sont bienvenus lorsqu'ils améliorent réellement la compréhension, la qualité perçue, la continuité spatiale ou le caractère de l'outil ; ne pas les supprimer par principe avant d'avoir évalué leur utilité, leur accessibilité et leur coût en performance.

## Saisie et validation

Les saisies invalides doivent être empêchées ou clairement signalées.

Pour les champs contraints :

- empêcher les valeurs impossibles lorsque cela améliore l'utilisation ;
- fournir un retour immédiat et compréhensible ;
- ne pas transformer silencieusement une saisie significative en une autre valeur.

La validation doit être accessible et compréhensible. Les erreurs doivent indiquer ce qui ne va pas et, lorsque c'est possible, comment corriger la saisie.

## Actions et continuité

Proposer les actions courantes lorsqu'elles ont du sens :

- **Copier** pour les résultats copiables ;
- **Réinitialiser** pour les outils qui possèdent un état ;
- **Partager** lorsqu'un état reproductible peut être représenté sans risque.

Les URL de partage doivent être conçues avec soin afin de ne pas exposer involontairement des contenus sensibles.

### Étapes suivantes

Une page d'outil peut proposer des **étapes suivantes** lorsqu'une suite naturelle existe dans la tâche de l'utilisateur. Elles ne sont pas obligatoires sur chaque page. Elles doivent répondre à une question utile telle que :

> **Que pourrais-je faire ensuite ?**

Une étape suivante doit normalement poursuivre ou compléter la tâche actuelle plutôt que simplement ressembler à l'outil utilisé.

Exemples :

- poursuivre une transformation ou une conversion ;
- effectuer un calcul complémentaire ;
- affiner ou vérifier le résultat actuel ;
- passer à l'étape évidente d'un parcours impliquant plusieurs outils.

Une simple similarité, la popularité ou la découverte générale du catalogue ne doit pas être présentée comme une étape suivante uniquement pour remplir un espace. Un outil peut légitimement ne proposer aucune étape suivante.

Le mécanisme de recommandation est un détail d'implémentation. La valeur produit réside dans la pertinence de la suite proposée, et non dans le fait que deux outils partagent des métadonnées ou une catégorie.

### Découverte par intention et catégorie

Les points d'entrée fondés sur les intentions représentent **ce que l'utilisateur souhaite accomplir**, et non un simple raccourci vers une catégorie. Une intention peut mener à plusieurs outils pertinents, y compris dans différentes catégories, à mesure que le catalogue grandit.

L'expérience ne doit jamais laisser entendre qu'une catégorie représente à elle seule une intention. Les associations initiales entre intentions et outils peuvent être des données éditoriales sélectionnées ; une découverte déterministe ultérieure peut les enrichir sans changer le sens produit.

## Explications et documentation

La documentation d'un outil est secondaire par rapport à son utilisation, mais elle doit rester un véritable contenu de page afin que les utilisateurs et les moteurs de recherche puissent comprendre l'outil.

Les explications longues peuvent être présentées au moyen de sections dépliables lorsque cela améliore la lecture. Les contenus possibles comprennent le fonctionnement, les formules, les exemples, les cas limites, les questions fréquentes et les détails de confidentialité ou de traitement. Le choix de la présentation dépend du contenu et des modèles Material 3 pertinents ; aucune structure documentaire unique n'est imposée.

Le résultat et la tâche principale doivent rester visuellement prioritaires. Les formules, raisonnements et explications détaillées peuvent être proposés comme contenus secondaires que l'utilisateur consulte lorsqu'il souhaite approfondir. Lorsque cela est pertinent, relier l'explication aux saisies ou au résultat réel de l'utilisateur. Préférer quelques exemples réalistes qui illustrent des cas distincts plutôt que des listes artificielles ou répétitives. Chaque bloc de texte doit aider à comprendre ou à utiliser l'outil ; le SEO seul ne justifie ni le remplissage ni l'allongement artificiel d'une page.

## Transparence du traitement

Chaque outil doit exposer un indicateur de statut concis.

Exemples :

> 🟢 **Traitement local** — vos données restent sur votre appareil.

> 🔵 **Service externe** — certaines données sont transmises à un service externe.

> 🔵 **Serveur Loculary** — ce traitement nécessite notre infrastructure.

> 🟡 **Traitement hybride** — le traitement local est complété par un service externe.

L'indicateur doit permettre d'accéder à une infobulle ou à une vue détaillée.

Cette vue doit expliquer :

- où le traitement est effectué ;
- quelles données quittent l'appareil ;
- quel service les reçoit ;
- pourquoi leur transmission est nécessaire ;
- si elles sont stockées ;
- leur durée de conservation pertinente ;
- les limites importantes.

Il s'agit d'une fonctionnalité centrale de confiance, et pas uniquement d'une documentation technique.

## Responsive

Les expériences desktop et mobile sont toutes deux des contextes de première classe. Le mobile ne doit pas être traité comme une version desktop simplement compressée ; les tablettes ne doivent pas non plus se retrouver dans un état intermédiaire maladroit.

La hiérarchie entre recherche, interaction avec l'outil, résultat et actions doit rester compréhensible à toutes les tailles d'écran. Les compositions et points de rupture doivent être choisis en fonction du contenu, des composants AndroidX adaptés et des usages réels, plutôt que d'appliquer mécaniquement une grille fixe.

## Accessibilité

L'accessibilité est une exigence produit. Les interfaces des outils doivent notamment prendre en charge :

- la navigation au clavier ;
- les contrôles HTML sémantiques ;
- un focus visible ;
- des libellés appropriés ;
- des erreurs de validation compréhensibles ;
- un contraste suffisant ;
- les préférences de réduction des animations ;
- les annonces d'état compatibles avec les lecteurs d'écran lorsque cela est nécessaire.

WCAG 2.2 AA constitue la référence. Les vérifications doivent porter sur l'expérience réellement rendue, et pas uniquement sur les métadonnées ou les tests statiques.

## SEO et découverte

Chaque outil public qui répond à une tâche distincte doit pouvoir disposer d'une page stable et utile. Les pages d'outils doivent avoir, lorsque leur indexation est pertinente :

- des titres utiles ;
- des descriptions ;
- des URL canoniques ;
- des métadonnées Open Graph ;
- des données structurées adaptées ;
- un contenu explicatif propre à l'outil ;
- des liens internes vers les outils pertinents ;
- une présence dans le sitemap lorsqu'elles sont indexables.

Le SEO ne doit jamais rendre l'outil principal difficile à atteindre ni justifier l'ajout de contenu artificiel.

## Expérience personnelle et contenu contextuel

Les favoris, les collections personnelles et la préférence de thème clair/sombre doivent être faciles à retrouver sans rendre l'utilisation anonyme secondaire. La page d'accueil d'un utilisateur connecté peut éventuellement faire ressortir ses favoris et ses collections pour un accès rapide ; il s'agit d'une possibilité, pas d'un engagement à créer une page d'accueil configurable ou personnalisée.

Lorsque cela est utile, les pages d'outils peuvent proposer un retour léger, par exemple « Cet outil vous a été utile ? 👍 👎 », ou des évaluations authentifiées, sans distraire de la tâche.

## En-tête public, panneaux de navigation et recherche globale

L'en-tête, la recherche globale et la page d'accueil doivent suivre les conventions de navigation et de recherche familières des applications Pixel et Android, adaptées aux contraintes du Web. Leur emplacement, leur visibilité et leur présentation doivent être choisis selon la hiérarchie des tâches et les composants AndroidX/Web pertinents, sans imposer une composition unique à tous les viewports.

La marque reste distincte de l'iconographie fonctionnelle ; utiliser `LocularyLogo` plutôt que de dupliquer son SVG.

### Panneau de navigation de l'en-tête

Le panneau actuel de l'en-tête contient à la fois la navigation et les réglages. Il utilise donc un comportement de divulgation ou de popover, plutôt que de revendiquer la sémantique ARIA `menu` sans implémenter le modèle clavier correspondant.

- Les choix de thème et le sélecteur de langue ne ferment pas le panneau. Un changement de locale peut recréer le layout racine ; l'état ouvert est donc transmis une seule fois au moyen d'un état de session limité à l'onglet. Il ne s'agit pas d'une préférence durable et cet état est effacé lors de la prochaine interaction avec le menu. Le panneau est ensuite actualisé dans la langue sélectionnée.
- Les liens de destination ordinaires ferment le panneau au début de la navigation.
- Une interaction pointeur à l'extérieur du panneau et la touche Escape le ferment.
- Escape restaure le focus sur le déclencheur. Une fermeture par clic extérieur ne doit pas déplacer le focus hors de l'élément que l'utilisateur vient de sélectionner.
- Lorsque le panneau est fermé, ses descendants doivent être retirés de l'interaction clavier, et pas seulement masqués visuellement ou marqués `aria-hidden`.

### Recherche globale de l'en-tête (tous les points de rupture)

- L'ouverture de la recherche globale place le focus dans le champ de recherche.
- Un clic à l'extérieur, une fermeture explicite ou un changement de route ferme le panneau. Escape ferme d'abord une surface active de suggestions ou d'erreur ; un second Escape ferme le panneau.
- Lorsque Escape ferme le panneau ou que l'utilisateur utilise la fermeture explicite, le focus revient au déclencheur de recherche. Si Escape ferme uniquement les suggestions, le focus reste dans le champ. Une fermeture par clic extérieur préserve la cible du pointeur et du focus de l'utilisateur.
- Conserver un comportement non modal, sauf si l'implémentation fournit réellement un comportement modal et toute la gestion du focus qui l'accompagne.
- Vérifier le comportement en français et en anglais sur mobile, tablette et desktop. Privilégier les liens et boutons natifs, un focus visible et des zones tactiles d'environ 48 px CSS sur mobile.
