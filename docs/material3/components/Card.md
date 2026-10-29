# Card — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État des sources :** l’archive publiée est identifiée dans [sources et versions](../sources.md), mais son lien avec le commit AndroidX et le dump API exact reste à établir.  
> **État du portage :** partiel ; les valeurs par défaut et le rendu navigateur ne sont pas validés.  
> **Migration en production :** inventaire des usages à compléter.

## Sources de référence

- API officielle : [Card](https://developer.android.com/reference/kotlin/androidx/compose/material3/Card.composable), [ElevatedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/ElevatedCard.composable), [OutlinedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedCard.composable) et [CardDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/CardDefaults).
- Guide officiel : [Cartes avec Jetpack Compose](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Source AndroidX de consultation : [`Card.kt`, révision immuable](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt). Cette révision n’est pas démontrée comme étant celle de l’artefact 1.4.0.
- Implémentation Web : [`Card.tsx`](../../../src/components/ui/Card.tsx).

## Contrat

- **ANDROIDX** — `Card`, `ElevatedCard` et `OutlinedCard` sont trois variantes distinctes, avec des rôles visuels et valeurs par défaut propres.
- **ANDROIDX** — les conteneurs non interactifs et les variantes interactives ont des contrats distincts. Une carte de contenu ne devient pas cliquable par sa seule apparence.
- **WEB-ADAPTATION** — les navigations utilisent un lien HTML natif et les actions un bouton. Les conteneurs décoratifs restent non interactifs.
- **LOCULARY-EXTENSION** — `CardLink` est une composition produit qui associe l’apparence d’une carte à un lien Next.js ; ce n’est pas une API AndroidX.
- **UNVERIFIED** — les valeurs exactes de forme, de couleur, de bordure et d’élévation du port Web ne sont pas encore rapprochées de façon reproductible de la version stable retenue.

## Implémentation actuelle

- `Card` utilise `surface-container-highest`.
- `ElevatedCard` utilise `surface-container-low` et l’ombre partagée `--shadow-sm`.
- `OutlinedCard` utilise `surface` et `outline-variant`.
- Les trois variantes consomment `--m3-card-shape`, actuellement relié à `--shape-corner-medium`.
- Les trois conteneurs rendent un `div` non interactif ; `CardLink` rend un lien natif avec un indicateur de focus visible.

Ces choix décrivent l’implémentation Loculary, pas une preuve de parité AndroidX. Les tests statiques vérifient la séparation entre conteneur et navigation ; ils ne valident ni les pixels ni les états d’interaction.

## Vérifications restantes

- [ ] Relier la source publiée 1.4.0 à sa provenance et vérifier le contrat API exact.
- [ ] Extraire les valeurs par défaut propres aux trois variantes et les états d’élévation.
- [ ] Inventorier les usages de production avant toute modification cassante.
- [ ] Tester le clavier, le focus, les lecteurs d’écran, les thèmes clair/sombre, FR/EN et les largeurs pertinentes.
- [ ] Comparer le rendu réel du navigateur à la référence épinglée.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

## Lacunes ouvertes

| Lacune | Action |
|---|---|
| Lien entre artefact 1.4.0, commit et dump API non démontré | Vérifier et consigner une provenance reproductible |
| Valeurs CSS issues des tokens Loculary sans parité démontrée | Comparer les valeurs aux sources AndroidX publiées |
| Tests statiques sans preuve de rendu réel | Ajouter des vérifications navigateur et d’accessibilité |
| Usages de production incomplets | Cartographier les appels avant une refonte de l’API |

Le statut d’inventaire, la spécification, l’implémentation, la vérification et la migration en production restent suivis séparément. Une CI verte ne suffit pas à prouver la fidélité Material 3.
