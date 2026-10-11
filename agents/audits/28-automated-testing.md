# Audit 28 — Tests automatisés / stratégie QA

## Identité

- **Audit ID :** 28
- **Slug :** automated-testing
- **Mission :** `agents/audits/28-automated-testing.md`
- **Rapports :** `docs/audits/28-automated-testing/`

Cette procédure guide l'assistant unique lors de l'audit **Tests automatisés / stratégie QA** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite la pyramide de tests : unitaires métier, composants, intégration, E2E/browser, accessibilité, visuel et property-based/contract tests lorsqu'ils sont pertinents. Vérifie couverture utile, déterminisme, isolation, fixtures, mocks, i18n et tests par outil. Cherche les tests qui peuvent passer malgré un produit cassé. Propose une stratégie scalable à des centaines d'outils, sans optimiser un pourcentage de couverture pour lui-même.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et les règles de collaboration de `agents/AGENT-CONTRACT.md`.

1. Vérifie l'état Git réel et le commit audité.
2. Lis `AGENTS.md` et les documents de référence pertinents.
3. Inspecte le code réellement implémenté : la documentation seule n'est jamais une preuve.
4. Utilise tests, navigateur, mesures, Git et outils d'analyse lorsque cela augmente la fiabilité.
5. Cherche défauts, régressions, risques et choix fonctionnels mais sous-optimaux.
6. Donne des preuves reproductibles et l'impact utilisateur/technique.
7. Sépare toujours faits, mesures, déductions, propositions et décisions.
8. Ne modifie pas le produit pendant l'audit.
9. Termine par le challenge from-scratch demandé dans le contrat.

## Critères spécifiques

Priorise les constats qui affectent réellement utilisateurs, fiabilité, sécurité, confidentialité, coût, maintenabilité ou capacité d'évolution. N'invente pas des problèmes pour allonger le rapport. Lorsque plusieurs solutions sont raisonnables, compare leurs conséquences et recommande la meilleure sans la présenter comme une décision.

## Résultat

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/28-automated-testing/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/28-automated-testing/LATEST.md`.
