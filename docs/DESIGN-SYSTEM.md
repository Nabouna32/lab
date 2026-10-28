# Loculary — Design system

**Direction:** Material 3 Fidelity, with current Pixel / Android UI as visual reference.  
**Decision:** [DEC-026](DECISIONS.md#dec-026--material-3-fidelity-and-pixel-inspired-interface).  
**Status:** target contract; production-wide conformance is not yet established.

## Purpose and authority

This document owns shared design foundations and cross-component rules. AndroidX Jetpack Compose Material 3 is the primary source for component contracts; official Android Developers guidance supplies usage context. Sources must be pinned to a version or commit for each component port. Material Web and other React libraries are comparisons only, never substitute authorities.

The target is a faithful React/Web port of AndroidX Compose Material 3 components—not merely a visual imitation. Each component has a separate specification under [`material3/components/`](material3/README.md). A component must not be called source-faithful until its API, states, behavior, rendering and differences have been checked against its pinned source.

**Target-first, not legacy-first:** existing Loculary components, CSS, layouts and page compositions are migration input, not constraints. A component that shares an AndroidX name is not automatically faithful; improve or replace it against the pinned AndroidX contract. When a page would benefit from a more coherent modern app structure, a full redesign is explicitly allowed and often preferred over patching the current layout. The product ambition is a AAA-level consumer application: familiar, polished, dependable and robust enough for a large audience; this is a quality target, not a claim about current scale or conformance.

Keep two authorities distinct. **AndroidX is authoritative for the contracts it defines.** For product flows and composition choices not specified by AndroidX, use established conventions from successful consumer apps—such as clear account/settings flows, predictable navigation, familiar iconography, accessible form validation, and consistent loading, empty, error and success states. Compare credible references and test the pattern against Loculary's task rather than copying a product wholesale or inventing novelty without user value. No external pattern overrides Web semantics, accessibility, privacy or performance. Avoid preserving legacy APIs or styles solely to minimize the diff. Choose a focused fix or a broader refactor based on which produces the clearest, maintainable result.

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


## État actuel de la migration en production

Le système expose les quinze rôles typographiques Material 3 et les tokens de forme partagés ; de nombreux composants et parcours les consomment déjà. La migration reste partielle : un token présent ou un test statique ne prouve ni la conformité AndroidX du composant ni la fidélité du rendu.

- **Surfaces typographiques migrées :** composants partagés, navigation, cartes et résultats d’outils, pages d’information et légales, pied de page, parcours de compte et plusieurs pages d’administration. Les usages restants doivent être inventoriés par famille avant retrait des styles locaux.
- **Formes :** certains consommateurs utilisent `--shape-corner-*` et des tokens propres aux composants. L’échelle historique `--radius-*` reste utilisée en production ; ne pas la supprimer avant l’inventaire et la migration des références. Les valeurs historiques de 16 px et 24 px ne sont pas remappées mécaniquement.
- **Icônes :** les sept catégories, les cartes et les en-têtes des 51 outils utilisent `MaterialIcon` et des noms typés. Les icônes des parcours guidés utilisent les rôles `primary-container` et `on-primary-container`. Le registre ne contient pas encore un symbole dédié à chaque outil : la pertinence sémantique de certains choix et le rendu navigateur restent à vérifier.
- **Vérification :** le rendu navigateur n’a pas encore été validé de façon transversale en thèmes clair/sombre, en français/anglais, sur les viewports pertinents et au clavier. Les tests et la CI restent nécessaires, mais ne remplacent pas cette comparaison.

## Règle obligatoire de migration cible-first

AndroidX Jetpack Compose Material 3 **Fidelity** est la cible, pas un habillage de l’interface historique. Rien n’est conservé uniquement parce que cela existe déjà ou réduit le diff. Choisir une migration ciblée ou une refonte complète selon la solution qui produit l’expérience la plus cohérente, familière, accessible et maintenable.

- **Contrats et conventions :** AndroidX fait autorité pour les composants et comportements qu’il définit. Pour les parcours et compositions non spécifiés, privilégier les conventions éprouvées des applications grand public de qualité après analyse de références pertinentes ; ne pas copier une application entière ni inventer une convention sans bénéfice utilisateur.
- **Icônes d’interface :** remplacer les emoji et caractères Unicode utilisés comme pictogrammes fonctionnels de navigation, catégorie, outil, action, état ou commande par des Material Symbols pertinents via le registre partagé. Vérifier le sens, la taille, l’alignement, le poids, les rôles de couleur et le nom accessible.
- **Contenu et illustrations :** un emoji éditorial, une entrée utilisateur ou un résultat d’outil n’est pas automatiquement une icône d’interface. Évaluer aussi les illustrations décoratives ; aucune catégorie de contenu ne bénéficie d’une exemption automatique.
- **Exceptions Web :** lorsqu’aucun équivalent pertinent n’existe ou que la parité native nuit à la sémantique Web, à l’accessibilité ou au besoin produit, consigner les sources, limites, options et compromis. Discuter les exceptions substantielles avant adoption.
- **Retrait :** migrer les consommateurs puis supprimer les classes, tokens, wrappers et composants concurrents devenus inutiles après vérification des références, tests et usages dynamiques. Ne pas faire de conversions numériques mécaniques.
- **Preuve :** documenter les sources AndroidX immuables, les adaptations Web, les tests et les écarts. Une API nommée, un token partagé ou une CI verte ne prouve pas la fidélité du rendu ; toute validation navigateur non réalisée reste explicitement ouverte.

Cette règle couvre les fondations, primitives, composants, compositions, catalogue, Design Lab et pages de production. Chaque usage doit être porté par un composant AndroidX vérifié, justifié comme composition Loculary, documenté comme adaptation Web ou approuvé comme exception.
