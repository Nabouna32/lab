-- Normalize catalogue IDs to the same readable kebab-case convention as implementation IDs.
-- The target IDs were checked for collisions before this migration.
update public.design_audit_catalog_entries
set id = lower(trim(both '-' from regexp_replace(regexp_replace(name, '([a-z0-9])([A-Z])', '\\1-\\2', 'g'), '[^a-zA-Z0-9]+', '-', 'g')));

-- Reclassify names that are Loculary wrappers rather than standalone Material 3 components.
update public.design_audit_catalog_entries
set catalog_scope = 'loculary',
    entry_type = case when id in ('app-bar-with-search','panel','result-panel') then 'composition' else 'utility' end,
    reference_status = 'not-applicable',
    official_reference_url = null
where id in ('select','text-area','segmented-control');

-- Ensure matching production implementations are discoverable from the catalogue.
update public.design_audit_catalog_entries e
set implementation_component_id = c.id
from public.design_audit_components c
where e.id = c.id and e.implementation_component_id is null;
update public.design_audit_catalog_entries e
set implementation_component_id = c.id
from public.design_audit_components c
where (e.id, c.id) in (('select-native-html-wrapper','select'),('text-area-web-wrapper','text-area'))
  and e.implementation_component_id is null;

update public.design_audit_components
set m3_relationship = 'loculary-utility'
where id in ('material-text-field','text-area','segmented-control');
