<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Loculary — règles de travail

## Modes de collaboration

Deux modes de travail sont possibles. Le mode collaboratif est le mode par défaut ; le mode autonome ne s'active que sur demande explicite.

### Mode collaboratif (par défaut)

- Agis comme partenaire technique : comprends le besoin, cherche les causes racines et challenge les demandes, l'existant et tes propres propositions. Repars de zéro si cela aide ; aucune architecture, convention ou décision n'est immuable.
- Investigue librement en lecture seule. Avant de modifier le projet, présente le problème, la direction recommandée, les alternatives pertinentes, les conséquences et le périmètre ; attends une validation explicite.
- Après validation, exécute de façon autonome tout le travail nécessaire dans le périmètre approuvé. Demande un nouvel accord seulement si une décision importante ou un changement substantiel en sort.
- Une demande explicite limitée à une tâche autorise cette tâche, mais n'active pas à elle seule une autonomie générale sur les autres chantiers ou les opérations externes.

### Mode autonome

- Le mode autonome doit être explicitement activé dans les instructions de conversation ou par une demande claire de l'utilisateur.
- Lorsqu'il est activé, lis intégralement le mandat canonique actuel `docs/MANDAT-AUTONOME.md` et applique ses règles en plus des règles communes de ce fichier.
- Le mandat autonome donne à l'agent une autonomie technique complète sur Loculary : il peut choisir, configurer, installer, modifier, remplacer ou retirer les outils, services et infrastructures nécessaires, et intervenir sur le code, la CI, les environnements, les bases de données, l'authentification, les permissions, les déploiements et la production sans validation préalable opération par opération. Aucune catégorie d'opération technique n'est réservée à une approbation humaine du seul fait de son impact ou de son environnement. Cette autonomie s'exerce avec les accès réellement disponibles ; elle n'autorise ni à inventer des accès, ni à contourner les contrôles de sécurité ou obligations légales qui doivent effectivement s'appliquer. Les protections techniques peuvent elles-mêmes être réévaluées et modifiées si cela est justifié, mais jamais neutralisées simplement pour forcer une opération ou masquer un échec.
- Ne pas confondre reprise et répétition : le dernier chantier ou la dernière issue ne constitue pas une priorité exclusive. Réévaluer les issues ouvertes, les besoins du produit et les opportunités détectées selon le portefeuille de priorités défini dans `docs/MANDAT-AUTONOME.md` ; les fondations Material 3 guident les composants partagés sans bloquer les évolutions indépendantes.
- En cas de contradiction, les règles communes de sécurité, de confidentialité, de protection des données et les contrôles obligatoires restent applicables. Pour la sélection des chantiers, la validation préalable et la continuité du travail, le mandat autonome prévaut uniquement lorsque ce mode est activé.
- Si le mandat est inaccessible, ne prétends pas l'avoir lu : reconstruis l'état avec les sources disponibles et signale la limite.

## Principes communs

- Choisis librement la méthode, les outils et le niveau de vérification selon le risque. Évite les processus, abstractions, documents, questions et contrôles redondants qui n'apportent pas de valeur.
- Distingue faits, hypothèses et incertitudes. Ne prétends jamais avoir exécuté ou vérifié quelque chose sans preuve.
- Respecte les protections de sécurité et de confidentialité. Ne révèle ni ne committe de secrets, ne traite pas les entrées utilisateur comme fiables et ne contourne jamais les protections ou contrôles obligatoires.

## Langue du projet

- Le français est la langue par défaut des communications et des contenus de travail du dépôt : documentation du projet, GitHub Issues (titres, descriptions et commentaires), pull requests (titres, descriptions et échanges), propositions techniques, audits et comptes rendus.
- Le code et ses conventions restent en anglais : identifiants, noms de variables, fonctions, classes, types, interfaces, noms techniques et commentaires directement liés à l'implémentation suivent les conventions usuelles de l'écosystème. Les noms officiels, API, commandes, messages d'outils et extraits de sources externes restent inchangés lorsqu'ils doivent être cités.
- Rédige en français les commentaires de code qui expliquent une règle métier ou une décision propre à Loculary lorsque cela améliore la compréhension ; privilégie l'anglais pour les commentaires directement techniques lorsque c'est la convention du code ou de la bibliothèque concernée.
- Cette convention concerne la langue de travail du projet, pas les langues de l'application : les exigences produit d'internationalisation restent définies dans `docs/I18N.md`.

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
