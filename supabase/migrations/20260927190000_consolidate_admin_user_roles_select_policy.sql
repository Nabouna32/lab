drop policy if exists "Users can read their own admin roles" on public.admin_user_roles;
drop policy if exists "Authorized admins can read assigned roles" on public.admin_user_roles;

create policy "Users and authorized admins can read admin roles"
on public.admin_user_roles
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.has_admin_permission('users.view'))
);