# Inventaire des API AndroidX Compose UI

## Rôle

Le catalogue répond à « quelles API publiques existent dans le périmètre, dans quelle version et avec quel statut ? ». Les spécifications de composants répondent à « comment cette API fonctionne-t-elle et comment la porter correctement sur le Web ? ». Ce sont deux objets distincts.

Le catalogue doit viser la couverture complète de la surface publique déclarée pour chaque artefact et version. Il ne doit pas filtrer selon les usages actuels de Loculary.

## Registre des familles

Le périmètre multi-familles est maintenu dans [families.json](families.json). Il s'agit volontairement d'un **registre de candidats, pas d'une déclaration d'exhaustivité**. Chaque famille possède une frontière de plateforme, un artefact distinct, des liens de provenance et un statut d'inventaire indépendant. Le registre distingue désormais des artefacts Compose de premier plan et certains modules publiés séparément, notamment UI Graphics, UI Text, UI Units, Foundation Layout, Animation Core et Runtime Saveable. Cette séparation est nécessaire : la documentation officielle de Compose présente UI, Foundation, Animation, Runtime, Material et Material 3 comme des groupes fonctionnels distincts, tandis que les API des sous-modules peuvent avoir leurs propres frontières de publication.

Les familles historiques déclarent également leurs successeurs possibles via successorFamilyIds et successorMappingStatus. Ces liens expriment des **cibles de migration candidates**, pas une équivalence d'API ni une migration automatique. Une bibliothèque Views comme Material Components pour Android est en maintenance ; ses usages doivent être cartographiés vers Compose au cas par cas, tandis qu'AppCompat n'a pas de successeur unique.

Le contrat du registre est vérifié par .github/scripts/android-ui-family-catalog.mjs et ses tests. Pour lancer le contrôle :

```sh
node .github/scripts/android-ui-family-catalog.mjs
node --test .github/scripts/android-ui-family-catalog.test.mjs
```

Les versions de référence non choisies restent explicitement null avec referenceVersionStatus: "not-selected". Ne pas remplacer cet état par une version supposée « la plus récente ». Le registre doit être complété après vérification des frontières d'artefacts, des versions publiées et des sources officielles. Les familles spécialisées (Wear OS, TV, Adaptive) ne doivent pas être fusionnées dans le catalogue mobile simplement parce que des noms d'API se ressemblent.

## Modèle d'une entrée d'API

Chaque entrée normalisée devrait contenir :

- id : identifiant stable du catalogue, non dérivé d'un nom localisé ;
- artifact et version ;
- package, owner (classe/interface englobante, si applicable), symbol, kind et signature source publiée ;
- apiStatus : stable, experimental, deprecated, removed, unknown ;
- sourceFiles, apiDump, apiReference ;
- firstSeenVersion et lastSeenVersion, quand connus ;
- componentSpec : chemin de la spécification détaillée si applicable ;
- portStatus : not-started, researching, specified, implementing, verified, migrating, migrated ;
- notes et limites de la normalisation.

Ne pas inférer la stabilité à partir du nom du symbole. Les annotations de stabilité expérimentale et de dépréciation doivent être collectées depuis les signatures, les sources Kotlin et les références officielles.

## Génération et vérification

- Le fichier API publié est une entrée d'inventaire et de diff, pas une spécification sémantique complète.
- Les signatures brutes doivent être conservées comme preuve ; la normalisation ne doit pas supprimer silencieusement des symboles inconnus.
- L'identité d'une déclaration membre doit inclure son package, son propriétaire et sa signature : deux membres homonymes de classes distinctes ne doivent pas entrer en collision.
- Le propriétaire doit être déterminé à partir du nom complet de la classe dans la signature et de la structure des blocs (accolades), jamais par l'indentation. AndroidX peut aplatir les classes imbriquées dans des noms comme Outer.Inner ; les conserver intégralement évite les collisions entre membres de classes différentes.
- Le parseur d'inventaire prend en charge les formats de signatures AndroidX 2.0, 3.0, 4.0 et 5.0. Le format 5.0 ajoute des métadonnées de surface (par exemple surface=public) ; l'inventaire exige la surface publique et rejette les dumps restreints. Les directives de commentaire sont conservées dans le dump source et ne sont pas traitées comme des déclarations. Il conserve les signatures brutes et classe explicitement les entrées @BytecodeOnly comme bytecode-only et @InaccessibleFromKotlin comme inaccessibles depuis Kotlin, au lieu de les confondre avec des API Kotlin à porter. Les entrées inconnues restent visibles et exigent une revue.
- Les générateurs doivent être déterministes, utiliser les dépendances intégrées à Node lorsque possible et échouer clairement sur une entrée absente ou mal formée.
- Les snapshots amont utilisés pour une référence doivent être identifiés par commit immuable et empreinte cryptographique.
- Une mise à jour produit d'abord un rapport de diff. Elle ne modifie pas automatiquement la référence de portage et ne pousse pas de changement silencieux.
- Toute différence non classifiée reste visible et nécessite une revue humaine.

### Vérification des archives sources

Le script `.github/scripts/verify-androidx-source-archive.mjs` télécharge l'archive et son fichier de somme de contrôle depuis les hôtes AndroidX approuvés, puis recalcule le SHA-256 et l'identifiant Git blob SHA-1. Il échoue si l'une de ces preuves diverge et ne modifie jamais automatiquement le manifeste.

