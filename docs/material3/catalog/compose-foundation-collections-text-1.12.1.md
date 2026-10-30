# Revue sémantique ciblée — Foundation collections, texte et focus 1.12.1

## Statut et périmètre

Deuxième tranche de la revue sémantique de `androidx.compose.foundation:foundation` 1.12.1. Elle examine les contrats Lazy list/grid, Pager/snapping, sélection de texte, saisie, focus/relocation et drag-and-drop, puis décide ce qui mérite réellement un port React/Web.

- Baseline AndroidX immuable : [5e0747401bf56b243e3b5141ae080dc9bc61d29c](https://github.com/androidx/androidx/tree/5e0747401bf56b243e3b5141ae080dc9bc61d29c).
- Manifeste : [Foundation 1.12.1](inventories/compose-foundation-1.12.1/manifest.json).
- Surface : 2 343 déclarations, dont 1 389 candidates API source. Les paquets examinés sont notamment `lazy` (148), `lazy.grid` (169), `lazy.layout` (161), `lazy.staggeredgrid` (118), `pager` (109), `text` (133), `text.input` (165), `text.selection` (37), `draganddrop` (10) et `relocation` (10). Ces comptes décrivent le dump, pas des composants à porter.

Cette tranche est une revue ciblée de contrats et de pertinence produit ; elle ne prétend pas commenter individuellement les 2 343 déclarations ni remplacer la lecture de toutes les variantes et tests AndroidX.

## Audit d'usage Loculary

Les recherches ciblées dans le code de `main` n'ont trouvé aucun import ou appel de `LazyColumn`, `LazyRow`, `LazyVerticalGrid`, `HorizontalPager`, `VerticalPager`, `PagerState`, `SelectionContainer`, `BasicTextField`, `dragAndDropSource` ou `dragAndDropTarget`.

Les compositions de catalogue actuelles sont finies et rendues par les mécanismes Web usuels :
- [ToolsPage](../../../src/app/[locale]/[section]/page.tsx) parcourt les catégories, intentions et résultats avec `map`, CSS Grid et listes DOM.
- [FavoritesView](../../../src/components/favorites/FavoritesView.tsx) rend une liste sémantique `ul/li` en CSS Grid.
- [CollectionsView](../../../src/components/collections/CollectionsView.tsx) compose les collections et leurs outils avec le DOM.
- [SearchResultsClient](../../../src/components/tools/SearchResultsClient.tsx) rend les résultats du catalogue sans virtualisation.

Deux composants expérimentaux ne sont pas des preuves d'usage produit : [Carousel](../../../src/components/ui/Carousel.tsx) et [ScrollField](../../../src/components/ui/ScrollField.tsx) n'ont pas de consommateur importé trouvé dans le dépôt. Le premier est un défilement horizontal CSS scroll-snap inspiré des carousels Material 3 ; le second est un sélecteur à cinq lignes avec boutons natifs et ne constitue pas un port de `PagerState`.

La saisie, elle, est largement utilisée : [TextField](../../../src/components/ui/TextField.tsx) repose sur `input` natif, [TextArea](../../../src/components/ui/TextArea.tsx) sur `textarea`, [MaterialTextField](../../../src/components/ui/MaterialTextField.tsx) est un champ contrôlé employé dans le parcours de changement de mot de passe, et [ToolSearch](../../../src/components/tools/ToolSearch.tsx) construit un champ de recherche/combobox Web. Les champs sont aussi présents dans les outils texte, les formulaires de compte et les calculateurs.

## Contrats AndroidX et décisions Web

### Lazy lists et grids

Sources épinglées :
- [LazyDsl.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/LazyDsl.kt)
- [LazyListState.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/LazyListState.kt)
- [LazyGridDsl.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/grid/LazyGridDsl.kt)
- [LazyGridState.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/grid/LazyGridState.kt)

`LazyColumn` et `LazyRow` ne composent et ne mesurent que les éléments visibles et la fenêtre utile autour du viewport. Le contrat comprend aussi des clés stables pour préserver l'identité et la position après insertion/suppression, des `contentType` pour le recyclage, des en-têtes épinglés, du préchargement et un état permettant observation, défilement programmatique et restauration de position. Les Lazy grids ajoutent `GridCells.Fixed/Adaptive`, les spans et les mêmes préoccupations d'identité/état.

**Décision : pas de portage Lazy maintenant.** Le catalogue actuel est une source statique de taille modeste, les pages affichent des ensembles finis et les recherches n'ont pas identifié de problème de coût DOM qui justifierait une virtualisation. CSS Grid, listes HTML et défilement natif sont plus simples, SSR-friendly et accessibles. Si le catalogue grandit réellement (la vision autorise plusieurs milliers d'outils), mesurer d'abord le coût de rendu et de recherche ; choisir ensuite pagination, chargement progressif ou virtualisation selon les besoins. Toute virtualisation devra préserver les liens, l'ordre clavier, les clés stables, le focus, les annonces de résultats et le rendu indexable pertinent. Ne pas virtualiser pour un volume hypothétique.

