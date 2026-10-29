# Portage AndroidX Material 3 vers React/Web

## Cap et autorité

La cible est **Material 3 Fidelity**, et non Material 3 Expressive. AndroidX Jetpack Compose Material 3 fait autorité pour les API, valeurs par défaut, états et comportements qu’il définit. L’objectif est un portage React/Web fidèle, pas une imitation visuelle.

Le code existant de Loculary est une entrée de migration, pas une contrainte. Pour chaque implémentation, décider de la remplacer par un portage AndroidX, de la supprimer, de la conserver comme composition produit explicitement nommée ou de l’adapter aux sémantiques du Web. Ne pas préserver un composant ou une page uniquement pour réduire le diff. Une refonte complète est permise si elle améliore réellement la cohérence du parcours.

L’ambition produit est une expérience grand public soignée et fiable ; ce niveau de qualité visé ne signifie pas que la conformité actuelle est acquise. Les sémantiques Web, l’accessibilité, la confidentialité, les performances et les langues française et anglaise restent obligatoires.

## Architecture cible

1. **Fondations partagées** : rôles de couleurs, typographie Material 3, formes, élévation et mouvement.
2. **Contrats de composants** : API, valeurs par défaut, variantes, états et transitions issus de la source AndroidX.
3. **Ports React/Web** : implémentations communes, avec adaptations Web explicitement documentées.
4. **Compositions produit et pages** : utilisation des ports partagés sans réinventer localement les mêmes règles.

La présence d’un token ou d’un composant partagé ne prouve pas sa bonne consommation ni sa fidélité. Les anciens alias et leurs consommateurs doivent être inventoriés avant suppression. Ne pas remapper mécaniquement les formes historiques, notamment 16 px et 24 px.

## Sources et preuves

Ordre d’autorité :

1. Code source AndroidX épinglé à une révision immuable et API publiée correspondante.
2. Référence API Android officielle.
3. Guides et exemples officiels Android Developers.
4. Material Web, bibliothèques React et captures d’écran : comparaisons secondaires uniquement.

Chaque spécification doit référencer les sources exactes et la version examinée. Une branche amont mutable ne suffit pas. Si l’alignement entre l’archive publiée, le code source et le dump d’API n’est pas démontré, le signaler plutôt que prétendre que la référence est verrouillée.

Documents de référence :

- [Sources et versions](sources.md)
- [Inventaire des API et règles de couverture](catalog/README.md)
- [Primitives de layout Compose UI/Foundation](layout-primitives.md)
- [Cartographie de migration de la production](production-migration.md)
- [Barres d’application](components/TopAppBar.md)
- [Modèle de spécification de composant](components/TEMPLATE.md)
- [Design system Loculary](../DESIGN-SYSTEM.md)

## Règles de migration

Avant de modifier une page ou un composant :

- Examiner la spécification AndroidX pertinente et la version épinglée.
- Auditer les usages réels, les composants partagés et le parcours complet concerné.
- Comparer une migration ciblée à une refonte depuis une page blanche ; choisir selon le résultat, pas selon le volume du diff.
- Préserver les sémantiques natives du Web : une navigation reste un lien, une action reste un bouton.
- Ne pas inventer de variante, de couleur ou de comportement destructif au seul motif qu’il semble intuitif.
- Utiliser des icônes Material adaptées à leur sens. Le remplacement d’un emoji par un symbole ne valide ni la sémantique ni le rendu.
- Vérifier les états, le clavier, le focus visible, les technologies d’assistance, les thèmes clair/sombre, les contenus FR/EN et les largeurs pertinentes.

Les tests statiques et une CI verte prouvent uniquement ce qu’ils vérifient. Ils ne démontrent pas la fidélité visuelle du navigateur. Si aucune comparaison réelle n’a été faite, conserver le statut « non vérifié ».

## États de couverture

Distinguer explicitement :

1. API recensée ;
2. sources sémantiques examinées ;
3. spécification rédigée ;
4. portage React réalisé ;
5. portage vérifié ;
6. usages de production migrés.

Une API recensée n’est pas nécessairement portée. Un composant utilisé en production n’est pas nécessairement conforme.

## État de migration — 29 octobre 2026

La migration reste partielle et la conformité globale n’est pas établie.

