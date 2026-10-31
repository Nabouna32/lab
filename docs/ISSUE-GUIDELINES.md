# Loculary — règles de gestion des issues GitHub

**Statut :** référence opérationnelle centrale.  
**Langue :** français pour les titres, descriptions et échanges ; identifiants GitHub et noms techniques inchangés.

Ce document centralise la taxonomie, la création, la qualification, le cycle de vie des issues et l'hygiène des commentaires. Il s'applique aux trois modes décrits dans [AGENTS.md](../AGENTS.md). Il complète leurs permissions sans les élargir : le mode actif et ses règles de validation restent prioritaires.

## 1. Principes

- Une issue est un transfert de contexte et un checkpoint exploitable, pas un journal exhaustif ni une simple intention.
- Le dépôt est la source de vérité du code et des documents ; les issues décrivent le travail, ses décisions, ses critères et son état de reprise.
- Réutiliser une issue valide plutôt que créer un doublon. Ne pas créer une issue pour chaque petite correction ou opération courante.
- Vérifier le problème dans le code, les systèmes ou les preuves disponibles. Une issue ouverte, une ancienne décision ou un commentaire ne prouve pas que le problème existe encore.
- Challenger les demandes et les plans : repartir du besoin, comparer la cible idéale à l'existant, puis choisir de conserver, améliorer, remplacer ou supprimer.
- Distinguer les faits vérifiés, les hypothèses, les incertitudes, les actions tentées, les résultats et les éléments non vérifiés.
- Ne jamais inclure de secret, mot de passe, jeton, clé API ou donnée personnelle inutile dans une issue ou un commentaire.

## 2. Modes et permissions

Les permissions détaillées sont définies dans [AGENTS.md](../AGENTS.md) :

- **COLLABORATIF** : lecture libre ; aucune modification du projet avant validation explicite. Après validation, agir uniquement dans le périmètre approuvé.
- **PILOTAGE** : code et documents en lecture seule ; gestion des issues et commentaires autorisée. Aucune modification de branche, commit, PR, workflow, fusion ou livraison.
- **AUTONOME** : exécuter les travaux autorisés de bout en bout selon `docs/MANDAT-AUTONOME.md`.

Les modes peuvent être utilisés dans des conversations distinctes. Ne pas dépendre d'une mémoire conversationnelle privée pour transmettre le travail : une issue de transfert doit contenir les informations nécessaires à sa compréhension et à son exécution.

## 3. Taxonomie des labels

Attribuer **exactement un label principal de catégorie** à chaque issue de travail. Les labels transversaux et spéciaux peuvent s'ajouter sans remplacer la catégorie.

### Catégories principales

| Label | Usage |
|---|---|
| `bug` | Défaut avéré de comportement, sécurité ou expérience dans Loculary. |
| `fonctionnalite` | Création d'une capacité ou d'un parcours utilisateur nouveau. |
| `amelioration` | Amélioration d'une fonctionnalité, d'un parcours ou de l'expérience existante. |
| `maintenance` | Architecture, refactoring, dépendances, CI, performances, infrastructure ou dette technique. |
| `documentation` | La documentation est le résultat principal du travail. |

Choisir la catégorie selon le résultat principal, pas selon chaque sous-tâche. Une correction de sécurité qui modifie le code est généralement `bug` ou `maintenance` selon sa nature ; une évolution documentaire seule est `documentation`.

### Qualifications transversales et spéciales

| Label | Usage |
|---|---|
| `securite` | Risque réel de sécurité, confidentialité, permissions ou protection des données. S'ajoute à la catégorie lorsque pertinent. |
| `action-humaine` | Action, décision, identité, consentement ou confirmation qui doit réellement être effectuée par l'utilisateur. Réservé aux issues explicitement destinées à l'utilisateur. |

Une issue `action-humaine` conserve aussi une catégorie principale et son titre commence par **[Action humaine]**. Ne jamais utiliser ce label pour signaler une difficulté technique, une tâche lente, un outil limité ou une investigation incomplète.

### Labels Dependabot

Conserver exactement les identifiants configurés dans [`.github/dependabot.yml`](../.github/dependabot.yml) :

- `dependencies` : mises à jour de dépendances ;
- `npm` : écosystème npm ;
- `github-actions` : actions GitHub.

