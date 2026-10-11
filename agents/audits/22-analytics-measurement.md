# Audit 22 — Analytics / mesure produit

## Identité

- **Audit ID :** 22
- **Slug :** analytics-measurement
- **Mission :** `agents/audits/22-analytics-measurement.md`
- **Rapports :** `docs/audits/22-analytics-measurement/`

Cette procédure guide l'assistant unique lors de l'audit **Analytics / mesure produit** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite les analytics réellement présents ou leur absence : pages, recherche, usage des outils, funnels, erreurs, performance, rétention et attribution lorsque pertinent. Analyse consentement, minimisation, anonymisation, stockage, tiers et impact sur privacy/local-first. Demande quelles décisions produit chaque métrique permet réellement de prendre. Distingue instrumentation utile, décorative, coûteuse ou intrusive et propose une architecture de mesure minimale mais exploitable.

## Méthode

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

Le rapport de cette mission doit être créé dans : `docs/audits/22-analytics-measurement/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/22-analytics-measurement/LATEST.md`.
