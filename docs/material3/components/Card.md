# Card — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État des sources :** archive publiée identifiée ; lien avec le commit Git et le dump API exact non démontré.  
> **État du portage :** partiel ; valeurs par défaut et rendu navigateur non vérifiés.

## Sources

- API : [Card](https://developer.android.com/reference/kotlin/androidx/compose/material3/Card.composable), [ElevatedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/ElevatedCard.composable), [OutlinedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedCard.composable) et [CardDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/CardDefaults).
- Guide officiel : [Cartes avec Jetpack Compose](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Archive source publiée 1.4.0 : [material3-1.4.0-sources.jar](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5` (également consigné dans [sources et versions](../sources.md)).
- Snapshot de veille immuable : [`Card.kt` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt). Ce snapshot n'est pas une preuve d'alignement avec l'archive 1.4.0.
- Implémentation Web : [`Card.tsx`](../../../src/components/ui/Card.tsx).

## Contrat

- **ANDROIDX** — `Card`, `ElevatedCard` et `OutlinedCard` sont trois variantes distinctes, avec leurs propres rôles visuels et valeurs par défaut.
- **ANDROIDX** — le conteneur non interactif et les variantes interactives ont des contrats distincts.
- **WEB-ADAPTATION** — la navigation utilise un lien HTML natif ; une action utilise un bouton. Une carte décorative reste non interactive.
- **LOCULARY-EXTENSION** — `CardLink` associe l'apparence d'une carte à un lien Next.js ; ce n'est pas une API AndroidX.
- **UNVERIFIED** — les valeurs exactes de forme, surface, contour et élévation de la version publiée ne sont pas encore reliées de façon reproductible à l'implémentation.

## Valeurs établies dans le snapshot épinglé

Le snapshot AndroidX immuable cité plus haut permet de vérifier les tokens suivants **pour cette révision uniquement** :

| Variante | Conteneur au repos | Forme | Élévation au repos | États d'interaction |
|---|---|---|---|---|
| `Card` remplie | `surfaceContainerHighest` | `cornerMedium` | `level0` | survol `level1`, glissement `level3` |
| `ElevatedCard` | `surfaceContainerLow` | `cornerMedium` | `level1` | survol `level2`, glissement `level4` |
| `OutlinedCard` | `surface` | `cornerMedium` | `level0` | contour `outlineVariant` au repos et au survol ; élévation `level1` au survol |

Sources directes de ces constats : `Card.kt`, `FilledCardTokens.kt`, `ElevatedCardTokens.kt` et `OutlinedCardTokens.kt` au même commit AndroidX épinglé. Les variantes interactives ont également des états de focus, d'appui et de glissement spécifiques. Les couleurs et élévations des états doivent être portées lorsqu'une carte interactive est implémentée.

**Limite de provenance :** ces valeurs sont vérifiées dans le snapshot Git immuable, mais l'alignement de ce snapshot avec l'archive publiée Material 3 1.4.0 n'est pas démontré. Elles ne doivent donc pas être présentées comme la preuve d'une parité exacte avec cette version publiée.

## Implémentation actuelle

- `Card` utilise `surface-container-highest`.
- `ElevatedCard` utilise `surface-container-low` et `--shadow-sm`.
- `OutlinedCard` utilise `surface` et `outline-variant`.
- Les trois variantes utilisent `--m3-card-shape`, actuellement relié à `--shape-corner-medium`.
- Les conteneurs restent non interactifs ; `CardLink` rend un lien natif avec un indicateur de focus visible.

Ces choix décrivent le portage Loculary, pas une preuve de parité AndroidX. Les tests statiques ne valident ni les pixels ni les états du navigateur.

## Vérifications restantes

- [ ] Établir la provenance reliant l'archive 1.4.0 au commit et au dump API.
- [ ] Extraire les valeurs par défaut propres aux variantes et les états d'élévation.
- [ ] Inventorier les usages de production avant toute modification cassante.
- [ ] Tester clavier, focus, technologies d'assistance, thèmes clair/sombre, FR/EN et largeurs pertinentes.
- [ ] Comparer le rendu navigateur à la référence épinglée.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

Le statut de la source, du portage, de la vérification et de la migration en production reste distinct. Une CI verte ne suffit pas à prouver la fidélité Material 3.
