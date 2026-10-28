# ListItem — adaptation Web d’AndroidX Material 3

## Référence source

- Artefact : `androidx.compose.material3:material3`
- Baseline de portage : AndroidX Material 3 **1.4.0**, conformément à [la baseline du projet](../README.md#sources-et-version-de-référence).
- Référence API : [Android Developers — ListItem](https://developer.android.com/reference/kotlin/androidx/compose/material3/ListItem.composable).
- Source AndroidX : [ListItem.kt](https://android.googlesource.com/platform/frameworks/support/+/5a2d128444cb13e02de45d535cb52acec20ff51e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ListItem.kt).

Cette spécification concerne d’abord la variante de contenu standard à une, deux ou trois lignes. Le contrat public AndroidX comporte aussi des variantes interactives et de sélection ; leur portage complet doit être suivi explicitement, et ne doit pas être déduit de la seule présence de ce composant.

## Rôle

Un ListItem est une rangée d’une liste continue, pour présenter un titre avec éventuellement un texte au-dessus, un texte de soutien, un contenu à gauche et un contenu à droite. Le composant n’est pas, à lui seul, un lien Web. Pour naviguer, le site doit conserver un véritable élément `<a>` autour de la rangée ; pour une action, utiliser un bouton natif.

## Contrat visuel de référence

Les mesures Android sont exprimées en dp/sp dans la source. L’adaptation Web utilise les valeurs numériques équivalentes en CSS px comme convention de portage, sans prétendre que dp et px sont universellement interchangeables.

- Une ligne : hauteur minimale de 56.
- Deux lignes : hauteur minimale de 72.
- Trois lignes : hauteur minimale de 88 ; le padding vertical nominal est de 12, contre 8 pour les variantes une/deux lignes.
- Padding horizontal : 16 de chaque côté.
- Écart entre le contenu principal et les contenus de bord : 16.
- Headline : rôle typographique Body Large, couleur `on-surface`.
- Supporting : Body Medium, couleur `on-surface-variant`.
- Overline : Label Small, couleur `on-surface-variant`.
- Contenu de tête et de queue : couleurs sémantiques fournies par les tokens du composant ; l’icône de tête standard est généralement 24.
- La rangée peut grandir si le contenu se replie sur plusieurs lignes ; les hauteurs ci-dessus sont des minima, pas des hauteurs fixes.
- L’arrière-plan et l’élévation doivent suivre les valeurs par défaut et paramètres AndroidX épinglés, pas des valeurs inventées localement.

## API Web actuelle et sémantique

La façade React expose `headline`, `overline`, `supporting`, `leading`, `trailing` et `lines`. Ces noms sont une adaptation idiomatique Web des slots AndroidX ; ils ne prétendent pas reproduire littéralement les noms Kotlin. Les éléments fournis restent du contenu React, et le composant ne doit pas avaler la sémantique des éléments descendants.

Une navigation doit être structurée comme suit : lien Next.js natif avec style/focus au niveau du lien, puis `ListItem` pour la composition visuelle. Cela conserve navigation clavier, ouverture du lien et sémantique de destination. Ne pas remplacer le lien par un `div` cliquable.

Le texte doit pouvoir se réduire et se replier sans pousser les contenus de tête/queue hors de la rangée. Les adresses e-mail et autres chaînes sans espaces doivent pouvoir casser sur plusieurs lignes. Le contenu de queue ne se réduit pas et reste aligné au centre vertical.

## Accessibilité, thèmes et mouvement

- Les couleurs viennent des rôles sémantiques du thème, pas de couleurs de palette codées en dur.
- Le thème clair et sombre doivent conserver la même hiérarchie de rôles et un contraste conforme WCAG 2.2 AA.
- Le lien ou bouton englobant doit avoir un focus clavier visible et une cible adaptée au tactile ; le focus ne doit pas être uniquement indiqué par un changement de couleur subtil.
- Les icônes purement décoratives sont masquées aux technologies d’assistance ; une icône d’action autonome doit avoir un nom accessible.
- Les animations de survol sont facultatives et doivent respecter `prefers-reduced-motion`.
- Les contenus longs, les textes français/anglais et les largeurs mobiles doivent être vérifiés en navigateur.

## État d’implémentation

Le composant existant est une adaptation partielle. Cette spécification et les tests de contrat fixent une première base visuelle et de composition ; ils ne suffisent pas à déclarer toute l’API AndroidX ListItem portée ou la parité du rendu vérifiée. Les variantes interactives, les couleurs/élévations paramétrables et la comparaison visuelle navigateur restent des travaux distincts tant qu’ils ne sont pas explicitement implémentés et validés.
