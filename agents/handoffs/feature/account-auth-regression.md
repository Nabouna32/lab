# Feature Worker — account-auth-regression

- role: Feature Worker
- mission: Issue #364 — investigate and securely fix account profile/admin access regression
- branch: feat/feature/account-auth-regression
- base SHA: ebf412a3e6ab8cca3ca45f2e7711477e480bf408
- current state: RUNNING
- validated scope: revalidate current Auth/SSR/session/RLS/admin behavior; preserve revoked-session protection; implement only the smallest justified fix; add focused regression coverage; verify GitHub delivery.
- completed milestones: bootstrap; current main/ownership; production Supabase migration/function state; strict session check confirmed in production; log query did not yield usable PostgreSQL evidence.
- current action: inspect current Auth/SSR session flow and determine whether strict session validation receives stale/missing session_id or failure is elsewhere
- next action: complete evidence-based challenge; implement only if DEC-037 can be preserved without a new consequential decision; otherwise stop and request validation
- validated decisions: DEC-037; Issue #364 security requirements
- challenge: do not remove has_valid_session merely to restore access; alternatives are repairing SSR/session propagation or another server-side revocation check
- important areas: supabase/migrations/20261003111925_complete_account_lifecycle.sql; src/lib/supabase/server.ts; src/lib/supabase/proxy.ts; src/app/[locale]/compte/actions.ts; src/app/[locale]/compte/page.tsx
- tests/checks: not run; discovery/investigation only
- last durable commit: ebf412a3e6ab8cca3ca45f2e7711477e480bf408
- timestamp: 2026-10-06T10:26:00+02:00
