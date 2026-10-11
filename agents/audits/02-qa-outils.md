# Audit 02 — QA spécialisé outils

## Identité

- **Audit ID :** 02
- **Slug :** qa-outils
- **Mission :** `agents/audits/02-qa-outils.md`
- **Rapports :** `docs/audits/02-qa-outils/`

Cette procédure guide l'assistant unique lors de l'audit **QA spécialisé outils** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Traite chaque outil publié comme une mini-application. Inventorie les outils réellement présents puis vérifie leurs modèles métier, calculs, conversions, unités, arrondis, précision, bornes, valeurs négatives, zéros, valeurs extrêmes, entrées invalides, copier/réinitialiser/partager et cohérence inter-outils. Pour les familles pertinentes, construis des cas de référence indépendants plutôt que de vérifier un résultat contre sa propre implémentation. Challenge la qualité réelle du catalogue : exactitude, utilité, hypothèses et confiance utilisateur.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/02-qa-outils/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/02-qa-outils/LATEST.md`.
