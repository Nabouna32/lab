# Badge et BadgedBox — contrat AndroidX et adaptation Web

> **Référence visée :** `androidx.compose.material3:material3:1.4.0`  
> **État :** adaptation Web partielle ; la provenance de l'archive stable est connue, mais son alignement avec le commit de veille reste non vérifié.

## API et sources

- Référence API : [`Badge`](https://developer.android.com/reference/kotlin/androidx/compose/material3/Badge.composable), [`BadgedBox`](https://developer.android.com/reference/kotlin/androidx/compose/material3/BadgedBox.composable), [`BadgeDefaults`](https://developer.android.com/reference/kotlin/androidx/compose/material3/BadgeDefaults).
- Source de veille épinglée : [`Badge.kt` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Badge.kt).
- Archive source stable et provenance : [sources Material 3 1.4.0](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5`.
- Implémentation : [`Badge.tsx`](../../../src/components/ui/Badge.tsx) et [`Badge.module.css`](../../../src/components/ui/Badge.module.css).

## Contrat

- **ANDROIDX** — le badge signale un statut ou une quantité ; `BadgedBox` positionne un badge relativement à son contenu d'ancrage.
- **WEB-ADAPTATION** — le badge est décoratif pour les technologies d'assistance lorsqu'aucun nom accessible n'est fourni. Avec `accessibleLabel`, il est exposé comme image nommée. Le contrôle qui porte l'action doit, si nécessaire, posséder son propre nom accessible complet.
- **LOCULARY-EXTENSION** — les variantes CSS `small` et `large`, ainsi que la propriété `accessibleLabel`, forment une API Web pratique ; elles ne prétendent pas reproduire exactement les signatures AndroidX.
- **UNVERIFIED** — les valeurs de couleur, dimensions et décalage d'ancrage doivent être vérifiées à partir de la source publiée 1.4.0 et comparées au rendu navigateur.

## Corrections de cette tranche

- Un badge purement visuel est masqué à l'arbre d'accessibilité au lieu de laisser un `aria-label` sur un élément générique sans rôle.
- Un badge nommé reçoit le rôle `img` et un nom accessible explicite.
- Les couleurs utilisent les rôles sémantiques partagés `--error` et `--on-error`, sans valeurs de palette en repli dans le composant.

## Vérifications restantes

- [ ] Confirmer les valeurs source de couleur, taille et ancrage.
- [ ] Vérifier les combinaisons badge numérique / indicateur, contenu absent et libellé accessible.
- [ ] Tester la lecture des badges de notification et de leur contrôle parent.
- [ ] Comparer les thèmes clair/sombre et le rendu responsive en navigateur.
- [ ] Exécuter lint, vérification TypeScript, tests et build.

Les tests statiques ne remplacent pas la validation de rendu et d'accessibilité.
