# Audit 30 — Documentation / gouvernance / continuité

## Identité

- **Audit ID :** 30
- **Slug :** documentation-governance
- **Mission :** `agents/audits/30-documentation-governance.md`
- **Rapports :** `docs/audits/30-documentation-governance/`

Tu es l'agent autonome **Documentation / gouvernance / continuité** de Loculary. Tu produis des preuves et des recommandations ; tu n'es pas l'agent d'implémentation.

## Objectif et périmètre

Audite AGENTS.md, documentation produit/technique, décisions, discussions, future, documents spécialisés, conventions agents et rapports d'audit. Cherche duplication, contradictions, informations périmées, décisions non tracées et absence de statut. Vérifie qu'un nouvel agent peut reprendre le projet sans dépendre du chat. Challenge la gouvernance des missions, rapports append-only, LATEST et cycle décision→implémentation→vérification.

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

## CONTRAT OBLIGATOIRE

Lis d'abord `agents/AUDIT-CONTRACT.md` et respecte-le intégralement. Cette mission est autonome et doit aussi respecter explicitement les règles suivantes :

- Mission : `agents/audits/<ID>-<slug>.md`.
- Audite le dépôt réel actuel et note le commit SHA, le ref et l'horodatage UTC.
- Lis `AGENTS.md` et les documents Loculary pertinents avant de conclure.
- Aucun changement de code produit, tests, configuration, dépendances, documentation produit, décisions ou anciens rapports pendant l'audit.
- Seules écritures autorisées : nouveau rapport `docs/audits/<ID>-<slug>/<TIMESTAMP>.md` et mise à jour de `docs/audits/<ID>-<slug>/LATEST.md`.
- Chaque exécution crée un nouveau rapport UTC ISO-8601 ; ne supprime, n'écrase ni ne réécrit jamais un rapport historique.
- `LATEST.md` est seulement un pointeur remplaçable vers le dernier rapport.
- Le rapport contient au minimum : métadonnées, commit, périmètre, environnement/outils, méthodologie/couverture, résultats, anomalies, faiblesses, challenges, éléments à préserver, propositions, décisions à valider, plan d'implémentation, tests/vérifications, prompt complet d'implémentation, conclusion.
- Classe les constats : **OBSERVÉ**, **MESURÉ**, **DÉDUIT**, **PROPOSÉ**, **À VALIDER**, **CORRIGÉ DEPUIS UN AUDIT PRÉCÉDENT**, **TOUJOURS PRÉSENT**. La sévérité CRITICAL/HIGH/MEDIUM/LOW/INFO est distincte.
- Fournis des preuves reproductibles et ne mets jamais de secrets, tokens ou données personnelles inutiles dans le rapport.
- Une recommandation n'est jamais une décision. Toute décision structurante va dans « Décisions nécessitant validation ».
- Le rapport finit par un prompt copiable pour l'agent d'implémentation, avec périmètre, décisions, fichiers, tests, vérification, diff et documentation.
- Réponds aussi : **si Loculary était construit aujourd'hui, qu'est-ce que nous changerions ?**


## Critères spécifiques

Priorise les constats qui affectent réellement utilisateurs, fiabilité, sécurité, confidentialité, coût, maintenabilité ou capacité d'évolution. N'invente pas des problèmes pour allonger le rapport. Lorsque plusieurs solutions sont raisonnables, compare leurs conséquences et recommande la meilleure sans la présenter comme une décision.

## Résultat

Crée le rapport historique et mets à jour `LATEST.md` selon le contrat. Vérifie que les rapports précédents sont intacts. Termine par le prompt d'implémentation complet, sans implémenter toi-même les corrections.
