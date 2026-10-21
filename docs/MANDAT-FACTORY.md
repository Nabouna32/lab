# LOCULARY — MANDAT FACTORY

Ce mandat spécialisé définit comment sélectionner et conduire une mission produit de bout en bout pour livrer la prochaine amélioration qui apporte le plus de valeur à Loculary. Il complète `docs/MANDAT.md` sans le recopier et mobilise `docs/MANDAT-EXPERIENCE.md` lorsque l’expérience utilisateur est concernée.

## 1. Mission

À chaque exécution de la Factory, comparer les opportunités crédibles puis choisir **une seule mission principale** à mener jusqu’à un résultat vérifié, ou conclure de façon argumentée qu’aucune livraison n’est justifiée.

Les formes de mission sont équivalentes au départ :
- créer un nouvel outil ;
- refondre ou simplifier un outil existant ;
- ajouter une capacité transversale ;
- transformer la recherche, la découverte, la navigation ou un parcours ;
- corriger un problème systémique de qualité, d’accessibilité, de confidentialité, de performance ou de maintenabilité lorsque son impact justifie la priorité.

Le type de changement n’est jamais un objectif en soi. Le nombre d’outils, de commits et de PR n’est pas une mesure de réussite. Une amélioration existante peut valoir davantage qu’un nouvel outil ; une refonte large est légitime si elle apporte la meilleure valeur et peut être livrée en un lot cohérent.

## 2. Découvrir et sélectionner

Avant de choisir :
1. Lire l’état réel de `main`, les changements et PR en cours, l’issue checkpoint, `docs/PROJECT-STATE.md`, `docs/BACKLOG.md` et les spécifications canoniques liées au sujet.
2. Examiner les capacités déjà disponibles, les outils proches, les parcours partagés, les problèmes connus et les travaux récents pour éviter les doublons et la répétition des mêmes types de livraison.
3. Chercher les besoins non couverts et les frictions observables. Utiliser les retours disponibles, les tests, le code et, lorsque cela aide à décider, des sources externes actuelles. Consulter les documentations officielles pour les API et conventions susceptibles d’évoluer ; fournir les liens utiles et signaler les vérifications impossibles.
4. Comparer des opportunités de natures différentes lorsqu’elles sont crédibles. Ne pas lancer un audit exhaustif du produit à chaque exécution : approfondir les candidats nécessaires à une décision solide.

Évaluer les candidats selon :
- valeur et fréquence probable du besoin utilisateur ;
- ampleur du problème résolu et qualité du résultat ;
- utilisateurs/parcours concernés et contribution à la cohérence du produit ;
- différenciation et pertinence par rapport aux capacités existantes ;
- accessibilité, confidentialité, simplicité et usage sans compte ;
- coût de réalisation et de maintenance, risques, dépendances et coût d’opportunité ;
- niveau de preuve et incertitudes.

Cette comparaison guide le jugement ; elle ne doit pas devenir un score artificiel qui remplace l’analyse. Expliquer les hypothèses importantes et pourquoi le candidat retenu est préférable aux alternatives crédibles.

## 3. Challenge obligatoire de zéro

Avant l’implémentation, répondre concrètement à cette question :

**« Si nous construisions Loculary de zéro aujourd’hui pour répondre à ce besoin, quelle solution choisirions-nous ? »**

Repartir du besoin et du résultat utilisateur. Comparer honnêtement les options pertinentes : garder et améliorer, simplifier, remplacer, créer ou transformer le parcours. Évaluer les conséquences sur l’architecture, les outils liés, les composants partagés, la navigation, les langues, les thèmes, la confidentialité, l’accessibilité, les performances et la maintenance.

Ne préserver aucun choix par inertie et ne réécrire rien par principe. La décision doit conduire à une mission précise, avec un périmètre cohérent et un résultat observable.

## 4. Définir le résultat avant de coder

Le checkpoint de la mission doit préciser :
- le problème utilisateur et les éléments qui l’établissent ;
- la décision, les principales alternatives et les hypothèses ;
- le périmètre fonctionnel et les zones partagées affectées ;
- le résultat attendu et les critères d’acceptation vérifiables ;
- les risques, dépendances et contrôles de qualité proportionnés ;
- l’état courant, les décisions prises, le plan et la prochaine action.

Réutiliser une issue existante pertinente ou la mettre à jour plutôt que créer des doublons. Une conversation ou un résumé de session n’est pas un checkpoint durable. Actualiser l’issue au début, aux décisions importantes, en cas de blocage ou de changement de périmètre, puis à la fin. Toute suite identifiée mais non traitée devient une issue liée, après recherche de doublons.

## 5. Concevoir et construire un résultat complet

Concevoir l’expérience avant et pendant l’implémentation. Traiter le parcours complet, pas seulement le composant principal : découverte, entrées, validations, exécution, résultat, erreurs, états vides, récupération, copie/export et suite utile lorsqu’ils sont pertinents.

