# Compose layout primitives — portage Web

## Objectif et statut

Cette spécification suit le portage des primitives AndroidX Compose UI/Foundation utilisées pour le layout et l'espacement. Ce périmètre est distinct des composants Material 3 : `Column`, `Row`, `Box`, `Spacer`, `Modifier` et `Arrangement` proviennent de Compose UI/Foundation.

**Statut global : portage en cours, non vérifié.** La cible stable retenue pour la comparaison est Compose UI/Foundation 1.12.1, confirmée par les notes de version officielles. Le commit AndroidX ci-dessous reste un snapshot de lecture immuable ; son alignement exact avec les artefacts 1.12.1 et leurs fichiers API n'est pas établi. La provenance de release est donc mieux définie, mais la baseline source/API n'est pas encore totalement verrouillée.

## Sources AndroidX inspectées

- Notes de version stable visée : [Compose UI 1.12.1](https://developer.android.com/jetpack/androidx/releases/compose-ui) et [Compose Foundation 1.12.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation).

Snapshot immuable de consultation : [androidx/androidx @ 5901d750e269aa3d88f6fccd5186637df83a0173](https://github.com/androidx/androidx/tree/5901d750e269aa3d88f6fccd5186637df83a0173).

- [Modifier.kt — Compose UI](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Modifier.kt)
- [Alignment.kt — Compose UI](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Alignment.kt)
- [Arrangement.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Arrangement.kt)
- [Column.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Column.kt)
- [Row.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Row.kt)
- [Box.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Box.kt)
- [Spacer.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Spacer.kt)
- [Référence API publique Arrangement](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement)
- [Référence API publique Modifier](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier)

## Portage actuel

| API AndroidX | Implémentation Web | Couverture actuelle | Différence déclarée |
|---|---|---|---|
| `Arrangement` | `src/components/layout/compose/Arrangement.ts` | Constantes Start/End/Top/Bottom/Center/Space*, `spacedBy`, surcharges d’alignement, `aligned` et extension Web `spacedBy` | `spacedBy` utilise CSS px plutôt que `Dp`; `spacedBy` est une extension Loculary; l’alignement du groupe est rendu via Flexbox; l’espacement négatif est approché par des marges logiques, sans reproduire le moteur de mesure Compose |
| `Alignment` | `src/components/layout/compose/Alignment.ts` | Constantes d’alignement utilisées par les primitives actuelles | Sous-ensemble des API d’alignement, adaptation CSS |
| `Modifier` | `src/components/layout/compose/Modifier.ts` | Chaîne ordonnée avec `padding`, `width`, `height`, `size`, `fillMaxWidth/Height/Size`, `widthIn(min, max?)`, `heightIn(min, max?)`, `sizeIn(minWidth, minHeight, maxWidth?, maxHeight?)`, `then` + `RowScope.weight` / `ColumnScope.weight` | Les signatures de contraintes utilisent des arguments positionnels proches d’AndroidX. Les opérations contextuelles sont séparées de la chaîne générique : `RowScope.weight`, `ColumnScope.weight`, `BoxScope.align` et `BoxScope.matchParentSize`. Les valeurs numériques restent des CSS px, et la mesure CSS ne reproduit pas le moteur Compose. `weight(fill = false)` reste sans parité exacte |
| `Column` | `src/components/layout/compose/Column.tsx` | Layout vertical, écart, alignement horizontal limité | Flexbox CSS ne reproduit pas toutes les règles de mesure/poids de Compose |
| `Row` | `src/components/layout/compose/Row.tsx` | Layout horizontal, écart, alignement vertical limité | Flexbox CSS ne reproduit pas toutes les règles de mesure/poids de Compose |
| `Box` | `src/components/layout/compose/Box.tsx` | Alignement global, alignement par enfant via `BoxScope.align`, `BoxScope.matchParentSize` | CSS Grid et positionnement absolu reproduisent la superposition et le remplissage, mais pas toutes les contraintes de mesure ni `propagateMinConstraints` |
| `Spacer` | `src/components/layout/compose/Spacer.tsx` | Élément sans taille intrinsèque, dimensionné par son modificateur ou les contraintes | Les opérations de poids sont exposées via `RowScope.weight` et `ColumnScope.weight`; leur mesure reste une adaptation Flexbox |

Le portage actuel expose aussi les six alignements 2D de `AbsoluteAlignment` pour `Box`, ainsi que les alignements horizontaux `Left`/`Right` pour `Row` et `Column`. Les positions gauche/droite restent fixes en RTL, contrairement à `Alignment.Start/End`; `Box` utilise `justify-self`, `Row` `justify-content`, et `Column` des règles `:dir(rtl)` qui inversent l’alignement flex sans modifier la direction du texte. Les autres contrats d’alignement AndroidX et le moteur de mesure restent partiels.

Les composants sont des ports partiels. Leur nom officiel ne signifie pas que l'API complète ou la parité AndroidX est déjà atteinte. `Modifier` conserve désormais chaque opération dans un wrapper distinct, dans l’ordre de composition, au lieu de fusionner la chaîne en un seul objet CSS. Cette structure rapproche le contrat de la chaîne AndroidX, mais ne reproduit pas encore intégralement les contraintes de mesure du navigateur et de Compose. Les surcharges `Arrangement.spacedBy(space, alignment)` et `Arrangement.aligned(alignment)` sont maintenant exposées, mais leur rendu s’appuie sur `justify-content` du navigateur : les règles de mesure Compose et certains cas de contraintes restent des écarts à traiter. Les espacements négatifs sont acceptés et rendus par des marges logiques sur les enfants suivants, ce qui reproduit le chevauchement visuel mais pas l’algorithme complet de mesure.

## Contrat des scopes de layout

Les opérations qui dépendent du parent ne sont pas des méthodes de la chaîne générique `Modifier` :

- `RowScope.weight(weight, fill)` et `ColumnScope.weight(weight, fill)` construisent les opérations de poids pour le layout concerné.
- `BoxScope.align(alignment)` et `BoxScope.matchParentSize()` construisent les opérations réservées aux enfants de `Box`.
- La chaîne s'assemble explicitement, par exemple `Modifier.then(RowScope.weight(1))`.
- `Box` consomme et retire ses opérations de scope avant de transmettre le modificateur générique à l'enfant. L'API TypeScript rend l'intention de scope visible, mais ne peut pas à elle seule empêcher qu'une opération soit utilisée sous le mauvais parent ; les primitives restent responsables de leur interprétation.

Cette séparation corrige le contrat de surface le plus trompeur, sans prétendre reproduire les scopes Kotlin implicites ni le moteur de mesure Compose. Les poids restent rendus par Flexbox. `src/lib/tools/compose-layout-behavior.test.ts` vérifie les fonctions de présentation réellement exécutées, le rendu SSR des wrappers `Modifier` et quelques points d'intégration des composants via leurs sources. Le runner `node --test` ne chargeant pas directement les modules TSX, ces tests ne rendent pas `Box`, `Row` ou `Column` eux-mêmes : ils ne constituent donc pas des tests SSR de ces composants. Ils détectent certaines régressions de style et de contrat, mais ne prouvent ni leur rendu complet, ni la géométrie calculée par un navigateur, ni la parité de mesure avec Compose. Une vérification navigateur reste nécessaire.

## Hiérarchie de maintenance

Les décisions de layout suivent une hiérarchie, du plus partagé au plus spécifique :

1. **Fondations CSS globales** : échelle d'espacement, gouttières responsives, largeurs de contenu et rôles sémantiques. Une décision transversale se règle ici une seule fois.
2. **Primitives Compose portées sur le Web** : elles décrivent le comportement de layout réutilisable (`Row`, `Column`, `Box`, `Spacer`, `Modifier`, arrangements et alignements).
3. **Compositions produit Loculary** : `PageContainer` assemble les conventions partagées de largeur, gouttières et espacement extérieur. Il ne remplace pas les primitives AndroidX.
4. **Pages et composants métier** : ils choisissent un preset adapté et ne conservent localement que les différences de composition réellement nécessaires.

Centraliser ne signifie pas transformer chaque nombre en variable globale. Un token est justifié lorsqu'il représente une décision récurrente, nommée et appelée à évoluer ensemble. Une valeur locale reste acceptable lorsqu'elle décrit un détail propre à un composant (par exemple le rayon d'un élément décoratif de la page d'accueil) et qu'elle n'est pas une deuxième version d'une convention globale. Les exceptions doivent être intentionnelles, lisibles et proportionnées.

Les personnalisations suivent le même principe : choisir d'abord un preset partagé, puis ajouter une surcharge locale explicite uniquement lorsque le besoin est spécifique. Ne pas ajouter un paramètre configurable à chaque composant par anticipation d'un besoin hypothétique.

## Conventions de migration

- Privilégier les noms AndroidX et les paramètres correspondants quand le contrat peut être préservé.
- Garder les compositions propres au produit, comme `PageContainer`, explicitement identifiées comme Loculary; elles centralisent les largeurs de contenu (`form`, `form-wide`, `account`, `narrow`, `medium`, `default`, `wide`), les gouttières responsives et les espacements extérieurs, mais ne doivent pas se faire passer pour une primitive AndroidX. Le header, le footer, les pages de collections, la page d'accueil, les pages d'administration et les formulaires de compte réutilisent progressivement cette composition; leur largeur reste choisie selon le contexte, pas uniformisée artificiellement.
- Remplacer les abstractions génériques d'espacement par `Column` + `Arrangement.spacedBy` lorsque le contrat convient. La zone éditoriale partagée de `ToolPage` est migrée vers `Column` et l’extension Web `spacedBy`; sa cadence responsive reste définie par une classe de composition dédiée, sans réintroduire une primitive Loculary de layout.
- Ne pas confondre les tokens CSS de Loculary avec une échelle de dimensions AndroidX. Les tokens restent des choix de design du produit tant qu'une source officielle ne prouve pas le contraire. Pour éviter les valeurs divergentes, utiliser l’extension Web `Arrangement.spacedBy("var(--layout-content-gap)")` lorsque l’espacement provient d’un token Loculary; ne pas présenter cette extension comme une API AndroidX.
- Ne pas déclarer la parité sans tests de contrat, vérification de rendu en navigateur et contrôle des cas RTL, responsive, clavier et accessibilité pertinents.
- Avant d'étendre le portage, sélectionner et verrouiller une référence Foundation/UI publiée, puis compléter l'inventaire des signatures publiques pertinentes et les spécifications associées.


### Contrat des contraintes de taille

Les helpers de contraintes utilisent des arguments positionnels pour éviter l'objet d'options propre à l'ancien port :

- `Modifier.widthIn(minWidth = 0, maxWidth?)`
- `Modifier.heightIn(minHeight = 0, maxHeight?)`
- `Modifier.sizeIn(minWidth = 0, minHeight = 0, maxWidth?, maxHeight?)`

Les nombres sont interprétés en pixels CSS, et non en `Dp`. Une borne supérieure omise correspond à une borne non définie dans l'adaptation Web. Cette évolution rapproche la forme de l'API AndroidX sans prétendre reproduire ses contraintes de mesure.
