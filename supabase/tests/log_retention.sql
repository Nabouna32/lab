begin;

select plan(45);

select ok(
  (select c.relrowsecurity
   from pg_class as c
   join pg_namespace as n on n.oid = c.relnamespace
   where n.nspname = 'private'
     and c.relname = 'admin_audit_log_retention_holds'),
  'retention hold table has row-level security enabled'
);

select ok(
  not has_table_privilege('anon', 'private.admin_audit_log_retention_holds', 'SELECT'),
  'anonymous users cannot read retention holds'
);
select ok(
  not has_table_privilege('anon', 'private.admin_audit_log_retention_holds', 'INSERT'),
  'anonymous users cannot create retention holds'
);
select ok(
  not has_table_privilege('authenticated', 'private.admin_audit_log_retention_holds', 'SELECT'),
  'authenticated users cannot read retention holds'
);
select ok(
  not has_table_privilege('authenticated', 'private.admin_audit_log_retention_holds', 'INSERT'),
  'authenticated users cannot create retention holds'
);
select ok(
  not has_table_privilege('service_role', 'private.admin_audit_log_retention_holds', 'SELECT'),
  'service role cannot read retention holds through the API'
);
select ok(
  not has_table_privilege('service_role', 'private.admin_audit_log_retention_holds', 'INSERT'),
  'service role cannot create retention holds through the API'
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
  not has_function_privilege('anon', 'private.set_admin_audit_log_retention_hold(uuid,text,text,timestamptz)', 'EXECUTE'),
  'anonymous users cannot create retention exceptions'
);
select ok(
  not has_function_privilege('authenticated', 'private.set_admin_audit_log_retention_hold(uuid,text,text,timestamptz)', 'EXECUTE'),
  'authenticated users cannot create retention exceptions'
);
select ok(
  not has_function_privilege('service_role', 'private.set_admin_audit_log_retention_hold(uuid,text,text,timestamptz)', 'EXECUTE'),
  'service role cannot create retention exceptions through the API'
);
select ok(
  not has_function_privilege('service_role', 'private.set_admin_audit_log_retention_hold(uuid,text,text,timestamptz)', 'EXECUTE'),
  'service role cannot create retention exceptions'
);

select is(
  (select count(*)::integer from cron.job where jobname = 'loculary-log-retention-6m'),
  1,
  'exactly one named six-month retention job is scheduled'
);
select is(
  (select schedule from cron.job where jobname = 'loculary-log-retention-6m'),
  '0 3 * * *',
  'retention job runs daily at 03:00 GMT'
);
select is(
  (select command from cron.job where jobname = 'loculary-log-retention-6m'),
  'select private.prune_retained_logs();',
  'retention job invokes only the restricted purge function'
);
select ok(
  (select active from cron.job where jobname = 'loculary-log-retention-6m'),
  'retention job is active'
);
select is(
  (select username from cron.job where jobname = 'loculary-log-retention-6m'),
  current_user,
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
select ok(
  (select p.prosecdef
   from pg_proc as p
   join pg_namespace as n on n.oid = p.pronamespace
   where n.nspname = 'private'
     and p.proname = 'set_admin_audit_log_retention_hold'),
  'retention hold function is SECURITY DEFINER'
);

insert into public.admin_audit_log (
  id, actor_user_id, action, target_type, target_id, metadata, created_at
)
values
  (
    '00000000-0000-0000-0000-000000000901',
    null, 'test.retention.expired-unheld', 'system', null, '{}'::jsonb,
    now() - interval '7 months'
  ),
  (
    '00000000-0000-0000-0000-000000000902',
    null, 'test.retention.expired-held', 'system', null, '{}'::jsonb,
    now() - interval '7 months'
  ),
  (
    '00000000-0000-0000-0000-000000000903',
    null, 'test.retention.recent', 'system', null, '{}'::jsonb,
    now() - interval '5 months'
  ),
  (
    '00000000-0000-0000-0000-000000000904',
    null, 'test.retention.recent-expired-hold', 'system', null, '{}'::jsonb,
    now() - interval '5 months'
  );

select lives_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000902'::uuid,
    'security_incident',
    'INC-2026-001',
    now() + interval '30 days'
  )$$,
  'a documented security incident can hold an audit event within twelve months'
);

select throws_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000903'::uuid,
    'unknown_reason',
    'INC-2026-002',
    now() + interval '30 days'
  )$$,
  '22023',
  'Invalid retention hold reason code.',
  'unknown hold reasons are rejected'
);

select throws_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000903'::uuid,
    'legal_obligation',
    'personal data is not a reference',
    now() + interval '30 days'
  )$$,
  '22023',
  'Retention hold reference must be a non-personal INC-YYYY-NNN code.',
  'retention references must use a non-personal incident code'
);

select throws_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000903'::uuid,
    'internal_investigation',
    'INC-2026-003',
    now() + interval '8 months'
  )$$,
  '22023',
  'Retention holds must expire in the future and no later than twelve months after the audit event.',
  'retention holds cannot exceed twelve months after the event'
);

