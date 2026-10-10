#!/usr/bin/env bash
set -euo pipefail

email_a='pgtap-concurrency-a@example.invalid'
email_b='pgtap-concurrency-b@example.invalid'
email_control='pgtap-concurrency-control@example.invalid'
session_a='00000000-0000-0000-0000-000000000203'
lock_key='loculary.account-deletion.super-admin'
work_dir="$(mktemp -d)"
holder_pid=''
delete_pid=''
remove_role_pid=''
user_a=''
user_b=''
user_control=''

status_env="$(supabase status -o env)"
db_url="$(printf '%s\n' "$status_env" | sed -n 's/^DB_URL=//p' | tr -d '"')"
api_url="$(printf '%s\n' "$status_env" | sed -n 's/^API_URL=//p' | tr -d '"')"
service_role_key="$(printf '%s\n' "$status_env" | sed -n 's/^SERVICE_ROLE_KEY=//p' | tr -d '"')"
if [[ -z "$db_url" || -z "$api_url" || -z "$service_role_key" ]]; then
  echo "Could not resolve local Supabase DB_URL, API_URL and SERVICE_ROLE_KEY." >&2
  exit 1
fi
for command in psql curl jq; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "$command is required for the account-deletion integration test." >&2
    exit 1
  fi
done

cleanup() {
  for pid in "$delete_pid" "$remove_role_pid" "$holder_pid"; do
    if [[ -n "$pid" ]]; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" >/dev/null 2>&1 || true
    fi
  done
  psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null 2>&1 <<SQL || true
delete from public.admin_audit_log
 where action like 'test.account.delete.integration.%'
    or actor_user_id in (
      select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
    )
    or target_id in (
      select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
    );
delete from public.admin_user_roles
 where user_id in (
   select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
 );
delete from auth.users
 where email in ('$email_a', '$email_b', '$email_control');
SQL
  rm -rf "$work_dir"
}
trap cleanup EXIT

# Clean fixtures from an interrupted run. Fixtures are created through Auth Admin
# below so the API-under-test recognizes them as real Auth users.
psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
delete from public.admin_audit_log
 where action like 'test.account.delete.integration.%'
    or actor_user_id in (
      select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
    )
    or target_id in (
      select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
    );
delete from public.admin_user_roles
 where user_id in (
   select id from auth.users where email in ('$email_a', '$email_b', '$email_control')
 );
delete from auth.users
 where email in ('$email_a', '$email_b', '$email_control');
SQL

create_auth_user() {
  local email="$1"
  local display_name="$2"
  local response_file="$3"
  local status
  status="$(curl -sS -o "$response_file" -w '%{http_code}' \
    -X POST "$api_url/auth/v1/admin/users" \
    -H "apikey: $service_role_key" \
    -H "Authorization: Bearer $service_role_key" \
    -H 'Content-Type: application/json' \
    --data "$(jq -cn --arg email "$email" --arg name "$display_name" \
      --arg password "Local-Integration-Only-$(date +%s%N)-Aa9!" \
      '{email:$email,password:$password,email_confirm:true,user_metadata:{display_name:$name}}')")"
  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "Auth Admin fixture creation failed for $email (HTTP $status)." >&2
    cat "$response_file" >&2
    return 1
  fi
  jq -er '.id | select(type == "string" and length > 0)' "$response_file"
}

user_a="$(create_auth_user "$email_a" "Concurrency A" "$work_dir/create-a.json")"
user_b="$(create_auth_user "$email_b" "Concurrency B" "$work_dir/create-b.json")"
user_control="$(create_auth_user "$email_control" "Deletion control" "$work_dir/create-control.json")"

psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into auth.sessions (id, user_id, created_at, updated_at)
values ('$session_a', '$user_a'::uuid, now(), now());

insert into public.admin_user_roles (user_id, role_key, assigned_by)
values
  ('$user_a'::uuid, 'super_admin', '$user_a'::uuid),
  ('$user_b'::uuid, 'super_admin', '$user_b'::uuid);
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

# Require both contenders to wait on the shared lock before releasing it.
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

