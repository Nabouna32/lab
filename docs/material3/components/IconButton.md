# IconButton — portage AndroidX Material 3

**État :** portage en cours ; conformité complète non démontrée.  
**Implémentation React actuelle :** `src/components/ui/IconButton.tsx` expose séparément les huit composants AndroidX action/toggle, utilise des rôles de couleur distincts, accepte les surcharges `colors` inspirées d’AndroidX et adapte `shape` au Web. Le ripple partagé est une adaptation Web bornée ; la parité complète n’est pas revendiquée.

## Autorité et sources amont

- [Guide officiel Material 3 — Icon button](https://m3.material.io/components/icon-button/overview)
- [AndroidX IconButton.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt)
- [AndroidX IconButtonDefaults.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButtonDefaults.kt)
- [AndroidX IconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/IconButtonTokens.kt)
- [AndroidX StateTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- [AndroidX Ripple.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Ripple.kt)
- [AndroidX SmallIconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt)
- [AndroidX FilledIconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledIconButtonTokens.kt)
- [AndroidX FilledTonalIconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt)
- [AndroidX OutlinedIconButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedIconButtonTokens.kt)
- [WCAG 2.2 — taille minimale des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 — apparence du focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

**Baseline stable :** Compose Material 3 1.4.0, commit source `5113b82a4ed6416d6344efa50e41db8cb65928ff`. L’archive des sources publiées a été comparée aux 249 fichiers Kotlin du commit, sans divergence ; voir le [manifeste de provenance Material 3 1.4.0](../catalog/baselines/material3-1.4.0.json).

## Contrat AndroidX et constats

AndroidX expose quatre composants d’action — `IconButton`, `FilledIconButton`, `FilledTonalIconButton`, `OutlinedIconButton` — et leurs quatre composants toggle correspondants. Un bouton d’action n’est pas un toggle : l’état coché appartient aux API toggle, pas à une prop `selected` générique.

La source stable 1.4.0 établit les rôles suivants :

- `IconButton` standard : contenu désactivé dérivé de `LocalContentColor` à 38 % ; dans le contexte de surface par défaut, il s’agit de `onSurfaceVariant`.
- `FilledIconButton` et `FilledTonalIconButton` : conteneur désactivé `onSurface` à 10 %, icône désactivée `onSurface` à 38 %.
- Les variantes Web outlined conservent le mapping vibrant recommandé par la spécification : contour `outlineVariant`, contenu actif `onSurfaceVariant`. Le contour désactivé utilise `outlineVariant` à 38 % et l’icône désactivée `onSurface` à 38 %. Le conteneur désactivé du toggle outlined coché utilise `onSurface` à 10 %.
- Les toggles standard héritent de `LocalContentColor` à 38 % lorsqu’ils sont désactivés ; les toggles filled et filled-tonal utilisent `onSurface` à 38 %.
- Les couches d’état utilisent hover 8 %, focus 10 % et pressed 10 %. `RippleDefaults.RippleAlpha` reprend les mêmes valeurs de `StateTokens` ; le ripple Web utilise 10 % à l’appui.

L’implémentation React sépare les rôles action/toggle et déclare explicitement le mapping outlined vibrant. Le mélange CSS reste une adaptation Web, pas un rendu Compose pixel-identique.

## Adaptations React/Web

- Utiliser un vrai bouton HTML avec un nom accessible pertinent ; l’icône décorative ne doit pas constituer le seul libellé accessible. Le paramètre AndroidX `enabled` est traduit en attribut natif `disabled` ; `disabled` reste un alias de compatibilité Web.
- Vérifier l’activation clavier, le focus visible, l’absence d’activation à l’état désactivé et la cible tactile en contexte.
- Vérifier les couleurs calculées du contenu, du conteneur et du contour dans les thèmes clair et sombre.
- Le ripple partagé adapte `ripple()` de Compose au Web : il est découpé à la surface visuelle de 40 px tandis que le bouton natif conserve une cible minimale de 48 px. Les toggles gardent la sémantique native de bouton et exposent leur état coché avec `aria-pressed`, le modèle Web établi ; ils ne sont pas exposés comme des cases à cocher.
- `shape` mappe Compose `Shape` à `border-radius` CSS ; `colors` accepte les rôles de couleur par défaut, désactivés et cochés inspirés d’AndroidX.

## Vérifications requises

- [x] Épingler les références API et tokens sur le commit stable Material 3 1.4.0, vérifié contre l’archive des sources publiées.
- [x] Séparer les huit composants d’action/toggle officiels dans l’API React ; supprimer la prop générique `variant` et l’alias non officiel `tonal`.
- [x] Mapper les rôles de couleur actif, coché/non coché et désactivé depuis les sources AndroidX épinglées ; documenter les couches d’état CSS comme adaptation Web.
- [x] Exposer les surcharges `colors` inspirées d’AndroidX pour les rôles par défaut, désactivés et cochés ; mapper `shape` à `border-radius` CSS comme adaptation Web.
- [x] Exposer la surcharge `border` source uniquement sur les variantes outlined ; mapper `BorderStroke` à la bordure CSS, avec `null` pour retirer le contour.
- [ ] Vérifier dans un navigateur le comportement des surcharges, le clipping des formes et les styles calculés.
- [x] Implémenter des rôles de couleur distincts pour les actions et les toggles, actifs et désactivés ; ajouter les couches hover, focus-visible et pressed.
- [x] Vérifier dans Chromium les noms accessibles, l’état `aria-pressed` des quatre toggles, les cibles tactiles de 48 px, les couleurs actives/désactivées et le comportement hover/focus/pressed sur la surface de test locale.
- [ ] Vérifier l’alignement des icônes, la géométrie des conteneurs, les contours, les formes et les mélanges de couleurs réels dans tous les thèmes.
- [ ] Vérifier le contraste, les libellés environnants FR/EN, le mobile et le zoom à 200 %.
- [x] Exécuter tests, lint, TypeScript et build : 744 tests réussis, 2 ignorés ; lint sans erreur (8 avertissements existants) ; TypeScript et build réussis ; CI #4611 verte sur `080b627`.
- [ ] Inspecter le rendu navigateur par rapport aux références épinglées ; consigner les différences et questions non résolues.
- [x] Migrer les points d’usage de production connus et les spécimens Design Lab des props génériques variant/selected vers les composants nommés action/toggle.
- [ ] Terminer l’inventaire exhaustif des usages de production et vérifier tous les tokens d’état CSS et le rendu navigateur réel.

La validation locale du 30 octobre 2026 a utilisé Chromium/Playwright sur une route de test temporaire non livrée, sans Preview ni déploiement. Les quatre variantes IconButton d’action et les quatre états toggle ont été exercés ; les cibles de 48 px, les noms accessibles, l’état `aria-pressed`, le hover, l’activation clavier et les couleurs disabled ont été inspectés. axe-core 4.14.0 ne détecte aucune violation WCAG 2.0/2.1 A/AA ni WCAG 2.2 AA sur la surface de test ; des contrôles de contraste et de nom de libellé restent incomplets et demandent une revue manuelle. Cette vérification ciblée ne vaut pas déclaration de conformité globale.
