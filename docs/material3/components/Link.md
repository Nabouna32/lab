# Link — adaptation Web du contrat Material 3

**Statut :** adaptation Web en cours. Le composant conserve les sémantiques de navigation du navigateur ; sa présentation peut réutiliser les variantes visuelles de Button lorsque le contexte appelle un lien d’action.

## Sources et périmètre

- [AndroidX Compose UI — LinkAnnotation](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/LinkAnnotation): API officielle pour annoter du texte avec une destination de lien ; ce n’est pas un équivalent direct d’un composant React de navigation.
- [Next.js — Link](https://nextjs.org/docs/app/api-reference/components/link): composant de navigation Web utilisé par Loculary.
- [Contrat Button Loculary](Button.md): source AndroidX Button.kt et fichiers de tokens épinglés à 2fb1702c1c62a6059e73d757d9e4eda1044ce21d.

AndroidX ne fournit pas de composable public générique Link correspondant directement à un composant React de navigation. Le lien Web doit donc rester une ancre, et l’adaptation se limite au style et aux interactions visuelles.

## Contrat de AppLink

Implémentation : src/components/ui/AppLink.tsx.

- **Sémantique obligatoire :** utiliser Next.js Link et conserver le rendu d’une ancre. Ne pas remplacer la navigation par un élément button.
- **Présentation d’action :** filled, elevated, filled-tonal, outlined et text réutilisent material-button-variant-styles.ts, la même source de classes que les boutons natifs. Ce partage empêche les variantes visuelles de dériver.
- **Contenu avec icône :** leadingIcon applique les retraits horizontaux correspondants à la variante Button.
- **Navigation ordinaire :** navigation reste un traitement contextuel pour la navigation de l’en-tête. inline conserve le traitement de lien textuel.
- **Réduction des animations :** les transitions CSS respectent prefers-reduced-motion. Aucun ripple de bouton n’est injecté dans une ancre.
- **États et accessibilité :** le focus clavier doit rester visible ; le texte doit annoncer la destination ou l’action. Les liens ne reçoivent pas artificiellement les états disabled, pressed ou selected d’un bouton.
- **Couleurs sémantiques :** les apparences personnalisées doivent utiliser les rôles du thème. Une action destructive n’implique pas automatiquement une ancre rouge ou remplie ; la hiérarchie et la conséquence réelle guident le choix.

## Usages migrés

- Le pied de page utilise l’apparence text : ces éléments restent des destinations de navigation, pas des actions exécutées sur place.
- La page Compte utilise filled pour la connexion et l’accès administrateur, outlined pour l’inscription, et text avec la couleur sémantique d’erreur pour l’entrée vers la suppression du compte.
- Le composant historique AccountActionLink a été supprimé après migration de ses consommateurs.
- Le lien « Explorer » de l’en-tête reste un lien de navigation, sans être transformé mécaniquement en bouton d’action.

## Vérifications restantes

- [ ] Vérifier les styles calculés et le contraste en thèmes clair et sombre.
- [ ] Vérifier clavier, focus visible, zoom à 200 %, libellés longs FR/EN et responsive.
- [ ] Auditer les autres liens d’action du site et remplacer les styles locaux seulement après identification du rôle réel de chaque lien.
- [ ] Confirmer que les variantes de lien et de bouton restent visuellement cohérentes sans altérer les sémantiques de navigation.

La réutilisation des styles n’est pas une preuve de fidélité complète : l’état visuel réel dans le navigateur et les différences Web restent à vérifier.