# TopAppBar — contrat AndroidX Material 3 vers React/Web

**État au 31 octobre 2026 :** la petite variante est intégrée au header global de Loculary. Le titre et les actions sont des slots React ; le bouton de navigation est facultatif et son libellé doit être fourni par le consommateur. Les variantes centrée, moyenne et grande restent recensées dans l'inventaire AndroidX, mais ne sont pas portées faute de parcours produit qui les consomme.

## Sources épinglées

Snapshot AndroidX : `2fb1702c1c62a6059e73d757d9e4eda1044ce21d`.

- [AppBar.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt)
- [TopAppBarSmallTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarSmallTokens.kt)
- [TopAppBarMediumTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarMediumTokens.kt)
- [TopAppBarLargeTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarLargeTokens.kt)

## Contrat source vérifié

| Variante AndroidX | Hauteur de référence | Typographie du titre | État du port |
|---|---:|---|---|
| `TopAppBar` / petite | 64 dp | `titleLarge` | Portée et consommée par le header global |
| `CenterAlignedTopAppBar` | 64 dp | `titleLarge` | Inventaire uniquement |
| `MediumTopAppBar`, déployée | 112 dp | `headlineSmall` | Inventaire uniquement |
| `LargeTopAppBar`, déployée | 152 dp | `headlineMedium` | Inventaire uniquement |
| Titres repliés des variantes moyenne/grande | 64 dp | `titleLarge` | Inventaire uniquement |

Les valeurs dp sont des références Android, pas une équivalence physique CSS. Le port Web utilise une hauteur minimale de 64 CSS px pour la petite variante et conserve les rôles typographiques partagés.

## Portage Web retenu

`src/components/ui/TopAppBar.tsx` expose uniquement le contrat réellement consommé :

- `title: ReactNode` : équivalent du slot composable AndroidX. Le contenu n'est pas forcé dans un élément `h2`, car le titre d'une barre d'application n'est pas le titre hiérarchique de la page.
- `actions: ReactNode` : actions alignées à droite.
- `navigationIcon: ReactNode`, `navigationLabel` et `onNavigationClick` : ces trois propriétés sont requises ensemble lorsque l'action de navigation est utilisée ; aucun icône ou libellé par défaut n'est inventé.
- `contentStyle` : adaptation Web minimale pour les gutters et la largeur maximale du contenu.
- La racine est un landmark HTML `header`. La navigation réelle reste un groupe de liens dans un landmark `nav` distinct.

### Consommateur de production

`src/components/layout/Header.tsx` compose la petite TopAppBar :

- Le slot titre contient le lien de marque Loculary, affiché sur mobile.
- Les actions contiennent la recherche et le menu de navigation.
- Le contenu reste contraint par `--layout-content-wide` et `--layout-page-gutter`.
- La barre conserve son positionnement sticky et son nom de transition.
- La hauteur passe de 56 à 64 CSS px sur mobile : alignement volontaire sur la référence 64 dp de la petite TopAppBar.
- Le menu expose ses liens dans un landmark `nav` avec le libellé localisé « Navigation principale » / « Primary navigation ».

Les variantes moyenne, grande et centrée ne sont pas conservées dans le code tant qu'aucun parcours produit ne les consomme. Leurs contrats AndroidX restent dans l'inventaire officiel.

## Vérifications et limites

### Vérifications statiques et Production

- [x] Tests de contrat : slots composables, absence de sémantique heading inventée, action de navigation facultative et libellé obligatoire.
- [x] Tests de migration : le header utilise TopAppBar, les gutters restent centralisés et le landmark de navigation est localisé.
- [x] CI sur le commit de fusion : lint, typecheck, tests, audit npm, build et gate Node.js 24.21.0.
- [x] Production `loculary.vercel.app` sur le commit `9725e09662005118a14c3b6d04992a04fb59f8fa` : chargement FR/EN, marque visible, recherche et menu ouvrables, fermeture Escape, focus automatique dans le champ de recherche, landmark `nav` nommé « Navigation principale » en FR et absence de débordement horizontal sur les viewports observés.
- [x] Source CSS : la ligne de la petite TopAppBar applique `min-height: 64px`. Cette valeur est vérifiée dans le code livré, pas mesurée comme hauteur calculée du navigateur.

### Vérifications non réalisées

- [ ] Viewports exacts 390×844, 768×1024 et 1440×900 : l'outil navigateur n'a pas permis de les imposer. Observations réelles uniquement : FR environ 1268×981 et 1366×948 ; EN environ 1090×961.
- [ ] Mesure DOM calculée (`getBoundingClientRect`, `getComputedStyle`) de la hauteur réelle : non accessible dans la session navigateur. Ne pas reprendre l'estimation visuelle initiale d'environ 48 px, qui n'était pas une mesure fiable.
- [ ] Tab, ordre complet de focus, restitution du focus après Escape et validation par lecteur d'écran.
- [ ] Comparaison des couleurs, insets, espacements et états avec AndroidX en thèmes clair/sombre.
- [ ] Comportement du panneau de recherche aux largeurs mobiles/tablettes et validation des breakpoints.

La petite variante est intégrée et utilisée en Production. Les observations navigateur couvrent des interactions réelles mais ne prouvent pas la parité visuelle complète ni l'accessibilité exhaustive. Aucun comportement de défilement/collapse des variantes moyenne/grande n'est revendiqué, car ces variantes ne sont pas portées.
