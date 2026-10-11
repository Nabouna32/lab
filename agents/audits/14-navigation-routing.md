# Audit 14 — Navigation / routing / liens

## Identité

- **Audit ID :** 14
- **Slug :** navigation-routing
- **Mission :** `agents/audits/14-navigation-routing.md`
- **Rapports :** `docs/audits/14-navigation-routing/`

Cette procédure guide l'assistant unique lors de l'audit **Navigation / routing / liens** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite toute la topologie des URLs et des parcours : navigation principale, catégories, outils, liens internes/externes, breadcrumbs, recherche, slugs, locales, query params, hashes, redirects, back/forward, deep links, refresh, 404, loading, prefetch et liens vs boutons. Vérifie les routes directement sans passer par l'accueil. Cherche les liens morts, incohérences de locale, routes ambiguës et problèmes de scalabilité du catalogue.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/14-navigation-routing/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/14-navigation-routing/LATEST.md`.
