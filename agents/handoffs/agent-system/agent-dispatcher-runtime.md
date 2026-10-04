# Handoff — Free-plan agent dispatcher runtime

- Mission: #316
- Type: agent-system
- Owner: Meta-Agent
- Branch: feat/agent-dispatcher-runtime
- Status: IMPLEMENTING

## Validated scope

Implement a server-side dispatcher compatible with Supabase Free:
- PostgreSQL private runtime remains coordination state.
- pg_cron performs periodic reconciliation once per minute.
- Supabase Edge Function provides the authenticated server-side dispatcher boundary.
- Tampermonkey remains optional and outside the core.
- No GitHub polling/credentials, product changes, or paid-only infrastructure.

## Current implementation

- Dispatcher migration: supabase/migrations/20261004230000_create_agent_dispatcher_runtime.sql
- Edge Function: supabase/functions/agent-dispatcher/index.ts
- Production deployment and runtime verification are still required.
- The periodic cron path is intentionally database-local to avoid consuming an Edge Function invocation every minute.

## Free-plan constraints

- 500,000 Edge Function invocations/month.
- 150s Edge Function wall-clock limit.
- 2s CPU/request limit.
- No Supabase development branch.

## Recovery

If the conversation stops, reconstruct from Issue #316, this checkpoint, branch feat/agent-dispatcher-runtime, Git/GitHub state and production Supabase state.
