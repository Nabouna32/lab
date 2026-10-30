# Loculary — Contrat qualité des outils

Le contrat qualité des outils définit le socle minimal de métadonnées pouvant être vérifié automatiquement pour une entrée du catalogue. Il complète les spécifications générales du produit, de l'expérience utilisateur, de l'accessibilité, des performances, du SEO et de la confidentialité.

## Vérifications automatisées des métadonnées

Chaque outil doit disposer des éléments suivants :

- un `id` unique et un `slug` au format kebab-case compatible avec les URL ;
- au moins une catégorie, la première servant de catégorie principale pour la route ;
- un nom et une description en français ;
- un titre et une description SEO pour chaque locale activée ;
- une version entière strictement positive ;
- des tags et alias uniques et non vides ;
- des métadonnées explicites sur le traitement ;
- des capacités cohérentes avec le mode de traitement ;
- des déclarations exactes concernant le fonctionnement hors ligne et le partage ;
- des références valides vers les outils associés ;
- un état de cycle de vie explicite ;
- l'accessibilité déclarée comme exigence.

Les outils publiés doivent également être disponibles et disposer de tests.

## Cohérence du traitement

Le validateur applique les invariants minimaux suivants :

- un traitement `local` ne peut pas déclarer de fournisseurs externes et nécessite la capacité `local-processing` ;
- les traitements `external`, `server` et `hybrid` nécessitent un accès réseau et un fournisseur externe ;
- un traitement `hybrid` nécessite également une capacité de traitement local ;
- les outils hors ligne doivent utiliser un traitement local et ne doivent pas nécessiter d'accès réseau ;
- les outils locaux ne peuvent déclarer aucun stockage ou uniquement un stockage local.

## Périmètre

Ce contrat vérifie volontairement les métadonnées et les invariants entre champs qui peuvent être contrôlés sans coupler le catalogue à une implémentation de page particulière.

La qualité à l'exécution et celle des pages sont couvertes par les sources de référence suivantes :

- expérience utilisateur, accessibilité, comportement responsive et interactions : `docs/UX.md` ;
- SEO et exigences éditoriales : `docs/SEO-EDITORIAL.md` ;
- confidentialité et traitement : `docs/PRIVACY.md` ;
- modèle des outils et contrat d'exécution : `docs/TOOL_ARCHITECTURE.md` ;
- performances et vérifications des pages rendues : la section ci-dessous consacrée à la qualité à l'exécution et au niveau des pages.

Ne pas créer de spécifications distinctes pour ces sujets uniquement afin de satisfaire cet index. Ajouter un nouveau document uniquement lorsqu'un contrat distinct et maintenu est réellement nécessaire.

Le contrat doit évoluer lorsqu'une exigence devient suffisamment stable pour être vérifiée automatiquement. Il ne doit pas devenir un moteur de rendu au plus petit dénominateur commun ni affaiblir les exigences générales du produit.

## Qualité à l'exécution et au niveau des pages

- **Accessibilité :** fonctionnement au clavier, focus logique et visible, structure sémantique, noms et états accessibles, erreurs compréhensibles, annonces de statut utiles, contraste suffisant, informations qui ne reposent pas uniquement sur la couleur, zones tactiles adaptées et réorganisation responsive. Respecter `prefers-reduced-motion`.
- **Performances :** charger les outils à la demande ; préserver la réactivité des petits outils déterministes ; utiliser Workers, WebAssembly, le traitement par blocs ou le streaming lorsque cela est justifié. Mesurer avant de supprimer des capacités et fournir, lorsque cela est possible, une progression et une annulation honnêtes pour les opérations longues.
- **SEO :** les pages publiques des outils doivent disposer de titres et descriptions localisés utiles, d'URL canoniques, de titres de sections structurés et de données structurées appropriées. Les outils doivent rester immédiatement utilisables ; éviter les contenus superficiels produits en masse.
- Ces exigences s'appliquent à l'expérience réellement rendue. La validation des métadonnées et les tests statiques ne remplacent pas les vérifications dans le navigateur et les contrôles d'accessibilité.
