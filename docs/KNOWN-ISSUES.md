# Loculary — problèmes connus et conditions de reprise

Dernière vérification : 2026-10-19. Ce registre résume les blocages persistants ; les issues GitHub restent la source détaillée du suivi.

## 1. Alerte npm HIGH sur `braces@3.0.3`

- **État :** ouvert, non résolu.
- **Suivi :** [issue #461](https://github.com/Nabouna32/lab/issues/461).
- **Impact :** alerte de déni de service par épuisement de pile dans une dépendance transitive des outils de développement. Le chemin relevé est `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`; les entrées correspondantes étaient marquées comme dépendances de développement dans le lockfile examiné.
- **Cause / preuve :** l'avis [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) n'indiquait pas de version corrigée lors de la dernière vérification du 19 octobre ; le mainteneur conteste le défaut dans [l'issue amont #84](https://github.com/micromatch/braces/issues/84).
- **Tentatives / solutions écartées :** ne pas lancer `npm audit fix --force` (risque de rétrogradation majeure d'outils), ne pas ajouter de fork non examiné, ne pas masquer l'alerte et ne pas affaiblir le contrôle CI. Le correctif React/Next.js de la PR #747 ne prouve pas que cette alerte est résolue.
- **Audit frais du 19 octobre :** [run GitHub Actions #39204638077](https://github.com/Nabouna32/lab/actions/runs/39204638077) a exécuté `npm ci` puis les deux audits sur le lockfile courant après #747. L'audit complet retourne le code 1 et cinq entrées de paquets HIGH : `@next/eslint-plugin-next`, `braces`, `eslint-config-next`, `fast-glob` et `micromatch`. Le rapport donne un seul avis explicite, GHSA-vfj7-8cjw-p6xm, propagé le long de la chaîne transitive ; ces cinq entrées ne sont pas cinq avis distincts.
- **Graphe de production :** `npm audit --omit=dev --audit-level=high` retourne le code 0 et zéro vulnérabilité. Cela réduit le risque connu sur les dépendances de production mais ne résout pas l'alerte de développement ni l'échec de l'audit complet.
- **Prochaine action :** évaluer une correction ciblée et vérifiable ou surveiller la publication d'une version corrigée en conservant le contrôle de sécurité. Ne pas accepter la rétrogradation majeure suggérée par `npm audit fix --force`.
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


## 4. Avertissements de performance Supabase à confirmer

- **État :** observation en cours d'investigation, pas encore un défaut confirmé.
- **Preuve :** l'advisor Performance du 19 octobre signale deux politiques RLS : `public.user_collections` / `Owners and token holders can read collections` et `public.user_collection_items` / `Owners and token holders can read collection items`. Le même relevé signale dix index comme inutilisés.
- **Constat complémentaire :** les politiques actuellement déployées utilisent déjà des sous-requêtes scalaires autour de `auth.uid()` et de la lecture de `request.headers`, conformément au motif recommandé par Supabase. L'advisor peut donc être un faux positif partiel ou signaler une expression imbriquée qui reste à optimiser.
- **Risque :** modifier les politiques de partage sans comprendre le plan pourrait changer les droits de lecture ou casser les liens de partage. Supprimer des index sur une base peu utilisée pourrait aussi dégrader des parcours encore peu sollicités.
- **Prochaine action :** examiner les définitions exactes et des plans d'exécution représentatifs, puis comparer l'avertissement aux politiques et migrations versionnées. Ne pas modifier la production avant d'avoir établi une correction sûre.
- **Index inutilisés :** ne pas supprimer automatiquement les dix index. Revoir leur utilité à partir des migrations, contraintes/foreign keys et d'une période de charge représentative ; un compteur d'utilisation nul sur une base peu sollicitée n'est pas une preuve d'inutilité.
