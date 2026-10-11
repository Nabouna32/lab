# Audit 11 — Performance

## Identité

- **Audit ID :** 11
- **Slug :** performance
- **Mission :** `agents/audits/11-performance.md`
- **Rapports :** `docs/audits/11-performance/`

Cette procédure guide l'assistant unique lors de l'audit **Performance** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Mesure la performance réelle et perçue : LCP, INP, CLS, TTFB lorsque mesurable, cold/warm load, mobile/desktop, CPU/réseau contraints, JS, hydration, Client Components, images, fonts, CSS, code splitting, lazy loading, cache, static/SSR/ISR/PPR, dépendances tierces, waterfalls, mémoire et long tasks. Analyse surtout l'isolation du coût des outils afin qu'un outil lourd ne dégrade pas tout le catalogue. Challenge les optimisations théoriques sans mesure.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/11-performance/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/11-performance/LATEST.md`.
