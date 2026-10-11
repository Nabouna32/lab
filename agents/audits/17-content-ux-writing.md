# Audit 17 — Contenu / UX writing

## Identité

- **Audit ID :** 17
- **Slug :** content-ux-writing
- **Mission :** `agents/audits/17-content-ux-writing.md`
- **Rapports :** `docs/audits/17-content-ux-writing/`

Cette procédure guide l'assistant unique lors de l'audit **Contenu / UX writing** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite tout le texte visible et fonctionnel : proposition de valeur, titre, sous-titres, noms d'outils, descriptions, placeholders, labels, CTA, résultats, erreurs, aides, privacy copy, navigation, empty states, metadata et contenu SEO. Challenge le texte depuis zéro : clarté, précision, ton, confiance, densité, FR/EN, accessibilité et intention de recherche. Supprime conceptuellement le mauvais contenu plutôt que de chercher uniquement à le reformuler.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/17-content-ux-writing/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/17-content-ux-writing/LATEST.md`.
