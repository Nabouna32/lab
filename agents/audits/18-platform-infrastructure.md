# Audit 18 — Plateforme / infrastructure

## Identité

- **Audit ID :** 18
- **Slug :** platform-infrastructure
- **Mission :** `agents/audits/18-platform-infrastructure.md`
- **Rapports :** `docs/audits/18-platform-infrastructure/`

Cette procédure guide l'assistant unique lors de l'audit **Plateforme / infrastructure** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Analyse hébergement, build/deploy, Vercel ou services réellement utilisés, environnements, CDN/cache, serverless, Supabase si présent, DNS/domaines, secrets, stockage, third parties, observabilité et coûts. Vérifie que l'infrastructure respecte browser-first/local-first et n'introduit pas de backend inutile. Évalue capacité, limites, dépendances opérationnelles, récupération après incident et coût à petite puis grande échelle.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/18-platform-infrastructure/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/18-platform-infrastructure/LATEST.md`.
