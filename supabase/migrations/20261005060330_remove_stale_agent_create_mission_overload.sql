-- Remove the stale seven-argument mission creation overload left behind by
-- the execution-state migration. The canonical runtime API has six arguments;
-- the obsolete overload still references the removed next_action column.

drop function if exists private.agent_create_mission(
  text,
  text,
  text,
  text,
  text,
  integer,
  text
);
