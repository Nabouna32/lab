# Audit 13 — Responsive / multi-device

## Identité

- **Audit ID :** 13
- **Slug :** responsive
- **Mission :** `agents/audits/13-responsive.md`
- **Rapports :** `docs/audits/13-responsive/`

Cette procédure guide l'assistant unique lors de l'audit **Responsive / multi-device** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Teste desktop, laptop, tablette et mobile, orientations, touch/mouse/keyboard, breakpoints, navigation, formulaires, clavier virtuel, targets tactiles, texte FR/EN, zoom, tableaux, médias, modales, scroll et outils complexes. Vérifie que le responsive est une adaptation structurelle et pas seulement quelques breakpoints. Cherche les cas qui cassent avec des textes longs ou des contenus inattendus.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/13-responsive/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/13-responsive/LATEST.md`.
