begin;

select plan(18);

select has_table('public', 'design_audit_components', 'component inventory table exists');
select has_table('public', 'design_audit_reports', 'defect reports table exists');
select has_table('public', 'design_audit_decisions', 'decision log table exists');
select has_table('public', 'design_audit_verifications', 'verification log table exists');
select has_table('public', 'design_audit_events', 'append-only event history table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_components'::regclass), 'component inventory has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_reports'::regclass), 'reports have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_decisions'::regclass), 'decisions have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_verifications'::regclass), 'verifications have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_events'::regclass), 'event history has RLS');

select ok((select count(*) >= 50 from public.design_audit_components), 'inventory lists real UI implementation files');
select ok((select count(*) > 0 from public.design_audit_components where preview_key is not null), 'at least some real components have live previews');
select ok(not has_table_privilege('anon', 'public.design_audit_components', 'SELECT'), 'anonymous visitors cannot read the private inventory');
select ok(not has_table_privilege('anon', 'public.design_audit_reports', 'INSERT'), 'anonymous visitors cannot submit reports');
select ok(has_table_privilege('authenticated', 'public.design_audit_reports', 'INSERT'), 'authenticated role can attempt report inserts subject to RLS');
select ok(not has_table_privilege('authenticated', 'public.design_audit_events', 'INSERT'), 'clients cannot forge audit history events');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='design_audit_reports' and policyname='Audit writers can create reports'), 'report inserts require the audit-write policy');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='design_audit_events' and policyname='Audit readers can read event history'), 'event history has an explicit read policy');
select ok(not has_table_privilege('anon', 'public.design_audit_decisions', 'UPDATE'), 'anonymous visitors cannot modify decisions');

select * from finish();
rollback;
