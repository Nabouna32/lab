-- Prevent Data API table writes from bypassing the guarded role-management RPCs.
--
-- Role assignment/removal must pass through the SECURITY DEFINER functions,
-- which enforce the last-super-admin invariant and write audit events.
-- Keep SELECT and the existing RLS policies; revoke only direct table DML.

-- The repository baseline defines the private guarded removal function but
-- omits the public RPC wrapper already called by the admin UI. Restore the
-- expected SECURITY INVOKER boundary without exposing the private function
-- or changing its authorization, invariant, and audit behavior.
create or replace function public.remove_admin_role(
  target_user_id uuid,
  target_role_key text
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.remove_admin_role(target_user_id, target_role_key);
$$;

revoke all on function public.remove_admin_role(uuid, text) from public, anon;
grant execute on function public.remove_admin_role(uuid, text) to authenticated;

revoke insert, delete on table public.admin_user_roles from authenticated;
