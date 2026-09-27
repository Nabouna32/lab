-- Cover the permission foreign key used by admin RBAC joins and deletes.
create index if not exists admin_role_permissions_permission_idx
  on public.admin_role_permissions(permission_key);
