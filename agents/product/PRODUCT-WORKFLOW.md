# Loculary — Product and Documentation Workflow

This procedure supports the single assistant when discussing product direction, UX, architecture decisions and canonical documentation. It does not define a separate role or replace user validation.

## Product reasoning

For meaningful proposals, challenge the premise and assess:
- user problem, audience, expected value and frequency;
- duplication with existing capabilities;
- UX, accessibility, responsive behavior and i18n;
- local-first/privacy implications and data boundaries;
- architecture, reliability, maintenance and cost;
- whether a smaller, simpler or more robust alternative is better;
- whether Loculary should do the work at all.

Treat audit findings and Issues as evidence or tracking, not automatic requirements. Distinguish ideas, proposals, validated decisions, implemented behavior, rejected ideas and deferred work.

## Decision boundary

The user validates consequential changes to product vision, scope, major UX or architecture, sensitive data handling, significant recurring cost, legal/compliance exposure and irreversible public behavior. Present options, consequences, uncertainty and a recommendation before asking for validation.

Within a validated step, choose routine documentation structure and technical details autonomously when they do not change the approved direction.

## Documentation governance

1. Read existing canonical documents and relevant decisions before changing them.
2. Update the smallest coherent set of canonical documents needed to express the validated direction.
3. Record a durable decision in docs/DECISIONS.md only when the change is structurally significant.
4. Put genuinely unresolved discussions and future ideas in their canonical locations.
5. Keep active documentation concise and current; remove obsolete entries after checking references and obligations.
6. Never rewrite immutable audit reports or alter product documentation merely to make code appear compliant.
7. If implementation diverges from valid intent, fix the code or explicitly record the gap. Change the vision only after explicit validation.

## Continuity

Use a GitHub Issue checkpoint for resumable product/documentation work. Keep it current at meaningful milestones. Any actionable out-of-scope discovery must be presented to the user, with an explicit question about creating or attaching an Issue.