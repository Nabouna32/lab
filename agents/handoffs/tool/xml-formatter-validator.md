# Tool Worker checkpoint — XML Formatter & Validator

- **Role / mission:** Autonomous Tool Worker — deliver one production-ready Loculary tool.
- **Issue:** #336
- **Branch:** `feat/tool/xml-formatter-validator`
- **Base SHA:** `1547cbf3c24c259cfc139b111890ab574f0c0236`
- **Current state:** RUNNING
- **Validated scope:** Browser-local XML well-formedness validation and readable formatting; clear parse errors; EN/FR; catalog/registry/routes/SEO; focused domain tests and targeted Playwright coverage.
- **Processing:** local-only through browser XML parsing APIs; no network, storage, account or external provider.
- **Challenge:** Existing JSON/YAML/HTML tools do not cover XML. A native browser parser is simpler and more private than an external XML service. The tool will report well-formed XML only and will not imply XSD/DTD schema validation.
- **Alternative considered:** extending the existing JSON/YAML formatter into a generic structured-data editor was rejected for this mission because XML has different parsing semantics and the current architecture supports independent tools cleanly.
- **Decisions blocked:** none currently.
- **Completed milestones:** candidate challenged; Issue #336 created; branch claimed from current main.
- **Current action:** inspect the current structured-data tool patterns and implement the XML domain module with focused tests.
- **Important areas:** `src/lib/tools/`, `src/components/tools/`, tool catalog/registry/routes/SEO, EN/FR tool messages, `e2e/`.
- **Tests/checks:** not yet run for this mission.
- **Last durable commit:** `1547cbf3c24c259cfc139b111890ab574f0c0236` (base; checkpoint commit follows).
- **Latest checkpoint:** 2026-10-05.
