begin;

select plan(82);

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
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'authenticated',
    'authenticated',
    'pgtap-delete-target@example.invalid',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"pgTAP delete target"}'::jsonb,
    now(),
    now()
  );

insert into auth.sessions (id, user_id, created_at, updated_at)
values
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000101',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000102',
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

insert into public.admin_audit_log (actor_user_id, action, target_type, target_id, metadata)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'test.account.delete.last-super-admin',
    'user',
    '00000000-0000-0000-0000-000000000101',
    '{}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'test.account.delete.target',
    'user',
    '00000000-0000-0000-0000-000000000104',
    '{}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'test.account.delete.preflight',
    'user',
    '00000000-0000-0000-0000-000000000102',
    '{}'::jsonb
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
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_roles'),
  'admin_roles has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_permissions'),
  'admin_permissions has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_role_permissions'),
  'admin_role_permissions has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_user_roles'),
  'admin_user_roles has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='admin_audit_log'),
  'admin_audit_log has RLS enabled'
);

select ok(
  not exists (
    select 1
    from (values
      ('public.profiles'::text),
      ('public.admin_roles'::text),
      ('public.admin_permissions'::text),
      ('public.admin_role_permissions'::text),
      ('public.admin_user_roles'::text),
      ('public.admin_audit_log'::text)
    ) as tables(table_name)
    where has_table_privilege('anon', table_name, 'SELECT')
  ),
  'anon has no SELECT privilege on any public foundation table'
);

select ok(
  not exists (
    select 1
    from (values
      ('public.profiles'::text),
      ('public.admin_roles'::text),
      ('public.admin_permissions'::text),
      ('public.admin_role_permissions'::text),
      ('public.admin_user_roles'::text),
      ('public.admin_audit_log'::text)
    ) as tables(table_name)
    where has_table_privilege('anon', table_name, 'INSERT')
  ),
  'anon has no INSERT privilege on any public foundation table'
);

select ok(
  not exists (
    select 1
    from (values
      ('public.profiles'::text),
      ('public.admin_roles'::text),
      ('public.admin_permissions'::text),
      ('public.admin_role_permissions'::text),
      ('public.admin_user_roles'::text),
      ('public.admin_audit_log'::text)
    ) as tables(table_name)
    where has_table_privilege('anon', table_name, 'UPDATE')
  ),
  'anon has no UPDATE privilege on any public foundation table'
);

select ok(
  not exists (
    select 1
    from (values
      ('public.profiles'::text),
      ('public.admin_roles'::text),
      ('public.admin_permissions'::text),
      ('public.admin_role_permissions'::text),
      ('public.admin_user_roles'::text),
      ('public.admin_audit_log'::text)
    ) as tables(table_name)
    where has_table_privilege('anon', table_name, 'DELETE')
  ),
  'anon has no DELETE privilege on any public foundation table'
);

select ok(
  (select has_table_privilege('authenticated', 'public.profiles', 'SELECT')),
  'authenticated can SELECT profiles subject to RLS'
);

select ok(
  not has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
  'authenticated has no direct INSERT privilege on profiles'
);

select ok(
  not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and cmd = 'INSERT'
      and 'authenticated'::name = any(roles)
  ),
  'profiles has no INSERT policy for authenticated'
);

select ok(
  exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where n.nspname = 'private'
      and p.proname = 'handle_new_user'
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ) is false,
  'Auth-trigger function has no direct EXECUTE grant to PUBLIC'
);

select ok(
  not has_function_privilege('anon', 'private.handle_new_user()', 'EXECUTE'),
  'anon cannot execute the Auth-trigger function directly'
);

select ok(
  not has_function_privilege('authenticated', 'private.handle_new_user()', 'EXECUTE'),
  'authenticated cannot execute the Auth-trigger function directly'
);

select ok(
  not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where n.nspname = 'public'
      and p.proname = 'set_profile_updated_at'
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ),
  'profile timestamp trigger has no direct EXECUTE grant to PUBLIC'
);

select ok(
  not has_function_privilege('anon', 'public.set_profile_updated_at()', 'EXECUTE'),
  'anon cannot execute the profile timestamp trigger directly'
);

select ok(
  not has_function_privilege('authenticated', 'public.set_profile_updated_at()', 'EXECUTE'),
  'authenticated cannot execute the profile timestamp trigger directly'
);

