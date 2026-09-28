# Utiluna — Product Roadmap

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
- [x] Database catalog schema and access boundary
- [ ] Progressive public catalog migration

## Phase 1 — Core toolbox

Goal: make the first collection of tools genuinely useful and establish a sustainable rhythm of tool creation plus targeted platform improvements.

- continuously add high-value tools across the validated toolbox categories, using a hybrid selection strategy that prioritizes concrete user value while monitoring category coverage
- calculators
- converters
- text utilities
- date/time utilities
- random/generator tools
- visual tools
- selected developer utilities
- local file utilities where browser technology allows
- related-tool discovery
- copy/reset/share primitives (lightweight tool sharing first; result/state sharing when justified)
- documentation accordions
- SEO-ready tool pages

## Phase 2 — Discovery

Goal: make a large catalog easy to navigate.

- structured catalog (database-backed migration in progress)
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
- later: preferences and account settings
- later: optional synchronized history
- later: broader personalization
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

## Directional additions from validated brainstorming

The phases below should preserve the following capabilities as they become relevant; they are not claims that the functionality already exists.

### Personalization and collections

The first useful personalization scope is intentionally limited to favorites and collections. The account direction may eventually cover:
- anonymous local favorites with deterministic account merge;
- private/shareable/public collections;
- personalized home and tool ordering;
- hidden tools and configurable visible elements;
- theme, animation and density/style preferences;
- privacy/history controls.

These capabilities are not all current priorities. In particular, sober/playful presentation is an optional future direction and should not drive current architecture or implementation.

### Performance and resilience

Across all phases, apply progressive loading, tool/page performance budgets, low-end device awareness, slow-connection resilience, truthful progress, cancellation where possible, and graceful degradation.

### Future discovery evolution

The discovery phase can progress from catalog search to intent-aware search, then to solution discovery and eventually multi-tool composition when product evidence justifies it. AI remains optional and must earn its recurring cost, privacy, latency, and reliability trade-offs.

### Future surfaces

PWA/offline capabilities, public profiles, custom themes, contextual tool tone, richer educational content, Android, additional languages/RTL, stronger offline support, and child-oriented experiences remain deferred directions. Each requires its own decision/specification before becoming committed scope.


## Delivery principle

Once the catalog architecture is ready, product development follows a balanced loop:

1. add useful tools and improve the breadth/depth of the catalog;
2. strengthen platform foundations when a concrete tool, user need, scale concern, security issue or UX requirement justifies it;
3. verify quality, performance, accessibility and privacy;
4. repeat.

The platform should support tool growth, not compete with it for its own sake.
