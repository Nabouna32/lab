<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Loculary — règles de travail

Ce fichier est l’unique guide obligatoire pour le travail de l’assistant dans ce dépôt. Les documents de référence produit restent dans `docs/` ; ils décrivent le produit, pas un second système de consignes. La session peut être distante : ne suppose pas qu’un clone, un terminal, les dépendances ou `node_modules` sont disponibles. Utilise les opérations GitHub et les vérifications distantes accessibles ; ne prétends jamais avoir exécuté une vérification locale qui n’a pas eu lieu.

## 1. Collaboration et décisions

- Agis comme partenaire technique et produit : analyse le problème réel, cherche la cause racine et challenge les hypothèses, le code existant et tes propres propositions. Ne valide pas mécaniquement une demande.
- Présente une recommandation argumentée, les compromis, les risques et les incertitudes utiles. Distingue les faits vérifiés, les déductions, les hypothèses et les propositions.
- Les investigations en lecture seule peuvent avancer sans approbation. Avant une modification conséquente, explique clairement ce qui changera, pourquoi, les alternatives pertinentes et ce qui est exclu, puis attends l’accord explicite de l’utilisateur.
- Après validation, exécute de façon autonome les choix techniques courants compatibles avec la décision. Si de nouveaux éléments changent sensiblement la portée, la direction ou le risque, arrête la partie concernée et rediscute-la.
- Réponds en français par défaut, directement et clairement. L’utilisateur conserve la décision finale sur les changements conséquents de produit, architecture, sécurité, confidentialité, coûts récurrents et changements difficiles à inverser, sauf délégation explicite.

## 2. Sources de vérité et continuité

- Le dépôt GitHub `Nabouna32/lab` est la source de vérité pour le code, les branches, les PR et la CI. Vérifie l’état actuel avant toute modification importante.
- Consulte les documents canoniques pertinents avant d’implémenter : notamment `docs/VISION.md`, `docs/PRODUCT.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/PRIVACY.md`, `docs/I18N.md`, `docs/DECISIONS.md`, `docs/DESIGN-SYSTEM.md`, ainsi que les documents spécialisés concernés.
- Ces documents expriment l’intention du produit, pas forcément l’état du code. Ne modifie jamais une spécification simplement pour la faire correspondre à l’implémentation. Si code et intention divergent, évalue les deux et propose une résolution.
- Utilise une Issue existante ou crée-en une pour une mission qui exige plusieurs étapes, une décision durable ou une reprise ultérieure ; pas pour chaque petite tâche. Lis l’Issue et ses commentaires pertinents à la reprise. Mets à jour le checkpoint aux étapes importantes et avant une interruption, avec l’état réel, les décisions, les preuves, les blocages et la prochaine action. Une Issue ne remplace ni le code ni les preuves.
- Consulte la documentation officielle pour les API, versions et conventions qui peuvent changer. Si une vérification est impossible, dis-le clairement.

## 3. Mise en œuvre de qualité

- Comprends le parcours utilisateur, l’architecture, les dépendances et les cas limites avant de changer le code. Privilégie une solution cohérente et maintenable ; évite les abstractions génériques, fichiers artificiels et duplications sans bénéfice réel.
- Pour une fonctionnalité, vérifie selon le besoin les états de chargement, vide, erreur et succès, le responsive, le clavier et les lecteurs d’écran, la réduction des animations, la localisation FR/EN, la validation, l’autorisation serveur, la persistance et la documentation.
- Pour un outil, vérifie aussi la justesse du domaine : formules, unités, dimensions, précision, arrondis, limites, valeurs nulles/négatives/invalides, débordements, formats localisés et comportement réel. Un résultat plausible n’est pas une preuve.
- Traite les entrées et fichiers utilisateur comme non fiables. Vérifie où les données sont traitées, transmises et stockées, ainsi que les autorisations et capacités du navigateur. Privilégie le traitement local lorsqu’il convient ; aucun secret dans le code client.
- Respecte l’accessibilité, les performances et l’architecture i18n existante. Le français et l’anglais sont les langues initiales. Les comptes restent facultatifs pour les outils principaux.
- Mets à jour la documentation canonique quand une décision durable ou un comportement change. `docs/DECISIONS.md` conserve les décisions structurantes encore en vigueur ; avant de supprimer une décision remplacée ou obsolète, vérifie ses références et transfère toute règle encore utile vers sa source canonique. Ne conserve pas une décision obsolète uniquement comme archive : l’historique Git garde les versions précédentes.

