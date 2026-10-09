-- Prevent Data API table writes from bypassing the guarded role-management RPCs.
--
-- Role assignment/removal must pass through the SECURITY DEFINER functions,
-- which enforce the last-super-admin invariant and write audit events.
-- Keep SELECT and the existing RLS policies; revoke only direct table DML.
revoke insert, delete on table public.admin_user_roles from authenticated;