select ok(
  exists (
    select 1
    from pg_default_acl d
    where d.defaclrole = 'postgres'::regrole
      and d.defaclnamespace = 0
      and d.defaclobjtype = 'f'
      and not exists (
        select 1
        from lateral aclexplode(d.defaclacl) acl
        where acl.grantee = 0
          and acl.privilege_type = 'EXECUTE'
      )
  ),
  'postgres global function defaults revoke EXECUTE from PUBLIC'
);

select ok(
  not exists (
    select 1
    from pg_default_acl d
    join pg_namespace n on n.oid = d.defaclnamespace
    cross join lateral aclexplode(d.defaclacl) acl
    where d.defaclrole = 'postgres'::regrole
      and d.defaclobjtype = 'f'
      and n.nspname = 'public'
      and acl.grantee in (
        'anon'::regrole,
        'authenticated'::regrole,
        'service_role'::regrole
      )
      and acl.privilege_type = 'EXECUTE'
  ),
  'postgres public-schema function defaults grant no EXECUTE to API roles'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.has_admin_permission(text)'::regprocedure,
      'public.list_admin_users(text)'::regprocedure,
      'public.assign_admin_role(uuid,text)'::regprocedure,
      'public.record_admin_audit(text,text,uuid,jsonb)'::regprocedure,
      'public.revoke_admin_user_sessions(uuid)'::regprocedure,
      'public.check_account_deletion(uuid)'::regprocedure,
      'public.remove_admin_role(uuid,text)'::regprocedure
    ]) as rpc(function_oid)
    where not has_function_privilege('authenticated', rpc.function_oid, 'EXECUTE')
  ),
  'authenticated retains EXECUTE on every intended public application RPC'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.has_admin_permission(text)'::regprocedure,
      'public.list_admin_users(text)'::regprocedure,
      'public.assign_admin_role(uuid,text)'::regprocedure,
      'public.record_admin_audit(text,text,uuid,jsonb)'::regprocedure,
      'public.revoke_admin_user_sessions(uuid)'::regprocedure,
      'public.check_account_deletion(uuid)'::regprocedure,
      'public.remove_admin_role(uuid,text)'::regprocedure
    ]) as rpc(function_oid)
    where has_function_privilege('anon', rpc.function_oid, 'EXECUTE')
       or exists (
         select 1
         from pg_proc p
         cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
         where p.oid = rpc.function_oid
           and acl.grantee = 0
           and acl.privilege_type = 'EXECUTE'
       )
  ),
  'intended public application RPCs are not executable by anon or PUBLIC'
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
      and p.proname='check_account_deletion'
      and p.prosecdef
  ),
  'private.check_account_deletion is SECURITY DEFINER'
);

select ok(
  exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'auth'
      and c.relname = 'users'
      and t.tgname = 'guard_auth_user_deletion'
      and not t.tgisinternal
  ),
  'Auth user deletion is guarded by a BEFORE DELETE trigger'
);

select ok(
  position(
    'loculary.account-deletion.super-admin'
    in pg_get_functiondef('private.guard_auth_user_deletion()'::regprocedure)
  ) > 0,
  'Auth deletion trigger uses the shared super-admin advisory lock'
);

select ok(
  position(
    'loculary.account-deletion.super-admin'
    in pg_get_functiondef('private.remove_admin_role(uuid,text)'::regprocedure)
  ) > 0,
  'guarded role removal uses the same advisory lock as Auth deletion'
);

select ok(
  to_regprocedure('public.prepare_account_deletion(uuid)') is null,
  'obsolete public prepare_account_deletion compatibility RPC is removed'
);

select ok(
  not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'private' and p.proname = 'prepare_account_deletion'
  ),
  'obsolete private prepare_account_deletion function is removed'
);

select ok(
  has_function_privilege('authenticated', 'public.check_account_deletion(uuid)', 'EXECUTE'),
  'authenticated can call the read-only account-deletion preflight'
);

select ok(
  not has_function_privilege('anon', 'public.check_account_deletion(uuid)', 'EXECUTE'),
  'anon cannot call the account-deletion preflight'
);

select ok(
  not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
    where n.nspname = 'public'
      and p.proname = 'check_account_deletion'
      and pg_get_function_identity_arguments(p.oid) = 'uuid'
      and acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ),
  'account-deletion preflight has no direct EXECUTE grant to PUBLIC'
);

select throws_ok(
  'delete from auth.users where id = ''00000000-0000-0000-0000-000000000101''::uuid',
  'P0001',
  'Cannot delete the last super_admin account',
  'Auth deletion trigger refuses to delete the last super_admin'
);

