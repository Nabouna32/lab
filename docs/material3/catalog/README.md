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

### Audit des variantes de publication Compose

Le script `.github/scripts/audit-compose-submodule-publications.mjs` inspecte les publications Google Maven de Compose UI Text et Foundation Layout en version 1.12.1. Il vérifie les sommes SHA-256 publiées des métadonnées Gradle, des archives sources et des AAR Android, valide l'identité des composants et relève les liens `available-at` entre modules logiques et variantes Android. Le rapport JSON est conservé comme artefact CI pendant sept jours ; il ne remplace pas une baseline versionnée.

Cet audit établit l'intégrité des fichiers téléchargés et la structure des variantes publiées. Il **ne prouve pas** que les sources correspondent à un commit AndroidX précis, ni que le dump API stable correspond à l'AAR. Ces vérifications restent distinctes et nécessaires avant de déclarer l'inventaire stable vérifié.

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

## Versions stables retenues au 30 octobre 2026

Les versions officielles choisies et l’alignement de leur surface API sont deux statuts distincts. Pour Material 3 1.4.0, le registre de provenance [versionné](baselines/material3-1.4.0.json) identifie l’archive source stable, le snapshot de veille et les preuves de correspondance. L’alignement des déclarations du dump stable vers l’AAR Android est désormais `VERIFIED` au niveau des descripteurs JVM ; cela ne valide ni le portage React ni la parité sémantique des composants.

L’inspection reproductible des répertoires API au commit AndroidX épinglé est consignée dans [repository-api-inspection-5901d750.json](baselines/repository-api-inspection-5901d750.json). Elle couvre maintenant **21 des 22 familles sélectionnées**. La famille Material Components for Android Views est exclue de ce fichier, car son dépôt de sources est distinct (`material-components/material-components-android`). Pour les 21 familles inspectées, aucun dump portant exactement la version stable sélectionnée n’existait dans le répertoire API examiné au commit `5901d750` ; les derniers dumps versionnés observés étaient des versions bêta ou candidates à la release. Ce constat historique n’annule pas les vérifications ultérieures par artefact : Material 3 1.4.0 dispose maintenant d’un dump stable `current.txt` vérifié séparément au commit de release `5113b82a4ed6416d6344efa50e41db8cb65928ff`. Les autres familles doivent conserver leur propre vérification de provenance et d’alignement.

Les versions de référence doivent être choisies par artefact/groupe, pas supposées identiques pour toute la stack Compose. Le champ artifactCoordinateStatus distingue les coordonnées confirmées dans la documentation de publication officielle des coordonnées encore candidates ; un nom plausible ou un dossier AndroidX ne suffit pas à prouver qu'un artefact est publié sous cette coordonnée. Les pages officielles indiquent actuellement :

