# AndroidX Material 3 — sources et versions

## Objectif

Le catalogue couvre les API publiques du périmètre retenu, même lorsqu'elles ne sont pas utilisées par Loculary. La couverture documentaire ne signifie ni que chaque API doit être portée en React, ni qu'elle est stable.

## Sources faisant autorité

1. **Code source AndroidX** — dépôt officiel [androidx/androidx](https://github.com/androidx/androidx), sous `compose/material3/`.
2. **Contrat API publié** — fichiers `api/*.txt` du module concerné dans le dépôt AndroidX. Ils décrivent la surface API publiée, mais leur format JVM généré ne constitue pas à lui seul une spécification sémantique.
3. **Référence API Android officielle** — [Compose Material 3 API reference](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary).
4. **Guides et exemples officiels** — [Compose UI components](https://developer.android.com/develop/ui/compose/components) et [notes de version Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material3).
5. **Sources secondaires** — Material Web, bibliothèques React et captures d'écran peuvent aider à évaluer les adaptations Web, mais ne remplacent jamais AndroidX comme autorité du contrat.

- [Dépôt officiel des artefacts AndroidX publiés](https://android.googlesource.com/platform/prebuilts/androidx/internal/) — archives versionnées et sommes de contrôle.

## Référence de portage et veille

Le cycle de maintenance conserve une référence de release unique par famille : version stable, commit AndroidX immuable, dump API et sources publiées dont l'alignement est prouvé. Lorsqu'une nouvelle release est retenue, comparer ses dumps et sources à cette référence, examiner le diff, puis mettre à jour la baseline dans un changement explicite. Ne pas maintenir un snapshot de développement parallèle lorsque la référence stable suffit.

Material 3 1.4.0 est une référence stable vérifiée. Son archive source publiée est disponible ici : [material3-1.4.0-sources.jar](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), SHA-256 `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5`. Son commit de release, son dump API et ses 249 fichiers sources sont alignés au commit immuable `5113b82a4ed6416d6344efa50e41db8cb65928ff`.

La provenance de Material 3 1.4.0 est enregistrée dans le [manifeste versionné](catalog/baselines/material3-1.4.0.json). Celui-ci distingue l'intégrité de l'archive publiée, la provenance du code source et l'alignement de l'API ; chaque statut reflète les preuves réellement disponibles.

La référence stable Material 3 1.4.0 est désormais établie directement depuis le commit de release `5113b82a4ed6416d6344efa50e41db8cb65928ff` : le marqueur `COMPOSE_MATERIAL3` vaut `1.4.0`, le dump `current.txt` est épinglé par Git blob SHA-1 et les 249 sources Kotlin publiées sont comparées byte pour byte au même commit. Il n'est donc pas nécessaire de conserver un snapshot parallèle de la branche de développement pour définir cette baseline.

## Provenance stable Compose UI / Foundation 1.12.1

La version 1.12.1 est confirmée au commit AndroidX immuable `5e0747401bf56b243e3b5141ae080dc9bc61d29c` de `refs/heads/androidx-compose-release`. À ce commit, `COMPOSE_UI` et `COMPOSE_FOUNDATION` délèguent à `versions.COMPOSE`, dont la valeur est `1.12.1`. La CI résout cet alias dans `libraryversions.toml` et épingle le SHA du commit ; la version n'est pas choisie à partir d'un nom de branche supposé.

Les fichiers `api/current.txt` de Compose UI, UI Text, Foundation et Foundation Layout ont été téléchargés depuis ce commit. Les quatre sont au format AndroidX 4.0 ; le chemin `api/current.txt` représente la surface publique pour ce format antérieur aux métadonnées `surface=public` du format 5.0. Leurs empreintes SHA-256 et Git blob SHA-1, tailles, chemins et nombres de packages sont conservés dans [le manifeste de provenance](catalog/baselines/compose-p0-1.12.1-api-provenance.json), et recalculés en CI. Aucun dump `1.12.1.txt` versionné n'est présent à ces chemins dans ce commit ; le `current.txt` du commit de release est utilisé, pas celui de `androidx-main`.

**Preuve complète de provenance :** la CI #4516 compare les quatre archives `sources.jar` publiées sur Google Maven avec les arbres sources du commit AndroidX `5e0747401bf56b243e3b5141ae080dc9bc61d29c`. Les 1 039 fichiers de sources/licence ont été comparés sans absence ni divergence (384 UI, 163 UI Text, 455 Foundation, 37 Foundation Layout) ; seul le manifeste technique de chaque JAR est exclu. Les SHA-256 des archives et le résultat sont consignés dans [le manifeste de provenance](catalog/baselines/compose-p0-1.12.1-api-provenance.json). La baseline Compose 1.12.1 est donc verrouillée au niveau release/API/sources. Cela ne signifie pas que l'inventaire sémantique est terminé ni que les ports React sont conformes.

## Périmètre

### Inclus dans le catalogue principal

- Surface publique de `androidx.compose.material3:material3`, y compris les API expérimentales et Expressive publiques.
- Fonctions composables, composants, paramètres publics, types, états, interfaces, tokens et autres API publiques utiles au contrat, en conservant les distinctions entre API stable, expérimentale, dépréciée et supprimée.
- API multiplateformes et différences de disponibilité lorsqu'elles sont déclarées par les sources.

### Familles liées au périmètre mobile/tablette

- Material 3 Adaptive est étudié pour les interfaces adaptatives téléphone/tablette.
- Material 3 Window Size Class n'est inventorié que si son artefact distinct apporte une capacité utile à ce même périmètre.

Wear Compose Material 3, Android TV et les appareils spécialisés restent des repères dans le registre (`migration-reference-only`). Ils ne déclenchent ni inventaire détaillé ni portage.

### Exclus

- API internes/privées qui ne font pas partie du contrat public publié ;
- signatures JVM synthétiques, ponts du compilateur et détails de génération qui ne sont pas des API Kotlin publiques indépendantes ;
- Material Components Views (système Views historique), Material Web et bibliothèques tierces, qui peuvent être documentés comme comparaisons mais pas comme API Compose Material 3.

Une API expérimentale reste une API publique à inventorier : « expérimentale » n'est pas synonyme d'« exclue ».

## Règles de traçabilité

Pour chaque référence enregistrée, conserver :

- artefact Maven et version exacte ;
- URL officielle de l'archive source publiée et son SHA-256, si disponible ;
- SHA Git immuable et URL du commit, lorsque le commit source est identifié ;
- chemin exact du fichier source et du fichier API, lorsque le snapshot dépôt est utilisé ;
- URL officielle de référence API ;
- statut de maturité et annotations de dépréciation ;
- date de récupération, empreinte SHA-256 de chaque snapshot et méthode d'extraction ;
- preuve du lien entre l'artefact publié et le snapshot du dépôt, ou mention explicite de son absence.

Ne pas inférer un commit depuis le nom d'un tag ni supposer que `androidx-main` correspond à une version publiée. Si l'archive source publiée est vérifiée mais que le commit Git correspondant reste inconnu, l'archive peut servir de référence sémantique ; l'alignement dépôt/API reste `UNVERIFIED`. Une absence de preuve doit rester visible, jamais être remplacée par une hypothèse.

## Limite importante du fichier API

Le fichier API publié est un excellent signal de changements de surface, mais il ne décrit pas complètement l'anatomie, les états visuels, les transitions, les valeurs par défaut sémantiques ou le comportement d'accessibilité. La génération automatisée sert donc à l'inventaire et à la détection de différences. La spécification de portage de chaque composant doit être confrontée au code Kotlin et aux guides officiels pertinents.


## Versions de référence et périmètre produit

Le registre `docs/material3/catalog/families.json` conserve les coordonnées des familles AndroidX examinées, mais ce registre de candidats ne définit pas à lui seul le périmètre de portage Loculary.

Le portage produit vise les téléphones et tablettes :
- Compose UI / Foundation 1.12.1 : baseline release, API et sources vérifiées au commit `5e0747401bf56b243e3b5141ae080dc9bc61d29c`.
- Compose Material 3 1.4.0 : baseline release, API et sources vérifiées au commit `5113b82a4ed6416d6344efa50e41db8cb65928ff`.
- Compose Adaptive : référence à étudier pour les mises en page adaptatives téléphone/tablette.
- Wear OS, Android TV et bibliothèques Views historiques : registre de référence uniquement ; pas d'inventaire détaillé ni de portage produit.

Les autres familles candidates ne sont pas considérées comme vérifiées parce qu'une version stable est sélectionnée dans le registre. Leur provenance API/sources ne sera étudiée que si elle apporte une valeur directe au périmètre mobile/tablette.

### Material Components Views (historique)

L’artefact `com.google.android.material:material:1.14.0` est séparé de Jetpack Compose Material 3. Son archive source Maven a été téléchargée par la CI et vérifiée contre les sidecars Google Maven : SHA-256 `fde0310c43bdc6a30a12b6e288113b123769ee78de0327df559d992c26974067`, SHA-1 `b619b8afcf9744457ff2e54e70608cb46be12910`, Git blob SHA-1 calculé `02ca28f3426728ed7b02f89c6d5f1973e9e711d7`, taille 1 361 931 octets ([exécution CI](https://github.com/Nabouna32/lab/actions/runs/40953414767)). Le dépôt amont a placé la bibliothèque Views en maintenance, sans nouvelles fonctionnalités prévues ([release 1.14.0](https://github.com/material-components/material-components-android/releases/tag/1.14.0), [guide amont épinglé](https://github.com/material-components/material-components-android/blob/66c334b7946dabf33adfe1a2b7cad6bcaa4ea3ad/docs/getting-started.md)). Son tag ne contient pas de dump API public classique. Le manifeste [Material Components Views 1.14.0](catalog/baselines/material-components-views-1.14.0.json) conserve uniquement la provenance de l’archive Maven. La CI vérifie ses empreintes et sommes de contrôle publiées. Cette famille reste un repère de migration historique (`migration-reference-only`), sans inventaire détaillé ni nouveaux ports.


