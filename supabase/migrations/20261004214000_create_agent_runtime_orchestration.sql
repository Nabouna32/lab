-- Agent runtime orchestration foundation.
-- Runtime coordination is internal state. Git/GitHub remain authoritative for
-- code, branches, PRs, CI and merge facts.

create schema if not exists private;

create table private.agent_missions (
  id uuid primary key default gen_random_uuid(),
  mission_key text not null unique,
  mission_type text not null check (
    mission_type in ('product', 'audit', 'feature', 'tool', 'agent-system')
  ),
  title text not null,
  priority text not null default 'NORMAL' check (
    priority in ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')
  ),
  required_worker_type text,
  issue_number integer,
  branch_name text,
  pr_number integer,
  pr_head_sha text,
  checkpoint_path text,
  lifecycle_state text not null default 'READY' check (
    lifecycle_state in ('READY', 'ACTIVE', 'MERGED', 'COMPLETED', 'BLOCKED', 'ABANDONED')
  ),
  worker_state text not null default 'IDLE' check (
    worker_state in ('IDLE', 'RUNNING', 'WAITING_CI', 'RESUME_REQUIRED', 'WAITING_HUMAN')
  ),
  delivery_state text not null default 'NOT_STARTED' check (
    delivery_state in (
      'NOT_STARTED',
      'BRANCH_CREATED',
      'PR_OPEN',
      'CI_WAITING',
      'CI_FAILED',
      'CI_PASSED',
      'MERGED'
    )
  ),
  runtime_state text not null default 'UNCLAIMED' check (
    runtime_state in ('UNCLAIMED', 'CLAIMED', 'RECOVERY_REQUIRED', 'BLOCKED')
  ),
  resume_required boolean not null default false,
  waiting_reason text,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index agent_missions_ready_idx
  on private.agent_missions (priority desc, created_at)
  where lifecycle_state = 'READY'
    and worker_state = 'IDLE'
    and runtime_state = 'UNCLAIMED';

create index agent_missions_resume_idx
  on private.agent_missions (priority desc, updated_at desc)
  where resume_required = true;

create table private.agent_worker_claims (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references private.agent_missions(id) on delete restrict,
  worker_type text not null,
  worker_instance text not null,
  claimed_at timestamptz not null default now(),
  lease_until timestamptz not null,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  check (lease_until > claimed_at),
  check (released_at is null or released_at >= claimed_at)
);

create unique index agent_worker_claims_active_mission_idx
  on private.agent_worker_claims (mission_id)
  where released_at is null;

create index agent_worker_claims_lease_idx
  on private.agent_worker_claims (lease_until)
  where released_at is null;

create table private.agent_mission_dependencies (
  mission_id uuid not null references private.agent_missions(id) on delete restrict,
  depends_on_mission_id uuid not null references private.agent_missions(id) on delete restrict,
  condition text not null default 'COMPLETED' check (
    condition in ('COMPLETED', 'MERGED')
  ),
  created_at timestamptz not null default now(),
  primary key (mission_id, depends_on_mission_id),
  check (mission_id <> depends_on_mission_id)
);

create index agent_mission_dependencies_dependency_idx
  on private.agent_mission_dependencies (depends_on_mission_id);

create table private.agent_mission_events (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references private.agent_missions(id) on delete restrict,
  event_type text not null,
  actor_type text not null,
  actor_id text,
  source text not null,
  source_event_id text,
  source_run_id text,
  source_sha text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index agent_mission_events_source_identity_idx
  on private.agent_mission_events (source, source_event_id)
  where source_event_id is not null;

create index agent_mission_events_mission_created_idx
  on private.agent_mission_events (mission_id, created_at desc);

create table private.agent_resume_requests (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references private.agent_missions(id) on delete restrict,
  reason text not null,
  target_worker_type text,
  target_worker_instance text,
  status text not null default 'PENDING' check (
    status in ('PENDING', 'ACKNOWLEDGED', 'COMPLETED', 'CANCELLED', 'EXPIRED')
  ),
  attempts integer not null default 0 check (attempts >= 0),
  last_attempt_at timestamptz,
  acknowledged_at timestamptz,
  completed_at timestamptz,
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index agent_resume_requests_pending_mission_idx
  on private.agent_resume_requests (mission_id)
  where status = 'PENDING';

create index agent_resume_requests_pending_idx
  on private.agent_resume_requests (requested_at)
  where status = 'PENDING';

create or replace function private.agent_touch_mission()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agent_missions_touch
before update on private.agent_missions
for each row execute function private.agent_touch_mission();

create trigger agent_resume_requests_touch
before update on private.agent_resume_requests
for each row execute function private.agent_touch_mission();

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
      and m.lifecycle_state = 'READY'
      and m.worker_state = 'IDLE'
      and m.runtime_state = 'UNCLAIMED'
      and not exists (
        select 1
        from private.agent_mission_dependencies d
        join private.agent_missions dep on dep.id = d.depends_on_mission_id
        where d.mission_id = m.id
          and (
            (d.condition = 'COMPLETED' and dep.lifecycle_state <> 'COMPLETED')
            or (d.condition = 'MERGED' and dep.delivery_state <> 'MERGED')
          )
      )
  );
$$;

create or replace function private.agent_create_mission(
  p_mission_key text,
  p_mission_type text,
  p_title text,
  p_priority text default 'NORMAL',
  p_required_worker_type text default null,
  p_issue_number integer default null,
  p_next_action text default null
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
    next_action
  )
  values (
    p_mission_key,
    p_mission_type,
    p_title,
    p_priority,
    p_required_worker_type,
    p_issue_number,
    p_next_action
  )
  returning id into v_id;

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
    p_condition
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

  if not private.agent_mission_is_ready(p_mission_id)
     and not (
       v_mission.worker_state = 'RESUME_REQUIRED'
       and v_mission.runtime_state = 'RECOVERY_REQUIRED'
     ) then
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
  set lifecycle_state = case
        when lifecycle_state = 'READY' then 'ACTIVE'
        else lifecycle_state
      end,
      worker_state = 'RUNNING',
      runtime_state = 'CLAIMED',
      resume_required = false,
      waiting_reason = null,
      next_action = 'worker execution'
  where id = p_mission_id;

  update private.agent_resume_requests
  set status = 'COMPLETED',
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
  where mission_id = p_mission_id
    and status in ('PENDING', 'ACKNOWLEDGED');

  return v_claim;
end;
$$;

create or replace function private.agent_heartbeat_claim(
  p_claim_id uuid,
  p_worker_instance text,
  p_lease_seconds integer default 300
)
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_until timestamptz;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'Lease must be between 30 and 3600 seconds';
  end if;

  update private.agent_worker_claims
  set lease_until = now() + make_interval(secs => p_lease_seconds)
  where id = p_claim_id
    and worker_instance = p_worker_instance
    and released_at is null
    and lease_until > now()
  returning lease_until into v_until;

  if v_until is null then
    raise exception 'Claim % is not active for worker %', p_claim_id, p_worker_instance;
  end if;

  return v_until;
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
  set worker_state = 'IDLE',
      runtime_state = 'UNCLAIMED',
      waiting_reason = p_reason,
      next_action = coalesce(p_reason, 'eligible for a new claim')
  where id = v_mission_id
    and lifecycle_state not in ('COMPLETED', 'ABANDONED');
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
  set worker_state = 'RESUME_REQUIRED',
      runtime_state = 'RECOVERY_REQUIRED',
      resume_required = true,
      waiting_reason = 'worker lease expired; reconcile Git/GitHub/checkpoint before takeover',
      next_action = 'reconcile mission state before recovery'
  where id = v_mission_id
    and lifecycle_state not in ('COMPLETED', 'ABANDONED');

  insert into private.agent_resume_requests (mission_id, reason)
  values (
    v_mission_id,
    'worker lease expired; recovery requires reconciliation'
  )
  on conflict (mission_id) where status = 'PENDING' do nothing;

  return v_mission_id;
end;
$$;

create or replace function private.agent_record_event(
  p_mission_id uuid,
  p_event_type text,
  p_actor_type text,
  p_actor_id text,
  p_source text,
  p_source_event_id text default null,
  p_source_run_id text default null,
  p_source_sha text default null,
  p_payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_source_event_id is not null then
    select id
    into v_id
    from private.agent_mission_events
    where source = p_source
      and source_event_id = p_source_event_id;

    if v_id is not null then
      return v_id;
    end if;
  end if;

  insert into private.agent_mission_events (
    mission_id,
    event_type,
    actor_type,
    actor_id,
    source,
    source_event_id,
    source_run_id,
    source_sha,
    payload
  )
  values (
    p_mission_id,
    p_event_type,
    p_actor_type,
    p_actor_id,
    p_source,
    p_source_event_id,
    p_source_run_id,
    p_source_sha,
    p_payload
  )
  returning id into v_id;

  return v_id;
exception
  when unique_violation then
    select id
    into v_id
    from private.agent_mission_events
    where source = p_source
      and source_event_id = p_source_event_id;

    return v_id;
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
    attempts = private.agent_resume_requests.attempts,
    updated_at = now()
  returning id into v_id;

  update private.agent_missions
  set worker_state = 'RESUME_REQUIRED',
      runtime_state = 'RECOVERY_REQUIRED',
      resume_required = true,
      waiting_reason = p_reason,
      next_action = 'resume worker and reconcile state'
  where id = p_mission_id
    and lifecycle_state not in ('COMPLETED', 'ABANDONED');

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
  set runtime_state = 'BLOCKED',
      worker_state = 'WAITING_HUMAN',
      waiting_reason = p_reason,
      next_action = 'human decision required'
  where id = p_mission_id
    and lifecycle_state not in ('COMPLETED', 'ABANDONED');

  if not found then
    raise exception 'Mission % does not exist or is terminal', p_mission_id;
  end if;
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
  set lifecycle_state = 'COMPLETED',
      worker_state = 'IDLE',
      runtime_state = 'UNCLAIMED',
      resume_required = false,
      waiting_reason = null,
      next_action = p_next_action,
      completed_at = now()
  where id = p_mission_id
    and lifecycle_state <> 'ABANDONED';

  if not found then
    raise exception 'Mission % cannot be completed', p_mission_id;
  end if;

  update private.agent_resume_requests
  set status = 'COMPLETED',
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
  where mission_id = p_mission_id
    and status in ('PENDING', 'ACKNOWLEDGED');
end;
$$;

alter table private.agent_missions enable row level security;
alter table private.agent_worker_claims enable row level security;
alter table private.agent_mission_dependencies enable row level security;
alter table private.agent_mission_events enable row level security;
alter table private.agent_resume_requests enable row level security;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

revoke all on all tables in schema private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema private to service_role;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on all functions in schema private to service_role;

comment on schema private is 'Internal Loculary runtime coordination; not exposed through the Supabase Data API.';
comment on table private.agent_missions is 'Runtime mission index; Git/GitHub remain authoritative for implementation and delivery facts.';
comment on table private.agent_worker_claims is 'Ephemeral worker ownership leases; expiration creates recovery, not automatic takeover.';
comment on table private.agent_mission_dependencies is 'Runtime mission dependency graph.';
comment on table private.agent_mission_events is 'Append-only orchestration event history with idempotent external event identity.';
comment on table private.agent_resume_requests is 'Durable requests for worker resumption; request state is not proof of worker resumption.';
