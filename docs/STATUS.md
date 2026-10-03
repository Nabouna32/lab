# Loculary — Current Status

## Current state

- UX V2 foundations through the homepage exploration cue are merged on `main`.
- Global navigation now provides tool search from the header, shared breadcrumbs on category/tool pages, a lightweight shared footer, and a compact modern header with stable secondary controls.
- Main uses the generic ToolPage shell, semantic processing/result status metadata, and the registry-based dynamic tool route.
- Published tools are connected to independently loadable implementation modules through the central registry.
- The published Development category now includes the browser-local URL Encoder & Decoder, Base64 Encoder & Decoder, and UUID Generator.
- Tool runtime capabilities are scoped per tool; clipboard is currently the only browser capability enforced through the runtime.
- SEO metadata now provides canonical URLs, localized alternates and Open Graph data for tool pages.
- Category pages use the shared localized catalog metadata instead of duplicating French-only labels.
- The platform audit found no current application-level `fetch()`, `XMLHttpRequest`, URL-state, localStorage, sessionStorage or IndexedDB implementation in the published tools.

## Recently completed

- Merged the registry-based dynamic tool route and removed per-tool App Router page duplication.
- Merged tool-scoped runtime capability enforcement for clipboard.
- Added an explicit access axis (`anonymous`, `account`, `premium`) separate from processing classification.
- Merged canonical and localized tool metadata/SEO support.
- Merged the percentage result-panel layout fix so the result column no longer stretches the input column unnecessarily.
- Merged the category-page i18n correction so English routes no longer fall back to hard-coded French UI.
- Restored the compact processing status tooltip and semantic status presentation.
- Extended catalog search to tags/categories and reduced unnecessary fuzzy matching work.
- Converted related-tool rendering to a server component using the route-resolved locale.
- Moved published tool editorial content out of the central switch and into the corresponding tool modules.

## Recent tool additions

- Added the browser-local Text Case Converter with EN/FR metadata, localized routes, SEO metadata, local processing disclosure, focused unit coverage and Playwright smoke coverage.

## Recent functional audit

- Added the browser-local URL Encoder & Decoder with component/full-URL modes, EN/FR metadata and focused unit/E2E coverage.
- Added the browser-local Base64 Encoder & Decoder for UTF-8 text with EN/FR metadata and focused unit/E2E coverage.
- Added the browser-local UUID Generator for random UUID v4 values with EN/FR metadata and focused unit/E2E coverage.
- Added the browser-local Color Converter for HEX, RGB, and HSL with EN/FR metadata and focused unit/E2E coverage.
- Added the browser-local Color Palette Generator with common color harmonies, EN/FR metadata and focused unit/E2E coverage.
- Hardened published numeric tools against non-finite calculation results and surfaced invalid numeric input instead of silently hiding results.
- Hardened the download-speed and file-size converters against numeric overflow at their domain boundaries.
- Updated the text counter to count Unicode grapheme clusters, so joined emoji and other user-perceived characters are counted as one character.
- Completed the first accessibility pass across the published validation states: invalid inputs are now exposed with `aria-invalid`, validation messages are announced with `role="alert"`, and invalid fields reference their visible validation message through `aria-describedby`.
- Prevented empty global search submission from opening an arbitrary first result.
- Aligned the rule-of-three calculation helper with the published nullable invalid-input contract: invalid and non-finite inputs now return `null` instead of throwing.

## Platform audit conclusions

### Processing and external services

- The current published catalog is local-only.
- Processing metadata is validated against declared capabilities and providers.
- No current published tool needs an external API or Loculary server.
- The architecture is ready for external/server tools, but they must explicitly declare network capability, provider metadata and the corresponding processing classification.

### State and sharing

- Current tool state is component-local.
- No published tool currently implements URL state or persistence.
- Do not introduce a generic sharing serializer before a real tool needs shareable state.
- Future shareable state should be explicitly declared by the tool module and must never expose sensitive values accidentally.

### Database boundary