- Compose UI, Foundation, Animation, Runtime et Material 2 : **1.12.1** ([versions Compose](https://developer.android.com/jetpack/androidx/versions)).
- Compose Material 3 : **1.4.0** ([notes de version Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material3)).
- Compose Material 3 Adaptive : **1.3.0** ([versions AndroidX](https://developer.android.com/jetpack/androidx/versions)).
- Navigation (dont Navigation Compose et Navigation Fragment) : **2.10.2** ([notes de version Navigation](https://developer.android.com/jetpack/androidx/releases/navigation)).

Le registre versionné sélectionne maintenant une version stable publiée pour chacune des 22 familles. Les nouvelles sélections couvrent Wear Compose Material 3 (1.5.0), TV Material (1.1.0), Material Components Views (1.14.0), AppCompat (1.8.0) et les sous-modules UI, Foundation Layout, Animation Core et Runtime Saveable (1.12.1), selon leurs pages de publication officielles. Cette sélection établit le périmètre de version, pas l'alignement entre le dump API et les sources de chaque artefact : cet alignement reste à vérifier séparément. Le registre utilise le groupe Maven `androidx.compose.material3.adaptive:adaptive` pour l'artefact Adaptive.

Une BOM Compose peut aligner des versions compatibles, mais n'ajoute pas toutes les bibliothèques au projet et ne remplace pas l'identification des artefacts à inventorier. Chaque baseline doit garder la provenance officielle, la version et le snapshot source/API correspondant.

## Statut du catalogue Material 3

- **Veille amont** : un snapshot exhaustif de current.txt est généré dans [watch/androidx-main-2026-10-22/](watch/androidx-main-2026-10-22/README.md). Il contient 4 709 déclarations réparties sur trois packages, épinglées à un commit et avec les empreintes SHA-256 de la source et des shards. Il s'agit d'un inventaire de surface, pas d'une spécification sémantique ni d'une baseline de portage.
- **Dump API stable 1.4.0** : le snapshot officiel `compose/material3/material3/api/current.txt` est épinglé au commit AndroidX de release `5113b82a4ed6416d6344efa50e41db8cb65928ff` (`COMPOSE_MATERIAL3 = "1.4.0"` dans `libraryversions.toml`). Son Git blob SHA-1 est `fd45e9feea96a631c0f8b7ac82f88ee9ce999029` ; il est identique au dernier fichier versionné `1.4.0-beta03.txt`. La copie exacte est conservée dans [le baseline API](baselines/material3-1.4.0-api.txt) et sa provenance dans [le manifeste](baselines/material3-1.4.0.json).

- **Historique beta → stable** : le dump `1.4.0-beta01.txt` (blob `f27bfa77b39e0d7cc38c2ed78e80d14b78e20786`, 609 369 octets) diffère de beta02 (blob `fd45e9feea96a631c0f8b7ac82f88ee9ce999029`, 609 538 octets) par 13 lignes de déclarations retirées et 14 ajoutées. Les changements identifiés comprennent la suppression de `BasicAlertDialogOverrideScope`, le renommage `threshold` → `maxDistance` dans PullToRefresh, l’ajout d’API autour de `IndicatorMaxDistance`, `indicatorContainerColor` et `indicatorShape`, ainsi que des changements de dépréciation/compatibilité autour de `indicatorColor`, `containerColor` et `shape`. Beta02 et beta03 sont byte pour byte identiques ; beta03 et le `current.txt` du commit de release sont également identiques. Aucun fichier `1.4.0-rc*.txt` n’existe dans le répertoire API de ce commit : aucune comparaison RC directe n’est revendiquée.
- **Stabilité et types de déclarations** : le dump stable contient 207 occurrences de `@ExperimentalMaterial3Api`, 241 de `@Deprecated`, 1 033 de `@BytecodeOnly`, 34 de `@KotlinOnly` et 207 de `@SuppressCompatibility`. La release de l’artefact en version stable ne signifie donc pas que toutes ses API sont stables. Les entrées `@BytecodeOnly` représentent des formes ABI générées et sont comparées séparément ; les entrées `@KotlinOnly` conservent leur classification Kotlin-only. Les déclarations internes ou générées présentes dans l’AAR brut ne sont pas promues au rang d’API publique par leur seule présence dans le bytecode. Le détail des snapshots et des différences est consigné dans [le manifeste](baselines/material3-1.4.0.json).
- **Commit source exact** : la CI #4375 a comparé byte pour byte les 249 fichiers Kotlin du sources JAR au commit AndroidX `5113b82a4ed6416d6344efa50e41db8cb65928ff` : 249/249 correspondances, aucune divergence. Le lien source/API stable est établi.
- **Artefacts publiés** : les archives `material3-android-1.4.0-sources.jar` et `material3-android-1.4.0.aar` ainsi que les deux métadonnées Gradle ont été téléchargées par CI et vérifiées contre les SHA-256 Google Maven ; leurs empreintes sont épinglées dans [le manifeste](baselines/material3-1.4.0.json).
- **Rapprochement sources/AAR** : [l'inventaire dérivé](baselines/material3-android-1.4.0-api-inventory.json) relie les attributs JVM `SourceFile` aux chemins de sources : 1 353 des 1 367 classes binaires sont associées à un fichier source du même package. La surface `javap` brute compte 633 classes JVM publiques, 892 champs et 8 360 méthodes publics/protégés. Ces nombres incluent des déclarations Kotlin `internal` et des éléments générés ; ils ne constituent pas un dump API Kotlin.
- **Comparaison déclarative exacte** : le rapport reproductible confirme 232/232 classes API, 807/807 méthodes source, 995/995 descripteurs `@BytecodeOnly`, 104/104 constructeurs (dont 34/34 `@KotlinOnly`), 74/74 champs et 669/669 getters de propriétés. Les 533 méthodes source qui utilisent un ABI abaissé sont reliées à des entrées `@BytecodeOnly` dont les descripteurs ont été vérifiés indépendamment. Les transformations Compose (`Composer`, flags et masques de valeurs par défaut), le boxing/unboxing des value classes et les constructeurs Kotlin synthétiques sont pris en compte. Aucun membre déclaré ne reste manquant ou non pris en charge.
- `apiDumpAlignment` est **`VERIFIED`** pour la correspondance des déclarations du dump API stable vers l’AAR Android au niveau des descripteurs JVM. Les propriétés sont vérifiées via leur getter publié ; aucun setter ni champ de backing non exposé n’est inféré. Cette preuve ne démontre pas la fidélité du portage React, la parité sémantique ni le rendu navigateur.
- **Couverture globale** : ne pas annoncer le catalogue complet tant que la baseline de portage et les artefacts apparentés à inventorier séparément n'ont pas été traités.


### Material Components for Android Views — référence historique

La famille Views est suivie séparément de Compose Material 3 dans [son manifeste de provenance](baselines/material-components-views-1.14.0.json). La release stable 1.14.0 est épinglée au commit source officiel. Le dépôt ne fournit pas de dump API classique à ce tag, et le projet amont annonce le mode maintenance sans nouvelles fonctionnalités prévues. Cette famille sert donc à cartographier les API historiques et les migrations, pas à élargir la cible de nouveaux ports Material 3. La provenance des octets de l’archive Maven est contrôlée par le vérificateur CI ; l’inventaire public reste distinct de cette vérification de provenance.


L’index provisoire MDC Views 1.14.0 est versionné dans [le rapport des signatures binaires](baselines/material-components-views-1.14.0-api-inventory.json). Il inspecte l’AAR publié et rapproche les déclarations Java par AST. Les méthodes sont appariées par types de paramètres normalisés après effacement des génériques, résolution des bornes des variables de type et parcours de la hiérarchie source ; les ambiguïtés de surcharge constatées précédemment ont été levées sans inférer d’annotation. L’index recense 1 107 classes binaires, 523 types publics/protégés et 6 012 membres visibles : 5 846 membres ont une correspondance source unique, dont 388 hérités de leur déclaration source la plus proche ; 166 restent sans correspondance unique. Les noms de types simples non résolus sont laissés sans rapprochement afin d’éviter les faux positifs entre packages ; aucune ambiguïté de surcharge n’est retenue. Les cas non rapprochés comprennent notamment des constructeurs sans déclaration source, des méthodes de pont et des méthodes générées. L’index reste non exhaustif et ne remplace pas un dump officiel.
