-- Map compound Web implementations to the reference concepts they implement.
update public.design_audit_catalog_entries
set implementation_component_id = 'segmented-button-group'
where id in ('segmented-button', 'single-choice-segmented-button-row', 'multi-choice-segmented-button-row')
  and implementation_component_id is null;

update public.design_audit_catalog_entries
set implementation_component_id = 'split-button'
where id in ('split-button-layout', 'filled-split-button', 'tonal-split-button', 'elevated-split-button', 'outlined-split-button')
  and implementation_component_id is null;
