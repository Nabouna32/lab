begin;

select plan(16);

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
