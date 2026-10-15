-- Link reference entries to existing production implementations by stable IDs where possible.
update public.design_audit_catalog_entries e
set implementation_component_id = c.id
from public.design_audit_components c
where e.id = c.id and e.implementation_component_id is null;

-- These are Loculary-specific wrappers/compositions, not standalone official M3 components.
update public.design_audit_catalog_entries
set catalog_scope = 'loculary', entry_type = case when id in ('app-bar-with-search','panel','result-panel') then 'composition' else 'utility' end,
    reference_status = 'not-applicable', official_reference_url = null
where id in ('select','textarea','segmented-control');

update public.design_audit_components
set m3_relationship = 'loculary-utility'
where id in ('material-text-field','text-area','segmented-control');

update public.design_audit_catalog_entries e
set implementation_component_id = c.id
from public.design_audit_components c
where (e.id, c.id) in (('select-native-html-wrapper','select'),('textarea-web-wrapper','text-area'))
  and e.implementation_component_id is null;

comment on column public.design_audit_catalog_entries.implementation_component_id is 'Optional link to the actual Loculary implementation; absence means no direct implementation is mapped, not that the reference entry is invalid.';
