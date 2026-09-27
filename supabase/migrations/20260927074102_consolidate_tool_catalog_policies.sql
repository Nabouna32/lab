drop policy "Public can read published tools" on public.tool_catalog;
drop policy "Catalog admins can read all tools" on public.tool_catalog;
create policy "Catalog users can read tools"
on public.tool_catalog for select to anon, authenticated
using (
  lifecycle = 'published'
  or (select private.has_admin_permission('catalog.read'))
);

drop policy "Catalog managers can update tools" on public.tool_catalog;
drop policy "Catalog publishers can publish tools" on public.tool_catalog;
create policy "Catalog users can update tools"
on public.tool_catalog for update to authenticated
using (
  (select private.has_admin_permission('catalog.manage'))
  or (select private.has_admin_permission('catalog.publish'))
)
with check (
  (select private.has_admin_permission('catalog.manage'))
  or (select private.has_admin_permission('catalog.publish'))
);

drop policy "Public can read published tool translations" on public.tool_translations;
drop policy "Catalog admins can read all tool translations" on public.tool_translations;
create policy "Catalog users can read tool translations"
on public.tool_translations for select to anon, authenticated
using (
  exists (
    select 1 from public.tool_catalog t
    where t.id = tool_translations.tool_id
      and (
        t.lifecycle = 'published'
        or (select private.has_admin_permission('catalog.read'))
      )
  )
);

drop policy "Public can read published tool categories" on public.tool_categories;
drop policy "Catalog admins can read all tool categories" on public.tool_categories;
create policy "Catalog users can read tool categories"
on public.tool_categories for select to anon, authenticated
using (
  exists (
    select 1 from public.tool_catalog t
    where t.id = tool_categories.tool_id
      and (
        t.lifecycle = 'published'
        or (select private.has_admin_permission('catalog.read'))
      )
  )
);

drop policy "Public can read published tool tags" on public.tool_tags;
drop policy "Catalog admins can read all tool tags" on public.tool_tags;
create policy "Catalog users can read tool tags"
on public.tool_tags for select to anon, authenticated
using (
  exists (
    select 1 from public.tool_catalog t
    where t.id = tool_tags.tool_id
      and (
        t.lifecycle = 'published'
        or (select private.has_admin_permission('catalog.read'))
      )
  )
);

drop policy "Public can read published tool aliases" on public.tool_aliases;
drop policy "Catalog admins can read all tool aliases" on public.tool_aliases;
create policy "Catalog users can read tool aliases"
on public.tool_aliases for select to anon, authenticated
using (
  exists (
    select 1 from public.tool_catalog t
    where t.id = tool_aliases.tool_id
      and (
        t.lifecycle = 'published'
        or (select private.has_admin_permission('catalog.read'))
      )
  )
);

drop policy "Public can read published tool relations" on public.tool_relations;
drop policy "Catalog admins can read all tool relations" on public.tool_relations;
create policy "Catalog users can read tool relations"
on public.tool_relations for select to anon, authenticated
using (
  exists (
    select 1 from public.tool_catalog t
    where t.id = tool_relations.tool_id
      and (
        t.lifecycle = 'published'
        or (select private.has_admin_permission('catalog.read'))
      )
  )
);