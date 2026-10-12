# Audit 32 — Agent-system governance and workflow

## Identity

- **Audit ID:** 32
- **Slug:** agent-system
- **Procedure:** `agents/audits/32-agent-system.md`
- **Reports:** `docs/audits/32-agent-system/`

## Objective

Assess whether Loculary's agent instructions and collaboration workflow remain the best design for direct work between the user and one assistant. Verify that the system can be resumed from current GitHub evidence without relying on conversation memory and that its contracts lead to coherent, autonomous, verifiable delivery.

## Required coverage

1. **Bootstrap and source of truth:** `AGENTS.md`, `agents/START-HERE.md`, the common contract, mission Issue contract, canonical product documents and current GitHub state.
2. **Decision rights:** challenge of vision and existing decisions; user authority over consequential choices; distinction between opinion, decision, approval of the explained change proposal and routine implementation.
3. **Proposal-to-implementation traceability:** compare the complete active Issue and relevant comments bidirectionally against the approved change proposal, internal operational plan, acceptance criteria, implementation and evidence. The user approves the explained changes, not the internal plan.
4. **Autonomy and escalation:** verify that read-only investigation and factual checkpoints need no approval, routine technical work and failed-check diagnosis proceed without repetitive approval, and material changes to the approved outcome or significant risk are escalated.
5. **Issue continuity:** checkpoints, fresh-conversation handoff, recovery after interruption, deferred findings and duplicate-Issue checks.
6. **Contract coherence:** identify duplicated, contradictory, stale or overly mechanical instructions across shared and specialist procedures.
7. **Validator quality:** inspect what the validator actually proves, its structural assumptions, stale wording checks, audit IDs and reference integrity.
8. **CI efficiency and coverage:** verify exact path triggers, lightweight governance validation, full-suite gating, required checks and the manual-only PR policy for E2E/screenshots.
9. **Delivery integrity:** branch isolation, full diff review, current base/head, waiting for all required checks, merge protections and truthful reporting.
10. **Communication and evidence:** clear separation of observed facts, measurements, deductions, hypotheses, proposals, unresolved questions and verified results; generous natural emoji cues without mechanical receipts or UI-icon changes.
11. **Portfolio and interruption judgment:** prioritization by severity, dependency, risk, cost of delay and rework; recommendations to pause or continue without silently changing priority.
12. **Rebuild challenge:** if the agent system were designed today from zero, what should be retained, consolidated, replaced or removed, and why?

## Method

- Inspect current repository files and GitHub configuration; never treat previous audit reports or conversation context as current proof.
- Trace active references and test the validator/CI behavior where possible.
- Distinguish OBSERVED, MEASURED, DEDUCED, HYPOTHESIS, PROPOSED, À VALIDER and NON VÉRIFIÉ.
- Preserve domain-specific checks that demonstrably add value. Do not optimize for document count or shorter text alone.
- Keep the audit read-only except for its new historical report and replaceable `LATEST.md` pointer.

## Output

Follow `agents/AUDIT-CONTRACT.md`. Record findings, severity, evidence, contradictions, challenge of the current design, recommended architecture, decisions requiring validation and actionable follow-up Issues. Create a new immutable report under `docs/audits/32-agent-system/<UTC timestamp>.md` and update that directory's `LATEST.md` pointer only after the report exists.
