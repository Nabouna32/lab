begin;

-- The preparation RPC used to anonymize audit references in a transaction that
-- ended before the Auth Admin API deleted the user. Keep the preflight read-only
-- and make the Auth-row deletion itself the authoritative transaction boundary.
drop function if exists public.prepare_account_deletion(uuid);
drop function if exists private.prepare_account_deletion(uuid);

create or replace function private.check_account_deletion(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_super_admin boolean;
begin
  if target_user_id is null
     or (select auth.uid()) is null
     or target_user_id <> (select auth.uid()) then
    raise exception 'Unauthorized account deletion request';
  end if;

  if not (select private.has_valid_session()) then
    raise exception 'Invalid session';
  end if;

  select exists (
    select 1
    from public.admin_user_roles
    where user_id = target_user_id
      and role_key = 'super_admin'
  ) into is_super_admin;

  if is_super_admin and not exists (
    select 1
    from public.admin_user_roles
    where role_key = 'super_admin'
      and user_id <> target_user_id
  ) then
    raise exception 'Cannot delete the last super_admin account';
  end if;

  -- This function is only a UX preflight. The DELETE trigger below is the
  -- authoritative guard because this transaction ends before the Auth API call.
  return true;
end;
$$;

revoke all on function private.check_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.check_account_deletion(uuid) to authenticated;

create or replace function public.check_account_deletion(target_user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.check_account_deletion(target_user_id);
$$;

revoke all on function public.check_account_deletion(uuid) from public, anon;
grant execute on function public.check_account_deletion(uuid) to authenticated;

-- Keep the old RPC name as a read-only compatibility alias: Supabase Edge
-- Functions are not deployed by the repository's current CI workflow, so an
-- already-deployed account-delete function may still call this name. It must
-- no longer perform any irreversible preparation side effect.
create or replace function public.prepare_account_deletion(target_user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.check_account_deletion(target_user_id);
$$;

revoke all on function public.prepare_account_deletion(uuid) from public, anon;
grant execute on function public.prepare_account_deletion(uuid) to authenticated;

create or replace function private.guard_auth_user_deletion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_super_admin boolean;
begin
  -- Share the lock used by private.remove_admin_role. Lock unconditionally so
  -- concurrent role changes and account deletions use the same serialization point.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('loculary.account-deletion.super-admin', 0)
  );

  select exists (
    select 1
    from public.admin_user_roles
    where user_id = old.id
      and role_key = 'super_admin'
  ) into is_super_admin;

  if is_super_admin and not exists (
    select 1
    from public.admin_user_roles
    where role_key = 'super_admin'
      and user_id <> old.id
  ) then
    raise exception 'Cannot delete the last super_admin account';
  end if;

  -- actor_user_id is cleared atomically by its ON DELETE SET NULL foreign key.
  -- target_id is polymorphic and has no FK, so clear user targets in this same
  -- transaction. Any later failure rolls this update back with the Auth delete.
  update public.admin_audit_log
     set target_id = null
   where target_type = 'user'
     and target_id = old.id;

  return old;
end;
$$;

revoke all on function private.guard_auth_user_deletion() from public, anon, authenticated;

drop trigger if exists guard_auth_user_deletion on auth.users;
create trigger guard_auth_user_deletion
before delete on auth.users
for each row
execute function private.guard_auth_user_deletion();

commit;
