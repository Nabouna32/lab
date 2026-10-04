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

## 2. Repository state

The audit always targets the real current repository state.

The report must record:

- repository;
- audited Git commit SHA;
- branch/ref when relevant;
- audit execution timestamp in UTC;
- relevant environment/tooling information.

Do not infer the current state from an earlier conversation or an older audit report.

## 3. Allowed repository changes

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

The audit agent may persist its own result only by:

1. creating a new historical report under its own `docs/audits/<audit-id>/` directory;
2. updating that audit's `LATEST.md` pointer.

No other repository modification is part of the audit output contract unless the mission explicitly grants additional scope.

## 4. Historical report naming

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

## 5. Historical immutability

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

## 6. LATEST.md

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

## 7. Required report structure

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
15. **Autonomous implementation-agent prompt**
16. **Conclusion**

A mission may add sections when necessary, but must not remove information required to understand what was actually audited.

## 8. Finding classification

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

## 9. Severity

When the domain supports severity, classify findings consistently, for example:

- **CRITICAL** — severe security, data-loss, production, or product failure;
- **HIGH** — major reliability, security, accessibility, UX, performance, or correctness issue;
- **MEDIUM** — meaningful weakness or technical/product debt;
- **LOW** — limited impact or polish issue;
- **INFO** — useful observation without a direct defect.

Severity is distinct from epistemic status.

## 10. Evidence

Prefer evidence over assertions.

For important findings, record enough context to allow a later implementation agent to reproduce or verify the claim, such as:

- file/path;
- relevant symbol or route;
- command/test used;
- measurement;
- browser/device context;
- expected vs actual behavior;
- affected user journey.

Do not include secrets, credentials, tokens, or unnecessary personal data in the report.

## 11. Previous audits

Previous reports are inputs, not authorities.

When previous reports exist, use them to identify regressions and verify the evolution of findings, but always validate against the current repository.

Do not copy stale findings into the new report without rechecking them.

## 12. Implementation prompt

The report must end with a complete, copy-pastable prompt for an autonomous implementation agent.

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

## 13. Product decisions

An audit may recommend a change, but it must not silently convert a recommendation into a product decision.

In particular, audit agents must not directly rewrite:

- `docs/VISION.md`;
- `docs/PRODUCT.md`;
- `docs/UX.md`;
- `docs/ARCHITECTURE.md`;
- `docs/DECISIONS.md`;
- `docs/FUTURE.md`;
- `AGENTS.md`.

If a finding requires a product or architecture decision, record it under **Decisions requiring explicit validation**.

## 14. Quality bar

The audit should:

- inspect the real implementation rather than only documentation;
- test or measure important claims whenever practical;
- identify both defects and suboptimal working choices;
- challenge the current design;
- include a from-scratch question: **If Loculary were built today, what would we change?**
- state clearly what should be preserved;
- avoid unnecessary recommendations that do not improve the product.

The goal is actionable evidence, not a long list of theoretical concerns.
