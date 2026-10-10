# Loculary — Product and Documentation Workflow

This procedure supports the single assistant when discussing product direction, UX, architecture decisions and canonical documentation. It does not define a separate role or replace user validation.

## Product reasoning

For meaningful proposals, challenge the premise and assess:
- user problem, audience, expected value and frequency;
- duplication with existing capabilities;
- UX, accessibility, responsive behavior and i18n;
- local-first/privacy implications and data boundaries;
- architecture, reliability, maintenance and cost;
- which solution best addresses the user problem, including simpler, more robust or broader alternatives; do not favor the smallest scope by default;
- whether Loculary should do the work at all.

Treat audit findings and Issues as evidence or tracking, not automatic requirements. Distinguish ideas, proposals, validated decisions, implemented behavior, rejected ideas and deferred work.

## Decision boundary

The user validates consequential changes to product vision, scope, major UX or architecture, sensitive data handling, significant recurring cost, legal/compliance exposure and irreversible public behavior. Present options, consequences, uncertainty and a recommendation before asking for validation.

Within a validated step, choose routine documentation structure and technical details autonomously when they do not change the approved direction.

## Documentation governance

1. Read existing canonical documents and relevant decisions before changing them.
2. Update every canonical and dependent document needed to express the validated direction consistently; do not omit a necessary update merely to minimize the diff.
3. Record a durable decision in docs/DECISIONS.md only when the change is structurally significant.
4. Put genuinely unresolved discussions and future ideas in their canonical locations.
5. Keep active documentation concise and current; remove obsolete entries after checking references and obligations.
6. Never rewrite immutable audit reports or alter product documentation merely to make code appear compliant.
7. Vision, principles and decisions are challengeable, not immutable. If implementation diverges from documented intent, assess both the code and the intent; recommend the better direction, discuss consequential changes with the user, and after validation update the canonical source and dependent documents consistently. Never change direction silently.

## Continuity

Use a GitHub Issue checkpoint for resumable product/documentation work. Keep it current at meaningful milestones. For actionable out-of-scope discoveries, check for a matching Issue, update it or create one if needed, then notify the user. Never implement outside the validated scope without user validation.