begin;

select plan(38);

-- Transaction-scoped Auth fixtures for exercising the guarded role RPCs.
-- The test file rolls back at the end; these users/sessions never persist.
insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'authenticated',
    'authenticated',
    'pgtap-role-actor@example.invalid',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"pgTAP role actor"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'authenticated',
    'authenticated',
    'pgtap-role-target@example.invalid',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"pgTAP role target"}'::jsonb,
    now(),
    now()
  );

insert into auth.sessions (id, user_id, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000101',
  now(),
  now()
);

-- Seed the actor as the sole super_admin for this transaction so the test
-- can verify both ordinary role operations and the last-super-admin guard.
insert into public.admin_user_roles (user_id, role_key, assigned_by)
values (
  '00000000-0000-0000-0000-000000000101',
  'super_admin',
  '00000000-0000-0000-0000-000000000101'
);

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='profiles' and c.relkind='r'),
  'profiles table exists'
);

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_roles' and c.relkind='r'),
  'admin_roles table exists'
);

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_permissions' and c.relkind='r'),
  'admin_permissions table exists'
);

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_user_roles' and c.relkind='r'),
  'admin_user_roles table exists'
);

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_audit_log' and c.relkind='r'),
  'admin_audit_log table exists'
);

select is(
  (select count(*)::integer from public.admin_roles),
  2,
  'only the two retained administrative roles are seeded'
);

select is(
  (select count(*)::integer from public.admin_permissions),
  6,
  'only the six non-catalog administrative permissions are seeded'
);

select ok(
  not exists (
    select 1
    from public.admin_permissions
    where key like 'catalog.%'
  ),
  'catalog permissions are absent from the new foundation'
);

select ok(
  not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relname like 'tool_%'
  ),
  'legacy tool catalog tables are absent'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='profiles'),
  'profiles has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_user_roles'),
  'admin_user_roles has RLS enabled'
);

select ok(
  (select has_table_privilege('anon', 'public.profiles', 'SELECT') is false),
  'anon has no profile SELECT privilege'
);

select ok(
  (select has_table_privilege('authenticated', 'public.profiles', 'SELECT')),
  'authenticated can SELECT profiles subject to RLS'
);

select ok(
  (select has_table_privilege('authenticated', 'public.admin_user_roles', 'UPDATE') is false),
  'authenticated has no direct admin_user_roles UPDATE privilege'
);

select ok(
  (select has_table_privilege('authenticated', 'public.admin_user_roles', 'INSERT') is false),
  'authenticated cannot INSERT admin_user_roles directly through the Data API'
);

select ok(
  (select has_table_privilege('authenticated', 'public.admin_user_roles', 'DELETE') is false),
  'authenticated cannot DELETE admin_user_roles directly through the Data API'
);

select ok(
  (select has_table_privilege('authenticated', 'public.admin_user_roles', 'SELECT')),
  'authenticated retains SELECT on admin_user_roles'
);

select ok(
  has_function_privilege('authenticated', 'public.assign_admin_role(uuid,text)', 'EXECUTE'),
  'authenticated can execute the guarded assign_admin_role RPC'
);

select ok(
  not has_function_privilege('anon', 'public.assign_admin_role(uuid,text)', 'EXECUTE'),
  'anon cannot execute assign_admin_role and receives no PUBLIC EXECUTE grant'
);

select ok(
  not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where n.nspname = 'public'
      and p.proname = 'assign_admin_role'
      and pg_get_function_identity_arguments(p.oid) = 'uuid, text'
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ),
  'assign_admin_role has no direct EXECUTE grant to PUBLIC'
);

select ok(
  has_function_privilege('authenticated', 'public.remove_admin_role(uuid,text)', 'EXECUTE'),
  'authenticated can execute the guarded remove_admin_role RPC'
);

select ok(
  not has_function_privilege('anon', 'public.remove_admin_role(uuid,text)', 'EXECUTE'),
  'anon cannot execute remove_admin_role and receives no PUBLIC EXECUTE grant'
);

select ok(
  not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where n.nspname = 'public'
      and p.proname = 'remove_admin_role'
      and pg_get_function_identity_arguments(p.oid) = 'uuid, text'
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ),
  'remove_admin_role has no direct EXECUTE grant to PUBLIC'
);

