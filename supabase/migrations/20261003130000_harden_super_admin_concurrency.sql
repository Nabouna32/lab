-- Preserve the last-super-admin invariant under concurrent account deletion and role removal.
--
-- Both self-deletion and administrative removal of the super_admin role serialize on
-- the same transaction-scoped advisory lock. Without this, two concurrent operations
-- could each observe another super_admin and both make the final protected account
-- disappear.

create or replace function private.prepare_account_deletion(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_super_admin boolean;
  other_super_admins integer;
begin
  if (target_user_id is null or (select auth.uid()) is null or target_user_id <> (select auth.uid())) then
    raise exception 'Unauthorized account deletion request';
  end if;

  if not (select private.has_valid_session()) then
    raise exception 'Invalid session';
  end if;

  -- Serialize all operations that can remove a super_admin account/role.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('loculary.account-deletion.super-admin', 0)
  );

  select exists (
    select 1
    from public.admin_user_roles
    where user_id = target_user_id
      and role_key = 'super_admin'
  ) into is_super_admin;

  if is_super_admin then
    select count(*)
      into other_super_admins
    from public.admin_user_roles
    where role_key = 'super_admin'
      and user_id <> target_user_id;

    if other_super_admins = 0 then
      raise exception 'Cannot delete the last super_admin account';
    end if;
  end if;

  update public.admin_audit_log
     set actor_user_id = null
   where actor_user_id = target_user_id;

  update public.admin_audit_log
     set target_id = null
   where target_type = 'user'
     and target_id = target_user_id;

  return true;
end;
$$;

revoke all on function private.prepare_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.prepare_account_deletion(uuid) to authenticated;

create or replace function private.remove_admin_role(target_user_id uuid,target_role_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining_super_admins integer;
begin
  if not (select private.has_admin_permission('users.manage_roles')) then
    raise exception 'Insufficient permission';
  end if;

  if target_role_key = 'super_admin' then
    -- Use the same lock as account deletion so two concurrent role removals
    -- cannot both observe the other super_admin and remove the final two roles.
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('loculary.account-deletion.super-admin', 0)
    );

    select count(*)
      into remaining_super_admins
    from public.admin_user_roles
    where role_key = 'super_admin'
      and user_id <> target_user_id;

    if remaining_super_admins = 0 then
      raise exception 'Cannot remove the last super_admin role';
    end if;
  end if;

  delete from public.admin_user_roles
   where user_id = target_user_id
     and role_key = target_role_key;

  if found then
    insert into public.admin_audit_log(actor_user_id,action,target_type,target_id,metadata)
    values(
      (select auth.uid()),
      'admin.role.removed',
      'user',
      target_user_id,
      jsonb_build_object('role_key',target_role_key)
    );
  end if;

  return true;
end;
$$;

revoke all on function private.remove_admin_role(uuid,text) from public,anon,authenticated;
grant execute on function private.remove_admin_role(uuid,text) to authenticated;
