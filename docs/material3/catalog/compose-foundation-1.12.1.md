# Revue sémantique ciblée — Compose Foundation 1.12.1

## Statut

Première revue sémantique ciblée, centrée sur les contrats de clic, de défilement, de glissement, d'ancrage et de nested scroll. Elle sert à orienter le portage React/Web téléphone-tablette ; **elle ne constitue pas la revue exhaustive des 2 343 déclarations Foundation**.

- Artefact : `androidx.compose.foundation:foundation`
- Release : `1.12.1`
- Commit AndroidX immuable : [5e0747401bf56b243e3b5141ae080dc9bc61d29c](https://github.com/androidx/androidx/tree/5e0747401bf56b243e3b5141ae080dc9bc61d29c)
- Dump : [foundation/api/current.txt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/api/current.txt)
- Manifeste local : [inventaire Foundation 1.12.1](inventories/compose-foundation-1.12.1/manifest.json), SHA-256 du dump `250de056979ff61a1ded661c9a12643d9c75146040d98f2c49d8ec635d2f03bf`.

L'inventaire mécanique compte 2 343 déclarations : 1 389 candidates API source, 574 formes `@BytecodeOnly`, 271 déclarations inaccessibles depuis Kotlin et 109 façades JVM générées. Les 222 déclarations `@KotlinOnly`, 203 expérimentales et 160 dépréciées sont des sous-ensembles, pas des catégories à additionner. Ces nombres ne mesurent ni le nombre de composants visuels ni le périmètre à porter.

## Contrats AndroidX examinés

### Activation et sémantique accessible

[`Clickable.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/Clickable.kt) définit plus qu'un écouteur de clic : activation par entrée et action d'accessibilité, état activé/désactivé, rôle, libellé d'action, indication visuelle et interactions de pression. `combinedClickable` ajoute les actions longue pression et double clic.

**Décision Web :** utiliser d'abord les éléments HTML natifs (`button` pour une action, `a` pour une navigation), leurs états désactivés et leurs noms accessibles. Un `div` avec un gestionnaire de clic n'est pas un équivalent suffisant. Les interactions de pression et effets visuels restent des contrats séparés de l'activation.

### Défilement haut niveau et état

[`Scroll.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/Scroll.kt) expose `verticalScroll` et `horizontalScroll` avec un `ScrollState` possédé par le composant : position, limite maximale, taille de viewport, défilement programmatique, activation, sens inversé et comportement de fling.

**Décision Web :** pour les surfaces ordinaires, conserver le moteur de défilement du navigateur (`overflow: auto` / `overflow-x: auto`), qui gère déjà les gestes tactiles, la molette, l'inertie native et les interactions avec le viewport. Ne pas créer un clone React de `ScrollState` sans besoin produit démontré. Ajouter un état React uniquement pour une information réellement nécessaire à l'interface (par exemple bouton précédent/suivant ou progression).

### Défilement bas niveau et nested scroll

[`Scrollable.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/gestures/Scrollable.kt) précise que `scrollable` traite les gestes et le fling à bas niveau, mais ne fournit pas à lui seul les comportements d'un conteneur : clipping, déplacement du contenu et rendu de l'overscroll relèvent des API de niveau supérieur (`scrollableArea`, `verticalScroll`, `horizontalScroll`).

[`NestedScrollModifier.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/input/nestedscroll/NestedScrollModifier.kt) définit une chaîne parent/enfant avec phases pre-scroll et post-scroll, puis pre-fling et post-fling. Le parent peut consommer une partie du delta ou de la vélocité avant ou après l'enfant.

**Décision Web :** préférer le scroll chaining natif et `overscroll-behavior` pour les conteneurs imbriqués ordinaires. Ne pas réimplémenter le dispatcher Compose dans une couche générique React. Un geste spécialisé (pull-to-refresh, sheet imbriquée) doit être traité isolément et testé sur appareils tactiles : les événements Pointer ne reproduisent pas automatiquement les phases et consommations de nested scroll.

### Glissement et états ancrés

[`Draggable.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/gestures/Draggable.kt) fournit un glissement unidimensionnel avec état, orientation, activation, sens inversé, interactions, début/fin et vélocité. La documentation distingue explicitement `draggable` de `scrollable` : le premier ne fournit pas à lui seul le fling ou le nested scroll.

[`AnchoredDraggable.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/gestures/AnchoredDraggable.kt) gère des positions discrètes : déplacement contraint entre ancres, mise à jour d'un état, puis animation vers une ancre choisie selon les seuils de position et de vélocité. Le sens horizontal peut dépendre de la direction de layout.

**Décision Web :** réserver les gestionnaires Pointer personnalisés aux interactions qui en ont réellement besoin. Documenter pour chacune l'axe, le seuil, le sens logique RTL, la capture et l'annulation du pointeur, la vélocité éventuelle, l'état final, le mouvement réduit et une action clavier/tactile alternative. Un simple déplacement CSS ne constitue pas un port de `anchoredDraggable`.

### Overscroll

[`Overscroll.kt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/Overscroll.kt) sépare la consommation des deltas/vélocités (`applyToScroll`, `applyToFling`) de la couche qui dessine l'effet (`Modifier.overscroll`). Le modifier visuel ne traite pas à lui seul les entrées.

**Décision Web :** `overscroll-behavior` contrôle principalement la propagation du scroll entre conteneurs ; ce n'est pas l'équivalent visuel d'un `OverscrollEffect`. Ne pas déclarer une parité d'effet sur cette seule base.

## Audit ciblé des adaptations Loculary

- **Surfaces natives :** `Carousel` utilise `overflow-x: auto`, scroll snap, `overscroll-behavior-inline: contain` et des commandes clavier. `Scaffold`, `ModalBottomSheet`, `NavigationDrawer` et plusieurs menus utilisent aussi le scroll DOM natif. Cette direction est préférable à une réimplémentation du moteur Compose.
- **Pull-to-refresh :** `PullToRefreshBox` suit des événements Pointer et vérifie `scrollTop`, avec un bouton explicite de rafraîchissement utile à l'accessibilité. Son propre commentaire reconnaît que l'arbitrage nested-scroll et l'overscroll de plateforme diffèrent de Compose. Le conteneur est scrollable et n'établit pas de capture du pointeur ; le comportement tactile reste à vérifier en navigateur réel.
- **Bottom sheet :** `BottomSheetScaffold` utilise une capture Pointer et un seuil fixe de 40 px. Le bouton du handle fournit une activation clavier, mais l'implémentation ne reproduit pas les seuils de position/vélocité et l'animation d'ancrage AndroidX.
- **Dismiss par swipe :** `SwipeToDismissBox` capture le pointeur et conserve une action bouton explicite. En revanche, ses valeurs `start-to-end` / `end-to-start` sont actuellement décidées avec le signe physique de `dx` ; elles ne suivent donc pas la direction logique RTL. À corriger avant de considérer ce composant comme conforme ou de le promouvoir dans un parcours produit.
- **Périmètre d'usage :** les recherches ciblées dans le dépôt n'ont pas identifié de consommateurs de ces composants au-delà de leurs fichiers, des entrées de catalogue de conception et des tests. Cet indice ne remplace pas un audit exhaustif du graphe d'import ; il évite simplement de présenter ces adaptations comme déjà validées en production.

## Décisions et travaux restants

1. Garder le scroll natif DOM comme implémentation par défaut ; tester les conteneurs imbriqués, le clavier, le focus et le scroll sur mobile/tablette.
2. Corriger et tester la correspondance logique RTL de `SwipeToDismissBox` avant toute utilisation réelle.
3. Revoir `PullToRefreshBox` sur appareil tactile : arbitrage avec le scroll vertical, annulation/capture Pointer, seuil, état de rafraîchissement et alternative sans geste.
4. Revoir le comportement d'ancrage du bottom sheet si ce composant est retenu : seuils, vélocité, annulation, mouvement réduit et sens de layout.
5. Poursuivre séparément la revue des API Foundation non couvertes ici : lazy lists/grids, pager/snapping, sélection de texte, focus/relocation, drag-and-drop et primitives de texte. Aucune conclusion d'exhaustivité n'est tirée pour ces familles.

**Statut final de cette tranche :** contrats scroll/gestures examinés à partir des sources épinglées ; adaptations Web cartographiées ; conformité navigateur non vérifiée ; inventaire sémantique global Foundation toujours `in-progress`.
