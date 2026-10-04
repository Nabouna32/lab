create or replace function private.agent_dispatcher_tick(
  p_source text default 'pg_cron',
  p_source_run_id text default null
)
returns table (
  expired_claims integer,
  pending_resume_requests integer,
  ready_missions integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claim record;
  v_expired integer := 0;
  v_run_id text := coalesce(p_source_run_id, to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS'));
begin
  for v_claim in
    select id, mission_id
    from private.agent_worker_claims
    where released_at is null and lease_until <= now()
    order by lease_until
    for update skip locked
    limit 50
  loop
    update private.agent_worker_claims
    set released_at = now()
    where id = v_claim.id
      and released_at is null
      and lease_until <= now();

    if found then
      update private.agent_missions
      set worker_state = 'RESUME_REQUIRED',
          runtime_state = 'RECOVERY_REQUIRED',
          resume_required = true,
          waiting_reason = 'worker lease expired; reconcile Git/GitHub/checkpoint before takeover',
          next_action = 'reconcile mission state before recovery'
      where id = v_claim.mission_id
        and lifecycle_state not in ('COMPLETED', 'ABANDONED');

      insert into private.agent_resume_requests (mission_id, reason)
      values (v_claim.mission_id, 'worker lease expired; recovery requires reconciliation')
      on conflict (mission_id) where status = 'PENDING' do nothing;

      perform private.agent_record_event(
        v_claim.mission_id,
        'WORKER_LEASE_EXPIRED',
        'dispatcher',
        'pg_cron',
        p_source,
        'lease-expired:' || v_claim.id::text,
        v_run_id,
        null,
        jsonb_build_object('claim_id', v_claim.id)
      );

      v_expired := v_expired + 1;
    end if;
  end loop;

  select count(*)::integer into pending_resume_requests
  from private.agent_resume_requests where status = 'PENDING';

  select count(*)::integer into ready_missions
  from private.agent_missions m where private.agent_mission_is_ready(m.id);

  expired_claims := v_expired;
  return next;
end;
$$;

revoke all on function private.agent_dispatcher_tick(text, text) from public, anon, authenticated;
grant execute on function private.agent_dispatcher_tick(text, text) to service_role;

comment on function private.agent_dispatcher_tick(text, text)
  is 'Free-plan dispatcher tick: expires stale worker leases, creates recovery requests, and reports dispatchable runtime counts.';

select cron.schedule(
  'agent-runtime-dispatcher',
  '* * * * *',
  $$select private.agent_dispatcher_tick('pg_cron')$$
);
