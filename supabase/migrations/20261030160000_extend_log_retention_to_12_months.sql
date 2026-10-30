-- Retain Loculary-owned operational logs for twelve months, then delete them.
-- Remove the now-unneeded exception mechanism: no audit archive or hold survives the cutoff.
-- No purge is executed by this migration; the existing daily schedule is replaced.

drop function if exists private.set_admin_audit_log_retention_hold(uuid, text, text, timestamptz);
drop table if exists private.admin_audit_log_retention_holds;

create or replace function private.prune_retained_logs()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_cutoff timestamptz := v_now - interval '12 months';
  v_admin_audit_deleted bigint := 0;
  v_cron_runs_deleted bigint := 0;
begin
  delete from public.admin_audit_log as audit
    where audit.created_at < v_cutoff;
  get diagnostics v_admin_audit_deleted = row_count;

  -- Keep incomplete/running rows; only completed runs older than the cutoff expire.
  delete from cron.job_run_details as run
    where run.end_time is not null
      and run.end_time < v_cutoff;
  get diagnostics v_cron_runs_deleted = row_count;

  return pg_catalog.jsonb_build_object(
    'cutoff', v_cutoff,
    'admin_audit_log_rows_deleted', v_admin_audit_deleted,
    'cron_job_run_details_deleted', v_cron_runs_deleted
  );
end;
$function$;

revoke all on function private.prune_retained_logs()
  from public, anon, authenticated, service_role;

comment on function private.prune_retained_logs() is
  'Daily twelve-month retention purge for Loculary admin audit entries and completed pg_cron run details. No audit retention exceptions or archives are kept; incomplete cron runs are never deleted. Returns counts only and emits no personal data.';

-- Replace the old named schedule without running the purge during migration.
select cron.unschedule('loculary-log-retention-6m');

select cron.schedule(
  'loculary-log-retention-12m',
  '0 3 * * *',
  'select private.prune_retained_logs();'
);