select ok(
  exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='private'
      and p.proname='has_valid_session'
      and p.prosecdef
  ),
  'private.has_valid_session is SECURITY DEFINER'
);

select ok(
  exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='private'
      and p.proname='prepare_account_deletion'
      and p.prosecdef
  ),
  'private.prepare_account_deletion is SECURITY DEFINER'
);

-- Exercise the public RPCs as authenticated with a valid Auth session.
do $fixtures$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
  perform set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-000000000101","session_id":"00000000-0000-0000-0000-000000000103","role":"authenticated","aud":"authenticated"}',
    true
  );
end;
$fixtures$;

set local role authenticated;

select throws_ok(
  'insert into public.admin_user_roles (user_id, role_key, assigned_by) values (''00000000-0000-0000-0000-000000000102''::uuid, ''admin'', ''00000000-0000-0000-0000-000000000101''::uuid)',
  '42501',
  'permission denied for table admin_user_roles',
  'authenticated direct INSERT is rejected'
);

select throws_ok(
  'delete from public.admin_user_roles where user_id = ''00000000-0000-0000-0000-000000000101''::uuid and role_key = ''super_admin''',
  '42501',
  'permission denied for table admin_user_roles',
  'authenticated direct DELETE is rejected'
);

select lives_ok(
  'select public.assign_admin_role(''00000000-0000-0000-0000-000000000102''::uuid, ''admin'')',
  'guarded RPC assigns a role to an existing user'
);

select is(
  (select count(*)::integer from public.admin_user_roles
   where user_id = '00000000-0000-0000-0000-000000000102' and role_key = 'admin'),
  1,
  'role assignment creates the expected role binding'
);

select is(
  (select assigned_by from public.admin_user_roles
   where user_id = '00000000-0000-0000-0000-000000000102' and role_key = 'admin'),
  '00000000-0000-0000-0000-000000000101'::uuid,
  'role assignment records the authenticated actor'
);

select is(
  (select count(*)::integer from public.admin_audit_log
   where actor_user_id = '00000000-0000-0000-0000-000000000101'
     and action = 'admin.role.assigned'
     and target_type = 'user'
     and target_id = '00000000-0000-0000-0000-000000000102'
     and metadata ->> 'role_key' = 'admin'),
  1,
  'role assignment writes its audit event'
);

select lives_ok(
  'select public.assign_admin_role(''00000000-0000-0000-0000-000000000102''::uuid, ''admin'')',
  'repeating role assignment remains successful'
);

select is(
  (select count(*)::integer from public.admin_audit_log
   where actor_user_id = '00000000-0000-0000-0000-000000000101'
     and action = 'admin.role.assigned'
     and target_id = '00000000-0000-0000-0000-000000000102'
     and metadata ->> 'role_key' = 'admin'),
  1,
  'idempotent duplicate assignment does not duplicate the audit event'
);

select lives_ok(
  'select public.remove_admin_role(''00000000-0000-0000-0000-000000000102''::uuid, ''admin'')',
  'guarded RPC removes an assigned role'
);

select ok(
  not exists (select 1 from public.admin_user_roles
              where user_id = '00000000-0000-0000-0000-000000000102' and role_key = 'admin'),
  'role removal deletes the expected role binding'
);

select is(
  (select count(*)::integer from public.admin_audit_log
   where actor_user_id = '00000000-0000-0000-0000-000000000101'
     and action = 'admin.role.removed'
     and target_type = 'user'
     and target_id = '00000000-0000-0000-0000-000000000102'
     and metadata ->> 'role_key' = 'admin'),
  1,
  'role removal writes its audit event'
);

select throws_ok(
  'select public.remove_admin_role(''00000000-0000-0000-0000-000000000101''::uuid, ''super_admin'')',
  'P0001',
  'Cannot remove the last super_admin role',
  'guarded RPC refuses to remove the last super_admin role'
);

select ok(
  exists (select 1 from public.admin_user_roles
          where user_id = '00000000-0000-0000-0000-000000000101' and role_key = 'super_admin'),
  'failed last-super-admin removal preserves the role binding'
);

reset role;

select * from finish();

rollback;