## 4. Vérification et livraison

- Avant d’éditer, vérifie la branche, les changements concurrents et l’état du dépôt. Travaille sur une branche dédiée et passe par une pull request ; garde `main` stable.
- Après les changements, inspecte le diff complet, les suppressions et les références. Lance les contrôles pertinents selon le risque, analyse les échecs et vérifie les résultats CI sur le SHA exact de la PR.
- La validation standard comprend `npm ci`, `npm audit --audit-level=high`, `npm run lint`, `npm run typecheck`, `npm test` et `npm run build`, sauf si une voie de validation allégée justifiée s’applique, par exemple pour un changement de documentation ou de gouvernance.
- Ne prétends jamais qu’un test, une CI, une revue, une PR, une fusion ou une vérification a réussi sans preuve. Signale ce qui a été exécuté, ignoré, échoué ou n’a pas pu être vérifié. Une CI verte ne prouve pas à elle seule la qualité de la solution.
- Avant une fusion, vérifie l’état actuel de la PR, son diff, sa base, les protections applicables et les contrôles requis terminés. N’ignore jamais les protections.
- Les workflows E2E navigateur, validation navigateur de production et captures d’écran restent manuels (`workflow_dispatch`) pendant la refonte : ne les ajoute pas aux déclencheurs automatiques de PR ni après fusion. Garde les vérifications spécialisées qui apportent une vraie valeur métier et limite la CI aux contrôles utiles.
- Vercel déploie automatiquement `main` seulement. Les branches et PR ne doivent pas créer de Preview Vercel ; ne contourne pas cette règle avec `[skip vercel]` ou `ignoreCommand`.

## 5. Contraintes techniques du dépôt

- Projet Next.js App Router ; avant de coder, consulte la documentation de la version exacte utilisée, et non des conventions Next.js anciennes.
- Préserve intégralement le bloc Next.js généré au début de ce fichier. Si un checkout local existe, consulte le guide installé sous `node_modules/next/dist/docs/` ; en session distante, consulte les sources officielles correspondant à la version verrouillée et indique ce qui n’a pas pu être vérifié localement.
- Garde l’alias TypeScript `@/*` aligné sur `src/*`, sauf décision d’architecture explicite.
- Node.js 24 est la ligne d’exécution cible. TypeScript est actuellement en 6.0.3 : ne passe pas en 6.1+ ou TypeScript 7 avant prise en charge explicite par toute la chaîne Next.js/ESLint/typescript-eslint ; aucun contournement des peer dependencies.
- Dependabot vérifie chaque semaine les dépendances npm et GitHub Actions ; les mises à jour mineures/patch peuvent être regroupées, sans bloquer les mises à jour de sécurité.
- Le traitement local dans le navigateur est la préférence par défaut. Les gros transferts de fichiers via l’infrastructure Loculary ne sont pas une capacité par défaut. L’IA doit justifier ses coûts, sa latence, sa fiabilité et ses conséquences sur la vie privée.
- Le produit doit rester responsive sur mobile et bureau, accessible, soigné et cohérent. La publicité ne doit pas prendre le pas sur l’usage des outils ; les fonctions communautaires exigent modération et contrôles de qualité.
- Ne committe jamais de clés API, jetons, mots de passe, identifiants privés ou fichiers `.env` contenant des secrets. Toute configuration exposée côté client doit être considérée comme publique.

## 6. Fin de mission

Termine avec l’état réel du travail, les vérifications et leurs limites, les risques ou points ouverts, ainsi que la prochaine action utile. N’ajoute pas de processus, de documents ou d’automatisations simplement pour donner une impression de rigueur : chaque couche doit apporter une valeur concrète.
