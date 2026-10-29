# Cartographie de migration Material 3 en production

**État au 29 octobre 2026 — inventaire initial, non exhaustif.** Base observée : `main` au commit `31b427a91630761c2443d58618d6c634e6fae6c0`. Les nombres de fichiers décrivent le dépôt, pas le nombre de composants conformes.

## Périmètre observé

- 35 fichiers de routes/layouts sous `src/app/[locale]`, couvrant l’accueil, les pages de catégories et d’outils, la recherche, les collections partagées, les favoris, le compte, les pages éditoriales/légales, l’administration et le Design Lab.
- 254 fichiers TSX sous `src/` et 47 fichiers CSS sous `src/`.
- 105 fichiers de composants UI sous `src/components/ui/`, dont de nombreux composants avec feuille CSS dédiée.
- Les fondations globales exposent les rôles de couleur, les 15 rôles typographiques, une échelle de formes, des tokens d’espacement et des tokens de mouvement. Des alias historiques et des valeurs locales coexistent encore.

Ces volumes justifient une migration par contrats et familles, pas une réécriture aveugle de tous les fichiers. Chaque famille doit être inventoriée au niveau de ses usages avant de déclarer sa migration terminée.

## Cartographie par couche

| Couche | État constaté | Travail prioritaire |
|---|---|---|
| Couleurs et thèmes | Rôles sémantiques et thèmes clair/sombre présents ; alias de compatibilité et couleurs locales encore présents | Recenser les usages des alias et couleurs codées en dur ; migrer vers les rôles sémantiques ; supprimer les alias seulement après zéro référence vérifiée |
| Typographie | 15 rôles partagés exposés ; migration des consommateurs partielle | Repérer tailles, graisses, interlignes et espacements locaux ; remplacer par le rôle AndroidX pertinent, sans convertir tous les textes au même style |
| Formes et élévations | Échelle `--shape-corner-*` et tokens de composants présents ; `--radius-*` coexiste encore | Inventorier les consommateurs ; vérifier les contrats AndroidX propres aux composants avant tout remappage ou retrait |
| Espacement et layout | Primitives Compose UI/Foundation portées partiellement ; conventions de composition Loculary existantes | Faire passer les layouts répétitifs par les primitives et tokens communs ; garder les conventions de page dans des compositions produit identifiées |
| Boutons et liens | `Button` et `AppLink` partagent les variantes et désormais un contrat de layout commun ; la validation navigateur reste ouverte | Migrer les actions locales restantes, puis vérifier le ripple, les états et les variantes en navigateur |
| Actions par icône et contrôles | `IconButton`, toggles, champs, menus, sélecteurs, sliders et composants composés ont des implémentations dédiées | Auditer chaque famille contre sa spécification AndroidX ; ne pas les forcer dans le contrat de bouton standard |
| Navigation et surfaces | App bars, navigation, cartes, panneaux, feuilles, dialogues et snackbars existent comme composants partagés | Vérifier leurs sources, leurs états et leurs usages réels ; migrer les styles locaux et remplacer les ports non conformes |
| Pages et outils | Plusieurs pages consomment déjà des composants/tokens partagés ; l’inventaire de chaque consommateur reste incomplet | Migrer par parcours cohérent, en commençant par les cadres partagés et les motifs les plus répétés ; vérifier FR/EN et les deux thèmes |

## Ordre de migration

1. **Fondations :** inventorier et clarifier les tokens, leurs sources et leurs alias ; ne retirer aucune valeur avant de connaître ses consommateurs.
2. **Contrats communs :** terminer les ports et tests des primitives et composants partagés, puis centraliser les règles réellement communes.
3. **Cadres de l’application :** en-tête, navigation, pied de page, conteneurs de page, typographie et surfaces récurrentes.
4. **Parcours transversaux :** accueil/recherche, pages de catégories et outils, favoris/collections, compte, pages éditoriales, administration et Design Lab.
5. **Contrôles spécifiques aux outils :** migrer selon le contrat AndroidX correspondant ; documenter les écarts nécessaires au Web.
6. **Retrait de l’héritage :** supprimer les anciens alias, classes et composants seulement après inventaire de leurs références et migration vérifiée des consommateurs.

## Challenge global « page blanche »

Ce challenge est une méthode d'architecture et de produit applicable à **tout Loculary**, pas une simple revue de page. Pour chaque décision importante, partir du besoin et des contraintes réelles, puis poser la question :

> Si nous construisions aujourd'hui la meilleure version de Loculary depuis zéro, sans hériter du code, des composants, des dépendances ni des décisions actuelles, que choisirions-nous et pourquoi ?

Appliquer ce filtre à l'ensemble du système :

- **Produit et UX :** promesse, intentions, recherche et découverte, navigation, parcours, hiérarchie, contenu, états vides/erreurs/chargement, interactions et prochaines actions.
- **Fondations visuelles :** couleurs et schémas, typographie, formes, élévations, espacements, mouvement, icônes, thèmes et règles responsive.
- **Composants et compositions :** primitives, API, responsabilités, variantes, états, accessibilité, contrats AndroidX, composants redondants ou artificiels et limites entre partage et personnalisation.
- **Architecture et code :** domaines, frontières, flux de données, état local/synchronisé, rendu serveur/client, contrats, abstractions, duplication, complexité, dette et possibilité de supprimer plutôt que d'ajouter.
- **Données, confidentialité et sécurité :** collecte minimale, traitement local, comptes facultatifs, permissions, transferts, stockage, partage, rétention, suppression, menaces et comportements en cas d'échec.
- **Plateforme et livraison :** dépendances, versions, performances, robustesse, observabilité, tests, CI, déploiement, coûts et maintenance.
- **Qualité transversale :** accessibilité WCAG 2.2 AA, clavier et technologies d'assistance, français/anglais, responsive, thèmes clair/sombre, réduction des animations et prise en charge des navigateurs.

