begin;

create extension if not exists pgtap with schema extensions;

select plan(10);

select has_schema('private', 'private schema exists');
select has_table('private', 'agent_missions', 'mission table exists');
select has_table('private', 'agent_worker_claims', 'claim table exists');
select has_table('private', 'agent_mission_dependencies', 'dependency table exists');
select has_table('private', 'agent_mission_events', 'event table exists');
select has_table('private', 'agent_resume_requests', 'resume table exists');

select ok(
  private.agent_mission_is_ready(
    private.agent_create_mission(
      'PGTAP-AGENT-RUNTIME-A',
      'agent-system',
      'agent runtime test A'
    )
  ),
  'new mission is initially ready'
);

select lives_ok(
  $$
    select private.agent_claim_mission(
      (select id from private.agent_missions where mission_key = 'PGTAP-AGENT-RUNTIME-A'),
      'meta-agent',
      'pgtap-worker',
      120
    )
  $$,
  'mission can be claimed atomically'
);

select lives_ok(
  $$
    select private.agent_record_event(
      (select id from private.agent_missions where mission_key = 'PGTAP-AGENT-RUNTIME-A'),
      'TEST_EVENT',
      'test',
      'pgtap',
      'pgtap',
      'pgtap-event-1'
    )
  $$,
  'event can be recorded'
);

select is(
  (
    select count(*)::integer
    from private.agent_mission_events
    where source = 'pgtap' and source_event_id = 'pgtap-event-1'
  ),
  1,
  'event source identity is unique'
);

select * from finish();

rollback;
