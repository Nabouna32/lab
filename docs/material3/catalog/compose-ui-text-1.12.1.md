# Revue sémantique ciblée — Compose UI Text 1.12.1

## Statut et périmètre

Cette revue examine les contrats de texte qui peuvent éclairer le portage React/Web de Loculary. Elle ne constitue ni un inventaire exhaustif des 1 774 déclarations UI Text, ni une déclaration de parité navigateur.

- Artefact : `androidx.compose.ui:ui-text`
- Release : `1.12.1`
- Commit AndroidX immuable : [`5e0747401bf56b243e3b5141ae080dc9bc61d29c`](https://github.com/androidx/androidx/tree/5e0747401bf56b243e3b5141ae080dc9bc61d29c)
- Dump public : [`compose/ui/ui-text/api/current.txt`](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/api/current.txt)
- Empreinte SHA-256 du dump : `5fcaf939a396a4cbd66a97d1917457a0c48ee9332a12babe10e1e7b28464785c`
- Sources publiées : archive Google Maven `androidx.compose.ui:ui-text:1.12.1`, alignée byte pour byte avec le commit ci-dessus selon la CI #4516.

Les nombres de l'inventaire mécanique décrivent des déclarations API, pas des composants visuels à reproduire.

## Sources AndroidX examinées

Les sources ci-dessous sont épinglées au même commit :

- [AnnotatedString.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/AnnotatedString.kt)
- [TextStyle.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/TextStyle.kt)
- [SpanStyle.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/SpanStyle.kt)
- [ParagraphStyle.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/ParagraphStyle.kt)
- [TextMeasurer.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/TextMeasurer.kt)
- [TextLayoutResult.kt](https://github.com/androidx/androidx/blob/5e0747401bf56b243e3b5141ae080dc9bc61d29c/compose/ui/ui-text/src/commonMain/kotlin/androidx/compose/ui/text/TextLayoutResult.kt)

Référence API officielle : [androidx.compose.ui.text](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/package-summary).

## Contrats sémantiques

### Texte enrichi et annotations

`AnnotatedString` est une séquence de caractères associée à des plages de `SpanStyle`, de `ParagraphStyle` et d'annotations. Les styles de portée caractère et les styles de paragraphe ne sont pas interchangeables : le second introduit une frontière de paragraphe. Les annotations peuvent porter une sémantique supplémentaire, notamment des liens ou des actions.

**ANDROIDX :** le texte enrichi conserve le texte source et des plages indexées ; les plages et leurs bornes font partie du contrat. Les placeholders permettent de réserver une plage de texte à un contenu intégré lors de la mise en page.

**WEB-ADAPTATION :** utiliser le DOM sémantique (`p`, titres, listes, `strong`, `em`, `code`, liens) plutôt que reconstruire un moteur de spans Canvas. Un lien reste un `a` navigable au clavier. Ne pas convertir automatiquement toute annotation en HTML actif : les destinations et protocoles doivent être validés par le consommateur.

### Styles de caractères et de paragraphes

`TextStyle` combine les dimensions de style de portée et de paragraphe. `SpanStyle` couvre notamment famille/poids/style de police, taille, espacement des lettres, décoration, couleur ou brush et transformations géométriques. `ParagraphStyle` couvre notamment alignement, direction, hauteur de ligne, indentation, césure et stratégie de retour à la ligne.

**ANDROIDX :** les valeurs spécifiées et non spécifiées ont une sémantique distincte ; les styles peuvent être fusionnés et hérités. La direction du texte ne se réduit pas à un alignement gauche/droite.

**WEB-ADAPTATION :** continuer à utiliser les rôles typographiques Material 3 existants et les propriétés CSS adaptées (`font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-align`, `direction`, `unicode-bidi`, `hyphens`). Ne pas traduire mécaniquement les unités Android `sp`/`em` en pixels CSS ni prétendre à une équivalence physique. Laisser le navigateur gérer la césure et le wrapping, avec des tests sur les contenus français, anglais et RTL.

### Mesure, disposition et rendu

`TextMeasurer` transforme texte, styles, placeholders et contraintes en `TextLayoutResult`. La largeur disponible peut modifier les retours à la ligne et entraîner des changements en cascade. Le cache distingue les paramètres qui changent la géométrie de ceux qui ne changent que le dessin ; couleur, brush, ombre et décoration peuvent notamment être modifiés sans recalculer la géométrie dans les cas documentés.

**ANDROIDX :** le résultat de mesure dépend du texte, des styles affectant la mise en page, des contraintes, de la densité, de la direction et de la résolution des polices. Le chargement asynchrone des polices peut nécessiter une nouvelle disposition ; le dessin d'un résultat déjà mesuré ne la déclenche pas automatiquement.

**WEB-ADAPTATION :** préférer la mise en page et le rendu texte natifs du navigateur. Ne pas ajouter un cache de mesure React ou une primitive Canvas générique pour les paragraphes ordinaires. Si un outil a réellement besoin de mesurer du texte (éditeur, aperçu, calcul de largeur), isoler ce besoin et invalider les mesures lorsque police, taille, largeur, langue ou contenu changent.

### Direction, locale et accessibilité

La résolution de la direction et des polices est liée à l'environnement de mise en page. Le texte peut mêler plusieurs scripts et directions.

**WEB-ADAPTATION :** définir `lang` et `dir` au bon niveau, laisser le navigateur appliquer l'algorithme bidirectionnel Unicode, conserver la sélection/copier/coller natifs et ne pas simuler les glyphes dans des images. Vérifier le zoom, le reflow, les contrastes et la taille de texte utilisateur. Les contenus interactifs intégrés doivent conserver un ordre de focus et un nom accessibles.

## Audit ciblé Loculary

Fichiers examinés :

- `src/components/ui/TextField.tsx` : wrapper natif `input`, labels associés par `htmlFor`/`id`, `inputMode`, type et attributs HTML transmis ; deux variantes visuelles Fidelity/Expressive.
- `src/components/ui/TextArea.tsx` : wrapper natif `textarea`, label, états d'erreur/aide et attributs HTML transmis. Le composant documente explicitement qu'il s'agit d'une adaptation Web multiligne et non d'un composant Compose distinct.
- `src/components/ui/OutlinedTextField.tsx` : adaptation React/Web contrôlée d'AndroidX OutlinedTextField, avec label flottant, supporting text, erreur, compteur et contenus auxiliaires.
- `src/components/ui/OutlinedSecureTextField.tsx` : composition sécurisée au-dessus de OutlinedTextField, avec input natif password/text et IconButton de visibilité localisé.
- `src/app/globals.css` : rôles typographiques Material 3 partagés et unités CSS rem documentées comme références Web, pas comme conversion dp/sp.

Les recherches ciblées montrent des usages directs de `TextField`/`TextArea` dans le testeur d'expressions régulières et le laboratoire de conception. Elles ne constituent pas un audit exhaustif de tous les consommateurs ni des parcours de production.

## Décisions de portage

1. **Ne pas créer un composant générique `Text`/moteur de texte React** qui imiterait `AnnotatedString`, `TextMeasurer` ou le pipeline de paragraphes Compose : le DOM/CSS couvre les usages courants de Loculary avec une meilleure intégration navigateur et accessibilité.
2. **Conserver les rôles typographiques partagés** comme contrat visuel ; vérifier leur application réelle et leur rendu plutôt que d'ajouter une couche d'abstraction parallèle.
3. **Conserver les contrôles HTML natifs** pour la saisie, l'IME, la sélection, le collage, le curseur, l'autocomplétion et l'accessibilité OS. Toute transformation de valeur doit être testée avec composition IME, collage, annulation et sélection.
4. **Spécifier localement les besoins enrichis** (aperçu Markdown, code, contenu annoté, placeholders) lorsqu'un parcours réel les exige. Utiliser des éléments HTML sémantiques et des destinations validées ; ne pas introduire un moteur riche préventif.
5. **Auditer les écarts de direction/locale** sur les écrans et contenus réellement utilisés, sans imposer un gestionnaire bidirectionnel global.

## Vérifications et limites

- [x] Baseline release, dump API et sources publiées identifiés et alignés selon la preuve CI #4516.
- [x] Sources Kotlin épinglées examinées pour texte enrichi, styles, paragraphes et mesure.
- [x] Implémentations React/Web TextField, TextArea, OutlinedTextField, OutlinedSecureTextField et rôles CSS typographiques consultés.
- [ ] Audit exhaustif des call sites et parcours de production.
- [ ] Tests clavier, lecteur d'écran, zoom/reflow, FR/EN et RTL dans un navigateur réel.
- [ ] Comparaison visuelle navigateur avec les références produit et vérification des polices chargées.

Aucun test navigateur n'a été exécuté dans cette tranche. Aucune conformité visuelle ou tactile n'est revendiquée.

## Suite proposée

1. Revenir aux composants de texte réellement consommés et établir un audit exhaustif de leurs call sites.
2. Corriger uniquement les défauts reproductibles d'accessibilité, de saisie ou de rendu qui ressortent de cet audit.
3. Passer ensuite à Compose UI ou Material 3 en sélectionnant les contrats qui touchent les composants Loculary existants.

Cette revue clôt une première investigation documentaire ciblée ; elle ne clôt pas le statut global `in-progress` de la famille UI Text.