### Pager et snapping

Sources épinglées :
- [Pager.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/pager/Pager.kt)
- [PagerState.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/pager/PagerState.kt)
- [SnapFlingBehavior.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/gestures/snapping/SnapFlingBehavior.kt)

`HorizontalPager` / `VerticalPager` s'appuient sur un état de page observable (page courante, cible, décalage), des pages identifiées par clé, un nombre limité de pages composées autour du viewport, une position d'accrochage, une stratégie de fling et un contrat de nested scroll. Ce n'est pas un simple `overflow-x: auto` ni un carrousel décoratif.

**Décision : pas de portage Pager maintenant.** Aucun Pager n'est utilisé dans l'application. Le composant Carousel existant est isolé, sans consommateur trouvé, et son scroll-snap CSS ne prouve pas la parité Pager. Ne pas le promouvoir ni le réécrire avant un parcours produit qui exige réellement une pagination gestuelle. Pour une galerie horizontale simple, garder le scroll natif, les liens accessibles et des commandes explicites ; pour un parcours page par page, définir d'abord les exigences de navigation, d'annonce de page, de clavier, de RTL et de mouvement réduit.

### Sélection de texte et menus contextuels

Source épinglée : [SelectionContainer.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/text/selection/SelectionContainer.kt).

Compose permet de sélectionner du texte à travers plusieurs composables, dessine ses poignées de sélection et fournit les actions de sélection/copie. AndroidX précise également les limites de sélection à l'intérieur de layouts paresseux lorsque les éléments ne sont pas composés.

**Décision : conserver la sélection native du navigateur.** Le DOM fournit déjà sélection tactile/souris, poignées, menu contextuel, copier/coller et intégration OS. Ne pas créer un clone React de `SelectionContainer`. Ne pas appliquer `user-select: none` globalement ; réserver cette règle aux surfaces de manipulation où elle évite un conflit de geste démontré. Tester la sélection et la copie du contenu des fiches/outils dans les navigateurs ciblés, sans remplacer le comportement natif.

### TextFieldState, BasicTextField et transformations

Sources épinglées :
- [BasicTextField.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/text/BasicTextField.kt)
- [TextFieldState.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/text/input/TextFieldState.kt)
- [InputTransformation.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/text/input/InputTransformation.kt)
- [OutputTransformation.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/text/input/OutputTransformation.kt)

Le contrat moderne de `BasicTextField` ne se réduit pas à une chaîne contrôlée : `TextFieldState` suit le texte, la sélection, la composition IME et l'historique d'édition ; `InputTransformation` peut accepter ou rejeter les modifications venant du clavier matériel/logiciel, du collage, du glisser-déposer ou des services d'accessibilité ; `OutputTransformation` modifie uniquement la représentation affichée et laisse le composant gérer la correspondance curseur/sélection. Les options clavier, les limites de lignes, le scroll interne et le décorateur font aussi partie du contrat.

**Décision : ne pas réimplémenter TextFieldState ni l'IME en React.** Les éléments `input` et `textarea` natifs donnent accès aux claviers mobiles, à la composition IME, au curseur, à la sélection, au remplissage automatique et aux technologies d'assistance du navigateur/OS. Les composants Loculary existants conservent cette base. Les transformations métier restent locales à chaque outil tant qu'un besoin commun n'est pas démontré.

