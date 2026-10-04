# Agent System — PostgreSQL Runtime Foundation

- Role: Meta-Agent
- Mission: implement PostgreSQL runtime orchestration foundation
- Issue: #309
- Branch: `feat/agent-runtime-foundation`
- Base: current `main` at mission start
- State: PR_PREPARATION
- Validated scope: Step 10B — runtime schema, atomic coordination functions, security boundary, migration, direct Supabase verification, documentation as required
- Non-goals: Tampermonkey adapter, external dispatcher, product/application changes, second project-state database
- Current action: inspect final diff and prepare PR
- Next action: open PR, wait for CI, fix only mission-related failures
- Decisions validated:
  - PostgreSQL stores runtime coordination only.
  - Git/GitHub remain authoritative for code, branches, PRs, CI and merge.
  - Runtime uses a private non-exposed schema.
  - Resume request is not proof of worker resumption.
  - Lease expiry creates a recovery candidate and requires reconciliation.
- Verification: migration SQL executed successfully inside a transaction and rolled back; dependency blocking/readiness, atomic claim/release, duplicate-claim rejection, idempotent event ingestion and resume acknowledgement paths were exercised. Production schema was not modified. Supabase migration history remains unchanged.
- Last durable checkpoint update: 2026-10-04
