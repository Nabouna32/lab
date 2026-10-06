-- Restore application-private function access after the agent runtime schema hardening.
--
-- The agent runtime migration revoked all access to schema private for
-- public/anon/authenticated. The runtime was later removed, but the revoke
-- remained in the database and unintentionally disabled Loculary account/RBAC
-- functions that are intentionally callable by authenticated users.
--
-- Keep the private schema closed to anon/public and restore only the application
-- functions whose migrations explicitly grant authenticated execution.

grant usage on schema private to authenticated;

revoke all on function private.has_valid_session() from public, anon, authenticated;
grant execute on function private.has_valid_session() to authenticated;

revoke all on function private.has_admin_permission(text) from public, anon, authenticated;
grant execute on function private.has_admin_permission(text) to authenticated;

revoke all on function private.prepare_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.prepare_account_deletion(uuid) to authenticated;

revoke all on function private.list_admin_users(text) from public, anon, authenticated;
grant execute on function private.list_admin_users(text) to authenticated;

revoke all on function private.assign_admin_role(uuid, text) from public, anon, authenticated;
grant execute on function private.assign_admin_role(uuid, text) to authenticated;

revoke all on function private.remove_admin_role(uuid, text) from public, anon, authenticated;
grant execute on function private.remove_admin_role(uuid, text) to authenticated;

revoke all on function private.list_admin_audit_log(integer) from public, anon, authenticated;
grant execute on function private.list_admin_audit_log(integer) to authenticated;

revoke all on function private.revoke_admin_user_sessions(uuid) from public, anon, authenticated;
grant execute on function private.revoke_admin_user_sessions(uuid) to authenticated;
