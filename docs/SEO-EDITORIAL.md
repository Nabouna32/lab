# Loculary — Politique SEO et éditoriale

## Objectif

Loculary indexe des pages parce qu'elles aident une personne à accomplir une tâche distincte, et non simplement parce qu'une route existe ou qu'une ressource est publiée. La visibilité dans les moteurs de recherche est une décision produit autant que technique.

## Familles de pages

- **Pages d'outils :** principales pages de destination depuis les moteurs de recherche. Chaque locale doit disposer d'un titre et d'une description adaptés à la tâche, d'un outil fonctionnel, d'instructions ou d'exemples exacts et pertinents, ainsi que d'informations transparentes sur le traitement et ses limites lorsque cela s'applique.
- **Pages de catégories :** les catégories admissibles sont incluses automatiquement lorsqu'elles contiennent des outils publiés et des descriptions éditoriales localisées. Une catégorie qui ne contient qu'un seul outil n'est pas automatiquement exclue ; évaluer sa valeur propre pour l'utilisateur et son chevauchement avec les pages d'outils plutôt que d'appliquer un seuil arbitraire.
- **Parcours guidés :** les indexer lorsque leurs étapes forment une tâche cohérente avec un résultat clair ; ne pas générer de parcours quasi identiques pour cibler des variantes de mots-clés.
- **Navigation, recherche, filtres, pages personnelles et pages de compte :** les exclure lorsque leurs URL sont personnalisées, paramétrées, redondantes ou dépourvues d'utilité comme pages de destination indépendantes depuis un moteur de recherche.

## Politique d'indexabilité

- Les métadonnées SEO de chaque outil et de chaque locale déclarent `indexable: true | false`. Le validateur du catalogue rejette les décisions manquantes. Une page localisée non indexable émet `noindex, follow` et est exclue de l'inventaire du sitemap partagé.
- Les descriptions SEO des catégories sont définies dans `src/lib/seo/category-policy.ts`. Pour être automatiquement indexable, une catégorie doit disposer de descriptions françaises et anglaises utiles ; les catégories inconnues sont exclues par défaut tant que leurs métadonnées localisées n'existent pas.
- L'indexabilité d'une catégorie est **activée par défaut** lorsque ses métadonnées éditoriales localisées existent. `excludedCategorySeoReasons` constitue la liste des exceptions : chaque exclusion doit comporter une raison concrète et être réévaluée lorsque le contenu et la couverture des catégories évoluent.
- L'inventaire du sitemap exige également qu'au moins un outil publié appartienne à la catégorie. Les catégories vides n'y figurent pas.
- Une page non indexable peut rester accessible et utile depuis la navigation du produit.
- Ne pas utiliser le nombre de mots ou le nombre d'outils comme seuil universel de qualité. Évaluer plutôt la couverture de la tâche, la précision, l'exactitude, l'utilité, la localisation et les contenus redondants.
- Ne jamais inventer une traduction ni ajouter une URL dans une autre langue si cette version n'est pas réellement disponible.

## Décisions actuelles concernant les catégories

Le catalogue actuel contient sept catégories. Toutes disposent actuellement de descriptions éditoriales localisées et peuvent être indexées, y compris la catégorie `video` (affichée « Vidéo » en français et « Video » en anglais). Le fait qu'elle ne contienne qu'un seul outil ne suffit pas à l'exclure. Le sitemap n'inclut que les catégories contenant des outils publiés.

## Liste de vérification des pages nouvelles ou modifiées

1. Quelle tâche concrète ou quelle question la page permet-elle de résoudre ?
2. Cette intention est-elle distincte de celle des autres pages indexables, en français comme en anglais ?
3. La page apporte-t-elle une information ou une fonctionnalité utile au-delà d'une liste de liens et d'un texte générique ?
4. Les affirmations, formules, exemples, formats pris en charge, limites et déclarations de confidentialité sont-ils exacts ?
5. Le titre, la description, l'URL canonique et les liens vers les autres langues sont-ils corrects ?
6. Des descriptions localisées utiles existent-elles dans chaque langue publiée ?
7. Le sitemap partagé ne contient-il que des URL publiques canoniques, indexables et associées à un contenu publié ?
8. Si une exclusion est nécessaire, sa raison est-elle explicite et réexaminable ?
9. Des tests automatisés couvrent-ils la décision et ses effets ?

## Portée et limites

Cette politique décrit le comportement visé par le produit ; elle ne prouve pas que les moteurs de recherche ont indexé une page ni qu'elle obtient un bon classement. Des données Search Console et un domaine de production définitif seront nécessaires pour évaluer les impressions, les requêtes, l'état d'indexation et les performances réelles dans les résultats de recherche. La revue éditoriale reste un jugement de qualité humain ; les contrôles automatisés peuvent vérifier la localisation et l'admissibilité structurelle, mais ne peuvent pas prouver l'utilité ni l'exactitude du contenu.