- Supabase is now used for the account foundation and administrative authorization.
- Executable behavior and technical capabilities remain authoritative in Git/code.
- The database may own account, administration, editable catalog/editorial data, publication state and community data as those domains are introduced deliberately.
- Database-backed metadata must not be allowed to falsely redefine executable tool behavior.

### Catalog, editorial and i18n

- The central catalog/registry is sufficient for the current toolbox.
- Catalog consumers now go through a single catalog access layer; the current implementation remains Git-backed, while the boundary is ready for a future database-backed catalog without coupling pages and components to the storage location.
- The first editable catalog schema is deployed and seeded in Supabase; public application reads have not yet switched to the database.
- The category-page duplication was removed.
- Editorial content is now owned by each tool module and loaded through the same registry as the executable tool; the former centralized switch has been removed.
- Search now matches structured tags, aliases and categories in addition to localized names and descriptions.
- Related tools no longer require client-side routing context; the server route passes the locale directly.
- User-facing global UI strings belong in the i18n layer; tool-specific names/descriptions/SEO are structured per locale.
- The public `Tool` contract now uses structured metadata as its single runtime contract; legacy `name`, `description`, `keywords`, `available` and `categoryId` fields are no longer exposed.

## Not implemented yet

- Account deletion and the current account lifecycle are implemented; broader administrative account lifecycle beyond the existing RBAC/suspension surface remains separate.
- Account/premium enforcement.
- Runtime enforcement for browser capabilities beyond clipboard.
- Generic sharing runtime.
- Application reads from the database-backed catalog; the schema and initial data exist, but the current public catalog still reads from Git through the catalog access boundary.
- External-service integrations.

## Next actions

1. Continue the functional behavior audit of every published tool, focusing on remaining edge cases, rounding conventions and user-facing result semantics.
2. Continue the tool-platform audit with registry scalability and catalog/module boundaries as the toolbox grows.
3. Continue administration with the remaining account-lifecycle actions, especially account deletion and other account-lifecycle workflows.
4. Connect the existing catalog access boundary to the new database schema and switch reads progressively while keeping Git/code authoritative for executable behavior.
5. Introduce persistence or sharing only when a concrete tool requirement justifies the corresponding runtime capability.
6. Continue the UX audit with above-the-fold tool hierarchy and mobile behavior, then apply targeted fixes, including keyboard/focus behavior where it affects tool completion.

## Important boundary

The code/module remains authoritative for executable behavior and technical capabilities. Future database/catalog data may control editable product and editorial information, but it must not be allowed to falsely redefine what a module technically does.


## Account and database foundation

- Supabase project `Loculary` is active in `eu-west-2`.
- First application table `public.profiles` is deployed with Row Level Security and ownership policies.
- Next.js was upgraded from 16.3.5 to 16.3.6 to address the critical upstream security update released on September 22, 2026.
- The published file-size calculator now validates calculation units and rejects numeric overflow at the domain-function boundary.
- Email/password account creation, sign-in, sign-out and session refresh are wired into the Next.js application.
- Email confirmation uses the Supabase PKCE callback flow.
- The database currently stores only minimal profile metadata; tool/catalog migration remains a separate future step.

## Administration foundation

- Database-backed granular roles and permissions are deployed to Supabase.
- `super_admin` and `admin` roles are seeded; the initial administrator account is assigned `super_admin`.
- Administrative tables use Row Level Security and least-privilege grants.
- A protected localized `/[locale]/admin` dashboard is implemented and checks `admin.dashboard.view` server-side.
- The administration dashboard now acts as a module hub, keeping future areas visible without creating empty pages.
- Administrative access is exposed from the account page only when the signed-in user has the dashboard permission.
- A protected user-management workspace is implemented with search, account/profile metadata, administrator roles, audited role assignment/removal, protection against removing the last `super_admin` role, account suspension/reactivation, and administrator-triggered session revocation.
- A protected audit-log workspace is implemented with server-side permission checks and a read-only view of administrative actions.
- User suspension/reactivation and administrator-triggered session revocation are implemented through Supabase Auth; self-service account deletion is now implemented separately and does not add an administrative user-deletion API.
- The initial administrator account has been explicitly assigned the `super_admin` role and can access the dashboard.