Pour chaque problème significatif, consigner brièvement :

1. **Besoin et preuves :** problème utilisateur/technique observé, sources fiables et incertitudes.
2. **Cible depuis zéro :** solution que nous choisirions sans l'existant.
3. **Comparaison honnête :** conserver, adapter, remplacer, supprimer ou reconstruire ; coût, risque, qualité, complexité et effets à long terme.
4. **Recommandation :** choix motivé par le meilleur résultat, pas par la taille du diff ou l'attachement à l'architecture en place.
5. **Trajectoire :** étapes de migration, compatibilité temporaire éventuelle, critères de suppression de l'héritage et vérifications nécessaires.

Le challenge est obligatoire pour les fondations, les contrats partagés, les outils, les compositions, les pages et les systèmes transversaux. Son niveau de détail dépend du risque : il ne faut pas créer une fiche lourde pour chaque petit changement. Il doit néanmoins être explicite lorsqu'une décision structurelle ou un parcours important est en jeu.

**Repartir de zéro ne signifie pas réécrire par principe.** La cible idéale sert de référence pour décider ; une migration incrémentale peut rester la meilleure façon d'y arriver. Inversement, la compatibilité et le code existant ne sont pas des arguments suffisants pour conserver une solution inférieure. Ne pas confondre coût de migration avec qualité de la cible.

## Règles de décision

- AndroidX définit les contrats qu'il expose ; les sources officielles épinglées font foi. Les adaptations Web, les décisions produit Loculary et les éléments non vérifiés doivent rester identifiés séparément.
- Les valeurs relevant d'AndroidX proviennent du contrat de la source épinglée et de ses tokens. Elles ne sont pas redéfinies arbitrairement dans chaque page.
- Les paramètres propres à un composant restent locaux lorsqu'ils correspondent à une personnalisation prévue par son API. Une différence produit ou Web doit être nommée, justifiée et testée.
- Ne pas créer un token pour chaque nombre : centraliser les décisions récurrentes qui doivent évoluer ensemble.
- La migration d'un consommateur ne consiste pas à remplacer quelques classes. Évaluer son comportement, sa hiérarchie, ses états, son accessibilité et ses dépendances au contrat partagé.
- Supprimer les anciens alias, classes, composants et dépendances après inventaire des références et vérification des remplacements.
- La validation statique et la CI ne prouvent pas la fidélité visuelle. La validation navigateur doit préciser le thème, la langue, les largeurs et les états vérifiés.

## Première migration de pages — favoris et collection partagée

**Challenge page blanche**

- **Migration ciblée :** conserver les états fonctionnels déjà présents (favoris locaux/synchronisés, erreurs de synchronisation, chargement et lien de partage invalide), mais remplacer les styles locaux de cartes, titres et textes par les contrats partagés vérifiés.
- **Reconstruction depuis une page blanche :** elle permettrait de reconsidérer la composition, mais réécrirait sans nécessité les états de confidentialité et de disponibilité, sans preuve qu'une nouvelle structure améliore le parcours.
- **Décision :** migration ciblée pour cette tranche. Ce choix ne sanctuarise pas la structure existante : une refonte restera justifiée si l'audit du parcours révèle une incohérence UX ou un écart AndroidX substantiel.

Les en-têtes conservent leur repère HTML `header`, les listes restent des listes et les destinations restent des liens natifs. Les surfaces utilisent désormais le port partagé `Card` et les textes les rôles typographiques Material 3. Les anciennes grandes formes, bordures décoratives et ombres propres aux cartes ont été retirées au profit du contrat de carte remplie. La validation navigateur des thèmes, langues, largeurs et états reste à effectuer ; cette migration ne vaut pas preuve de parité pixel.

La page interactive de gestion des collections (`CollectionsView`) reste à auditer séparément avant sa migration, car elle comporte des formulaires, des imports/exports, des dialogues et des états de synchronisation supplémentaires.

## Gestion des collections

**Challenge page blanche**

- **Migration ciblée :** conserver les opérations existantes et leur protection des données — collections locales ou synchronisées, limite locale, export/import JSON, partage volontaire et confirmation de suppression — tout en migrant les surfaces et la typographie vers les contrats communs.
- **Reconstruction depuis une page blanche :** elle offrirait l'occasion de revoir la disposition maître/détail, le formulaire de renommage actuellement confié à `window.prompt`, les états d'import et les interactions clavier. Ce serait une amélioration UX potentielle, mais elle ne doit pas entraîner la réécriture implicite de la logique de confidentialité ou du format de sauvegarde.
- **Décision :** migration ciblée du rendu dans cette tranche, car la structure maître/détail reste adaptée à un écran large et se replie en une seule colonne sur petit écran. Le renommage via `window.prompt` reste un écart UX identifié à traiter lors d'une tranche dédiée aux dialogues et formulaires AndroidX ; il n'est pas considéré comme conforme.

Le formulaire de création, les contrôles natifs, les boutons, les statuts et le dialogue de suppression conservent leur sémantique et leurs responsabilités. Les panneaux utilisent désormais le port partagé `Card`, les rôles typographiques Material 3 et l'échelle de formes commune. Les choix de collection restent des boutons natifs avec un état sélectionné explicite ; ils ne sont pas artificiellement convertis en cartes interactives.

## Prochaine tranche

La première correction structurelle de cette migration centralise le layout partagé des boutons et des liens qui adoptent leur apparence. Les prochaines tranches doivent s’appuyer sur cette cartographie pour migrer les fondations et les composants communs, puis les consommateurs, sans ajouter une seconde couche qui cohabiterait indéfiniment avec l’ancien système.
