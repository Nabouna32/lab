# Button — portage AndroidX Material 3

**État : portage en cours ; conformité complète non démontrée.**

## Autorité et sources

La référence est le code AndroidX Jetpack Compose Material 3, figé au commit [`2fb1702c1c62a6059e73d757d9e4eda1044ce21d`](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/).

- [Button.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt)
- [ButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonTokens.kt)
- [ElevatedButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt)
- [FilledTonalButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt)
- [OutlinedButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt)
- [TextButtonTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt)
- [StateTokens.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt)
- [Surface.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Surface.kt)
- [ColorScheme.kt](https://android.googlesource.com/platform/frameworks/support/%2B/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt)
- [Référence API Button](https://developer.android.com/reference/kotlin/androidx/compose/material3/Button.composable), [ButtonDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/ButtonDefaults) et [guide officiel](https://developer.android.com/develop/ui/compose/components/button).

La révision source est immuable. La correspondance exacte avec une version publiée de l’artefact Maven n’est pas établie ; les constats ci-dessous portent sur ce snapshot.

## Contrat AndroidX vérifié dans la source

- Largeur minimale : 58 dp ; hauteur minimale : 40 dp.
- Padding standard : 24 dp horizontal et 8 dp vertical.
- Avec icône initiale : 16 dp au début, 24 dp à la fin et 8 dp verticalement.
- TextButton : 12 dp horizontal ; avec icône, 12 dp au début et 16 dp à la fin.
- Icône : 18 dp ; espace icône-libellé : 8 dp.
- `labelLarge` : 14 sp, graisse moyenne, hauteur de ligne 20 sp, espacement des lettres 0,1 sp.
- Opacité des couches d’état : survol 8 %, focus 12 %, appui 12 %. Ces valeurs ne sont pas l’alpha du ripple.
- Les cinq variantes définissent leurs propres couleurs et élévations. `ElevatedButton` applique une teinte de surface à 1 dp au repos et 3 dp au survol ; `Button` et `FilledTonalButton` passent de 0 à 1 dp au survol ; `OutlinedButton` et `TextButton` n’ont pas d’élévation par défaut.
- Les conteneurs désactivés utilisent le rôle `onSurface` à 12 % et les libellés désactivés à 38 %, selon les tokens des variantes.

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
- [ ] Vérifier en navigateur les couleurs calculées, le contraste et les états en thèmes clair/sombre.
- [ ] Vérifier l’origine, le découpage, l’annulation et le clavier du ripple ainsi que la réduction des animations.
- [ ] Tester les libellés FR/EN longs, les petits écrans, l’alignement des icônes et le zoom à 200 %.
- [ ] Exécuter tests, lint, vérification TypeScript et build sur le dernier commit.
- [ ] Comparer le rendu navigateur aux références épinglées et consigner les écarts observés.

Les assertions statiques et une CI verte ne prouvent pas la fidélité visuelle. Tant que le navigateur n’a pas été vérifié, le rendu reste non vérifié.
