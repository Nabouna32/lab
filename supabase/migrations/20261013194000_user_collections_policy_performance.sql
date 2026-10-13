create index user_collections_user_id_idx on public.user_collections(user_id);

drop policy "Owners and token holders can read collections" on public.user_collections;
create policy "Owners and token holders can read collections"
  on public.user_collections for select to anon, authenticated
  using (
    (select auth.uid()) = user_id
    or (
      share_token is not null
      and share_token = (
        select nullif(current_setting('request.headers', true), '')::jsonb
          ->> 'x-loculary-share-token'
      )
    )
  );

drop policy "Owners and token holders can read collection items" on public.user_collection_items;
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
            and c.share_token = (
              select nullif(current_setting('request.headers', true), '')::jsonb
                ->> 'x-loculary-share-token'
            )
          )
        )
    )
  );