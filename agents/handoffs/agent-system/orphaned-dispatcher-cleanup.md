# Agent-System Handoff — orphaned dispatcher cleanup

- Role: Meta-Agent
- Mission: remove the obsolete deployed agent-dispatcher implementation and align repository documentation with the already-removed PostgreSQL runtime.
- Branch: chore/remove-orphaned-dispatcher
- Base SHA: de851b896e6c9e4d3d22949278fd64cf371510c6
- State: READY_FOR_PR
- Validated scope: remove `supabase/functions/agent-dispatcher/`; remove obsolete dispatcher/runtime implementation sections from `docs/DATABASE.md`; record the superseding decision without deleting historical runtime migrations; do not touch Loculary application tables/functions, tool catalog, auth, profiles/RBAC/audit logs, or unrelated cron jobs.
- Challenge: keeping the unused dispatcher and runtime design documented would preserve dead infrastructure and mislead future agents. Simpler alternative is to remove the runtime implementation and retain historical migrations/decision history. Outcome: adopt cleanup; preserve historical Git records.
- Current action: final cleanup checkpoint removal and PR delivery.
- Next action: open the cleanup PR, wait for required CI/E2E, merge if green, then verify production Edge Function deletion separately through the Supabase Dashboard if the connector cannot perform it.
- Important files: supabase/functions/agent-dispatcher/index.ts; docs/DATABASE.md; docs/DECISIONS.md
- Verification: production PostgreSQL runtime tables/functions and pg_cron dispatcher already verified removed; repository source/docs cleanup is implemented; deployed agent-dispatcher Edge Function remains ACTIVE and requires Dashboard deletion.
- Last durable commit: de851b896e6c9e4d3d22949278fd64cf371510c6
