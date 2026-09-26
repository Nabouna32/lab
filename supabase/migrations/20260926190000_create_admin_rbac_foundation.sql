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

create or replace function public.record_admin_audit(
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

revoke all on function public.record_admin_audit(text, text, uuid, jsonb) from public, anon;
grant execute on function public.record_admin_audit(text, text, uuid, jsonb) to authenticated;