Ces labels sont appliqués par Dependabot. Ne pas les renommer, les remplacer par la taxonomie de travail ou modifier leur usage sans mettre à jour la configuration. Une PR Dependabot n'est pas une issue de travail : ne pas lui imposer artificiellement un label principal de catégorie. Si une issue de suivi distincte est nécessaire, lui attribuer sa propre catégorie et, le cas échéant, `securite`.

Les couleurs des labels ne constituent pas un contrat de classification : les identifiants exacts et les règles d'attribution ci-dessus font foi. Ne pas créer de variantes synonymes, de labels de priorité ou d'état (`en-cours`, `bloque`, etc.) sans besoin opérationnel durable démontré. La priorité est réévaluée selon la valeur et le risque ; l'état est porté par GitHub et le contenu à jour de l'issue.

## 4. Structure d'une issue exploitable

Adapter la longueur à la complexité, mais inclure les éléments nécessaires à la reprise :

1. **Contexte et constat** : situation actuelle, problème ou opportunité, preuves disponibles et date si l'information évolue.
2. **Objectif** : résultat attendu, formulé du point de vue du produit ou du système.
3. **Périmètre** : inclus, exclus et frontières avec les travaux voisins.
4. **État et diagnostic** : causes établies, hypothèses, incertitudes et éléments déjà vérifiés.
5. **Décision ou pistes** : solution recommandée et raisons ; alternatives pertinentes ; compromis et risques. Ne pas inventer une implémentation lorsque l'investigation ne la permet pas.
6. **Plan de reprise** : fichiers, composants, pages, systèmes, ressources et étapes connus ; liens directs vérifiés lorsque disponibles.
7. **Critères d'acceptation** : résultats observables, tests et conditions de clôture.
8. **Dépendances et liens** : issues, PR, commits, CI, documentation et systèmes concernés.
9. **État courant** : terminé, en cours, tenté sans succès, non vérifié ou bloqué ; prochaine action concrète.

### Niveau de prescription

- **Plan d'exécution détaillé** : à utiliser lorsque les investigations établissent le problème, les causes, les choix raisonnables, le périmètre, les dépendances, les étapes et les critères de fin.
- **Directive de cadrage** : à utiliser lorsque des inconnues empêchent de prescrire honnêtement une implémentation. Énoncer ce qui est connu, ce qui reste à découvrir, les questions à trancher, les pistes à comparer et les preuves attendues.

Les recommandations de PILOTAGE sont un point de départ argumenté, pas un ordre à exécuter aveuglément. AUTONOME doit revalider les éléments susceptibles d'avoir changé et challenger le plan à partir du dépôt et des systèmes actuels.

### Responsabilité de l'audit et qualité du transfert PILOTAGE → AUTONOME

PILOTAGE est responsable de l'audit initial avant de transférer un chantier ou une décision. Il consulte les sources pertinentes accessibles (documents canoniques, code, configuration, versions, tests, CI, issues/PR et sources officielles), reconstitue le parcours utile, établit les faits et leurs preuves, recherche les causes racines lorsque c'est possible et compare les alternatives proportionnées au risque.

Lorsque les preuves suffisent, PILOTAGE formule une recommandation argumentée et tranche les choix qui relèvent de son mandat. Il ne transforme pas une préférence en fait établi et ne reporte pas à AUTONOME une investigation qu'il pouvait raisonnablement mener.

Les incertitudes restantes doivent être délimitées individuellement :
- question précise qui reste ouverte ;
- raison pour laquelle les sources ou accès disponibles ne permettent pas de conclure ;
- preuve, mesure ou expérience attendue pour la résoudre ;
- décision ou étape d'exécution qui dépend de cette réponse.

Le transfert doit contenir le constat vérifié, les preuves et liens directs, les causes établies et hypothèses restantes, la recommandation et les alternatives écartées, le périmètre, les dépendances, les inconnues résiduelles, le plan d'exécution ou la directive de cadrage adaptée, ainsi que les critères d'acceptation. Adapter le niveau de détail à la complexité : une petite tâche ne nécessite pas un audit volumineux.

