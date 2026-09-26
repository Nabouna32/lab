create or replace function private.list_admin_users(search_term text default null)
returns table (user_id uuid,email text,display_name text,locale text,created_at timestamptz,last_sign_in_at timestamptz,email_confirmed_at timestamptz,banned_until timestamptz,roles text[])
language sql stable security definer set search_path = ''
as $$
  select u.id,u.email,p.display_name,p.locale,u.created_at,u.last_sign_in_at,u.email_confirmed_at,u.banned_until,
    coalesce(array_agg(ur.role_key order by ur.role_key) filter (where ur.role_key is not null),array[]::text[])
  from auth.users u
  left join public.profiles p on p.id=u.id
  left join public.admin_user_roles ur on ur.user_id=u.id
  where (select private.has_admin_permission('users.view'))
    and coalesce(u.is_anonymous,false)=false
    and (nullif(trim(search_term),'') is null or lower(coalesce(u.email,'')) like '%'||lower(trim(search_term))||'%' or lower(coalesce(p.display_name,'')) like '%'||lower(trim(search_term))||'%')
  group by u.id,u.email,p.display_name,p.locale,u.created_at,u.last_sign_in_at,u.email_confirmed_at,u.banned_until
  order by u.created_at desc limit 100;
$$;
revoke all on function private.list_admin_users(text) from public,anon,authenticated;
grant execute on function private.list_admin_users(text) to authenticated;
create or replace function public.list_admin_users(search_term text default null)
returns table (user_id uuid,email text,display_name text,locale text,created_at timestamptz,last_sign_in_at timestamptz,email_confirmed_at timestamptz,banned_until timestamptz,roles text[])
language sql stable security invoker set search_path = ''
as $$ select * from private.list_admin_users(search_term); $$;
revoke all on function public.list_admin_users(text) from public,anon;
grant execute on function public.list_admin_users(text) to authenticated;
create or replace function private.assign_admin_role(target_user_id uuid,target_role_key text)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if not (select private.has_admin_permission('users.manage_roles')) then raise exception 'Insufficient permission'; end if;
  if not exists (select 1 from auth.users where id=target_user_id) then raise exception 'Target user not found'; end if;
  if not exists (select 1 from public.admin_roles where key=target_role_key) then raise exception 'Unknown role'; end if;
  insert into public.admin_user_roles(user_id,role_key,assigned_by) values(target_user_id,target_role_key,(select auth.uid())) on conflict(user_id,role_key) do nothing;
  if found then insert into public.admin_audit_log(actor_user_id,action,target_type,target_id,metadata)
    values((select auth.uid()),'admin.role.assigned','user',target_user_id,jsonb_build_object('role_key',target_role_key)); end if;
  return true;
end; $$;
revoke all on function private.assign_admin_role(uuid,text) from public,anon,authenticated;
grant execute on function private.assign_admin_role(uuid,text) to authenticated;
create or replace function public.assign_admin_role(target_user_id uuid,target_role_key text)
returns boolean language sql security invoker set search_path = ''
as $$ select private.assign_admin_role(target_user_id,target_role_key); $$;
revoke all on function public.assign_admin_role(uuid,text) from public,anon;
grant execute on function public.assign_admin_role(uuid,text) to authenticated;
create or replace function private.remove_admin_role(target_user_id uuid,target_role_key text)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare remaining_super_admins integer;
begin
  if not (select private.has_admin_permission('users.manage_roles')) then raise exception 'Insufficient permission'; end if;
  if target_role_key='super_admin' then
    select count(*) into remaining_super_admins from public.admin_user_roles where role_key='super_admin' and user_id<>target_user_id;
    if remaining_super_admins=0 then raise exception 'Cannot remove the last super_admin role'; end if;
  end if;
  delete from public.admin_user_roles where user_id=target_user_id and role_key=target_role_key;
  if found then insert into public.admin_audit_log(actor_user_id,action,target_type,target_id,metadata)
    values((select auth.uid()),'admin.role.removed','user',target_user_id,jsonb_build_object('role_key',target_role_key)); end if;
  return true;
end; $$;
revoke all on function private.remove_admin_role(uuid,text) from public,anon,authenticated;
grant execute on function private.remove_admin_role(uuid,text) to authenticated;
create or replace function public.remove_admin_role(target_user_id uuid,target_role_key text)
returns boolean language sql security invoker set search_path = ''
as $$ select private.remove_admin_role(target_user_id,target_role_key); $$;
revoke all on function public.remove_admin_role(uuid,text) from public,anon;
grant execute on function public.remove_admin_role(uuid,text) to authenticated;