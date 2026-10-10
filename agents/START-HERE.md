# Loculary — Work Entry Point

This guide helps the single ChatGPT assistant resume work from the real repository state. It is a task-procedure index, not a multi-agent system. Run this checklist when starting or resuming a mission, not at every follow-up within an ongoing validated step.

## Start or resume a mission

1. Read AGENTS.md, agents/AGENT-CONTRACT.md and agents/PRODUCT-ISSUE-CONTRACT.md.
2. Read the relevant procedure:
   - Product direction and documentation: agents/product/PRODUCT-WORKFLOW.md
   - Tool creation: agents/tools/TOOL-FACTORY-CONTRACT.md and agents/tools/TOOL-WORKFLOW.md
   - Feature implementation: agents/features/FEATURE-FACTORY-CONTRACT.md and agents/features/FEATURE-WORKFLOW.md
   - Audit: agents/AUDIT-CONTRACT.md and the relevant mission in agents/audits/
3. Read relevant canonical specifications and decisions.
4. Inspect current main, the implementation, branches, open PRs, Issues and CI as relevant.
5. Identify the active mission Issue or create one when resumable work begins.
6. Challenge the proposed approach and existing design, including opportunities to simplify or optimize.
7. State the objective, scope, non-goals, decisions requiring validation and next action.

## Operating principles

- One assistant works directly with the user; execute one validated step at a time.
- Challenge is mandatory, not limited to audits or obvious defects.
- After validation, complete the authorized step and verify it before reporting.
- Do not expand scope or make consequential decisions silently.
- Update the mission Issue at meaningful milestones and before interruption or completion.
- For every actionable out-of-scope discovery, check for an existing matching Issue first; update it or create one if needed, then tell the user. Tracking does not authorize implementation: do not implement outside the validated scope without user validation.
- Keep active docs concise and current. Git preserves ordinary history; immutable audit reports remain unchanged.
- Never rely on chat history in place of repository/GitHub evidence.

If a required file is missing or a read is incomplete, retrieve it before continuing. If contracts conflict with this single-assistant workflow, report the divergence and reconcile the governing documentation rather than silently following stale instructions.