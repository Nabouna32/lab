-- Align the deployed runtime schema with the minimal execution-state contract.
-- Git/GitHub remain authoritative for branches, commits, PRs, CI and merge facts.
-- The production runtime is currently empty, so obsolete coordination columns can
-- be removed without a data migration.

alter table private.agent_missions
  add column execution_state text not null default 'READY';

alter table private.agent_missions
  add constraint agent_missions_execution_state_check
  check (
    execution_state in (
      'READY',
      'RUNNING',
      'WAITING',
      'RESUME_REQUIRED',
      'WAITING_HUMAN',
      'BLOCKED',
      'COMPLETED',
      'ABANDONED'
    )
  );

update private.agent_missions
set execution_state = case
  when lifecycle_state = 'COMPLETED' then 'COMPLETED'
  when lifecycle_state = 'ABANDONED' then 'ABANDONED'
  when worker_state = 'RUNNING' then 'RUNNING'
  when worker_state = 'WAITING_CI' then 'WAITING'
  when worker_state = 'RESUME_REQUIRED' then 'RESUME_REQUIRED'
  when worker_state = 'WAITING_HUMAN' then 'WAITING_HUMAN'
  when runtime_state = 'BLOCKED' then 'BLOCKED'
  else 'READY'
end;

drop index if exists private.agent_missions_ready_idx;
drop index if exists private.agent_missions_resume_idx;

alter table private.agent_mission_dependencies
  drop constraint if exists agent_mission_dependencies_condition_check;

alter table private.agent_mission_dependencies
  add constraint agent_mission_dependencies_condition_check
  check (condition = 'COMPLETED');

create index agent_missions_ready_idx
  on private.agent_missions (priority desc, created_at)
  where execution_state = 'READY';

create index agent_missions_resume_idx
  on private.agent_missions (priority desc, updated_at desc)
  where execution_state = 'RESUME_REQUIRED';

create or replace function private.agent_mission_is_ready(p_mission_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from private.agent_missions m
    where m.id = p_mission_id
      and m.execution_state = 'READY'
      and not exists (
        select 1
        from private.agent_worker_claims c
        where c.mission_id = m.id
          and c.released_at is null
      )
      and not exists (
        select 1
        from private.agent_mission_dependencies d
        join private.agent_missions dep
          on dep.id = d.depends_on_mission_id
        where d.mission_id = m.id
          and dep.execution_state <> 'COMPLETED'
      )
  );
$$;

