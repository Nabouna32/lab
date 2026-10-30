# Loculary — Design system

**Direction :** Material 3 Fidelity, avec les interfaces Pixel / Android actuelles comme identité visuelle explicite du produit.  
**Décision :** [DEC-026](DECISIONS.md#dec-026--material-3-fidelity-and-pixel-inspired-interface).  
**Statut :** direction cible obligatoire ; la conformité de l'ensemble de la production n'est pas encore établie.

## Objet et autorité

Ce document définit les fondations visuelles partagées et les règles communes aux composants. AndroidX Jetpack Compose Material 3 constitue la source principale des contrats de composants ; les recommandations officielles Android Developers apportent le contexte d'utilisation. Pour chaque portage, les sources doivent être rattachées à une version ou à un commit précis. Material Web et les autres bibliothèques React servent uniquement de points de comparaison, jamais d'autorités de substitution.

La cible est un portage React/Web fidèle des composants AndroidX Compose Material 3, et non une simple imitation visuelle. Chaque composant possède une spécification distincte dans [`material3/components/`](material3/README.md). Un composant ne doit pas être qualifié de fidèle à sa source tant que son API, ses états, son comportement, son rendu et ses différences n'ont pas été vérifiés par rapport à la source épinglée.

**Partir de la cible, pas de l'existant :** les composants, CSS, layouts et compositions de pages de Loculary constituent une base d'inventaire et de migration, pas des contraintes de conservation. Un composant qui porte un nom AndroidX n'est pas automatiquement fidèle ; il doit être amélioré ou remplacé selon le contrat AndroidX de référence. Les refontes sont possibles lorsque la structure existante empêche d'adopter correctement les composants et patterns éprouvés ; elles doivent rapprocher l'expérience des conventions familières des applications Pixel et Android de qualité, et non rechercher la nouveauté pour elle-même. L'ambition produit est celle d'une application grand public de niveau AAA : familière, soignée, fiable et robuste pour un large public. Il s'agit d'un objectif de qualité, pas d'une affirmation sur l'échelle ou la conformité actuelles.

**Material 3 Fidelity est la direction visuelle du produit, et non une préférence d'implémentation facultative.** Loculary doit donner l'impression d'une application Android soigneusement conçue et portée sur le Web, avec la cohérence visuelle, la hiérarchie, les surfaces, la typographie, les couleurs tonales, l'iconographie, les animations et la qualité d'interaction attendues d'une application Pixel soignée. Ne pas remplacer cette direction par un site générique, un tableau de bord ou une implémentation visuellement appauvrie au seul motif qu'elle est plus rapide ou plus facile à coder. La simplicité technique doit supprimer la complexité inutile du système, jamais abaisser le niveau d'expérience attendu. Cette direction doit être adaptée avec discernement aux sémantiques du Web, au responsive, à l'accessibilité et aux besoins des tâches. Remplacer cette identité par un langage visuel substantiellement différent nécessite une validation explicite de l'utilisateur.

Distinguer deux autorités. **AndroidX fait autorité pour les contrats qu'il définit.** Pour les parcours produit et les choix de composition qu'AndroidX ne spécifie pas, reprendre les conventions éprouvées d'applications grand public reconnues : réglages et comptes clairs, navigation prévisible, iconographie familière, validation accessible des formulaires et états cohérents de chargement, d'absence de contenu, d'erreur et de succès. Comparer des références crédibles et vérifier la pertinence du modèle pour la tâche Loculary, sans copier intégralement un produit ni inventer une nouveauté sans valeur utilisateur. Aucune référence externe ne prévaut sur les sémantiques du Web, l'accessibilité, la confidentialité ou les performances. Ne pas conserver des API ou styles historiques uniquement pour réduire le diff. Choisir une correction ciblée ou une refonte plus large selon la solution qui produit le résultat le plus clair et maintenable, sans diluer l'ambition visuelle.

## Fondations

- Utiliser Material Color Utilities **Fidelity** pour générer les rôles de couleur sémantiques à partir de la seed ; documenter la seed actuellement utilisée dans l'implémentation. La seed n'est pas une couleur littérale à appliquer partout.
- Utiliser MCU Rainbow uniquement pour l'identité des catégories, et non comme un second thème sémantique.
- Utiliser les rôles sémantiques et leurs couleurs de premier plan `on-*` correspondantes. Ne jamais coder en dur des couleurs de palette dans les composants partagés lorsqu'un rôle sémantique existe.
- Les thèmes clair et sombre doivent implémenter le même contrat de rôles. Vérifier les couleurs calculées et les contrastes, y compris les états désactivés, le focus, les bordures et les superpositions.
- Utiliser la typographie fondée sur les rôles Material et le langage visuel Material/Pixel. Roboto est la référence actuelle de l'interface ; le contenu technique peut utiliser un rôle monospace lorsque cela est utile.
- Utiliser les rôles sémantiques de forme et d'élévation de manière cohérente. Les valeurs reprises des tokens CSS Material Web doivent être identifiées comme valeurs Web, et non présentées comme des conversions Android dp/sp.
- Utiliser Material Symbols de manière cohérente pour les icônes fonctionnelles de l'interface. Une icône qui représente une action doit avoir un nom accessible ; ne pas remplacer les contrôles standards par des emoji ou des caractères Unicode arbitraires.
- Les composants partagés doivent prendre en charge le responsive, les textes français et anglais, les interactions clavier et pointeur, un focus visible, une sémantique adaptée aux lecteurs d'écran, WCAG 2.2 AA et `prefers-reduced-motion`.

## Fondations de thème : contrat et état réel

Les fondations ne sont pas une collection de classes à recopier dans les pages. La chaîne cible est : **thème partagé → tokens et valeurs par défaut propres aux composants AndroidX → composants React/Web → compositions de pages**. Une modification d'une fondation doit se propager à tous les consommateurs qui héritent de cette valeur, sans changer les composants dont le contrat AndroidX définit une valeur distincte.

- **Formes :** `src/app/globals.css` expose l'échelle `--shape-corner-*` et des rôles de forme de composition (`--m3-card-shape`, `--m3-panel-shape`). Des migrations ciblées de consommateurs 8 px vers `--shape-corner-small`, 12 px vers `--shape-corner-medium`, de certains conteneurs 16 px vers `--shape-corner-large` et de trois surfaces 28 px vers `--shape-corner-extra-large` sont couvertes par des tests. Les éléments interactifs et les composants de composition doivent être traités selon leur rôle, pas seulement selon leur ancien rayon. L'ancienne échelle `--radius-*` subsiste : ne supprimer aucun alias avant un inventaire exhaustif des références sur la branche et une vérification des valeurs historiques (notamment 16 px et 24 px, qui ne sont pas interchangeables avec les formes M3).
- **Typographie :** les 15 rôles `display`, `headline`, `title`, `body` et `label` sont maintenant exposés comme variables et classes partagées. De nombreux composants UI et compositions de production les consomment ; la migration reste incomplète et les classes Tailwind locales doivent être auditées progressivement. La présence d'un rôle partagé ne prouve ni une parité exacte avec la version AndroidX épinglée ni une validation visuelle navigateur.
- **Valeurs de composants :** un composant consomme par défaut les tokens AndroidX qui lui sont propres. Il ne faut pas déduire la forme d'une `Card` en choisissant arbitrairement `medium`, ni forcer tous les composants à partager la même forme. Les paramètres de personnalisation doivent refléter les possibilités réelles de l'API source.
- **Provenance :** les tokens repris de Material Web, les conventions CSS de Loculary et les valeurs AndroidX doivent être identifiés séparément. Une égalité numérique ne prouve pas à elle seule l'équivalence sémantique ou comportementale.
- **Validation :** une migration n'est terminée que lorsque les usages sont inventoriés, les règles partagées testées, les cas clair/sombre et FR/EN vérifiés, et le rendu navigateur contrôlé. Un test de présence de chaîne ne suffit pas à prouver la fidélité visuelle.

**État vérifié au 29 octobre 2026 :** l'échelle des formes cohabite encore avec les anciens rayons ; les 15 rôles typographiques sont consommés par un ensemble croissant de composants, sans parité globale démontrée avec une baseline AndroidX unique. Les catégories et les 51 outils utilisent le registre `MaterialIcon` : les 58 références (outils et catégories) pointent toutes vers un symbole déclaré parmi les 68 entrées du registre. L'audit statique relève neuf symboles partagés entre plusieurs outils ; ce n'est pas en soi une erreur, mais la distinction sémantique de ces outils doit être revue avant de modifier les correspondances. Le rendu navigateur reste à vérifier. La page des parcours guidés consomme désormais le port partagé `OutlinedCard` pour ses surfaces principales et abandonne ses ombres et son halo décoratif spécifiques ; cette migration n'a pas encore été validée visuellement dans le navigateur. Le portage des composants, la migration des pages et la validation visuelle restent partiels. Voir [l'index Material 3](material3/README.md) et les spécifications individuelles.

## Mise en page et espacements

Le layout des boutons Material 3 est défini une seule fois dans `src/components/ui/material-button-layout.ts` et partagé entre `Button` et `AppLink`. La sémantique HTML, les variantes et les différences prévues par AndroidX restent propres aux consommateurs ; la géométrie commune ne doit pas être recopiée dans chaque composant.

La cible est un portage Web fidèle des API publiques pertinentes d’AndroidX Compose UI/Foundation, et non une collection de décisions d’espacement Tailwind propres à chaque page.

- Utiliser AndroidX Compose UI/Foundation comme source de vérité pour les contrats publics de `Modifier`, `Alignment`, `Arrangement`, `Column`, `Row`, `Box` et `Spacer`. Figer la version exacte de l’artefact et du snapshot d’API, puis documenter les différences Web avant de revendiquer une fidélité.
- Porter d’abord les primitives étayées par les sources, tester leurs contrats, puis migrer les compositions des pages Loculary. Conserver une seule implémentation canonique du layout ; ne pas ajouter de piles ou d’aides d’espacement parallèles qui dupliquent le comportement AndroidX.
- Centraliser les décisions de design propres à Loculary — gouttières responsives, presets de largeur, rythme entre sections et autres conventions produit — dans des tokens sémantiques. Les valeurs CSS/Tailwind qui encodent ces décisions doivent référencer les tokens plutôt que réintroduire des écarts numériques entre pages.
- **Compositions propres à Loculary :** ne pas créer de composants de présentation ou de primitives de composition spécifiques lorsque les composants AndroidX et leurs adaptations Web couvrent déjà le besoin. Remplacer les compositions existantes par les composants et patterns éprouvés correspondants, puis supprimer les implémentations Loculary devenues obsolètes après migration et vérification des usages. Une exception n'est acceptable que si aucun composant ou portage Web pertinent n'existe, ou si son emploi compromet une exigence réelle du Web, de l'accessibilité ou du produit ; elle doit rester rare, minimale et justifiée par des éléments vérifiables.
- Pour ce portage Web, adopter la convention explicite 1 `Dp` Android = 1 px CSS logique pour les dimensions numériques. Cette convention simplifie la migration mais ne garantit pas une taille physique identique; les tokens responsives restent des tokens CSS transmis par la surcharge Web documentée. Préserver, lorsque cela a du sens, les règles de mesure Compose, l’ordre des modificateurs, le sens de lecture, les arrangements et les alignements ; documenter les différences imposées par le navigateur.
- Migrer progressivement les cadres communs du site et les pages, puis les outils et formulaires intégrés lorsque le changement est sûr. Conserver les compositions spécifiques à une tâche lorsqu’elles répondent à un vrai besoin, mais faire reposer leurs espacements et contraintes sur les API/tokens partagés.
- Vérifier le responsive, l’expansion des contenus français/anglais, les thèmes clair/sombre, les espacements logiques sensibles au RTL, le clavier, les lecteurs d’écran et la réduction des animations lorsque c’est pertinent. Les tests statiques de tokens ne prouvent pas la parité du rendu.

Le portage partiel et ses lacunes actuelles sont suivis dans la [spécification des primitives de layout](material3/layout-primitives.md). Son statut ne constitue pas une affirmation de parité avec AndroidX.

## Sources et règles de fidélité

Pour chaque composant porté :

1. Utiliser le nom du composant ou de l'API publique officielle AndroidX Compose Material 3. Ne pas inventer un nom Loculary pour désigner un composant Android. Les extensions propres au produit doivent être nommées et documentées explicitement comme telles.
2. Enregistrer le dépôt amont exact, le chemin du fichier, le commit ou la version immuable, la référence de l'API publique et les recommandations officielles d'utilisation pertinentes.
3. Déduire les variantes, paramètres, valeurs par défaut, tokens, états et transitions de la source épinglée. Distinguer les faits relatifs à l'API de l'interprétation visuelle.
4. Documenter chaque adaptation Web et sa justification. Utiliser les étiquettes `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION` ou `UNVERIFIED`.
5. Vérifier tous les états et interactions applicables ; des captures d'écran seules ne prouvent pas la conformité.
6. Ne pas déclarer un composant conforme tant que des questions importantes sur la source, des comportements requis, des tests ou des différences connues restent non résolus.

## Vérification de la fidélité de l'expérience complète

La fidélité ne se limite pas à l'utilisation de composants isolés. L'écran complet doit exprimer une véritable expérience d'application Material 3 Fidelity : hiérarchie visuelle intentionnelle, surfaces et élévation cohérentes, densité maîtrisée, typographie, couleurs tonales, formes, icônes, navigation, retours d'état et motion. Une page techniquement fonctionnelle mais générique, sans finition ou incohérente avec cette direction ne satisfait pas le contrat.

La fidélité d'un composant et celle de l'expérience complète sont deux critères complémentaires. Une page peut utiliser plusieurs composants corrects tout en restant incohérente avec les conventions AndroidX/Pixel par sa hiérarchie, ses surfaces, ses espacements ou le regroupement de ses actions.

Lorsqu'un écran est concerné par un changement, examiner le parcours réel et vérifier que les composants, la hiérarchie, les surfaces, la typographie, les couleurs sémantiques, les icônes, les actions, les dialogues, les retours d'état, le responsive et l'accessibilité forment une expérience familière et cohérente. Ne pas s'arrêter au remplacement d'une icône ou d'un bouton si le reste de l'interface contredit encore le modèle éprouvé retenu.

Ne pas déduire un traitement visuel d'un simple libellé métier. En particulier, le mot « supprimer » ne prescrit pas à lui seul un bouton d'erreur rempli, un texte rouge, une icône de corbeille, un conteneur rouge ou une boîte de confirmation. Identifier le composant ou le pattern AndroidX pertinent ainsi que son contexte d'utilisation officiel. Si aucun modèle natif exact n'existe, le signaler et justifier l'adaptation Web/produit minimale nécessaire. Le fait qu'une API expose une personnalisation de couleur ne prouve pas, à lui seul, que le traitement choisi correspond à Android.

Comparer le résultat réel dans le navigateur à la référence épinglée et consigner les thèmes, locales, viewports et états vérifiés. Les tests, assertions de tokens et succès de la CI ne prouvent pas la parité visuelle. Tout rendu navigateur qui n'a pas été inspecté reste `UNVERIFIED`.

## Accessibilité et qualité

- Préserver autant que possible les sémantiques HTML natives ; traduire les sémantiques Android vers les comportements HTML/ARIA appropriés plutôt que de copier aveuglément les API de la plateforme.
- Le fonctionnement au clavier, la visibilité et la restauration du focus, les noms accessibles et les annonces d'état font partie du contrat ; ce ne sont pas des finitions facultatives.
- Respecter les préférences de réduction des animations sans supprimer les retours d'état essentiels.
- Tester le contraste réellement rendu et la réorganisation responsive dans les deux thèmes. Un token ou une assertion statique sur la source ne prouve pas l'accessibilité du rendu.
- Adapter les interfaces à la tâche de chaque outil. Les fondations partagées ne nécessitent pas des compositions de page identiques.

## État actuel de l'implémentation

Ce document décrit la cible et ne prétend pas que le site actuel y est déjà conforme. L'état et les preuves propres à chaque composant sont consignés dans [l'index de portage Material 3](material3/README.md). La migration en production constitue une étape distincte, après que chaque composant a satisfait à ses propres critères de portage.


## État actuel de la migration en production

Le système expose les quinze rôles typographiques Material 3 et les tokens de forme partagés ; de nombreux composants et parcours les consomment déjà. La migration reste partielle : un token présent ou un test statique ne prouve ni la conformité AndroidX du composant ni la fidélité du rendu.

- **Surfaces typographiques migrées :** composants partagés, navigation, cartes et résultats d’outils, pages d’information et légales, pied de page, parcours de compte et plusieurs pages d’administration. Les usages restants doivent être inventoriés par famille avant retrait des styles locaux.
- **Formes :** certains consommateurs utilisent `--shape-corner-*` et des tokens propres aux composants. L’échelle historique `--radius-*` reste utilisée en production ; ne pas la supprimer avant l’inventaire et la migration des références. Les valeurs historiques de 16 px et 24 px ne sont pas remappées mécaniquement.
- **Icônes :** les catégories et les outils utilisent le registre partagé `MaterialIcon` et les rôles `primary-container` / `on-primary-container`. L’état détaillé, la couverture et les limites de la migration figurent dans le [suivi du portage AndroidX](material3/README.md#état-actuel-de-la-migration--29-octobre-2026).
- **Vérification :** le rendu navigateur n’a pas encore été validé de façon transversale en thèmes clair/sombre, en français/anglais, sur les viewports pertinents et au clavier. Les tests et la CI restent nécessaires, mais ne remplacent pas cette comparaison.

## Règle obligatoire de migration cible-first

AndroidX Jetpack Compose Material 3 **Fidelity** est la cible, pas un habillage de l’interface historique. Rien n’est conservé uniquement parce que cela existe déjà ou réduit le diff. Choisir une migration ciblée ou une refonte complète selon la solution qui produit l’expérience la plus cohérente, familière, accessible et maintenable.

- **Contrats et conventions :** AndroidX fait autorité pour les composants et comportements qu’il définit. Pour les parcours et compositions non spécifiés, privilégier les conventions éprouvées des applications grand public de qualité après analyse de références pertinentes ; ne pas copier une application entière ni inventer une convention sans bénéfice utilisateur.
- **Icônes d’interface :** remplacer les emoji et caractères Unicode utilisés comme pictogrammes fonctionnels de navigation, catégorie, outil, action, état ou commande par des Material Symbols pertinents via le registre partagé. Vérifier le sens, la taille, l’alignement, le poids, les rôles de couleur et le nom accessible.
- **Contenu et illustrations :** un emoji éditorial, une entrée utilisateur ou un résultat d’outil n’est pas automatiquement une icône d’interface. Évaluer aussi les illustrations décoratives ; aucune catégorie de contenu ne bénéficie d’une exemption automatique.
- **Exceptions Web :** lorsqu’aucun équivalent pertinent n’existe ou que la parité native nuit à la sémantique Web, à l’accessibilité ou au besoin produit, consigner les sources, limites, options et compromis. Discuter les exceptions substantielles avant adoption.
- **Retrait :** migrer les consommateurs puis supprimer les classes, tokens, wrappers et composants concurrents devenus inutiles après vérification des références, tests et usages dynamiques. Ne pas faire de conversions numériques mécaniques.
- **Preuve :** documenter les sources AndroidX immuables, les adaptations Web, les tests et les écarts. Une API nommée, un token partagé ou une CI verte ne prouve pas la fidélité du rendu ; toute validation navigateur non réalisée reste explicitement ouverte.

Cette règle couvre les fondations, primitives, composants, catalogue, Design Lab et pages de production. Les interfaces doivent s'appuyer sur les composants AndroidX et leurs adaptations Web, ainsi que sur les patterns d'interface éprouvés qu'ils définissent. Ne conserver une implémentation propre à Loculary qu'en l'absence démontrée d'une solution adaptée ; documenter alors précisément la limite, la nécessité et le périmètre de cette exception. Après remplacement, supprimer les composants, wrappers, styles et tokens devenus inutiles.
