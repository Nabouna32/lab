# Inventaire des API AndroidX Compose UI

## Rôle

Le catalogue répond à « quelles API publiques existent dans le périmètre, dans quelle version et avec quel statut ? ». Les spécifications de composants répondent à « comment cette API fonctionne-t-elle et comment la porter correctement sur le Web ? ». Ce sont deux objets distincts.

La couverture complète de la surface publique s'applique aux familles retenues dans le périmètre téléphone/tablette. Wear OS, Android TV et les appareils spécialisés peuvent rester identifiés dans le registre, mais leur statut demeure `migration-reference-only` : pas d'inventaire détaillé ni de portage. Compose Adaptive est étudié pour les besoins adaptatifs des téléphones et tablettes.

## Registre des familles

Le périmètre multi-familles est maintenu dans [families.json](families.json). Il s'agit volontairement d'un **registre de candidats, pas d'une déclaration d'exhaustivité**. Chaque famille possède une frontière de plateforme, un artefact distinct, des liens de provenance et un statut d'inventaire indépendant. Le registre distingue désormais des artefacts Compose de premier plan et certains modules publiés séparément, notamment UI Graphics, UI Text, UI Units, Foundation Layout, Animation Core et Runtime Saveable. Cette séparation est nécessaire : la documentation officielle de Compose présente UI, Foundation, Animation, Runtime, Material et Material 3 comme des groupes fonctionnels distincts, tandis q���q�^