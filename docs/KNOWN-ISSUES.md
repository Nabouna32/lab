# Loculary — problèmes connus et conditions de reprise

Dernière vérification : 2026-10-19. Ce registre résume les blocages persistants ; les issues GitHub restent la source détaillée du suivi.

## 1. Alerte npm HIGH sur `braces@3.0.3`

- **État :** ouvert, non résolu.
- **Suivi :** [issue #461](https://github.com/Nabouna32/lab/issues/461).
- **Impact :** alerte de déni de service par épuisement de pile dans une dépendance transitive des outils de développement. Le chemin relevé est `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`; les entrées correspondantes étaient marquées comme dépendances de développement dans le lockfile examiné.
- **Cause / preuve :** l'avis [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) n'indiquait pas de version corrigée lors de la dernière vérification du 19 octobre ; le mainteneur conteste le défaut dans [l'issue amont #84](https://github.com/micromatch/braces/issues/84).
- **Tentatives / solutions écartées :** ne pas lancer `npm audit fix --force` (risque de rétrogradation majeure d'outils), ne pas ajouter de fork non examiné, ne pas masquer l'alerte et ne pas affaiblir le contrôle CI. Le correctif React/Next.js de la PR #747 ne prouve pas que cette alerte est résolue.
- **Incertitude :** un audit complet actualisé sur le lockfile après #747 n'a pas encore été confirmé dans cette reprise. Le compte historique de cinq entrées HIGH ne doit pas être présenté comme un résultat actuel ni comme cinq avis distincts.
- **Prochaine action :** obtenir la sortie complète de `npm audit --audit-level=high` et une vérification distincte du graphe de production (`npm audit --omit=dev`) sur le lockfile courant ; classifier chaque avis avant toute décision.
- **Condition de reprise / résolution :** publication d'un correctif amont, démonstration reproductible qu'un correctif ciblé est sûr, ou décision documentée sur le risque après preuve du périmètre réellement affecté.

## 2. Protection Supabase contre les mots de passe compromis indisponible sur l'offre actuelle

- **État :** limitation de l'offre, pas une action en attente de l'utilisateur.
- **Impact :** le Security Advisor signale que la protection contre les mots de passe compromis est désactivée.
- **Cause confirmée dans le contexte du projet :** cette option n'est pas disponible sur l'offre Supabase Free actuelle.
- **Tentatives / solutions écartées :** aucune modification de configuration de production ; ne pas revenir demander l'activation sans changement de plan ou de disponibilité, et ne pas contourner la restriction.
- **Prochaine action :** vérifier les protections d'authentification déjà disponibles et leur configuration, puis documenter les mesures compensatoires réalistes pour l'offre actuelle.
- **Condition de reprise :** évolution de l'offre, de la disponibilité de la fonctionnalité ou découverte d'une mesure compensatoire vérifiable.

## 3. Validation fonctionnelle du site de production incomplète dans la session distante

- **État :** vérification à réaliser ; pas une preuve d'un défaut du site.
- **Fait confirmé :** Vercel a signalé le déploiement du commit de production comme `READY`.
- **Limite :** l'accès HTTP / navigateur direct n'était pas disponible pendant la session ; les parcours, l'affichage et les interactions n'ont donc pas été validés ici.
- **Solutions écartées :** ne pas assimiler l'état Vercel `READY` à un test fonctionnel et ne pas déclarer des tests navigateur inexistants.
- **Prochaine action :** lors d'une session disposant d'un accès navigateur adapté, vérifier les parcours de lancement essentiels, les erreurs, le responsive et les thèmes ; consigner les résultats précis.
- **Condition de résolution :** validation observable des parcours ciblés, avec les limites restantes explicitement consignées.
