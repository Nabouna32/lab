-- Remove the unused agent orchestration runtime.
--
-- This migration is intentionally limited to agent-runtime objects. It does not
-- touch Loculary application tables, functions, policies, or other cron jobs.

select cron.unschedule(jobid) from cron.job where jobname = 'agent-runtime-dispatcher';

drop function if exists public.agent_dispatcher_tick(text, text);
drop function if exists private.agent_dispatcher_tick(text, text);

drop table if exists private.agent_resume_requests cascade;
drop table if exists private.agent_mission_events cascade;
drop table if exists private.agent_mission_dependencies cascade;
drop table if exists private.agent_worker_claims cascade;
drop table if exists private.agent_missions cascade;

drop function if exists private.agent_acknowledge_resume(uuid, text);
drop function if exists private.agent_add_dependency(uuid, uuid, text);
drop function if exists private.agent_claim_mission(uuid, text, text, integer);
drop function if exists private.agent_complete_mission(uuid);
drop function if exists private.agent_create_mission(text, text, text, text, text, integer);
drop function if exists private.agent_expire_claim(uuid);
drop function if exists private.agent_heartbeat_claim(uuid, text, integer);
drop function if exists private.agent_mission_is_ready(uuid);
drop function if exists private.agent_record_event(uuid, text, text, text, text, text, text, text, jsonb);
drop function if exists private.agent_release_claim(uuid, text, text);
drop function if exists private.agent_request_resume(uuid, text, text, text);
drop function if exists private.agent_set_runtime_blocked(uuid, text);
drop function if exists private.agent_touch_mission();
