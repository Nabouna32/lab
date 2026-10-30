begin;

select plan(20);

select ok(
  to_regclass('private.admin_audit_log_retention_holds') is null,
  'no retention-hold archive table remains'
);
select ok(
  to_regprocedure('private.set_admin_audit_log_retention_hold(uuid,text,text,timestamptz)') is null,
  'no retention-hold exception function remains'
);
select ok(
  not has_function_privilege('anon', 'private.prune_retained_logs()', 'EXECUTE'),
  'anonymous users cannot execute the purge function'
);
select ok(
  not has_function_privilege('authenticated', 'private.prune_retained_logs()', 'EXECUTE'),
  'authenticated users cannot execute the purge function'
);
select ok(
  not has_function_privilege('service_role', 'private.prune_retained_logs()', 'EXECUTE'),
  'service role cannot execute the purge function'
);
select ok(
  has_function_privilege('postgres', 'private.prune_retained_logs()', 'EXECUTE'),
  'the database owner can execute the purge function'
);

select is(
  (select count(*)::integer from cron.job where jobname = 'loculary-log-retention-12m'),
  1,
  'exactly one named twelve-month retention job is scheduled'
);
select is(
  (select schedule from cron.job where jobname = 'loculary-log-retention-12m'),
  '0 3 * * *',
  'retention job runs daily at 03:00 UTC'
);
select is(
  (select command from cron.job where jobname = 'loculary-log-retention-12m'),
  'select private.prune_retained_logs();',
  'retention job invokes only the restricted purge function'
);
select ok(
  (select active from cron.job where jobname = 'loculary-log-retention-12m'),
  'retention job is active'
);
select is(
  (select username::text from cron.job where jobname = 'loculary-log-retention-12m'),
  current_user::text,
  'retention job runs as the migration owner'
);
select ok(
  (select p.prosecdef
   from pg_proc as p
   join pg_namespace as n on n.oid = p.pronamespace
   where n.nspname = 'private'
     and p.proname = 'prune_retained_logs'),
  'purge function is SECURITY DEFINER'
);

insert into public.admin_audit_log (
  id, actor_user_id, action, target_type, target_id, metadata, created_at
)
values
  (
    '00000000-0000-0000-0000-000000000901',
    null, 'test.retention.expired', 'system', null, '{}'::jsonb,
    now() - interval '13 months'
  ),
  (
    '00000000-0000-0000-0000-000000000902',
    null, 'test.retention.recent', 'system', null, '{}'::jsonb,
    now() - interval '11 months'
  );

insert into cron.job_run_details (
  runid, jobid, job_pid, database, username, command, status, start_time, end_time
)
values
  (
    -987654, 987654, pg_backend_pid(), current_database(), current_user, 'select 1',
    'succeeded', now() - interval '13 months', now() - interval '13 months'
  ),
  (
    -987655, 987655, pg_backend_pid(), current_database(), current_user, 'select 1',
    'succeeded', now() - interval '11 months', now() - interval '11 months'
  ),
  (
    -987656, 987656, pg_backend_pid(), current_database(), current_user, 'select 1',
    'running', now() - interval '13 months', null
  );

select lives_ok(
  $$select private.prune_retained_logs()$$,
  'the twelve-month purge executes successfully'
);

create temporary table retention_result on commit drop as
select private.prune_retained_logs() as result;

select ok(
  (select (result ->> 'admin_audit_log_rows_deleted')::integer >= 1 from retention_result),
  'purge reports expired admin audit rows'
);
select ok(
  (select (result ->> 'cron_job_run_details_deleted')::integer >= 1 from retention_result),
  'purge reports expired completed cron runs'
);

select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000901'),
  0,
  'unarchived admin audit events older than twelve months are deleted'
);
select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000902'),
  1,
  'admin audit events younger than twelve months are preserved'
);
select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987654),
  0,
  'completed cron runs older than twelve months are deleted'
);
select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987655),
  1,
  'completed cron runs younger than twelve months are preserved'
);
select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987656),
  1,
  'incomplete cron runs are preserved regardless of age'
);

select * from finish();
rollback;
