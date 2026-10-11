# Tool implementation guide

Read `AGENTS.md`, `agents/AGENT-CONTRACT.md`, `agents/PRODUCT-ISSUE-CONTRACT.md` and `agents/tools/TOOL-FACTORY-CONTRACT.md`, then the relevant catalog, tool, UX, privacy, i18n and architecture specifications.

Challenge the user problem, whether a tool is needed, catalog duplication and alternatives. In addition to shared UX/accessibility/i18n/security/performance checks, verify domain correctness (formulas, units, precision, limits, edge cases), browser capabilities, processing/privacy classification, data handling and error states.

Use the mission Issue for the validated plan and checkpoints. After plan validation, implement the full agreed tool, test domain boundaries and both initial locales where relevant, update catalog/documentation, inspect the complete diff and deliver through the normal branch/PR/CI workflow. Routine technical steps do not need repeated approval; escalate consequential new decisions.

Automated browser E2E and screenshots remain manual-only during the active redesign and are not PR gates.
