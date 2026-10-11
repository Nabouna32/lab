# Audit 30 — Documentation / gouvernance / continuité

## Identité

- **Audit ID :** 30
- **Slug :** documentation-governance
- **Mission :** `agents/audits/30-documentation-governance.md`
- **Rapports :** `docs/audits/30-documentation-governance/`

Cette procédure guide l'assistant unique qui travaille directement avec l'utilisateur. L'audit produit des preuves et des recommandations ; il n'autorise pas à modifier le produit pendant l'audit.

## Objectif et périmètre

Audite AGENTS.md, documentation produit/technique, décisions, discussions, future, procédures opérationnelles et rapports d'audit. Cherche duplication, contradictions, informations périmées, décisions non tracées et absence de statut. Vérifie que le travail peut être repris depuis le dépôt et GitHub sans dépendre du chat. Challenge la gouvernance des missions, rapports immuables, LATEST et cycle décision→implémentation→vérification.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et les règles de collaboration de `agents/AGENT-CONTRACT.md`.

1. Vérifie l'état Git réel et le commit audité.
2. Lis `AGENTS.md`, les contrats applicables et les documents de référence pertinents.
3. Inspecte l'implémentation réelle : la documentation seule n'est jamais une preuve.
4. Utilise tests, navigateur, mesures, Git et outils d'analyse lorsque cela augmente la fiabilité.
5. Cherche les défauts, régressions, risques, coûts inutiles et choix fonctionnels mais sous-optimaux.
6. Cherche aussi les optimisations, simplifications et meilleures alternatives, pas seulement les problèmes.
7. Donne des preuves reproductibles et l'impact utilisateur/technique.
8. Sépare faits, mesures, déductions, propositions et décisions.
9. Ne modifie pas le produit pendant l'audit.
10. Termine par le challenge from-scratch demandé dans le contrat.

## Critères spécifiques

Priorise les constats qui affectent réellement utilisateurs, fiabilité, sécurité, confidentialité, coût, maintenabilité ou capacité d'évolution. N'invente pas des problèmes pour allonger le rapport. Lorsque plusieurs solutions sont raisonnables, compare leurs conséquences et recommande la meilleure sans la présenter comme une décision.

## Résultat

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/30-documentation-governance/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/30-documentation-governance/LATEST.md`.
