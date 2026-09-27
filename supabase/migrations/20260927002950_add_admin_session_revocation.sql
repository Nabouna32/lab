create or replace function private.revoke_admin_user_sessions(target_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  if not (select private.has_admin_permission('users.suspend')) then
    raise exception 'Insufficient permission';
  end if;

  delete from auth.sessions
  where user_id = target_user_id;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function private.revoke_admin_user_sessions(uuid) from public, anon, authenticated;
grant execute on function private.revoke_admin_user_sessions(uuid) to authenticated;

create or replace function public.revoke_admin_user_sessions(target_user_id uuid)
returns integer
language sql
security invoker
set search_path = ''
as $$
  select private.revoke_admin_user_sessions(target_user_id);
$$;

revoke all on function public.revoke_admin_user_sessions(uuid) from public, anon;
grant execute on function public.revoke_admin_user_sessions(uuid) to authenticated;
