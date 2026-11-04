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

### Contrat commun de lecture avant intervention

Cette règle s'applique aux trois modes et à toute opération sur une issue : consulter pour agir, qualifier, classer, relier, commenter, modifier ou clôturer. Avant toute intervention, lire le titre, le corps intégral et tous les commentaires, toutes pages disponibles. Reconstituer la chronologie et distinguer consignes actives, décisions remplacées, validations, résultats, blocages et éléments historiques ; vérifier les faits importants dans le dépôt et les sources pertinentes. Si une partie est inaccessible, chercher une autre méthode d'accès raisonnable, signaler la limite et ne pas prétendre avoir effectué une lecture complète. Les anciens commentaires ne deviennent pas automatiquement des consignes actives.

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
| `action-humaine` | Intervention, décision ou confirmation qui doit réellement être effectuée par l'utilisateur ou une personne humaine habilitée, parce que ChatGPT ne peut pas la réaliser avec les outils et accès disponibles. Réservé aux issues explicitement destinées à l'humain qui doit agir. |

Une issue `action-humaine` conserve aussi une catégorie principale et son titre commence par **[Action humaine]**. Ne jamais utiliser ce label pour signaler une difficulté technique, une tâche lente, un outil limité ou une investigation incomplète.

### Labels Dependabot

Conserver exactement les identifiants configurés dans [`.github/dependabot.yml`](../.github/dependabot.yml) :

- `dependencies` : mises à jour de dépendances ;
- `npm` : écosystème npm ;
- `github-actions` : actions GitHub.

Ces labels sont appliqués par Dependabot. Ne pas les renommer, les remplacer par la taxonomie de travail ou modifier leur usage sans mettre à jour la configuration. Une PR Dependabot n'est pas une issue de travail : ne pas lui imposer artificiellement un label principal de catégorie. Si une issue de suivi distincte est nécessaire, lui attribuer sa propre catégorie et, le cas échéant, `securite`.

Les couleurs des labels ne constituent pas un contrat de classification : les identifiants exacts et les règles d'attribution ci-dessus font foi. N'appliquer que des labels déjà présents dans le dépôt et définis dans ce contrat ; ne jamais inventer un identifiant ou supposer qu'un label existe. Ne pas créer de variantes synonymes ni de labels de priorité ou d'état par défaut. La priorité est réévaluée selon la valeur et le risque ; l'état est porté par GitHub, le titre et le contenu à jour de l'issue.

L'attente technique ou externe est signalée dans le **titre**, pas par un label implicite :
- `[En attente — reprise après YYYY-MM-DD HH:mm UTC]` lorsqu'une date/heure ou un déclencheur planifié connu conditionne la reprise ;
- `[En attente amont — revue le YYYY-MM-DD]` lorsqu'une évolution externe est attendue sans date de publication fiable ; la date indiquée est alors la prochaine revue, pas une promesse de disponibilité.

Ces préfixes sont des marqueurs de cycle de vie, pas des labels GitHub. Ne pas utiliser `action-humaine` pour une attente technique ou upstream. Si un label d'attente devient utile ultérieurement, il doit d'abord être créé dans le dépôt et ajouté à la taxonomie de ce document ; aucune issue ne peut l'utiliser avant ces deux étapes.

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

### Lecture préalable obligatoire dans les trois modes

Avant toute intervention sur une issue, COLLABORATIF, PILOTAGE et AUTONOME lisent son corps intégral et tous ses commentaires GitHub, sur toutes les pages disponibles. Ils reconstituent la chronologie et distinguent les décisions actives, les décisions remplacées, les validations, les résultats, les blocages et les éléments historiques. Un résumé, un ancien checkpoint ou le seul corps de l'issue ne remplace cette lecture.

Recouper ensuite les affirmations et liens importants avec le dépôt et les systèmes actuels. Si une partie de l'issue ou des commentaires est inaccessible, le signaler, chercher une méthode d'accès alternative raisonnable et ne pas prétendre avoir effectué une lecture complète. Cette lecture préparatoire ne signifie pas que chaque ancien commentaire reste une consigne active : appliquer les règles d'hygiène ci-dessous.

## 5. Création, classement et cycle de vie

