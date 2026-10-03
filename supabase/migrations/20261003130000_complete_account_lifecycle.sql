-- Complete account lifecycle hardening.
-- Audit history is retained after account deletion, but direct user identity references are
-- cleared so the audit log does not block deletion or retain the deleted user's Auth id.

alter table public.admin_audit_log
  alter column actor_user_id drop not null;

alter table public.admin_audit_log
  drop constraint if exists admin_audit_log_actor_user_id_fkey;

alter table public.admin_audit_log
  add constraint admin_audit_log_actor_user_id_fkey
  foreign key (actor_user_id) references auth.users(id) on delete set null;

alter table public.profiles
  drop constraint if exists profiles_display_name_length_check;

alter table public.profiles
  add constraint profiles_display_name_length_check
  check (display_name is null or char_length(display_name) <= 80);

create or replace function private.has_valid_session()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.sessions s
    where s.id::text = ((select auth.jwt()) ->> 'session_id')
      and s.user_id = (select auth.uid())
  );
$$;

revoke all on function private.has_valid_session() from public, anon, authenticated;

grant usage on schema private to authenticated;

grant execute on function private.has_valid_session() to authenticated;

create or replace function private.has_admin_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select private.has_valid_session())
    and exists (
      select 1
      from public.admin_user_roles ur
      join public.admin_role_permissions rp on rp.role_key = ur.role_key
      where ur.user_id = (select auth.uid())
        and rp.permission_key = requested_permission
    );
$$;

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

  -- Preserve the audit event itself while removing direct references to the deleted user.
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

create or replace function public.prepare_account_deletion(target_user_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.prepare_account_deletion(target_user_id);
$$;

revoke all on function public.prepare_account_deletion(uuid) from public, anon;
grant execute on function public.prepare_account_deletion(uuid) to authenticated;

-- Profile access is tied to a live Auth session, not merely an unexpired JWT.
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users with a valid session can view their own profile"
  on public.profiles for select to authenticated
  using ((select private.has_valid_session()) and (select auth.uid()) = id);

create policy "Users with a valid session can insert their own profile"
  on public.profiles for insert to authenticated
  with check ((select private.has_valid_session()) and (select auth.uid()) = id);

create policy "Users with a valid session can update their own profile"
  on public.profiles for update to authenticated
  using ((select private.has_valid_session()) and (select auth.uid()) = id)
  with check ((select private.has_valid_session()) and (select auth.uid()) = id);
