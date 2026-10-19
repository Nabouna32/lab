# Loculary — backlog priorisé

Dernière révision : 2026-10-19. Ce backlog est la file de travail unique ; l'état réel et les preuves restent dans [PROJECT-STATE.md](PROJECT-STATE.md), les risques dans [KNOWN-ISSUES.md](KNOWN-ISSUES.md) et les lots UX dans [REFONTE.md](REFONTE.md).

## P0 — Validation navigateur reproductible avant lancement

- **État :** ouvert ; issue [#765](https://github.com/Nabouna32/lab/issues/765).
- **Pourquoi maintenant :** les builds et tests Node ne valident pas le rendu, les interactions clavier, les thèmes ni les parcours réels. La refonte récente de l’accueil n’a pas été inspectée dans un navigateur.
- **Livrable visé :** Playwright épinglé et verrouillé, tests Chromium ciblés contre un build de production ou une preview Vercel, rapports texte lisibles dans les logs et sous `docs/rapports-visuels/`; mobile/desktop, clair/sombre, erreurs console, géométrie/débordements, axe-core et arbre d’accessibilité. Pas de publication d’artefacts ou de cache distant ; réutiliser le cache local du runner.
- **Critère de sortie :** exécution réellement passée sur le SHA final, rapports consultables, limites explicites ; ne pas rendre tout le CI bloquant avant d’avoir mesuré stabilité et durée.

## P1 — Audit de justesse et confidentialité des outils

- **État :** continu ; checkpoint [issue #741](https://github.com/Nabouna32/lab/issues/741).
- **Pourquoi :** les audits statiques ne démontrent pas la justesse métier ni le comportement réel des entrées limites. Le correctif EXIF récent a déjà trouvé des erreurs concrètes.
- **Livrable visé :** sélectionner un outil précis par reprise, vérifier le calcul/format, les limites, les états d’erreur, FR/EN et les flux de données ; ajouter des tests de régression pour tout défaut confirmé.

## P1 — Finding npm HIGH sur `braces`

- **État :** risque non résolu ; [issue #461](https://github.com/Nabouna32/lab/issues/461), avis [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- **Pourquoi :** l’audit complet échoue sur une chaîne transitive de dépendances de développement. L’audit production-only était propre au dernier run consigné.
- **Livrable visé :** revalider les métadonnées amont et tester un correctif ciblé uniquement si sa sûreté et sa compatibilité sont démontrées. Ne pas rétrograder Next.js/ESLint avec `npm audit fix --force`, masquer l’avis ni affaiblir la CI.

## P1 — Décision sur le risque d’inscription publique

- **État :** décision produit/sécurité en attente ; [issue #467](https://github.com/Nabouna32/lab/issues/467).
- **Pourquoi :** la protection Supabase contre les mots de passe compromis n’est pas disponible sur l’offre Free ; l’état exact de l’inscription en production n’est pas vérifiable avec les accès actuels.
- **Livrable visé :** recueillir une preuve de configuration si l’accès le permet et documenter le choix de risque avant de promouvoir l’inscription. Aucune dépense ou modification Auth de production sans décision applicable.

## P2 — Refonte progressive des parcours

- **État :** lot 1 livré ; [REFONTE.md](REFONTE.md).
- **Ordre :** recherche/exploration, système partagé, shell des pages d’outils, puis audit qualité des outils.
- **Règle :** réordonner si un défaut concret de sécurité, de justesse ou d’accessibilité présente un impact supérieur. Ne pas lancer un nouveau lot visuel sans preuve ni valider le rendu uniquement par lecture du code.

## P2 — Alertes Supabase Performance et index inutilisés

- **État :** surveillance, pas de défaut confirmé ; [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **Règle :** ne pas modifier les politiques RLS ni supprimer les index sur la seule base de l’Advisor et de compteurs issus d’une base peu sollicitée. Réévaluer avec une preuve de plan ou une charge représentative.
