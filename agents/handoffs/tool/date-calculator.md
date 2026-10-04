# Tool Worker — Date Calculator

- Role: Tool Worker
- Mission: Build and integrate the Date Calculator tool.
- Branch: `feat/tool/date-calculator`
- Base: `main` at `83bc48fafd3ec62a83e9bd4db217e6e4e6311e363`
- State: IMPLEMENTING
- Validated scope: browser-first/local date arithmetic tool; French and English; catalog/registry/routes/SEO/i18n/editorial integration; domain tests and targeted browser coverage.
- Product rationale: complement the existing duration calculator with the inverse/common task of adding or subtracting a period from a known date. This is a distinct, deterministic utility and fits Loculary's local-first toolbox.
- Planned behavior: choose a start date, add or subtract a number of years/months/weeks/days, and display the resulting date with clear validation and locale-aware formatting.
- Privacy: fully local; no network, storage, account, or external provider.
- Completed milestones: bootstrap; current main/open PR/branch inspection; candidate selected; branch created.
- Current action: implement the date arithmetic domain logic and first-pass UI after inspecting existing date/domain/UI patterns.
- Expected outcome: deterministic local date arithmetic with explicit add/subtract and unit semantics.
- Next action: create domain logic, UI, catalog integration, tests, then validate and deliver PR.
- Decisions blocked: none currently.
- Important areas: `src/lib/tools/*`, `src/components/tools/*`, date-related existing tool implementation.
- Tests/checks: not run yet.
- Last durable commit: branch base `83bc48fafd3ec62a83e9bd4db217e6e4e6311e363`.
- Latest checkpoint: 2026-10-04T22:40:00Z
