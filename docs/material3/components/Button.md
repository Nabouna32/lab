# Button — portage AndroidX Material 3

**État : portage en cours ; conformité complète non démontrée.**

## Autorité et sources

La référence est le code AndroidX Jetpack Compose Material 3, figé au commit [`5113b82a4ed6416d6344efa50e41db8cb65928ff`](https://github.com/androidx/androidx/commit/5113b82a4ed6416d6344efa50e41db8cb65928ff) de la branche `androidx-compose-material3-release`.

- [Button.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
- [BaselineButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/BaselineButtonTokens.kt)
- [ButtonSmallTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonSmallTokens.kt)
- [Ripple.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Ripple.kt)
- [FilledButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledButtonTokens.kt)
- [ElevatedButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt)
- [FilledTonalButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt)
- [OutlinedButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt)
- [TextButtonTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt)
- [StateTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- [Surface.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Surface.kt)
- [ColorScheme.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt)
- [Référence API Button](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable), [ButtonDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults) et [guide officiel](https://developer.android.com/develop/ui/compose/components/button).

La référence est désormais alignée sur Compose Material 3 1.4.0 stable, commit source `5113b82a4ed6416d6344efa50e41db8cb65928ff`. L’archive des sources publiées a été comparée à 249 fichiers Kotlin du commit, sans divergence ; voir le [manifeste de provenance Material 3 1.4.0](../catalog/baselines/material3-1.4.0.json).

## Contrat AndroidX vérifié dans la source

- Largeur minimale : 58 dp ; hauteur minimale : 40 dp.
- Padding standard : 24 dp horizontal et 8 dp vertical.
- Avec icône initiale : 16 dp au début, 24 dp à la fin et 8 dp verticalement.
- TextButton : 12 dp horizontal ; avec icône, 12 dp au début et 16 dp à la fin.
- Icône : 18 dp ; espace icône-libellé : 8 dp.
- `labelLarge` : 14 sp, graisse moyenne, hauteur de ligne 20 sp, espacement des lettres 0,1 sp.
- Opacité des couches d’état : survol 8 %, focus 10 %, appui 10 %, glissement 16 %. `RippleDefaults.RippleAlpha` réutilise ces mêmes tokens pour les états hover/focus/press/drag ; le ripple pressé est donc à 10 %.
- Les cinq variantes définissent leurs propres couleurs et élévations. `ElevatedButton` applique une teinte de surface à 1 dp au repos et 3 dp au survol ; `Button` et `FilledTonalButton` passent de 0 à 1 dp au survol ; `OutlinedButton` et `TextButton` n’ont pas d’élévation par défaut.
- `Button` et `ElevatedButton` : conteneur désactivé `onSurface` à 10 %, contenu `onSurface` à 38 %.
- `FilledTonalButton` : conteneur désactivé `onSurface` à 12 %, contenu `onSurface` à 38 %.
- `OutlinedButton` : conteneur transparent, contour `outlineVariant` à 10 %, contenu `onSurfaceVariant` à 38 %.
- `TextButton` : conteneur transparent, contenu `onSurfaceVariant` à 38 %.

Les valeurs Android dp/sp sont traduites en unités CSS pour le port Web. Une égalité numérique ne garantit pas une taille physique identique ni un rendu pixel à pixel.

## Contrat React/Web partagé

`src/components/ui/Button.tsx` expose les cinq noms AndroidX et utilise un moteur interne commun. `src/components/ui/AppLink.tsx` réutilise les styles de variantes, le layout partagé et le ripple tout en conservant un véritable lien HTML.

Le layout commun est défini dans `src/components/ui/material-button-layout.ts` : typographie `labelLarge`, géométrie, padding logique, espacement du contenu, transitions et focus visible. Une correction de ce contrat se propage donc aux boutons et aux liens qui adoptent leur apparence. Les couleurs et états propres aux variantes restent dans `material-button-variant-styles.ts`.

Adaptations Web déclarées :

- `shape` mappe AndroidX `Shape` vers `border-radius` CSS.
- `border` mappe `BorderStroke` vers la propriété CSS `border`.
- `contentPadding` mappe `PaddingValues` vers les insets logiques CSS.
- `multiline` est une extension de mise en page Web.
- `AppLink` reste une ancre : activation native par Entrée, pas par Espace.
- Le ripple est rendu par événements pointeur/clavier et CSS ; il ne prétend pas reproduire le moteur Compose.

## Choisir une variante

- `Button` : action principale à forte emphase.
- `FilledTonalButton` ou `ElevatedButton` : emphase secondaire lorsque leur contrat de surface et d’élévation convient.
- `OutlinedButton` : action secondaire avec contour.
- `TextButton` : action contextuelle à faible emphase.

AndroidX ne définit pas de variante « destructive ». Le sens métier ne suffit pas à prescrire un fond rouge, une icône ou une boîte de dialogue : choisir le composant selon le contexte et ne personnaliser les rôles d’erreur que si l’action le justifie. La navigation doit rester un lien.

## Vérifications restantes

- [x] Épingler les fichiers source et tokens au même commit AndroidX.
- [x] Vérifier les rôles et opacités des couleurs désactivées.
- [x] Vérifier les dimensions, couleurs, élévations et états des cinq variantes dans les sources.
- [x] Partager le contrat de layout entre `Button` et `AppLink`.
- [ ] Inventorier tous les usages de production et migrer les styles locaux hérités.
- [x] Vérifier en Chromium les couleurs calculées des cinq variantes en thème clair, les états hover/disabled, le basculement clair/sombre sur la variante filled et le reflow à 320, 360, 390, 768, 1024, 1440 et 1920 CSS px sur une surface de test locale.
- [ ] Terminer la revue du contraste en contexte : axe-core ne relève aucune violation sur la surface de test, mais conserve un résultat `color-contrast` incomplet qui nécessite une vérification manuelle.
- [x] Vérifier l’origine du ripple, son clipping, la libération sur `pointerup` et `pointercancel`, le déclenchement clavier, le nettoyage après animation et l’absence de ripple sous `prefers-reduced-motion`.
- [x] Vérifier l’absence de débordement horizontal sur petits écrans et grands écrans (320–1920 CSS px) sur la surface de test.
- [ ] Tester les libellés FR/EN longs, l’alignement des icônes et le zoom à 200 %.
- [x] Exécuter tests, lint, vérification TypeScript et build sur le dernier commit : 744 tests réussis, 2 ignorés ; lint sans erreur (8 avertissements existants) ; TypeScript et build réussis ; CI #4611 verte sur `080b627`.
- [ ] Comparer le rendu navigateur aux références épinglées et consigner les écarts observés.

Validation navigateur locale du 30 octobre 2026 : Chromium/Playwright sur une route de test temporaire non livrée, sans Preview ni déploiement. Les cinq variantes ont été inspectées en thème clair/sombre ; les couleurs disabled ont été comparées aux rôles par variante. Le ripple a été exercé par pointeur et clavier, y compris `pointercancel`, puis sous réduction des animations. axe-core 4.14.0 ne détecte aucune violation WCAG 2.0/2.1 A/AA ni WCAG 2.2 AA sur cette surface ; `color-contrast` et `label-content-name-mismatch` restent incomplets et demandent une revue manuelle. Cette vérification ciblée ne vaut pas déclaration de conformité globale. L’inventaire exhaustif des usages de production et la comparaison visuelle aux références AndroidX restent à faire.
