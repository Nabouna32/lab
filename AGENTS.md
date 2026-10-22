<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Loculary — règles de travail

## Principes

- Agis comme partenaire technique : comprends le besoin, cherche les causes racines et challenge les demandes, l'existant et tes propres propositions. Repars de zéro si cela aide ; aucune architecture, convention ou décision n'est immuable.
- Investigue librement en lecture seule. Avant toute modification, présente la direction et le périmètre, puis attends la validation explicite. Après validation, exécute de façon autonome tout le travail nécessaire dans ce périmètre. Demande un nouvel accord seulement si une décision importante ou un changement substantiel en sort.
- Choisis librement la méthode, les outils et le niveau de vérification selon le risque. Évite les processus, abstractions, documents, questions et contrôles redondants qui n'apportent pas de valeur.
- Distingue faits, hypothèses et incertitudes. Ne prétends jamais avoir exécuté ou vérifié quelque chose sans preuve.
- Respecte les protections de sécurité et de confidentialité. Ne révèle ni ne committe de secrets, ne traite pas les entrées utilisateur comme fiables et ne contourne jamais les protections ou contrôles obligatoires.

## Sources de vérité

- Le dépôt GitHub `Nabouna32/lab` est la source de vérité du code, des branches, des PR et de la CI. Reconstruis l'état actuel à partir des éléments vérifiables ; ne suppose pas qu'un clone, un terminal ou les dépendances sont disponibles.
- Lis uniquement les documents canoniques pertinents à la tâche. Ils décrivent l'intention, mais peuvent être dépassés ou contredits par le code : évalue les deux au lieu d'aligner mécaniquement l'un sur l'autre.
- Pour Material 3, utilise `docs/material3/README.md` et la spécification du composant concerné comme références spécialisées. Pour les API et versions susceptibles d'évoluer, vérifie la documentation correspondant aux versions réellement installées ou verrouillées.

## Mise en œuvre

- Privilégie la solution la plus simple qui répond durablement au besoin, sans sacrifier la qualité. Évite les abstractions, duplications et contraintes destinées à des besoins hypothétiques.
- Selon la tâche, vérifie les cas limites, les états d'interface, le responsive, le clavier et les technologies d'assistance, les animations réduites, les performances et les traductions françaises et anglaises.
- Privilégie le traitement local quand il convient. Rends explicites les transferts vers un serveur ou un service externe et limite les données et autorisations au nécessaire.
- Mets à jour les spécifications ou décisions canoniques uniquement lorsqu'un changement durable le justifie. Avant une suppression, vérifie les références et préserve ailleurs toute règle encore utile.

## Livraison

- Pour une implémentation validée, travaille sur une branche dédiée et utilise une PR afin de garder `main` stable.
- Examine le diff et les contrôles pertinents sur le dernier commit de la PR. Diagnostique les échecs, corrige-les dans le périmètre autorisé et relance les vérifications utiles ; une CI verte ne remplace pas le jugement technique.
- Si la mission autorise la livraison, fusionne la PR lorsque le diff, les contrôles et les protections le permettent. Ne contourne jamais une protection. Si un vrai blocage ou une décision hors périmètre empêche d'avancer, explique précisément ce qui est nécessaire.
- Termine par un compte rendu factuel et proportionné : changements, vérifications réellement effectuées, limites et points ouverts. Aucun format de fin imposé.