remaining_user="$(psql "$db_url" -Atqc "select user_id::text from public.admin_user_roles where role_key = 'super_admin' and user_id in ('$user_a'::uuid, '$user_b'::uuid)")"
if [[ -z "$remaining_user" ]]; then
  echo "Could not identify the surviving super_admin for Auth API verification." >&2
  exit 1
fi

# Control: prove this Auth Admin endpoint and service-role credential can delete
# a valid ordinary Auth user, and that the trigger clears audit references atomically.
psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into public.admin_audit_log (actor_user_id, action, target_type, target_id, metadata)
values ('$user_control'::uuid, 'test.account.delete.integration.control', 'user', '$user_control'::uuid, '{}'::jsonb);
SQL

control_status="$(curl -sS -o "$work_dir/control-delete.json" -w '%{http_code}' \
  -X DELETE "$api_url/auth/v1/admin/users/$user_control" \
  -H "apikey: $service_role_key" \
  -H "Authorization: Bearer $service_role_key")"
if [[ "$control_status" -lt 200 || "$control_status" -ge 300 ]]; then
  echo "Auth Admin control deletion of an ordinary user failed (HTTP $control_status)." >&2
  cat "$work_dir/control-delete.json" >&2
  exit 1
fi

control_invariant="$(psql "$db_url" -Atqc "select (not exists (select 1 from auth.users where id = '$user_control'::uuid))::text || ':' || (select (actor_user_id is null and target_id is null)::text from public.admin_audit_log where action = 'test.account.delete.integration.control')")"
if [[ "$control_invariant" != 'true:true' ]]; then
  echo "Successful Auth Admin control deletion did not remove the user and clear audit references: $control_invariant" >&2
  exit 1
fi

# Confirm Auth Admin can find the actual surviving user before attempting deletion.
lookup_status="$(curl -sS -o "$work_dir/auth-lookup.json" -w '%{http_code}' \
  "$api_url/auth/v1/admin/users/$remaining_user" \
  -H "apikey: $service_role_key" \
  -H "Authorization: Bearer $service_role_key")"
if [[ "$lookup_status" != '200' ]] || [[ "$(jq -r '.id // empty' "$work_dir/auth-lookup.json")" != "$remaining_user" ]]; then
  echo "Auth Admin could not retrieve the surviving super_admin fixture (HTTP $lookup_status)." >&2
  cat "$work_dir/auth-lookup.json" >&2
  exit 1
fi

psql "$db_url" -v ON_ERROR_STOP=1 >/dev/null <<SQL
insert into public.admin_audit_log (actor_user_id, action, target_type, target_id, metadata)
values ('$remaining_user'::uuid, 'test.account.delete.integration.last-super-admin', 'user', '$remaining_user'::uuid, '{}'::jsonb);
SQL

auth_status="$(curl -sS -o "$work_dir/auth-delete.json" -w '%{http_code}' \
  -X DELETE "$api_url/auth/v1/admin/users/$remaining_user" \
  -H "apikey: $service_role_key" \
  -H "Authorization: Bearer $service_role_key")"
if [[ "$auth_status" -lt 500 || "$auth_status" -ge 600 ]]; then
  echo "Expected a database-trigger rejection (HTTP 5xx) when deleting the last super_admin; got HTTP $auth_status." >&2
  cat "$work_dir/auth-delete.json" >&2
  exit 1
fi

auth_invariant="$(psql "$db_url" -Atqc "select (exists (select 1 from auth.users where id = '$remaining_user'::uuid))::text || ':' || (select (actor_user_id = '$remaining_user'::uuid and target_id = '$remaining_user'::uuid)::text from public.admin_audit_log where action = 'test.account.delete.integration.last-super-admin')")"
if [[ "$auth_invariant" != 'true:true' ]]; then
  echo "Auth Admin rejection did not preserve the user and audit references: $auth_invariant" >&2
  cat "$work_dir/auth-delete.json" >&2
  exit 1
fi

echo "Concurrency invariant preserved; Auth Admin successfully deleted an ordinary user (HTTP $control_status), then rejected last-super_admin deletion (HTTP $auth_status) with user and audit references unchanged."
