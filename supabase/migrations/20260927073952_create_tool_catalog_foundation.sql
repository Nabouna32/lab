create table public.tool_catalog (
  id text primary key,
  slug text not null unique,
  icon text not null,
  complexity text not null check (complexity in ('small', 'advanced', 'mini-application')),
  lifecycle text not null check (lifecycle in ('draft', 'review', 'published', 'hidden', 'archived')),
  access text not null check (access in ('anonymous', 'account', 'premium')),
  contributor_type text not null check (contributor_type in ('internal', 'community')),
  contributor_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tool_catalog_contributor_name_check
    check (contributor_type = 'internal' or nullif(trim(contributor_name), '') is not null)
);

create table public.tool_translations (
  tool_id text not null references public.tool_catalog(id) on delete cascade,
  locale text not null,
  name text not null,
  description text not null,
  seo_title text not null,
  seo_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tool_id, locale)
);

create table public.tool_categories (
  tool_id text not null references public.tool_catalog(id) on delete cascade,
  category_key text not null,
  primary key (tool_id, category_key)
);

create table public.tool_tags (
  tool_id text not null references public.tool_catalog(id) on delete cascade,
  tag text not null,
  primary key (tool_id, tag)
);

create table public.tool_aliases (
  tool_id text not null references public.tool_catalog(id) on delete cascade,
  alias text not null,
  primary key (tool_id, alias)
);

create table public.tool_relations (
  tool_id text not null references public.tool_catalog(id) on delete cascade,
  related_tool_id text not null references public.tool_catalog(id) on delete cascade,
  relation_type text not null default 'related' check (relation_type = 'related'),
  primary key (tool_id, related_tool_id),
  constraint tool_relations_no_self_reference check (tool_id <> related_tool_id)
);

create index tool_translations_locale_idx on public.tool_translations(locale);
create index tool_categories_category_idx on public.tool_categories(category_key);
create index tool_tags_tag_idx on public.tool_tags(tag);
create index tool_aliases_alias_idx on public.tool_aliases(alias);
create index tool_relations_related_tool_idx on public.tool_relations(related_tool_id);

insert into public.admin_permissions (key) values
  ('catalog.read'),
  ('catalog.manage'),
  ('catalog.publish');

insert into public.admin_role_permissions (role_key, permission_key)
values
  ('super_admin', 'catalog.read'),
  ('super_admin', 'catalog.manage'),
  ('super_admin', 'catalog.publish'),
  ('admin', 'catalog.read'),
  ('admin', 'catalog.manage');

alter table public.tool_catalog enable row level security;
alter table public.tool_translations enable row level security;
alter table public.tool_categories enable row level security;
alter table public.tool_tags enable row level security;
alter table public.tool_aliases enable row level security;
alter table public.tool_relations enable row level security;

revoke all on table
  public.tool_catalog, public.tool_translations, public.tool_categories,
  public.tool_tags, public.tool_aliases, public.tool_relations
from anon, authenticated;

grant select on table
  public.tool_catalog, public.tool_translations, public.tool_categories,
  public.tool_tags, public.tool_aliases, public.tool_relations
to anon, authenticated;

grant insert, update, delete on table
  public.tool_catalog, public.tool_translations, public.tool_categories,
  public.tool_tags, public.tool_aliases, public.tool_relations
to authenticated;

create policy "Public can read published tools"
on public.tool_catalog for select to anon, authenticated
using (lifecycle = 'published');

create policy "Catalog admins can read all tools"
on public.tool_catalog for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can create tools"
on public.tool_catalog for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tools"
on public.tool_catalog for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog publishers can publish tools"
on public.tool_catalog for update to authenticated
using ((select private.has_admin_permission('catalog.publish')))
with check ((select private.has_admin_permission('catalog.publish')));

create policy "Catalog managers can delete archived tools"
on public.tool_catalog for delete to authenticated
using (
  (select private.has_admin_permission('catalog.manage'))
  and lifecycle = 'archived'
);

create policy "Public can read published tool translations"
on public.tool_translations for select to anon, authenticated
using (exists (
  select 1 from public.tool_catalog t
  where t.id = tool_translations.tool_id and t.lifecycle = 'published'
));

create policy "Catalog admins can read all tool translations"
on public.tool_translations for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can write tool translations"
on public.tool_translations for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tool translations"
on public.tool_translations for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can delete tool translations"
on public.tool_translations for delete to authenticated
using ((select private.has_admin_permission('catalog.manage')));

create policy "Public can read published tool categories"
on public.tool_categories for select to anon, authenticated
using (exists (
  select 1 from public.tool_catalog t
  where t.id = tool_categories.tool_id and t.lifecycle = 'published'
));

create policy "Catalog admins can read all tool categories"
on public.tool_categories for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can write tool categories"
on public.tool_categories for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tool categories"
on public.tool_categories for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can delete tool categories"
on public.tool_categories for delete to authenticated
using ((select private.has_admin_permission('catalog.manage')));

create policy "Public can read published tool tags"
on public.tool_tags for select to anon, authenticated
using (exists (
  select 1 from public.tool_catalog t
  where t.id = tool_tags.tool_id and t.lifecycle = 'published'
));

create policy "Catalog admins can read all tool tags"
on public.tool_tags for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can write tool tags"
on public.tool_tags for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tool tags"
on public.tool_tags for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can delete tool tags"
on public.tool_tags for delete to authenticated
using ((select private.has_admin_permission('catalog.manage')));

create policy "Public can read published tool aliases"
on public.tool_aliases for select to anon, authenticated
using (exists (
  select 1 from public.tool_catalog t
  where t.id = tool_aliases.tool_id and t.lifecycle = 'published'
));

create policy "Catalog admins can read all tool aliases"
on public.tool_aliases for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can write tool aliases"
on public.tool_aliases for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tool aliases"
on public.tool_aliases for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can delete tool aliases"
on public.tool_aliases for delete to authenticated
using ((select private.has_admin_permission('catalog.manage')));

create policy "Public can read published tool relations"
on public.tool_relations for select to anon, authenticated
using (exists (
  select 1 from public.tool_catalog t
  where t.id = tool_relations.tool_id and t.lifecycle = 'published'
));

create policy "Catalog admins can read all tool relations"
on public.tool_relations for select to authenticated
using ((select private.has_admin_permission('catalog.read')));

create policy "Catalog managers can write tool relations"
on public.tool_relations for insert to authenticated
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can update tool relations"
on public.tool_relations for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog managers can delete tool relations"
on public.tool_relations for delete to authenticated
using ((select private.has_admin_permission('catalog.manage')));

create or replace function public.set_tool_catalog_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_tool_catalog_updated_at() from public, anon;
grant execute on function public.set_tool_catalog_updated_at() to authenticated;

create trigger set_tool_catalog_updated_at
before update on public.tool_catalog
for each row execute function public.set_tool_catalog_updated_at();

create trigger set_tool_translation_updated_at
before update on public.tool_translations
for each row execute function public.set_tool_catalog_updated_at();