# Audit mission output contract

This specialized contract inherits the mandatory rules in [`agents/AGENT-CONTRACT.md`](./AGENT-CONTRACT.md). Read the common contract first. It defines conversation-independent bootstrap, anti-skipping, source precedence, ownership, verification and continuity requirements.

This document is the canonical output contract for every autonomous Loculary audit mission.

Each mission in `agents/audits/` must read and obey this contract. If a mission contains more specific rules, they may refine the contract only when they do not weaken or contradict these requirements.

## 1. Audit identity

Every mission has a stable numeric audit ID and a mission slug.

Example:

- mission: `agents/audits/11-performance.md`
- audit ID: `11`
- report directory: `docs/audits/11-performance/`

The numeric ID is historical identity. It must not be silently reused for a different audit domain.

## 2. Sequential recovery

An audit mission is tracked by its active GitHub Issue when it spans multiple actions or conversations. The Issue is the durable execution checkpoint: update it with current state, completed milestones, current/next action, decisions, blockers, challenge outcome and verification evidence.

The same assistant conducts the audit sequentially with the user. Before continuing, inspect the active Issue, Git state and any linked PR.

Git/GitHub remain authoritative for repository and delivery state. The Issue is the durable mission checkpoint, not a second implementation history.

## 3. Repository state

The audit always targets the real current repository state.

The report must record:

- repository;
- audited Git commit SHA;
- branch/ref when relevant;
- audit execution timestamp in UTC;
- relevant environment/tooling information.

Do not infer the current state from an earlier conversation or an older audit report.

## 3A. Crash-resilient audit execution

An audit may be interrupted before its historical report is written. Its active GitHub Issue is the recovery point for resumable audit work. Update the Issue before and after substantial audit actions and whenever a blocker or consequential decision is discovered.

Do not create `WORKING.md` or another repository checkpoint file. Historical audit reports remain immutable and are created only when the audit run is complete.

## 4. GitHub Issue tracking

An audit MAY use a GitHub Issue as a durable work item when useful. The shared Issue rules are defined in `agents/PRODUCT-ISSUE-CONTRACT.md`.

Use the Issue to:
- summarize the audit mission or an actionable follow-up;
- link the historical report and relevant Issue checkpoint;
- record decisions and next actions;
- record actionable follow-up and, after validation, continue it as a separately scoped step with the same assistant.

Do not create an Issue for every finding. Informational findings, proposals awaiting validation, and observations that need no follow-up remain in the audit report.

When a finding becomes actionable implementation work, create or reuse the appropriate Issue and link it to the historical audit report. The Issue does not replace the report.

## 5. Allowed repository changes

An audit is not an implementation task.

During the audit, do **not** modify:

- product code;
- tests;
- configuration;
- dependencies;
- product documentation;
- architecture/UX/vision/decision documents;
- Git history;
- previous audit reports.

The assistant conducting the audit may persist durable mission state in the active GitHub Issue and, at completion, create the immutable historical report and update its `LATEST.md` pointer. No repository checkpoint file is created.

## 6. Historical report naming

Every execution creates a new report:

`docs/audits/<audit-id>/<timestamp>.md`

The timestamp must be:

- UTC;
- ISO-8601;
- filesystem-safe;
- unique for the execution.

Canonical example:

`docs/audits/11-performance/2026-10-04T09-30-00Z.md`

Never overwrite an existing historical report.

If a timestamp collision is possible, append a deterministic suffix rather than replacing the existing file.

## 7. Historical immutability

Previous reports are historical evidence.

Never:

- delete an older report;
- overwrite an older report;
- rewrite an older report to reflect current code;
- merge a new run into an older report.

A rerun audits the current repository independently.

When relevant, the new report must explicitly classify previous findings as:

- still present;
- corrected since the previous audit;
- changed;
- no longer reproducible;
- superseded;
- not rechecked.

An old report does not prove that a finding still exists.

## 8. LATEST.md

After creating the historical report, update:

`docs/audits/<audit-id>/LATEST.md`

`LATEST.md` is a replaceable index, not historical evidence.

It should contain only concise pointer metadata, for example:

- audit ID;
- mission path;
- latest report path;
- audited commit;
- execution timestamp;
- status.

It must not be the only location containing audit findings.

## 9. Required report structure

Unless the mission has a justified domain-specific extension, the report must contain:

1. **Metadata**
2. **Audited commit**
3. **Scope**
4. **Environment and tools**
5. **Methodology and coverage**
6. **Observed results**
7. **Findings and anomalies**
8. **Weaknesses and suboptimal choices**
9. **Challenges to the current design**
10. **Elements to preserve**
11. **Proposals**
12. **Decisions requiring explicit validation**
13. **Implementation scope and plan**
14. **Tests and verification**
15. **Implementation continuation prompt**
16. **Conclusion**