select throws_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000903'::uuid,
    'internal_investigation',
    'INC-2026-004',
    now() - interval '1 day'
  )$$,
  '22023',
  'Retention holds must expire in the future and no later than twelve months after the audit event.',
  'expired retention holds cannot be created'
);

select throws_ok(
  $$select private.set_admin_audit_log_retention_hold(
    '00000000-0000-0000-0000-000000000999'::uuid,
    'internal_investigation',
    'INC-2026-005',
    now() + interval '30 days'
  )$$,
  'P0002',
  'Admin audit log entry not found.',
  'retention holds cannot reference missing audit events'
);

insert into private.admin_audit_log_retention_holds (
  audit_log_id, reason_code, reference_code, hold_until, created_at
)
values (
  '00000000-0000-0000-0000-000000000904',
  'legal_obligation',
  'INC-2026-006',
  now() - interval '1 day',
  now() - interval '2 days'
);

-- A deleted account must not remain identifiable through an audit actor,
-- a polymorphic target, or a retention-hold creator reference.
insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  '00000000-0000-0000-0000-000000000905',
  'authenticated',
  'authenticated',
  'pgtap-retention-delete@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"pgTAP retention delete"}'::jsonb,
  now(),
  now()
);

insert into public.admin_audit_log (
  id, actor_user_id, action, target_type, target_id, metadata, created_at
)
values (
  '00000000-0000-0000-0000-000000000905',
  '00000000-0000-0000-0000-000000000905',
  'test.retention.account-deletion',
  'user',
  '00000000-0000-0000-0000-000000000905',
  '{}'::jsonb,
  now() - interval '5 months'
);

insert into private.admin_audit_log_retention_holds (
  audit_log_id, reason_code, reference_code, hold_until, created_by
)
values (
  '00000000-0000-0000-0000-000000000905',
  'legal_obligation',
  'INC-2026-007',
  now() + interval '30 days',
  '00000000-0000-0000-0000-000000000905'
);

select lives_ok(
  $delete from auth.users where id = '00000000-0000-0000-0000-000000000905'::uuid$,
  'deleting an ordinary account succeeds while retention metadata is present'
);

select ok(
  not exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000905'),
  'deleted account is removed from Auth'
);
select is(
  (select actor_user_id from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000905'),
  null::uuid,
  'account deletion anonymizes the audit actor'
);
select is(
  (select target_id from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000905'),
  null::uuid,
  'account deletion anonymizes the audit target'
);
select is(
  (select created_by from private.admin_audit_log_retention_holds where audit_log_id = '00000000-0000-0000-0000-000000000905'),
  null::uuid,
  'account deletion anonymizes the retention-hold creator'
);
select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000905'),
  1,
  'admin audit event remains available until its retention period expires'
);
select is(
  (select count(*)::integer from private.admin_audit_log_retention_holds where audit_log_id = '00000000-0000-0000-0000-000000000905'),
  1,
  'active retention exception remains attached to the anonymized audit event'
);

insert into cron.job_run_details (
  jobid, job_pid, database, username, command, status, start_time, end_time
)
values
  (
    987654, pg_backend_pid(), current_database(), current_user, 'select 1',
    'succeeded', now() - interval '7 months', now() - interval '7 months'
  ),
  (
    987655, pg_backend_pid(), current_database(), current_user, 'select 1',
    'succeeded', now() - interval '5 months', now() - interval '5 months'
  ),
  (
    987656, pg_backend_pid(), current_database(), current_user, 'select 1',
    'running', now() - interval '7 months', null
  );

create temporary table retention_result on commit drop as
select private.prune_retained_logs() as result;

select ok(
  (select (result ->> 'admin_audit_log_rows_deleted')::integer >= 1 from retention_result),
  'purge reports expired admin audit rows'
);
select ok(
  (select (result ->> 'expired_retention_holds_deleted')::integer >= 1 from retention_result),
  'purge reports expired retention holds'
);
select ok(
  (select (result ->> 'cron_job_run_details_deleted')::integer >= 1 from retention_result),
  'purge reports expired cron run details'
);

select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000901'),
  0,
  'unheld admin audit events older than six months are deleted'
);
select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000902'),
  1,
  'admin audit events with an active hold are preserved'
);
select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000903'),
  1,
  'admin audit events younger than six months are preserved'
);
select is(
  (select count(*)::integer from public.admin_audit_log where id = '00000000-0000-0000-0000-000000000904'),
  1,
  'an expired hold does not cause a recent audit event to be deleted'
);
select is(
  (select count(*)::integer from private.admin_audit_log_retention_holds where audit_log_id = '00000000-0000-0000-0000-000000000902'),
  1,
  'active retention holds remain in the private schema'
);
select is(
  (select count(*)::integer from private.admin_audit_log_retention_holds where audit_log_id = '00000000-0000-0000-0000-000000000904'),
  0,
  'expired retention holds are removed'
);

select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987654),
  0,
  'completed cron runs older than six months are deleted'
);
select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987655),
  1,
  'completed cron runs younger than six months are preserved'
);
select is(
  (select count(*)::integer from cron.job_run_details where jobid = 987656),
  1,
  'incomplete cron runs are preserved regardless of age'
);

select * from finish();
rollback;
