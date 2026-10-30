# Snapshots de veille Compose P0

Ces quatre fichiers conservent les signatures `api/current.txt` du dépôt AndroidX au commit immuable `5901d750e269aa3d88f6fccd5186637df83a0173`.

**Statut : veille uniquement.** Ce commit est une référence d'inspection, pas le commit de release Compose 1.12.1. Les snapshots ne constituent donc ni des baselines stables 1.12.1, ni une preuve d'alignement avec les sources JAR/AAR Google Maven.

| Famille | Dump source | Git blob SHA-1 | Packages | Types | Méthodes | Constructeurs | Champs | Propriétés |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `compose-ui` | `compose/ui/ui/api/current.txt` | `fe47644a141d05f16c45f15a90c24ecb03e630c8` | 28 | 243 | 2 413 | 159 | 118 | 1 207 |
| `compose-foundation` | `compose/foundation/foundation/api/current.txt` | `5206f892f57b02808ed792a2ac1857c78aee149f` | 24 | 163 | 1 660 | 125 | 93 | 414 |
| `compose-ui-text` | `compose/ui/ui-text/api/current.txt` | `3a47f781e60c75946b82e75b9936f61591d24127` | 8 | 61 | 1 000 | 181 | 50 | 409 |
| `compose-foundation-layout` | `compose/foundation/foundation-layout/api/current.txt` | `e174cdc00cc24569147c3ba25c616762a2555737` | 1 | 22 | 536 | 9 | 26 | 129 |

Le [manifeste](manifest.json) conserve les chemins amont, le commit, les empreintes Git blob et les limites de preuve. Les fichiers bruts sont conservés pour permettre une normalisation et un diff ultérieurs sans dépendre d'un état mutable du dépôt amont.

Avant toute promotion en baseline stable, il faut identifier la référence de release officielle de chaque groupe, récupérer le dump correspondant à ce commit et comparer les sources JAR publiées aux fichiers sources du même commit. Tant que ces rapprochements ne sont pas réalisés, ne pas attribuer le statut `verified`.
