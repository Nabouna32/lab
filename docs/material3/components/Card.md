# Card — contrat AndroidX et audit Loculary

> **Inventory:** `androidx.compose.material3:material3` / release candidate stable `1.4.0`  
> **Source status:** PARTIELLEMENT VÉRIFIÉ — l'archive publiée et le commit source ne sont pas encore reliés de façon reproductible  
> **Port status:** Partiel, adaptation Web en cours  
> **Migration status:** Partielle ; les encadrés éditoriaux réutilisent le wrapper Loculary `Card`

## Identité et périmètre

- API Kotlin officielle : `androidx.compose.material3.Card`, `ElevatedCard`, `OutlinedCard`, `CardDefaults`, `CardColors`, `CardElevation`.
- Artefact : `androidx.compose.material3:material3`.
- La documentation officielle décrit trois variantes visuelles : filled (`Card`), elevated (`ElevatedCard`) et outlined (`OutlinedCard`).
- Le composable de base n'est pas interactif par lui-même. Des surcharges séparées acceptent `onClick` et gèrent l'interaction.
- Le contrat public complet inclut aussi les variantes cliquables/sélectionnables et leurs paramètres d'état. Cette page est un audit initial et non un inventaire exhaustif de toutes les surcharges.

## Preuves épinglées

- Référence API officielle de [Card](https://developer.android.com/reference/kotlin/androidx/compose/material3/Card.composable) et [ElevatedCard](https://developer.android.com/reference/kotlin/androidx/compose/material3/ElevatedCard.composable).
- Référence officielle de [CardDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/CardDefaults).
- Guide officiel de conception et d'usage : [Cartes Jetpack Compose](https://developer.android.com/develop/ui/compose/components/card?hl=fr).
- Snapshot de consultation AndroidX immuable : [`Card.kt` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt).
- Source publiée de Material 3 1.4.0 et SHA-256 sont consignés dans [sources.md](../sources.md). Le lien entre l'archive publiée, le commit source ci-dessus et le dump API exact n'est pas établi : ne pas présenter ce snapshot comme la source vérifiée de la release stable.
- [API dump au commit immuable](https://github.com/androidx/androidx/tree/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/api) : le dépôt consulté ne contient pas de fichier `1.4.0.txt`. L'alignement exact du contrat de la release reste donc partiellement non vérifié.

## Comportement déduit de la documentation officielle

- **ANDROIDX** — `Card` est la carte remplie ; sa forme, ses couleurs, son élévation et sa bordure sont configurables.
- **ANDROIDX** — `ElevatedCard` utilise une élévation qui varie selon les interactions (repos, appui, focus, survol, glissement, désactivation).
- **ANDROIDX** — `OutlinedCard` dispose d'une bordure par défaut. Les couleurs et élévations peuvent également être configurées.
- **ANDROIDX** — les variantes cliquables ont une API d'interaction distincte du conteneur non interactif. Une carte de contenu ne doit donc pas devenir implicitement cliquable uniquement parce qu'elle ressemble à un lien.
- **WEB-ADAPTATION** — les interactions Web doivent employer des éléments HTML natifs adaptés à l'action. Une navigation doit être un lien, une action doit être un bouton ; la carte décorative doit rester un conteneur non interactif.
- **UNVERIFIED** — les valeurs exactes des tokens, la totalité des surcharges publiques et la séquence précise des états doivent être vérifiées dans l'archive publiée avant de revendiquer une fidélité complète.

## Audit Loculary

- Wrapper partagé actuel : [`src/components/ui/Card.tsx`](../../../src/components/ui/Card.tsx).
- Composition éditoriale : [`src/components/tools/ToolPage/EditorialPrimitives.tsx`](../../../src/components/tools/ToolPage/EditorialPrimitives.tsx).
- `Card` Loculary accepte actuellement `variant="elevated" | "filled" | "outlined"`, `className` et un `href` optionnel. Le chemin `href` rend un lien Next.js ; sinon le wrapper rend un `div`.
- Les classes utilisent les tokens de surface, forme et ombre Loculary. Ce sont des décisions de produit et de thème, pas une preuve d'équivalence avec les valeurs par défaut AndroidX.
- Les variantes visuelles sont regroupées dans un composant avec `href`, alors que l'API AndroidX sépare les variantes de carte et les surcharges interactives. La séparation Web entre lien, bouton et conteneur est à conserver dans la future API.

## Contrat cible pour le portage React/Web

- **ANDROIDX** — garder les trois variantes visuelles distinctes et leurs rôles de surface.
- **WEB-ADAPTATION** — proposer des primitives de conteneur non interactif et des variantes interactives sémantiquement explicites. Ne jamais rendre un `div` cliquable sans contrat clavier/ARIA adéquat.
- **LOCULARY-EXTENSION** — les tokens CSS de thème, les styles de composition et le routage Next.js appartiennent à l'intégration Web, pas à l'API AndroidX.
- **UNVERIFIED** — préciser l'API finale après extraction de la source 1.4.0, vérification des états et audit des call sites.

## Vérifications

- [x] Comparaison initiale avec les références API officielles.
- [x] Audit du wrapper et de la composition éditoriale Loculary.
- [ ] Vérification de toutes les surcharges et annotations depuis la source publiée 1.4.0.
- [ ] Extraction et vérification du contrat API exact de cette release.
- [ ] Tests de contrat pour les trois variantes et leurs états.
- [ ] Vérifications clavier, lecteur d'écran, thèmes clair/sombre, FR/EN et responsive.
- [ ] Comparaison en navigateur avec les références épinglées.
- [ ] Inventaire des call sites de production avant refonte de l'API.
- [ ] Lint, typecheck, tests et build pour l'implémentation.

## Lacunes et décisions ouvertes

| Lacune | Impact | Action nécessaire | Statut |
|---|---|---|---|
| Alignement release 1.4.0 ↔ commit ↔ API dump non établi | Impossible de garantir une fidélité de version exacte | Extraire l'archive publiée et consigner sa provenance, puis comparer le contrat | Ouvert |
| Wrapper actuel combine variantes et navigation | API différente du modèle AndroidX et risque de sémantique ambiguë | Cartographier tous les call sites et séparer conteneur, lien et action avant changement cassant | Ouvert |
| Les valeurs de surface et d'élévation reposent sur des tokens Loculary | Ressemblance visuelle possible sans équivalence source démontrée | Auditer les tokens Material 3 utilisés par la release retenue | Ouvert |
| Les tests de styles ne prouvent pas le comportement réel du navigateur | Régression d'interaction ou d'accessibilité possible | Ajouter tests de navigateur et revue clavier/technologies d'assistance | Ouvert |

## Cycle de vie

L'inventaire, la preuve source, la spécification, l'implémentation, la vérification et la migration en production sont suivis séparément. Une CI verte ne constitue pas à elle seule une preuve de fidélité Material 3.
