-- Clarify the provenance of the imported catalogue and map the remaining exact wrapper alias.
update public.design_audit_catalog_entries
set classification_note = case
  when catalog_scope = 'material-3' then 'Entrée issue du registre de travail historique. Confirmer l’identité exacte (composant M3, variante, pattern ou API AndroidX) et rattacher une documentation officielle avant toute conclusion.'
  else 'Composition ou utilitaire propre à Loculary, pas un composant Material 3 autonome. Examiner son rôle, ses dépendances et l’équivalent M3 éventuel pendant l’audit.'
end;
update public.design_audit_catalog_entries e
set implementation_component_id = c.id
from public.design_audit_components c
where e.id = 'textarea' and c.id = 'text-area' and e.implementation_component_id is null;
