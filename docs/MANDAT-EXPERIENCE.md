# LOCULARY — MANDAT D’EXPÉRIENCE UX/UI

Ce mandat spécialisé complète `docs/MANDAT.md`. Il définit comment choisir, concevoir, améliorer et vérifier l’expérience de Loculary dans son ensemble. Il ne remplace ni le mandat principal, ni les contrats du design system, ni les spécifications produit.

## 1. Challenge obligatoire : repartir des besoins

Avant de choisir un changement, pose explicitement la question :

**« Si nous concevions aujourd’hui cette expérience de zéro, à partir du besoin réel de l’utilisateur, quelle serait la meilleure solution ? »**

- Pars du besoin, du contexte et du résultat recherché, pas de l’interface existante.
- Compare honnêtement les options crédibles : conserver et améliorer, simplifier, réorganiser, remplacer ou concevoir un nouveau parcours.
- Ne conserve pas un composant ou une convention par inertie ; ne refonds pas pour la seule nouveauté.
- Tranche, explique l’alternative principale écartée et livre un lot cohérent apportant une valeur perceptible.
- Évalue les conséquences sur les autres outils, les parcours partagés, les thèmes, les langues, l’accessibilité, la confidentialité, la performance et la maintenance.

## 2. Périmètre : toute l’expérience, pas seulement le Design Lab

L’analyse couvre l’application entière, les outils individuels et les fonctionnalités transversales. Le Design Lab est un outil d’observation et de validation, pas la limite du travail.

### Design system et composants réellement utilisés

Vérifie les composants effectivement rendus par l’application, pas seulement les tokens, maquettes ou exemples isolés :

- boutons, champs, zones de texte, sélecteurs, cases à cocher, interrupteurs, radios et onglets ;
- menus, popovers, dialogues, alertes, toasts, infobulles et navigation ;
- cartes, listes, filtres, recherche, résultats, pagination, actions et contrôles spécifiques aux outils ;
- variantes, tailles, densité, icônes, libellés, états interactifs et comportements clavier.

Repère les composants incohérents, dupliqués, trop génériques ou inutilement complexes. Favorise des composants partagés quand ils améliorent réellement la cohérence et la maintenabilité ; préserve les compositions spécifiques lorsqu’elles servent mieux la tâche. Ne déduis jamais qu’un composant est correctement appliqué parce qu’il existe dans le design system.

### Parcours et architecture de l’expérience

Évalue le parcours complet : comprendre le besoin, découvrir ou rechercher un outil, le sélectionner, saisir les données, exécuter l’action, comprendre le résultat, puis poursuivre, copier, exporter, comparer ou réutiliser si cela a du sens.

Couvre notamment l’accueil, la navigation, la recherche et l’exploration, les catégories, les pages d’outils, les résultats, les favoris, les collections et les actions de partage ou d’export. Cherche les étapes inutiles, les impasses, les répétitions, les choix ambigus et les occasions de rendre Loculary plus utile. N’impose pas une structure uniforme aux outils dont les besoins diffèrent.

### Textes et i18n

Les textes visibles sont une partie fonctionnelle de l’interface, pas une finition secondaire. Examine les titres, descriptions, libellés, boutons, placeholders, aides, exemples, validations, erreurs, confirmations, états de chargement, états vides et messages de succès.

- Le français et l’anglais doivent être naturels, précis, cohérents et complets ; éviter le français traduit littéralement et les mélanges de langues.
- Les libellés doivent décrire l’action ou le résultat attendu, sans ambiguïté.
- Les erreurs doivent expliquer le problème et, lorsque c’est possible, comment le résoudre.
- Les textes doivent correspondre au comportement réel : ne promets pas une action, une confidentialité ou un traitement qui n’existe pas.
- Vérifie les textes longs, les accents, les pluriels, les formats, les débordements et les changements de langue.
- Évite les formulations vagues, le jargon inutile, les doublons et les messages qui culpabilisent l’utilisateur.

## 3. Qualité visuelle et interactionnelle

Évalue l’interface réelle, sur les écrans et états pertinents :

- hiérarchie visuelle, typographie, lisibilité, espacements, alignements et densité ;
- cohérence des rôles de couleur, formes, élévation, icônes et animations ;
- thèmes clair et sombre, responsive, zoom et contenus de longueurs variables ;
- états par défaut, focus, survol, pression, sélection, désactivation, chargement, succès, vide et erreur ;
- retours immédiats et compréhensibles, prévention des erreurs, possibilité d’annuler ou de récupérer ;
- prévention des doubles soumissions, perte de saisie, résultats périmés et actions dont l’état est trompeur.

La direction de référence est Material 3 Fidelity et les interfaces Pixel/Android, en cohérence avec `docs/DESIGN-SYSTEM.md` et `docs/M3-CONVENTIONS.md`. Ce sont des références à challenger si une autre solution sert mieux l’usage. Ne confonds pas fidélité à une référence avec qualité d’expérience.

## 4. Accessibilité comme exigence de conception

Vise WCAG 2.2 AA et vérifie le comportement réel, pas seulement la présence d’attributs :

- parcours clavier complet, ordre de tabulation, focus visible et non masqué ;
- noms accessibles, rôles, états, annonces et structure pour les technologies d’assistance ;
- contraste, taille des cibles, zoom, réorganisation du contenu et erreurs compréhensibles ;
- alternatives aux interactions reposant uniquement sur la couleur, le survol, le glisser-déposer ou le pointeur ;
- respect de la préférence de réduction des animations ;
- dialogues, menus, formulaires et composants personnalisés utilisables au clavier et avec lecteur d’écran.

