drop policy "Catalog managers can update tools" on public.tool_catalog;
drop policy "Catalog publishers can publish tools" on public.tool_catalog;

create policy "Catalog managers can update tools"
on public.tool_catalog for update to authenticated
using ((select private.has_admin_permission('catalog.manage')))
with check ((select private.has_admin_permission('catalog.manage')));

create policy "Catalog publishers can publish tools"
on public.tool_catalog for update to authenticated
using ((select private.has_admin_permission('catalog.publish')))
with check ((select private.has_admin_permission('catalog.publish')));

create or replace function public.guard_tool_catalog_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.lifecycle is distinct from new.lifecycle
     and not (select private.has_admin_permission('catalog.publish')) then
    raise exception 'Insufficient permission to change tool lifecycle';
  end if;

  if (old.id, old.slug, old.icon, old.complexity, old.access, old.contributor_type, old.contributor_name)
       is distinct from
     (new.id, new.slug, new.icon, new.complexity, new.access, new.contributor_type, new.contributor_name)
     and not (select private.has_admin_permission('catalog.manage')) then
    raise exception 'Insufficient permission to edit tool catalog metadata';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_tool_catalog_update() from public, anon;
grant execute on function public.guard_tool_catalog_update() to authenticated;

drop trigger if exists guard_tool_catalog_update on public.tool_catalog;
create trigger guard_tool_catalog_update
before update on public.tool_catalog
for each row execute function public.guard_tool_catalog_update();