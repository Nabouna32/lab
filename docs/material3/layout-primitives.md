# Compose layout primitives — portage Web

## Objectif et statut

Cette spécification suit le portage des primitives AndroidX Compose UI/Foundation utilisées pour le layout et l'espacement. Ce périmètre est distinct des composants Material 3 : `Column`, `Row`, `Box`, `Spacer`, `Modifier` et `Arrangement` proviennent de Compose UI/Foundation.

**Statut global : portage en cours, non vérifié.** La référence de release Foundation/UI n'est pas encore sélectionnée ni alignée sur un snapshot API publié. Le commit AndroidX ci-dessous est une référence de lecture immuable, pas une affirmation qu'il correspond à une release stable donnée.

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
| `Arrangement` | `src/components/layout/compose/Arrangement.ts` | Constantes Start/End/Top/Bottom/Center/Space*, `spacedBy` et extension Web `spacedByCss` | `spacedBy` utilise CSS px plutôt que `Dp`; `spacedByCss` est une extension Loculary, pas AndroidX; overload avec alignement et contrat de mesure incomplets |
| `Alignment` | `src/components/layout/compose/Alignment.ts` | Constantes d’alignement utilisées par les primitives actuelles | Sous-ensemble des API d’alignement, adaptation CSS |
| `Modifier` | `src/components/layout/compose/Modifier.ts` | `padding`, `fillMaxWidth`, `widthIn`, `then` | Les opérations construisent des styles CSS; la mesure et l'ordre de layout ne reproduisent pas entièrement Compose |
| `Column` | `src/components/layout/compose/Column.tsx` | Layout vertical, écart, alignement horizontal limité | Flexbox CSS ne reproduit pas toutes les règles de mesure/poids de Compose |
| `Row` | `src/components/layout/compose/Row.tsx` | Layout horizontal, écart, alignement vertical limité | Flexbox CSS ne reproduit pas toutes les règles de mesure/poids de Compose |
| `Box` | `src/components/layout/compose/Box.tsx` | Enfants positionnés dans une cellule CSS Grid commune | La mesure et les contraintes de Box Compose ne sont pas encore portées fidèlement |
| `Spacer` | `src/components/layout/compose/Spacer.tsx` | Élément sans taille intrinsèque, dimensionné par son modificateur ou les contraintes | Les modificateurs de poids de `RowScope`/`ColumnScope` restent à implémenter |

Les composants sont des ports partiels. Leur nom officiel ne signifie pas que l'API complète ou la parité AndroidX est déjà atteinte.

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
- Remplacer les abstractions génériques d'espacement par `Column` + `Arrangement.spacedBy` lorsque le contrat convient.
- Ne pas confondre les tokens CSS de Loculary avec une échelle de dimensions AndroidX. Les tokens restent des choix de design du produit tant qu'une source officielle ne prouve pas le contraire. Pour éviter les valeurs divergentes, utiliser l’extension Web `Arrangement.spacedByCss("var(--layout-content-gap)")` lorsque l’espacement provient d’un token Loculary; ne pas présenter cette extension comme une API AndroidX.
- Ne pas déclarer la parité sans tests de contrat, vérification de rendu en navigateur et contrôle des cas RTL, responsive, clavier et accessibilité pertinents.
- Avant d'étendre le portage, sélectionner et verrouiller une référence Foundation/UI publiée, puis compléter l'inventaire des signatures publiques pertinentes et les spécifications associées.
