# Loculary — Design system

**Direction:** Material 3 Fidelity, with current Pixel / Android UI as visual reference.  
**Decision:** [DEC-026](DECISIONS.md#dec-026--material-3-fidelity-and-pixel-inspired-interface).  
**Status:** target contract; production-wide conformance is not yet established.

## Purpose and authority

This document owns shared design foundations and cross-component rules. AndroidX Jetpack Compose Material 3 is the primary source for component contracts; official Android Developers guidance supplies usage context. Sources must be pinned to a version or commit for each component port. Material Web and other React libraries are comparisons only, never substitute authorities.

The target is a faithful React/Web port of AndroidX Compose Material 3 components—not merely a visual imitation. Each component has a separate specification under [`material3/components/`](material3/README.md). A component must not be called source-faithful until its API, states, behavior, rendering and differences have been checked against its pinned source.

**Target-first, not legacy-first:** existing Loculary components, CSS, layouts and page compositions are migration input, not constraints. A component that shares an AndroidX name is not automatically faithful; improve or replace it against the pinned AndroidX contract. When a page would benefit from a more coherent modern app structure, a full redesign is explicitly allowed and often preferred over patching the current layout. Product references such as ChatGPT for Android and other polished mainstream apps can inform familiar UX conventions and icon choices, but do not override AndroidX component specifications or Web accessibility semantics. Avoid preserving legacy APIs or styles solely to minimize the diff. Choose a focused fix or a broader refactor based on which produces the clearest, maintainable result.

## Foundations

- Use Material Color Utilities **Fidelity** for seed-derived semantic color roles, with the current seed documented in implementation; the seed is not a literal color to apply everywhere.
- Use MCU Rainbow only for category identity, not as a second semantic theme.
- Use semantic roles and matching `on-*` foregrounds. Never hard-code palette colors into shared components when a semantic role exists.
- Light and dark themes must implement the same role contract. Verify computed colors and contrast, including disabled, focus, border and overlay states.
- Use Material role-based typography and the Material/Pixel visual language. Roboto is the current interface reference; technical content may use a monospace role where useful.
- Use semantic shape and elevation roles consistently. Values copied from Material Web CSS tokens must be labelled as Web values, not represented as Android dp/sp conversions.
- Use Material Symbols consistently for functional interface icons. Icons need accessible names when they convey an action; do not substitute emoji or arbitrary Unicode for standard controls.
- Shared components must support responsive layout, French and English text, keyboard and pointer input, visible focus, appropriate screen-reader semantics, WCAG 2.2 AA, and `prefers-reduced-motion`.

## Fondations de thème : contrat et état réel

Les fondations ne sont pas une collection de classes à recopier dans les pages. La chaîne cible est : **thème partagé → tokens et valeurs par défaut propres aux composants AndroidX → composants React/Web → compositions de pages**. Une modification d'une fondation doit se propager à tous les consommateurs qui héritent de cette valeur, sans changer les composants dont le contrat AndroidX définit une valeur distincte.

- **Formes :** `src/app/globals.css` expose l'échelle `--shape-corner-*` et des rôles de forme de composition (`--m3-card-shape`, `--m3-panel-shape`). Des migrations ciblées de consommateurs 8 px vers `--shape-corner-small`, 12 px vers `--shape-corner-medium`, de certains conteneurs 16 px vers `--shape-corner-large` et de trois surfaces 28 px vers `--shape-corner-extra-large` sont couvertes par des tests. Les éléments interactifs et les composants de composition doivent être traités selon leur rôle, pas seulement selon leur ancien rayon. L'ancienne échelle `--radius-*` subsiste : ne supprimer aucun alias avant un inventaire exhaustif des références sur la branche et une vérification des valeurs historiques (notamment 16 px et 24 px, qui ne sont pas interchangeables avec les formes M3).
- **Typographie :** les 15 rôles `display`, `headline`, `title`, `body` et `label` sont maintenant exposés comme variables et classes partagées. De nombreux composants UI et compositions de production les consomment ; la migration reste incomplète et les classes Tailwind locales doivent être auditées progressivement. La présence d'un rôle partagé ne prouve ni une parité exacte avec la version AndroidX épinglée ni une validation visuelle navigateur.
- **Valeurs de composants :** un composant consomme par défaut les tokens AndroidX qui lui sont propres. Il ne faut pas déduire la forme d'une `Card` en choisissant arbitrairement `medium`, ni forcer tous les composants à partager la même forme. Les paramètres de personnalisation doivent refléter les possibilités réelles de l'API source.
- **Provenance :** les tokens repris de Material Web, les conventions CSS de Loculary et les valeurs AndroidX doivent être identifiés séparément. Une égalité numérique ne prouve pas à elle seule l'équivalence sémantique ou comportementale.
- **Validation :** une migration n'est terminée que lorsque les usages sont inventoriés, les règles partagées testées, les cas clair/sombre et FR/EN vérifiés, et le rendu navigateur contrôlé. Un test de présence de chaîne ne suffit pas à prouver la fidélité visuelle.

**État vérifié au 27 octobre 2026 :** l'échelle des formes cohabite encore avec les anciens rayons ; les 15 rôles typographiques existent dans `globals.css` et sont consommés par un ensemble croissant de composants, mais leurs métriques et chaque consommateur ne sont pas encore tous validés contre une baseline AndroidX unique. Le portage des composants, la migration des pages et la validation visuelle restent partiels. Voir [la spécification des fondations et composants Material 3](material3/README.md) et les spécifications individuelles.

## Mise en page et espacements

La cible est un portage Web fidèle des API publiques pertinentes d’AndroidX Compose UI/Foundation, et non une collection de décisions d’espacement Tailwind propres à chaque page.

- Utiliser AndroidX Compose UI/Foundation comme source de vérité pour les contrats publics de `Modifier`, `Alignment`, `Arrangement`, `Column`, `Row`, `Box` et `Spacer`. Figer la version exacte de l’artefact et du snapshot d’API, puis documenter les différences Web avant de revendiquer une fidélité.
- Porter d’abord les primitives étayées par les sources, tester leurs contrats, puis migrer les compositions des pages Loculary. Conserver une seule implémentation canonique du layout ; ne pas ajouter de piles ou d’aides d’espacement parallèles qui dupliquent le comportement AndroidX.
- Centraliser les décisions de design propres à Loculary — gouttières responsives, presets de largeur, rythme entre sections et autres conventions produit — dans des tokens sémantiques. Les valeurs CSS/Tailwind qui encodent ces décisions doivent référencer les tokens plutôt que réintroduire des écarts numériques entre pages.
- Une composition produit telle que `PageContainer` est légitime uniquement si elle exprime une véritable convention Loculary. Ce n’est pas une API AndroidX et elle doit rester remplaçable : l’implémenter au-dessus des primitives partagées lorsque c’est pertinent, et la supprimer si elle ne fait que dupliquer leur comportement.
- Pour ce portage Web, adopter la convention explicite 1 `Dp` Android = 1 px CSS logique pour les dimensions numériques. Cette convention simplifie la migration mais ne garantit pas une taille physique identique; les tokens responsives restent des tokens CSS transmis par la surcharge Web documentée. Préserver, lorsque cela a du sens, les règles de mesure Compose, l’ordre des modificateurs, le sens de lecture, les arrangements et les alignements ; documenter les différences imposées par le navigateur.
- Migrer progressivement les cadres communs du site et les pages, puis les outils et formulaires intégrés lorsque le changement est sûr. Conserver les compositions spécifiques à une tâche lorsqu’elles répondent à un vrai besoin, mais faire reposer leurs espacements et contraintes sur les API/tokens partagés.
- Vérifier le responsive, l’expansion des contenus français/anglais, les thèmes clair/sombre, les espacements logiques sensibles au RTL, le clavier, les lecteurs d’écran et la réduction des animations lorsque c’est pertinent. Les tests statiques de tokens ne prouvent pas la parité du rendu.

Le portage partiel et ses lacunes actuelles sont suivis dans la [spécification des primitives de layout](material3/layout-primitives.md). Son statut ne constitue pas une affirmation de parité avec AndroidX.

## Source and fidelity rules

For every ported component:

1. Name it after the official public AndroidX Compose Material 3 component/API. Do not invent Loculary-only names for an Android component. Product-specific extensions must be explicitly named and documented as extensions.
2. Record the exact upstream repository, file path, immutable commit or release, public API reference, and relevant official usage guidance.
3. Derive variants, parameters, defaults, tokens, states and transitions from the pinned source. Distinguish API facts from visual interpretation.
4. Record every Web adaptation and why it is needed. Label it `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION`, or `UNVERIFIED`.
5. Verify all applicable states and interactions; screenshots alone are not proof of conformance.
6. Do not mark a component conformant while material source questions, required behavior, tests or known differences remain unresolved.

## Whole-screen fidelity gate

Component-level fidelity and page-level fidelity are separate acceptance criteria. A page can use several correct components and still fail because its hierarchy, surfaces, spacing or action grouping diverge from the source-backed target.

When a screen is in scope, review the complete user journey and composition: layout, hierarchy, surfaces, spacing, typography, semantic colors, icons, action groups, dialogs, feedback states, responsive behavior and accessibility. Do not stop at adding an icon or replacing one button while leaving the surrounding page inconsistent.

Do not infer a visual treatment from a business label. In particular, “delete” alone does not prescribe a filled error button, red text, a trash icon, a red container or a confirmation dialog. Identify the relevant AndroidX component/pattern and official usage context. If no exact native pattern exists, state that and justify the smallest necessary Web/product adaptation. A color customization exposed by an API is not, by itself, proof that the selected treatment matches Android.

Compare the actual browser result with the pinned reference and record the themes, locales, viewports and states checked. Tests, token assertions and successful CI are not proof of visual parity. Uninspected browser output remains UNVERIFIED.

## Accessibility and quality

- Preserve native HTML semantics where possible; map Android semantics to appropriate HTML/ARIA behavior rather than copying platform APIs blindly.
- Keyboard operation, focus visibility/restoration, accessible names and state announcements are part of the contract, not optional polish.
- Respect reduced-motion preferences without removing essential state feedback.
- Test actual rendered contrast and responsive reflow in both themes. A token or static source assertion does not prove rendered accessibility.
- Keep task-specific tool layouts diverse where needed; shared design foundations do not require identical page compositions.

## Current implementation status

This document describes the target, not a claim that the current site conforms. Component-specific status and evidence belong in [the Material 3 porting index](material3/README.md). The production migration is a separate step after each component passes its own porting gate.


## Migration en cours : rôles typographiques partagés

La feuille globale expose désormais les 15 rôles typographiques Material 3 sous forme de tokens CSS et de classes `.m3-type-*`. La première tranche les utilise dans le bouton partagé, le bloc Parcours guidés, les cartes d'outils et l'en-tête des pages outil. Cette migration est volontairement partielle : il reste à inventorier et migrer les usages par familles de composants avant de supprimer les conventions historiques.

Les formes sont désormais configurées via des tokens propres à certains composants (`--m3-card-shape`, `--m3-panel-shape`) plutôt que directement par la composition. Leur valeur actuelle reprend encore le token medium ; elle reste à vérifier contre la source AndroidX de la release retenue. L'existence d'un token partagé ne constitue pas à elle seule une preuve de fidélité.

La migration de la typographie partagée couvre également les styles de `ListItem`, `Chip`, `Badge`, `SearchBar` et `MaterialTextField`, ainsi que les libellés et textes d'aide de `TextField`, `TextArea` et `Select`. Les contrôles conservent des états et dimensions propres à leur contrat ; seuls les métriques typographiques communes sont centralisées ici. Les autres composants et consommateurs doivent encore être audités.

La tranche suivante étend les rôles typographiques partagés à `AlertDialog`, `DatePickerDialog`, `DropdownMenu`, `ExposedDropdownMenu`, `NavigationBar`, `NavigationDrawer`, `NavigationRail`, `RadioButton`, `Snackbar`, `Tabs`, `TimePicker`, `ToggleButton`, `Tooltip` et `TopAppBar`. Les choix de style qui ne correspondent pas clairement à un rôle officiel — par exemple l’affichage numérique du cadran d’horloge — restent distincts tant que la source AndroidX ne justifie pas leur remplacement. Un test de contrat vérifie que ces composants consomment les tokens partagés.


La troisième tranche étend la centralisation aux composants `BottomSheetScaffold`, `ButtonGroup`, `DatePicker`, `FloatingActionButton`, `FloatingActionButtonMenu`, `FloatingToolbar`, `ModalBottomSheet`, `PullToRefreshBox`, `RangeSlider`, `SegmentedButtonGroup`, `SplitButton`, `SwipeToDismissBox`, `WideNavigationRail` et `Slider`. Les métriques des nombres/commandes qui jouent le rôle d’icônes ou de valeurs numériques particulières restent séparées lorsqu’un rôle typographique M3 équivalent n’est pas établi. Les tests de contrat couvrent désormais aussi ces composants.


La migration des consommateurs de production s'étend à `AppLink`, `ResultPanel`, `RecentTools`, `RelatedTools`, `ToolCard` et `ValidationMessage`. Les liens visuellement assimilés à des boutons utilisent désormais le rôle `label-large` partagé, les contenus de résultat et d'aide utilisent des rôles nommés, et les formes de cartes/tuile traitées consomment des tokens de forme dédiés. Les tests vérifient ces contrats pour éviter une régression vers des classes Tailwind indépendantes.


La migration des formes partagées progresse aussi dans les compositions de date, navigation et outils : `DatePicker`, `AppLink`, `RecentTools`, `RelatedTools`, `ToolCard`, `UrlParser`, `JwtDecoder`, `HashGenerator`, `EditorialPrimitives`, `JsonDiffChecker`, `CronExpression` et `ColorConverter` utilisent désormais les tokens de forme partagés pour les éléments migrés. Cette étape ne permet pas encore de supprimer `--radius-md` globalement : d'autres consommateurs restent à migrer et les rayons historiques de 24 px/16 px ne sont pas équivalents à toutes les formes AndroidX.

## Migration de production et retrait de l’existant — 28 octobre 2026

La migration ne porte pas uniquement sur l’API des composants : les pages et compositions existantes doivent consommer les fondations partagées au fil de l’implémentation. La tranche de la PR #1020 étend les rôles typographiques partagés aux pages d’information, au pied de page, aux parcours de compte (connexion, inscription, e-mail, mots de passe et suppression) et aux pages d’administration (tableau de bord, audit et utilisateurs). Plusieurs formulaires utilisent aussi les primitives Compose Web `Column` et `Arrangement.spacedBy` pour leur espacement vertical.

Cette liste indique des migrations de source, pas une validation de rendu. Les états clair/sombre, les tailles d’écran, le clavier, les technologies d’assistance et les textes français/anglais doivent rester dans la grille de vérification.

**Le retrait de l’existant fait partie de la migration.** Après chaque famille migrée, rechercher les références résiduelles et supprimer les styles, composants, helpers, tokens, tests ou wrappers qui ne servent plus. Si un ancien élément a encore des consommateurs, migrer ceux-ci ou justifier explicitement son maintien. Ne pas conserver une abstraction simplement parce qu’elle est ancienne ou utilisée par un test de contrat obsolète.

L’échelle historique `--radius-*` est encore utilisée dans les outils de production : elle ne doit donc pas être supprimée à ce stade. Continuer l’inventaire et la migration par rôle, sans confondre mécaniquement les rayons historiques de 16 px/24 px avec des tokens Material 3. La suppression ne sera justifiée qu’après une recherche exhaustive et une vérification des tests et usages dynamiques.


## Migration des rôles de thème dans les compositions — 28 octobre 2026

Une tranche de migration corrige deux écarts concrets entre les fondations partagées et leurs consommateurs de production :

- Les icônes des pages de catégorie utilisent désormais le rôle de premier plan `category-*-on-container` avec leur `category-*-container`, au lieu d'utiliser la couleur `category-*` directement sur le conteneur. Les couleurs de premier plan et de fond forment une paire sémantique et sont générées séparément pour les thèmes clair et sombre par Material Color Utilities.
- Les icônes des parcours guidés associent `on-primary-container` à `primary-container`. Les titres, descriptions, métadonnées et étapes de ces pages consomment les rôles typographiques partagés au lieu de combinaisons locales telles que `text-4xl font-black` et des espacements de lettres arbitraires.

Des tests de contrat vérifient ces paires de rôles et empêchent le retour des styles typographiques locaux ciblés. Cette tranche ne constitue pas une migration complète du site : les alias historiques, les usages Tailwind et les autres compositions doivent encore être inventoriés par famille. Les outils qui affichent volontairement des couleurs utilisateur ou des échantillons de palette ne doivent pas être normalisés mécaniquement. La validation visuelle dans le navigateur, en thèmes clair et sombre et en français et anglais, reste à effectuer.
