-- Secure future public functions created by the application migration owner.
-- PostgreSQL grants EXECUTE to PUBLIC by default unless this global default is revoked.
-- Schema-specific defaults are additive, so remove the API-role grants explicitly too.
alter default privileges for role postgres
  revoke execute on functions from public;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role;

-- Profile creation is owned by the Supabase Auth trigger, not the Data API.
revoke insert on table public.profiles from authenticated;
drop policy if exists "Users with a valid session can insert their own profile"
  on public.profiles;

-- This function is trigger-only; callers do not need direct EXECUTE privileges.
revoke execute on function public.set_profile_updated_at()
  from public, anon, authenticated;
