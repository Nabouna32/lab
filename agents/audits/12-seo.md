# Audit 12 — SEO

## Identité

- **Audit ID :** 12
- **Slug :** seo
- **Mission :** `agents/audits/12-seo.md`
- **Rapports :** `docs/audits/12-seo/`

Cette procédure guide l'assistant unique lors de l'audit **SEO** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Audite SEO technique, sémantique et internationalisé : URLs, routes, indexabilité, robots, sitemap, canonical, hreflang/x-default, metadata, H1, contenu outil, intention de recherche, liens internes, breadcrumbs, structured data si justifiée, OG, social metadata, rendu, performance, redirects, 404 et pages privées. Vérifie les URLs locales actuelles et les risques de contenu mince/dupliqué à grande échelle. Mesure ce qui peut l'être et sépare recommandations SEO de décisions produit.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/12-seo/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/12-seo/LATEST.md`.
