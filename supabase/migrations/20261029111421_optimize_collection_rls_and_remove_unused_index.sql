-- Centralise la lecture du jeton de partage pour limiter les évaluations répétées
-- dans les politiques RLS. L'index RBAC est rétabli par la migration suivante.
create or replace function private.request_collection_share_token()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select nullif(current_setting('request.headers', true), '')::jsonb
    ->> 'x-loculary-share-token';
$$;

revoke all on function private.request_collection_share_token() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.request_collection_share_token() to anon, authenticated;

drop policy if exists "Owners and token holders can read collections" on public.user_collections;
create policy "Owners and token holders can read collections"
  on public.user_collections for select to anon, authenticated
  using (
    (select auth.uid()) = user_id
    or (
      share_token is not null
      and share_token = (select private.request_collection_share_token())
    )
  );

drop policy if exists "Owners and token holders can read collection items" on public.user_collection_items;
create policy "Owners and token holders can read collection items"
  on public.user_collection_items for select to anon, authenticated
  using (
    exists (
      select 1 from public.user_collections c
      where c.id = collection_id
        and (
          c.user_id = (select auth.uid())
          or (
            c.share_token is not null
            and c.share_token = (select private.request_collection_share_token())
          )
        )
    )
  );
