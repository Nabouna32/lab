# Revue sémantique — Compose Foundation Layout 1.12.1

## Statut

Première revue sémantique réalisée pour l'artefact `androidx.compose.foundation:foundation-layout`, dans le périmètre téléphone/tablette. **L'inventaire exhaustif et le portage Web ne sont pas validés.**

- Release : 1.12.1.
- Commit AndroidX immuable : [5e0747401bf56b243e3b5141ae080dc9bc61d29c](https://github.com/androidx/androidx/tree/5e0747401bf56b243e3b5141ae080dc9bc61d29c).
- Dump API : [current.txt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/foundation/foundation-layout/api/current.txt).
- Provenance et alignement des sources publiées : [manifeste Compose P0](baselines/compose-p0-1.12.1-api-provenance.json), vérifié par CI #4516.

## Inventaire mécanique

Le dump comporte 758 déclarations dans un package. Le comptage exhaustif inclut 91 déclarations de types (23 façades JVM de fichiers `*Kt` et 68 types Kotlin, dont les types imbriqués) ainsi que 667 membres. Les façades JVM sont conservées dans l'inventaire mais ne sont pas des API Kotlin à porter.

| Mesure | Nombre |
|---|---:|
| Déclarations | 758 |
| Types déclarés (types imbriqués inclus) | 91 |
| Méthodes | 501 |
| Propriétés | 129 |
| Champs | 26 |
| Fonctions top-level | 2 |
| Constructeurs | 7 |
| Constantes d'énumération | 2 |
| Candidates API source après exclusion bytecode-only, inaccessibles Kotlin et façades JVM générées | 440 |
| `@BytecodeOnly` | 255 |
| `@InaccessibleFromKotlin` | 40 |
| Façades JVM générées `*Kt` (conservées, non candidates) | 23 |
| `@KotlinOnly` (inclus dans les 440 candidates) | 99 |
| Déclarations portant une annotation expérimentale | 158 |
| Déclarations portant `@Deprecated` | 77 |
| Occurrences `@ExperimentalLayoutApi` | 30 |

Ces métriques décrivent les lignes de déclaration du dump, y compris les types imbriqués et les façades JVM ; elles ne mesurent ni le nombre de fonctionnalités ni le nombre d'API à porter. Les façades `*Kt` sont des conteneurs ABI générés : leurs signatures sont conservées pour la traçabilité, mais elles ne constituent pas des types Kotlin à recréer. Les entrées `@KotlinOnly` restent candidates car elles représentent des signatures source Kotlin. Une déclaration candidate doit encore être comprise dans son contexte source.

## Contrats sémantiques

### Conteneurs

- **Row** : mesure sur l'axe horizontal, arrangement horizontal, alignement vertical ; `RowScope` fournit `weight`, `align`, `alignBy` et `alignByBaseline`.
- **Column** : même contrat sur l'axe vertical ; alignement horizontal par défaut `Alignment.Start`.
- **Box** : superpose ses enfants ; alignement global et par enfant, `matchParentSize`. `propagateMinConstraints` vaut `false` par défaut et change la mesure quand il est activé.
- **BoxWithConstraints** : expose les contraintes disponibles au contenu et s'appuie sur une composition différée ; ce n'est pas simplement un conteneur de largeur 100 %.
- **Spacer** : aucune taille intrinsèque ; la taille vient des contraintes et des modificateurs.
- **FlowRow / FlowColumn** : remplissage successif puis retour à la ligne/colonne. Les baselines ne sont pas alignées automatiquement comme dans certains usages de Row. Les anciennes surcharges avec `overflow` sont dépréciées ; les surcharges actuelles restent expérimentales.

### Arrangement, dimensions et positionnement

- `Arrangement.Start/End` sont logiques et dépendent de la direction de layout ; `Absolute.Left/Right` sont physiques. `SpaceBetween`, `SpaceAround`, `SpaceEvenly`, `spacedBy` et `aligned` distribuent l'espace restant.
- `padding(start, top, end, bottom)` est RTL-aware ; `absolutePadding(left, top, right, bottom)` est physique. Le padding est appliqué avant mesure et les valeurs négatives sont rejetées.
- `width/height/size` exprime une dimension préférée que les contraintes du parent peuvent modifier. `requiredWidth/requiredHeight/requiredSize` impose la dimension malgré les contraintes entrantes. Une simple propriété CSS `width` ne reproduit pas ces deux contrats.
- `fillMax*`, `widthIn/heightIn/sizeIn`, `wrapContent*`, `defaultMinSize` et `aspectRatio` modifient les contraintes et la mesure.
- `IntrinsicSize` interroge les dimensions intrinsèques avant la mesure finale. CSS `min-content` / `max-content` est un rapprochement, pas une équivalence générale.
- `offset` déplace le contenu sans être un padding négatif ; variantes logiques et absolues restent distinctes.

### WindowInsets et plateformes

`WindowInsets` expose des valeurs en pixels, converties selon densité et direction. `union`, `exclude`, `add` et `only` composent ces zones. `windowInsetsPadding`, `consumeWindowInsets`, `imePadding`, `systemBarsPadding` et les modificateurs safe-area participent à une consommation hiérarchique destinée à éviter les doubles compensations.

Les propriétés Android `statusBars`, `navigationBars`, `ime`, `displayCutout`, les gestes système, la visibilité et les bornes d'animation proviennent des API de fenêtre Android. Elles ne sont pas de simples espacements.

**Décision Web :** `env(safe-area-inset-*)` couvre une partie des zones sûres sur les navigateurs compatibles, mais ne reproduit ni les insets Android, ni leur consommation hiérarchique, ni l'IME et ses animations, ni les zones réservées aux gestes système. Ne pas porter `WindowInsets` tel quel dans React sans contrat Web explicite sur les sources de valeurs, leur mise à jour et l'anti-double-compensation.

## Décisions de portage

| Domaine | Décision | Priorité |
|---|---|---|
| Row, Column, Box, Spacer, Arrangement | Conserver les primitives existantes ; valider Flexbox/Grid et les contraintes au lieu de créer une seconde pile de layout. | P0 |
| Padding, tailles, fill, wrap, aspect ratio | Auditer les implémentations et cas de contraintes avant extension ; préserver RTL et preferred/required. | P0 |
| FlowRow / FlowColumn | Pas de portage préventif ; rechercher un besoin réel de grille fluide. | P1 conditionnel |
| BoxWithConstraints, mesure intrinsèque, lignes d'alignement | Porter seulement les comportements nécessaires à une composition identifiée. | P1 |
| WindowInsets Android | Étudier séparément les zones sûres Web et le clavier virtuel ; pas de portage Android direct. | P1 |
| Rulers et API spécialisées | Différé sans besoin produit concret. | Différé |

La recherche ciblée du dépôt retrouve déjà Row, Column, Box, Spacer et Arrangement dans le portage. Elle n'a pas retrouvé de références directes à WindowInsets, FlowRow, FlowColumn, BoxWithConstraints, aspectRatio ou paddingFrom dans les résultats indexés ; ce n'est pas une preuve d'absence absolue.

## Sources lues

Sources à la révision épinglée : `Arrangement.kt`, `Row.kt`, `Column.kt`, `Box.kt`, `BoxWithConstraints.kt`, `FlowLayout.kt`, `Spacer.kt`, `Padding.kt`, `Size.kt`, `AspectRatio.kt`, `Offset.kt`, `Intrinsic.kt`, `AlignmentLine.kt`, `WindowInsets.kt`, `WindowInsetsPadding.kt`, `WindowInsetsSize.kt`, `WindowInsets.android.kt` et `WindowInsetsPadding.android.kt`.

La revue distingue les sources communes et Android. Elle ne couvre pas encore tous les tests, samples, variantes de plateforme ni chaque KDoc.

## Reste à faire

1. Générer et versionner les déclarations normalisées exhaustives des quatre familles P0 avec empreintes et identifiants stables.
2. Classer chaque déclaration (source, ABI généré, Kotlin-only, inaccessible, expérimentale, dépréciée) sans jeter les signatures inconnues.
3. Compléter les revues sémantiques Compose UI, Foundation et UI Text.
4. Relier les API utiles aux spécifications et usages Loculary ; garder les API Android sans équivalent Web explicitement non portées.
5. Garder les quatre familles `inventoryStatus: in-progress` jusqu'à livraison des inventaires exhaustifs et de leurs contrôles reproductibles.

**Conclusion :** cette tranche classe les principaux contrats Foundation Layout et leurs conséquences Web ; elle ne revendique ni exhaustivité déclaration par déclaration ni parité navigateur.
