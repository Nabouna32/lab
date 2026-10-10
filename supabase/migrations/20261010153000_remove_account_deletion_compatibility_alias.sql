begin;

-- The only caller has been migrated to public.check_account_deletion(uuid).
-- Remove the pre-launch compatibility alias rather than preserving an obsolete RPC.
drop function if exists public.prepare_account_deletion(uuid);

commit;
