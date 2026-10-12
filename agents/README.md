# Loculary agent workspace

This directory contains the shared collaboration rules and the specialist guidance that genuinely helps with recurring work.

Start or resume a mission with `agents/START-HERE.md`. The common collaboration contract is `agents/AGENT-CONTRACT.md`; mission checkpoints live in the relevant GitHub Issue.

## Shared rules

- `AGENTS.md`: repository-wide technical and security requirements.
- `agents/AGENT-CONTRACT.md`: collaboration, challenge, decisions, execution and delivery.
- `agents/PRODUCT-ISSUE-CONTRACT.md`: durable Issue checkpoints and continuity.

## Specialist guidance

- Product and documentation: `agents/product/PRODUCT-WORKFLOW.md`
- Features: `agents/features/FEATURE-WORKFLOW.md` and `FEATURE-FACTORY-CONTRACT.md`
- Tools: `agents/tools/TOOL-WORKFLOW.md` and `TOOL-FACTORY-CONTRACT.md`

Investigations and audits are initiated when they are useful during our work, and are adapted to the question. There is no mandatory audit catalogue, numbered procedure or report archive. Keep meaningful findings in the active Issue or canonical project documentation when they need to remain actionable.

## Validation

Run `npm run validate:workflows` for the focused collaboration-contract validator. Governance-file PRs run it through the lightweight CI change-detection path; unrelated documentation changes skip it, and this path does not install dependencies or run the full test/build suite.