- **Typographie :** les 15 rôles Material 3 sont exposés sous forme de variables/classes partagées et utilisés dans de nombreux composants et compositions. L’audit des consommateurs reste incomplet.
- **Formes :** des migrations ciblées et des tests de contrat existent. L’échelle historique `--radius-*` reste présente ; inventorier ses usages et vérifier les valeurs avant tout retrait.
- **Icônes :** les sept catégories et les 51 outils utilisent le registre `MaterialIcon`, ainsi que plusieurs cartes, recherches, favoris, collections et en-têtes. Les tests contrôlent notamment la présence des identifiants dans le registre, mais ne valident pas leur pertinence sémantique ni leur rendu. Certains outils peuvent encore partager un symbole générique.
- **Contrats communs :** `Button` et `AppLink` partagent désormais un contrat de layout ; leurs différences de sémantique HTML et de variantes restent explicites. Cette centralisation est un premier pas, pas la fin de la migration.
- **Composants AndroidX :** les spécifications et vérifications sont inégales selon les familles. La présence d’une implémentation ou d’un nom AndroidX ne vaut pas validation de parité.
- **Rendu navigateur :** la validation visuelle complète des thèmes clair/sombre, du français/anglais, du responsive et des interactions reste à établir.

## État par composant

| Composant | Portage | Migration / preuve restante |
|---|---|---|
| [Button](components/Button.md) | API React nommée d'après AndroidX ; vérification des tokens et du rendu encore ouverte | Audit des usages et validation navigateur |
| [Lien Web](components/Link.md) | `AppLink` conserve la sémantique d'ancre et partage les variantes visuelles du bouton | Audit global des usages |
| [ListItem](components/ListItem.md) | Adaptation existante, compositions simples alignées sur AndroidX 1.4.0 | Surcharges interactives et parité navigateur non vérifiées |
| [IconButton](components/IconButton.md) | Implémentation existante | Contrat source, états et rendu à vérifier |
| [Card](components/Card.md) | Variantes `Card`, `ElevatedCard`, `OutlinedCard` et composition `CardLink` séparées | Valeurs source et usages de production à vérifier |
| [Chip](components/Chip.md) | Adaptation des variantes Assist, Filter, Input et Suggestion | Parité des états et du rendu à vérifier |
| [Badge / BadgedBox](components/Badge.md) | Adaptation Web avec rôles de couleur et nom accessible explicites | Tailles, ancrage et usage dans les contrôles à vérifier |
| Autres familles | Inventaire et couverture incomplets | À inventorier selon le périmètre déclaré |

La validation navigateur de `NavigationBar` reste suivie dans [l’issue #977](https://github.com/Nabouna32/lab/issues/977) ; cela ne signifie pas que le composant est déjà fidèle à AndroidX.

## Ordre de migration de la production

1. Inventorier les styles et composants locaux hérités, les consommateurs des fondations et les contrats déjà partagés.
2. Corriger les fondations et composants communs en priorité, avec une source AndroidX immuable et des tests de contrat.
3. Migrer les consommateurs par familles cohérentes ; supprimer les anciennes règles seulement après inventaire des références et validation des remplacements.
4. Pour chaque page, comparer explicitement la migration ciblée à une refonte depuis une page blanche, expliquer les conséquences et retenir la meilleure expérience plutôt que le plus petit diff.
5. Vérifier les pages et interactions dans le navigateur ; les tests statiques ne suffisent pas.

Une valeur écrite en dur est à examiner, pas à conserver par défaut. Elle ne reste locale que si elle décrit une différence réellement spécifique au composant ou à la composition, ou une adaptation Web nécessaire, et si sa justification est documentée. Les valeurs qui relèvent d’un contrat AndroidX doivent venir de ce contrat partagé.

## Cycle de travail

Pour chaque tranche cohérente : sélectionner la famille, examiner les sources et usages, décider de l’architecture cible, implémenter, ajouter des tests proportionnés, exécuter les contrôles pertinents, vérifier le navigateur lorsque possible, migrer les consommateurs, puis mettre à jour la spécification et le statut avec des preuves. Garder les commits focalisés et la documentation canonique concise ; supprimer les historiques redondants lorsque l’information utile est conservée ailleurs.

## Priorités

- Vérifier les ports existants et leurs contrats avant de les présenter comme fidèles.
- Continuer l’inventaire des API publiques AndroidX dans le périmètre déclaré, y compris celles qui ne sont pas utilisées par Loculary.
- Prioriser séparément les portages à implémenter selon les besoins réels du produit.
- Migrer les pages et composants vers les ports validés ; remplacer ou supprimer les mécanismes hérités devenus inutiles.
- Pour toute page concernée, documenter le choix entre migration ciblée et refonte depuis une page blanche.

La fidélité est une conclusion étayée par des sources, des tests et une vérification adaptée — jamais une simple étiquette visuelle.
