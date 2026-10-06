# Feature Worker Checkpoint — contextual-next-actions

- **Role / mission:** Feature Worker — GitHub Issue #361, contextual Next actions
- **Branch / ref:** `feat/feature/contextual-next-actions`
- **Base SHA:** `6f144eead07b6399b75ebdae5b3c894569b0977b`
- **Current state:** RUNNING
- **Validated scope:** Replace generic similarity-based tool recommendations with optional contextual Next actions; preserve page architecture; keep locale, accessibility and anonymous usage intact; add focused semantic tests.
- **Completed milestones:**
  - Bootstrapped mandatory agent contracts and repository rules.
  - Revalidated Issue #361 and current main implementation.
  - Confirmed current relation engine uses shared names/tags/aliases/category rather than task continuation.
  - Confirmed current catalog has 42 published tools and the existing relation field is present but unused.
  - Confirmed only one unrelated open PR (#397) is active; no branch claims this mission.
- **Current action:** Run focused validation and inspect the complete branch diff.
- **Next action:** Rename `relatedToolIds` to `nextActionToolIds`, add a small curated relation map for genuinely natural continuations, replace similarity scoring with deterministic explicit lookup, update UI naming/tests/metadata validation, then run focused and repository validation.
- **Decisions already validated:** DEC-042 — Next actions are contextual and optional; generic similarity/shared metadata is insufficient.
- **Decisions still blocked:** None identified. No consequential product/architecture decision is required by the selected implementation.
- **Challenge performed:** Compared explicit curated relations, deterministic contextual rules, a hybrid model, and stricter similarity. Outcome: **adopt explicit curated relations** for the current ~42-tool catalog. They give the strongest semantic guarantee, are simple to audit and maintain, naturally support zero recommendations, and avoid false positives. Deterministic rules based on metadata still infer similarity rather than validated task continuation. A hybrid model adds complexity without current evidence of need. Retaining similarity conflicts with DEC-042. Existing `relatedToolIds` should not remain authoritative because its name encodes the rejected generic-relation semantics; replace it with `nextActionToolIds` rather than silently repurposing it.
- **Important files / areas:** `src/lib/tools/types.ts`, `src/lib/tools/tools.ts`, `src/lib/tools/metadata.ts`, `src/lib/tools/relations.ts`, `src/lib/tools/relations.test.mjs`, `src/components/tools/RelatedTools.tsx`, `src/lib/i18n/messages.ts`, related metadata tests/docs references.
- **Tests / checks:** Not run for implementation yet.
- **Last durable commit SHA:** `6f144eead07b6399b75ebdae5b3c894569b0977b` (base; checkpoint branch created from this commit).
- **Timestamp:** 2026-10-06T20:45:00+02:00

## Activity log
- 2026-10-06 — Bootstrap completed and Issue #361 verified against current GitHub/main.
- 2026-10-06 — Challenge completed; explicit curated Next actions selected.
