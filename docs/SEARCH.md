# Loculary — Recherche

La recherche facilite la navigation dans le catalogue et la découverte d'outils à partir de l'intention de l'utilisateur.

## Champ de recherche et suggestions

- Lorsque la requête n'est pas vide, le champ expose une action claire pour l'effacer. Utiliser un bouton d'icône cohérent et doté d'un nom accessible ; éviter d'afficher simultanément le contrôle natif du navigateur et un contrôle personnalisé.
- Sur mobile, le panneau de recherche de l'en-tête se ferme lors d'un clic à l'extérieur, avec Escape (après fermeture de la fenêtre de suggestions ou de statut) ou lors d'une navigation. Une icône de fermeture séparée n'est pas nécessaire si elle duplique ces mécanismes. La fermeture par clic extérieur ne doit pas déplacer le focus hors du contrôle sur lequel l'utilisateur vient de cliquer.
- Escape ferme la surface de suggestions sans prétendre que le champ a perdu son focus DOM. Tant que le champ reste focalisé, la saisie, un clic dans le champ ou ArrowDown peuvent rouvrir les suggestions ; la combobox ne doit pas rester bloquée dans un état masqué jusqu'à un cycle de perte puis de reprise du focus.
- Les suggestions apparaissent dans une surface en élévation, ancrée au champ, au-dessus du contenu voisin et en dehors des contextes de découpage ou d'empilement qui pourraient la masquer. Recalculer sa position dans la fenêtre lors du défilement ou du redimensionnement ; la maintenir dans la zone visible et tenir compte des changements liés au clavier mobile lorsque cela est pris en charge.
- Suivre le modèle Material 3 SearchBar pour établir une relation claire entre le champ et les suggestions, tout en l'adaptant aux sémantiques du Web. Une combobox contrôle une véritable listbox contenant les suggestions sélectionnables ; le chargement, les erreurs et l'absence de résultat sont des contenus de statut distincts, et non de fausses options de listbox. Synchroniser `aria-expanded`, `aria-controls`, l'élément actif, la navigation au clavier et le comportement Escape avec l'état réellement visible.
- Les lignes de suggestion utilisent les tokens partagés de surface, élévation, forme et focus. Elles présentent un titre principal clair, une catégorie ou description secondaire et un état actif distinct dans les deux thèmes. Le classement et le comportement de sélection restent cohérents en français et en anglais.

## Navigation dans les résultats du catalogue

- La recherche compare les noms et descriptions localisés des outils, les alias, tags et catégories selon le classement déterministe existant du catalogue.
- La sélection d'une suggestion ouvre directement l'outil correspondant.
- La soumission d'une requête correspondant à un seul résultat actuel ouvre directement cet outil. Si plusieurs résultats sont possibles, ou si aucun résultat n'est trouvé, la soumission ouvre la page de résultats localisée : `/fr/recherche#q=...` ou `/en/search#q=...`.
- La page de résultats présente tous les outils publiés correspondant à la recherche, et non uniquement le petit sous-ensemble de suggestions. Une page sans résultat explique la situation et propose des exemples de requêtes localisés. La requête est conservée dans le fragment de l'URL afin que l'état des résultats puisse être revisité sans transmettre le terme de recherche dans la requête HTTP.
- Sur la page complète de résultats, une seule ligne persistante de statut poli annonce le chargement, les erreurs de recherche et le nombre final de résultats ; le panneau de chargement visuel ne doit pas répéter cette annonce.
- La flèche ronde à droite du champ et la touche Entrée soumettent la même requête. Si une suggestion est explicitement active, Entrée ouvre l'outil sélectionné.
- Les URL de résultats de recherche sont des états temporaires de découverte, et non des pages de destination SEO autonomes ; elles ne doivent pas être indexées. La route statique du catalogue complet reste distincte des résultats de requête.

## Classement tenant compte des intentions

- Le classement peut déduire une tâche uniquement à partir d'un vocabulaire français/anglais limité et explicite (par exemple `préparer`, `prepare`, `comparer`, `compare`, `convertir` ou `generate`).
- Une tâche déduite ne favorise que les outils déjà associés à cette intention éditoriale dans `src/lib/tools/intents.ts`. Elle ne crée pas d'association et ne remplace pas la correspondance textuelle ; les noms, alias et tags explicites continuent de contribuer au classement.
- Une requête composée uniquement d'une tâche peut retourner les outils sélectionnés même lorsque le verbe est retiré de la recherche textuelle ordinaire en tant que mot vide. Le vocabulaire ambigu doit être traité avec prudence, de façon déterministe et avec des tests.
- Il s'agit d'une découverte tenant compte des intentions, et non d'une exécution en langage naturel : Loculary ne calcule pas une réponse à partir d'un texte arbitraire et n'envoie pas la requête à un fournisseur d'IA.

Les couches de correspondance comprennent le texte exact ou par préfixe, les descriptions, alias, synonymes, tags et catégories, la tolérance aux fautes, les requêtes associées et les intentions exprimées en langage naturel.

Des exemples tels que « calculer 17 % de 283 » doivent mener à l'outil pertinent. En l'absence de résultat, proposer des requêtes proches et des outils pertinents.

Les tags sont gérés de manière centralisée avec leurs alias afin d'éviter les doublons de vocabulaire. Un outil peut appartenir à plusieurs catégories.
