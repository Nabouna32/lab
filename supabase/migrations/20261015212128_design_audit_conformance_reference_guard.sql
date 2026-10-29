-- Restaure le garde de référence manquant dans l'historique versionné.
-- Le SQL d'origine de la version 20261015212128 n'a jamais été retrouvé dans Git.
-- L'invariant est reconstitué à partir de l'identité distante de la migration,
-- du schéma design_audit_components et du contrat de conformité existant.
-- La table et cette contrainte sont retirées par 20261029110714_retire_design_lab_audit.sql.
alter table public.design_audit_components
  add constraint design_audit_conformance_reference_guard
  check (
    audit_status <> 'conformant-within-verified-scope'
    or jsonb_array_length(official_references) > 0
  );
