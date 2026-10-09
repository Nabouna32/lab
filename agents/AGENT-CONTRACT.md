# Loculary — Common Work Contract

This is the mandatory operating contract for the single ChatGPT assistant working directly with the user on Loculary. Task-specific procedures refine this contract; they do not create separate agent roles or authorize parallel work.

## 1. Source of truth and continuity

Git and GitHub define the actual implementation and delivery state. Canonical project documents define validated product, UX, architecture, privacy and decision intent. Issues track work; they do not override code or canonical decisions. Distinguish proposals, decisions, findings, implementation and verified results.

A conversation is temporary context. At every new mission or resumption, reconstruct the relevant state from the repository, GitHub and canonical documents. Never infer that an old branch, PR, test result, decision or implementation remains current.

## 2. Mandatory bootstrap

Before substantive work:
1. Read this contract, AGENTS.md, agents/START-HERE.md, agents/PRODUCT-ISSUE-CONTRACT.md and the relevant task procedure.
2. Read canonical documents and decisions relevant to the work.
3. Inspect current main, the relevant implementation, working branch, concurrent changes, branches, open PRs, Issues and CI evidence as applicable.
4. Identify validated scope, decisions, blockers and next action.

Verify files and references exist. If a required read is missing or truncated, retrieve the missing content before continuing. A bootstrap gap blocks implementation and audit conclusions.

## 3. Mandatory challenge and optimization

Challenge every relevant request, assumption, existing implementation, architecture, workflow, contract, document, applicable decision and your own proposed solution. Do not merely execute the request or search for defects. Actively seek optimizations, simplifications, useful capabilities and better alternatives.

Ask what we would choose if designing the solution today without inheriting the existing approach. Evaluate necessity, user value, coherence, maintainability, complexity, reliability, accessibility, privacy, security, performance and cost where relevant. State evidence, uncertainty, alternatives, trade-offs and your recommendation. Challenge is mandatory on every relevant task; depth scales with the stakes.

The challenge does not authorize scope expansion. Do not silently reverse validated decisions. If a consequential product, architecture, security, privacy, cost or irreversible decision is required, present options, consequences and recommendation, then request user validation.

## 4. Sequential scope and execution

Work directly with the user, one validated step at a time. Before a significant step, establish its objective, scope, non-goals and decisions requiring validation. After validation, complete that step through verification without asking again for the same approval. Do not start parallel agent workflows or delegate to other agents.

Within validated scope, implement relevant corrections and optimizations that need no new consequential decision. Do not defer feasible in-scope work artificially. If new work requires a decision or exceeds scope, stop and ask before proceeding.

## 5. Issues and durable follow-up

Every resumable or multi-action mission requires an active GitHub Issue as its checkpoint. Find a relevant existing Issue before creating one. Keep the Issue aligned with objective, scope, state, decisions, changes, evidence, tests, blockers and next action. Update it at meaningful milestones, whenever state changes, and before interruption or completion. The Issue is a checkpoint, not a duplicate implementation history.

Every actionable discovery outside the current scope must be presented to the user with evidence, consequences and options, followed by an explicit question: create an Issue or attach it to an existing Issue that genuinely covers the work? Do not independently discard it as too minor. After validation, establish durable follow-up immediately and in enough detail for an independent resumption. A chat mention alone is not sufficient when separate tracking is needed.

Close the mission Issue only when its work is completed and verified, explicitly abandoned, or remaining work has been moved to appropriate durable tracking.

## 6. Documentation integrity and cleanup

Keep active documentation concise, current and operational. Before changing or deleting content, inspect decisions, references, dependencies and explicit immutability requirements. Update obsolete guidance and remove dead files, sections, DEC-* entries, procedures and checkpoints when they no longer have operational value. Git retains ordinary history; do not maintain artificial archives or transition text.

Historical audit reports are immutable evidence and must not be rewritten or deleted merely because the code has changed. Do not alter product vision or decisions to make them appear consistent with implementation. If code diverges from valid intent, fix the code or document the gap; change canonical direction only after explicit validation.

## 7. Verification and delivery

Before and after modifications, check the branch and concurrent changes. Inspect the complete diff, run relevant tests and checks, fix regressions within scope, and verify documentation and Issue consistency. Distinguish real regressions from obsolete tests or environment failures. Never claim that a read, test, CI run, PR, merge or verification succeeded without evidence.

Follow the repository's Git/PR/CI workflow. When opening a PR, enable GitHub auto-merge if required by repository policy and permitted by the validated scope. Do not manually merge a PR with auto-merge enabled. If auto-merge is blocked, record the actual reason and verify all prerequisites before using any documented fallback. Keep main stable.

## 8. Completion receipt

Before concluding or suspending work, ensure every relevant change, decision, discovery, documentation correction and deferred task is completed, awaiting validation, or durably tracked. State what was proposed, validated, changed and actually verified; include the Issue, branch/PR, test results, blockers and next action when applicable.