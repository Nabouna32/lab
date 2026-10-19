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

- **État :** avertissement confirmé ; décision de risque pour l'inscription publique suivie dans l'issue [#467](https://github.com/Nabouna32/lab/issues/467).
- **Impact :** le Security Advisor signale que la protection contre les mots de passe compromis est désactivée. C'est un risque lié à l'authentification par compte, pas une raison d'exiger un compte pour les outils publics.
- **Cause confirmée dans le contexte du projet :** cette option n'est pas disponible sur l'offre Supabase Free actuelle.
- **Vérification du code (19 octobre) :** la page `/[locale]/compte/inscription` et l'action serveur `signUp` sont présentes. Le serveur valide le format de l'adresse, impose 8–128 caractères au mot de passe, limite le nom affiché à 80 caractères et gère les réponses Supabase `weak_password` et `429`. La protection contre les mots de passe compromis n'est pas réimplémentée localement ; l'application délègue cette vérification à Supabase Auth.
- **Limite de preuve :** le dépôt ne révèle pas si les inscriptions sont actuellement activées dans la configuration Auth de production. Le connecteur disponible ne permet pas de lire ce réglage. Ne pas présenter l'inscription comme vérifiée en production.
- **Tentatives / solutions écartées :** aucune modification de configuration de production ni dépense ; ne pas envoyer les mots de passe à un service tiers pour recréer le contrôle, ne pas revenir demander l'activation sans changement de plan ou de disponibilité, et ne pas contourner la restriction.
- **Prochaine action :** conserver l'usage anonyme des outils et obtenir une décision explicite sur le niveau de risque accepté si l'inscription publique est promue au lancement. L'issue #467 documente les options, contraintes et critères de reprise.
- **Condition de reprise :** évolution de l'offre, disponibilité d'une mitigation supportée, preuve de l'état réel de l'inscription qui change la décision, ou décision du propriétaire sur le risque et le coût.
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
- **Constat complémentaire :** les politiques déployées utilisent déjà des sous-requêtes scalaires autour de `auth.uid()` et de la lecture de `request.headers`. Un `EXPLAIN (VERBOSE, COSTS OFF)` des prédicats équivalents montre que ces expressions deviennent des `InitPlan` (donc évaluées une fois par requête) ; le plan utilise `user_collections_user_id_idx`, l'index unique `user_collections_share_token_key` et la clé primaire de `user_collection_items`. Cela soutient l'hypothèse d'un faux positif de l'advisor pour les expressions actuelles, sans prouver les performances sous charge réelle.
- **Risque :** modifier les politiques de partage sans raison démontrée pourrait changer les droits de lecture ou casser les liens de partage. Supprimer des index sur une base peu utilisée pourrait aussi dégrader des parcours encore peu sollicités.
- **Prochaine action :** aucune modification de politique n'est justifiée par ces alertes seules. Réexaminer si les expressions, le plan ou les mesures de charge changent.
- **Index inutilisés :** les dix index listés ont `idx_scan = 0`, font chacun 8–16 kB et ne supportent pas directement une contrainte selon `pg_constraint.conindid`. Ils restent néanmoins conservés : les compteurs reflètent une base peu sollicitée et ne suffisent pas à prouver qu'ils sont inutiles pour les parcours d'administration futurs. Réévaluer avec une période de charge représentative avant toute suppression.


## 5. HTML previewer — CSP insertion can be swallowed by untrusted markup

- **État :** corrigé dans le code et fusionné par la [PR #764](https://github.com/Nabouna32/lab/pull/764), commit [`3de8202`](https://github.com/Nabouna32/lab/commit/3de82028875913617d72c794c8c3a87045fd58be). La CI complète a réussi sur la tête exacte (`39215120924`) et le déploiement Vercel de production est `READY` : [déploiement](https://vercel.com/nabouna32/loculary/G4rWQXvmZ4GtyeKJHJimrxzVYrBT). La requête externe n'a pas été testée dans un navigateur ; la correction est confirmée par le code, le test de régression, la CI et le déploiement.
- **Impact :** si la CSP n'est pas interprétée, une page prévisualisée peut déclencher des requêtes de ressources externes et exposer des métadonnées réseau au serveur tiers. L'iframe utilise `sandbox=""`, ce qui bloque notamment les scripts et l'accès same-origin, mais ne bloque pas à lui seul toutes les requêtes réseau.
- **Cause confirmée avant correction :** `src/lib/html-previewer.ts` cherchait le premier `<head>` avec une regex. Une entrée comme `<!-- <head> --> <img src="https://example.com/tracker.png">` pouvait faire insérer la balise CSP dans un commentaire HTML inerte.
- **Correction livrée :** la CSP est préfixée avant tout contenu utilisateur ; le code ne recherche plus de balise dans la chaîne non fiable. Un test de régression vérifie que la politique précède le commentaire.
- **Limite restante :** une vérification navigateur dédiée du blocage effectif des requêtes externes reste souhaitable si un navigateur de test devient disponible ; elle n'a pas été réalisée dans cette session.
