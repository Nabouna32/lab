# Loculary — Product Roadmap

This roadmap is intentionally capability-oriented. Exact dates are avoided until the product scope and architecture are sufficiently mature.

**Implementation status snapshot — 2026-10-13:** statuses below were checked against the current repository code and database contract. `[x]` means implemented; `[partial]` means the capability exists but does not yet satisfy the full target; `[ ]` means not implemented; `[deferred]` means intentionally not part of the current delivery scope. An implemented foundation does not imply that all future enhancements in that area are complete.

## Phase 0 — Foundation

Goal: establish the platform that can grow without creating unnecessary technical debt.

- [x] Public repository
- [x] Main-only Vercel deployment
- [x] GitHub Actions CI
- [deferred] Browser smoke/E2E baseline intentionally removed during active redesign; reconsider after the interface stabilizes and a concrete regression risk justifies it
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
- [ ] Recent-tool history/surface
- [ ] New-tool discovery surface
- [x] Curated contextual next actions
- [partial] Natural-language-like queries work through deterministic ranking, but intents are not first-class catalog entities associated with tools
- [ ] Search quality instrumentation

## Phase 3 — Accounts

Goal: add optional personalization without creating an account wall.

- [x] Supabase email/password authentication and profile foundation
- [partial] All published tools are usable anonymously and process locally; anonymous favorites and personalization do not exist
- [ ] Favorites
- [ ] Collections
- [partial] Local theme mode and profile locale exist; account-synchronized personalization preferences do not
- [ ] Optional synchronized history
- [partial] Profile, email/password and account-lifecycle screens exist; personalization settings are incomplete
- [partial] Processing disclosures and account deletion exist; comprehensive privacy/consent controls are incomplete
- [deferred] AI-specific privacy controls depend on an approved AI use case

## Phase 4 — Community

Goal: make the catalog participatory without sacrificing quality.

- [ ] Propose an idea
- [ ] Propose a tool
- [ ] Ratings
- [ ] Comments
- [ ] Community moderation (the admin dashboard currently labels moderation as coming soon)
- [ ] Contributor attribution
- [ ] Contribution history
- [x] Community guidelines documented
- [ ] Contribution workflow

## Phase 5 — Advanced intelligence

Goal: improve discovery and tool assistance where justified.

- [partial] Deterministic natural-language-like search; no AI-backed search
- [partial] Intent shortcuts exist in the UX, but there is no first-class intent model in tool metadata
- [ ] Optional direct task execution
- [ ] AI assistance (AI remains optional, not foundational)
- [deferred] Cost controls until an AI provider is selected
- [deferred] AI-specific privacy controls depend on an approved AI use case
- [deferred] Fallback behavior if an AI-backed capability is introduced

AI is not a goal by itself.

Current boundary: the deployed Supabase database contains account/profile and administrative RBAC/audit foundations only. The executable tool catalog remains Git-backed; favorites, collections, community records and an editable database catalog are not currently deployed.

## Phase 6 — Sustainability and scale

Goal: support real traffic while protecting the user experience.

- [ ] Advertising integration
- [ ] Privacy-conscious product analytics
- [ ] Dedicated runtime performance monitoring
- [deferred] Revisit only when evidence justifies a database-backed catalog or higher scale
- [partial] Framework/static generation is used; a deliberate catalog/data caching strategy is not implemented
- [partial] CI, unit tests and metadata validation exist; browser E2E is intentionally deferred during active redesign, and product-level resilience remains incomplete
- [partial] Authentication throttling and administrative RBAC/RLS exist; community anti-abuse controls do not
- [ ] Cost observability
- [deferred] Strategic principle for a future revenue model, not an implemented capability

## Phase 7 — Future clients

Potential future surfaces:

- [deferred] Android application;
- [deferred] Additional clients if there is demonstrated demand.

The web remains the primary platform until evidence supports expansion.

## Explicitly deferred

- large server-side file processing as a default;
- mandatory accounts;
- custom-trained AI infrastructure;
- premature multi-cloud architecture;
- a full social network;
- mobile-first implementation constraints before the web product is mature.

Deferred does not mean forbidden forever.

## Additional future directions

The phases below should preserve the following capabilities as they become relevant; they are not claims that the functionality already exists.

### Personalization and collections

The account phase should ultimately cover:
- anonymous local favorites with deterministic account merge;
- private/shareable/public collections;
- personalized home and tool ordering;
- hidden tools and configurable visible elements;
- theme, animation and density/style preferences;
- privacy/history controls.

### Performance and resilience

Across all phases, apply progressive loading, tool/page performance budgets, low-end device awareness, slow-connection resilience, truthful progress, cancellation where possible, and graceful degradation.

### Future discovery evolution

The discovery phase can progress from catalog search to intent-aware search, then to solution discovery and eventually multi-tool composition when product evidence justifies it. AI remains optional and must earn its recurring cost, privacy, latency, and reliability trade-offs.

### Future surfaces and evaluation boundaries

These remain future directions, not commitments to implement in the current phase:

- **PWA and stronger offline support:** keep the normal web experience excellent first. If evaluated, compare concrete offline use cases and user value against installation UX, cache/storage complexity, update reliability, browser support, and performance costs. Offline indicators must describe actual tool capability; network-dependent tools must not be excluded from the catalog.
- **Public profiles:** if introduced, make them optional and limited to explicitly selected information such as pseudonym, avatar, interests, favorite tools, public collections, and contributions. Keep profiles subordinate to finding and using tools; do not turn Loculary into a social network.
- **Theme customization:** evaluate customization beyond light/dark/system only when it adds meaningful value. Preserve accessible, curated palette choices and validated light/dark semantic mappings; do not assume an unrestricted color picker is desirable.
- **Contextual tool tone and richer educational content:** allow tool-specific tone or optional content about origins, history, conventions, or differing standards only when it improves the task. Neither should displace the tool or add generic filler.
- **Additional languages and RTL:** expand through the language registry, reviewed translation readiness, localized SEO, and deliberate right-to-left layout support rather than assuming translation alone is sufficient.
- **Future clients:** Android or other clients should be justified by demonstrated demand and must not slow down the web product prematurely.
