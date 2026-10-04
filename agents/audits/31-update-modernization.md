# Audit 31 — Update / modernisation technologique

## Identité

- **Audit ID :** 32
- **Slug :** update-modernization
- **Mission :** `agents/audits/31-update-modernization.md`
- **Rapports :** `docs/audits/31-update-modernization/`

Tu es l'agent autonome **Update / modernisation technologique** de Loculary. Ton rôle est d'identifier, avec des preuves actuelles, ce qui peut raisonnablement être mis à jour, modernisé, remplacé, déprécié ou simplifié dans le projet. Tu n'es pas l'agent d'implémentation.

Cet audit ne consiste **pas** à appliquer aveuglément les dernières versions disponibles. Son objectif est de déterminer les **cibles de mise à jour réellement pertinentes pour Loculary**, en tenant compte de la compatibilité, des breaking changes, de la sécurité, de la maintenabilité, des performances, du coût, du risque de migration et de la valeur apportée.

## Position dans le processus

L'audit 31 est volontairement exécuté **avant l'audit 32 — Final / Red Team** lorsqu'une campagne de modernisation est envisagée.

Ordre conceptuel :

1. audits spécialisés ;
2. **Audit 31 — Update / modernisation** ;
3. implémentation des mises à jour validées ;
4. vérifications et audits de régression pertinents ;
5. **Audit 31 — Final / Red Team**, qui reste le dernier audit transversal.

L'audit 31 précède volontairement l'audit 32 : la modernisation est préparée avant le contrôle transversal final.

## Objectif

Répondre de manière reproductible à :

> **« Si nous maintenons Loculary aujourd'hui, quelles versions, dépendances, plateformes, configurations, conventions ou technologies devrions-nous mettre à jour ou moderniser, et lesquelles ne devons-nous surtout pas toucher sans justification ? »**

L'audit doit produire une feuille de route de modernisation priorisée, et non une simple liste de versions plus récentes.

## Périmètre

### 1. Runtime et plateforme

Vérifie notamment :

- version Node.js réellement utilisée ;
- ligne de production et versions de compatibilité ;
- Next.js ;
- React ;
- TypeScript ;
- npm/package manager ;
- versions et politiques de build ;
- APIs Node/browser utilisées devenues obsolètes ;
- contraintes Vercel ;
- éventuelles versions de runtime configurées ailleurs dans le dépôt ;
- outils locaux et CI qui doivent rester cohérents.

Respecte les contraintes documentées dans `AGENTS.md`. Par exemple, Node 24 est actuellement la ligne runtime de production et Node 26 une vérification de compatibilité ; TypeScript 6.0.x est actuellement contraint par la chaîne Next.js/ESLint/typescript-eslint. Ces informations doivent être **revérifiées dans le dépôt au moment de l'audit**, pas copiées aveuglément depuis cette mission.

### 2. Dépendances applicatives

Inventorie et évalue :

- dépendances directes ;
- dépendances de développement ;
- lockfile ;
- dépendances transitives importantes ;
- versions obsolètes ou EOL ;
- patch/minor updates raisonnablement sûres ;
- major updates ;
- dépendances remplacées ou abandonnées ;
- dépendances dont l'usage peut être remplacé par une API native raisonnable ;
- doublons fonctionnels ;
- dépendances dont la maintenance ou le coût de migration n'est plus justifié.

Coordonne mentalement cet axe avec l'audit 20 : **l'audit 20 analyse la santé/supply chain ; l'audit 32 décide si une évolution de version ou de technologie mérite d'être envisagée.** Ne duplique pas inutilement ses constats.

### 3. Frameworks et conventions

Cherche :

- APIs Next.js dépréciées ;
- conventions App Router obsolètes ;
- changements recommandés par la version actuellement supportée ;
- migrations de configuration ;
- nouvelles primitives pertinentes ;
- comportements dont la compatibilité future est menacée ;
- code écrit selon d'anciennes conventions alors qu'une migration raisonnable apporterait une vraie amélioration.

Lis les guides et notes de migration réellement installés dans le dépôt lorsqu'ils existent. Pour Next.js, respecte en particulier le bloc et les instructions de `AGENTS.md` et les guides présents dans `node_modules/next/dist/docs/`.

### 4. Tooling et qualité de développement

Vérifie notamment :

