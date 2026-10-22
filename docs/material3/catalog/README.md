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
- Le propriétaire doit être déterminé à partir du nom complet de la classe dans la signature et de la structure des blocs (accolades), jamais par l'indentation. AndroidX peut aplatir les classes imbriquées dans des noms comme `Outer.Inner` ; les conserver intégralement évite les collisions entre membres de classes différentes.
- Le parseur d'inventaire prend en charge les formats de signatures AndroidX 2.0, 3.0, 4.0 et 5.0. Le format 5.0 ajoute des métadonnées de surface (par exemple `surface=public`) ; l'inventaire exige la surface publique et rejette les dumps restreints. Les directives de commentaire sont conservées dans le dump source et ne sont pas traitées comme des déclarations. Il conserve les signatures brutes et classe explicitement les entrées `@BytecodeOnly` comme bytecode-only et `@InaccessibleFromKotlin` comme inaccessibles depuis Kotlin, au lieu de les confondre avec des API Kotlin à porter. Les entrées inconnues restent visibles et exigent une revue.
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

## Statut

- **Veille amont** : un snapshot exhaustif de `current.txt` est généré dans [`watch/androidx-main-2026-10-22/`](watch/androidx-main-2026-10-22/README.md). Il contient 4 709 déclarations réparties sur trois packages, épinglées à un commit et avec les empreintes SHA-256 de la source et des shards. Il s'agit d'un inventaire de surface, pas d'une spécification sémantique ni d'une baseline de portage.
- **Baseline stable 1.4.0** : l'inventaire exact n'est pas encore généré ni vérifié. Le dépôt AndroidX au commit inspecté n'inclut pas de fichier `1.4.0.txt` ; la correspondance avec l'archive source publiée reste `UNVERIFIED`. Ne pas utiliser `current.txt` comme substitut à la version stable.
- **Couverture globale** : ne pas annoncer le catalogue complet tant que la baseline de portage et les artefacts apparentés à inventorier séparément n'ont pas été traités.
