# Chip — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État :** provenance de la release 1.4.0 vérifiée ; adaptation Web partielle et parité visuelle non vérifiées.

## Sources

- [API officielle des chips Compose](https://developer.android.com/develop/ui/compose/components/chip?hl=fr).
- Références : [AssistChipDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/AssistChipDefaults), [FilterChipDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/FilterChipDefaults), [InputChipDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/InputChipDefaults), [SuggestionChipDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/SuggestionChipDefaults).
- Source AndroidX épinglée : [Chip.kt au commit `5113b82a4ed6416d6344efa50e41db8cb65928ff`](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt).
- Provenance de l'archive stable 1.4.0 et SHA-256 : [sources.md](../sources.md).
- Implémentation Web : [Chip.tsx](../../../src/components/ui/Chip.tsx) et [Chip.module.css](../../../src/components/ui/Chip.module.css).

## Contrat

- **ANDROIDX** — Assist, Filter, Input et Suggestion ont des usages distincts ; les variantes élevées existent pour Assist, Filter et Suggestion. Les FilterChip filtrent un contenu ; les SuggestionChip proposent des suggestions dynamiques pour préciser l'intention, notamment dans une recherche.
- **ANDROIDX — FilterChip 1.4.0** — hauteur 32 dp, forme `CornerSmall`, contour `outlineVariant` de 1 dp à l'état non sélectionné ; conteneur `secondaryContainer`, libellé et coche `onSecondaryContainer`, sans contour lorsque sélectionné. Le libellé non sélectionné utilise `onSurfaceVariant` et l'icône initiale `primary`.
- **ANDROIDX — SuggestionChip 1.4.0** — hauteur 32 dp, forme `CornerSmall`, conteneur transparent, contour `outlineVariant` de 1 dp et libellé `onSurfaceVariant` ; une icône initiale éventuelle utilise `primary`.
- **WEB-ADAPTATION** — les interactions utilisent un vrai bouton HTML. L'API React commune `Chip` et sa propriété `variant` regroupent plusieurs signatures AndroidX ; c'est une composition Web Loculary, pas une reproduction exacte de l'API Kotlin. Les suggestions de recherche sans résultat utilisent désormais `variant="suggestion"` ; leur activation conserve le focus du champ via `onMouseDown.preventDefault()`, puis relance la recherche et replace explicitement le focus. La hauteur minimale de 40 px reste une adaptation de cible tactile Web. Le filtre de recherche migré conserve une hauteur minimale de 40 px pour ne pas réduire la zone d'interaction existante sur le Web ; cette valeur est une adaptation locale, pas une conversion dp/px.
- **ACCESSIBILITÉ** — le gestionnaire `onClick` fourni par l'appelant doit être conservé ; les états de sélection sont exposés via `aria-pressed` pour les variantes Filter et Input. L'action de retrait exige un libellé localisé explicite via `dismissLabel` (contrat TypeScript) et est désactivée avec le chip.
- **UNVERIFIED** — les interactions navigateur instrumentées, les couleurs calculées clair/sombre, le contraste en contexte, le zoom, les états désactivés et la comparaison visuelle AndroidX restent à vérifier.

## Vérifications restantes

- [ ] Tester activation, sélection, retrait, désactivation et focus clavier dans un navigateur, y compris le focus conservé lors du choix d'une SuggestionChip.
- [ ] Vérifier le nom accessible de l'action de retrait avec un lecteur d'écran.
- [ ] Comparer les couleurs calculées, le contraste, clair/sombre, FR/EN, zoom et tailles d'écran réelles.
- [ ] Comparer le rendu et les états aux références AndroidX épinglées.
- [ ] Exécuter tests, lint, vérification TypeScript et build.

Les tests statiques et la présence de tokens partagés ne prouvent pas la fidélité visuelle.