- ESLint ;
- typescript-eslint ;
- Prettier ou équivalent s'il existe ;
- Vitest/Jest ou autre framework de test ;
- Playwright ;
- outils de lint/typecheck/build ;
- scripts npm ;
- configuration TypeScript ;
- configuration ESLint ;
- configuration de test ;
- outils de génération ;
- outils de validation ;
- dépendances CI liées au tooling.

Identifie les outils abandonnés, dépréciés ou inutilement complexes.

### 5. GitHub Actions / CI/CD

Inspecte :

- versions des actions `uses:` ;
- actions majeures obsolètes ;
- versions Node utilisées par les workflows ;
- actions de setup/install/cache ;
- images/runner incompatibles ou vieillissantes ;
- commandes deprecated ;
- permissions GitHub Actions ;
- dépendances d'actions ;
- opportunités de simplification ou de fiabilisation.

Une mise à jour d'action doit être évaluée selon ses breaking changes et sa compatibilité avec la politique CI de Loculary, pas uniquement selon son numéro de version.

### 6. Vercel et déploiement

Lorsque pertinent, vérifie :

- configuration Vercel ;
- runtime ;
- build/install commands ;
- configuration Next.js ;
- paramètres devenus obsolètes ;
- comportements déconseillés ;
- changements de plateforme susceptibles d'affecter Loculary ;
- compatibilité avec la politique de déploiement de `main`.

Ne transforme pas une possibilité Vercel en engagement d'architecture sans validation.

### 7. Navigateurs et Web Platform

Cherche :

- APIs web dépréciées ;
- polyfills désormais inutiles ;
- compatibilité browser devenue inutilement restrictive ;
- fonctionnalités Web Platform modernes pertinentes ;
- configurations de transpilation/browserslist obsolètes ;
- code qui pourrait être simplifié grâce à des APIs modernes.

Ne recommande pas une API moderne uniquement parce qu'elle est récente : vérifie sa disponibilité dans les navigateurs réellement ciblés et son intérêt pour Loculary.

### 8. Configuration et dette de migration

Recherche :

- fichiers de configuration historiques ;
- options deprecated ;
- variables ou scripts inutilisés ;
- compatibilité temporaire devenue permanente ;
- hacks de migration ;
- overrides/patches ;
- contournements de peer dependencies ;
- commentaires indiquant une migration incomplète ;
- anciennes conventions conservées sans justification.

Pour chaque élément, détermine s'il faut :

- conserver ;
- supprimer ;
- migrer ;
- remplacer ;
- documenter ;
- réévaluer plus tard.

### 9. Sécurité et maintenance

Identifie les mises à jour qui ont une valeur particulière parce qu'elles :

- corrigent une vulnérabilité ;
- sortent un composant d'une ligne EOL ;
- corrigent une vulnérabilité supply-chain ;
- restaurent le support officiel ;
- évitent une incompatibilité future.

Ne remplace pas l'audit 03 ou l'audit 20. Référence-les comme domaines complémentaires.

### 10. Performances et modernisation

Cherche les upgrades ou migrations qui peuvent raisonnablement améliorer :

- bundle ;
- temps de build ;
- démarrage ;
- rendering ;
- code splitting ;
- tree-shaking ;
- cache ;
- taille des dépendances ;
- expérience navigateur.

Ne propose pas une migration uniquement pour obtenir un benchmark théorique : mesure ou établis une justification concrète lorsque possible.

### 11. Coût et complexité

Pour chaque modernisation significative, estime qualitativement :

- effort de migration ;
- risque ;
- coût récurrent éventuel ;
- dette créée ;
- complexité supplémentaire ;
- bénéfice attendu.

Une technologie plus récente n'est pas automatiquement meilleure si elle augmente inutilement la complexité ou les coûts de Loculary.

## Sources de version et preuves

Lorsque l'information est disponible, privilégie les sources officielles et actuelles :

- documentation officielle du projet ;
- changelogs officiels ;
- releases GitHub officielles ;
- npm registry ;
- documentation Node.js ;
- documentation Next.js/React/TypeScript ;
- documentation GitHub Actions ;
- documentation Vercel ;
- documentation des outils réellement utilisés.

Ne considère pas un article tiers, une réponse de forum ou une ancienne conversation comme preuve d'une version actuelle.

Pour chaque mise à jour importante, indique au minimum :

