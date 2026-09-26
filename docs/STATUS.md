# Utiluna — Current Status

## Current state

- UX V2 foundations through the homepage exploration cue are merged on `main`.
- Global navigation now provides tool search from the header, shared breadcrumbs on category/tool pages, a lightweight shared footer, and a compact modern header with stable secondary controls.
- Main uses the generic ToolPage shell, semantic processing/result status metadata, and the registry-based dynamic tool route.
- Published tools are connected to independently loadable implementation modules through the central registry.
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

## Platform audit conclusions

### Processing and external services

- The current published catalog is local-only.
- Processing metadata is validated against declared capabilities and providers.
- No current published tool needs an external API or Utiluna server.
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
- The category-page duplication was removed.
- Editorial content is now owned by each tool module and loaded through the same registry as the executable tool; the former centralized switch has been removed.
- Search now matches catalog tags and categories in addition to names, descriptions, keywords and aliases.
- Related tools no longer require client-side routing context; the server route passes the locale directly.
- User-facing global UI strings belong in the i18n layer; tool-specific names/descriptions/SEO are structured per locale.

## Not implemented yet

- Database-backed catalog/editorial content.
- User suspension/deletion and broader account-lifecycle administration.
- Account/premium enforcement.
- Runtime enforcement for browser capabilities beyond clipboard.
- Generic sharing runtime.
- Database-backed catalog/editorial content.
- External-service integrations.

## Next actions

1. Continue the tool-platform audit with registry scalability and catalog/module boundaries as the toolbox grows.
2. Continue administration with the remaining account-lifecycle actions, especially account deletion and session/revocation workflows.
3. Define and implement the code/database boundary for editable catalog/editorial data before migrating those domains.
4. Introduce persistence or sharing only when a concrete tool requirement justifies the corresponding runtime capability.
5. Continue the UX audit with above-the-fold tool hierarchy and mobile behavior, then apply targeted fixes.

## Important boundary

The code/module remains authoritative for executable behavior and technical capabilities. Future database/catalog data may control editable product and editorial information, but it must not be allowed to falsely redefine what a module technically does.


## Account and database foundation

- Supabase project `Utiluna` is active in `eu-west-2`.
- First application table `public.profiles` is deployed with Row Level Security and ownership policies.
- Email/password account creation, sign-in, sign-out and session refresh are wired into the Next.js application.
- Email confirmation uses the Supabase PKCE callback flow.
- The database currently stores only minimal profile metadata; tool/catalog migration remains a separate future step.

## Administration foundation

- Database-backed granular roles and permissions are deployed to Supabase.
- `super_admin` and `admin` roles are seeded; no user has been assigned a role yet.
- Administrative tables use Row Level Security and least-privilege grants.
- A protected localized `/[locale]/admin` dashboard is implemented and checks `admin.dashboard.view` server-side.
- The administration dashboard now acts as a module hub, keeping future areas visible without creating empty pages.
- Administrative access is exposed from the account page only when the signed-in user has the dashboard permission.
- A protected user-management workspace is implemented with search, account/profile metadata, administrator roles, audited role assignment/removal, and protection against removing the last `super_admin` role.
- A protected audit-log workspace is implemented with server-side permission checks and a read-only view of administrative actions.
- User suspension and reactivation are implemented through Supabase Auth; account deletion and broader account-lifecycle administration are not implemented yet.
- The initial administrator account has been explicitly assigned the `super_admin` role and can access the dashboard.
