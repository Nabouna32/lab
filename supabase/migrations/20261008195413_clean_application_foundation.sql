-- Loculary clean-cut application foundation baseline.
--
-- Retained foundation only: Auth continuity, profiles, administrative RBAC and audit.
-- The legacy tool catalog and removed agent-runtime schema are intentionally absent.
-- This migration is designed for a fresh local Supabase reset. Production data
-- preservation and migration-history reset are separate cutover operations.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User-owned profile and account preferences that are safe to synchronize.';

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();

create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''));
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public;
revoke execute on function private.handle_new_user() from anon;
revoke execute on function private.handle_new_user() from authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create schema if not exists private;

create table public.admin_roles (
  key text primary key,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.admin_permissions (
  key text primary key,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.admin_role_permissions (
  role_key text not null references public.admin_roles(key) on delete cascade,
  permission_key text not null references public.admin_permissions(key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_key, permission_key)
);

create table public.admin_user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_key text not null references public.admin_roles(key) on delete restrict,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role_key)
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_user_roles_role_idx on public.admin_user_roles(role_key);
create index admin_user_roles_assigned_by_idx on public.admin_user_roles(assigned_by);
create index admin_audit_log_actor_idx on public.admin_audit_log(actor_user_id);
create index admin_audit_log_target_idx on public.admin_audit_log(target_type, target_id);
create index admin_audit_log_created_at_idx on public.admin_audit_log(created_at desc);

insert into public.admin_roles (key, name, description) values
  ('super_admin', 'Super administrator', 'Full administrative access.'),
  ('admin', 'Administrator', 'Operational administration without permission management.');

insert into public.admin_permissions (key, description) values
  ('admin.dashboard.view', 'View the administration dashboard.'),
  ('users.view', 'View user accounts and profiles.'),
  ('users.manage_roles', 'Assign and remove administrative roles.'),
  ('users.suspend', 'Suspend user accounts.'),
  ('audit.read', 'Read the administrative audit log.'),
  ('audit.write', 'Create administrative audit entries.');

insert into public.admin_role_permissions (role_key, permission_key)
select 'super_admin', key from public.admin_permissions;

insert into public.admin_role_permissions (role_key, permission_key) values
  ('admin', 'admin.dashboard.view'),
  ('admin', 'users.view'),
  ('admin', 'users.suspend'),
  ('admin', 'audit.read'),
  ('admin', 'audit.write');

create or replace function private.has_admin_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_user_roles ur
    join public.admin_role_permissions rp on rp.role_key = ur.role_key
    where ur.user_id = (select auth.uid())
      and rp.permission_key = requested_permission
  );
$$;

revoke all on function private.has_admin_permission(text) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.has_admin_permission(text) to authenticated;

