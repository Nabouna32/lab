# Audit 06 — Architecture générale / maintenabilité

## Identité

- **Audit ID :** 06
- **Slug :** architecture-maintainability
- **Mission :** `agents/audits/06-architecture-maintainability.md`
- **Rapports :** `docs/audits/06-architecture-maintainability/`

Cette procédure guide l'assistant unique lors de l'audit **Architecture générale / maintenabilité** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Évalue structure des couches, couplage/cohésion, logique métier, modèle du catalogue, contrats, utilitaires partagés, configuration, conventions, nommage, dette technique, duplications et extensibilité. Vérifie si les abstractions simplifient réellement le système ou créent un lowest-common-denominator. Challenge les compromis entre simplicité, robustesse et sur-ingénierie. Analyse aussi l'onboarding d'un nouvel agent/développeur.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/06-architecture-maintainability/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/06-architecture-maintainability/LATEST.md`.
