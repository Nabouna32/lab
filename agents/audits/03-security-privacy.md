# Audit 03 — Sécurité / Privacy

## Identité

- **Audit ID :** 03
- **Slug :** security-privacy
- **Mission :** `agents/audits/03-security-privacy.md`
- **Rapports :** `docs/audits/03-security-privacy/`

Cette procédure guide l'assistant unique lors de l'audit **Sécurité / Privacy** de Loculary. Elle exige des preuves reproductibles, le challenge des choix existants et la séparation entre audit en lecture seule et étape d'implémentation validée.

## Objectif et périmètre

Analyse l'attaque surface complète : navigateur, Next.js, API/services externes, fichiers, stockage local, authentification si présente, secrets, headers, CSP, XSS, injection, CSRF lorsque pertinent, validation, erreurs, logs, dépendances et supply chain. Cartographie les flux de données outil par outil et compare-les à la promesse browser-first/local-first et aux déclarations de processing. Cherche les fuites de données, permissions excessives, secrets côté client, surfaces inutiles et hypothèses de confiance. N'exécute aucun test destructif.

## Méthode

Applique le contrat commun de `agents/AUDIT-CONTRACT.md` et la gouvernance de `agents/AGENT-CONTRACT.md`. Vérifie l'état réel du dépôt et les documents canoniques pertinents, puis concentre l'exécution sur les contrôles propres à cet audit. Le rapport doit distinguer preuves, déductions, hypothèses et recommandations.

## Critères de qualité spécifiques

Ne cherche pas à produire artificiellement une longue liste de problèmes. Priorise les constats qui ont un impact réel sur les utilisateurs, la fiabilité, la sécurité, la confidentialité, la maintenabilité, le coût ou la capacité de Loculary à évoluer.

Quand plusieurs solutions sont possibles, compare-les brièvement et recommande celle qui apporte le meilleur équilibre entre qualité, simplicité, coût et maintenabilité.

**Tu ne dois pas implémenter les corrections découvertes pendant cet audit.** Elles doivent être documentées dans le rapport et, si nécessaire, transformées en prompt d'implémentation.

## Résultat attendu

Suis le contrat canonique d'audit. Les constats, la couverture et les recommandations doivent rester spécifiques au domaine de cette mission.


### Chemin de sortie exact de cette mission

Le rapport de cette mission doit être créé dans : `docs/audits/03-security-privacy/<TIMESTAMP>.md`. Le pointeur remplaçable est : `docs/audits/03-security-privacy/LATEST.md`.
