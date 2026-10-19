# Loculary — backlog priorisé

Dernière révision : 2026-10-20. File de travail unique. Les preuves et priorités de reprise sont dans [PROJECT-STATE.md](PROJECT-STATE.md), les risques et blocages dans [KNOWN-ISSUES.md](KNOWN-ISSUES.md), et les lots UX dans [REFONTE.md](REFONTE.md).

## P1 — Audit de justesse et confidentialité des outils (priorité active)

- **État :** continu ; checkpoint [issue #741](https://github.com/Nabouna32/lab/issues/741).
- **Pourquoi :** les audits statiques ne prouvent pas la justesse métier ni le comportement des entrées limites. Les correctifs EXIF, CSV et compresseur ont déjà révélé des défauts concrets.
- **Livrable visé :** choisir un outil par reprise ; vérifier calcul/format, limites, erreurs, FR/EN et flux de données ; ajouter des tests de régression à chaque défaut confirmé.
- **Dernier lot livré :** la [PR #801](https://github.com/Nabouna32/lab/pull/801) retire `trimEnd()` du Formateur YAML : les espaces de fin et retours à la ligne peuvent être des données significatives dans les scalaires `|-`, `|` et `|+`. Les tests vérifient l’égalité des valeurs analysées avant/après formatage pour plusieurs règles de chompage. CI complète verte sur `cda57396e0264fa12c133414c48f047f2110cd15` ([run #39334059750](https://github.com/Nabouna32/lab/actions/runs/39334059750)).
- **Lot précédent :** la [PR #798](https://github.com/Nabouna32/lab/pull/798) corrige le rejet du zéro absolu exact dans le Convertisseur d’unités malgré l’arrondi flottant Fahrenheit → Kelvin.
- **Lot UX précédent livré :** la [PR #796](https://github.com/Nabouna32/lab/pull/796) remplit l’état initial de la page de recherche avec quatre raccourcis d’outils publiés réutilisant les liens rapides de l’accueil. Titres et descriptions sont localisés FR/EN ; routes canoniques conservées, aucun transfert ni stockage ajouté. Le test de contrat, lint, typecheck, tests et build ont réussi sur `668256b5fb5645a020869e797ce2c3aae53f04eb` ([CI #39331374660](https://github.com/Nabouna32/lab/actions/runs/39331374660)).
- **Lot précédent :** la [PR #791](https://github.com/Nabouna32/lab/pull/791) remplace la soustraction brute des champs année/mois/jour par un calcul d’anniversaires calendaires successifs. Les tests couvrent le 29 février (anniversaire retenu le 28 février en année non bissextile), les fins de mois, les heures différentes d’un même jour et les dates futures invalides. La convention est explicitée en français et en anglais par la [PR #792](https://github.com/Nabouna32/lab/pull/792).

## P1 — Finding npm HIGH sur `braces`

- **État :** risque non résolu ; [issue #461](https://github.com/Nabouna32/lab/issues/461), avis [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- **Pourquoi :** l'audit complet échoue sur une chaîne transitive de dépendances de développement ; aucun correctif amont n'était publié lors de la dernière vérification documentée.
- **Livrable visé :** revalider les métadonnées et ne tester un correctif ciblé que si sa sûreté et sa compatibilité sont démontrées. Pas de rétrogradation forcée, d'avis masqué ni d'affaiblissement de la CI.

## P1 — Décision sur le risque d’inscription publique

- **État :** décision produit/sécurité en attente ; [issue #467](https://github.com/Nabouna32/lab/issues/467).
- **Pourquoi :** la protection Supabase contre les mots de passe compromis n'est pas disponible sur l'offre Free ; l'état exact de l'inscription en production n'est pas vérifiable avec les accès actuels.
- **Livrable visé :** établir une preuve de configuration et documenter le choix avant de promouvoir l'inscription. Aucune dépense ni modification Auth de production sans autorisation applicable.

## P0 — Validation navigateur reproductible avant lancement (bloquée)

- **État :** gap suivi dans [issue #765](https://github.com/Nabouna32/lab/issues/765), mais implémentation bloquée par la contradiction de règles documentée dans [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **Conflit :** `docs/Mandat.md` §5 demande Playwright, tandis que §4 et `AGENTS.md` interdisent explicitement d'ajouter cette automatisation sauf demande explicite dédiée. Ne pas ajouter Playwright/E2E ou workflows associés tant que cette autorisation spécifique n'est pas donnée.
- **Livrable envisagé après résolution :** rapports texte lisibles en CI et sous `docs/rapports-visuels/`, couvrant géométrie, contrastes axe-core, arbre d'accessibilité, erreurs console, Lighthouse, mise en page, mobile/desktop et thèmes clair/sombre. Aucun cache distant ni transfert d'artefacts ; réutiliser les caches locaux du runner Windows.

## P2 — Refonte progressive des parcours
- **Lot UX livré :** la page de recherche sans requête propose maintenant quatre tâches de démarrage grâce à la [PR #796](https://github.com/Nabouna32/lab/pull/796). L’audit complet de la recherche/exploration (états clavier, suggestions et absence de résultats) reste à faire.


- **État :** lot 1 livré ; [REFONTE.md](REFONTE.md).
- **Ordre :** recherche/exploration, système partagé, shell des pages d'outils, puis audit qualité des outils.
- **Règle :** réordonner si un défaut concret de sécurité, de justesse ou d'accessibilité présente un impact supérieur. Ne pas valider le rendu uniquement par lecture du code.

## P2 — Alertes Supabase Performance et index inutilisés

- **État :** surveillance, pas de défaut confirmé ; [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **Règle :** ne pas modifier les politiques RLS ni supprimer les index sur la seule base de l'Advisor et de compteurs issus d'une base peu sollicitée. Réévaluer avec une preuve de plan ou une charge représentative.
