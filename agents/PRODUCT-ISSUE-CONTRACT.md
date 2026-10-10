# Loculary — GitHub Issue Protocol

GitHub Issues provide durable mission checkpoints and follow-up tracking. They do not replace Git, implementation evidence or canonical decisions.

## 1. Mission Issue requirement

Every Loculary mission requires an active GitHub Issue checkpoint, including implementation, audit, product, documentation, governance and other repository work. Reuse an existing Issue when it genuinely covers the scope; otherwise create a dedicated Issue after bootstrap. A question or discussion that is not a repository mission does not require an Issue.

Before creating an Issue, search existing Issues and inspect relevant branches and PRs. Reuse an Issue only when it actually covers the work.

## 2. Mission checkpoint

The active Issue is the durable checkpoint for resumable work. Keep it concise and update it at every meaningful milestone, whenever decisions, blockers or verification state change, and before interruption or completion.

Include as applicable:
- objective, type and current state;
- validated scope and non-goals;
- observed evidence and relevant source links;
- proposals, validated decisions and decisions awaiting the user;
- completed changes and exact branch/PR;
- tests and verification results;
- blockers and next action.

Do not paste complete reports, source files, logs, secrets or conversation transcripts. Git/GitHub remain authoritative for code, branches, PRs, CI and merge state.

## 3. Actionable discoveries outside scope

For every actionable discovery that will not be handled in the current validated step:
1. record the evidence, consequences, uncertainty and likely next action;
2. search existing Issues for one that genuinely covers the work;
3. update the matching Issue, or create a dedicated Issue if none exists, with enough context for independent resumption;
4. tell the user what was tracked and why.

Do not ask permission merely to create durable tracking, and do not implement the discovery without user validation. Do not silently dismiss actionable work as too minor or turn a finding into a product requirement without validation. A chat mention alone is not a substitute for durable tracking.

## 4. Decision and status integrity

Clearly distinguish observed evidence, deduction, proposal, decision awaiting validation, validated decision, implementation and verified completion. An Issue is not a decision record unless the relevant decision is explicit and validated. A green-looking PR or an Issue marked complete is not proof of successful verification.

## 5. Scope and authorization

An Issue records and tracks work; it does not grant blanket authorization to exceed the validated scope or make consequential product, architecture, security, privacy, cost or irreversible decisions. Present options, consequences and a recommendation, then request validation when required.

Within validated scope, perform relevant routine corrections and optimizations without artificial deferral.

## 6. Recovery and closure

A resumable mission should be recoverable from:
Issue → Git branch/PR → canonical documentation and verification evidence.

Never create repository checkpoint files. Close the mission Issue only when its work is completed and verified, explicitly abandoned, or remaining work has been moved to appropriate durable tracking. Record the actual final state and any remaining blocker before closure.

## 7. Prohibited uses

Issues must not become a runtime state database, duplicate implementation history, substitute for canonical documentation, or automatic authorization for consequential decisions.