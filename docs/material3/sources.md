# AndroidX Material 3 — sources et versions

## Objectif

Le catalogue couvre les API publiques du périmètre retenu, même lorsqu'elles ne sont pas utilisées par Loculary. La couverture documentaire ne signifie ni que chaque API doit être portée en React, ni qu'elle est stable.

## Sources faisant autorité

1. **Code source AndroidX** — dépôt officiel [androidx/androidx](https://github.com/androidx/androidx), sous `compose/material3/`.
2. **Contrat API publié** — fichiers `api/*.txt` du module concerné dans le dépôt AndroidX. Ils décrivent la surface API publiée, mais leur format JVM généré ne constitue pas à lui seul une spécification sémantique.
3. **Référence API Android officielle** — [Compose Material 3 API reference](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary).
4. **Guides et exemples officiels** — [Compose UI components](https://developer.android.com/develop/ui/compose/components) et [notes de version Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material3).
5. **Sources secondaires** — Material Web, bibliothèques React et captures d'écran peuvent aider à évaluer les adaptations Web, mais ne remplacent jamais AndroidX comme autorité du contrat.

## Référence de portage et veille

Deux axes doivent rester séparés :

- **Référence de portage** : version stable explicitement choisie, avec commit AndroidX immuable, fichier(s) API correspondants et sources de chaque composant. Aucun composant ne doit être déclaré « sources vérifiées » tant que l'alignement version/commit/API n'est pas confirmé.
- **Veille amont** : versions alpha, bêta et stable plus récentes, comparées séparément à la référence. Une découverte en amont ne change pas silencieusement la référence du portage.

La version stable 1.4.0 est le candidat initial à évaluer. Son commit source exact et le fichier API associé doivent être résolus et contrôlés avant de l'enregistrer comme référence vérifiée. Le nom de branche mutable `androidx-main` ne constitue pas une référence reproductible.

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

Pour chaque référence enregistrée, conserver autant que possible :

- artefact et version ;
- SHA Git immuable ;
- chemin exact du fichier source et du fichier API ;
- URL officielle de référence API ;
- statut de maturité et annotations de dépréciation ;
- date de récupération et empreinte SHA-256 du snapshot ;
- méthode utilisée pour extraire et normaliser la surface publique.

Une absence de preuve doit rester visible comme `UNVERIFIED`; elle ne doit pas être remplacée par une hypothèse.

## Limite importante du fichier API

Le fichier API publié est un excellent signal de changements de surface, mais il ne décrit pas complètement l'anatomie, les états visuels, les transitions, les valeurs par défaut sémantiques ou le comportement d'accessibilité. La génération automatisée sert donc à l'inventaire et à la détection de différences. La spécification de portage de chaque composant doit être confrontée au code Kotlin et aux guides officiels pertinents.
