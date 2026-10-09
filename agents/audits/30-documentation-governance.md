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

## Contrat obligatoire

Lis d'abord `agents/AUDIT-CONTRACT.md` et respecte-le intégralement. Cette procédure précise les exigences suivantes :

- Mission : `agents/audits/<ID>-<slug>.md`.
- Audite le dépôt réel actuel et note le commit SHA, le ref et l'horodatage UTC.
- Lis `AGENTS.md` et les documents Loculary pertinents avant de conclure.
- Aucun changement de code produit, tests, configuration, dépendances, documentation produit, décisions ou anciens rapports pendant l'audit.
- Seules écritures autorisées : nouveau rapport `docs/audits/<ID>-<slug>/<TIMESTAMP>.md` et mise à jour de `docs/audits/<ID>-<slug>/LATEST.md`.
- Chaque exécution crée un nouveau rapport UTC ISO-8601 ; ne supprime, n'écrase ni ne réécrit jamais un rapport historique.
- `LATEST.md` est un pointeur remplaçable, pas une preuve historique.
- Le rapport contient au minimum : métadonnées, commit, périmètre, environnement/outils, méthodologie/couverture, résultats, anomalies, faiblesses, challenges, éléments à préserver, propositions, décisions à valider, plan d'implémentation, tests/vérifications, conclusion et prochaines actions.
- Classe les constats : **OBSERVÉ**, **MESURÉ**, **DÉDUIT**, **PROPOSÉ**, **À VALIDER**, **CORRIGÉ DEPUIS UN AUDIT PRÉCÉDENT**, **TOUJOURS PRÉSENT**. La sévérité CRITICAL/HIGH/MEDIUM/LOW/INFO est distincte.
- Fournis des preuves reproductibles et ne mets jamais de secrets, tokens ou données personnelles inutiles dans le rapport.
- Une recommandation n'est jamais une décision. Toute décision structurante va dans « Décisions nécessitant validation ».
- Termine par un plan d'implémentation copiable, avec périmètre, décisions requises, fichiers, tests, vérification, diff et documentation.
- Réponds aussi : **si Loculary était construit aujourd'hui, qu'est-ce que nous changerions ?**

## Critères spécifiques

Priorise les constats qui affectent réellement utilisateurs, fiabilité, sécurité, confidentialité, coût, maintenabilité ou capacité d'évolution. N'invente pas des problèmes pour allonger le rapport. Lorsque plusieurs solutions sont raisonnables, compare leurs conséquences et recommande la meilleure sans la présenter comme une décision.

## Résultat

Crée le rapport historique et mets à jour `LATEST.md` selon le contrat. Vérifie que les rapports précédents sont intacts. Termine par un plan d'implémentation exploitable, sans implémenter toi-même les corrections dans le cadre de l'audit.

### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/30-documentation-governance/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/30-documentation-governance/LATEST.md`.

## Audit et challenge — obligation explicite

Pour chaque axe important, effectue deux lectures successives mais liées :

1. **Audit de l'existant** — établis ce qui existe réellement, ce qui fonctionne, ce qui échoue et ce qui est mesurable, avec preuves reproductibles.
2. **Challenge de l'existant** — demande explicitement si ce choix reste le meilleur pour Loculary. Cherche une approche plus simple, robuste, claire, moderne, sûre, accessible ou évolutive lorsque pertinent.

Le challenge porte aussi sur les choix qui semblent corrects : identifie les éléments à **préserver**, **améliorer**, **remplacer** et **supprimer**. Toute alternative substantielle reste une proposition jusqu'à validation. Distingue les problèmes observés des opportunités d'amélioration découvertes par le challenge.

## Revue après audit et poursuite validée

Une fois le rapport historique terminé, l'utilisateur peut discuter les constats et décider du travail suivant. L'assistant poursuit alors séquentiellement avec l'utilisateur :

- « continue », « vas-y » ou « passe à la suite » autorise à poursuivre l'explication et l'examen des recommandations, mais ne valide pas automatiquement une implémentation ni toutes les recommandations.
- Présente chaque recommandation conséquente avec preuves, impact, périmètre, non-objectifs, incertitudes, options et recommandation.
- Demande validation explicite avant une décision conséquente ou un changement de périmètre.
- Pour une découverte actionnable hors périmètre, demande explicitement s'il faut créer une Issue ou rattacher le sujet à une Issue existante qui le couvre réellement.
- Après validation d'une étape, mets à jour l'Issue de mission et exécute uniquement le périmètre autorisé ; inspecte le diff et les vérifications avant de déclarer l'étape terminée.
- Valider une recommandation n'en valide pas d'autres par implication.

### Frontière de l'audit

L'audit reste en lecture seule pour le code produit, les tests, la configuration, les dépendances et les spécifications canoniques. Il peut créer son nouveau rapport immuable et mettre à jour le pointeur `LATEST.md`, conformément au contrat. Toute implémentation constitue une étape distincte, validée et exécutée ensuite par le même assistant avec l'utilisateur.