create or replace function private.agent_create_mission(
  p_mission_key text,
  p_mission_type text,
  p_title text,
  p_priority text default 'NORMAL',
  p_required_worker_type text default null,
  p_issue_number integer default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into private.agent_missions (
    mission_key,
    mission_type,
    title,
    priority,
    required_worker_type,
    issue_number,
    execution_state
  )
  values (
    p_mission_key,
    p_mission_type,
    p_title,
    p_priority,
    p_required_worker_type,
    p_issue_number,
    'READY'
  )
  returning id into v_id;

  perform private.agent_record_event(
    v_id,
    'MISSION_CREATED',
    'runtime',
    null,
    'agent_create_mission',
    'mission-created:' || v_id::text
  );

  return v_id;
end;
$$;

create or replace function private.agent_add_dependency(
  p_mission_id uuid,
  p_depends_on_mission_id uuid,
  p_condition text default 'COMPLETED'
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_cycle boolean;
begin
  if p_condition <> 'COMPLETED' then
    raise exception 'Mission dependencies only support COMPLETED';
  end if;

  if p_mission_id = p_depends_on_mission_id then
    raise exception 'A mission cannot depend on itself';
  end if;

  if not exists (
    select 1 from private.agent_missions where id = p_mission_id
  ) then
    raise exception 'Mission % does not exist', p_mission_id;
  end if;

  if not exists (
    select 1 from private.agent_missions where id = p_depends_on_mission_id
  ) then
    raise exception 'Dependency mission % does not exist', p_depends_on_mission_id;
  end if;

  with recursive reachable(id) as (
    select p_depends_on_mission_id
    union
    select d.depends_on_mission_id
    from private.agent_mission_dependencies d
    join reachable r on r.id = d.mission_id
  )
  select exists (
    select 1 from reachable where id = p_mission_id
  ) into v_cycle;

  if v_cycle then
    raise exception 'Dependency would create a cycle';
  end if;

  insert into private.agent_mission_dependencies (
    mission_id,
    depends_on_mission_id,
    condition
  )
  values (
    p_mission_id,
    p_depends_on_mission_id,
    'COMPLETED'
  );
end;
$$;

create or replace function private.agent_claim_mission(
  p_mission_id uuid,
  p_worker_type text,
  p_worker_instance text,
  p_lease_seconds integer default 300
)
returns private.agent_worker_claims
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mission private.agent_missions;
  v_claim private.agent_worker_claims;
  v_is_ready boolean;
  v_was_resume_required boolean;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'Lease must be between 30 and 3600 seconds';
  end if;

  select *
  into v_mission
  from private.agent_missions
  where id = p_mission_id
  for update;

  if not found then
    raise exception 'Mission % does not exist', p_mission_id;
  end if;

  v_is_ready := private.agent_mission_is_ready(p_mission_id);
  v_was_resume_required := v_mission.execution_state = 'RESUME_REQUIRED';

  if not v_is_ready and v_mission.execution_state <> 'RESUME_REQUIRED' then
    raise exception 'Mission % is not claimable in its current state', p_mission_id;
  end if;

  if exists (
    select 1
    from private.agent_worker_claims
    where mission_id = p_mission_id
      and released_at is null
  ) then
    raise exception 'Mission % already has an active claim', p_mission_id;
  end if;

  insert into private.agent_worker_claims (
    mission_id,
    worker_type,
    worker_instance,
    lease_until
  )
  values (
    p_mission_id,
    p_worker_type,
    p_worker_instance,
    now() + make_interval(secs => p_lease_seconds)
  )
  returning * into v_claim;

  update private.agent_missions
  set execution_state = 'RUNNING',
      waiting_reason = null
  where id = p_mission_id;

  update private.agent_resume_requests
  set status = 'COMPLETED',
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
  where mission_id = p_mission_id
    and status in ('PENDING', 'ACKNOWLEDGED');

  perform private.agent_record_event(
    p_mission_id,
    'MISSION_CLAIMED',
    'worker',
    p_worker_instance,
    'agent_claim_mission',
    'claim:' || v_claim.id::text
  );

  if v_was_resume_required then
    perform private.agent_record_event(
      p_mission_id,
      'WORKER_RESUMED',
      'worker',
      p_worker_instance,
      'agent_claim_mission',
      'resumed:' || v_claim.id::text
    );
  end if;

  return v_claim;
end;
$$;

create or replace function private.agent_release_claim(
  p_claim_id uuid,
  p_worker_instance text,
  p_reason text default null
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mission_id uuid;
begin
  update private.agent_worker_claims
  set released_at = now()
  where id = p_claim_id
    and worker_instance = p_worker_instance
    and released_at is null
  returning mission_id into v_mission_id;

  if v_mission_id is null then
    raise exception 'Claim % is not active for worker %', p_claim_id, p_worker_instance;
  end if;

  update private.agent_missions
  set execution_state = 'WAITING',
      waiting_reason = p_reason
  where id = v_mission_id
    and execution_state not in ('COMPLETED', 'ABANDONED');

end;
$$;

create or replace function private.agent_expire_claim(
  p_claim_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mission_id uuid;
begin
  update private.agent_worker_claims
  set released_at = now()
  where id = p_claim_id
    and released_at is null
    and lease_until <= now()
  returning mission_id into v_mission_id;

  if v_mission_id is null then
    raise exception 'Claim % is not expired or already released', p_claim_id;
  end if;

  update private.agent_missions
  set execution_state = 'RESUME_REQUIRED',
      waiting_reason = 'worker lease expired; reconcile Git/GitHub/checkpoint before takeover'
  where id = v_mission_id
    and execution_state not in ('COMPLETED', 'ABANDONED');

  insert into private.agent_resume_requests (mission_id, reason)
  values (
    v_mission_id,
    'worker lease expired; recovery requires reconciliation'
  )
  on conflict (mission_id) where status = 'PENDING' do nothing;

  perform private.agent_record_event(
    v_mission_id,
    'WORKER_LEASE_EXPIRED',
    'dispatcher',
    'lease',
    'agent_expire_claim',
    'lease-expired:' || p_claim_id::text,
    null,
    null,
    jsonb_build_object('claim_id', p_claim_id)
  );

  return v_mission_id;
end;
$$;

create or replace function private.agent_request_resume(
  p_mission_id uuid,
  p_reason text,
  p_target_worker_type text default null,
  p_target_worker_instance text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not exists (
    select 1
    from private.agent_missions
    where id = p_mission_id
      and execution_state not in ('COMPLETED', 'ABANDONED')
  ) then
    raise exception 'Mission % does not exist or is terminal', p_mission_id;
  end if;

  insert into private.agent_resume_requests (
    mission_id,
    reason,
    target_worker_type,
    target_worker_instance
  )
  values (
    p_mission_id,
    p_reason,
    p_target_worker_type,
    p_target_worker_instance
  )
  on conflict (mission_id) where status = 'PENDING'
  do update set
    reason = excluded.reason,
    target_worker_type = excluded.target_worker_type,
    target_worker_instance = excluded.target_worker_instance,
    updated_at = now()
  returning id into v_id;

  update private.agent_missions
  set execution_state = 'RESUME_REQUIRED',
      waiting_reason = p_reason
  where id = p_mission_id
    and execution_state not in ('COMPLETED', 'ABANDONED');

  perform private.agent_record_event(
    p_mission_id,
    'RESUME_REQUIRED',
    'runtime',
    null,
    'agent_request_resume',
    'resume-required:' || v_id::text
  );

  return v_id;
end;
$$;

create or replace function private.agent_acknowledge_resume(
  p_resume_request_id uuid,
  p_worker_instance text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update private.agent_resume_requests
  set status = 'ACKNOWLEDGED',
      attempts = attempts + 1,
      last_attempt_at = now(),
      acknowledged_at = coalesce(acknowledged_at, now()),
      updated_at = now()
  where id = p_resume_request_id
    and status = 'PENDING'
    and (
      target_worker_instance is null
      or target_worker_instance = p_worker_instance
    );

  if not found then
    raise exception 'Resume request % is not pending or not assigned to worker %',
      p_resume_request_id, p_worker_instance;
  end if;

  perform private.agent_record_event(
    (
      select mission_id
      from private.agent_resume_requests
      where id = p_resume_request_id
    ),
    'WORKER_RESUME_REQUESTED',
    'wake_adapter',
    p_worker_instance,
    'agent_acknowledge_resume',
    'resume-ack:' || p_resume_request_id::text
  );
end;
$$;

create or replace function private.agent_set_runtime_blocked(
  p_mission_id uuid,
  p_reason text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update private.agent_missions
  set execution_state = 'BLOCKED',
      waiting_reason = p_reason
  where id = p_mission_id
    and execution_state not in ('COMPLETED', 'ABANDONED');

  if not found then
    raise exception 'Mission % does not exist or is terminal', p_mission_id;
  end if;

  perform private.agent_record_event(
    p_mission_id,
    'MISSION_BLOCKED',
    'runtime',
    null,
    'agent_set_runtime_blocked'
  );
end;
$$;

create or replace function private.agent_complete_mission(
  p_mission_id uuid,
  p_next_action text default null
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_claim_exists boolean;
begin
  select exists (
    select 1
    from private.agent_worker_claims
    where mission_id = p_mission_id
      and released_at is null
  ) into v_claim_exists;

  if v_claim_exists then
    raise exception 'Mission % still has an active worker claim', p_mission_id;
  end if;

  update private.agent_missions
  set execution_state = 'COMPLETED',
      waiting_reason = null,
      completed_at = now()
  where id = p_mission_id
    and execution_state not in ('ABANDONED', 'COMPLETED');

  if not found then
    raise exception 'Mission % cannot be completed', p_mission_id;
  end if;

  update private.agent_resume_requests
  set status = 'COMPLETED',
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
  where mission_id = p_mission_id
    and status in ('PENDING', 'ACKNOWLEDGED');

  perform private.agent_record_event(
    p_mission_id,
    'MISSION_COMPLETED',
    'runtime',
    null,
    'agent_complete_mission'
  );
end;
$$;

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
  v_run_id text := coalesce(
    p_source_run_id,
    to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS')
  );
begin
  for v_claim in
    select id, mission_id
    from private.agent_worker_claims
    where released_at is null
      and lease_until <= now()
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
      set execution_state = 'RESUME_REQUIRED',
          waiting_reason = 'worker lease expired; reconcile Git/GitHub/checkpoint before takeover'
      where id = v_claim.mission_id
        and execution_state not in ('COMPLETED', 'ABANDONED');

      insert into private.agent_resume_requests (
        mission_id,
        reason
      )
      values (
        v_claim.mission_id,
        'worker lease expired; recovery requires reconciliation'
      )
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

  select count(*)::integer
  into pending_resume_requests
  from private.agent_resume_requests
  where status = 'PENDING';

  select count(*)::integer
  into ready_missions
  from private.agent_missions m
  where private.agent_mission_is_ready(m.id);

  expired_claims := v_expired;
  return next;
end;
$$;

create or replace function public.agent_dispatcher_tick(
  p_source text default 'edge_function',
  p_source_run_id text default null
)
returns table (
  expired_claims integer,
  pending_resume_requests integer,
  ready_missions integer
)
language sql
security definer
set search_path = ''
as $$
  select *
  from private.agent_dispatcher_tick($1, $2);
$$;

drop index if exists private.agent_missions_ready_idx;
drop index if exists private.agent_missions_resume_idx;

alter table private.agent_missions
  drop column branch_name,
  drop column pr_number,
  drop column pr_head_sha,
  drop column lifecycle_state,
  drop column worker_state,
  drop column delivery_state,
  drop column runtime_state,
  drop column resume_required,
  drop column next_action;

alter table private.agent_missions
  alter column execution_state set default 'READY';

revoke all on function private.agent_dispatcher_tick(text, text)
  from public, anon, authenticated;
grant execute on function private.agent_dispatcher_tick(text, text)
  to service_role;

revoke all on function public.agent_dispatcher_tick(text, text)
  from public, anon, authenticated;
grant execute on function public.agent_dispatcher_tick(text, text)
  to service_role;

comment on function private.agent_dispatcher_tick(text, text)
  is 'Free-plan runtime reconciliation: expires stale worker leases, creates recovery requests, and reports dispatchable runtime counts. It does not own GitHub delivery state or launch ChatGPT conversations.';

comment on function public.agent_dispatcher_tick(text, text)
  is 'Restricted server-side bridge to the private agent dispatcher; callable only with service_role.';
