# Chip — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État :** adaptation Web partielle ; la source publiée stable est identifiée, mais son alignement avec le commit de développement et le dump API n'est pas établi. Les valeurs exactes et la parité visuelle restent non vérifiées.

## API et sources

- Guides officiels : [Chips Compose (français)](https://developer.android.com/develop/ui/compose/components/chip?hl=fr).
- Références API : [`AssistChipDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/AssistChipDefaults), [`FilterChipDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/FilterChipDefaults), [`InputChipDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/InputChipDefaults), [`SuggestionChipDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/SuggestionChipDefaults).
- Source de veille épinglée : [`Chip.kt` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt).
- Archive source stable et provenance : [sources Material 3 1.4.0](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5`. L'alignement avec le commit de veille reste à établir.
- Implémentation : [`Chip.tsx`](../../../src/components/ui/Chip.tsx) et [`Chip.module.css`](../../../src/components/ui/Chip.module.css).

## Contrat

- **ANDROIDX** — les types Assist, Filter, Input et Suggestion ont des usages distincts ; les variantes élevées existent pour Assist, Filter et Suggestion.
- **ANDROIDX** — un filtre expose son état sélectionné et affiche une coche lorsqu'il est sélectionné. L'état et l'interaction sont distincts des chips non sélectionnables.
- **ANDROIDX** — un InputChip peut présenter un contenu sélectionné et une action de retrait. Cette action doit conserver une sémantique accessible.
- **WEB-ADAPTATION** — les composants interactifs utilisent un vrai `button`, les états sont exposés via `aria-pressed` lorsque cela convient et les libellés d'action sont localisables.
- **LOCULARY-EXTENSION** — l'API React commune `Chip` avec `variant` regroupe plusieurs composants AndroidX ; elle facilite l'usage interne mais n'est pas une reproduction de leurs signatures Kotlin.
- **UNVERIFIED** — les couleurs, élévations, espacements, dimensions et transitions CSS n'ont pas encore été comparés de bout en bout aux valeurs source 1.4.0.

## Corrections de cette tranche

- L'action `onClick` fournie par l'appelant est conservée même lorsqu'un filtre gère également `onSelectedChange`.
- Les états sélectionnés des variantes Filter et Input sont exposés par `aria-pressed`.
- Les boutons désactivés ont un état visuel explicite et l'action de retrait est désactivée avec le chip.
- Le libellé de retrait peut être fourni dans la langue de l'interface ; l'exemple du Design Lab le localise en français et en anglais.
- Les animations CSS sont désactivées lorsque `prefers-reduced-motion: reduce` est actif.

## Vérifications restantes

- [ ] Vérifier les couleurs et valeurs de chaque variante depuis la source publiée 1.4.0.
- [ ] Tester activation/désactivation, sélection, retrait, désactivation et focus au clavier.
- [ ] Vérifier le nom accessible de l'action de retrait avec un lecteur d'écran.
- [ ] Comparer clair/sombre, FR/EN et tailles d'écran réelles en navigateur.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

La présence d'un token ou le passage de tests statiques ne prouve pas la fidélité visuelle.
