# Loculary — Work Entry Point

Use this guide when starting or resuming a repository mission. The single assistant works directly with the user; specialist guides provide task-specific checks, not delegated roles.

## Bootstrap

1. Read `AGENTS.md`, `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`.
2. Read the relevant specialist contract/procedure:
   - Product/documentation: `agents/product/PRODUCT-WORKFLOW.md`
   - Feature: `agents/features/FEATURE-FACTORY-CONTRACT.md` and `agents/features/FEATURE-WORKFLOW.md`
   - Tool: `agents/tools/TOOL-FACTORY-CONTRACT.md` and `agents/tools/TOOL-WORKFLOW.md`
   - Audit: `agents/AUDIT-CONTRACT.md` and the relevant `agents/audits/` procedure
3. Read the canonical product, UX, architecture, privacy and decision documents relevant to the task.
4. Reconstruct current GitHub state: `main` HEAD, branches, open PRs, relevant Issues, CI and merge conditions. Never rely on conversation history as evidence.
5. Read the complete active mission Issue and relevant comments. Reconcile its plan, decisions, dependencies and next action against current reality.

## Collaboration

- Analyze the full relevant problem, dependencies, user journey and root causes. Challenge the request, current approach, decisions and your own recommendations.
- Recommend the best coherent solution and explain meaningful trade-offs. The user retains final authority over consequential product and architecture decisions.
- Discussion/decision and concrete implementation-plan approval are distinct. An objection is not closure; continue until the user makes the retained decision explicit.
- Put the concrete operational plan in the mission Issue. Before presenting it, compare all relevant Issue decisions/comments to planned tasks and acceptance evidence, then check the plan back against the Issue.
- Once the plan is final, give the user a concise decision brief in their language: goal, major changes and reasons, affected areas, meaningful risks/trade-offs/cost, success evidence, and the exact approval requested. Derive it from the Issue; do not create a competing plan. Ask for explicit plan approval only after this brief. Direction approval alone is not implementation approval.
- After explicit plan approval, implement and verify autonomously without repeated approval for routine steps. Use a brief internal quality review before sending responses; keep it natural and proportional rather than exposing a fixed checklist.
- Apply the common work contract's natural emoji convention without imposing a quota; functional product iconography remains governed by the design system.
- After plan validation, provide a ready-to-copy prompt for a fresh implementation conversation by default. It must point back to the Issue and require a fresh state check rather than duplicate the plan.
- Keep the Issue current at meaningful checkpoints. Track actionable deferred findings in existing or new Issues; tracking does not itself authorize implementation.
- Distinguish observed facts, measurements, deductions, hypotheses, proposals and unverified points. Never claim checks passed without evidence.
- Keep active documentation current. Historical audit reports are immutable.

If a required read is missing or incomplete, retrieve it before proceeding. If active documents conflict, resolve the contradiction explicitly rather than silently following stale guidance.
