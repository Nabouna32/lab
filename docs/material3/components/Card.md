# Card — contrat AndroidX et adaptation Web

> **Référence de portage visée :** `androidx.compose.material3:material3:1.4.0`  
> **État des sources :** la source publiée 1.4.0 est identifiée par archive et SHA-256 ; le lien avec le commit Git AndroidX et le dump API exact reste à établir. Le snapshot immuable du 22 octobre 2026 sert à la veille, pas de preuve d'alignement avec 1.4.0.  
> **État du portage :** partiel, valeurs par défaut et rendu navigateur non vérifiés.  
> **État de migration :** variantes séparées ; `CardLink` est une composition Web Loculary.

## API et sources

- API officielle : [`Card`](https://developer.android.com/reference/kotlin/androidx/compose/material3/Card.composable), [`ElevatedCard`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ElevatedCard.composable), [`OutlinedCard`](https://developer.android.com/reference/kotlin/androidx/compose/material3/OutlinedCard.composable), [`CardDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/CardDefaults).
- Guide officiel : [Cartes avec Jetpack Compose](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Sources AndroidX épinglées pour consultation : [`Card.kt` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt).
- Provenance de l'archive publiée : [sources 1.4.0](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5`. Voir [sources et versions](../sources.md).
- Implémentation Web : [`Card.tsx`](../../../src/components/ui/Card.tsx).

## Contrat

- **ANDROIDX** — les variantes remplies, élevées et avec contour ont des API et des valeurs par défaut distinctes.
- **ANDROIDX** — le composable non interactif ne devient pas automatiquement cliquable ; les surcharges interactives ont un contrat d'état séparé.
- **WEB-ADAPTATION** — une navigation est rendue comme un lien HTML natif. `CardLink` est une composition Loculary, pas un composant AndroidX.
- **UNVERIFIED** — les valeurs exactes de forme, couleur, bordure et élévation de la version stable 1.4.0 n'ont pas encore été extraites et reliées de façon reproductible à l'implémentation. Les tokens CSS actuels ne suffisent pas à démontrer leur parité.

## État de l'implémentation

- `Card` utilise la surface `surface-container-highest`.
- `ElevatedCard` utilise `surface-container-low` et l'ombre partagée `--shadow-sm`.
- `OutlinedCard` utilise `surface` et `outline-variant`.
- Les trois variantes consomment `--m3-card-shape`, actuellement relié à `--shape-corner-medium`.
- Ces choix constituent l'implémentation Web actuelle ; la correspondance exacte avec les valeurs par défaut de la version AndroidX retenue demeure **à vérifier**.
- Les tests de contrat vérifient les frontières sémantiques entre conteneur non interactif et lien. Ils ne valident ni les pixels ni les états AndroidX.

## Vérifications restantes

- [ ] Extraire les valeurs et états de la source publiée 1.4.0 et consigner une provenance reproductible.
- [ ] Vérifier les valeurs par défaut propres aux trois variantes et les élévations selon les interactions.
- [ ] Cartographier les usages de production avant de faire évoluer l'API.
- [ ] Vérifier les thèmes clair/sombre, les contenus FR/EN, le responsive, le clavier et les lecteurs d'écran.
- [ ] Comparer le rendu réel en navigateur à la référence épinglée.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

Une CI verte ou une ressemblance visuelle ne suffit pas à déclarer le portage conforme.
