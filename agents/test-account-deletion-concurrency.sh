#!/usr/bin/env bash
set -euo pipefail

user_a='00000000-0000-0000-0000-000000000201'
user_b='00000000-0000-0000-0000-000000000202'
session_a='00000000-0000-0000-0000-000000000203'
session_b='00000000-0000-0000-0000-000000000204'
lock_key='loculary.account-deletion.super-admin'
work_dir="$(mktemp -d)"
holder_pid=''

db_url="$(supabase status -o env | sed -n 's/^DB_URL=//p' | tr -d '"')"
if [[ -z "$db_url" ]]; then
  echo "Could not resolve the local Supabase DB_URL." >&2
  exit 1
fi
if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required for the concurrent account-deletion test." >&2
  exit 1
fi

cleanup() {
  if [[ -n "$holder_pid" ]]; then
    kill "$holder_pid" >/dev/null 2>&1 || true
    wait "$holder_pid" >/dev/null 2>&1 || true
  fi
  psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null 2>&1 <<SQL || true
delete from public.admin_audit_log
 where actor_user_id in ('$user_a'::uuid, '$user_b'::uuid)
    or target_id in ('$user_a'::uuid, '$user_b'::uuid);
delete from public.admin_user_roles
 where user_id in ('$user_a'::uuid, '$user_b'::uuid);
delete from auth.users
 where id in ('$user_a'::uuid, '$user_b'::uuid);
SQL
  rm -rf "$work_dir"
}
trap cleanup EXIT

# Ensure a previous interrupted run cannot leave fixtures behind.
psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
delete from public.admin_audit_log
 where actor_user_id in ('$user_a'::uuid, '$user_b'::uuid)
    or target_id in ('$user_a'::uuid, '$user_b'::uuid);
delete from public.admin_user_roles
 where user_id in ('$user_a'::uuid, '$user_b'::uuid);
delete from auth.users
 where id in ('$user_a'::uuid, '$user_b'::uuid);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '$user_a', 'authenticated', 'authenticated',
    'pgtap-concurrency-a@example.invalid',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Concurrency A"}'::jsonb, now(), now()
  ),
  (
    '$user_b', 'authenticated', 'authenticated',
    'pgtap-concurrency-b@example.invalid',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Concurrency B"}'::jsonb, now(), now()
  );

insert into auth.sessions (id, user_id, created_at, updated_at)
values
  ('$session_a', '$user_a', now(), now()),
  ('$session_b', '$user_b', now(), now());

insert into public.admin_user_roles (user_id, role_key, assigned_by)
values
  ('$user_a', 'super_admin', '$user_a'),
  ('$user_b', 'super_admin', '$user_b');
SQL

# Hold the shared lock until both competing operations have started. They then
# race for one serialization point: delete A versus removing B's super_admin role.
psql "$db_url" -v ON_ERROR_STOP=1 \
  -c "begin; select pg_advisory_xact_lock(hashtextextended('$lock_key', 0)); select pg_sleep(8); commit;" \
  >"$work_dir/lock.log" 2>&1 &
holder_pid=$!

lock_ready=false
for _ in $(seq 1 100); do
  lock_state="$(psql "$db_url" -Atqc "select not pg_try_advisory_xact_lock(hashtextextended('$lock_key', 0))" 2>/dev/null || true)"
  if [[ "$lock_state" == 't' ]]; then
    lock_ready=true
    break
  fi
  sleep 0.1
done
if [[ "$lock_ready" != true ]]; then
  echo "Timed out waiting for the advisory-lock holder." >&2
  cat "$work_dir/lock.log" >&2 || true
  exit 1
fi

psql "$db_url" -v ON_ERROR_STOP=1 \
  -c "delete from auth.users where id = '$user_a'::uuid" \
  >"$work_dir/delete.log" 2>&1 &
delete_pid=$!

psql "$db_url" -v ON_ERROR_STOP=1 >"$work_dir/remove-role.log" 2>&1 <<SQL &
begin;
select set_config('request.jwt.claim.sub', '$user_a', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"$user_a","session_id":"$session_a","role":"authenticated","aud":"authenticated"}',
  true
);
set local role authenticated;
select public.remove_admin_role('$user_b'::uuid, 'super_admin');
commit;
SQL
remove_role_pid=$!

set +e
wait "$delete_pid"
delete_status=$?
wait "$remove_role_pid"
remove_role_status=$?
wait "$holder_pid"
holder_status=$?
set -e
holder_pid=''

if [[ "$holder_status" -ne 0 ]]; then
  echo "Advisory-lock holder failed unexpectedly." >&2
  cat "$work_dir/lock.log" >&2 || true
  exit 1
fi

# Exactly one operation must win. Both succeeding or both failing would indicate
# that the last-super-admin invariant was not preserved across the race.
if { [[ "$delete_status" -eq 0 ]] && [[ "$remove_role_status" -eq 0 ]]; } ||
   { [[ "$delete_status" -ne 0 ]] && [[ "$remove_role_status" -ne 0 ]]; }; then
  echo "Expected exactly one concurrent operation to succeed; got delete=$delete_status remove-role=$remove_role_status." >&2
  cat "$work_dir/delete.log" "$work_dir/remove-role.log" >&2 || true
  exit 1
fi

remaining_super_admins="$(psql "$db_url" -Atqc "select count(*) from public.admin_user_roles where role_key = 'super_admin' and user_id in ('$user_a'::uuid, '$user_b'::uuid)")"
if [[ "$remaining_super_admins" != '1' ]]; then
  echo "Expected exactly one surviving super_admin, found $remaining_super_admins." >&2
  cat "$work_dir/delete.log" "$work_dir/remove-role.log" >&2 || true
  exit 1
fi

echo "Concurrent account deletion and super_admin role removal preserved the invariant (delete exit=$delete_status, role-removal exit=$remove_role_status)."
