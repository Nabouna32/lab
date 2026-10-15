-- Indexes for foreign keys used by the design-audit maintenance workflow.
-- The component/report timeline indexes are defined in the initial maintenance migration.

create index if not exists design_audit_decisions_approved_by_idx on public.design_audit_decisions(approved_by);
create index if not exists design_audit_decisions_created_by_idx on public.design_audit_decisions(created_by);
create index if not exists design_audit_decisions_report_id_idx on public.design_audit_decisions(report_id);
create index if not exists design_audit_events_actor_user_id_idx on public.design_audit_events(actor_user_id);
create index if not exists design_audit_reports_created_by_idx on public.design_audit_reports(created_by);
create index if not exists design_audit_reports_resolved_by_idx on public.design_audit_reports(resolved_by);
create index if not exists design_audit_verifications_report_id_idx on public.design_audit_verifications(report_id);
create index if not exists design_audit_verifications_verified_by_idx on public.design_audit_verifications(verified_by);
