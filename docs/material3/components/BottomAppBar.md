# BottomAppBar — Material 3 1.4.0

## Statut

**Port React/Web partiel.** Les deux surcharges stables, la hauteur, la couleur de surface, l'absence d'élévation par défaut, le padding, les insets et le slot FAB sont documentés et partiellement adaptés. Le scroll imbriqué expérimental, l'élévation tonale de Surface, le calcul général de `contentColorFor` et la validation visuelle restent hors de ce port.

- Artefact : `androidx.compose.material3:material3`
- Version : `1.4.0` stable
- Commit source immuable : [5113b82a4ed6416d6344efa50e41db8cb65928ff](https://github.com/androidx/androidx/tree/5113b82a4ed6416d6344efa50e41db8cb65928ff)
- Source : [AppBar.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt)
- Tokens : [BottomAppBarTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/BottomAppBarTokens.kt)
- API publiée : [current.txt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/api/current.txt)
- Tests AndroidX : [AppBarTest.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/androidInstrumentedTest/kotlin/androidx/compose/material3/AppBarTest.kt)

## Surface API

La release expose deux surcharges stables :

1. `BottomAppBar(actions, modifier, floatingActionButton, containerColor, contentColor, tonalElevation, contentPadding, windowInsets)`.
2. `BottomAppBar(modifier, containerColor, contentColor, tonalElevation, contentPadding, windowInsets, content)`.

Une surcharge avec `scrollBehavior`, ainsi que `BottomAppBarState` et `BottomAppBarScrollBehavior`, relève de `ExperimentalMaterial3Api`. Elle n'est pas simulée par ce port. `FlexibleBottomAppBar` est une implémentation interne et ne devient pas une API publique du port.

Le composant Web expose `actions`, `floatingActionButton`, `containerColor`, `contentColor` et `contentPadding`. `children` est conservé comme alias de compatibilité pour le slot `actions`, pas comme troisième slot AndroidX.

## Contrat visuel et géométrie

| Propriété | AndroidX 1.4.0 |
|---|---|
| Hauteur | 80 dp |
| Couleur de conteneur | `SurfaceContainer` |
| Forme | `CornerNone` |
| Élévation par défaut | 0 dp |
| Padding par défaut | début 4 dp, haut 4 dp, fin 4 dp, bas 0 dp |
| Insets par défaut | system bars horizontales et bottom |

La hauteur de 80 dp est le token `BottomAppBarTokens.ContainerHeight`. Les insets système s'ajoutent à cette hauteur ; le port Web les adapte aux safe areas CSS `env(safe-area-inset-*)`. Convention Loculary : 1 dp = 1 px CSS logique.

Le FAB optionnel est positionné dans un slot à la fin logique de la rangée. AndroidX ajoute 8 dp de padding haut et 12 dp de padding fin à ce slot, en complément du padding de contenu de 4 dp : le FAB commence donc à 12 dp du haut et finit à 16 dp du bord logique. Le slot actions occupe l'espace restant avant le FAB. La rangée actions utilise un arrangement horizontal de début, sans espacement ajouté par BottomAppBar.

Le port n'impose ni un rôle HTML `footer` ni un landmark de pied de page : BottomAppBar est un composant d'interface, pas nécessairement le pied de page du document.

## Couleurs et élévation

- Le conteneur par défaut suit `SurfaceContainer`.
- `contentColor` par défaut suit `contentColorFor(containerColor)`. Le port Web utilise `on-surface` pour le conteneur par défaut et `currentColor` pour une couleur personnalisée non reconnue.
- `BottomAppBarDefaults.ContainerElevation` vaut **0 dp**. La barre n'a donc pas d'ombre CSS par défaut.
- `BottomAppBarDefaults.bottomAppBarFabColor` utilise `SecondaryContainer` ; le consommateur qui fournit un FAB peut lui passer ce rôle de couleur et `FloatingActionButtonDefaults.bottomAppBarFabElevation()`.
- La surcharge `tonalElevation` existe, mais son overlay dépend de la détection du rôle `surface` et du thème clair/sombre Compose. Cette adaptation Web ne prétend pas le reproduire.

## Vérifications AndroidX examinées

Les tests épinglés couvrent notamment la hauteur 80 dp, les insets horizontaux/bas, le FAB visible même lorsque les actions débordent, ainsi que le positionnement et les couleurs. Certains tests de taille sont explicitement ignorés dans la suite AndroidX ; ne pas les présenter comme des assertions actives.

## Limites et suite

- Aucun `BottomAppBarScrollBehavior`, état hoistable, nested-scroll connection, drag, snap ou fling n'est porté.
- Les insets Web ne couvrent pas tous les scénarios de barres système Android ; ils utilisent les safe areas du navigateur.
- Les couleurs personnalisées ne reproduisent pas le mapping complet `contentColorFor`.
- L'élévation tonale Compose n'est pas reproduite.
- Comparaison navigateur clair/sombre, FR/EN, largeur téléphone/tablette, RTL, safe areas réelles et focus clavier à exécuter avant de promouvoir le port.

La CI et les tests DOM ne prouvent pas la fidélité visuelle. Le statut reste `partial`.
