# Tooltip — portage AndroidX Material 3

**Référence visée :** `androidx.compose.material3:material3:1.4.0`  
**Baseline source :** commit AndroidX `5113b82a4ed6416d6344efa50e41db8cb65928ff`.  
**État du portage React/Web :** partiel ; le rendu, le placement et l'animation ne sont pas démontrés équivalents à AndroidX.

## Sources normatives

- [AndroidX Tooltip.kt — Material 3 1.4.0](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Tooltip.kt)
- [AndroidX RichTooltipTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/RichTooltipTokens.kt)
- [AndroidX ShapeTokens.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt)
- [Android Developers — Tooltips](https://developer.android.com/develop/ui/compose/components/tooltip)
- [WAI-ARIA APG — Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

## Contrat AndroidX vérifié

- `TooltipBox` compose un déclencheur et un slot tooltip ; les contenus PlainTooltip et RichTooltip sont distincts.
- `RichTooltip` utilise `SurfaceContainer`, `CornerMedium` (12 dp), `onSurfaceVariant`, les rôles typographiques `TitleSmall` et `BodyMedium`, ainsi que `Level2`.
- La largeur maximale par défaut est 320 dp ; la largeur minimale du composant est 40 dp.
- Le modèle AndroidX prend en charge le déclenchement tactile par long-press, le survol souris et le focus clavier. Un affichage explicite peut être déclenché par l'état du tooltip.

## Adaptation Web

- Le déclencheur est un contrôle HTML natif avec un nom accessible.
- Le contenu non interactif conserve le modèle `role="tooltip"` et est associé au déclencheur par `aria-describedby` lorsqu'il est affiché.
- Le survol et le focus ouvrent le contenu ; Échap et un clic extérieur le ferment. Le RichTooltip peut être traversé au pointeur sans disparaître.
- `openOnClick` est une extension d'adaptation Web réservée aux déclencheurs qui doivent être explicitement activables au toucher, par exemple le bouton d'information du statut de traitement. Ce n'est pas une API AndroidX.
- Un contenu contenant des éléments interactifs ne doit pas rester un tooltip : employer un popover non modal ou un autre pattern dont le focus et la fermeture sont définis.

## État actuel et limites connues

- Le CSS reprend les rôles de couleur, la forme moyenne, la typographie et les largeurs du RichTooltip 1.4.0.
- `--shadow-sm` et le fade CSS sont des adaptations Web, pas une preuve de parité avec `Level2` et le MotionScheme AndroidX.
- Le placement Web mesure le déclencheur et le contenu, préfère le dessus puis bascule dessous selon l'espace disponible, aligne horizontalement et borne le contenu dans le viewport. L'écart de 4 px adapte le spacing AndroidX de 4 dp. Le tooltip utilise une position fixe une fois ouvert pour éviter le clipping des ancêtres ; le résultat reste une adaptation Web à comparer visuellement au Popup AndroidX.
- Le portage reste partiel jusqu'à comparaison navigateur avec la baseline AndroidX, inspection des styles calculés et vérification des interactions sur mobile, clavier, souris, zoom et thèmes clair/sombre. Le mapping CSS de l'élévation et du mouvement demeure explicitement non vérifié.

Ne pas modifier les valeurs AndroidX pour faire disparaître un avertissement WCAG. Si un conflit réel et reproductible ne peut être résolu dans l'adaptation Web, conserver le port fidèle et suivre le processus d'arbitrage `action-humaine`.
