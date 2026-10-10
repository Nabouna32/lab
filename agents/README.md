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

Resumable work uses a GitHub Issue checkpoint. For actionable discoveries outside scope, search for a matching Issue, update it or create one if needed, then notify the user; implementation still requires scope validation. Keep active documentation current and concise. Git preserves ordinary history; historical audit reports remain immutable.

## Delivery

Controlled manual merge through GitHub is the default: wait for required checks, verify the PR head and base are current, then merge without bypassing branch protections. Do not enable auto-merge by default. The common contract defines the exact checks and the narrow exception for explicit repository policy.

## Validation

Run npm run validate:workflows to check the task procedures, contract references, merge lifecycle consistency and audit mission numbering. CI runs the same validator.

## Audit lifecycle

An audit procedure defines scope and required evidence. Each completed run creates a new timestamped report under docs/audits/<id>-<slug>/ and updates that directory's LATEST.md pointer. Never overwrite or delete historical audit reports merely because findings have changed. Revalidate old findings against current code before acting on them.