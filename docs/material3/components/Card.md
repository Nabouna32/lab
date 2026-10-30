# Card — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
 > **État des sources :** archive publiée 1.4.0 alignée byte pour byte avec le commit AndroidX `5113b82a4ed6416d6344efa50e41db8cb65928ff`.  
> **État du portage :** partiel ; valeurs par défaut et rendu navigateur non vérifiés.

## Sources

- API : [Card](https://developer.android.com/reference/kotlin/androidx/compose/material3/Card.composable), [ElevatedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/ElevatedCard.composable), [OutlinedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedCard.composable) et [CardDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/CardDefaults).
- Guide officiel : [Cartes avec Jetpack Compose](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Archive source publiée 1.4.0 : [material3-1.4.0-sources.jar](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5` (également consigné dans [sources et versions](../sources.md)).
- Source AndroidX de la release 1.4.0 : [`Card.kt` au commit `5113b82a4ed6416d6344efa50e41db8cb65928ff`](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt). 
- Implémentation Web : [`Card.tsx`](../../../src/components/ui/Card.tsx).

## Contrat

- **ANDROIDX** — `Card`, `ElevatedCard` et `OutlinedCard` sont trois variantes distinctes, avec leurs propres rôles visuels et valeurs par défaut.
- **ANDROIDX** — le conteneur non interactif et les variantes interactives ont des contrats distincts.
- **WEB-ADAPTATION** — la navigation utilise un lien HTML natif ; une action utilise un bouton. Une carte décorative reste non interactive.
- **LOCULARY-EXTENSION** — `CardLink` associe l'apparence d'une carte à un lien Next.js ; ce n'est pas une API AndroidX.
- **UNVERIFIED** — les valeurs exactes de forme, surface, contour et élévation de la version publiée ne sont pas encore reliées de façon reproductible à l'implémentation.

## Valeurs établies dans la source de release épinglée

Les sources de release AndroidX 1.4.0 citées plus haut permettent de vérifier les tokens suivants :

| Variante | Conteneur au repos | Forme | Élévation au repos | États d'interaction |
|---|---|---|---|---|
| `Card` remplie | `surfaceContainerHighest` | `cornerMedium` | `level0` | survol `level1`, glissement `level3` |
| `ElevatedCard` | `surfaceContainerLow` | `cornerMedium` | `level1` | survol `level2`, glissement `level4` |
| `OutlinedCard` | `surface` | `cornerMedium` | `level0` | contour `outlineVariant` au repos et au survol ; élévation `level1` au survol |

Sources directes de ces constats : `Card.kt`, `FilledCardTokens.kt`, `ElevatedCardTokens.kt` et `OutlinedCardTokens.kt` au commit de release AndroidX épinglé. Les variantes interactives ont également des états de focus, d'appui et de glissement spécifiques. Les couleurs et élévations des états doivent être portées lorsqu'une carte interactive est implémentée.

**Provenance :** la CI a comparé byte pour byte les sources publiées Material 3 1.4.0 avec ce commit AndroidX. Ces valeurs proviennent donc bien de la release stable 1.4.0. Leur portage dans Loculary et leur rendu navigateur restent à vérifier.

## Implémentation actuelle

- `Card` utilise `surface-container-highest`.
- `ElevatedCard` utilise `surface-container-low` et `--shadow-sm`.
- `OutlinedCard` utilise `surface` et `outline-variant`.
- Les trois variantes utilisent `--m3-card-shape`, actuellement relié à `--shape-corner-medium`.
- Les conteneurs restent non interactifs ; `CardLink` rend un lien natif avec un indicateur de focus visible.

Ces choix décrivent le portage Loculary, pas une preuve de parité AndroidX. Les tests statiques ne valident ni les pixels ni les états du navigateur.

## Vérifications restantes

- [ ] Vérifier les valeurs par défaut dans l'implémentation Web.
- [ ] Vérifier les états d'élévation et d'interaction dans le navigateur.
- [ ] Inventorier les usages de production avant toute modification cassante.
- [ ] Tester clavier, focus, technologies d'assistance, thèmes clair/sombre, FR/EN et largeurs pertinentes.
- [ ] Comparer le rendu navigateur à la référence épinglée.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

Le statut de la source, du portage, de la vérification et de la migration en production reste distinct. Une CI verte ne suffit pas à prouver la fidélité Material 3.
