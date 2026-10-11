# Audit 01 — QA global / qualité produit

## Identité

- **Audit ID :** 01
- **Slug :** qa-global
- **Mission :** `agents/audits/01-qa-global.md`
- **Rapports :** `docs/audits/01-qa-global/`

Cette procédure guide l'assistant unique lors de l'audit **QA global / qualité produit** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Réalise une validation de bout en bout de Loculary comme produit réellement utilisable. Couvre démarrage, build, lint/typecheck/tests disponibles, routes publiques et privées, catalogue, recherche, catégories, pages d'outils et parcours principaux. Utilise un navigateur lorsque possible et vérifie console, réseau, erreurs runtime, états loading/error/empty, responsive, clavier, i18n et comportements réels. Ne te limite pas aux tests existants : cherche activement des régressions et des cas non couverts. Évalue aussi si la stratégie QA actuelle peut réellement soutenir un catalogue très large.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/01-qa-global/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/01-qa-global/LATEST.md`.