- Rechercher les issues existantes avant d'en créer une ; éviter les doublons et relier les sujets réellement dépendants.

### Numérotation des chantiers dépendants

Lorsqu'un chantier est réparti sur plusieurs issues qui doivent être exécutées dans un ordre déterminé, rendre cet ordre explicite dans les **titres** et dans les **dépendances du corps**. Utiliser le format `[Lot 1/N]`, `[Lot 2/N]`, etc. (`N` étant le nombre total de lots ordonnés), placé au début du titre après un éventuel préfixe de cycle de vie. Le numéro indique l'ordre d'exécution et non une priorité générale du backlog.

- Numéroter uniquement les issues qui appartiennent réellement à une même séquence dépendante ; ne pas imposer de numérotation aux tâches indépendantes ou parallélisables.
- Donner à chaque lot un périmètre et des critères de sortie propres. Le corps de chaque issue indique le lot précédent, le lot suivant et les dépendances concrètes ; l'issue de coordination présente la séquence complète et sert de point d'entrée.
- Conserver le même dénominateur pour toute la séquence. Si une étape comporte des sous-phases qui doivent elles-mêmes être ordonnées, utiliser une lettre (`[Lot 4a/N]`, `[Lot 4b/N]`) plutôt que de créer une numérotation ambiguë ou de modifier artificiellement le nombre de lots.
- Si le périmètre ou l'ordre change, mettre à jour ensemble les titres, les liens et les sections de dépendances de toutes les issues affectées ; vérifier qu'aucun ancien numéro ou ordre contradictoire ne subsiste.
- Ne pas renuméroter les issues sans lien avec la séquence. Ne pas utiliser les numéros d'issues GitHub comme substitut à l'ordre d'exécution : les identifiants GitHub restent immuables et ne représentent pas une séquence.
- Avant de créer les issues, établir la séquence à partir des dépendances réelles ; éviter de découper artificiellement un chantier simplement pour afficher des numéros.

### Références et relations entre issues et pull requests

Lorsqu'une PR contribue à un travail suivi par une issue, elle peut référencer cette issue dans son corps. Ce lien est **facultatif** : il sert à faciliter la navigation et la continuité du suivi, mais ne conditionne ni la création, ni l'exécution, ni la fusion de la PR.

- **`Refs #123`** pour une contribution partielle, une étape intermédiaire ou une PR qui ne termine pas l'issue. Cette référence n'entraîne pas sa fermeture.
- **`Closes #123`** uniquement lorsque la PR satisfait tous les critères d'acceptation et termine l'issue. `Fixes` et `Resolves` ont également un effet de fermeture et ne doivent pas être employés pour un simple suivi.
- Pour plusieurs issues, ajouter une référence distincte par issue et choisir individuellement le mot-clé adapté. Ne pas rattacher une issue simplement parce qu'elle est proche du sujet.
- Pour un chantier substantiel, durable ou multi-étapes, créer ou réutiliser une issue si elle apporte une vraie valeur de mémoire et de coordination. Ne pas créer d'issue artificielle pour une correction ponctuelle ou une PR indépendante.

Lorsqu'une PR référence une issue, le corps de la PR est le mécanisme de suivi le plus simple ; aucune liaison supplémentaire via la section GitHub Development n'est nécessaire. Ne pas chercher à obtenir une pastille visuelle au moyen d'un mot-clé de fermeture.

Avant d'utiliser un mot-clé de fermeture, vérifier le corps actuel de l'issue, tous ses critères, les validations obligatoires et les éventuelles étapes restantes. Une PR ouverte, fusionnée ou techniquement réussie ne suffit pas si l'issue demande encore une preuve complémentaire. En cas de doute, utiliser `Refs` et conserver l'issue ouverte.

