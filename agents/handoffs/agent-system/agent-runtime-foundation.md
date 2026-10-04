# Agent System — PostgreSQL Runtime Foundation

- Role: Meta-Agent
- Mission: implement PostgreSQL runtime orchestration foundation
- Issue: #309
- Branch: `feat/agent-runtime-foundation`
- Base: current `main` at mission start
- State: IMPLEMENTING
- Validated scope: Step 10B — runtime schema, atomic coordination functions, security boundary, migration, direct Supabase verification, documentation as required
- Non-goals: Tampermonkey adapter, external dispatcher, product/application changes, second project-state database
- Current action: create and verify runtime migration
- Next action: apply schema, run invariant/security tests, inspect diff, open PR
- Decisions validated:
  - PostgreSQL stores runtime coordination only.
  - Git/GitHub remain authoritative for code, branches, PRs, CI and merge.
  - Runtime uses a private non-exposed schema.
  - Resume request is not proof of worker resumption.
  - Lease expiry creates a recovery candidate and requires reconciliation.
- Verification: Supabase project ACTIVE_HEALTHY; no runtime tables existed before this mission.
- Last durable checkpoint update: 2026-10-04
