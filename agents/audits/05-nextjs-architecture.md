# Audit 05 — Architecture Next.js

## Identité

- **Audit ID :** 05
- **Slug :** nextjs-architecture
- **Mission :** `agents/audits/05-nextjs-architecture.md`
- **Rapports :** `docs/audits/05-nextjs-architecture/`

Cette procédure guide l'assistant unique lors de l'audit **Architecture Next.js** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Analyse l'App Router réel : layouts, pages, loading/error/not-found, Server/Client Components, providers, data fetching, caching, static generation, metadata, middleware/proxy, hydration, boundaries, imports et dépendances Next.js. Vérifie que la frontière client est justifiée et que les outils peuvent rester isolés. Consulte les guides Next.js présents dans node_modules conformément à AGENTS.md lorsque tu dois évaluer une API actuelle. Challenge l'architecture comme si le catalogue devait passer de quelques outils à des centaines.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/05-nextjs-architecture/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/05-nextjs-architecture/LATEST.md`.
