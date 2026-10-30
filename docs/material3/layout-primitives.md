# Compose layout primitives — portage Web

## Objectif et statut

Cette spécification suit le portage des primitives AndroidX Compose UI/Foundation utilisées pour le layout et l'espacement. Ce périmètre est distinct des composants Material 3 : `Column`, `Row`, `Box`, `Spacer`, `Modifier` et `Arrangement` proviennent de Compose UI/Foundation.

**Statut global : portage en cours, non vérifié.** La baseline de référence Compose UI/Foundation 1.12.1 est désormais verrouillée : le commit AndroidX immuable `5e0747401bf56b243e3b5141ae080dc9bc61d29c`, les quatre dumps API publics Compose UI, UI Text, Foundation et Foundation Layout, ainsi que les sources Google Maven correspondantes sont alignés et vérifiés. La CI #4516 a comparé 1 039 fichiers de sources et de licence, sans absence ni divergence. Les empreintes et les preuves reproductibles sont conservées dans [le manifeste de provenance](catalog/baselines/compose-p0-1.12.1-api-provenance.json). **Cette vérification porte sur la provenance de la référence AndroidX, pas sur la fidélité du portage Web** : l'implémentation React reste partielle et non vérifiée en navigateur.

## Sources AndroidX inspectées

- Notes de version stable visée : [Compose UI 1.12.1](https://developer.android.com/jetpack/androidx/releases/compose-ui) et [Compose Foundation 1.12.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation).

Baseline stable AndroidX 1.12.1 : [androidx/androidx @ 5e0747401bf56b243e3b5141ae080dc9bc61d29c](https://github.com/androidx/androidx/tree/5e0747401bf56b243e3b5141ae080dc9bc61d29c). Les sources ci-dessous sont consultées à cette révision et leur correspondance avec les archives publiées est vérifiée par la CI #4516.

- [Modifier.kt — Compose UI](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Modifier.kt)
- [Alignment.kt — Compose UI](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Alignment.kt)
- [Arrangement.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Arrangement.kt)
- [Column.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Column.kt)
- [Row.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Row.kt)
- [Box.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Box.kt)
- [Spacer.kt — Foundation Layout](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Spacer.kt)
- [Référence API publique Arrangement](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement)
- [Référence API publique Modifier](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier)

## Portage actuel

| API AndroidX | Implémentation Web | Couverture actuelle | Différence déclarée |
|---|---|---|---|
| `Arrangement` | `src/components/layout/compose/Arrangement.ts` | Constantes Start/End/Top/Bottom/Center/Space*, `spacedBy`, surcharges d’alignement, `aligned` et surcharge Web de `spacedBy` pour les tokens CSS | les valeurs numériques de `spacedBy` suivent la convention de portage 1 Dp = 1 px CSS; les chaînes sont une adaptation Web pour les tokens CSS; l’alignement du groupe est rendu via Flexbox; l’espacement négatif est approché par des marges logiques, sans reproduire le moteur de mesure Compose |
| `Alignment` | `src/components/layout/compose/Alignment.ts` | Constantes d’alignement utilisées par les primitives actuelles | Sous-ensemble des API d’alignement, adaptation CSS |
| `Modifier` | `src/components/layout/compose/Modifier.ts` | Chaîne ordonnée avec `padding`, `width`, `height`, `size`, `fillMaxWidth/Height/Size`, `widthIn(min, max?)`, `heightIn(min, max?)`, `sizeIn(minWidth, minHeight, maxWidth?, maxHeight?)`, `then` + `RowScope.weight` / `ColumnScope.weight` | Les signatures de contraintes utilisent des arguments positionnels proches d’AndroidX. Les opérations contextuelles sont séparées de la chaîne générique : `RowScope.weight`, `ColumnScope.weight`, `BoxScope.align` et `BoxScope.matchParentSize`. Les valeurs numériques suivent la convention 1 Dp = 1 px CSS, et la mesure CSS ne reproduit pas le moteur Compose. `weight(fill = false)` reste sans parité exacte |
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

## Sources des responsabilités de layout

Les responsabilités de mise en page doivent être confiées aux primitives AndroidX portées sur le Web et aux mécanismes natifs du navigateur, plutôt qu'à une couche parallèle de compositions propres à Loculary :

1. **Fondations CSS globales :** elles portent les tokens sémantiques réellement transversaux, comme les dimensions responsives et les largeurs de contenu lorsqu'une convention produit partagée est nécessaire.
2. **Primitives Compose portées sur le Web :** elles décrivent les comportements réutilisables (`Row`, `Column`, `Box`, `Spacer`, `Modifier`, arrangements et alignements).
3. **Mise en page native du Web :** CSS Grid, Flexbox et les éléments HTML sémantiques sont utilisés directement lorsque le besoin relève du navigateur et qu'aucune API AndroidX pertinente ne s'applique.
4. **Pages et outils :** ils assemblent les composants et primitives disponibles selon la tâche, sans introduire de wrapper de présentation Loculary qui duplique leur comportement.

Centraliser ne signifie pas transformer chaque nombre en variable globale. Un token est justifié lorsqu'il représente une décision récurrente, nommée et appelée à évoluer ensemble. Une valeur locale reste acceptable lorsqu'elle décrit une propriété réellement propre à un composant ou à un besoin métier, et non une seconde version d'une convention partagée. Les adaptations Web doivent être identifiées et justifiées.

Ne pas ajouter un paramètre configurable à chaque composant par anticipation d'un besoin hypothétique.

## Conventions de migration

- Privilégier les noms AndroidX et les paramètres correspondants lorsque le contrat peut être préservé.
- Remplacer les compositions et wrappers de présentation propres à Loculary, notamment `PageContainer`, par les primitives AndroidX pertinentes ou par une adaptation Web native lorsque le besoin ne relève pas d'un contrat AndroidX. Migrer les consommateurs, vérifier les largeurs, gouttières et comportements responsive, puis supprimer `PageContainer` et les styles associés lorsqu'ils ne sont plus utilisés.
- Remplacer les abstractions génériques d'espacement par `Column` et `Arrangement.spacedBy` lorsque leur contrat convient. La zone éditoriale partagée de `ToolPage` utilise déjà `Column` et la surcharge Web de `spacedBy` ; supprimer les wrappers de composition redondants après migration et vérification de tous leurs consommateurs.
- Ne pas confondre les tokens CSS de Loculary avec une échelle de dimensions AndroidX. Les tokens restent des choix de design du produit tant qu'une source officielle ne prouve pas le contraire. Pour éviter les valeurs divergentes, utiliser la surcharge Web `Arrangement.spacedBy("var(--layout-content-gap)")` lorsque l’espacement provient d’un token Loculary; ne pas présenter cette extension comme une API AndroidX.
- Ne pas déclarer la parité sans tests de contrat, vérification de rendu en navigateur et contrôle des cas RTL, responsive, clavier et accessibilité pertinents.
- Pour toute extension du portage, s'appuyer sur la baseline Foundation/UI 1.12.1 verrouillée et compléter l'inventaire sémantique des signatures publiques pertinentes avant de déclarer une API couverte ou fidèle.


### Contrat des contraintes de taille

Les helpers de contraintes utilisent des arguments positionnels pour éviter l'objet d'options propre à l'ancien port :

- `Modifier.widthIn(minWidth = 0, maxWidth?)`
- `Modifier.heightIn(minHeight = 0, maxHeight?)`
- `Modifier.sizeIn(minWidth = 0, minHeight = 0, maxWidth?, maxHeight?)`

Les nombres suivent la convention de ce portage : 1 `Dp` = 1 px CSS. Une borne supérieure omise correspond à une borne non définie dans l'adaptation Web. Cette évolution rapproche la forme de l'API AndroidX sans prétendre reproduire ses contraintes de mesure.

## Migration des consommateurs et nettoyage — 28 octobre 2026

Les primitives ne doivent pas rester une bibliothèque parallèle sans adoption par le site. La migration utilise maintenant `Column` et `Arrangement.spacedBy` dans les formulaires de compte (connexion, renvoi de confirmation, inscription, changement d'adresse e-mail, demande et finalisation de réinitialisation, suppression du compte), ainsi que dans les consommateurs recensés. L'espacement est exprimé avec les tokens CSS partagés de Loculary via l'extension Web de `spacedBy` ; ces chaînes CSS sont une adaptation du portage, pas une signature AndroidX.

Après chaque migration, rechercher les anciennes classes `space-y-*`, les wrappers d'espacement et les compositions de présentation qui ne sont plus utilisés, puis les supprimer si aucune référence ne subsiste. Ne pas supprimer une classe globale ou un composant partagé avant un inventaire complet des consommateurs. Les styles encore nécessaires à d'autres pages restent en place jusqu'à leur migration.

Les tests actuels de contrat protègent certaines signatures et certains consommateurs. Ils ne remplacent pas les tests de rendu navigateur, la vérification de la géométrie Flexbox, ni les contrôles responsive, RTL, clavier et accessibilité. La parité complète avec le moteur de mesure Compose n'est pas revendiquée.


## Alignement et largeur responsive de `Column` — 28 octobre 2026

`Column` reprend le contrat AndroidX : `Alignment.Start` est l’alignement horizontal par défaut. Le portage Web ne doit pas remplacer ce contrat par `stretch` pour compenser la largeur intrinsèque de certains enfants Flexbox.

La largeur est une responsabilité distincte de l’alignement. Lorsqu’une composition de produit — panneau, carte ou formulaire — doit occuper toute la largeur disponible, elle doit exprimer cette contrainte explicitement (par exemple avec `w-full` dans une composition produit ou le modificateur partagé correspondant lorsque son usage est approprié). Cela permet d’avoir des pages responsives sans imposer l’étirement à toutes les utilisations de la primitive.

Les tests de contrat couvrent l’alignement par défaut et les alignements explicites ; ils ne remplacent pas une vérification de la géométrie dans un navigateur. La parité de mesure avec Compose reste partielle et doit être évaluée séparément.
