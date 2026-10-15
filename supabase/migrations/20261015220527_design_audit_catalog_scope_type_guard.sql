-- Keep catalogue scope and entry type semantically consistent at the database boundary.
alter table public.design_audit_catalog_entries
  add constraint design_audit_catalog_scope_type_check
  check (
    (catalog_scope = 'material-3' and entry_type in ('component', 'variant', 'pattern', 'api-concept'))
    or (catalog_scope = 'loculary' and entry_type in ('utility', 'composition'))
  );
