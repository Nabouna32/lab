# Loculary — Product Roadmap

This roadmap is intentionally capability-oriented. Exact dates are avoided until the product scope and architecture are sufficiently mature.

**Implementation status snapshot — 2026-10-13:** statuses below were checked against the current repository code and database contract. `[x]` means implemented; `[partial]` means the capability exists but does not yet satisfy the full target; `[ ]` means not implemented; `[deferred]` means intentionally not part of the current delivery scope. An implemented foundation does not imply that all future enhancements in that area are complete.

## Phase 0 — Foundation

Goal: establish the platform that can grow without creating unnecessary technical debt.

- [x] Public repository
- [x] Main-only Vercel deployment
- [x] GitHub Actions CI
- [x] Product direction documented
- [x] Formal tool metadata contract
- [x] Shared tool page shell
- [x] Processing/privacy status component
- [x] i18n foundation review
- [x] Core design system
- [x] Tool quality contract
- [x] Architecture validation

## Phase 1 — Core toolbox

Goal: make the first collection of tools genuinely useful.

- [x] Calculators
- [x] Converters
- [x] Text utilities
- [x] Date/time utilities
- [x] Random/generator tools
- [x] Visual tools
- [x] Selected developer utilities
- [partial] Browser-local file/image utilities (image compression and metadata exist; this is not a broad file-processing suite)
- [x] Contextual next-action discovery (curated relations, not generic similarity)
- [partial] Reusable copy/clear controls exist; universal reset and tool/result sharing are not implemented (tool sharing metadata is currently disabled)
- [x] Documentation accordions
- [x] SEO-ready tool pages and localized sitemap

## Phase 2 — Discovery

Goal: make a large catalog easy to navigate.

- [partial] Typed Git-backed catalog and explicit runtime registry exist; editable PostgreSQL catalog is intentionally absent after the clean-cut
- [x] Categories
- [x] Tags
- [x] Search aliases
- [x] Deterministic catalog search with localized names, descriptions, aliases, tags, categories and typo tolerance
- [ ] Popular-tool ranking
- [ ] New-tool discovery surface
- [x] Curated contextual next actions
- [x] Curated intent-to-tool associations are separate from categories; free-form query intent recognition remains deterministic and limited

## Phase 3 — Accounts

Goal: synchronize favorites, personal collections and the light/dark theme preference without creating an account wall.

- [x] Supabase email/password authentication and profile foundation
- [x] All published tools are usable anonymously; local favorites and account synchronization are implemented
- [x] Anonymous favorites and account synchronization with deterministic sign-in merge
- [x] Personal collections with private-by-default access and optional link sharing
- [partial] Local light/dark theme mode and profile locale exist; account-synchronized theme preference does not
- [partial] Profile, email/password and account-lifecycle screens exist; account preference synchronization remains incomplete
- [partial] Processing disclosures and account deletion exist; comprehensive privacy/consent controls are incomplete

## Phase 4 — Sustainability and scale

Goal: support real traffic while protecting the user experience.

- [deferred] Reconsider a database-backed catalog only when DEC-027's concrete product or operational triggers are demonstrated; catalog size alone is insufficient
- [partial] Framework/static generation is used; a deliberate catalog/data caching strategy is not implemented
- [partial] CI, unit tests and metadata validation exist; product-level resilience remains incomplete.
- [partial] Authentication throttling and administrative RBAC/RLS exist; broader abuse controls remain incomplete

## Explicitly deferred

- large server-side file processing as a default;
- mandatory accounts;
- premature multi-cloud architecture;
- mobile-first implementation constraints before the web product is mature.

## Cross-cutting implementation principles

These requirements apply across the product and do not imply a commitment to add separate platform or discovery features.

### Personalization and collections

The account phase covers:
- anonymous local favorites with deterministic account merge (implemented);
- personal collections, private by default with optional link sharing (implemented);
- light/dark theme preference, stored locally for anonymous users; account synchronization remains unimplemented.

### Performance and resilience

Across all phases, apply progressive loading, tool/page performance budgets, low-end device awareness, slow-connection resilience, truthful progress, cancellation where possible, and graceful degradation.
