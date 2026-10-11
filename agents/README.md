# Loculary work procedures

This is the directory index. For a new or resumed mission, start at `agents/START-HERE.md`.

## Canonical shared rules

- `AGENTS.md`: repository-wide technical and security requirements.
- `agents/AGENT-CONTRACT.md`: collaboration, decisions, execution autonomy and delivery.
- `agents/PRODUCT-ISSUE-CONTRACT.md`: operational plans, checkpoints and follow-up Issues.
- `agents/AUDIT-CONTRACT.md`: audit methodology, evidence and immutable reports.

## Specialist entry points

- Product and documentation: `agents/product/PRODUCT-WORKFLOW.md`
- Features: `agents/features/FEATURE-WORKFLOW.md` and `FEATURE-FACTORY-CONTRACT.md`
- Tools: `agents/tools/TOOL-WORKFLOW.md` and `TOOL-FACTORY-CONTRACT.md`
- Audits: `agents/audits/README.md` and the relevant numbered procedure

Specialist guides retain domain checks only. Shared governance must be maintained in the common contract rather than copied into each procedure.

## Validation and audit lifecycle

Run `npm run validate:workflows` for the focused contract validator. Governance-file PRs run this validator through the lightweight CI change-detection path; unrelated documentation changes skip it, and this path does not install dependencies or run the full test/build suite.

Specialist audit procedures use contiguous IDs 01–32; audit 99 is reserved for final pre-launch readiness. Each active procedure is identified by its numeric ID and slug. Each completed audit run creates a new timestamped report in its slug-separated `docs/audits/` directory and updates its replaceable `LATEST.md` pointer. Never edit or delete historical reports.
