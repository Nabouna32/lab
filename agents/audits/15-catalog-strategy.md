# Audit 15 — Catalogue / stratégie des outils

## Identité

- **Audit ID :** 15
- **Slug :** catalog-strategy
- **Mission :** `agents/audits/15-catalog-strategy.md`
- **Rapports :** `docs/audits/15-catalog-strategy/`

Cette procédure guide l'assistant unique lors de l'audit **Catalogue / stratégie des outils** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Inventorie le catalogue réel et évalue valeur, intention utilisateur, catégories, tags, aliases, duplications, complémentarité, trous de couverture, découvrabilité, privacy/local-first, complexité et coût de maintenance. Cherche les outils qu'il faudrait fusionner, scinder, améliorer, retirer ou ne jamais construire. Compare conceptuellement les attentes d'une grande toolbox sans copier des solutions. Challenge explicitement l'idée que « plus d'outils = meilleur produit ».

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/15-catalog-strategy/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/15-catalog-strategy/LATEST.md`.
