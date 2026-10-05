# Loculary — Agent Handoff and Checkpoint Contract

This contract defines how an agent survives the normal end, truncation, interruption or failure of a ChatGPT conversation.

## Meta-Agent recovery

The Meta-Agent has no permanent personal-memory checkpoint. When an `agent-system` mission is active, its mission checkpoint is stored at `agents/handoffs/agent-system/<mission-slug>.md` and records only that mission's resumable execution state.

The checkpoint MUST NOT duplicate the whole project state. It records mission-specific scope, progress, blockers, decisions, verification and next action.

On a new Meta-Agent conversation, perform the bootstrap from `agents/START-HERE.md`, identify active `agent-system` Issues and checkpoints, compare checkpoints with Git/GitHub, classify stale or conflicting information, and use authoritative sources rather than silently reconciling contradictions.

## Mission execution and recovery semantics

A checkpoint records the Worker execution state needed to recover work across conversations. It does not create a second execution or ownership system.

For implementation missions, keep the execution vocabulary minimal:

- READY — work is ready to start;
- RUNNING — a Worker is actively executing;
- WAITING — no current Worker action is required, including while external delivery progresses;
- WAITING_HUMAN — a consequential decision is required;
- BLOCKED — execution cannot proceed under current conditions;
- COMPLETED — mission-specific cleanup and verification is complete;
- ABANDONED — the mission was explicitly abandoned.

PR_OPEN, CI_WAITING, CI_FAILED, CI_PASSED, MERGE_READY and MERGED are GitHub delivery facts. A checkpoint may record them as observed evidence when needed for recovery, but GitHub remains authoritative.

When resuming work, the Worker must open the current conversation/work context, bootstrap, reconcile the checkpoint with Git/GitHub state, and continue only from evidence that remains valid.

A checkpoint never authorizes overwriting another Worker's branch or work.

## 1. Core principle

A ChatGPT conversation is disposable execution context.

An agent MUST assume that its current conversation may end at any moment. Work must therefore be persisted progressively in durable repository/GitHub state rather than only in the final response.

No handoff mechanism can guarantee persistence after a failure that occurs before a write or commit. The goal is to make the loss window small and make every completed milestone recoverable.

## 2. Durable checkpoint

Every resumable mission MUST maintain one active checkpoint:

- Product / Direction Agent: `agents/handoffs/product/<mission-slug>.md`
- Tool Worker / Feature Worker: `agents/handoffs/<role>/<mission-slug>.md`
- Audit Worker: `docs/audits/<audit-id>/WORKING.md`

The checkpoint is temporary working state, not historical evidence.

It MUST be created before substantive implementation/audit work begins when the mission can span multiple actions or conversations.

The checkpoint MUST be removed when the mission reaches a terminal state (`MERGED`, `ABANDONED`, or an equivalent completed audit state). Git history remains the historical trace.

## 3. Checkpoint contents

Keep the checkpoint compact. It MUST record:

- role and mission;
- branch/ref and current base SHA;
- current state;
- validated scope;
- completed milestones;
- current action;
- next action;
- decisions already validated;
- decisions still blocked;
- challenge performed: the important assumption/proposal/design challenged, credible alternative considered, outcome and unresolved trade-offs;
- important files/areas touched;
- tests/checks and their actual status;
- last durable commit SHA;
- timestamp of the latest checkpoint.

It SHOULD include a short activity log containing the most recent meaningful actions.

Do not copy large code blocks, logs, secrets, credentials or unnecessary conversation text into the checkpoint.

## 4. Write-before / write-after protocol

For any checkpoint-worthy action that may take time, mutate GitHub, change many files, run a long validation, or materially change the mission:

1. write the intended action and expected outcome to the checkpoint;
2. persist that checkpoint durably (normally a commit);
3. perform the action;
4. record the actual result, failures and next action;
5. persist the updated checkpoint again.

This creates a durable record even if the conversation dies during the action.

For small atomic actions, several closely related actions may be grouped into one checkpoint.

## 5. Checkpoint cadence

Do not wait for the end of a conversation.

Checkpoint at minimum:

- after bootstrap/discovery;
- after scope/decision validation;
- before and after a substantial implementation batch;
- before and after a significant test/verification run;
- before GitHub mutations such as PR/merge operations;
- whenever a blocker or consequential decision is discovered;
- before voluntarily starting a new conversation.

A worker SHOULD checkpoint more frequently when the work is risky or the conversation is approaching context limits.

## 6. Recovery protocol

At the start of every new conversation, after the mandatory bootstrap:

1. look for an active checkpoint for the mission;
2. inspect its branch/ref and last durable commit;
3. inspect GitHub for the branch/PR;
4. inspect the actual repository state;
5. compare the checkpoint against Git/GitHub;
6. verify any recorded challenge/decision against the current authoritative evidence; a stale challenge outcome must be re-evaluated rather than blindly replayed;
7. classify the checkpoint as:
   - `CURRENT`;
   - `STALE`;
   - `CONFLICTING`;
   - `ORPHANED`;
8. resume from the durable state rather than restarting.

If the checkpoint conflicts with Git/GitHub, Git/GitHub wins. Do not blindly replay actions.

If no checkpoint exists, reconstruct from Git/GitHub and continue only after establishing a new checkpoint.

## 7. Crash and truncation reality

The agent MUST NOT claim that the checkpoint is guaranteed to exist after every individual model/tool failure.

The smallest unavoidable loss window is between a durable write and the failure.

Therefore:

- persist before risky operations;
- keep checkpoints small;
- commit completed milestones;
- never keep the only copy of an important decision in chat;
- never treat the final assistant message as required state.

## 8. Git is the primary durable journal

For implementation workers, meaningful completed work SHOULD be committed at stable milestones.

The checkpoint's `last durable commit` must identify the latest commit known to contain the recorded completed state.

Uncommitted working-tree state may exist, but it is not considered durable across independent ChatGPT conversations unless the execution environment itself is known to persist it.

## 9. Audit-specific recovery

Audits are otherwise read-only.

To make an interrupted audit recoverable, `WORKING.md` is the only additional temporary audit artifact permitted by the audit contract.

It may contain partial observations and progress, but it is not an audit report and MUST NOT be cited as historical evidence.

When an audit completes:

1. create the immutable historical report;
2. update `LATEST.md`;
3. remove `WORKING.md`.

If an audit fails or is interrupted, leave `WORKING.md` intact so the next audit conversation can resume or explicitly abandon it.

## 10. Completion

A mission must not leave a misleading active checkpoint after reaching a terminal state.

For implementation missions, completion MUST use this ordering:

1. finish the implementation and verification work;
2. update the checkpoint with the final known state and verification;
3. include deletion of the active checkpoint in the final implementation/cleanup PR;
4. keep the Issue non-terminal while that PR is open or awaiting CI;
5. merge the PR only after required CI/verification is green;
6. only after the merge, mark/close the Issue as terminal.

The final PR MUST therefore contain the checkpoint deletion. An agent MUST NOT open a final implementation PR while leaving the active checkpoint intended to survive that merge.

For abandoned missions, the checkpoint deletion MUST be included in the abandonment change before the Issue is closed whenever repository changes are applicable.

Before deleting the checkpoint, record the final durable state in the PR/report/history appropriate to the specialization. Git history remains the historical trace.

The next conversation must be able to determine that the mission is complete without the deleted checkpoint.

## 11. Minimal recovery information

A new conversation should need only:

- its role;
- its mission, if known;
- the repository;
- the normal `START-HERE.md` launch prompt.

Everything else must be discoverable from the repository/GitHub state.
