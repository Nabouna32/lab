# Audit 99 — Final pre-launch readiness

## Identity

- **Audit ID:** 99
- **Slug:** final-launch
- **Procedure:** `agents/audits/99-final-launch.md`
- **New reports:** `docs/audits/99-final-launch/`

This is the final transversal readiness audit to execute before a production launch. The existence of this procedure is not evidence that Loculary is ready to launch. It must be executed against the then-current repository and deployment state.

## Objective

Determine whether Loculary can responsibly launch by challenging the complete product and its operational readiness. Verify critical user journeys, security and privacy, data handling, accessibility, responsive UX, localization, tool correctness, performance, SEO, observability, resilience, CI/release, deployment configuration, backup/recovery and unresolved high-impact findings. Do not repeat specialist audits mechanically; look for cross-domain failures and false assurances.

## Method

1. Reconstruct current GitHub, deployment and environment state; record the exact commit/ref and UTC timestamp.
2. Read `AGENTS.md`, `agents/AUDIT-CONTRACT.md`, relevant canonical specifications and current specialist audit reports.
3. Inspect implemented code and deployment evidence; documentation alone is not proof of readiness.
4. Run only the checks and measurements available and relevant to the actual launch decision. Record unavailable checks as unverified.
5. Exercise the most important user journeys and failure paths where tools permit. Verify rollback/recovery and incident visibility where applicable.
6. Challenge assumptions and previously accepted decisions when current evidence suggests they are harmful.
7. Classify each finding by evidence status and severity. Separate launch blockers from material risks and post-launch improvements.
8. Keep the audit read-only. Do not change product code or canonical product decisions during the audit.

## Launch decision

The report must give one evidence-backed recommendation: **READY**, **READY WITH EXPLICITLY ACCEPTED RISKS**, or **NOT READY**. For each high-impact finding, state evidence, user/business consequence, remediation or mitigation, owner/Issue link and verification required. A risk requiring user acceptance must be presented for explicit decision; do not infer acceptance.

Do not mark the product ready solely because automated checks pass or earlier audits exist. Record gaps in evidence and the residual risk of each unverified area. If a critical check cannot be performed, explain whether this prevents a responsible readiness conclusion.

## Output

Follow `agents/AUDIT-CONTRACT.md`. Create a new immutable report under `docs/audits/99-final-launch/<UTC timestamp>.md` and update only that directory's replaceable `LATEST.md` pointer. Never rename, edit or delete historical reports from previous audit IDs. The report must include the audited commit, environment, coverage, findings, retained/challenged decisions, readiness recommendation, required decisions, verification evidence and linked follow-up Issues.
