-- Private-by-default personal collections. Public reads require the unguessable share token
-- in the request header; the token is never used as a row-enumeration flag.
create table public.user_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  share_token text unique check (share_token is null or share_token ~ '^[0-9a-f-]{36}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_collection_items (
  collection_id uuid not null references public.user_collections(id) on delete cascade,
  tool_id text not null check (tool_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  primary key (collection_id, tool_id)
);

alter table public.user_collections enable row level security;
alter table public.user_collection_items enable row level security;

create policy "Owners and token holders can read collections"
  on public.user_collections for select to anon, authenticated
  using (
    (select auth.uid()) = user_id
    or (
      share_token is not null
      and share_token = (
        nullif(current_setting('request.headers', true), '')::jsonb
        ->> 'x-loculary-share-token'
      )
    )
  );

create policy "Owners can create collections"
  on public.user_collections for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owners can update collections"
  on public.user_collections for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owners can delete collections"
  on public.user_collections for delete to authenticated
  using ((select auth.uid()) = user_id);

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
              nullif(current_setting('request.headers', true), '')::jsonb
              ->> 'x-loculary-share-token'
            )
          )
        )
    )
  );

create policy "Owners can add collection items"
  on public.user_collection_items for insert to authenticated
  with check (
    exists (
      select 1 from public.user_collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
  );

create policy "Owners can remove collection items"
  on public.user_collection_items for delete to authenticated
  using (
    exists (
      select 1 from public.user_collections c
      where c.id = collection_id and c.user_id = (select auth.uid())
    )
  );

revoke all on table public.user_collections, public.user_collection_items from public, anon, authenticated, service_role;
grant select on table public.user_collections, public.user_collection_items to anon, authenticated;
grant insert, update, delete on table public.user_collections to authenticated;
grant insert, delete on table public.user_collection_items to authenticated;
