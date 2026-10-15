-- Allow authorized design-audit writers to maintain reference metadata with an append-only event trail.
alter table public.design_audit_catalog_entries
  add constraint design_audit_catalog_verified_requires_url
  check (reference_status <> 'verified' or official_reference_url is not null);

create policy "Audit writers can update reference catalogue" on public.design_audit_catalog_entries
for update to authenticated
using ((select private.has_admin_permission('audit.write')))
with check ((select private.has_admin_permission('audit.write')));
grant update on public.design_audit_catalog_entries to authenticated;

create or replace function private.log_design_audit_catalog_entry_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not private.has_admin_permission('audit.write') then
    raise exception 'Not authorized to update the design audit catalogue' using errcode = '42501';
  end if;

  if old.catalog_scope is distinct from new.catalog_scope
    or old.entry_type is distinct from new.entry_type
    or old.classification_note is distinct from new.classification_note
    or old.reference_status is distinct from new.reference_status
    or old.official_reference_url is distinct from new.official_reference_url
  then
    insert into public.design_audit_events (component_id, actor_user_id, event_type, details)
    values (
      coalesce(new.implementation_component_id, old.implementation_component_id),
      auth.uid(),
      'catalog_entry.updated',
      jsonb_build_object(
        'catalog_entry_id', new.id,
        'name', new.name,
        'old_scope', old.catalog_scope,
        'new_scope', new.catalog_scope,
        'old_type', old.entry_type,
        'new_type', new.entry_type,
        'old_reference_status', old.reference_status,
        'new_reference_status', new.reference_status,
        'old_reference_url', old.official_reference_url,
        'new_reference_url', new.official_reference_url
      )
    );
  end if;
  return new;
end;
$$;
revoke execute on function private.log_design_audit_catalog_entry_event() from public, anon, authenticated;
create trigger design_audit_catalog_entry_event after update on public.design_audit_catalog_entries
for each row execute function private.log_design_audit_catalog_entry_event();