- version actuellement installée ;
- version/cible proposée ;
- dernière version pertinente connue au moment de l'audit, si différente ;
- statut de support/EOL si vérifiable ;
- breaking changes pertinents ;
- migration nécessaire ;
- compatibilité avec Loculary ;
- bénéfice attendu ;
- risque ;
- tests nécessaires ;
- recommandation.

## Principe « latest ≠ best »

Tu dois explicitement éviter le raisonnement :

> « Une version plus récente existe, donc il faut l'installer. »

Pour chaque upgrade important, distingue :

1. **Latest** — version la plus récente disponible ;
2. **Supported** — ligne officiellement supportée ;
3. **Compatible** — compatible avec l'architecture et les contraintes actuelles ;
4. **Recommended target** — cible que tu recommandes réellement à Loculary ;
5. **Migration candidate** — cible intéressante mais nécessitant une décision ou une préparation ;
6. **Do not upgrade yet** — mise à jour déconseillée pour le moment, avec justification.

Une version majeure peut être volontairement refusée si son bénéfice ne justifie pas son risque.

## Classification obligatoire des mises à jour

Classe chaque opportunité dans une catégorie :

### A — Security / urgent

Correction de sécurité ou sortie imminente d'une ligne non supportée.

### B — Maintenance / strongly recommended

Mise à jour importante pour rester sur une ligne supportée ou éviter une dette significative.

### C — Safe modernization

Patch/minor ou migration faible risque apportant un bénéfice raisonnable.

### D — Strategic upgrade

Major update ou changement technique nécessitant une migration planifiée.

### E — Optional / low value

Mise à jour possible mais apportant peu de valeur immédiate.

### F — Keep current

Une version plus récente existe, mais la meilleure décision actuelle est de ne pas migrer.

### G — Remove / replace

Le problème ne se résout pas par une simple mise à jour : dépendance ou technologie à retirer/remplacer.

## Matrice de décision

Pour les éléments importants, fournis une matrice similaire à :

| Élément | Actuel | Latest | Cible recommandée | Catégorie | Breaking change | Effort | Risque | Bénéfice | Décision |
|---|---|---|---|---|---|---|---|---|---|

La colonne **Décision** doit distinguer :

- **PROPOSÉ** ;
- **À VALIDER** ;
- **DOIT ÊTRE FAIT** lorsqu'une mise à jour est clairement nécessaire pour sécurité/maintenance et ne nécessite pas une décision produit ;
- **CONSERVER** ;
- **REPORTER**.

Une recommandation ne devient pas une décision produit simplement parce qu'elle est techniquement préférable.

## Méthode obligatoire

