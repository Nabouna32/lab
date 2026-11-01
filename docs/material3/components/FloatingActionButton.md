# FloatingActionButton — Material 3 1.4.0

## Statut

**Port React/Web partiel en reconstruction.** Les variantes et leurs valeurs géométriques, les couleurs par défaut et les presets d'élévation sont alignés sur la source AndroidX 1.4.0 épinglée. L'animation d'expansion, l'élévation tonale, les interactions hoistées et la fidélité de l'ombre restent des adaptations Web non équivalentes et ne sont pas déclarées conformes.

- Artefact : `androidx.compose.material3:material3`
- Version : `1.4.0` stable
- Commit source immuable : [5113b82a4ed6416d6344efa50e41db8cb65928ff](https://github.com/androidx/androidx/tree/5113b82a4ed6416d6344efa50e41db8cb65928ff)
- Source : [FloatingActionButton.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingActionButton.kt)
- API publiée : [current.txt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/api/current.txt)
- Tests AndroidX : [FloatingActionButtonTest.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/androidInstrumentedTest/kotlin/androidx/compose/material3/FloatingActionButtonTest.kt)
- Tokens : `FabBaselineTokens`, `FabSmallTokens`, `FabLargeTokens`, `FabPrimaryContainerTokens`, `ExtendedFabPrimaryTokens` et `ElevationTokens` dans le même commit.

## Surface API stable

La baseline 1.4.0 expose cinq déclarations publiques dans `FloatingActionButton.kt` :

- `FloatingActionButton`
- `SmallFloatingActionButton`
- `LargeFloatingActionButton`
- `ExtendedFloatingActionButton(onClick, content: RowScope.() -> Unit)`
- `ExtendedFloatingActionButton(text, icon, onClick, expanded, ...)`

Chaque variante reçoit `onClick`, `modifier`, `shape`, `containerColor`, `contentColor`, `elevation` et `interactionSource`. Le port Web conserve les variantes et la personnalisation utile, utilise un vrai élément `button` et conserve `type="button"` par défaut.

## Géométrie et formes

Convention du projet : 1 dp Android = 1 px CSS logique.

| Variante | Largeur minimale | Hauteur minimale | Forme |
|---|---:|---:|---|
| FAB | 56 dp | 56 dp | `CornerLarge` (16 px) |
| Small FAB | 40 dp | 40 dp | `CornerMedium` (12 px) |
| Large FAB | 96 dp | 96 dp | `CornerExtraLarge` (28 px) |
| Extended FAB | 80 dp | 56 dp | `CornerLarge` (16 px) |
| Extended FAB replié (icône/texte) | 56 dp | 56 dp | `CornerLarge` (16 px) |

Les contraintes sont minimales, pas des dimensions fixes : un contenu plus grand peut agrandir le bouton. `FloatingActionButtonDefaults.LargeIconSize` vaut 36 dp ; les tokens d'icône du petit et du grand FAB ne doivent pas être confondus avec cette propriété publique recommandée.

Pour l'Extended FAB icône/texte : padding de début 16 dp, espacement icône/texte 12 dp et padding de fin 20 dp à l'état développé. À l'état replié, la largeur minimale revient à 56 dp, les paddings disparaissent et l'icône est centrée. L'autre surcharge Extended FAB réserve 20 dp de padding horizontal et une largeur minimale de 80 dp.

## Couleurs

- `containerColor` par défaut : `primaryContainer`.
- `contentColor` : `contentColorFor(containerColor)`, donc la couleur de contenu sémantique associée lorsqu'elle est connue du thème, sinon `LocalContentColor`.
- Le port Web utilise `on-primary-container` pour la valeur de conteneur par défaut. Pour une couleur de conteneur personnalisée, il hérite de `currentColor` par défaut ; le consommateur fournit `contentColor` explicitement lorsqu'il souhaite une autre association sémantique.
- Les valeurs CSS arbitraires ne permettent pas de reproduire le calcul Compose `contentColorFor` sur l'ensemble du `ColorScheme`. Cette limite est explicite.

## Élévation

Valeurs exactes des presets source :

| Preset | Default | Pressed | Focused | Hovered |
|---|---:|---:|---:|---:|
| `elevation()` | 6 dp | 6 dp | 6 dp | 8 dp |
| `loweredElevation()` | 1 dp | 1 dp | 1 dp | 3 dp |
| `bottomAppBarFabElevation()` | 0 dp | 0 dp | 0 dp | 0 dp |

Le port Web expose ces mêmes presets. Les ombres CSS sont une approximation de l'élévation d'ombre Compose et ne reproduisent pas son rendu Android pixel pour pixel. Compose applique aussi une élévation tonale à Surface ; l'overlay tonal dépend du rôle de couleur et n'est pas encore reproduit pour un conteneur Web personnalisé utilisant une couleur de surface.

## Typographie et états

AndroidX fournit le style `LabelLarge` au contenu. Le CSS partagé applique les tokens Loculary correspondants à toutes les variantes, et non uniquement à l'Extended FAB.

Les états hover, focus-visible, pressed et disabled utilisent les états natifs du bouton et des règles CSS. Le focus-visible et `prefers-reduced-motion` sont pris en charge. La désactivation est une adaptation Web via l'attribut HTML `disabled` ; l'API AndroidX 1.4.0 ne publie pas de paramètre `enabled` sur ces fonctions FAB.

L'API AndroidX expose un `MutableInteractionSource` hoistable. Le port Web n'expose pas encore d'équivalent observable : les états proviennent des pseudo-classes natives CSS. Les courbes et durées de l'animation d'expansion sont une approximation CSS des MotionScheme AndroidX.

## Vérifications et limites

Les tests DOM vérifient les variantes, les noms accessibles fournis, les états développé/replié, la désactivation native, la résolution de couleur personnalisée et les trois presets d'élévation. Les tests AndroidX épinglés couvrent notamment dimensions, centrage du contenu, sémantique, placement icône/texte, expansion et changements d'élévation pendant interaction.

Avant de promouvoir le statut :

- comparer le rendu réel à AndroidX en thèmes clair/sombre et sur téléphone/tablette ;
- vérifier contraste et couleurs de contenu pour chaque rôle de couleur pris en charge ;
- inspecter l'ombre et l'overlay tonal lorsque le conteneur est `surface` ;
- comparer l'animation expanded/collapsed avec les MotionScheme 1.4.0 ;
- vérifier focus clavier, tactile, hover souris et `prefers-reduced-motion` ;
- vérifier les noms accessibles avec icônes décoratives et icônes porteuses de description ;
- confirmer les tailles minimales en présence d'un contenu plus large.

La CI et les tests DOM ne prouvent pas la fidélité visuelle. Tant que ces contrôles ne sont pas effectués, le statut reste `partial`.