Respecter les fondations du produit, sans les considérer comme immuables :
- français et anglais, textes naturels et cohérents avec le comportement ;
- mobile, tablette et desktop, thèmes clair et sombre ;
- WCAG 2.2 AA, clavier, lecteurs d’écran et réduction des animations ;
- traitement local par défaut lorsqu’il convient, minimisation des données et transparence des flux ;
- cohérence des composants partagés sans uniformiser artificiellement les outils spécialisés ;
- performances, limites d’entrée, précision métier et cas limites ;
- architecture maintenable, dépendances justifiées et absence de duplication gratuite.

Lorsqu’un outil calcule, convertit ou transforme des données, vérifier les règles métier, unités, arrondis, précision, valeurs limites, entrées invalides et erreurs. Un résultat plausible n’est pas une preuve de justesse.

Consulter `docs/MANDAT-EXPERIENCE.md` pour les décisions UX/UI substantielles et les contrats produit concernés. Ne crée pas une documentation parallèle lorsque les registres canoniques existants suffisent.

## 6. Vérifier par des preuves

Choisir les vérifications selon le risque réel, puis inspecter le diff complet :
- tests unitaires, d’intégration et de contrat adaptés ;
- lint, TypeScript, build et audit des dépendances selon les règles du dépôt ;
- tests navigateur ciblés lorsque le parcours ou le risque le justifie ;
- vérification des textes FR/EN, responsive, thèmes, accessibilité, confidentialité et régressions affectés ;
- vérification de la CI sur le SHA exact de la PR, des protections et de la base avant toute fusion.

Ne traite pas une CI verte comme une preuve suffisante de qualité produit. Ne prétends pas avoir exécuté une vérification non disponible. Ne génère pas de captures ou d’artefacts visuels permanents par défaut ; une inspection visuelle ponctuelle est permise lorsqu’elle aide réellement à trancher un défaut.

Corriger les échecs relevant du périmètre autorisé. Ne contourner ni les contrôles de sécurité ni les protections GitHub. Fusionner la PR si les conditions sont remplies ; sinon documenter le blocage précis et poursuivre les investigations raisonnables.

## 7. Règle d’arrêt sans travail artificiel

La Factory n’est pas tenue de créer une nouveauté à tout prix. Si les opportunités examinées ne justifient pas une modification au regard de la valeur, des preuves, des risques ou du coût, elle peut conclure **qu’aucune livraison n’est justifiée**.

Cette conclusion exige un checkpoint utile : candidats considérés, raisons de rejet, incertitudes restantes et condition qui justifierait une reprise. Ne transforme pas ce cas en audit sans fin ni en tâche documentaire de substitution. Si un blocage externe empêche la mission, indique l’action concrète nécessaire pour le lever.

Pour une exécution de Factory, cette règle spécialisée remplace l’obligation générale de produire un changement à chaque reprise : elle ne remplace pas les règles générales de sécurité, de qualité, de traçabilité et de livraison de `docs/MANDAT.md`.

## 8. Automatisation : mandat distinct du déclencheur

Ce document définit le comportement de la mission ; il ne crée pas à lui seul un déclenchement automatique ou une exécution en arrière-plan.

Tout mécanisme d’orchestration devra être évalué séparément selon les capacités réellement disponibles, les permissions, les coûts, la durée, les reprises après interruption, la concurrence et la traçabilité. Il devra éviter les missions concurrentes sur le même état, les répétitions sans progrès, les boucles de PR et les déclarations de succès non vérifiées. Aucune dépense ou souscription payante sans accord explicite.

Commencer par des exécutions maîtrisées du mandat. Ne construire un ordonnanceur que lorsqu’un besoin concret et une voie technique fiable sont démontrés.

## 9. Livraison et continuité

La livraison est un changement produit ou technique substantiel et vérifié, pas une PR créée pour elle-même. Regrouper les changements cohérents, maintenir `docs/PROJECT-STATE.md` et `docs/BACKLOG.md` à jour, mettre à jour `docs/DECISIONS.md` uniquement lorsqu’une décision structurante en vigueur change, et supprimer les informations devenues obsolètes plutôt que les conserver comme historique documentaire.

Le compte rendu final indique :
- **Décision** : problème, solution retenue et alternative principale écartée ;
- **Résultat** : ce qui a réellement changé et la valeur visée ;
- **Preuves** : contrôles exécutés, état de la CI, PR/fusion/déploiement uniquement s’ils sont vérifiés ;
- **Limites** : incertitudes, contrôles non exécutés, risques ou blocages ;
- **Suite** : issues créées ou mises à jour et prochaine action utile.

Terminer par `PROCHAINE ACTION : …` ou `[STOP] : …`.
