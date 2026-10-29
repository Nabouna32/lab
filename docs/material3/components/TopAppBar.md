# TopAppBar — contrat AndroidX Material 3 vers React/Web

**État :** portage partiel ; un écart typographique et un bouton de navigation inerte ont été corrigés. La parité complète du comportement, des couleurs au défilement et du rendu navigateur reste non vérifiée.

## Sources épinglées

Snapshot AndroidX : `2fb1702c1c62a6059e73d757d9e4eda1044ce21d`.

- [AppBar.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt)
- [TopAppBarSmallTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarSmallTokens.kt)
- [TopAppBarMediumTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarMediumTokens.kt)
- [TopAppBarLargeTokens.kt](https://android.googlesource.com/platform/frameworks/support/+/2fb1702c1c62a6059e73d757d9e4eda1044ce21d/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TopAppBarLargeTokens.kt)

## Contrat source vérifié

| Variante | Hauteur de référence | Typographie du titre |
|---|---:|---|
| `TopAppBar` / petite | 64 dp | `titleLarge` |
| `CenterAlignedTopAppBar` | 64 dp | `titleLarge` |
| `MediumTopAppBar`, déployée | 112 dp | `headlineSmall` |
| `LargeTopAppBar`, déployée | 152 dp | `headlineMedium` |
| Titres repliés des variantes moyenne/grande | 64 dp | `titleLarge` |

Les couleurs et dimensions ci-dessus sont les valeurs des tokens dans ce snapshot ; dp reste une unité Android, pas une équivalence physique CSS. Les variantes moyenne et grande utilisent aussi un comportement de défilement et une interpolation des couleurs propres à AndroidX.

## Portage Web

`src/components/ui/TopAppBar.tsx` expose les variantes `small`, `center-aligned`, `medium` et `large`. Le CSS réutilise les rôles typographiques partagés.

Le bouton de navigation est rendu uniquement lorsqu'un gestionnaire `onNavigationClick` est fourni. L'icône de menu et le libellé accessible « Open navigation » ont des valeurs de secours, mais une barre sans action de navigation n'affiche pas de bouton inerte. Les consommateurs doivent fournir un libellé traduit et adapté au contexte. C'est une adaptation Web de l'emplacement facultatif de navigation AndroidX.

Le challenge global « page blanche » s'applique ici aussi : si ce composant était conçu aujourd'hui, il faudrait vérifier s'il doit rester un port générique ou être remplacé/composé avec les primitives de navigation réellement nécessaires aux différents parcours. Cette question n'est pas tranchée par le simple fait que le composant existe.

## Écarts corrigés et vérifications restantes

Le titre déployé de `MediumTopAppBar` utilisait auparavant `headlineMedium`, comme la variante grande, et les titres repliés avaient une taille codée en dur de 22/28 px. Ils utilisent maintenant respectivement les rôles partagés `headlineSmall` et `titleLarge`.

Le bouton de navigation ne s'affiche plus lorsqu'aucune action n'est fournie ; une assertion statique couvre ce contrat.

Restent à comparer avec AndroidX : les insets, l'alignement des actions, le comportement de défilement et d'interpolation, les états d'élévation, le clavier, les thèmes clair/sombre et les largeurs responsive. Les corrections de typographie et de contrat ne prouvent pas la conformité complète.
