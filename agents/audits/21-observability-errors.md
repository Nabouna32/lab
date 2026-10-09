# Audit 21 — Observabilité / monitoring / erreurs

## Identité

- **Audit ID :** 21
- **Slug :** observability-errors
- **Mission :** `agents/audits/21-observability-errors.md`
- **Rapports :** `docs/audits/21-observability-errors/`

Cette procédure guide l'assistant unique lors de l'audit **Observabilité / monitoring / erreurs** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Détermine si une panne de production serait détectée, localisée et diagnostiquée rapidement. Analyse erreurs client/server, React/Next error boundaries, exceptions/rejections non gérées, hydration, routes, ressources, APIs/services externes, stockage, calculs d'outils, logs, niveaux de sévérité, alertes, monitoring, health checks, synthetic monitoring, source maps et corrélation. Vérifie PII/secrets dans les logs, rétention et contrôle d'accès. Challenge à la fois le silence excessif, le bruit et la télémétrie intrusive. Distingue erreur système, erreur métier et validation attendue.

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

### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/21-observability-errors/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/21-observability-errors/LATEST.md`.

## Audit ET challenge — obligation explicite

Pour **chaque axe important de cet audit**, effectue deux lectures successives mais liées :

1. **Audit de l'existant** — établis ce qui existe réellement, ce qui fonctionne, ce qui échoue et ce qui est mesurable, avec preuves reproductibles.
2. **Challenge de l'existant** — demande explicitement si ce choix est encore le meilleur pour Loculary. Cherche une approche plus simple, plus robuste, plus claire, plus moderne, plus sûre, plus accessible ou plus scalable lorsque pertinent. Ne conserve pas un choix uniquement parce qu'il fonctionne aujourd'hui.

Le challenge doit porter aussi sur les choix qui semblent corrects : identifie les éléments à **préserver**, ceux à **améliorer**, ceux à **remplacer** et ceux à **supprimer**. Toute alternative substantielle doit être formulée comme une proposition et non comme une décision. Le rapport doit distinguer les problèmes observés des opportunités d'amélioration découvertes uniquement par le challenge.

## Audit ET challenge — obligation explicite

Pour **chaque axe important de cet audit**, effectue deux lectures successives mais liées :

1. **Audit de l'existant** — établis ce qui existe réellement, ce qui fonctionne, ce qui échoue et ce qui est mesurable, avec preuves reproductibles.
2. **Challenge de l'existant** — demande explicitement si ce choix est encore le meilleur pour Loculary. Cherche une approche plus simple, plus robuste, plus claire, plus moderne, plus sûre, plus accessible ou plus scalable lorsque pertinent. Ne conserve pas un choix uniquement parce qu'il fonctionne aujourd'hui.

Le challenge doit porter aussi sur les choix qui semblent corrects : identifie les éléments à **préserver**, ceux à **améliorer**, ceux à **remplacer** et ceux à **supprimer**. Toute alternative substantielle doit être formulée comme une proposition et non comme une décision. Le rapport doit distinguer les problèmes observés des opportunités d'amélioration découvertes uniquement par le challenge.

## Revue après audit et poursuite validée

Une fois le rapport historique terminé, l'utilisateur peut discuter les constats et décider du travail suivant. L'assistant poursuit alors séquentiellement avec l'utilisateur :

- « continue », « vas-y » ou « passe à la suite » autorise à poursuivre l'explication et l'examen des recommandations, mais ne valide pas automatiquement une implémentation ni toutes les recommandations.
- Présente chaque recommandation conséquente avec preuves, impact, périmètre, non-objectifs, incertitudes, options et recommandation.
- Demande validation explicite avant une décision conséquente ou un changement de périmètre.
- Pour une découverte actionnable hors périmètre, demande explicitement s'il faut créer une Issue ou rattacher le sujet à une Issue existante qui le couvre réellement.
- Après validation d'une étape, mets à jour l'Issue de mission et exécute uniquement le périmètre autorisé ; inspecte le diff et les vérifications avant de déclarer l'étape terminée.
- Valider une recommandation n'en valide pas d'autres par implication.

La procédure canonique `agents/AUDIT-CONTRACT.md` définit les exigences communes et prévaut sur ce résumé spécifique.
