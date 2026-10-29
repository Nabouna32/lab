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

## Règles de décision

- Les valeurs relevant d’AndroidX proviennent du contrat de la source épinglée et de ses tokens. Elles ne sont pas redéfinies arbitrairement dans chaque page.
- Les paramètres propres à un composant restent locaux lorsqu’ils correspondent à une personnalisation prévue par son API. Une différence produit ou Web doit être nommée, justifiée et testée.
- Ne pas créer un token pour chaque nombre : centraliser les décisions récurrentes qui doivent évoluer ensemble.
- Une page n’est pas migrée parce qu’elle utilise quelques composants Material 3. Le parcours complet, la hiérarchie, les surfaces, les espacements, les états et l’accessibilité doivent être évalués.
- **Challenge page blanche obligatoire pour chaque page :** comparer une migration ciblée à une reconstruction depuis une page blanche ; expliquer les conséquences et recommander l’option la plus cohérente avec Material 3 Fidelity. Le code historique ne constitue pas une exigence de conservation.
- La validation statique et la CI ne prouvent pas la fidélité visuelle. La validation navigateur doit préciser le thème, la langue, les largeurs et les états vérifiés.

## Prochaine tranche

La première correction structurelle de cette migration centralise le layout partagé des boutons et des liens qui adoptent leur apparence. Les prochaines tranches doivent s’appuyer sur cette cartographie pour migrer les fondations et les composants communs, puis les consommateurs, sans ajouter une seconde couche qui cohabiterait indéfiniment avec l’ancien système.
