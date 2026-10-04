# Loculary — Active Agent Handoffs

This directory contains temporary, branch-local checkpoints for resumable Tool and Feature Workers.

## Paths

- Tool Worker: `agents/handoffs/tool/<slug>.md`
- Feature Worker: `agents/handoffs/feature/<slug>.md`

These files are **working state**, not product documentation and not historical evidence.

## Lifecycle

1. Create the checkpoint after bootstrap and before substantive work.
2. Record the validated scope and current state.
3. Persist intended work before checkpoint-worthy actions.
4. Persist the actual result after those actions.
5. Keep the latest durable commit SHA in the checkpoint.
6. Reconcile the checkpoint with Git/GitHub when a new conversation resumes.
7. Remove the checkpoint when the mission reaches a terminal state.

Do not store secrets, credentials, full logs or large code excerpts.

The canonical format and recovery rules live in `agents/HANDOFF-CONTRACT.md`.
