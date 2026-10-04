# Tool Worker checkpoint — Timezone Converter

- **Role / mission:** Autonomous Tool Worker — deliver one production-ready Loculary tool.
- **Branch:** `feat/tool/timezone-converter`
- **Base SHA:** `805790a610c10d89e69d40c78eb57e6a31c6d4a1`
- **Current state:** RUNNING
- **Validated scope:** Local browser timezone conversion using IANA zones; date/time input; source timezone; destination timezone; clear result and DST-aware validation; EN/FR; catalog/registry/routes/SEO; domain tests and targeted Playwright coverage.
- **Processing:** local-only through the browser `Intl.DateTimeFormat` API; no network, storage, account or external provider.
- **Challenge:** A generic “world clock” would be visually attractive but less useful for deterministic tasks. A raw UTC-to-zone converter would avoid DST ambiguity but would be less natural for users. Chosen direction: convert a wall-clock date/time from a source IANA zone to a destination IANA zone, with explicit handling of nonexistent/ambiguous local times.
- **Domain basis:** `Intl.DateTimeFormat` supports IANA `timeZone` identifiers and `formatToParts()`, allowing local conversion without a timezone database dependency in the application.
- **Next action:** implement the domain conversion and validation first, then integrate the tool UI/catalog/SEO/i18n and verify all gates.
- **Decisions blocked:** none currently.
- **Tests/checks:** not run yet.
- **Last durable commit:** checkpoint creation commit.
- **Latest checkpoint:** 2026-10-05.
