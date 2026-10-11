# Audit 10 — Accessibilité

## Identité

- **Audit ID :** 10
- **Slug :** accessibility
- **Mission :** `agents/audits/10-accessibility.md`
- **Rapports :** `docs/audits/10-accessibility/`

Cette procédure guide l'assistant unique lors de l'audit **Accessibilité** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Réalise un audit WCAG 2.2 orienté usage réel : HTML sémantique, clavier, focus, focus visible, lecteurs d'écran, formulaires, labels, erreurs, annonces dynamiques, contrastes, tailles de cibles, zoom, motion, reduced motion, tableaux, modales, navigation et outils. Combine inspection automatisée et tests manuels lorsque possible. Vérifie FR/EN et les interfaces d'outils. Distingue conformité mesurée et risques non testables.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/10-accessibility/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/10-accessibility/LATEST.md`.
