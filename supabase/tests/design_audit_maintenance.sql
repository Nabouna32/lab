begin;

select plan(24);

select has_table('public', 'design_audit_components', 'component inventory table exists');
select has_table('public', 'design_audit_reports', 'defect reports table exists');
select has_table('public', 'design_audit_decisions', 'decision log table exists');
select has_table('public', 'design_audit_verifications', 'verification log table exists');
select has_table('public', 'design_audit_events', 'append-only event history table exists');
select has_column('public', 'design_audit_components', 'm3_relationship', 'component inventory distinguishes M3 adaptations from utilities');

select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_components'::regclass), 'component inventory has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_reports'::regclass), 'reports have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_decisions'::regclass), 'decisions have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_verifications'::regclass), 'verifications have RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.design_audit_events'::regclass), 'event history has RLS');

select ok((select count(*) >= 50 from public.design_audit_components), 'inventory lists real UI implementation files');
select ok((select count(*) = count(preview_key) from public.design_audit_components), 'every real component has an explicit live preview mapping');
select ok((select count(*) = 0 from public.design_audit_components where m3_relationship = 'not-assessed'), 'every inventoried component has an explicit relationship classification');
select ok(not has_table_privilege('anon', 'public.design_audit_components', 'SELECT'), 'anonymous visitors cannot read the private inventory');
select ok(not has_table_privilege('anon', 'public.design_audit_reports', 'INSERT'), 'anonymous visitors cannot submit reports');
select ok(has_table_privilege('authenticated', 'public.design_audit_reports', 'INSERT'), 'authenticated role can attempt report inserts subject to RLS');
select ok(not has_table_privilege('authenticated', 'public.design_audit_events', 'INSERT'), 'clients cannot forge audit history events');
select ok(not has_table_privilege('authenticated', 'public.design_audit_verifications', 'UPDATE'), 'verification evidence is append-only for clients');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='design_audit_reports' and policyname='Audit writers can create reports'), 'report inserts require the audit-write policy');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='design_audit_events' and policyname='Audit readers can read event history'), 'event history has an explicit read policy');
select ok(not has_table_privilege('anon', 'public.design_audit_decisions', 'UPDATE'), 'anonymous visitors cannot modify decisions');
select ok(exists(select 1 from pg_trigger where tgname='design_audit_conformance_requires_evidence' and not tgisinternal), 'conformance requires a passing verification');
select ok(exists(select 1 from pg_trigger where tgname='design_audit_component_status_event' and not tgisinternal), 'component audit status changes are recorded');

select * from finish();
rollback;
