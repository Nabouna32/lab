-- L'index couvre la clé étrangère vers admin_permissions et les recherches
-- administratives filtrées par permission_key. Le faible volume courant ne
-- suffit pas à justifier de laisser cette clé étrangère sans index.
create index if not exists admin_role_permissions_permission_idx
  on public.admin_role_permissions(permission_key);
