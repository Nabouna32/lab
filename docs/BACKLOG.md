# Loculary — backlog priorisé

Dernière révision : 2026-10-20. File de travail unique.

- **Dernière livraison UX — générateur de mots de passe :** la [PR #821](https://github.com/Nabouna32/lab/pull/821) est fusionnée dans `b66184eae8cfc82f48d3571bbe7c95da4205adef`. Elle ajoute une jauge de robustesse indicative FR/EN basée sur la longueur et l’alphabet choisi, avec tests des seuils. La valeur est explicitement présentée comme une estimation théorique, pas une garantie de sécurité. Lint, typecheck, tests et build réussis sur le SHA exact `c8f2a10efeaa02611df25b73d77e8cab3e4ac2a9` ([CI #39343065383](https://github.com/Nabouna32/lab/actions/runs/39343065383)).

Les preuves et priorités de reprise sont dans [PROJECT-STATE.md](PROJECT-STATE.md), les risques et blocages dans [KNOWN-ISSUES.md](KNOWN-ISSUES.md), et les lots UX dans [REFONTE.md](REFONTE.md).

## P1 — Audit de justesse et confidentialité des outils (priorité active)

- **État :** continu ; checkpoint [issue #741](https://github.com/Nabouna32/lab/issues/741).
- **Pourquoi :** les audits statiques ne prouvent pas la justesse métier ni le comportement des entrées limites. Les correctifs EXIF, CSV et compresseur ont déjà révélé des défauts concrets.
- **Livrable visé :** choisir un outil par reprise ; vérifier calcul/format, limites, erreurs, FR/EN et flux de données ; ajouter des tests de régression à chaque défaut confirmé.
- **Dernier lot livré — convertisseur de bases :** `parseNumber` refuse les entrées de plus de 4 096 caractères avant le calcul itératif `BigInt`; le champ ne tronque pas les valeurs collées, et l’aide/erreur précisent la limite en FR/EN. Test de régression à la frontière. [PR #818](https://github.com/Nabouna32/lab/pull/818), fusionnée dans `3a4e39390ebc54755933ad96510055e89d72ca53`; lint, typecheck, tests et build réussis sur `4eea5e6ad2b09b3465f3b0ebde97886a4ebb2a23` ([CI #39341622410](https://github.com/Nabouna32/lab/actions/runs/39341622410)). Le déploiement correspondant est `READY` sur le commit applicatif `3a4e39390ebc54755933ad96510055e89d72ca53` ([détails](https://vercel.com/nabouna32/loculary/CCn91WUDr7usT9EmWuzqM652xsvd)).
- **Dernier audit — calculateur de date :** la saisie date était convertie par `new Date(...)` sans vérifier que le jour existe réellement, ce qui peut normaliser une date impossible vers un autre jour. Le parseur partagé vérifie maintenant le format et les composantes calendaires ; tests pour jours hors mois, année bissextile et formats invalides. [PR #814](https://github.com/Nabouna32/lab/pull/814), fusionnée ; lint, typecheck, tests et build réussis ([CI #39339994968](https://github.com/Nabouna32/lab/actions/runs/39339994968)).
- **Dernier lot de justesse livré — expression Cron :** le parseur n'accepte plus les valeurs numériques qui ne respectent pas la syntaxe décimale Cron (`1e1`, `1.0`, `+1`) ni ces formes dans les pas/plages. Tests de régression ajoutés dans [PR #812](https://github.com/Nabouna32/lab/pull/812). Lint, typecheck, tests et build ont réussi sur `1055b86da6bfa833bbb82f8bdf93cb6cfddbb0bb` ([CI #39339270861](https://github.com/Nabouna32/lab/actions/runs/39339270861)). Aucun changement de dépendance ou de flux de données.
- **Dernier lot justesse / Base64 livré :** la [PR #810](https://github.com/Nabouna32/lab/pull/810) rejette le padding explicite mal formé et les bits de padding non canoniques, tout en acceptant le Base64 canonique avec ou sans padding. Tests de régression ajoutés pour `Zg=`, `Zm8==`, `Zh==`, `Zm9=` et les formes valides de `f` / `fo`. Lint, typecheck, tests et build ont réussi sur le SHA exact `e9542d328c82793974ad21ac0490bb3c1ce4adce` ([CI #39338567970](https://github.com/Nabouna32/lab/actions/runs/39338567970)); fusion squash dans `d23ee0bcd3d017b3c306a1df21d30dac66453ca0`.
- **Dernier lot accessibilité livré :** la [PR #807](https://github.com/Nabouna32/lab/pull/807) annonce le nombre de suggestions de recherche aux technologies d’assistance grâce à une région `role="status"` avec `aria-live="polite"` et `aria-atomic="true"`. Le test de contrat est étendu ; lint, typecheck, tests et build ont réussi sur le SHA exact `a83381a429dcefa80048148712318a46db7b26ee` ([CI #39337838191](https://github.com/Nabouna32/lab/actions/runs/39337838191)). Aucun test navigateur n’a été exécuté.
- **Lot performance / robustesse précédent :** la [PR #805](https://github.com/Nabouna32/lab/pull/805) refuse les entrées JSON de plus de 200 000 caractères avant parsing, formatage et minification. Le message de limite est localisé FR/EN et n’expose pas l’exception interne ; des tests couvrent les trois chemins. Lint, typecheck, tests et build ont réussi sur `0987b92c06a5619ef0d89d4c753622256654655d` ([CI #39336447617](https://github.com/Nabouna32/lab/actions/runs/39336447617)).
- **Lot UX précédent :** la [PR #803](https://github.com/Nabouna32/lab/pull/803) affiche le message détaillé du parseur YAML sous la ligne/colonne, avec libellé localisé FR/EN. Le message générique de limite de ressources reste localisé et n’expose pas l’exception brute. Le test de contrat, lint, typecheck, tests et build ont réussi sur `2c6b8a02fd3d16b635236f97ab32ab13056cc626` ([run #39335148238](https://github.com/Nabouna32/lab/actions/runs/39335148238)).
- **Lot précédent de justesse livré :** la [PR #801](https://github.com/Nabouna32/lab/pull/801) retire `trimEnd()` du Formateur YAML afin de préserver les espaces de fin et retours à la ligne significatifs des scalaires `|-`, `|` et `|+`. Les tests comparent les valeurs analysées avant/après ; CI complète verte sur `cda57396e0264fa12c133414c48f047f2110cd15` ([run #39334059750](https://github.com/Nabouna32/lab/actions/runs/39334059750)).
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
- **Accessibilité des résultats livrée :** [PR #816](https://github.com/Nabouna32/lab/pull/816) expose le chargement, les erreurs et le nombre de résultats de la page complète comme une seule région `role="status"` / `aria-live="polite"`. Le test de contrat passe en CI ; aucun contrôle avec lecteur d'écran ou navigateur n'a été exécuté. L'audit complet du clavier, des suggestions et de l'état vide reste ouvert.


- **État :** lot 1 livré ; [REFONTE.md](REFONTE.md).
- **Ordre :** recherche/exploration, système partagé, shell des pages d'outils, puis audit qualité des outils.
- **Règle :** réordonner si un défaut concret de sécurité, de justesse ou d'accessibilité présente un impact supérieur. Ne pas valider le rendu uniquement par lecture du code.

## P2 — Alertes Supabase Performance et index inutilisés

- **État :** surveillance, pas de défaut confirmé ; [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **Règle :** ne pas modifier les politiques RLS ni supprimer les index sur la seule base de l'Advisor et de compteurs issus d'une base peu sollicitée. Réévaluer avec une preuve de plan ou une charge représentative.
