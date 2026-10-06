# Feature Worker — account-auth-regression

- role: Feature Worker
- mission: Issue #364 — investigate and securely fix account profile/admin access regression
- branch: feat/feature/account-auth-regression
- base SHA: ebf412a3e6ab8cca3ca45f2e7711477e480bf408
- current state: IMPLEMENTED_PENDING_VALIDATION
- validated scope: revalidate current Auth/SSR/session/RLS/admin behavior; preserve revoked-session protection; implement only the smallest justified fix; add focused regression coverage; verify GitHub delivery.
- completed milestones: bootstrap; current main/ownership; production profile/role/session verification; production migration/function inspection; Supabase SSR documentation comparison; identified proxy response replacement mismatch with current official SSR pattern; implemented the response-preserving proxy fix.
- evidence: production retains profile Benjamin, super_admin role and a current Auth session; the protected account/admin symptoms therefore remain consistent with refreshed session cookies not being propagated through the final Proxy response. Supabase's current Next.js SSR guidance explicitly recreates NextResponse.next({ request }) inside setAll before attaching refreshed cookies/headers; the project previously mutated the original response in place.
- implementation: src/lib/supabase/proxy.ts now follows that current response replacement pattern while preserving getClaims(), request cookie propagation, response cookie propagation and response headers.
- security invariant: private.has_valid_session() and live-session RLS remain unchanged; no authorization check was weakened.
- next action: verify the branch diff, run the project's available validation/CI through GitHub, then complete the handoff/PR only if checks pass.
- tests/checks: not yet run after implementation
- implementation commit: a71bd2939544220431cd885a1ec7a98576ba1870
- timestamp: 2026-10-06T19:00:00+02:00