create or replace function public.has_admin_permission(requested_permission text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.has_admin_permission(requested_permission);
$$;

revoke all on function public.has_admin_permission(text) from public, anon;
grant execute on function public.has_admin_permission(text) to authenticated;

alter table public.admin_roles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.admin_role_permissions enable row level security;
alter table public.admin_user_roles enable row level security;
alter table public.admin_audit_log enable row level security;

revoke all on table public.admin_roles, public.admin_permissions, public.admin_role_permissions,
  public.admin_user_roles, public.admin_audit_log from anon, authenticated;

grant select on public.admin_roles, public.admin_permissions, public.admin_role_permissions,
  public.admin_user_roles, public.admin_audit_log to authenticated;
grant insert, update, delete on public.admin_user_roles to authenticated;

create policy "Admins can read roles"
on public.admin_roles for select to authenticated
using ((select private.has_admin_permission('admin.dashboard.view')));

create policy "Admins can read permissions"
on public.admin_permissions for select to authenticated
using ((select private.has_admin_permission('admin.dashboard.view')));

create policy "Admins can read role permissions"
on public.admin_role_permissions for select to authenticated
using ((select private.has_admin_permission('admin.dashboard.view')));

create policy "Users can read their own admin roles"
on public.admin_user_roles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Authorized admins can read assigned roles"
on public.admin_user_roles for select to authenticated
using ((select private.has_admin_permission('users.view')));

create policy "Authorized admins can assign roles"
on public.admin_user_roles for insert to authenticated
with check (
  (select private.has_admin_permission('users.manage_roles'))
  and assigned_by = (select auth.uid())
);

create policy "Authorized admins can remove roles"
on public.admin_user_roles for delete to authenticated
using ((select private.has_admin_permission('users.manage_roles')));

create policy "Authorized admins can read audit log"
on public.admin_audit_log for select to authenticated
using ((select private.has_admin_permission('audit.read')));



create or replace function private.list_admin_users(search_term text default null)
returns table (user_id uuid,email text,display_name text,locale text,created_at timestamptz,last_sign_in_at timestamptz,email_confirmed_at timestamptz,banned_until timestamptz,roles text[])
language sql stable security definer set search_path = ''
as $$
  select u.id,u.email,p.display_name,p.locale,u.created_at,u.last_sign_in_at,u.email_confirmed_at,u.banned_until,
    coalesce(array_agg(ur.role_key order by ur.role_key) filter (where ur.role_key is not null),array[]::text[])
  from auth.users u
  left join public.profiles p on p.id=u.id
  left join public.admin_user_roles ur on ur.user_id=u.id
  where (select private.has_admin_permission('users.view'))
    and coalesce(u.is_anonymous,false)=false
    and (nullif(trim(search_term),'') is null or lower(coalesce(u.email,'')) like '%'||lower(trim(search_term))||'%' or lower(coalesce(p.display_name,'')) like '%'||lower(trim(search_term))||'%')
  group by u.id,u.email,p.display_name,p.locale,u.created_at,u.last_sign_in_at,u.email_confirmed_at,u.banned_until
  order by u.created_at desc limit 100;
$$;
revoke all on function private.list_admin_users(text) from public,anon,authenticated;
grant execute on function private.list_admin_users(text) to authenticated;
create or replace function public.list_admin_users(search_term text default null)
returns table (user_id uuid,email text,display_name text,locale text,created_at timestamptz,last_sign_in_at timestamptz,email_confirmed_at timestamptz,banned_until timestamptz,roles text[])
language sql stable security invoker set search_path = ''
as $$ select * from private.list_admin_users(search_term); $$;
revoke all on function public.list_admin_users(text) from public,anon;
grant execute on function public.list_admin_users(text) to authenticated;
create or replace function private.assign_admin_role(target_user_id uuid,target_role_key text)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if not (select private.has_admin_permission('users.manage_roles')) then raise exception 'Insufficient permission'; end if;
  if not exists (select 1 from auth.users where id=target_user_id) then raise exception 'Target user not found'; end if;
  if not exists (select 1 from public.admin_roles where key=target_role_key) then raise exception 'Unknown role'; end if;
  insert into public.admin_user_roles(user_id,role_key,assigned_by) values(target_user_id,target_role_key,(select auth.uid())) on conflict(user_id,role_key) do nothing;
  if found then insert into public.admin_audit_log(actor_user_id,action,target_type,target_id,metadata)
    values((select auth.uid()),'admin.role.assigned','user',target_user_id,jsonb_build_object('role_key',target_role_key)); end if;
  return true;
end; $$;
revoke all on function private.assign_admin_role(uuid,text) from public,anon,authenticated;
grant execute on function private.assign_admin_role(uuid,text) to authenticated;
create or replace function public.assign_admin_role(target_user_id uuid,target_role_key text)
returns boolean language sql security invoker set search_path = ''
as $$ select private.assign_admin_role(target_user_id,target_role_key); $$;
revoke all on function public.assign_admin_role(uuid,text) from public,anon;
grant execute on function public.assign_admin_role(uuid,text) to authenticated;


create or replace function private.record_admin_audit(
  audit_action text,
  audit_target_type text default null,
  audit_target_id uuid default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  audit_id uuid;
begin
  if not (select private.has_admin_permission('audit.write')) then
    raise exception 'Insufficient permission';
  end if;

  insert into public.admin_audit_log (
    actor_user_id,
    action,
    target_type,
    target_id,
    metadata
  )
  values (
    (select auth.uid()),
    audit_action,
    audit_target_type,
    audit_target_id,
    audit_metadata
  )
  returning id into audit_id;

  return audit_id;
end;
$$;

revoke all on function private.record_admin_audit(text, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function private.record_admin_audit(text, text, uuid, jsonb) to authenticated;

create or replace function public.record_admin_audit(
  audit_action text,
  audit_target_type text default null,
  audit_target_id uuid default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.record_admin_audit(audit_action, audit_target_type, audit_target_id, audit_metadata);
$$;

revoke all on function public.record_admin_audit(text, text, uuid, jsonb) from public, anon;
grant execute on function public.record_admin_audit(text, text, uuid, jsonb) to authenticated;

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

alter table public.admin_roles
  drop column name,
  drop column description;

alter table public.admin_permissions
  drop column description;

-- Cover the permission foreign key used by admin RBAC joins and deletes.
create index if not exists admin_role_permissions_permission_idx
  on public.admin_role_permissions(permission_key);

drop policy if exists "Users can read their own admin roles" on public.admin_user_roles;
drop policy if exists "Authorized admins can read assigned roles" on public.admin_user_roles;

create policy "Users and authorized admins can read admin roles"
on public.admin_user_roles
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.has_admin_permission('users.view'))
);

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

create or replace function private.list_admin_audit_log(limit_count integer default 50)
returns table(
  id uuid,
  actor_user_id uuid,
  actor_email text,
  action text,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    a.id,
    a.actor_user_id,
    u.email,
    a.action,
    a.target_type,
    a.target_id,
    a.metadata,
    a.created_at
  from public.admin_audit_log a
  left join auth.users u on u.id = a.actor_user_id
  where (select private.has_admin_permission('audit.read'))
  order by a.created_at desc
  limit least(greatest(coalesce(limit_count, 50), 1), 100);
$function$;

revoke all on function private.list_admin_audit_log(integer) from public, anon;
grant execute on function private.list_admin_audit_log(integer) to authenticated;

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

-- Restore application-private function access after the agent runtime schema hardening.
--
-- The agent runtime migration revoked all access to schema private for
-- public/anon/authenticated. The runtime was later removed, but the revoke
-- remained in the database and unintentionally disabled Loculary account/RBAC
-- functions that are intentionally callable by authenticated users.
--
-- Keep the private schema closed to anon/public and restore only the application
-- functions whose migrations explicitly grant authenticated execution.

grant usage on schema private to authenticated;

revoke all on function private.has_valid_session() from public, anon, authenticated;
grant execute on function private.has_valid_session() to authenticated;

revoke all on function private.has_admin_permission(text) from public, anon, authenticated;
grant execute on function private.has_admin_permission(text) to authenticated;

revoke all on function private.prepare_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.prepare_account_deletion(uuid) to authenticated;

revoke all on function private.list_admin_users(text) from public, anon, authenticated;
grant execute on function private.list_admin_users(text) to authenticated;

revoke all on function private.assign_admin_role(uuid, text) from public, anon, authenticated;
grant execute on function private.assign_admin_role(uuid, text) to authenticated;

revoke all on function private.remove_admin_role(uuid, text) from public, anon, authenticated;
grant execute on function private.remove_admin_role(uuid, text) to authenticated;

revoke all on function private.list_admin_audit_log(integer) from public, anon, authenticated;
grant execute on function private.list_admin_audit_log(integer) to authenticated;

revoke all on function private.revoke_admin_user_sessions(uuid) from public, anon, authenticated;
grant execute on function private.revoke_admin_user_sessions(uuid) to authenticated;

-- Explicit least-privilege profile grants.
revoke all on table public.profiles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
