-- Remove the obsolete next_action parameter from the canonical mission
-- completion API. The execution-state runtime no longer stores or consumes it.

drop function if exists private.agent_complete_mission(uuid, text);

create or replace function private.agent_complete_mission(
  p_mission_id uuid
)
returns void
language plpgsql
set search_path = ''
as $function$
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
$function$;
