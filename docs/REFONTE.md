# Loculary — stratégie d’évolution produit et de refonte

## Principe de décision

Ce document n’est pas une séquence rigide d’audits visuels. À chaque reprise, comparer la correction de problèmes existants à l’ajout de nouveaux outils, aux fonctionnalités transversales et aux transformations de parcours. La meilleure opportunité utilisateur peut remplacer ou réordonner n’importe quel lot. Éviter les audits qui n’aboutissent pas à une livraison concrète et les PR documentaires redondantes.

## Vision cible

Loculary doit se comporter comme une boîte à outils numérique, pas comme une landing page SaaS ni un catalogue qu’il faut parcourir avant d’agir. La page d’accueil donne immédiatement accès à une action ; la recherche est le principal point d’entrée, les raccourcis servent les tâches fréquentes et l’exploration approfondit la découverte sans détourner l’utilisateur de son objectif.

Le produit reste utilisable sans compte. Les traitements locaux doivent être identifiables et privilégiés lorsque c’est adapté. Le design partagé suit les rôles sémantiques Material 3 Fidelity et les conventions Pixel/Web décrites dans `docs/DESIGN-SYSTEM.md`, tout en laissant aux outils complexes leur propre composition.

## Parcours prioritaires

1. **Je sais ce que je veux faire** : arrivée → recherche → outil → résultat → action suivante utile.
2. **Je connais mon objectif, pas le nom de l’outil** : arrivée → raccourci ou intention → outil pertinent.
3. **Je veux découvrir** : arrivée → catégories / exploration → comparaison → outil.
4. **Je reviens souvent** : accès direct, favoris locaux ou compte facultatif selon le besoin.

Dans tous les parcours, la hiérarchie est : action principale, entrée ou paramètres, résultat, actions contextuelles, puis explications et découverte secondaire.

## Pages et responsabilités

- **Accueil** : recherche et action d’abord ; raccourcis fréquents ; catégories plus bas. Pas de contenu marketing qui repousse l’action.
- **Explorer / catalogue** : exploration par intention et domaine, recherche persistante, états sans résultat qui aident réellement à reformuler.
- **Page d’outil** : titre et explication concise, transparence du traitement, interaction principale, résultat, actions, puis documentation et outils complémentaires pertinents.
- **Compte et collections** : facultatifs, clairement séparés de l’utilisation anonyme ; collections privées par défaut.
- **Pages de compte et d’administration** : interfaces utilitaires, états d’erreur explicites et accès contrôlé.

## Direction visuelle

- Material 3 Fidelity et interfaces Pixel modernes comme références, sans copier une application native entière.
- Surfaces tonales calmes ; couleur forte réservée à la hiérarchie, aux catégories et aux états sémantiques.
- Typographie et espacements compacts autour des tâches ; cibles tactiles généreuses ; composants et icônes cohérents.
- Thèmes clair et sombre équivalents, responsive conçu pour mobile, tablette et bureau, focus clavier visible et réduction des mouvements non essentiels.
- FR et EN doivent conserver une qualité éditoriale équivalente ; aucun texte visible ne doit dépendre d’une langue par défaut accidentelle.

## Chantiers candidats — à réordonner selon la valeur

En plus des chantiers de qualité ci-dessous, explorer régulièrement : nouveaux outils utiles dans les domaines déjà couverts et les domaines absents ; actions contextuelles entre outils (réutiliser, convertir, comparer ou exporter un résultat) ; découverte par intention quand l’utilisateur ignore le nom de l’outil ; amélioration du retour aux tâches récentes sans rendre le compte obligatoire ; simplification des parcours multi-étapes. Ce sont des pistes à évaluer, pas des quotas de fonctionnalités à ajouter.

## Chantiers existants

1. **Accueil orienté action — livré** ([PR #782](https://github.com/Nabouna32/lab/pull/782), commit `a43a329df2b3192cf89be048ea1cf2d4d3194c71`) : le titre est une question d’action, la description indique l’usage sans compte et les quatre raccourcis FR/EN sont affichés sous la recherche. CI complète verte sur le SHA de PR `5cd4eeb8097b1251b88f545d905989f28b7218c0`.
2. **Mesure du rendu et accessibilité** — établir une validation de rendu lisible en texte, incluant débordements, chevauchements, géométrie, contrastes axe-core, arbre d’accessibilité, erreurs console, Lighthouse et descriptions de mise en page pour mobile/bureau et clair/sombre. Respecter les contraintes CI et ne pas confondre état de déploiement avec validation fonctionnelle. Aucun rapport navigateur ne sera déclaré tant qu’il n’aura pas réellement été généré et inspecté.
3. **Recherche et exploration** — auditer le parcours complet, l’état vide, les suggestions, le clavier et la hiérarchie entre intentions et catégories ; corriger les frictions confirmées.
4. **Système partagé** — comparer l’implémentation aux contrats Material 3 Fidelity et d’accessibilité ; corriger les écarts transversaux confirmés (navigation, contrôles, états, focus, thèmes et responsive).
5. **Pages d’outils** — améliorer le shell partagé sans imposer un modèle unique aux calculateurs, outils de fichiers, analyseurs et visualiseurs ; prioriser les défauts de compréhension, de résultat et de confidentialité.
6. **Qualité de bout en bout** — auditer les outils publiés pour justesse métier, états d’erreur, localisation, traitement des données, performances et liens de continuation ; corriger par lots cohérents.

Chaque lot doit s’appuyer sur l’état réel du dépôt et des preuves de validation. Réordonner les lots si un défaut de sécurité, de justesse ou d’accessibilité a un impact supérieur.

## Critères transversaux de livraison

- Contrôles CI pertinents verts sur le SHA final de la PR.
- FR/EN, navigation clavier, noms accessibles et focus visible préservés.
- Comportement responsive et thèmes cohérents par inspection ou par tests effectivement exécutés.
- Pas de compte obligatoire, de transfert de données ou de service payant introduit sans justification et autorisation applicable.
- Le suivi du projet décrit les faits et les limites de validation, pas les résultats espérés.
