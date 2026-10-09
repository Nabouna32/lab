# Audit 20 — Dépendances / supply chain

## Identité

- **Audit ID :** 20
- **Slug :** dependencies-supply-chain
- **Mission :** `agents/audits/20-dependencies-supply-chain.md`
- **Rapports :** `docs/audits/20-dependencies-supply-chain/`

Cette procédure guide l'assistant unique lors de l'audit **Dépendances / supply chain** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Inventorie dépendances directes et transitive réellement utilisées. Évalue maintenance, sécurité, licences, duplication, poids, bundle client, imports, tree-shaking, isolation des outils, APIs natives et dépendances dev. Cherche packages inutiles, alternatives natives raisonnables et dépendances qui imposent un risque disproportionné. Analyse lockfile, package manager, versions et capacité à maintenir le système sans multiplier la surface supply-chain.

## Méthode obligatoire

1. Commence par vérifier l'état Git réel et le commit audité.
2. Lis `AGENTS.md`, puis les documents de référence pertinents : au minimum ceux liés à ton domaine parmi `docs/VISION.md`, `docs/PRODUCT.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/I18N.md`, `docs/PRIVACY.md`, `docs/DECISIONS.md`, ainsi que les documents spécialisés référencés par `AGENTS.md`.
3. Inspecte le code réellement implémenté. La documentation n'est pas une preuve de comportement.
4. Utilise les outils disponibles (Git, tests, navigateur, build, analyse statique, mesures) lorsque cela améliore la fiabilité du constat.
5. Ne considère jamais un test existant comme preuve suffisante sans vérifier ce qu'il couvre réellement.
6. Distingue systématiquement faits observés, mesures, déductions, propositions et décisions.
7. Recherche à la fois les défauts et les choix fonctionnels mais sous-optimaux.
8. Pour chaque problème important, indique l'impact, les preuves et comment l'étape suivante pourra le reproduire.
9. Compare les résultats aux décisions durables sans les réécrire.
10. Termine par une remise en question from-scratch : **si Loculary était construit aujourd'hui, qu'est-ce que nous changerions ?**

## CONTRAT DE SORTIE — NON NÉGOCIABLE

## CONTRAT OBLIGATOIRE

Avant toute action, lis et respecte `agents/AUDIT-CONTRACT.md`. Ce fichier est le contrat canonique de sortie. Ce prompt doit être considéré comme autonome : tu dois aussi respecter explicitement les règles suivantes.

- Mission stable : `agents/audits/<ID>-<slug>.md`.
- Audite le dépôt réel et actuel ; ne te fie ni à la conversation ni aux anciens audits sans revalidation.
- Lis `AGENTS.md` et les documents Loculary pertinents avant de conclure.
- L'audit ne modifie jamais le code produit, les tests, la configuration, les dépendances, la documentation produit, les décisions ou les anciens rapports.
- La seule persistance autorisée est : créer un nouveau rapport dans `docs/audits/<ID>-<slug>/<TIMESTAMP>.md` et mettre à jour `docs/audits/<ID>-<slug>/LATEST.md`.
- Le timestamp du rapport est UTC, ISO-8601, filesystem-safe, et une nouvelle exécution ne remplace jamais un ancien rapport.
- `LATEST.md` est uniquement un pointeur remplaçable vers le dernier rapport ; il ne contient pas le rapport complet.
- Le rapport doit contenir au minimum : métadonnées, commit audité, périmètre, environnement/outils, méthodologie/couverture, résultats observés, anomalies, faiblesses/sous-optimalités, challenges, éléments à préserver, propositions, décisions à valider, plan d'implémentation, tests/vérifications, plan d'implémentation exploitable pour la suite du travail, conclusion.
- Chaque constat important doit distinguer explicitement : OBSERVÉ, MESURÉ, DÉDUIT, PROPOSÉ, À VALIDER, CORRIGÉ DEPUIS UN AUDIT PRÉCÉDENT ou TOUJOURS PRÉSENT.
- Quand pertinent, ajoute une sévérité CRITICAL/HIGH/MEDIUM/LOW/INFO distincte du statut épistémique.
- Donne des preuves reproductibles : chemins, symboles, routes, commandes, mesures, contexte navigateur/appareil ou parcours utilisateur.
- Ne mets jamais de secrets, tokens, credentials ou données personnelles inutiles dans le rapport.
- Les recommandations ne sont pas des décisions produit. Toute décision structurante doit être placée dans « Décisions nécessitant validation ».
- Le rapport doit terminer par un plan copiable pour l'étape d'implémentation suivante, avec périmètre, décisions validées/non validées, fichiers à inspecter, tests, vérification, diff et documentation.
- Réponds à la question transversale : « Si Loculary était construit aujourd'hui, qu'est-ce que nous changerions ? »


## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

À la fin de l'audit, persiste le rapport historique et `LATEST.md` selon le contrat canonique. Vérifie que l'ancien historique est intact et que le nouveau rapport mentionne précisément le commit audité.

Ne déclare jamais une recommandation comme « décidée » simplement parce que tu la juges préférable.

### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/20-dependencies-supply-chain/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/20-dependencies-supply-chain/LATEST.md`.

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
