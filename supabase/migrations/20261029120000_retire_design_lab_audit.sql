-- Retire le workflow d’audit Design Lab devenu inutilisé.
-- Les migrations historiques restent immuables. Avant application en production, valider l'état réel des données et l'impact.

begin;

drop table if exists public.design_audit_catalog_entries cascade;
drop table if exists public.design_audit_verifications cascade;
drop table if exists public.design_audit_decisions cascade;
drop table if exists public.design_audit_reports cascade;
drop table if exists public.design_audit_components cascade;
drop table if exists public.design_audit_events cascade;

drop function if exists private.log_design_audit_catalog_entry_event();
drop function if exists private.sync_design_audit_catalog_component_scope();
drop function if exists private.log_design_audit_component_event();
drop function if exists private.enforce_design_audit_conformance_evidence();
drop function if exists private.log_design_audit_event();
drop function if exists private.set_design_audit_updated_at();

-- `audit.write` also authorizes writes to the general administrative audit log.
-- Keep the permission and role bindings; only the Design Lab-specific storage is retired.

commit;
