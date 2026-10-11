# Audit 09 — Design system

## Identité

- **Audit ID :** 09
- **Slug :** design-system
- **Mission :** `agents/audits/09-design-system.md`
- **Rapports :** `docs/audits/09-design-system/`

Cette procédure guide l'assistant unique lors de l'audit **Design system** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite tokens, variables CSS, couleurs sémantiques, typographie, spacing, radii, borders, shadows, breakpoints, motion, primitives et composants. Mesure les duplications et variantes incohérentes. Vérifie que l'API des composants permet des outils spécialisés sans créer un système rigide. Analyse thèmes, accessibilité, i18n et gouvernance. Challenge la capacité du design system à soutenir plusieurs centaines d'outils avec une identité cohérente mais non monotone.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/09-design-system/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/09-design-system/LATEST.md`.