Après la fusion, vérifier l'état réel de l'issue : ne jamais présumer que GitHub l'a clôturée. Le paramètre d'auto-clôture peut être désactivé dans les réglages du dépôt ; voir la [documentation GitHub sur l'auto-clôture](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-auto-closing-issues). Si l'issue reste ouverte alors que tous ses critères sont satisfaits, la clôturer manuellement avec la raison appropriée. Si une preuve ou une étape manque, la laisser ouverte. Ne jamais annoncer une clôture automatique sans l'avoir observée.

- À la création, choisir une catégorie principale et ajouter seulement les qualifications transversales justifiées.
- Pour une issue existante, vérifier que le problème est toujours présent, que les critères restent valides et que les dépendances n'ont pas changé.
- Lorsqu'un travail doit attendre une date, un cycle planifié, une publication upstream ou un événement externe, conserver l'issue ouverte et rendre l'attente immédiatement visible dans le titre avec l'un des préfixes définis en section 3. Ne pas utiliser `[Action humaine]` ni le label `action-humaine` sauf si une intervention personnelle réelle est indispensable.
- Ajouter au corps une section **« Attente et prochaine reprise »** indiquant : la raison de l'attente, le déclencheur exact, la date/heure de la prochaine vérification (UTC lorsque pertinent), la preuve attendue et la conduite à tenir si le déclencheur ne s'est pas produit. Pour une attente upstream sans date fiable, fixer une date de revue raisonnable et la réévaluer à chaque passage.
- Une échéance de revue est un rappel de réexamen, pas une affirmation que la dépendance ou le service externe sera prêt à cette date. Ne jamais présenter un cron configuré comme une exécution prouvée.
- À la reprise, vérifier les faits et les sources actuelles, actualiser le corps et retirer le préfixe d'attente du titre dès que l'issue n'est plus en attente. Si l'attente continue, déplacer explicitement la prochaine revue et conserver la raison.
- Mettre à jour le corps de l'issue lorsque l'objectif, le périmètre, les décisions, l'état, les critères ou la prochaine action changent durablement. Le corps doit rester la source actuelle de reprise.
- Utiliser les commentaires pour les transitions utiles : décision, découverte, résultat significatif, validation, incident ou changement d'état. Ne pas commenter chaque commande, tentative ou vérification.
- Fermer uniquement lorsque les critères d'acceptation sont vérifiés. Une PR fusionnée ne suffit pas si des contrôles de production ou d'autres critères restent requis.
- Réouvrir une issue clôturée si une preuve nouvelle montre que ses critères n'étaient pas satisfaits, que le défaut initial persiste ou réapparaît, ou que la décision de clôture reposait sur une hypothèse devenue fausse. Documenter la preuve et actualiser l'objectif, le périmètre et les critères ; créer une nouvelle issue si le besoin est distinct ou si le périmètre a substantiellement changé.
- Pour un doublon, relier explicitement l'issue de référence avant fermeture. Pour une issue obsolète ou sans valeur actuelle, expliquer brièvement le constat avant fermeture. Conserver les issues encore valides ; investiguer celles dont l'état est incertain.
- Ne pas fermer ou reclasser en masse sans examen individuel. Ne pas créer de labels de priorité ou d'état par défaut.

## 6. Actions réellement réservées à l'utilisateur

Cette section s'applique aux trois modes. Ils doivent créer une issue `action-humaine` (ou réutiliser une issue décrivant exactement la même intervention) dès qu'une tâche autorisée nécessite une action, une décision ou une confirmation qu'aucun outil ou accès disponible ne permet à ChatGPT d'effectuer lui-même. Le label couvre aussi les arbitrages explicites entre options documentées ; il ne permet jamais à un mode de dépasser ses permissions.

### Qualifier avant de transférer

Distinguer :
- **Difficulté technique** : poursuivre le diagnostic et résoudre ; ne pas la transformer en action humaine.
- **Limitation d'un outil ou connecteur** : chercher une autre voie technique prise en charge, sûre et conforme.
- **Action humaine réellement nécessaire** : identité, présence ou manipulation d'un appareil, session personnelle, consentement, signature, confirmation, accès physique, opération externe ou arbitrage qui doit être effectué par l'utilisateur ou une personne habilitée et que ChatGPT ne peut pas réaliser avec les outils et accès disponibles.
- **Absence de voie conforme** : établir les faits et les alternatives explorées avant de conclure.

Avant de transférer l'action, rechercher une voie technique sûre, prise en charge et conforme. Une limitation d'outil ou de connecteur n'est pas à elle seule un motif : si une autre voie raisonnable permet à ChatGPT d'agir, l'utiliser. Lorsqu'aucune voie ne permet à ChatGPT d'effectuer l'action humaine indispensable, créer ou réutiliser l'issue et la signaler sans attendre une demande supplémentaire. Ne pas transformer une validation intermédiaire ordinaire en action humaine. Isoler l'étape humaine des travaux indépendants et les poursuivre.

### Arbitrage d'un conflit AndroidX / accessibilité

Lorsqu'un audit établit un conflit réel, reproductible et documenté entre une exigence d'accessibilité Web (WCAG/axe-core ou équivalent) et le contrat d'une source AndroidX épinglée, et qu'aucune adaptation de plateforme/sémantique ne résout le problème sans déformer ce contrat :

- préserver le port AndroidX exact ; ne modifier ni ses valeurs, ni sa typographie, ni sa géométrie, ni ses états, ni ses comportements pour faire disparaître l'écart ;
- créer une issue avec le label existant `action-humaine` (ou réutiliser une issue déjà introduite par l'utilisateur pour ce sujet) et demander une décision explicite ;
- inclure la version et le lien de la source AndroidX, le composant et le contrat concernés, le constat reproductible, le critère WCAG ou le résultat d'audit exact, les conséquences, les solutions non déformantes déjà explorées et les alternatives avec leurs compromis ;
- signaler clairement à l'utilisateur que le port reste fidèle et que l'écart de conformité demeure ouvert ;
- ne réaliser aucun ajustement du port avant l'arbitrage. La création de l'issue n'est pas une autorisation d'appliquer l'une des options.

Ne pas créer d'issue pour un avertissement hypothétique, un résultat d'outil non confirmé ou un problème qui peut être résolu par l'adaptation Web sans altérer AndroidX. Cette exception est applicable aux trois modes pour les nouveaux conflits qu'ils établissent ; elle ne donne pas le droit de reprendre d'autres issues `action-humaine` préexistantes sans que l'utilisateur introduise leur sujet.

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

En mode AUTONOME, les issues `action-humaine` préexistantes restent exclues du portefeuille de lecture et d'action :

1. Exclure les issues préexistantes de toutes les recherches et revues avec `-label:action-humaine`.
2. Ne pas lire leur corps ni leurs commentaires, ne pas les commenter, les modifier, les relancer, vérifier leur état ou retirer leur label, sauf si l'utilisateur introduit explicitement leur sujet.
3. Lorsqu'une action humaine indispensable est identifiée dans le travail courant, créer une nouvelle issue `action-humaine` (ou réutiliser une issue explicitement introduite par l'utilisateur pour cette même action), la signaler à l'utilisateur et suivre uniquement cette issue dans le cadre du travail courant. Cette règle générale inclut le cas particulier AndroidX/accessibilité décrit ci-dessus.
4. Ne pas simuler une action humaine, contourner une protection ou effectuer une opération qui exige l'identité, le consentement, l'accès ou la confirmation d'une personne.
5. Suspendre uniquement les changements qui dépendent de l'action ou de l'arbitrage humain ; poursuivre les travaux indépendants.
6. La création de l'issue ne vaut pas décision ni exécution de l'action. Reprendre les changements dépendants uniquement lorsque l'action ou l'arbitrage attendu a été confirmé, dans le respect du mode actif.

Les trois modes doivent signaler par une issue `action-humaine` toute intervention humaine réellement indispensable qu'ils ne peuvent pas effectuer eux-mêmes. Pour le cas particulier d'un conflit AndroidX/accessibilité réel, reproductible et impossible à résoudre sans déformer la source, préserver le port fidèle, documenter la source, les preuves, les conséquences et les alternatives, puis attendre l'arbitrage explicite avant tout changement du port. Ne pas créer d'issue pour un avertissement isolé ou hypothétique.

## 7. Hygiène des commentaires GitHub

Les commentaires sont un historique, pas le seul emplacement du contexte actif.

- Consolider dans le corps de l'issue les décisions actives, résultats, risques, dépendances et prochaine action avant de neutraliser un commentaire devenu obsolète.
- Modifier un commentaire obsolète lorsque le mode actif et les permissions GitHub l'autorisent. En mode COLLABORATIF, obtenir l'accord requis pour cette modification ; PILOTAGE peut gérer les commentaires dans son mandat ; AUTONOME peut agir dans le périmètre du mandat.
- Si la suppression n'est pas disponible, remplacer le commentaire par un marqueur court et explicite, par exemple : `[À supprimer — checkpoint obsolète, informations consolidées dans le corps de l'issue]`.
- Ne pas neutraliser les décisions motivées, validations, résultats de tests, preuves, incidents, informations de sécurité, interventions humaines ou éléments nécessaires à l'audit.
- Ne pas réécrire l'historique pour donner une impression artificielle de propreté. Préserver les informations utiles et indiquer où elles ont été consolidées.
- Ne pas commenter chaque tentative, contrôle ou session ; un commentaire doit apporter un fait nouveau, une décision, un résultat ou un risque utile.

### Synthèse de clôture proportionnée

Le corps de l'issue reste la source de son état opérationnel courant. Pour un chantier significatif — notamment plusieurs étapes, une PR, des contrôles CI, une décision d'architecture, une opération externe ou un risque résiduel — produire une synthèse finale utile dans le corps mis à jour et/ou dans un commentaire final daté, selon l'emplacement qui évite le mieux la duplication.

Lorsque la synthèse est nécessaire, elle couvre selon le contexte :
- le travail réellement réalisé et le résultat livré ;
- les décisions prises et les écarts significatifs par rapport au plan ;
- les critères satisfaits, non satisfaits ou explicitement écartés ;
- les vérifications réellement exécutées et leurs résultats, avec les liens vers les preuves ;
- les contrôles non exécutés, les limites de couverture et les éléments non vérifiés ;
- les risques résiduels, l'état final et les suites distinctes éventuelles.

Le commentaire final apporte une synthèse datée et des preuves d'audit que le corps ne porte pas déjà ; ne pas recopier mécaniquement le corps. Si le corps mis à jour contient déjà l'état final et toutes les preuves utiles, aucun commentaire supplémentaire n'est requis. Pour une correction triviale, une clôture administrative ou une petite tâche sans décision ni contrôle significatif, ne pas produire de commentaire final artificiel. Ne jamais présenter un contrôle non exécuté comme réussi.

## 8. Références et cohérence

### Référencement facultatif des PR vers les issues

Une PR peut référencer une issue lorsqu'un suivi explicite apporte une valeur réelle. **Aucune PR n'est obligée d'être liée à une issue** : l'absence de référence n'est ni une erreur de gouvernance, ni un motif de blocage ou de refus de fusion.

Lorsqu'un lien est utile :
- utiliser `Refs #123` pour une contribution partielle ou une étape intermédiaire ;
- utiliser `Closes #123`, `Fixes #123` ou `Resolves #123` uniquement lorsque tous les critères de l'issue sont satisfaits et que sa clôture est réellement souhaitée ;
- ne pas lier une issue simplement parce qu'elle est proche du sujet ;
- vérifier après fusion l'état réel d'une issue dont la PR demandait la clôture.

Le template de PR n'impose aucune section « Issues liées ». Ajouter une référence librement dans le corps lorsque cela aide les personnes qui suivent le travail. Les issues restent une mémoire partagée utile, pas un prérequis administratif à chaque changement.

- [AGENTS.md](../AGENTS.md) : sélection du mode et permissions.
- [Mandat collaboratif](MANDAT-COLLABORATIF.md) : partenariat technique, validation préalable et exécution dans le périmètre approuvé.
- [Mandat pilotage](MANDAT-PILOTAGE.md) : audit, arbitrage, gestion du backlog et transfert vers AUTONOME.
- [Mandat autonome](MANDAT-AUTONOME.md) : autonomie, priorités, exclusions et livraison.
- [Dependabot](../.github/dependabot.yml) : labels et cadence des mises à jour.
- Les documents spécialisés du dépôt peuvent préciser un domaine, mais ne doivent pas contredire cette taxonomie ni le cycle de vie des issues.

Lorsqu'une règle de classification, de cycle de vie ou d'hygiène change, mettre à jour ce document en premier, puis corriger ses références. Ne pas recopier la taxonomie dans les documents de mode.
