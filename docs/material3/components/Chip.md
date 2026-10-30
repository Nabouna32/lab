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

- **ANDROIDX** — Assist, Filter, Input et Suggestion ont des usages distincts ; les variantes élevées existent pour Assist, Filter et Suggestion.
- **ANDROIDX** — un FilterChip expose la sélection et affiche une coche lorsque sélectionné.
- **WEB-ADAPTATION** — les interactions utilisent un vrai bouton HTML. L'API React commune `Chip` et sa propriété `variant` regroupent plusieurs signatures AndroidX ; c'est une composition Web Loculary, pas une reproduction exacte de l'API Kotlin.
- **ACCESSIBILITÉ** — le gestionnaire `onClick` fourni par l'appelant doit être conservé ; les états de sélection sont exposés via `aria-pressed` pour les variantes Filter et Input. L'action de retrait exige un libellé localisé explicite via `dismissLabel` (contrat TypeScript) et est désactivée avec le chip.
- **UNVERIFIED** — couleurs, dimensions, espacements, élévations et transitions n'ont pas été comparés de bout en bout aux valeurs de la source publiée 1.4.0.

## Vérifications restantes

- [ ] Tester activation, sélection, retrait, désactivation et focus clavier.
- [ ] Vérifier le nom accessible de l'action de retrait avec un lecteur d'écran.
- [ ] Comparer clair/sombre, FR/EN et tailles d'écran réelles.
- [ ] Exécuter tests, lint, vérification TypeScript et build.

Les tests statiques et la présence de tokens partagés ne prouvent pas la fidélité visuelle.
