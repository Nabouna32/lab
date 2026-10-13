-- Account-owned favorites. The Git-backed tool registry remains authoritative.
create table public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id text not null check (tool_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  primary key (user_id, tool_id)
);

alter table public.user_favorites enable row level security;

create policy "Users can read their own favorites"
  on public.user_favorites for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own favorites"
  on public.user_favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own favorites"
  on public.user_favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.user_favorites from public, anon, authenticated, service_role;
grant select, insert, delete on table public.user_favorites to authenticated;