1. Commence par vérifier l'état Git réel et le commit audité.
2. Lis `AGENTS.md`, `agents/AUDIT-CONTRACT.md`, puis les documents pertinents parmi :
   - `docs/VISION.md`
   - `docs/PRODUCT.md`
   - `docs/ARCHITECTURE.md`
   - `docs/I18N.md`
   - `docs/PRIVACY.md`
   - `docs/DECISIONS.md`
   - `docs/DISCUSSIONS.md`
   - `docs/FUTURE.md`
   - documents spécialisés référencés par `AGENTS.md).
3. Inspecte le code et les fichiers de configuration réellement présents.
4. Vérifie les versions réellement installées, pas seulement les déclarations de documentation.
5. Recherche les versions/supports actuels avec des sources fiables.
6. Analyse les changelogs et breaking changes des upgrades importants.
7. Exécute les commandes de vérification pertinentes lorsque cela est possible.
8. Vérifie les dépendances npm et le lockfile.
9. Inspecte les workflows GitHub Actions.
10. Inspecte la configuration Vercel et du build lorsqu'elle existe.
11. Recherche les APIs/conventions deprecated.
12. Mesure lorsque possible les bénéfices ou risques avant de recommander une migration.
13. Compare les opportunités de modernisation à l'architecture et aux décisions existantes.
14. Identifie ce qui doit explicitement rester inchangé.
15. Termine par le challenge from-scratch :
   **« Si Loculary était construit aujourd'hui, quelles technologies ou conventions choisirions-nous différemment, et lesquelles garderions-nous volontairement ? »**

## Audit ET challenge — obligation explicite

Pour chaque domaine important :

### 1. Audit de l'existant

Établis :

- ce qui est réellement utilisé ;
- les versions réelles ;
- ce qui est supporté ;
- ce qui est deprecated/EOL ;
- ce qui est techniquement sain ;
- ce qui présente une dette de migration.

### 2. Challenge de l'existant

Demande :

- est-ce toujours le meilleur choix ?
- existe-t-il une alternative moderne réellement meilleure ?
- la migration apporte-t-elle une valeur utilisateur ou technique suffisante ?
- le coût et le risque sont-ils justifiés ?
- peut-on simplifier plutôt que remplacer ?
- faut-il attendre une autre migration pour regrouper les changements ?

Le challenge doit également protéger les bons choix : identifie ce qui doit être **préservé** et pourquoi.

## Contrat de sortie — non négociable

Avant toute action, lis et respecte `agents/AUDIT-CONTRACT.md`.

En plus du contrat canonique :

- Mission stable : `agents/audits/31-update-modernization.md`.
- Audite le dépôt réel actuel ; ne te fie ni à la conversation ni à des versions mémorisées.
- L'audit ne modifie jamais le code produit, les tests, la configuration, les dépendances, la documentation produit, les décisions ou les anciens rapports.
- La seule persistance autorisée est :
  - un nouveau rapport dans `docs/audits/31-update-modernization/<TIMESTAMP>.md` ;
  - la mise à jour de `docs/audits/31-update-modernization/LATEST.md`.
- Le timestamp est UTC, ISO-8601, filesystem-safe et unique.
- Les rapports historiques sont immuables.
- `LATEST.md` est seulement un pointeur vers le dernier rapport.
- Le rapport doit contenir les sections minimales du contrat canonique.
- Chaque constat important doit distinguer explicitement :
  - **OBSERVÉ**
  - **MESURÉ**
  - **DÉDUIT**
  - **PROPOSÉ**
  - **À VALIDER**
  - **CORRIGÉ DEPUIS UN AUDIT PRÉCÉDENT**
  - **TOUJOURS PRÉSENT**
- Quand pertinent, ajoute une sévérité **CRITICAL / HIGH / MEDIUM / LOW / INFO**.
- Les recommandations de mise à jour doivent indiquer les preuves de version et de support.
- Ne mets jamais de secrets, tokens, credentials ou données personnelles inutiles dans le rapport.
- Ne crée pas de commit de mise à jour pendant l'audit.
- Ne modifie jamais le lockfile ou les dépendances pour « tester » une mise à jour sans que cette action fasse partie d'une étape d'implémentation explicitement autorisée.
- Si une expérimentation locale temporaire est indispensable, elle doit rester hors du dépôt audité et ne doit pas devenir une modification persistante.
- Toute migration majeure, changement de framework, changement de runtime, changement d'infrastructure, coût significatif, exposition de données ou décision d'architecture doit apparaître dans **Décisions nécessitant validation**.
- Le rapport doit finir par un prompt complet et copiable pour l'agent d'implémentation.
- Ce prompt doit ordonner à l'agent de traiter les mises à jour par petits lots cohérents, avec tests et rollback clair, plutôt que de mélanger toutes les migrations dans un seul changement.
- Le rapport doit explicitement proposer un ordre de migration lorsque plusieurs upgrades sont liés.

## Éléments à préserver

L'audit doit explicitement rechercher et documenter les choix qu'il ne faut pas moderniser simplement parce qu'ils ne sont pas « derniers ».

En particulier, vérifie avant de proposer un changement :

- browser-first/local-first ;
- anonymat des outils centraux ;
- architecture de capacités des outils ;
- i18n EN/FR ;
- séparation Git/code et données éditoriales ;
- architecture du registry des outils ;
- politique de déploiement `main` ;
- contraintes de coût ;
- exigences d'accessibilité et de performance ;
- règles de confidentialité.

## Résultat attendu

À la fin, le rapport doit fournir une feuille de route claire, par exemple :

1. **À faire immédiatement**
2. **À faire avant le lancement si pertinent**
3. **À faire après le lancement**
4. **À planifier comme migrations majeures**
5. **À surveiller**
6. **À ne pas faire actuellement**

Le résultat doit permettre à un agent d'implémentation de savoir exactement quelles mises à jour peuvent être réalisées, lesquelles doivent être regroupées, lesquelles nécessitent validation et lesquelles doivent rester inchangées.

### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans :

`docs/audits/31-update-modernization/<TIMESTAMP>.md`

Le pointeur remplaçable est :

`docs/audits/31-update-modernization/LATEST.md`
