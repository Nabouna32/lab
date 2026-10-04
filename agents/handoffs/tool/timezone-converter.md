# Tool Worker checkpoint — Timezone Converter

- **Role / mission:** Autonomous Tool Worker — deliver one production-ready Loculary tool.
- **Branch:** `feat/tool/timezone-converter`
- **Base SHA:** `805790a610c10d89e69d40c78eb57e6a31c6d4a1`
- **Current state:** TESTING
- **Validated scope:** Local browser timezone conversion using IANA zones; date/time input; source timezone; destination timezone; clear result and DST-aware validation; EN/FR; catalog/registry/routes/SEO; domain tests and targeted Playwright coverage.
- **Processing:** local-only through the browser `Intl.DateTimeFormat` API; no network, storage, account or external provider.
- **Challenge:** A generic “world clock” would be visually attractive but less useful for deterministic tasks. A raw UTC-to-zone converter would avoid DST ambiguity but would be less natural for users. Chosen direction: convert a wall-clock date/time from a source IANA zone to a destination IANA zone, with explicit handling of nonexistent/ambiguous local times.
- **Domain basis:** `Intl.DateTimeFormat` supports IANA `timeZone` identifiers and `formatToParts()`, allowing local conversion without a timezone database dependency in the application.
- **Completed milestones:** domain conversion + DST tests; catalog/type/registry/routes/SEO integration; EN/FR UI/editorial content; targeted Playwright coverage; hydration-safe client defaults; final branch diff inspection.
- **Current action:** prepare PR and verify CI + Browser E2E.
- **Decisions blocked:** none currently.
- **Tests/checks:** not yet executed locally because the working tree is GitHub-only in this session; CI will execute lint, typecheck, unit tests, build, and Browser E2E.
- **Last durable commit:** 4850cebb7ded1b198876455ffec654a6f47214b3
- **Latest checkpoint:** 2026-10-05.
- **Challenge outcome:** preserve the local-first IANA approach; use browser tzdata via Intl instead of shipping a timezone database or adding an external provider. Explicitly reject nonexistent local times and choose the earlier instant for repeated local times.
