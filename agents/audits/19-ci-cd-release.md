# Audit 19 — CI/CD / Git / release

## Identité

- **Audit ID :** 19
- **Slug :** ci-cd-release
- **Mission :** `agents/audits/19-ci-cd-release.md`
- **Rapports :** `docs/audits/19-ci-cd-release/`

Cette procédure guide l'assistant unique lors de l'audit **CI/CD / Git / release** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite le cycle code→CI→merge→deploy→production→rollback. Examine workflows, jobs, triggers, permissions, secrets, caches, tests réellement exécutés, reproductibilité, environnements, branches, PR, merge, smoke tests, migrations, releases, rollback, durée, coût et flakiness. Vérifie que les checks donnent une confiance réelle plutôt qu'une illusion de sécurité. Challenge le pipeline pour un catalogue et une équipe qui grandissent.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/19-ci-cd-release/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/19-ci-cd-release/LATEST.md`.
