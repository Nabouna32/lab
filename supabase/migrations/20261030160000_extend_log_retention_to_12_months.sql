-- Extend Loculary-owned operational log retention to twelve months.
-- No purge is executed by this migration; the existing daily schedule is replaced.

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

comment on function private.prune_retained_logs() is
  'Daily twelve-month retention purge for Loculary admin audit entries and completed pg_cron run details. Active admin audit holds are preserved within the twelve-month maximum; incomplete cron runs are never deleted. Returns counts only and emits no personal data.';

-- Replace the old named schedule without running the purge during migration.
select cron.unschedule('loculary-log-retention-6m');

select cron.schedule(
  'loculary-log-retention-12m',
  '0 3 * * *',
  'select private.prune_retained_logs();'
);
