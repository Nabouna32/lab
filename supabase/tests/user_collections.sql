begin;

select plan(10);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000301', 'authenticated', 'authenticated', 'pgtap-collection-owner@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000302', 'authenticated', 'authenticated', 'pgtap-collection-other@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now());

insert into public.user_collections (id, user_id, name, share_token) values
  ('00000000-0000-0000-0000-000000000311', '00000000-0000-0000-0000-000000000301', 'Private', null),
  ('00000000-0000-0000-0000-000000000312', '00000000-0000-0000-0000-000000000301', 'Shared', 'c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2'),
  ('00000000-0000-0000-0000-000000000313', '00000000-0000-0000-0000-000000000302', 'Other account', null);

insert into public.user_collection_items (collection_id, tool_id) values
  ('00000000-0000-0000-0000-000000000311', 'percentage'),
  ('00000000-0000-0000-0000-000000000312', 'age'),
  ('00000000-0000-0000-0000-000000000313', 'unit-converter');

select ok((select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='user_collections'), 'collections RLS enabled');
select ok((select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='user_collection_items'), 'collection items RLS enabled');
select ok(not has_table_privilege('anon', 'public.user_collections', 'INSERT'), 'anonymous users cannot create collections');
select ok(has_table_privilege('authenticated', 'public.user_collections', 'SELECT,INSERT,UPDATE,DELETE'), 'authenticated users have required collection privileges');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000301', true);
select is((select count(*)::integer from public.user_collections), 2, 'owner sees only own collections');
select is((select count(*)::integer from public.user_collection_items), 2, 'owner sees own collection items');
select is((select count(*)::integer from public.user_collections where user_id='00000000-0000-0000-0000-000000000302'), 0, 'owner cannot read another account collections');

reset role;
set local role anon;
select set_config('request.headers', '{"x-loculary-share-token":"c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2"}', true);
select is((select count(*)::integer from public.user_collections), 1, 'valid share token reveals only the explicitly shared collection');
select is((select count(*)::integer from public.user_collection_items), 1, 'valid share token reveals only that collection items');
select is((with changed as (delete from public.user_collections returning 1) select count(*)::integer from changed), 0, 'anonymous users cannot delete collections');

select * from finish();
rollback;
