# AndroidX Material 3 — snapshot de veille

Ce snapshot est un inventaire reproductible de la surface API publique contenue dans `current.txt` au commit AndroidX immuable `5901d750e269aa3d88f6fccd5186637df83a0173`.

- Source : [`compose/material3/material3/api/current.txt`](https://github.com/androidx/androidx/blob/5901d750e269aa3d88f6fccd5186637df83a0173/compose/material3/material3/api/current.txt)
- SHA-256 du dump source : `37bdc94e8e84f5a999922143f531c8a83fd488d1cb1f7929ebb51cb469832bd5`
- Format : `5.0`, surface : `public`
- Déclarations inventoriées : **4709** dans 3 packages.
- Candidats API source : 2523 ; `@BytecodeOnly` : 1792 ; `@InaccessibleFromKotlin` : 394.
- Identité des déclarations : package + propriétaire + signature, avec contrôle de collision.

## Limites

Ce snapshot est une **veille amont**, pas la baseline stable 1.4.0. Le dépôt AndroidX à ce commit ne contient pas de fichier `1.4.0.txt`; la correspondance exacte entre l'archive publiée 1.4.0 et un dump API reste non vérifiée. Toutes les maturités API restent `unknown` tant qu'elles n'ont pas été vérifiées à partir des annotations et sources Kotlin. Les entrées `@BytecodeOnly` et `@InaccessibleFromKotlin` sont conservées pour l'exhaustivité du dump, mais ne sont pas automatiquement des API Kotlin à porter.

Le manifeste donne les empreintes SHA-256 de la source et de chaque shard. Les shards contiennent uniquement les tableaux `declarations` produits par le parseur ; leurs métadonnées communes sont dans `manifest.json`.