Les audits automatisés sont utiles mais incomplets. Ils ne prouvent pas à eux seuls la conformité ni l’utilisabilité.

## 5. Confiance, confidentialité et autonomie

L’interface doit rendre compréhensibles les opérations et leurs conséquences :

- distinguer clairement le traitement local, l’envoi à un service distant, la sauvegarde et la synchronisation ;
- indiquer les limites, les formats attendus, les risques de perte et les effets des actions importantes ;
- éviter de demander un compte ou des données sans nécessité démontrée ;
- ne pas présenter une action comme privée, locale ou réversible si ce n’est pas vérifié ;
- privilégier des messages honnêtes et une récupération claire plutôt qu’un succès ambigu.

Challenge ces choix si les besoins et les preuves justifient une meilleure approche, sans sacrifier la transparence.

## 6. Méthode d’investigation et de décision

Pour chaque lot d’expérience :

1. **Observer** le parcours et les composants réels ; consulter le code, les conventions, les problèmes connus et les retours disponibles.
2. **Repartir de zéro** pour le problème ciblé et comparer les solutions crédibles.
3. **Établir les faits** : distinguer les défauts reproduits, les signaux automatisés, les hypothèses et les points non observés.
4. **Prioriser** selon la valeur utilisateur, la fréquence et la gravité du problème, l’accessibilité, la confidentialité, la cohérence et le coût de maintenance.
5. **Traiter le problème de bout en bout** : interface, textes FR/EN, états, composants partagés, responsive, thèmes et tests concernés.
6. **Vérifier** le comportement, le rendu et les régressions avec les moyens disponibles.
7. **Rendre compte** de la décision, du résultat vérifié, des limites et des suites utiles.

Réutilise les registres, outils et rapports existants lorsqu’ils sont adaptés. Ne crée pas de documentation redondante ou d’infrastructure visuelle pour elle-même. Une investigation doit guider une décision et une amélioration concrète, pas devenir une fin en soi.

## 7. Validation navigateur et diagnostics actionnables

La validation navigateur doit accélérer la correction de l'expérience, pas créer un flux parallèle d'artefacts à récupérer et inspecter. Par défaut, la CI reste textuelle : tests fonctionnels, assertions ciblées et diagnostics concis directement visibles dans les logs.

- Couvre les parcours et états à risque avec des assertions Playwright qui échouent sur un comportement incorrect.
- Ajoute des contrôles ciblés pour les défauts objectivables : contraste de couleurs calculé, débordements, noms accessibles, erreurs JavaScript/console/réseau et résultats inattendus.
- Vérifie les variantes de viewport, de thème et de langue lorsque cela modifie réellement le risque de régression ; ne multiplie pas les projets uniquement pour produire des captures.
- Garde les logs courts, structurés et orientés vers le diagnostic. Évite de joindre des arbres d'accessibilité complets ou des rapports redondants à chaque test si une assertion ciblée suffit.
- **Ne génère pas de captures PNG systématiques, ne conserve pas de traces visuelles, ne joins pas de rapports Playwright aux tests et ne téléverse pas d'artefacts de navigateur dans la CI.**
- Si un défaut complexe ne peut pas être tranché avec les tests, les logs et le code, une inspection visuelle ponctuelle hors du flux permanent de CI reste possible. Elle ne doit pas devenir un contrat obligatoire ni bloquer la correction dans la session en cours.

Les tests automatisés ne savent pas décider seuls si l'accueil est confus, si plusieurs actions se répètent inutilement ou si l'interface manque de cohérence. Ces questions exigent une analyse produit et UX/UI, puis des décisions de conception assumées. Les assertions doivent verrouiller les défauts objectifs connus, pas prétendre remplacer le jugement humain.


## 8. Critères de sortie d’un lot UX/UI

Un lot est prêt lorsque, selon son risque et son périmètre :

- le problème utilisateur et la décision de conception sont explicités ;
- le parcours concerné fonctionne réellement, y compris les états d’erreur et de récupération pertinents ;
- les textes français et anglais sont cohérents avec le comportement ;
- les thèmes, viewports et composants partagés affectés ont été vérifiés ;
- les contrôles d’accessibilité adaptés ont été effectués et leurs limites signalées ;
- les tests pertinents passent, ou tout échec restant est clairement documenté ;
- les vérifications retenues sont proportionnées au risque et leurs limites sont explicites ;
- aucun résultat de test, examen visuel, fusion ou déploiement n’est affirmé sans preuve.

Ce n’est pas une checklist mécanique qui impose tous les contrôles à chaque changement. Adapte les vérifications au risque, mais explique toute limite importante.

## 9. Périmètre et livraison

Ce mandat guide le choix et l’évaluation du travail UX/UI dans toute l’application. Il n’autorise pas à limiter les améliorations au Design Lab, ni à uniformiser chaque outil au détriment de son usage.

Les règles générales de travail, de validation, de livraison, de sécurité et de suivi restent celles de `docs/MANDAT.md` et des consignes du projet. En cas de divergence, respecte les règles de gouvernance et de validation applicables ; ce document ne les remplace pas.

Chaque compte rendu UX/UI doit résumer :
- **Problème et décision** : besoin, solution retenue et alternative principale écartée.
- **Portée** : parcours, composants, langues, thèmes et viewports concernés.
- **Vérifications** : tests exécutés, captures produites et inspectées, résultats et limites.
- **Suite utile** : problèmes non résolus ou prochaine action recommandée.
