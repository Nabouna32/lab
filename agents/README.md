# Loculary work procedures

This directory contains the operating contract, task-specific procedures and reusable audit missions used by the single ChatGPT assistant working directly with the user.

## Core workflow

- AGENTS.md defines repository-wide development rules.
- agents/AGENT-CONTRACT.md defines the common work, challenge, continuity and verification rules.
- agents/START-HERE.md is the entry point for starting or resuming work.
- agents/PRODUCT-ISSUE-CONTRACT.md defines mission checkpoints and follow-up tracking.
- agents/product/PRODUCT-WORKFLOW.md covers product reasoning and documentation decisions.
- agents/features/FEATURE-FACTORY-CONTRACT.md and FEATURE-WORKFLOW.md cover feature implementation.
- agents/tools/TOOL-FACTORY-CONTRACT.md and TOOL-WORKFLOW.md cover tool creation.
- agents/AUDIT-CONTRACT.md defines audit evidence, report structure and immutability.
- agents/audits/ contains numbered audit procedures, not separate agent identities.

## Working rules

Work sequentially, one validated scope at a time. Challenge assumptions, current code/design and proposed solutions; seek optimizations as well as defects. Consequential decisions require user validation.

Resumable work uses a GitHub Issue checkpoint. Actionable discoveries outside scope must be presented to the user, who decides whether to create or attach an Issue. Keep active documentation current and concise. Git preserves ordinary history; historical audit reports remain immutable.

## Validation

Run npm run validate:workflows to check the task procedures, contract references and audit mission numbering. CI runs the same validator.

## Audit lifecycle

An audit procedure defines scope and required evidence. Each completed run creates a new timestamped report under docs/audits/<id>-<slug>/ and updates that directory's LATEST.md pointer. Never overwrite or delete historical audit reports merely because findings have changed. Revalidate old findings against current code before acting on them.