```sh
node .github/scripts/verify-androidx-source-archive.mjs docs/material3/catalog/baselines/material3-1.4.0.json
node --test .github/scripts/verify-androidx-source-archive.test.mjs
```

La vérification nécessite un accès réseau aux URL consignées dans le manifeste. Un résultat réussi prouve l'intégrité des octets téléchargés par rapport aux empreintes déclarées ; il ne prouve pas à lui seul que le dump d'API correspond à cette archive ni que le code source est sémantiquement équivalent à une version publiée. Les statuts de provenance doivent rester distincts.

## États de couverture

La présence dans le catalogue ne signifie pas qu'une API a été étudiée ou portée. Garder séparés :

1. présence dans l'API publique ;
2. source sémantique examinée ;
3. spécification rédigée ;
4. portage React réalisé ;
5. portage vérifié ;
6. migration des usages Loculary terminée.

## Versions stables retenues au 29 octobre 2026

Les versions officielles choisies et l’alignement de leur surface API sont deux statuts distincts. Pour Material 3 1.4.0, le registre de provenance [versionné](baselines/material3-1.4.0.json) identifie l’archive source stable, le snapshot de veille et les preuves encore manquantes ; il conserve volontairement l’alignement API à `UNVERIFIED`.

L’inspection reproductible des répertoires API au commit AndroidX épinglé est consignée dans [repository-api-inspection-5901d750.json](baselines/repository-api-inspection-5901d750.json). Elle couvre maintenant **21 des 22 familles sélectionnées**. La famille Material Components for Android Views est exclue de ce fichier, car son dépôt de sources est distinct (`material-components/material-components-android`). Pour les 21 familles inspectées, aucun dump portant exactement la version stable sélectionnée n’existe dans le répertoire API examiné à ce commit ; les derniers dumps versionnés observés sont des versions bêta ou candidates à la release. Cela ne prouve pas qu’aucun dump distinct n’existe dans une archive publiée. La provenance des archives sources et leur alignement avec les dumps restent à vérifier artefact par artefact.

Les versions de référence doivent être choisies par artefact/groupe, pas supposées identiques pour toute la stack Compose. Le champ artifactCoordinateStatus distingue les coordonnées confirmées dans la documentation de publication officielle des coordonnées encore candidates ; un nom plausible ou un dossier AndroidX ne suffit pas à prouver qu'un artefact est publié sous cette coordonnée. Les pages officielles indiquent actuellement :

- Compose UI, Foundation, Animation, Runtime et Material 2 : **1.12.1** ([versions Compose](https://developer.android.com/jetpack/androidx/versions)).
- Compose Material 3 : **1.4.0** ([notes de version Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material3)).
- Compose Material 3 Adaptive : **1.3.0** ([versions AndroidX](https://developer.android.com/jetpack/androidx/versions)).
- Navigation (dont Navigation Compose et Navigation Fragment) : **2.10.2** ([notes de version Navigation](https://developer.android.com/jetpack/androidx/releases/navigation)).

Le registre versionné sélectionne maintenant une version stable publiée pour chacune des 22 familles. Les nouvelles sélections couvrent Wear Compose Material 3 (1.5.0), TV Material (1.1.0), Material Components Views (1.14.0), AppCompat (1.8.0) et les sous-modules UI, Foundation Layout, Animation Core et Runtime Saveable (1.12.1), selon leurs pages de publication officielles. Cette sélection établit le périmètre de version, pas l'alignement entre le dump API et les sources de chaque artefact : cet alignement reste à vérifier séparément. Le registre utilise le groupe Maven `androidx.compose.material3.adaptive:adaptive` pour l'artefact Adaptive.

Une BOM Compose peut aligner des versions compatibles, mais n'ajoute pas toutes les bibliothèques au projet et ne remplace pas l'identification des artefacts à inventorier. Chaque baseline doit garder la provenance officielle, la version et le snapshot source/API correspondant.

## Statut du catalogue Material 3

- **Veille amont** : un snapshot exhaustif de current.txt est généré dans [watch/androidx-main-2026-10-22/](watch/androidx-main-2026-10-22/README.md). Il contient 4 709 déclarations réparties sur trois packages, épinglées à un commit et avec les empreintes SHA-256 de la source et des shards. Il s'agit d'un inventaire de surface, pas d'une spécification sémantique ni d'une baseline de portage.
- **Baseline stable 1.4.0** : l'inventaire exact n'est pas encore généré ni vérifié. Le dépôt AndroidX au commit inspecté n'inclut pas de fichier 1.4.0.txt ; la correspondance avec l'archive source publiée reste UNVERIFIED. Ne pas utiliser current.txt comme substitut à la version stable.
- **Couverture globale** : ne pas annoncer le catalogue complet tant que la baseline de portage et les artefacts apparentés à inventorier séparément n'ont pas été traités.


### Material Components for Android Views — référence historique

La famille Views est suivie séparément de Compose Material 3 dans [son manifeste de provenance](baselines/material-components-views-1.14.0.json). La release stable 1.14.0 est épinglée au commit source officiel. Le dépôt ne fournit pas de dump API classique à ce tag, et le projet amont annonce le mode maintenance sans nouvelles fonctionnalités prévues. Cette famille sert donc à cartographier les API historiques et les migrations, pas à élargir la cible de nouveaux ports Material 3. La provenance des octets de l’archive Maven est contrôlée par le vérificateur CI ; l’inventaire public reste distinct de cette vérification de provenance.