À réception, AUTONOME :
- revalide les faits susceptibles d'avoir changé et les contraintes réelles de l'environnement ;
- challenge la recommandation si une preuve nouvelle, une contrainte ou une meilleure solution le justifie ;
- résout les investigations résiduelles explicitement délimitées dans son périmètre ;
- ne recommence pas l'audit initial déjà suffisamment établi et ne repousse pas un arbitrage déjà étayé ;
- poursuit les travaux indépendants lorsqu'une inconnue bloque uniquement une partie du chantier.

Une **directive de cadrage** reste réservée aux inconnues qui empêchent réellement de prescrire une implémentation. Elle décrit les questions et preuves attendues ; elle ne sert pas à transférer un audit incomplet. Cette responsabilité de transfert ne modifie pas les permissions des modes et ne rend pas une issue préalable obligatoire aux initiatives autonomes indépendantes déjà autorisées.

### Lecture préalable obligatoire en mode AUTONOME

Avant de décider d'exécuter une issue, AUTONOME doit lire son corps intégral et tous ses commentaires GitHub, sur toutes les pages disponibles. Il reconstitue la chronologie et distingue les décisions actives, les décisions remplacées, les validations, les résultats, les blocages et les éléments historiques. Un résumé, un ancien checkpoint ou le seul corps de l'issue ne remplace pas cette lecture.

Recouper ensuite les affirmations et liens importants avec le dépôt et les systèmes actuels. Si une partie de l'issue ou des commentaires est inaccessible, le signaler, chercher une méthode d'accès alternative raisonnable et ne pas prétendre avoir effectué une lecture complète. Cette lecture préparatoire ne signifie pas que chaque ancien commentaire reste une consigne active : appliquer les règles d'hygiène ci-dessous.

## 5. Création, classement et cycle de vie

- Rechercher les issues existantes avant d'en créer une ; éviter les doublons et relier les sujets réellement dépendants.
- À la création, choisir une catégorie principale et ajouter seulement les qualifications transversales justifiées.
- Pour une issue existante, vérifier que le problème est toujours présent, que les critères restent valides et que les dépendances n'ont pas changé.
- Mettre à jour le corps de l'issue lorsque l'objectif, le périmètre, les décisions, l'état, les critères ou la prochaine action changent durablement. Le corps doit rester la source actuelle de reprise.
- Utiliser les commentaires pour les transitions utiles : décision, découverte, résultat significatif, validation, incident ou changement d'état. Ne pas commenter chaque commande, tentative ou vérification.
- Fermer uniquement lorsque les critères d'acceptation sont vérifiés. Une PR fusionnée ne suffit pas si des contrôles de production ou d'autres critères restent requis.
- Réouvrir une issue clôturée si une preuve nouvelle montre que ses critères n'étaient pas satisfaits, que le défaut initial persiste ou réapparaît, ou que la décision de clôture reposait sur une hypothèse devenue fausse. Documenter la preuve et actualiser l'objectif, le périmètre et les critères ; créer une nouvelle issue si le besoin est distinct ou si le périmètre a substantiellement changé.
- Pour un doublon, relier explicitement l'issue de référence avant fermeture. Pour une issue obsolète ou sans valeur actuelle, expliquer brièvement le constat avant fermeture. Conserver les issues encore valides ; investiguer celles dont l'état est incertain.
- Ne pas fermer ou reclasser en masse sans examen individuel. Ne pas créer de labels de priorité ou d'état par défaut.

## 6. Actions réellement réservées à l'utilisateur

Cette section définit la qualification et la rédaction d'une demande d'action humaine. Elle ne donne pas à un mode le droit de traiter une issue hors de ses permissions.

### Qualifier avant de transférer

Distinguer :
- **Difficulté technique** : poursuivre le diagnostic et résoudre ; ne pas la transformer en action humaine.
- **Limitation d'un outil ou connecteur** : chercher une autre voie technique prise en charge, sûre et conforme.
- **Action personnelle indispensable** : identité, présence, session personnelle, consentement, décision ou confirmation réservée à l'utilisateur.
- **Absence de voie conforme** : établir les faits et les alternatives explorées avant de conclure.

Ne pas interrompre l'utilisateur pour une validation intermédiaire ordinaire. Isoler le travail autonome d'une étape personnelle lorsqu'ils peuvent avancer indépendamment.

### Rédiger une issue destinée à l'utilisateur

