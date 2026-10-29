# AndroidX Material 3 → React porting project

**Reference implementation:** AndroidX Jetpack Compose Material 3.  
**Product direction:** Material 3 Fidelity, not Material 3 Expressive.  
**Project status:** early; Button work exists, but the overall inventory, porting and production migration are incomplete.

## Target architecture and migration rule

The existing Loculary UI library is **migration input, not the target API design**. Existing implementation counts, component names, catalogue rows, and preview keys do not define the desired Android-compatible library. This also applies to production pages and their compositions: current layouts are not immutable, and redesigns may be broad when that is what it takes to deliver a coherent modern Android-app experience on the Web. Do not limit work to superficial styling or small patches merely to preserve the existing structure.

The product target is a polished, AAA-level consumer experience: familiar, dependable, responsive and robust for a potentially large audience. This describes the quality bar, not current scale or achieved conformance. AndroidX is the source of truth for contracts it defines. For product flows and compositions beyond those contracts, use established conventions from successful consumer apps—predictable navigation, clear account/settings flows, recognizable icons, accessible forms and consistent loading, empty, error and success states. Research credible references and choose what best serves Loculary; do not copy one app wholesale or invent a custom convention without a user-centered reason. Web semantics, accessibility, privacy and performance remain mandatory.

The target is to build the relevant official AndroidX Compose UI component and primitive families as a coherent React/Web library first, with AndroidX public names and source-derived contracts wherever an equivalent is meaningful. Then migrate the product's shared UI and tool pages to that library so Loculary can behave like a cohesive app. This is not a requirement to mechanically port every low-level runtime/compiler API into React: inventory the declared public API surface exhaustively, classify each declaration by role and Web-port relevance, and document why a declaration is not a visual/component port when appropriate.

For every existing Loculary UI implementation, the eventual disposition must be explicit:
- **replace** with a source-backed AndroidX-named port;
- **remove** because it duplicates an official API or has no justified product role;
- **retain as a clearly named product composition/extension** only when it solves a real Loculary product need and is built from the shared official ports;
- **adapt for Web** when browser semantics require a documented difference.

Do not retain a custom base component merely because it already exists or is referenced by a preview. Conversely, a page layout or product composition is not automatically invalid just because it is Loculary-specific; it must not masquerade as an official Android component. The catalogue and specs should record the decision and production call sites before a migration is considered complete.

The Design Lab and its persistence model are also under review. The default proposal is to make the source-controlled catalogue/specs, React implementations, demos and automated checks in Git the authoritative workflow. Supabase tables for manually submitted reports, decisions, verifications and audit events are not assumed necessary; evaluate them against actual usage and remove them through a separately reviewed migration if they add no value. Do not modify live schema/data merely to simplify the design lab without a specific migration plan.

## Shared theme foundations

Before broad production migration, the Web port must expose a single source of truth for theme foundations and make component defaults consume it. The intended dependency is:

1. **Theme foundations:** semantic color roles, Material 3 typography roles, shape scale, elevation and motion values.
2. **Component contracts:** source-derived defaults and explicit parameters for each AndroidX component (for example, a Card's own default shape rather than a page-selected generic radius).
3. **React/Web ports:** shared implementations preserving the source API where meaningful and documenting browser adaptations.
4. **Product compositions and routes:** consume the ports and product-level layout tokens; avoid local typography/shape decisions where a shared contract applies.

A shared token existing in CSS is not enough: audit its consumers and legacy aliases. Changing a foundation must update all inheriting consumers. Component-specific defaults and explicit overrides remain where AndroidX defines or permits them. Typography must use named roles instead of repeated Tailwind font-size/weight/line-height combinations.

Implementation is in active migration: all 15 Material 3 typography roles are exposed as shared variables/classes and are consumed by many UI components and production compositions. Targeted migrations of 8px consumers to `--shape-corner-small`, 12px consumers from the legacy `--radius-md` alias to `--shape-corner-medium`, selected 16px containers to `--shape-corner-large`, and three 28px surfaces to `--shape-corner-extra-large` are covered by contract tests. Migrations remain role-based; the old radius scale is not globally aliased or removed. The `--radius-*` scale still exists pending a complete reference audit; historical 16px and 24px values must not be mechanically remapped. Shape token presence and passing contract tests do not establish exact AndroidX source parity or browser-verified visual fidelity.

## Goal

Build React/Web equivalents of official AndroidX Compose Material 3 components with the highest practical fidelity to their public contracts, visual tokens, states and interactions. Then replace Loculary's current shared UI components with these ports in production routes and tools.

This is not a project to invent components that merely look Material-like. Every claim about Android behavior or appearance must be grounded in a pinned upstream source. Where Android and Web differ, document the adaptation instead of claiming identical implementation.

## Source hierarchy

1. **Primary contract:** AndroidX source code pinned to an immutable commit/release.
2. **Public API:** official AndroidX API reference for the same component.
3. **Usage and design guidance:** official Android Developers / Material 3 documentation.
4. **Secondary comparison only:** Material Web, MDUI, MUI, screenshots or other implementations. They can inform Web trade-offs but cannot override AndroidX without an explicit decision.

Each component specification must contain exact source links and the commit/release used. Do not rely on a mutable `main` link alone. Check source/API alignment before carrying a contract forward to a new AndroidX version.

The source provenance and version-pinning rules live in [`sources.md`](sources.md). The separate Compose UI/Foundation layout-port scope and current gaps are tracked in [`layout-primitives.md`](layout-primitives.md); these primitives are not Material 3 components. The catalogue schema and coverage-state rules live in [`catalog/README.md`](catalog/README.md). Use [`components/TEMPLATE.md`](components/TEMPLATE.md) for consistent component specifications. These documents distinguish the exhaustive public API inventory from semantic review, React porting, verification, and production migration.

## Usage contract for product pages and agents

Before implementing a page or interaction, inspect this catalogue and the relevant component specification. Use the shared port whenever its semantics fit; do not create page-local lookalikes or aliases for official variants.

- **Official port available:** use the official AndroidX-named API and its documented states/parameters.
- **Port exists but is not verified:** reuse it only with awareness of the documented gaps; do not claim full parity or spread unverified behavior as a new convention.
- **No suitable port:** check the pinned AndroidX catalogue and real product need first. Prefer a coherent port over a one-off imitation; explicitly label unavoidable Web adaptations or product extensions.
- **Navigation:** keep navigation as a real link. Styling a link like a Material action is a Web adaptation, not a reason to render a button as an anchor or vice versa.
- **Action hierarchy:** filled buttons are for the highest-emphasis action in a local group; tonal/elevated variants are context-dependent alternatives; outlined and text buttons suit lower-emphasis actions. Pick based on hierarchy, not visual variety.
- **Destructive actions:** reserve error colors for actual destructive consequences. Reversible removal/detachment is usually neutral; secondary destructive actions may use an error-colored icon and text/outlined treatment; irreversible actions need clear consequence copy and explicit confirmation. A filled error action belongs at the final, high-emphasis confirmation step when appropriate.
- **Tests and review:** check new and migrated call sites, not just component exports. Add targeted tests for stable API/semantic contracts; do not create brittle tests that force unrelated pages into one markup shape.

## Mandatory decision gate: source fidelity and whole-screen design

The rules below clarify and override any generic styling suggestions in this document. The target is the closest practical implementation of the actual AndroidX Compose Material 3 reference, not an interpretation of what looks Material-like.

1. Identify the exact AndroidX component or usage pattern and inspect the pinned source, public API, tokens and official contextual examples before selecting a visual treatment. Do not infer design from the business meaning or from a screenshot alone.
2. Do not invent a DeleteButton, DangerButton, generic destructive recipe, or an arbitrary red treatment. A delete action does not automatically imply a filled error button, red label, trash icon, red surface or confirmation dialog. Apply only what the relevant source and task context support. If no exact AndroidX pattern exists, say so and justify the smallest necessary Web/product adaptation.
3. Reuse official names and variants. API-supported color customization is a capability, not evidence that a chosen color treatment matches Android. Label and justify every divergence.
4. When the task targets a page, review and refactor the whole affected journey: layout hierarchy, surfaces, spacing, typography, semantic colors, icons, action grouping, dialogs, empty/loading/error/success states, responsive layout, keyboard/focus and assistive technology. Do not call a local button change a page refactor.
5. Validate the actual browser rendering against the pinned source in light/dark themes, French/English and relevant viewports. Unit tests, static CSS assertions and green CI do not establish visual fidelity. If browser comparison was not performed, report that explicitly and leave the status unverified.

## Component specification and evidence

Each component gets one file in [`components/`](components/). Minimum sections:

- Official AndroidX component name and public API/package.
- Pinned source files and version/commit; official API and usage references.
- Source-derived API, defaults, variants, tokens, layout, states and interaction transitions.
- React implementation path and existing Loculary call sites, verified from code.
- Explicit differences: `ANDROIDX`, `WEB-ADAPTATION`, `LOCULARY-EXTENSION`, or `UNVERIFIED`.
- Automated tests for API/state/behavior where practical.
- Browser verification in light/dark themes, FR/EN, relevant viewport sizes, keyboard and assistive technology.
- Remaining gaps and the evidence needed to close them.
- Migration status and a list or verifiable inventory of production call sites replaced.

Do not infer undocumented behavior. If the source does not establish a detail, mark it unverified and investigate rather than inventing a default.

## Lifecycle

Use these distinct statuses:

1. **À inventorier** — candidate identified, scope and existing usage not yet audited.
2. **Sources vérifiées** — public API and pinned upstream sources reviewed.
3. **Portage en cours** — React implementation is being built.
4. **Portage vérifié** — contract, applicable states, tests and browser behavior checked; differences documented.
5. **Migration en cours** — production usages are being replaced.
6. **Migré** — intended production call sites use the port and obsolete implementations are removed where safe.

A port may be verified before it is migrated. A component being used in production does not prove its conformance. Visual similarity alone never qualifies as verification.

## Delivery workflow

Work in small, reviewable component or coherent component-family slices so the work can span multiple conversations without losing the evidence trail:

1. Select a component based on official catalogue coverage and real Loculary usage.
2. Inspect AndroidX source and API, pin exact versions, and write the contract before implementation.
3. Audit the existing React implementation and call sites; decide whether to adapt or replace it.
4. Port behavior and visuals, retaining Web-native semantics where appropriate.
5. Add source-contract and behavior tests; run lint, typecheck, unit tests and build.
6. Inspect real browser rendering and interactions; record actual deviations.
7. Migrate production call sites and verify affected journeys.
8. Update only this component's status and create/follow a focused issue for unresolved work.

Avoid one issue or conversation per tiny observation. Use one focused issue per component or coherent family, and keep evidence in the component spec and code/tests. Close issues only when their acceptance criteria are proven.

## Initial component queue

The inventory is intentionally **not yet declared complete**. The existing historical inventory contains candidate families, but each must be checked against the current official AndroidX catalogue and Loculary code before priorities or coverage are claimed.

- **Existing port work to verify:** Button, IconButton.
- **Candidates to inventory against real usage:** Checkbox, Switch, SegmentedButton, TextField, Select/dropdown, Card, progress indicators, Snackbar, Dialog, Tooltip, chips, navigation components, menus, sliders and date/time components.
- **Inventory exhaustiveness is mandatory:** catalogue every public API in the declared artifact/version scope, including APIs not currently used by Loculary and experimental APIs. Inventory presence does not imply an implementation commitment.
- **Implementation priority is separate:** prioritize ports according to product need, reuse, risk, and maintenance value. An inventoried API may remain unimplemented, with that status explicit.

## Shared Compose UI/Foundation layout port

Les primitives de layout sont suivies séparément des composants Material 3, car `Column`, `Row`, `Box`, `Spacer`, `Modifier`, `Alignment` et `Arrangement` appartiennent à Compose UI/Foundation, et non à Material 3. Consulter la [spécification des primitives de layout](layout-primitives.md) pour les sources, les règles de centralisation des tokens, les extensions Web actuelles et les écarts de parité.

## Current status

| Component | Spec | Port status | Production migration |
|---|---|---|---|
| Button | [Button](components/Button.md) | Five AndroidX-named React exports; source snapshot pinned; disabled-state token roles corrected; shared variant styles now drive native buttons and button-styled links; remaining token and browser verification open | Generic action call sites migrated; account-only action-link wrapper removed; footer and account navigation use shared Button appearances while preserving anchors; broader site audit and browser verification remain open |
| Web link adaptation | [Link](components/Link.md) | `AppLink` keeps Next.js anchor semantics and shares the five Button visual variants and the shared reduced-motion-aware ripple; navigation/inline styles remain contextual Web patterns | Footer and account action links migrated; header navigation retained as a navigation link; full-site usage audit remains open |
| ListItem | [ListItem](components/ListItem.md) | Existing adaptation; standard one/two/three-line composition is being aligned to AndroidX 1.4.0 | Interactive overloads and browser parity remain unverified |
| IconButton | [IconButton](components/IconButton.md) | Existing implementation; full source-contract and browser verification still required | Not established by this index |
| Other components | Not yet audited | À inventorier | À inventorier |

NavigationBar browser validation is tracked in [issue #977](https://github.com/Nabouna32/lab/issues/977). This does not assert that the component is already source-faithful.


## État actuel de la migration — 29 octobre 2026

Le portage et la migration de production restent partiels. Les quinze rôles typographiques Material 3 sont exposés et consommés par de nombreux composants et parcours. Les tokens de forme dédiés existent pour certaines compositions, mais les valeurs par défaut doivent encore être vérifiées contre les sources AndroidX épinglées.

- **Typographie et compositions :** les migrations couvrent notamment les composants partagés, la navigation, les cartes et résultats d’outils, les pages d’information, les parcours de compte et plusieurs pages d’administration. La couverture n’est pas exhaustive ; les rôles partagés ne prouvent pas à eux seuls la fidélité des composants ou de leurs rendus.
- **Formes et héritage :** l’échelle historique `--radius-*` reste utilisée en production. Ne pas la supprimer ni remapper mécaniquement ses valeurs de 16 px et 24 px ; inventorier et migrer les consommateurs, puis vérifier les références avant retrait.
- **Icônes :** les sept catégories et les 51 outils utilisent le registre partagé `MaterialIcon` dans les cartes, la recherche, les favoris, les collections et les en-têtes. Les noms sont typés et les tracés ajoutés proviennent de la révision Material Symbols épinglée. Les conteneurs d’icônes utilisent les rôles `primary-container` / `on-primary-container`. Certains outils partagent encore un symbole générique ; la pertinence sémantique et le rendu navigateur restent à vérifier.
- **Tests et rendu :** les tests de contrat protègent certains usages et rôles partagés, mais ne démontrent pas la parité AndroidX. Le rendu réel, les états, le clavier, les thèmes clair/sombre, le français/l’anglais et les viewports pertinents doivent encore être vérifiés dans le navigateur.

## Règle obligatoire de refonte vers AndroidX Material 3 Fidelity

La cible est une interface réellement portée vers AndroidX Jetpack Compose Material 3 **Fidelity**, pas un habillage M3 de l’interface historique. Aucune implémentation existante n’est conservée uniquement parce qu’elle fonctionne, est déjà utilisée ou réduit le diff. Pour chaque famille, inventorier les usages, vérifier les contrats AndroidX épinglés, choisir une refonte cohérente et supprimer les anciens mécanismes lorsqu’ils n’ont plus de consommateurs et que leur retrait est sûr.

### Icônes et emoji

- **Icônes d’interface :** remplacer les emoji et caractères Unicode employés comme pictogrammes fonctionnels par des icônes Material adaptées, en priorité Material Symbols dans le registre partagé. Les catégories, les 51 outils, les menus, les commandes de sélection, les contrôles du calendrier et du rail de navigation, les actions de fermeture, les liens externes et les commandes de l’outil PDF consomment désormais ce registre. Les états d’attente des outils d’image utilisent aussi le registre partagé ; les emoji décoratifs dans les libellés de modes de durée ont été retirés. L’audit continue sur les autres surfaces, sans confondre pictogrammes d’interface, texte éditorial et données produites par les outils.
- **Contenu et illustration :** un emoji dans du texte éditorial, une entrée utilisateur ou le contenu même d’un outil n’est pas automatiquement une icône d’interface. Il peut rester lorsque sa fonction est réelle et que sa suppression altérerait le contenu ou le résultat attendu. Les illustrations décoratives doivent aussi être auditées, sans exemption automatique.
- **Exception Web :** si aucun équivalent Material pertinent n’existe, si le navigateur ne peut pas reproduire un comportement AndroidX ou si l’équivalent nuit à l’accessibilité ou au besoin produit, documenter le cas, les sources consultées, les options et le compromis. Les exceptions substantielles ou les choix ambigus sont discutés avant adoption.
- **Retrait de l’héritage :** les classes locales, couleurs non sémantiques, rayons historiques, icônes ad hoc et composants parallèles sont des cibles d’audit, pas des solutions de repli permanentes. Vérifier les références et migrer les consommateurs avant suppression ; ne pas effectuer de conversions numériques mécaniques.
- **Preuve de migration :** tenir à jour les spécifications, les tests de contrat et les statuts. La présence d’un token ou d’une icône Material ne prouve pas que les pages l’utilisent, et la validation de rendu reste nécessaire.

Cette règle s’applique aux fondations, primitives, composants, compositions, catalogue, Design Lab et pages de production. Chaque usage doit avoir une disposition explicite : port AndroidX vérifié, composition Loculary justifiée, adaptation Web documentée ou exception approuvée.
