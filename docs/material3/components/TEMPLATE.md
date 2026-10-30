# <Official AndroidX component name>

> **Inventaire :** <catalog ID / artifact / version>  
> **État des sources :** UNVERIFIED  
> **État du portage :** À inventorier  
> **État de migration :** À inventorier

## Identité et périmètre

- API/package Kotlin officiel :
- Artefact et version :
- Maturité de l'API : stable / experimental / deprecated / unknown
- API et surcharges associées :
- Exclusions explicites et justification :

## Sources immuables et preuves

- Artefact Maven et version exacte :
- URL de l'archive source publiée et SHA-256 :
- Commit immuable du dépôt AndroidX et URL, si identifié :
- Chemins exacts des fichiers Kotlin :
- Chemin du fichier API public :
- Référence API officielle :
- Recommandations officielles d'utilisation :
- Date de récupération et méthode de vérification :

## Contrat public

Décrire les signatures, paramètres, valeurs par défaut, variantes et types publics, en distinguant les faits vérifiés des interprétations.

## Comportement établi par la source

Décrire les états, transitions, interactions, règles de layout, sémantiques, comportements d'accessibilité et éventuelles différences de plateforme.

## Audit de Loculary

- Implémentation(s) actuelle(s) :
- Fichiers et consommateurs :
- Comportements observés :
- Écarts par rapport à AndroidX :
- Risques et incertitudes :

## Contrat du portage React/Web

- Nom et API exposés :
- Sémantique HTML/ARIA :
- Adaptations Web nécessaires :
- Extensions propres au produit, le cas échéant :
- États et interactions :
- Thèmes, responsive, langues et réduction des animations :
- Éléments volontairement non portés et justification :

Utiliser les étiquettes `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION` et `UNVERIFIED` pour distinguer la provenance et le niveau de preuve. Ne pas créer d'extension propre à Loculary lorsqu'un composant AndroidX ou une adaptation Web pertinente couvre déjà le besoin.

## Plan et résultats de vérification

- [ ] Vérification des sources et du contrat public.
- [ ] Tests de contrat et de comportement.
- [ ] Vérification clavier et focus.
- [ ] Vérification des technologies d'assistance.
- [ ] Vérification des thèmes clair et sombre.
- [ ] Vérification des contenus français et anglais.
- [ ] Vérification responsive et zoom/reflow.
- [ ] Vérification du rendu navigateur par comparaison avec la référence.
- [ ] Inventaire et migration des consommateurs de production.
- [ ] Suppression des anciennes implémentations devenues inutiles.

Indiquer les commandes, résultats, environnements, versions, viewports, langues, thèmes et états réellement vérifiés. Une case cochée doit correspondre à une preuve disponible ; une vérification non effectuée reste explicitement en attente.

## Écarts et décisions

Documenter chaque écart connu, son impact, les options considérées, la décision et les critères qui permettraient de le résoudre.

## Cycle de vie

- Date de création / dernière revue :
- Version AndroidX de référence :
- Statut : UNVERIFIED / IN-PROGRESS / VERIFIED / DEPRECATED
- Consommateurs migrés :
- Travail restant :
- Décision ou spécification remplacée, le cas échéant :