- Titre français direct commençant par **[Action humaine]** et label `action-humaine`.
- Ajouter une catégorie principale.
- Expliquer pourquoi l'intervention est indispensable, l'état exact, ce qui a déjà été vérifié et pourquoi les alternatives ne suffisent pas.
- Donner le lien direct exact vers la page ou le réglage lorsque vérifié ; sinon fournir honnêtement le lien général vérifié et le chemin précis dans l'interface.
- Décrire les étapes dans l'ordre avec les libellés exacts des menus, boutons, champs et options ; préciser les valeurs à vérifier sans inventer celles qui sont inconnues.
- Expliquer les conséquences, précautions, actions à ne pas effectuer, résultat attendu et preuve non sensible à rapporter.
- Distinguer l'action personnelle de l'utilisateur des travaux que l'agent pourra effectuer ensuite.
- Prévoir une solution de repli si le lien direct ne fonctionne pas.
- Ne jamais demander un secret, mot de passe, jeton, clé API ou donnée personnelle dans l'issue ou les commentaires.
- Réutiliser une issue déjà ouverte si elle décrit exactement la même intervention.

### Étanchéité du mode AUTONOME

En mode AUTONOME, une issue portant `action-humaine` est totalement exclue du portefeuille de lecture et d'action :

1. L'exclure de toutes les recherches et revues avec `-label:action-humaine`.
2. Ne pas lire son corps ni ses commentaires, ne pas la commenter, la modifier, la relancer, vérifier son état ou retirer son label.
3. Ne pas en parler dans les réponses ou checkpoints et ne jamais attendre une réponse, y compris dans le compte rendu de la session où l'issue vient d'être créée.
4. Ne pas simuler l'action, contourner une protection ou effectuer une opération qui exige l'identité, le consentement, l'accès ou la sauvegarde manquants.
5. Abandonner le chantier dépendant et poursuivre un travail autonome indépendant. Aucune fermeture, modification de label ou supposition que l'action a été effectuée ne déclenche une reprise.
6. La reprise n'a lieu qu'après réintroduction explicite du sujet par l'utilisateur hors du mode AUTONOME, ou décision consignée par lui dans un document canonique. À ce moment, traiter la conclusion communiquée comme un nouveau contexte et revalider les faits utiles.

Les modes COLLABORATIF et PILOTAGE appliquent leurs propres permissions décrites dans `AGENTS.md`. PILOTAGE peut qualifier et documenter une demande d'action humaine ; il ne réalise pas l'action personnelle à la place de l'utilisateur.

## 7. Hygiène des commentaires GitHub

Les commentaires sont un historique, pas le seul emplacement du contexte actif.

- Consolider dans le corps de l'issue les décisions actives, résultats, risques, dépendances et prochaine action avant de neutraliser un commentaire devenu obsolète.
- Modifier un commentaire obsolète lorsque le mode actif et les permissions GitHub l'autorisent. En mode COLLABORATIF, obtenir l'accord requis pour cette modification ; PILOTAGE peut gérer les commentaires dans son mandat ; AUTONOME peut agir dans le périmètre du mandat.
- Si la suppression n'est pas disponible, remplacer le commentaire par un marqueur court et explicite, par exemple : `[À supprimer — checkpoint obsolète, informations consolidées dans le corps de l'issue]`.
- Ne pas neutraliser les décisions motivées, validations, résultats de tests, preuves, incidents, informations de sécurité, interventions humaines ou éléments nécessaires à l'audit.
- Ne pas réécrire l'historique pour donner une impression artificielle de propreté. Préserver les informations utiles et indiquer où elles ont été consolidées.
- Ne pas commenter chaque tentative, contrôle ou session ; un commentaire doit apporter un fait nouveau, une décision, un résultat ou un risque utile.

## 8. Références et cohérence

- [AGENTS.md](../AGENTS.md) : sélection du mode et permissions.
- [Mandat autonome](MANDAT-AUTONOME.md) : autonomie, priorités, exclusions et livraison.
- [Dependabot](../.github/dependabot.yml) : labels et cadence des mises à jour.
- Les documents spécialisés du dépôt peuvent préciser un domaine, mais ne doivent pas contredire cette taxonomie ni le cycle de vie des issues.

Lorsqu'une règle de classification, de cycle de vie ou d'hygiène change, mettre à jour ce document en premier, puis corriger ses références. Ne pas recopier la taxonomie dans les documents de mode.
