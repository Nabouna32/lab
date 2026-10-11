# Audit 16 — Qualité / pertinence des outils

## Identité

- **Audit ID :** 16
- **Slug :** tool-quality
- **Mission :** `agents/audits/16-tool-quality.md`
- **Rapports :** `docs/audits/16-tool-quality/`

Cette procédure guide l'assistant unique lors de l'audit **Qualité / pertinence des outils** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite chaque outil comme un produit autonome : problème utilisateur, modèle conceptuel, exactitude, hypothèses, unités, terminologie, précision, arrondis, defaults, validation, résultats, interprétation, confiance et applicabilité réelle. Vérifie qu'un résultat mathématiquement correct est aussi utile et compréhensible. Propose lorsque justifié redesign, split, merge, suppression ou changement de positionnement. Ne traite jamais la simple présence d'un test comme preuve de qualité.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/16-tool-quality/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/16-tool-quality/LATEST.md`.
