-- Keep the implementation relationship aligned when an entry is reclassified between M3 and Loculary.
create or replace function private.sync_design_audit_catalog_component_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_component_id text;
  current_relationship text;
  next_relationship text;
  component_name text;
begin
  if auth.uid() is null or not private.has_admin_permission('audit.write') then
    raise exception 'Not authorized to reclassify design audit catalogue entries' using errcode = '42501';
  end if;

  for target_component_id in
    select distinct linked_component_id
    from unnest(array[old.implementation_component_id, new.implementation_component_id]) as links(linked_component_id)
    where linked_component_id is not null
  loop
    select c.m3_relationship, c.name
      into current_relationship, component_name
    from public.design_audit_components c
    where c.id = target_component_id;

    if not found then
      continue;
    end if;

    if exists (
      select 1
      from public.design_audit_catalog_entries e
      where e.implementation_component_id = target_component_id
        and e.catalog_scope = 'material-3'
    ) then
      next_relationship := 'web-adaptation';
    else
      next_relationship := 'loculary-utility';
    end if;

    if current_relationship is distinct from next_relationship then
      update public.design_audit_components
      set m3_relationship = next_relationship
      where id = target_component_id;

      insert into public.design_audit_events (component_id, actor_user_id, event_type, details)
      values (
        target_component_id,
        auth.uid(),
        'component.m3_relationship_updated',
        jsonb_build_object(
          'title', component_name,
          'old_relationship', current_relationship,
          'new_relationship', next_relationship,
          'catalog_entry_id', new.id
        )
      );
    end if;
  end loop;
  return new;
end;
$$;
revoke execute on function private.sync_design_audit_catalog_component_scope() from public, anon, authenticated;
create trigger design_audit_catalog_scope_sync
after update of catalog_scope, implementation_component_id on public.design_audit_catalog_entries
for each row execute function private.sync_design_audit_catalog_component_scope();
