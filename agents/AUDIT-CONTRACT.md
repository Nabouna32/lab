# Loculary — Audit Contract

This contract defines audit-specific methodology and immutable reporting. Collaboration, decisions, mission Issues and delivery inherit `agents/AGENT-CONTRACT.md` and `agents/PRODUCT-ISSUE-CONTRACT.md`.

## 1. Audit identity and procedure

Each active audit procedure is identified by the pair **numeric ID + slug** under `agents/audits/`. Specialist procedure IDs must be contiguous from `01` through `32`; audit `99` is excluded from that sequence and reserved uniquely for final pre-launch readiness. The validator checks the sequence, uniqueness, declared ID/slug and procedure/report paths, and catalogue references. A retired numeric ID may be reused only after checking active references and repository history. Reuse does not permit overwriting, deleting or renaming historical reports: report directories remain separated by slug.

Read the relevant procedure and canonical product/technical sources before drawing conclusions. The procedure defines the domain-specific questions and evidence, not a limit on investigating connected systems or root causes.

## 2. Read-only audit and report lifecycle

An audit examines the real current repository state. During the audit, do not change product code, tests, configuration, dependencies or canonical product documents. The audit's active Issue is the operational checkpoint and may be updated as work proceeds.

At completion, create a new historical report at:

`docs/audits/<id>-<slug>/<UTC timestamp>.md`

Use a filesystem-safe ISO-8601 UTC timestamp, for example `2026-10-11T21-30-00Z.md`. Never overwrite or delete an existing historical report. Update the replaceable `LATEST.md` pointer only after creating the new report. If a run is interrupted, update the Issue; do not create repository checkpoint files or incomplete historical reports.

## 3. Required report content

Unless a justified domain-specific extension is needed, every report includes:

1. Metadata and audited commit SHA.
2. Execution timestamp, branch/ref and environment/tooling.
3. Audit objective and coverage.
4. Methodology and evidence sources.
5. Observed results and measurements.
6. Findings, anomalies, weaknesses and suboptimal choices.
7. Challenge to the current design and assumptions.
8. Elements worth retaining or changing, with reasons.
9. Recommendations and materially different alternatives.
10. Decisions requiring explicit validation.
11. Verification performed, results and limitations.
12. Conclusion and links to resulting Issues when applicable.

An audit report is historical evidence, not the active implementation plan. The mission Issue owns the operational plan for any follow-up implementation. An audit recommendation does not itself authorize implementation.

## 4. Mandatory challenge

Challenge relevant assumptions and current implementation, including choices that work but may be unnecessarily complex, fragile, expensive or inconsistent. Ask what we would choose if building the solution today. Assess connected systems and root causes where needed for a sound conclusion.

Challenge is evidence-led, not a mandate to invent defects. Distinguish observed facts from deductions, hypotheses and proposals. A finding does not automatically become a product requirement.

## 5. Evidence and uncertainty

Use explicit epistemic labels for material claims:

- **OBSERVED** — directly established from repository or execution.
- **MEASURED** — supported by a concrete measurement.
- **DEDUCED** — reasoned from observed evidence.
- **HYPOTHESIS** — plausible but not yet established.
- **PROPOSED** — suggested improvement, not a current fact.
- **À VALIDER** — requires a consequential decision.
- **NON VÉRIFIÉ** — the available tools or evidence could not establish it.

Record paths, symbols, commands, measurements, expected/actual behavior or user journey context sufficient to reproduce important findings. Never include secrets or unnecessary personal data.

## 6. Severity

Where useful, classify findings independently of their evidence status:

- **CRITICAL** — severe security, data-loss, production or core-product failure.
- **HIGH** — major reliability, security, accessibility, UX, performance or correctness issue.
- **MEDIUM** — meaningful weakness or debt.
- **LOW** — limited impact or polish.
- **INFO** — useful observation without a direct defect.

## 7. Previous reports

Previous reports are inputs, not current truth. Revalidate old findings against the current repository. When a new report revisits them, classify each as still present, corrected, changed, no longer reproducible, superseded or not rechecked. Historical reports remain immutable.

## 8. Follow-up

Search for a matching Issue for each actionable finding. Link the report and evidence; update a genuinely matching Issue or create a dedicated one. Prioritize by severity, dependencies, risk, cost of delay and rework. Do not implement consequential follow-up without the normal discussion and explicit approval of the explained change proposal; the operational plan is internal to the assistant and does not require user approval.

A new-conversation handoff is optional, not a default step. If context limits or continuity needs make one useful, update the mission Issue checkpoint first and ground the prompt in current repository state.
