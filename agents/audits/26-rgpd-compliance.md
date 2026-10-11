# Audit 26 — RGPD / conformité

## Identité

- **Audit ID :** 26
- **Slug :** rgpd-compliance
- **Mission :** `agents/audits/26-rgpd-compliance.md`
- **Rapports :** `docs/audits/26-rgpd-compliance/`

Cette procédure guide l'assistant unique lors de l'audit **RGPD / conformité** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Réalise un audit technique et produit de conformité, sans présenter le résultat comme un avis juridique. Cartographie données, finalités, minimisation, consentement lorsqu'il est requis, cookies/storage, tiers, transferts, conservation, droits, suppression, sécurité, sous-traitants et transparence. Compare flux réels et documentation. Identifie précisément les points nécessitant validation juridique ou décision produit.

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

Le rapport de cette mission doit être créé dans : `docs/audits/26-rgpd-compliance/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/26-rgpd-compliance/LATEST.md`.
