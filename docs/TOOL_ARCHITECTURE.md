# Loculary — Architecture des outils

## Modèle

Loculary prend en charge trois niveaux de complexité : les petits outils, les outils avancés et les mini-applications. Tous partagent un contrat de plateforme commun, tout en conservant les interactions, visualisations et besoins propres à chaque outil.

## Contrat

Un outil doit déclarer son identité, son slug, ses contenus localisés, son niveau de complexité, sa version, ses catégories, ses tags et alias gérés de manière centralisée, ses métadonnées SEO, ses exemples, sa classification de traitement et de confidentialité, ses capacités, ses exigences navigateur, sa compatibilité hors ligne, le comportement de partage et d'état, ses outils associés, ses exigences d'accessibilité et de performance, ainsi que son état de cycle de vie.

## Contrat d'expérience utilisateur

Les pages d'outils doivent permettre d'identifier rapidement les saisies, le résultat et les actions utiles, tout en proposant les explications et la documentation nécessaires. Cet ordre exprime une priorité, pas une composition visuelle rigide. Lorsque cela est pertinent, les champs doivent empêcher les valeurs impossibles. Les erreurs doivent être claires et permettre d'agir. La réinitialisation doit être prévue pour les outils qui possèdent un état. Le partage peut représenter un outil vierge, un état configuré ou un résultat, lorsque cela ne présente pas de risque.

Les composants d'interface doivent réutiliser les composants AndroidX et leurs adaptations Web ainsi que les conventions éprouvées correspondantes. Les différences entre outils doivent répondre à leurs besoins métier et ne pas réimplémenter les patterns communs.

## Capacités

Les capacités peuvent inclure le traitement local, l'accès aux fichiers, au presse-papiers, à la caméra, au microphone, à la géolocalisation, au réseau externe, aux données de compte et au serveur ou à la base de données. Leur accès doit être explicite et contrôlable.

Les capacités sont des autorisations d'exécution, et non de simples métadonnées descriptives. `ToolPage` fournit un environnement d'exécution limité à l'outil, qui contient exactement les capacités déclarées par l'outil résolu. Les API de la plateforme sont exposées par cet environnement plutôt que d'être appelées directement par les implémentations des outils.

L'environnement d'exécution applique actuellement la capacité presse-papiers. Les autres capacités navigateur, stockage et réseau doivent suivre le même modèle à mesure que leurs abstractions de plateforme sont introduites.

### Accès

L'accès est un axe distinct du traitement :

- `anonymous` — utilisable sans compte ;
- `account` — nécessite un compte authentifié ;
- `premium` — nécessite le droit d'accès payant correspondant.

Un outil reposant sur un serveur ou un service externe n'est pas automatiquement premium. Le lieu du traitement et la politique d'accès restent des décisions indépendantes.

## Cycle de vie

Les définitions d'outils du catalogue géré dans Git utilisent les états de cycle de vie `draft`, `review`, `published`, `hidden` et `archived`. Seuls les outils publiés sont exposés dans le catalogue public. Ces états sont des métadonnées gérées dans Git ; ils ne signifient pas que la modification ou la publication du catalogue est disponible dans une interface d'administration.

## Traitement

Chaque outil identifie un traitement local, par service externe, côté serveur ou hybride, et explique quelles données sont transmises, où et pour quelle raison.

## Outils exigeants en ressources

Utiliser les Web Workers, WebAssembly, le traitement par blocs et le streaming lorsque les besoins le justifient. Les outils simples ne doivent pas hériter d'une infrastructure lourde au seul motif de maintenir une uniformité technique.

## Registre et modules d'exécution

Les outils publiés sont résolus au moyen d'un registre central. Celui-ci associe un identifiant d'outil stable à un module d'implémentation pouvant être chargé indépendamment.

Un module peut contenir une interface spécialisée, la logique propre à l'outil et son contenu éditorial ou documentaire ; il n'est pas obligé de se conformer à un moteur générique de formulaires. Le registre résout ensemble l'outil exécutable et son composant éditorial afin d'éviter l'accumulation de contenus propres aux outils dans un switch central. La route générique et l'enveloppe `ToolPage` fournissent l'infrastructure partagée de la plateforme, notamment les métadonnées, les indicateurs de confiance, la documentation, les outils associés et les futures actions communes.

Le registre est le lien exécutable entre le catalogue et les implémentations des outils. Les métadonnées du catalogue et de futures données produit stockées en base ne doivent pas être considérées comme un substitut au code des modules exécutables.

Un nouvel outil publié nécessite donc normalement :

1. une définition dans le catalogue ;
2. un module d'implémentation enregistré avec son composant éditorial propre ;
3. une couverture automatisée du registre ;
4. les tests pertinents pour cet outil.

La route publique est résolue dynamiquement à partir de la catégorie et du slug de l'outil, ce qui permet au catalogue de croître sans créer une page App Router par outil.
