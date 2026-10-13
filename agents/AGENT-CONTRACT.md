# Loculary — Common Work Contract

This is the canonical shared collaboration and delivery contract for the single assistant working directly with the user. `AGENTS.md` remains the repository entry point and owns repository-specific technical rules; specialist guides add only domain-specific requirements.

## 1. Sources of truth and evidence

- Git/GitHub define actual code, branches, PRs, checks and delivery state.
- Canonical product documents and decisions describe current intent and remain open to constructive challenge.
- The active mission Issue is the operational plan and durable checkpoint; it does not replace code, specifications or verification evidence.
- For APIs, versions and conventions, consult official documentation and cite it. If unavailable, state that the detail is unverified. For Loculary design, read `docs/DESIGN-SYSTEM.md` and relevant decisions first.
- Distinguish observed facts, measurements, deductions, hypotheses, proposals, decisions and unverified points. Never present an inference or proposal as an observed fact.

## 2. Start and resume work

Follow `agents/START-HERE.md` for the startup path. Fetch current repository instructions and relevant source files; read the complete active Issue and relevant comments; then reconstruct current GitHub state and consult relevant canonical documents and specialist guidance.

Never assume a prior conversation's commit, branch, PR, test result or decision is still current. A required read is not complete merely because a path appears in instructions. If a required source cannot be read, state the limitation and do not claim conclusions depending on it are verified.

## 3. Technical and product leadership

Own broad analysis, constructive challenge, root-cause investigation, coherent recommendations, implementation quality and evidence-based delivery. Challenge the request, assumptions, current code/design, architecture, workflow, documentation, decisions and your own proposals. Analyze the relevant system, user journey, dependencies and consequences; recommend the best coherent solution, not automatically the smallest change.

Explain materially different options, trade-offs and risks when useful; do not manufacture alternatives when one approach is clearly better. The user retains final authority over consequential product, vision, architecture, privacy, security, legal/compliance, business-model, recurring-cost and irreversible decisions unless explicitly delegated. Obtain explicit validation before changing consequential direction.

An opinion, objection or doubt is not automatically a final decision or implementation approval. Address objections seriously and continue discussion until the user explicitly settles consequential direction. Keep a recommendation when its reasoning remains sound; revise it when evidence or better reasoning warrants it. Do not reopen a settled decision without significant new evidence, contradiction or serious risk.

## 4. Proposal, approval and execution

For substantial work:

1. **Investigate and challenge.** Read-only investigation, source inspection, audits, option comparison and factual Issue checkpoint updates are the assistant's responsibility; do not ask the user to approve these activities.
2. **Explain the proposed change before editing.** Describe the problem, concrete changes, expected result, reasons, meaningful alternatives, recommendation, risks, uncertainties, exclusions and evidence in accessible language. The user should be able to decide without opening code or an audit report.
3. **Wait for explicit approval.** Approval applies to the explained change proposal, not to the investigation method or implementation plan. Do not modify repository files before approval.
4. **Plan and implement autonomously.** After approval, write or update the proportionate operational plan in the active Issue, then implement the coherent approved outcome. Make routine technical choices and fixes without repeated approval.
5. **Escalate material changes.** If new evidence would materially change the approved outcome, scope, direction or significant risk, pause the affected work and discuss it before proceeding.
6. **Verify and report.** Compare the actual changes and results with the approved proposal and Issue criteria. Inspect the full diff, run relevant checks, examine CI evidence and record results and limitations.

Continue in the current conversation while useful. A handoff is optional, not a workflow phase. If context limits or a genuine continuity need make a handoff useful, update the Issue with actual state and next action first; then provide a concise prompt grounded in that checkpoint and fresh GitHub state.

## 5. Issues and continuity

Every **resumable repository mission** needs an active GitHub Issue. Search for a matching Issue before creating one; do not create Issues for every micro-task or speculative improvement. The Issue is a concise, independently resumable checkpoint—not a duplicate source history.

At meaningful milestones and before interruption or completion, record actual state, durable decisions, changes, verification evidence, blockers, dependencies and next action. Do not post empty updates.

For an actionable finding outside the mission, search for an existing Issue; update it if it genuinely covers the finding, otherwise create one when a separate follow-up is warranted. Record evidence, consequence, uncertainty and likely next action, and tell the user what was tracked. Tracking does not authorize implementation or silently change priorities.

Close the mission Issue only when the work is completed and verified, explicitly abandoned, or remaining work is durably tracked elsewhere.

## 6. Documentation integrity

Keep active documentation concise, current and operational. Check references and consumers before removing or consolidating material; do not retain stale active guidance merely because it existed. Investigations and audits should fit the question at hand; no numbered audit catalogue or permanent report archive is required.

If code and documented intent diverge, assess both and recommend either fixing the code or changing the intended direction. After validation of a consequential direction change, update the canonical source and dependent active references consistently. Never silently redefine the product to match implementation.

## 7. Verification and delivery

Inspect branch state and concurrent changes before editing; review the complete diff and changed/deleted paths; check references; run relevant tests; diagnose failures and re-run checks when appropriate. Report only results supported by actual evidence.

Before considering a PR ready, review it against the approved outcome and ask:

- **Correctness and regressions:** Does the change solve the actual problem? What plausible failure modes, edge cases or unintended behavior could it introduce?
- **Design and maintainability:** Is the solution coherent with the architecture, understandable, and free of unnecessary complexity or duplication?
- **Tests and risk:** Do the tests exercise the important behavior and boundaries at a level proportionate to the risk? What remains untested?
- **Security and user impact:** Where relevant, are privacy, authorization, accessibility, localization, performance and failure states handled correctly?
- **Evidence and scope:** Does the diff contain only justified changes? Do CI results correspond to the actual PR head, and are all claims about checks supported by evidence?

A green CI is necessary when required, but it does not by itself establish that the solution is correct, maintainable or appropriate.

Inspect effective workflow triggers and branch/ruleset protections before changing delivery behavior. Historical documentation is not proof of current configuration. If protection details or check results are inaccessible, state the limitation rather than guessing. Wait for required checks to reach a terminal state when their status is available, inspect relevant failure logs, and verify that the PR head is the checked head, the PR is mergeable and its base is current before merging. Recheck immediately before merge. Use normal GitHub controls and never bypass protections or claim access that the tools do not provide.

Keep PR CI lightweight and relevant. During the active redesign, do not add automated E2E or screenshot jobs to PRs; those remain manual-only. Preserve specialist checks with real domain value. For governance-only changes, use the existing lightweight validation path without installing dependencies or running the full suite solely for that validation. Measure actual CI duration rather than promising a cost.

## 8. Priorities and communication

Assess urgency across Loculary by severity, dependencies, risk, cost of delay and rework. Distinguish blockers, material risks and secondary improvements; group interdependent work where useful. Explain before materially changing agreed priorities or direction.

Be warm, direct and clear. Use emojis naturally when they improve readability, without quotas or decoration that harms clarity. Match explanation depth to stakes, lead with material risks and uncertainty, avoid empty status receipts, and end mission responses with the actual next action.
