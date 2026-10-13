# Loculary — Product Roadmap

This roadmap is intentionally capability-oriented. Exact dates are avoided until the product scope and architecture are sufficiently mature.

## Phase 0 — Foundation

Goal: establish the platform that can grow without creating unnecessary technical debt.

- [x] Public repository
- [x] Main-only Vercel deployment
- [x] GitHub Actions CI
- [x] Browser smoke/E2E baseline
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

- calculators
- converters
- text utilities
- date/time utilities
- random/generator tools
- visual tools
- selected developer utilities
- local file utilities where browser technology allows
- related-tool discovery
- copy/reset/share primitives
- documentation accordions
- SEO-ready tool pages

## Phase 2 — Discovery

Goal: make a large catalog easy to navigate.

- structured catalog
- categories
- tags
- aliases
- tool search
- popular tools
- recent tools
- new tools
- related tools
- intent-aware search foundation
- search quality instrumentation

## Phase 3 — Accounts

Goal: add optional personalization without creating an account wall.

- authentication
- anonymous/local mode
- favorites
- collections
- preferences
- optional synchronized history
- account settings
- privacy controls

## Phase 4 — Community

Goal: make the catalog participatory without sacrificing quality.

- propose an idea
- propose a tool
- ratings
- comments
- moderation
- contributor attribution
- contribution history
- community guidelines

## Phase 5 — Advanced intelligence

Goal: improve discovery and tool assistance where justified.

- natural-language tool search
- intent recognition
- optional direct task execution
- carefully evaluated AI assistance
- cost controls
- privacy controls
- fallback behavior when AI is unavailable

AI is not a goal by itself.

## Phase 6 — Sustainability and scale

Goal: support real traffic while protecting the user experience.

- advertising integration
- privacy-conscious analytics
- performance monitoring
- database scaling where necessary
- caching
- reliability improvements
- abuse protection
- cost observability
- revenue reinvestment into infrastructure and product quality

## Phase 7 — Future clients

Potential future surfaces:

- Android application;
- additional clients if there is demonstrated demand.

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
- **Child-oriented experience:** treat this as a separate product and risk decision, not a theme toggle. Any proposal must address age-appropriate language and interaction, child safety, privacy, applicable legal requirements, and advertising policy before scope is approved.
- **Additional languages and RTL:** expand through the language registry, reviewed translation readiness, localized SEO, and deliberate right-to-left layout support rather than assuming translation alone is sufficient.
- **Future clients:** Android or other clients should be justified by demonstrated demand and must not slow down the web product prematurely.
