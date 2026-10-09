#!/usr/bin/env bash
set -euo pipefail

user_a='00000000-0000-0000-0000-000000000201'
user_b='00000000-0000-0000-0000-000000000202'
session_a='00000000-0000-0000-0000-000000000203'
session_b='00000000-0000-0000-0000-000000000204'
lock_key='loculary.account-deletion.super-admin'
work_dir="$(mktemp -d)"
holder_pid=''
delete_pid=''
remove_role_pid=''

status_env="$(supabase status -o env)"
db_url="$(printf '%s\n' "$status_env" | sed -n 's/^DB_URL=//p' | tr -d '"')"
api_url="$(printf '%s\n' "$status_env" | sed -n 's/^API_URL=//p' | tr -d '"')"
service_role_key="$(printf '%s\n' "$status_env" | sed -n 's/^SERVICE_ROLE_KEY=//p' | tr -d '"')"
if [[ -z "$db_url" || -z "$api_url" || -z "$service_role_key" ]]; then
  echo "Could not resolve local Supabase DB_URL, API_URL and SERVICE_ROLE_KEY." >&2
  exit 1
fi
if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required for the concurrent account-deletion test." >&2
  exit 1
fi

cleanup() {
  for pid in "$delete_pid" "$remove_role_pid" "$holder_pid"; do
    if [[ -n "$pid" ]]; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" >/dev/null 2>&1 || true
    fi
  done
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
  -c "begin; select pg_advisory_xact_lock(hashtextextended('$lock_key', 0)); select pg_sleep(20); commit;" \
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

# Do not merely hope the race overlaps: require both contenders to be waiting
# on the advisory lock before allowing the holder to release it.
both_waiting=false
for _ in $(seq 1 150); do
  waiting_count="$(psql "$db_url" -Atqc "select count(*) from pg_locks where locktype = 'advisory' and not granted" 2>/dev/null || true)"
  if [[ "$waiting_count" == '2' ]]; then
    both_waiting=true
    break
  fi
  sleep 0.1
done
if [[ "$both_waiting" != true ]]; then
  echo "Both competing operations did not reach the shared advisory lock." >&2
  cat "$work_dir/delete.log" "$work_dir/remove-role.log" >&2 || true
  exit 1
fi

set +e
wait "$delete_pid"
delete_status=$?
delete_pid=''
wait "$remove_role_pid"
remove_role_status=$?
remove_role_pid=''
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

# Prove the actual Supabase Auth Admin API runs the trigger, not just direct SQL.
# The race above leaves exactly one super_admin. Deleting that user through the
# same Admin endpoint used by the Edge Function must fail and roll back audit cleanup.
remaining_user="$(psql "$db_url" -Atqc "select user_id::text from public.admin_user_roles where role_key = 'super_admin' and user_id in ('$user_a'::uuid, '$user_b'::uuid)")"
if [[ -z "$remaining_user" ]]; then
  echo "Could not identify the surviving super_admin for Auth API verification." >&2
  exit 1
fi

psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into public.admin_audit_log (actor_user_id, action, target_type, target_id, metadata)
values ('$remaining_user'::uuid, 'test.account.delete.auth-admin-rejected', 'user', '$remaining_user'::uuid, '{}'::jsonb);
SQL

auth_status="$(curl -sS -o "$work_dir/auth-delete.json" -w '%{http_code}' \
  -X DELETE "$api_url/auth/v1/admin/users/$remaining_user" \
  -H "apikey: $service_role_key" \
  -H "Authorization: Bearer $service_role_key")"
if [[ "$auth_status" -lt 400 ]]; then
  echo "Auth Admin API unexpectedly deleted the last super_admin (HTTP $auth_status)." >&2
  cat "$work_dir/auth-delete.json" >&2
  exit 1
fi

auth_invariant="$(psql "$db_url" -Atqc "select (exists (select 1 from auth.users where id = '$remaining_user'::uuid))::text || ':' || (select actor_user_id::text || ':' || target_id::text from public.admin_audit_log where action = 'test.account.delete.auth-admin-rejected')")"
expected_invariant="$remaining_user:$remaining_user"
if [[ "$auth_invariant" != "true:$expected_invariant" ]]; then
  echo "Auth Admin rejection did not preserve the user and audit references: $auth_invariant" >&2
  cat "$work_dir/auth-delete.json" >&2
  exit 1
fi

echo "Concurrent deletion/role removal preserved the invariant, and Supabase Auth Admin API rejected last-super_admin deletion with audit references unchanged (HTTP $auth_status)."
