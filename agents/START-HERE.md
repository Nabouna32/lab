# Loculary — Work Entry Point

Use this guide when starting or resuming a repository mission. The single assistant works directly with the user; specialist guides provide task-specific checks, not delegated roles.

The bootstrap below is a required action, not an assumption about context: fetch and read the current repository files through the available GitHub tools. Do not infer that a new conversation has already loaded them. If a required file cannot be read, report the limitation before relying on it.

## Bootstrap

1. Read `AGENTS.md`, `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`; the common contract is canonical for shared collaboration, continuity and delivery rules.
2. Read the relevant specialist contract/procedure:
   - Product/documentation: `agents/product/PRODUCT-WORKFLOW.md`
   - Feature: `agents/features/FEATURE-FACTORY-CONTRACT.md` and `agents/features/FEATURE-WORKFLOW.md`
   - Tool: `agents/tools/TOOL-FACTORY-CONTRACT.md` and `agents/tools/TOOL-WORKFLOW.md`
3. Read the canonical product, UX, architecture, privacy and decision documents relevant to the task.
4. Reconstruct current GitHub state: `main` HEAD, branches, open PRs, relevant Issues, CI and merge conditions. Never rely on conversation history as evidence.
5. Read the complete active mission Issue and relevant comments. Reconcile its plan, decisions, dependencies and next action against current reality.

## Collaboration

- Analyze the full relevant problem, dependencies, user journey and root causes. Challenge the request, current approach, decisions and your own recommendations.
- Recommend the best coherent solution and explain meaningful trade-offs. The user retains final authority over consequential product and architecture decisions.
- Read-only investigation, audits and source inspection are the assistant’s responsibility; never ask the user to approve an audit or investigation method. Discuss consequential direction until the user makes the retained decision explicit.
- Before changing repository files, present an accessible, evidence-based explanation of the concrete changes, why they are needed, alternatives, recommendation, trade-offs, risks, uncertainties and exclusions. The user must be able to decide without reading the Issue, audit report or code.
- The explicit green light applies to the explained change proposal, not the audit, investigation method or technical plan. Do not modify the repository before approval. After approval, write/update the detailed plan in the Issue for internal execution; do not ask the user to approve it.
- Implement and verify the approved result autonomously, including routine technical choices and fixes. If new evidence materially changes the approved outcome or significant risk, pause and discuss before proceeding. Use a brief internal quality review; do not expose a mechanical checklist.
- Apply the common work contract's natural emoji convention without imposing a quota; functional product iconography remains governed by the design system.
- Continue in the current conversation while it remains useful; do not require a new conversation or handoff prompt by default. If a handoff becomes genuinely useful because of context limits or continuity needs, update the Issue checkpoint first and ground the prompt in current repository/GitHub state.
- Keep the Issue current at meaningful checkpoints. Track actionable deferred findings in existing or new Issues; tracking does not itself authorize implementation.
- Distinguish observed facts, measurements, deductions, hypotheses, proposals and unverified points. Never claim checks passed without evidence.
- Keep active documentation current. Record investigation conclusions when they remain useful for a decision or actionable follow-up; do not create permanent reports by default.

If a required read is missing or incomplete, retrieve it before proceeding. If active documents conflict, resolve the contradiction explicitly rather than silently following stale guidance.