**Garde-fous à préserver :**
- ne pas normaliser ou réécrire agressivement la valeur pendant une composition IME ; tester les claviers mobiles et les caractères composés ;
- utiliser les attributs HTML pertinents (`type`, `inputMode`, `autoComplete`, `required`, `minLength/maxLength`, `readOnly`, `aria-invalid`, `aria-describedby`) plutôt que réinventer les contrats du navigateur ;
- si un formatage visuel doit différer de la valeur brute (téléphone, monnaie, masque), séparer explicitement valeur canonique et représentation, puis tester le curseur, la sélection, le collage, l'annulation et l'IME ;
- ne pas introduire une couche de transformation générique avant d'avoir au moins deux usages réels partageant le même contrat.

### Focus et relocation

Sources épinglées :
- [FocusRequester.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/focus/FocusRequester.kt)
- [BringIntoViewRequester.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/relocation/BringIntoViewRequester.kt)

Compose expose des demandes explicites de focus, de capture/libération et de restauration d'enfant focalisé. `BringIntoViewRequester` demande aux parents défilants d'amener un rectangle dans leur viewport, et peut être interrompu par une demande plus récente.

**Décision : utiliser le modèle DOM.** Les éléments interactifs natifs, l'ordre de tabulation, `focus()`, `focus-visible` et `scrollIntoView({ block: "nearest", inline: "nearest" })` couvrent les besoins Web usuels. Ne pas ajouter un gestionnaire de focus global ou un clone de relocation sans défaut concret. Pour une combobox, un dialogue ou une navigation complexe, spécifier le cycle de focus, Escape, la restauration et les changements de viewport dans le composant concerné.

### Drag-and-drop

Sources épinglées :
- [DragAndDropSource.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/draganddrop/DragAndDropSource.kt)
- [DragAndDropTarget.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/draganddrop/DragAndDropTarget.kt)

Le contrat AndroidX distingue une source (détection du départ, données transférées, décoration/drag shadow) d'une cible (filtrage de session, réception et événements). Le transfert peut venir de l'application ou d'autres applications.

**Décision : pas de couche drag-and-drop commune maintenant.** Aucun usage de `dragAndDropSource` / `dragAndDropTarget` ni gestionnaire `onDrag` n'a été trouvé dans le produit. Les entrées fichier restent utilisables sans geste. Si une importation par glisser-déposer devient utile, implémenter l'API HTML `DataTransfer` dans la surface concernée, avec un bouton/parcours de sélection fichier équivalent, des types MIME vérifiés et un état de dépôt accessible au clavier.

## Matrice de décision

| Famille | Usage Loculary établi | Décision actuelle | Condition de réouverture |
|---|---|---|---|
| Lazy list/grid/staggered | Aucun appel Compose ; listes/grilles DOM finies | Pas de portage ; garder CSS/DOM | Mesure démontrant un coût DOM ou besoin de pagination |
| Pager/snapping | Aucun Pager ; Carousel isolé sans consommateur | Pas de portage Pager | Parcours page-par-page explicitement retenu |
| Sélection de texte | Texte DOM et champs natifs | Conserver sélection navigateur | Défaut réel de sélection/copie sur un parcours |
| Saisie/transformations | Nombreux inputs/textarea natifs | Préserver IME et comportements OS | Plusieurs usages nécessitant un formatage commun complexe |
| Focus/relocation | Contrats DOM natifs ; pas de requester dédié | Focus natif, logique locale aux composants | Défaut mesuré de focus/scroll dans un parcours complexe |
| Drag-and-drop | Aucun gestionnaire applicatif identifié | Ne pas ajouter de primitive générique | Fonction produit explicite avec parcours clavier alternatif |

## Suite utile

1. Conserver cette revue comme décision de non-portage préventif pour les API sans consommateur.
2. Auditer les champs de saisie réellement utilisés sur téléphone/tablette, notamment composition IME, collage, validation, focus et labels/erreurs ; corriger seulement les écarts reproductibles.
3. Revenir à la famille Compose UI ou UI Text pour une revue sémantique ciblée si elle expose des contrats réellement consommés par l'application.
4. Garder les validations navigateur réelles distinctes des revues documentaires et des tests de contrat.

**Limite de vérification :** cette tranche est fondée sur les sources AndroidX épinglées et l'audit du code GitHub. Aucun navigateur interactif n'a été exécuté ; aucun résultat de parité visuelle/tactile n'est revendiqué.
