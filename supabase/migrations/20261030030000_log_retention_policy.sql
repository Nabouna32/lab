-- Keep Loculary-owned operational logs for six months.
-- Supabase-managed Auth/platform logs retain their provider-defined plan limits.
-- No purge is executed during migration; the scheduled job runs at 03:00 GMT.

create extension if not exists pg_cron with schema pg_catalog;

create table if not exists private.admin_audit_log_retention_holds (
  audit_log_id uuid primary key
    references public.admin_audit_log(id)
    on delete cascade,
  reason_code text not null
    check (reason_code in ('security_incident', 'legal_obligation', 'internal_investigation')),
  reference_code text not null
    check (reference_code ~ '^INC-[0-9]{4}-[0-9]{3,}$'),
  hold_until timestamptz not null,
  created_at timestamptz not null default pg_catalog.now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint admin_audit_log_retention_holds_duration_check
    check (
      hold_until > created_at
      and hold_until <= created_at + interval '12 months'
    )
);

alter table private.admin_audit_log_retention_holds enable row level security;

revoke all on table private.admin_audit_log_retention_holds
  from public, anon, authenticated, service_role;

comment on table private.admin_audit_log_retention_holds is
  'Restricted, time-limited exceptions to the six-month admin audit log retention period. References must be non-personal incident codes; maximum hold duration is twelve months from the hold creation, and the setter also enforces twelve months from the audit event.';

create or replace function private.set_admin_audit_log_retention_hold(
  p_audit_log_id uuid,
  p_reason_code text,
  p_reference_code text,
  p_hold_until timestamptz
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_event_created_at timestamptz;
  v_now timestamptz := pg_catalog.now();
begin
  if p_reason_code is null
    or p_reason_code not in ('security_incident', 'legal_obligation', 'internal_investigation')
  then
    raise exception 'Invalid retention hold reason code.'
      using errcode = '22023';
  end if;

  if p_reference_code is null
    or p_reference_code !~ '^INC-[0-9]{4}-[0-9]{3,}$'
  then
    raise exception 'Retention hold reference must be a non-personal INC-YYYY-NNN code.'
      using errcode = '22023';
  end if;

  select audit.created_at
    into v_event_created_at
    from public.admin_audit_log as audit
    where audit.id = p_audit_log_id
    for update;

  if not found then
    raise exception 'Admin audit log entry not found.'
      using errcode = 'P0002';
  end if;

  if p_hold_until is null
    or p_hold_until <= v_now
    or p_hold_until > v_event_created_at + interval '12 months'
  then
    raise exception 'Retention holds must expire in the future and no later than twelve months after the audit event.'
      using errcode = '22023';
  end if;

  insert into private.admin_audit_log_retention_holds (
    audit_log_id,
    reason_code,
    reference_code,
    hold_until,
    created_by
  )
  values (
    p_audit_log_id,
    p_reason_code,
    p_reference_code,
    p_hold_until,
    auth.uid()
  )
  on conflict (audit_log_id) do update
    set reason_code = excluded.reason_code,
        reference_code = excluded.reference_code,
        hold_until = excluded.hold_until,
        created_at = pg_catalog.now(),
        created_by = coalesce(
          excluded.created_by,
          private.admin_audit_log_retention_holds.created_by
        );
end;
$function$;

revoke all on function private.set_admin_audit_log_retention_hold(uuid, text, text, timestamptz)
  from public, anon, authenticated, service_role;

comment on function private.set_admin_audit_log_retention_hold(uuid, text, text, timestamptz) is
  'Creates or updates a restricted exception for one admin audit event. Only a privileged database operator may call it; the reference is non-personal and the hold cannot extend beyond twelve months after the event.';

create or replace function private.prune_retained_logs()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_cutoff timestamptz := v_now - interval '6 months';
  v_admin_audit_deleted bigint := 0;
  v_expired_holds_deleted bigint := 0;
  v_cron_runs_deleted bigint := 0;
begin
  delete from private.admin_audit_log_retention_holds as hold
    where hold.hold_until <= v_now;
  get diagnostics v_expired_holds_deleted = row_count;

  delete from public.admin_audit_log as audit
    where audit.created_at < v_cutoff
      and not exists (
        select 1
        from private.admin_audit_log_retention_holds as hold
        where hold.audit_log_id = audit.id
          and hold.hold_until > v_now
      );
  get diagnostics v_admin_audit_deleted = row_count;

  -- Keep incomplete/running rows; only completed runs older than the cutoff expire.
  delete from cron.job_run_details as run
    where run.end_time is not null
      and run.end_time < v_cutoff;
  get diagnostics v_cron_runs_deleted = row_count;

  return pg_catalog.jsonb_build_object(
    'cutoff', v_cutoff,
    'admin_audit_log_rows_deleted', v_admin_audit_deleted,
    'expired_retention_holds_deleted', v_expired_holds_deleted,
    'cron_job_run_details_deleted', v_cron_runs_deleted
  );
end;
$function$;

revoke all on function private.prune_retained_logs()
  from public, anon, authenticated, service_role;

comment on function private.prune_retained_logs() is
  'Daily six-month retention purge for Loculary admin audit entries and completed pg_cron run details. Active admin audit holds are preserved; incomplete cron runs are never deleted. Returns counts only and emits no personal data.';

-- Named schedules are upserted by pg_cron, making this safe to reapply.
select cron.schedule(
  'loculary-log-retention-6m',
  '0 3 * * *',
  'select private.prune_retained_logs();'
);
