# Snackbar — Material 3 1.4.0

## Statut

**Port React/Web partiel.** Le composant visuel couvre message, action, dismiss action optionnelle, disposition de l'action sur une nouvelle ligne, couleurs, forme, annonce polie et temporisation courte. Il ne constitue pas encore un port de `SnackbarHostState` / `SnackbarHost` : file FIFO, résultats suspendus, annulation de requêtes, durées Long/Indefinite, ajustement du délai par les services d'accessibilité et transitions host restent à reconstruire.

- Artefact : `androidx.compose.material3:material3`
- Version : `1.4.0` stable
- Commit source immuable : [5113b82a4ed6416d6344efa50e41db8cb65928ff](https://github.com/androidx/androidx/tree/5113b82a4ed6416d6344efa50e41db8cb65928ff)
- Visuel : [Snackbar.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Snackbar.kt)
- Host et état : [SnackbarHost.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SnackbarHost.kt)
- Tokens : [SnackbarTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SnackbarTokens.kt)
- API publiée : [current.txt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/api/current.txt)
- Tests : [SnackbarTest.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/androidInstrumentedTest/kotlin/androidx/compose/material3/SnackbarTest.kt), [SnackbarHostTest.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/androidInstrumentedTest/kotlin/androidx/compose/material3/SnackbarHostTest.kt)

## Contrat visuel

AndroidX distingue le visuel `Snackbar` du contrôleur `SnackbarHost` :

- Surcharge visuelle à slots : `action`, `dismissAction`, `actionOnNewLine`, `shape`, `containerColor`, `contentColor`, couleurs d'action/dismiss et `content`.
- Surcharge visuelle pilotée par `SnackbarData` : lit `message`, `actionLabel` et `withDismissAction`, puis déclenche `performAction()` ou `dismiss()`.
- Le dismiss affordance est optionnel. Il n'est pas présent par défaut.
- L'action est distincte du dismiss ; cliquer l'action résout le résultat `ActionPerformed`, tandis qu'une fermeture ou un timeout résout `Dismissed`.

Le port Web conserve son API de contrôle `open/message/onDismiss` historique et ajoute `withDismissAction`, `actionOnNewLine`, `containerColor`, `contentColor`, `actionContentColor`, `dismissActionContentColor` et `shape`. Ce n'est pas encore une substitution de l'API `SnackbarData`.

## Tokens et valeurs

| Propriété | AndroidX 1.4.0 |
|---|---|
| Conteneur | `InverseSurface` |
| Texte | `InverseOnSurface` / `BodyMedium` |
| Action | `InversePrimary` / `LabelLarge` |
| Icône dismiss | `InverseOnSurface` |
| Forme | `CornerExtraSmall` |
| Élévation | `Level3` |
| Hauteur minimale une ligne | 48 dp |
| Hauteur minimale deux lignes | 68 dp |
| Largeur maximale | 600 dp |

Le port CSS utilise une ombre approchée ; elle ne reproduit pas exactement l'élévation Compose. Les couleurs et la forme sont configurables ; les valeurs par défaut utilisent les rôles Material 3 inverses.

## Durées et file d'attente — source AndroidX

- `Short` : 4 000 ms.
- `Long` : 10 000 ms.
- `Indefinite` : jusqu'à une action ou un dismiss explicite.
- `showSnackbar(message, actionLabel, withDismissAction, duration)` utilise `Short` sans action et `Indefinite` avec action par défaut.
- `SnackbarHostState` n'affiche qu'un snackbar à la fois et sérialise les demandes en FIFO ; l'annulation retire une demande de la file ou ferme l'élément courant.
- `SnackbarHost` ajuste le délai avec `AccessibilityManager.calculateRecommendedTimeoutMillis`, selon texte, icônes et contrôles.

Le port actuel conserve la règle essentielle « action => pas d'auto-dismiss », mais ne fournit pas encore la file FIFO ni les durées Long/Indefinite comme API dédiée.

## Limites et suite

- Reconstituer `SnackbarHostState` et `SnackbarHost` séparément du visuel, avec queue FIFO, résultats et annulation.
- Ajouter durées Short/Long/Indefinite et une stratégie d'ajustement accessible des timeouts.
- Reproduire la disposition AndroidX une ligne/deux lignes, les baselines typographiques et les paddings des actions.
- Vérifier le rôle live, les annonces, le focus clavier, la navigation, le contraste et `prefers-reduced-motion`.
- Comparer en navigateur clair/sombre, FR/EN, téléphone/tablette et avec actions longues.

Le port reste `partial` ; la présence d'une temporisation et d'un visuel ne prouve pas la parité du host AndroidX.