select ok(
  exists (
    select 1 from public.admin_user_roles
    where user_id = '00000000-0000-0000-0000-000000000101'
      and role_key = 'super_admin'
  ),
  'rejected Auth deletion preserves the last super_admin role'
);

select is(
  (select actor_user_id from public.admin_audit_log
   where action = 'test.account.delete.last-super-admin'),
  '00000000-0000-0000-0000-000000000101'::uuid,
  'rejected Auth deletion does not anonymize the audit actor'
);

select is(
  (select target_id from public.admin_audit_log
   where action = 'test.account.delete.last-super-admin'),
  '00000000-0000-0000-0000-000000000101'::uuid,
  'rejected Auth deletion does not clear the audit target'
);

-- This account is a second super_admin, so deleting it must succeed while
-- the original super_admin remains. The trigger still performs atomic cleanup.
insert into public.admin_user_roles (user_id, role_key, assigned_by)
values (
  '00000000-0000-0000-0000-000000000104',
  'super_admin',
  '00000000-0000-0000-0000-000000000101'
);

select lives_ok(
  'delete from auth.users where id = ''00000000-0000-0000-0000-000000000104''::uuid',
  'deleting one of two super_admin accounts succeeds'
);

select ok(
  not exists (
    select 1 from auth.users
    where id = '00000000-0000-0000-0000-000000000104'
  ),
  'second super_admin Auth account is deleted'
);

select ok(
  not exists (
    select 1 from public.admin_user_roles
    where user_id = '00000000-0000-0000-0000-000000000104'
  ),
  'deleted super_admin role binding is removed by the Auth cascade'
);

select is(
  (select actor_user_id from public.admin_audit_log
   where action = 'test.account.delete.target'),
  null::uuid,
  'Auth deletion atomically clears audit actor through the foreign key'
);

select is(
  (select target_id from public.admin_audit_log
   where action = 'test.account.delete.target'),
  null::uuid,
  'Auth deletion trigger clears polymorphic user audit targets'
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

-- The Auth trigger has already created the fixture profile. Confirm an ordinary
-- permitted update still invokes the trigger even though API roles lack EXECUTE.
update public.profiles
set display_name = 'pgTAP profile updated',
    updated_at = '2000-01-01 00:00:00+00'
where id = '00000000-0000-0000-0000-000000000101';

select is(
  (select updated_at from public.profiles
   where id = '00000000-0000-0000-0000-000000000101'),
  now(),
  'permitted profile update still invokes the timestamp trigger'
);

select throws_ok(
  'insert into public.profiles (id, display_name) values (''00000000-0000-0000-0000-000000000101''::uuid, ''direct insert'')',
  '42501',
  'permission denied for table profiles',
  'authenticated direct profile INSERT is rejected'
);

select throws_ok(
  'select public.check_account_deletion(''00000000-0000-0000-0000-000000000101''::uuid)',
  'P0001',
  'Cannot delete the last super_admin account',
  'read-only preflight reports the last-super-admin restriction'
);

select is(
  (select target_id from public.admin_audit_log
   where action = 'test.account.delete.last-super-admin'),
  '00000000-0000-0000-0000-000000000101'::uuid,
  'read-only preflight leaves audit references unchanged'
);

select throws_ok(
  'select public.check_account_deletion(''00000000-0000-0000-0000-000000000102''::uuid)',
  'P0001',
  'Unauthorized account deletion request',
  'read-only preflight rejects checking another user account'
);

do $ordinary_user$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
  perform set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-000000000102","session_id":"00000000-0000-0000-0000-000000000105","role":"authenticated","aud":"authenticated"}',
    true
  );
end;
$ordinary_user$;

select lives_ok(
  'select public.check_account_deletion(''00000000-0000-0000-0000-000000000102''::uuid)',
  'ordinary user can preflight their own account deletion'
);

reset role;

select is(
  (select actor_user_id from public.admin_audit_log
   where action = 'test.account.delete.preflight'),
  '00000000-0000-0000-0000-000000000102'::uuid,
  'successful read-only preflight does not anonymize audit actors'
);

select is(
  (select target_id from public.admin_audit_log
   where action = 'test.account.delete.preflight'),
  '00000000-0000-0000-0000-000000000102'::uuid,
  'successful read-only preflight does not clear audit targets'
);

do $restore_actor$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
  perform set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-000000000101","session_id":"00000000-0000-0000-0000-000000000103","role":"authenticated","aud":"authenticated"}',
    true
  );
end;
$restore_actor$;

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
