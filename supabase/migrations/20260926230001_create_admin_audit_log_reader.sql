create or replace function private.list_admin_audit_log(limit_count integer default 50)
returns table (id uuid,actor_user_id uuid,actor_email text,action text,target_type text,target_id uuid,metadata jsonb,created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select a.id,a.actor_user_id,u.email,a.action,a.target_type,a.target_id,a.metadata,a.created_at
  from public.admin_audit_log a
  join auth.users u on u.id=a.actor_user_id
  where (select private.has_admin_permission('audit.read'))
  order by a.created_at desc
  limit least(greatest(coalesce(limit_count,50),1),100);
$$;
revoke all on function private.list_admin_audit_log(integer) from public,anon,authenticated;
grant execute on function private.list_admin_audit_log(integer) to authenticated;
create or replace function public.list_admin_audit_log(limit_count integer default 50)
returns table (id uuid,actor_user_id uuid,actor_email text,action text,target_type text,target_id uuid,metadata jsonb,created_at timestamptz)
language sql stable security invoker set search_path = ''
as $$ select * from private.list_admin_audit_log(limit_count); $$;
revoke all on function public.list_admin_audit_log(integer) from public,anon;
grant execute on function public.list_admin_audit_log(integer) to authenticated;