# Audit 23 — Publicité / monétisation

## Identité

- **Audit ID :** 23
- **Slug :** monetization
- **Mission :** `agents/audits/23-monetization.md`
- **Rapports :** `docs/audits/23-monetization/`

Cette procédure guide l'assistant unique lors de l'audit **Publicité / monétisation** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Analyse le modèle économique implémenté ou préparé : emplacements publicitaires, responsive, performance, CLS, privacy/consentement, tiers, blocage du parcours principal et soutenabilité. Vérifie concrètement la décision que la publicité reste subordonnée à l'outil. Challenge les placements et mécanismes depuis zéro, y compris ce qu'il faudrait refuser même si cela augmente le revenu.

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

Le rapport de cette mission doit être créé dans : `docs/audits/23-monetization/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/23-monetization/LATEST.md`.
