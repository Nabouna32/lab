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

Deux axes doivent rester séparés :

- **Référence de portage** : version stable explicitement choisie, appuyée par une source de version publiée et vérifiable. Un artefact source officiel versionné avec son SHA-256 peut établir le contrat de la version publiée même si le commit Git qui l'a produit n'est pas encore identifié.
- **Vue dépôt/API** : commit AndroidX immuable et fichier(s) API correspondants, utilisés pour naviguer dans l'implémentation et détecter les évolutions. Leur alignement avec l'artefact publié doit être prouvé avant de les traiter comme le même snapshot.
- **Veille amont** : versions alpha, bêta et stable plus récentes, comparées séparément à la référence. Une découverte en amont ne change pas silencieusement la référence du portage.

La version stable 1.4.0 est le candidat initial à évaluer. L'archive officielle `material3-1.4.0-sources.jar` est présente dans le dépôt des artefacts AndroidX : [archive source](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar), objet Gitiles `665e57823c7b99dcc36a392b7703528bf365ec8e`, SHA-256 publié `08a23a069407ba2a59685f88d676fd38ede207301a0805ee904ed63735f5d0b5` ([fichier checksum](https://android.googlesource.com/platform/prebuilts/androidx/internal/%2B/refs/heads/androidx-collection-release/androidx/compose/material3/material3/1.4.0/material3-1.4.0-sources.jar.sha256)). Cette archive est une preuve de provenance plus directement liée à la version publiée qu'une branche de développement. **Le commit Git source et l'alignement exact avec le fichier API du dépôt restent toutefois non vérifiés** ; ne pas déclarer la baseline entièrement verrouillée avant ce contrôle. Le nom de branche mutable `androidx-main` ne constitue pas une référence reproductible.

La provenance et les limites de la référence stable Material 3 1.4.0 sont également enregistrées dans le [manifeste versionné](catalog/baselines/material3-1.4.0.json). Celui-ci distingue la provenance de l’archive, contrôlée en CI par recalcul du SHA-256 et du Git blob SHA-1, le snapshot de veille et l’alignement API encore non vérifié.

Un contrôle du dépôt à un commit AndroidX immuable confirme une limite importante : dans [`compose/material3/material3/api/` au commit `5901d750e269aa3d88f6fccd5186637df83a0173`](https://github.com/androidx/androidx/tree/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/api), les snapshots versionnés présents vont jusqu'à `1.4.0-beta03` et `1.5.0-beta01`, avec `current.txt`, mais il n'y a pas de `1.4.0.txt`. Le dump `current.txt` ne peut donc pas être présenté comme l'API exacte de la version stable 1.4.0. La baseline sémantique doit rester ancrée sur l'archive source publiée `1.4.0` ; l'inventaire de surface stable reste `UNVERIFIED` tant qu'un dump de la release correspondante ou une extraction vérifiable de cette archive n'est pas disponible.


## Périmètre

### Inclus dans le catalogue principal

- Surface publique de `androidx.compose.material3:material3`, y compris les API expérimentales et Expressive publiques.
- Fonctions composables, composants, paramètres publics, types, états, interfaces, tokens et autres API publiques utiles au contrat, en conservant les distinctions entre API stable, expérimentale, dépréciée et supprimée.
- API multiplateformes et différences de disponibilité lorsqu'elles sont déclarées par les sources.

### Inventaires liés, séparés explicitement

Les bibliothèques apparentées ne doivent ni être oubliées ni être mélangées à la bibliothèque principale :

- Material 3 Adaptive ;
- Material 3 Window Size Class, si la surface publique existe encore comme artefact distinct dans la version retenue ;
- Wear Compose Material 3 ;
- autres modules Material 3 officiels découverts lors de l'audit.

Chaque module lié doit avoir son propre artefact, version, source, statut et catalogue. Son inclusion effective est décidée après vérification de la frontière et des dépendances, pas à partir de son seul nom.

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


## Versions de référence du registre multi-familles

Au 29 octobre 2026, `docs/material3/catalog/families.json` sélectionne une version stable publiée pour chacune des 22 familles recensées. Les versions des familles UI, Foundation, Animation et Runtime suivent les notes officielles des artefacts `ui-*`, `foundation-*`, `animation-*` et `runtime-*` en 1.12.1. Les familles spécialisées et historiques sont séparées : Wear Compose Material 3 1.5.0, TV Material 1.1.0, Material Components Views 1.14.0 et AppCompat 1.8.0. Les sources officielles sont liées individuellement dans le registre.

Cette sélection fixe les coordonnées de l’inventaire ; elle ne signifie pas que les dumps API immuables de ces versions ont tous été retrouvés, ni que leur correspondance avec les archives sources a été démontrée. Ces preuves restent à établir artefact par artefact avant de déclarer l’inventaire exhaustif. La référence stable Material 3 1.4.0 demeure particulièrement incomplète sur l’alignement du dump API, même si l’intégrité de son archive source est vérifiée par CI.
