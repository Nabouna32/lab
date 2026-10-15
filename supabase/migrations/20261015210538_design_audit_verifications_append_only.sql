-- Verification records are evidence, so clients may append them but must not rewrite history.
drop policy if exists "Audit writers can update verifications" on public.design_audit_verifications;
revoke update on table public.design_audit_verifications from authenticated;
