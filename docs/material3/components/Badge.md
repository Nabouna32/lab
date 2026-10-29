# Badge et BadgedBox — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État :** adaptation Web partielle ; dimensions, couleurs et ancrage restent à vérifier.

## Sources

- Références API : [Badge](https://developer.android.com/reference/kotlin/androidx/compose/material3/Badge.composable), [BadgedBox](https://developer.android.com/reference/kotlin/androidx/compose/material3/BadgedBox.composable), [BadgeDefaults](https://developer.android.com/reference/kotlin/androidx/compose/material3/BadgeDefaults).
- Source AndroidX épinglée : [Badge.kt au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Badge.kt).
- Provenance de l'archive stable 1.4.0 et SHA-256 : [sources.md](../sources.md).
- Implémentation Web : [Badge.tsx](../../../src/components/ui/Badge.tsx) et [Badge.module.css](../../../src/components/ui/Badge.module.css).

## Contrat

- **ANDROIDX** — un badge signale un statut ou une quantité ; `BadgedBox` positionne le badge relativement à son contenu d'ancrage.
- **WEB-ADAPTATION** — les variantes CSS `small` et `large`, ainsi que `accessibleLabel`, forment une API Web pratique et ne reproduisent pas exactement les signatures AndroidX.
- **ACCESSIBILITÉ** — un badge purement visuel est masqué à l'arbre d'accessibilité. Avec `accessibleLabel`, il est exposé comme image nommée. Le contrôle interactif parent doit conserver son propre nom accessible complet.
- **UNVERIFIED** — couleurs, dimensions et décalage d'ancrage n'ont pas été comparés aux valeurs exactes de la source publiée 1.4.0.

## Vérifications restantes

- [ ] Relier la source publiée 1.4.0 au commit et au dump API exacts.
- [ ] Vérifier badge numérique, indicateur sans contenu et nom accessible.
- [ ] Tester la lecture du badge et de son contrôle parent.
- [ ] Comparer clair/sombre et rendu responsive.
- [ ] Exécuter tests, lint, vérification TypeScript et build.

Les tests statiques ne remplacent pas la validation de rendu et d'accessibilité.
