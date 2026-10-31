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

L'audit d'import exact ne trouve aucun consommateur produit ni spécimen Design Lab pour les wrappers Web `Carousel`, `ModalBottomSheet`, `BottomSheetScaffold`, `PullToRefreshBox`, `SwipeToDismissBox`, `Scaffold`, `NavigationSuiteScaffold`, `NavigationDrawer`, `NavigationRail` et `WideNavigationRail`. Leurs implémentations et feuilles CSS ont donc été supprimées plutôt que maintenues comme ports anticipés. Leurs contrats restent présents dans l'inventaire AndroidX 1.4.0 / Compose 1.12.1 ; ils seront adaptés à React/Web lorsqu'un parcours produit réel le justifiera.

`NavigationBar` est conservée uniquement comme spécimen interactif du Design Lab ; elle n'est pas branchée à la navigation produit. Les anciennes entrées des migrations de catalogue sont historiques : les tables `design_audit_*` correspondantes ont déjà été retirées en production.

Les composants de scroll encore utilisés doivent conserver les mécanismes DOM natifs (scroll, focus et clavier) au lieu de réimplémenter le moteur Compose. Aucun correctif RTL, tactile ou d'ancrage n'est en attente pour les wrappers supprimés.

## Décisions et travaux restants

1. Conserver le scroll DOM natif pour les parcours effectivement utilisés ; tester les conteneurs imbriqués, le clavier, le focus et le scroll sur mobile/tablette.
2. Ne pas recréer les wrappers supprimés avant qu'un besoin produit concret et son consommateur soient identifiés.
3. La tranche complémentaire [collections, texte et focus](compose-foundation-collections-text-1.12.1.md) examine les contrats Lazy lists/grids, Pager/snapping, sélection, saisie, focus/relocation et drag-and-drop ; elle conclut à ne pas porter préventivement les primitives sans usage Loculary démontré. La revue sémantique globale Foundation reste partielle.

**Statut final de cette tranche :** inventaire source et contrats pertinents examinés ; ports Web sans consommateur supprimés ; conformité navigateur des composants conservés non revendiquée ; inventaire sémantique global Foundation toujours `in-progress`.
