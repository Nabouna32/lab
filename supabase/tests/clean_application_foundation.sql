begin;

select plan(25);

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

select * from finish();

rollback;
