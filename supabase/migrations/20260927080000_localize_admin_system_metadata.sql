alter table public.admin_roles
  drop column name,
  drop column description;

alter table public.admin_permissions
  drop column description;
