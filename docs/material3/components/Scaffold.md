# Scaffold — Material 3 1.4.0

## Statut

**Port React/Web partiel en reconstruction.** L'API AndroidX stable est identifiée et la première reconstruction couvre les slots, la mesure des barres, le padding du contenu, les positions FAB et l'empilement du snackbar. La parité complète n'est pas revendiquée : les insets déjà consommés par un parent Compose n'ont pas d'équivalent automatique dans le navigateur et le rendu n'a pas encore été vérifié visuellement.

- Artefact : `androidx.compose.material3:material3`
- Version : `1.4.0` stable
- Commit source immuable : [5113b82a4ed6416d6344efa50e41db8cb65928ff](https://github.com/androidx/androidx/tree/5113b82a4ed6416d6344efa50e41db8cb65928ff)
- Source : [Scaffold.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Scaffold.kt)
- Dump API : [current.txt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/api/current.txt)
- Tests AndroidX : [ScaffoldTest.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/androidInstrumentedTest/kotlin/androidx/compose/material3/ScaffoldTest.kt)

La provenance de la release et l'alignement sources/API sont établis dans [sources.md](../sources.md) et le manifeste [material3-1.4.0.json](../catalog/baselines/material3-1.4.0.json).

## Contrat AndroidX

La signature publique 1.4.0 expose :

- `modifier`
- `topBar`
- `bottomBar`
- `snackbarHost`
- `floatingActionButton`
- `floatingActionButtonPosition` : `Start`, `Center`, `End`, `EndOverlay`
- `containerColor` et `contentColor`
- `contentWindowInsets`
- un contenu qui reçoit `PaddingValues`

Le composant mesure les slots, conserve le contenu principal sur toute la surface, puis superpose les barres, le FAB et le snackbar. Le contenu reçoit un padding calculé : hauteur de la top bar si elle existe, sinon inset supérieur ; hauteur de la bottom bar si elle existe, sinon inset inférieur ; insets horizontaux dans les deux cas. La top bar et la bottom bar restent responsables de leurs propres insets lorsque présentes.

Le FAB est placé à 16 dp du bord logique choisi. Il se place au-dessus de la bottom bar, sauf pour `EndOverlay`, qui le superpose. Le snackbar se place au-dessus du FAB lorsqu'il est visible, sinon au-dessus de la bottom bar ou de l'inset inférieur. Le calcul horizontal respecte les insets physiques et la direction RTL.

## Adaptation React/Web

Le port expose un render prop `children(padding)` et les mêmes slots visuels, sans inventer de slot `navigationRail` absent de l'API AndroidX. Une navigation rail éventuelle est composée par l'écran dans son contenu ou son layout parent.

- `ScaffoldPaddingValues` expose `top`, `bottom`, `start` et `end` comme longueurs CSS. Le consommateur doit les appliquer à la racine de son contenu, comme il applique les `PaddingValues` AndroidX.
- `ScaffoldDefaults.contentWindowInsets` utilise les variables CSS `env(safe-area-inset-*)` comme approximation Web des insets système. Un consommateur peut fournir des valeurs explicites via `contentWindowInsets`.
- Le navigateur ne fournit pas de mécanisme générique permettant de connaître les insets déjà consommés par un ancêtre. Le consommateur doit donc passer les valeurs résiduelles lorsqu'il gère déjà cette consommation ; aucune soustraction automatique n'est revendiquée.
- Les hauteurs des slots sont mesurées via `ResizeObserver` (avec repli sur le redimensionnement de fenêtre). Le contenu ne devient pas un conteneur scrollable imposé : le scroll appartient au consommateur.
- Les couleurs acceptent des valeurs CSS, avec les tokens de thème Loculary comme valeurs par défaut. Ce n'est pas une implémentation du système de couleurs Compose.
- Le slot snackbar reçoit un hôte fourni par le consommateur ; `SnackbarHostState`, la file d'attente et la durée de vie des messages ne sont pas implémentés par Scaffold.

## Vérifications

Les tests DOM couvrent les slots publics, le padding après mesure, les quatre positions FAB, le placement du snackbar et l'absence de slot navigation rail inventé. Ils ne prouvent pas la géométrie visuelle ni la parité des insets sur appareils.

À vérifier avant de déclarer le port fidèle :

- dimensions et placement dans les thèmes clair/sombre et aux viewports téléphone/tablette ;
- safe areas iOS/WebView et insets de navigation ;
- RTL avec insets gauche/droite asymétriques ;
- évolution dynamique des hauteurs de barres ;
- focus et ordre de navigation clavier entre les slots ;
- comportement du snackbar et du FAB lorsque leurs contenus changent de taille ;
- rendu et clipping lorsque le contenu dépasse la surface.

Ne pas promouvoir le statut à `verified` avant ces contrôles et une comparaison avec la source épinglée.
