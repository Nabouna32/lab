# Catalogue public AndroidX Compose Material 3

## Rôle

Le catalogue répond à « quelles API publiques existent dans le périmètre, dans quelle version et avec quel statut ? ». Les spécifications de composants répondent à « comment cette API fonctionne-t-elle et comment la porter correctement sur le Web ? ». Ce sont deux objets distincts.

Le catalogue doit viser la couverture complète de la surface publique déclarée pour chaque artefact et version. Il ne doit pas filtrer selon les usages actuels de Loculary.

## Modèle d'une entrée

Chaque entrée normalisée devrait contenir :

- `id` : identifiant stable du catalogue, non dérivé d'un nom localisé ;
- `artifact` et `version` ;
- `package`, `owner` (classe/interface englobante, si applicable), `symbol`, `kind` et signature source publiée ;
- `apiStatus` : `stable`, `experimental`, `deprecated`, `removed`, `unknown` ;
- `sourceFiles`, `apiDump`, `apiReference` ;
- `firstSeenVersion` et `lastSeenVersion`, quand connus ;
- `componentSpec` : chemin de la spécification détaillée si applicable ;
- `portStatus` : `not-started`, `researching`, `specified`, `implementing`, `verified`, `migrating`, `migrated` ;
- `notes` et limites de la normalisation.

Ne pas inférer la stabilité à partir du nom du symbole. Les annotations de stabilité expérimentale et de dépréciation doivent être collectées depuis les signatures, les sources Kotlin et les références officielles.

## Génération et vérification

- Le fichier API publié est une entrée d'inventaire et de diff, pas une spécification sémantique complète.
- Les signatures brutes doivent être conservées comme preuve ; la normalisation ne doit pas supprimer silencieusement des symboles inconnus.
- L'identité d'une déclaration membre doit inclure son package, son propriétaire et sa signature : deux membres homonymes de classes distinctes ne doivent pas entrer en collision.
- Le parseur d'inventaire prend en charge les formats de signatures AndroidX 2.0, 3.0 et 4.0. Il conserve les signatures brutes et classe explicitement les entrées `@BytecodeOnly` comme bytecode-only et `@InaccessibleFromKotlin` comme inaccessibles depuis Kotlin, au lieu de les confondre avec des API Kotlin à porter. Les entrées inconnues restent visibles et exigent une revue.
- Les générateurs doivent être déterministes, utiliser les dépendances intégrées à Node lorsque possible et échouer clairement sur une entrée absente ou mal formée.
- Les snapshots amont utilisés pour une référence doivent être identifiés par commit immuable et empreinte cryptographique.
- Une mise à jour produit d'abord un rapport de diff. Elle ne modifie pas automatiquement la référence de portage et ne pousse pas de changement silencieux.
- Toute différence non classifiée reste visible et nécessite une revue humaine.

## États de couverture

La présence dans le catalogue ne signifie pas qu'une API a été étudiée ou portée. Garder séparés :

1. présence dans l'API publique ;
2. source sémantique examinée ;
3. spécification rédigée ;
4. portage React réalisé ;
5. portage vérifié ;
6. migration des usages Loculary terminée.

## Familles et frontières

Le catalogue principal correspond à l'artefact `androidx.compose.material3:material3`. Les artefacts apparentés (Adaptive, Wear, etc.) doivent avoir leurs propres métadonnées et inventaires, afin de maintenir une couverture large sans confondre des contrats distincts.

## Statut initial

Le catalogue exhaustif n'est pas encore généré ni vérifié. La référence de portage reste à verrouiller après confirmation de l'association exacte entre version stable, commit AndroidX et API dump. Ne pas annoncer une couverture complète avant qu'un contrôle reproductible puisse l'établir.