A mission may add sections when necessary, but must not remove information required to understand what was actually audited.

## 9A. Mandatory challenge of the current design

Every audit MUST actively challenge the current design, assumptions and existing implementation choices within the audit scope. The challenge section is not optional polish and must not be reduced to a list of defects.

For material areas, the audit should explicitly ask:

- Is the current approach actually necessary?
- Is there a simpler, safer, more maintainable or more reliable alternative?
- What would we choose if Loculary were built today?
- Which existing decision should be preserved despite an apparent opportunity to change it?

The audit must distinguish observed evidence from its proposed alternative. A challenge is a finding or recommendation only when evidence supports it; it does not automatically become an implementation requirement.

## 10. Finding classification

Every material finding must distinguish its epistemic status.

Use one or more of these explicit labels:

- **OBSERVED** — directly established from the repository or execution;
- **MEASURED** — supported by a concrete measurement;
- **DEDUCED** — reasoned from observed evidence;
- **PROPOSED** — a suggested improvement, not a current fact;
- **À VALIDER** — requires an explicit product/architecture/security/etc. decision;
- **CORRIGÉ DEPUIS UN AUDIT PRÉCÉDENT** — a previous finding was verified as corrected;
- **TOUJOURS PRÉSENT** — a previous finding was reverified and remains valid.

Do not present a proposal, deduction, or assumption as an observed fact.

## 11. Severity

When the domain supports severity, classify findings consistently, for example:

- **CRITICAL** — severe security, data-loss, production, or product failure;
- **HIGH** — major reliability, security, accessibility, UX, performance, or correctness issue;
- **MEDIUM** — meaningful weakness or technical/product debt;
- **LOW** — limited impact or polish issue;
- **INFO** — useful observation without a direct defect.

Severity is distinct from epistemic status.

## 12. Evidence

Prefer evidence over assertions.

For important findings, record enough context to allow a later implementation step to reproduce or verify the claim, such as:

- file/path;
- relevant symbol or route;
- command/test used;
- measurement;
- browser/device context;
- expected vs actual behavior;
- affected user journey.

Do not include secrets, credentials, tokens, or unnecessary personal data in the report.

## 13. Previous audits

Previous reports are inputs, not authorities.

When previous reports exist, use them to identify regressions and verify the evolution of findings, but always validate against the current repository.

Do not copy stale findings into the new report without rechecking them.

## 14. Implementation prompt

The report must end with a complete, copy-pastable prompt for an autonomous implementation step.

That prompt must:

- restate the verified problem;
- identify the intended scope;
- distinguish facts from proposals;
- identify decisions already validated vs decisions still requiring validation;
- specify relevant files/docs to inspect;
- require tests and verification;
- require diff review;
- require documentation updates where appropriate;
- prohibit unrelated scope expansion.

The implementation prompt is a recommendation produced by the audit. It does not itself authorize implementation.

## 14A. Post-audit review and validated continuation

Completing an audit does not end the discussion. The same assistant may explain findings, challenge proposed fixes, compare alternatives and continue with implementation in a new, explicitly scoped step after the user validates it.

When the user continues after the report:
1. Clarify the finding and its evidence.
2. Present meaningful alternatives, risks, consequences and a recommendation.
3. Ask for validation when the recommendation requires a consequential decision or changes scope.
4. For actionable work outside the current scope, ask whether to create a dedicated Issue or attach it to an existing relevant Issue.
5. Once the next step is validated, update the active mission Issue and implement only that scope.
6. Verify implementation, documentation, tests and diff before reporting completion.

A request to continue the explanation is not automatically approval for a consequential change. If the user's intent is genuinely ambiguous, ask a short clarification question.

### Audit boundary

The audit execution itself remains read-only for product code, tests, configuration and canonical specifications. It may create the new immutable report and update that audit's LATEST.md pointer as defined by this contract. A validated implementation is a separate step by the same assistant, not delegated to a separate role.

## 15. Product decisions

An audit may recommend a change, but it must not silently convert a recommendation into a product decision.

In particular, assistant conducting the audits must not directly rewrite:

- `docs/VISION.md`;
- `docs/PRODUCT.md`;
- `docs/UX.md`;
- `docs/ARCHITECTURE.md`;
- `docs/DECISIONS.md`;
- `docs/FUTURE.md`;
- `AGENTS.md`.

If a finding requires a product or architecture decision, record it under **Decisions requiring explicit validation**.

## 16. Quality bar

The audit should:

- inspect the real implementation rather than only documentation;
- test or measure important claims whenever practical;
- identify both defects and suboptimal working choices;
- challenge the current design;
- include a from-scratch question: **If Loculary were built today, what would we change?**
- state clearly what should be preserved;
- avoid unnecessary recommendations that do not improve the product.

The goal is actionable evidence, not a long list of theoretical concerns.
