create or replace function private.record_admin_audit(
  audit_action text,
  audit_target_type text default null,
  audit_target_id uuid default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  audit_id uuid;
begin
  if not (select private.has_admin_permission('audit.write')) then
    raise exception 'Insufficient permission';
  end if;

  insert into public.admin_audit_log (
    actor_user_id,
    action,
    target_type,
    target_id,
    metadata
  )
  values (
    (select auth.uid()),
    audit_action,
    audit_target_type,
    audit_target_id,
    audit_metadata
  )
  returning id into audit_id;

  return audit_id;
end;
$$;

revoke all on function private.record_admin_audit(text, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function private.record_admin_audit(text, text, uuid, jsonb) to authenticated;

create or replace function public.record_admin_audit(
  audit_action text,
  audit_target_type text default null,
  audit_target_id uuid default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.record_admin_audit(audit_action, audit_target_type, audit_target_id, audit_metadata);
$$;

revoke all on function public.record_admin_audit(text, text, uuid, jsonb) from public, anon;
grant execute on function public.record_admin_audit(text, text, uuid, jsonb) to authenticated;
