begin;

select plan(11);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000201', 'authenticated', 'authenticated', 'pgtap-favorites-owner@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000202', 'authenticated', 'authenticated', 'pgtap-favorites-other@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now());

-- Seed through the migration-test role, then verify access as a normal user.
insert into public.user_favorites (user_id, tool_id) values
  ('00000000-0000-0000-0000-000000000201', 'percentage'),
  ('00000000-0000-0000-0000-000000000202', 'age');

select ok(
  exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='user_favorites' and c.relkind='r'),
  'user_favorites table exists'
);
select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='user_favorites'),
  'user_favorites has RLS enabled'
);
select ok(
  has_table_privilege('authenticated', 'public.user_favorites', 'SELECT')
  and has_table_privilege('authenticated', 'public.user_favorites', 'INSERT')
  and has_table_privilege('authenticated', 'public.user_favorites', 'DELETE')
  and not has_table_privilege('authenticated', 'public.user_favorites', 'UPDATE'),
  'authenticated has only the required table privileges'
);
select ok(not has_table_privilege('anon', 'public.user_favorites', 'SELECT'), 'anonymous role cannot access account favorites');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000201', true);

select is((select count(*)::integer from public.user_favorites), 1, 'a user can read only their own favorites');
insert into public.user_favorites (user_id, tool_id) values ('00000000-0000-0000-0000-000000000201', 'unit-converter');
select is((select count(*)::integer from public.user_favorites), 2, 'a user can add their own favorite');
select is(
  (with removed as (delete from public.user_favorites where user_id = '00000000-0000-0000-0000-000000000202' returning 1)
   select count(*)::integer from removed),
  0, 'a user cannot delete another account favorite'
);
select is((select count(*)::integer from public.user_favorites where user_id = '00000000-0000-0000-0000-000000000202'), 0, 'another account favorite remains invisible');
select ok(
  exists (select 1 from pg_constraint where conrelid = 'public.user_favorites'::regclass and contype = 'f' and confdeltype = 'c'
    and conkey = array[(select attnum from pg_attribute where attrelid = 'public.user_favorites'::regclass and attname = 'user_id')]::smallint[]),
  'account deletion cascades to favorites'
);
select ok(
  exists (select 1 from pg_constraint where conrelid = 'public.user_favorites'::regclass and contype = 'p'),
  'user and tool ID are unique together'
);

reset role;
delete from auth.users where id = '00000000-0000-0000-0000-000000000202';
select is(
  (select count(*)::integer from public.user_favorites where user_id = '00000000-0000-0000-0000-000000000202'),
  0,
  'deleting an Auth account cascades to its favorites'
);

select * from finish();
rollback;
