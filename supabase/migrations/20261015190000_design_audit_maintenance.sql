begin;

create table public.design_audit_components (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  category text not null,
  implementation_path text not null,
  preview_key text,
  audit_status text not null default 'unverified'
    check (audit_status in ('unverified', 'partially-verified', 'discrepancy-confirmed', 'verification-required', 'conformant-within-verified-scope')),
  official_references jsonb not null default '[]'::jsonb check (jsonb_typeof(official_references) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.design_audit_components is 'Verified inventory of actual Loculary UI component implementations used by the M3 maintenance workbench. Inventory presence does not imply M3 conformance.';

create table public.design_audit_reports (
  id uuid primary key default gen_random_uuid(),
  component_id text not null references public.design_audit_components(id) on delete restrict,
  title text not null check (char_length(btrim(title)) between 3 and 160),
  description text not null check (char_length(btrim(description)) between 3 and 10000),
  issue_type text not null default 'other' check (issue_type in ('visual', 'behavior', 'accessibility', 'theme', 'content', 'other')),
  component_state text not null default 'general' check (component_state in ('general', 'default', 'hover', 'focus', 'pressed', 'disabled', 'selected', 'expanded', 'loading', 'error', 'other')),
  severity text not null default 'normal' check (severity in ('low', 'normal', 'high', 'blocker')),
  status text not null default 'new' check (status in ('new', 'triage', 'confirmed', 'in-progress', 'fixed', 'verified', 'reopened', 'wont-fix')),
  expected_behavior text check (expected_behavior is null or char_length(expected_behavior) <= 10000),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.design_audit_reports is 'Human observations and defects reported from the Design Lab. Observations are kept distinct from verified technical conclusions.';

create index design_audit_reports_component_status_idx on public.design_audit_reports(component_id, status, created_at desc);
create index design_audit_reports_status_created_idx on public.design_audit_reports(status, created_at desc);

create table public.design_audit_decisions (
  id uuid primary key default gen_random_uuid(),
  component_id text not null references public.design_audit_components(id) on delete restrict,
  report_id uuid references public.design_audit_reports(id) on delete set null,
  decision_type text not null default 'other' check (decision_type in ('visual', 'behavior', 'accessibility', 'architecture', 'other')),
  title text not null check (char_length(btrim(title)) between 3 and 200),
  rationale text not null check (char_length(btrim(rationale)) between 3 and 10000),
  official_references jsonb not null default '[]'::jsonb check (jsonb_typeof(official_references) = 'array'),
  status text not null default 'proposed' check (status in ('proposed', 'approved', 'rejected', 'superseded')),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index design_audit_decisions_component_idx on public.design_audit_decisions(component_id, created_at desc);

create table public.design_audit_verifications (
  id uuid primary key default gen_random_uuid(),
  component_id text not null references public.design_audit_components(id) on delete restrict,
  report_id uuid references public.design_audit_reports(id) on delete set null,
  verification_type text not null check (verification_type in ('source-review', 'visual', 'interaction', 'accessibility', 'automated-test', 'manual-test', 'other')),
  result text not null check (result in ('pass', 'fail', 'inconclusive')),
  notes text not null check (char_length(btrim(notes)) between 3 and 10000),
  reference_url text,
  pull_request_url text,
  commit_sha text check (commit_sha is null or commit_sha ~ '^[0-9a-f]{7,40}$'),
  verified_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  constraint design_audit_verification_urls check (
    (reference_url is null or reference_url ~ '^https://')
    and (pull_request_url is null or pull_request_url ~ '^https://github\\.com/')
  )
);

create index design_audit_verifications_component_idx on public.design_audit_verifications(component_id, created_at desc);

create table public.design_audit_events (
  id bigint generated always as identity primary key,
  component_id text references public.design_audit_components(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  record_id uuid,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index design_audit_events_component_idx on public.design_audit_events(component_id, created_at desc);

create or replace function private.set_design_audit_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger design_audit_components_updated_at before update on public.design_audit_components
for each row execute function private.set_design_audit_updated_at();
create trigger design_audit_reports_updated_at before update on public.design_audit_reports
for each row execute function private.set_design_audit_updated_at();
create trigger design_audit_decisions_updated_at before update on public.design_audit_decisions
for each row execute function private.set_design_audit_updated_at();

create or replace function private.log_design_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_row jsonb;
  old_row jsonb;
  current_row jsonb;
  component_key text;
  record_key uuid;
  event_name text;
  event_details jsonb;
begin
  if auth.uid() is null or not private.has_admin_permission('audit.write') then
    raise exception 'Not authorized to write design audit events' using errcode = '42501';
  end if;

  new_row := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  old_row := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  current_row := coalesce(new_row, old_row);
  component_key := current_row ->> 'component_id';
  record_key := nullif(current_row ->> 'id', '')::uuid;
  event_name := lower(tg_table_name || '.' || tg_op);
  event_details := jsonb_build_object(
    'record_id', record_key,
    'title', coalesce(new_row ->> 'title', old_row ->> 'title'),
    'old_status', old_row ->> 'status',
    'new_status', new_row ->> 'status'
  );

  insert into public.design_audit_events (component_id, actor_user_id, event_type, record_id, details)
  values (component_key, auth.uid(), event_name, record_key, event_details);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke execute on function private.log_design_audit_event() from public, anon, authenticated;

create trigger design_audit_reports_event after insert or update or delete on public.design_audit_reports
for each row execute function private.log_design_audit_event();
create trigger design_audit_decisions_event after insert or update or delete on public.design_audit_decisions
for each row execute function private.log_design_audit_event();
create trigger design_audit_verifications_event after insert or update or delete on public.design_audit_verifications
for each row execute function private.log_design_audit_event();

alter table public.design_audit_components enable row level security;
alter table public.design_audit_reports enable row level security;
alter table public.design_audit_decisions enable row level security;
alter table public.design_audit_verifications enable row level security;
alter table public.design_audit_events enable row level security;

revoke all on table public.design_audit_components, public.design_audit_reports, public.design_audit_decisions, public.design_audit_verifications, public.design_audit_events from anon, authenticated;

create policy "Audit readers can read component inventory" on public.design_audit_components
for select to authenticated using ((select private.has_admin_permission('audit.read')));
create policy "Audit writers can update component inventory" on public.design_audit_components
for update to authenticated using ((select private.has_admin_permission('audit.write')))
with check ((select private.has_admin_permission('audit.write')));

create policy "Audit readers can read reports" on public.design_audit_reports
for select to authenticated using ((select private.has_admin_permission('audit.read')));
create policy "Audit writers can create reports" on public.design_audit_reports
for insert to authenticated with check (
  (select private.has_admin_permission('audit.write'))
  and created_by = (select auth.uid())
);
create policy "Audit writers can update reports" on public.design_audit_reports
for update to authenticated using ((select private.has_admin_permission('audit.write')))
with check ((select private.has_admin_permission('audit.write')));
create policy "Audit writers can delete reports" on public.design_audit_reports
for delete to authenticated using ((select private.has_admin_permission('audit.write')));

create policy "Audit readers can read decisions" on public.design_audit_decisions
for select to authenticated using ((select private.has_admin_permission('audit.read')));
create policy "Audit writers can create decisions" on public.design_audit_decisions
for insert to authenticated with check (
  (select private.has_admin_permission('audit.write'))
  and created_by = (select auth.uid())
);
create policy "Audit writers can update decisions" on public.design_audit_decisions
for update to authenticated using ((select private.has_admin_permission('audit.write')))
with check (
  (select private.has_admin_permission('audit.write'))
  and (status <> 'approved' or (approved_by = (select auth.uid()) and approved_at is not null))
);
create policy "Audit writers can delete decisions" on public.design_audit_decisions
for delete to authenticated using ((select private.has_admin_permission('audit.write')));

create policy "Audit readers can read verifications" on public.design_audit_verifications
for select to authenticated using ((select private.has_admin_permission('audit.read')));
create policy "Audit writers can create verifications" on public.design_audit_verifications
for insert to authenticated with check (
  (select private.has_admin_permission('audit.write'))
  and verified_by = (select auth.uid())
);
create policy "Audit writers can update verifications" on public.design_audit_verifications
for update to authenticated using ((select private.has_admin_permission('audit.write')))
with check ((select private.has_admin_permission('audit.write')));

create policy "Audit readers can read event history" on public.design_audit_events
for select to authenticated using ((select private.has_admin_permission('audit.read')));

create or replace function private.enforce_design_audit_conformance_evidence()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $
begin
  if new.audit_status = 'conformant-within-verified-scope'
    and not exists (
      select 1 from public.design_audit_verifications v
      where v.component_id = new.id and v.result = 'pass'
    )
  then
    raise exception 'A passing verification is required before marking a component conformant'
      using errcode = '23514';
  end if;
  return new;
end;
$;

create trigger design_audit_conformance_requires_evidence
before update of audit_status on public.design_audit_components
for each row execute function private.enforce_design_audit_conformance_evidence();

grant select, update on public.design_audit_components to authenticated;
grant select, insert, update, delete on public.design_audit_reports to authenticated;
grant select, insert, update, delete on public.design_audit_decisions to authenticated;
grant select, insert, update on public.design_audit_verifications to authenticated;
grant select on public.design_audit_events to authenticated;

insert into public.design_audit_components (id, name, category, implementation_path, preview_key) values
  ('alert-dialog', 'AlertDialog', 'Surfaces & overlays', 'src/components/ui/AlertDialog.tsx', null),
  ('app-bar-with-search', 'AppBarWithSearch', 'Navigation', 'src/components/ui/AppBarWithSearch.tsx', null),
  ('badge', 'Badge', 'Feedback & indicators', 'src/components/ui/Badge.tsx', null),
  ('bottom-app-bar', 'BottomAppBar', 'Navigation', 'src/components/ui/BottomAppBar.tsx', null),
  ('bottom-sheet-scaffold', 'BottomSheetScaffold', 'Surfaces & overlays', 'src/components/ui/BottomSheetScaffold.tsx', null),
  ('button', 'Button', 'Actions', 'src/components/ui/Button.tsx', 'button'),
  ('button-group', 'ButtonGroup', 'Actions', 'src/components/ui/ButtonGroup.tsx', null),
  ('card', 'Card', 'Surfaces', 'src/components/ui/Card.tsx', 'card'),
  ('carousel', 'Carousel', 'Content & navigation', 'src/components/ui/Carousel.tsx', null),
  ('checkbox', 'Checkbox', 'Selection', 'src/components/ui/Checkbox.tsx', 'checkbox'),
  ('chip', 'Chip', 'Selection', 'src/components/ui/Chip.tsx', 'chip'),
  ('circular-progress-indicator', 'CircularProgressIndicator', 'Feedback & indicators', 'src/components/ui/CircularProgressIndicator.tsx', null),
  ('clear-button', 'ClearButton', 'Actions', 'src/components/ui/ClearButton.tsx', null),
  ('copy-button', 'CopyButton', 'Actions', 'src/components/ui/CopyButton.tsx', null),
  ('date-picker', 'DatePicker', 'Date & time', 'src/components/ui/DatePicker.tsx', null),
  ('date-picker-dialog', 'DatePickerDialog', 'Date & time', 'src/components/ui/DatePickerDialog.tsx', null),
  ('divider', 'Divider', 'Surfaces', 'src/components/ui/Divider.tsx', null),
  ('dropdown-menu', 'DropdownMenu', 'Menus', 'src/components/ui/DropdownMenu.tsx', null),
  ('exposed-dropdown-menu', 'ExposedDropdownMenu', 'Menus', 'src/components/ui/ExposedDropdownMenu.tsx', null),
  ('floating-action-button', 'FloatingActionButton', 'Actions', 'src/components/ui/FloatingActionButton.tsx', null),
  ('floating-action-button-menu', 'FloatingActionButtonMenu', 'Actions', 'src/components/ui/FloatingActionButtonMenu.tsx', null),
  ('floating-toolbar', 'FloatingToolbar', 'Actions', 'src/components/ui/FloatingToolbar.tsx', null),
  ('icon-button', 'IconButton', 'Actions', 'src/components/ui/IconButton.tsx', 'icon-button'),
  ('list-item', 'ListItem', 'Navigation & lists', 'src/components/ui/ListItem.tsx', null),
  ('material-text-field', 'MaterialTextField', 'Inputs', 'src/components/ui/MaterialTextField.tsx', null),
  ('modal-bottom-sheet', 'ModalBottomSheet', 'Surfaces & overlays', 'src/components/ui/ModalBottomSheet.tsx', null),
  ('navigation-bar', 'NavigationBar', 'Navigation', 'src/components/ui/NavigationBar.tsx', null),
  ('navigation-drawer', 'NavigationDrawer', 'Navigation', 'src/components/ui/NavigationDrawer.tsx', null),
  ('navigation-rail', 'NavigationRail', 'Navigation', 'src/components/ui/NavigationRail.tsx', null),
  ('navigation-suite-scaffold', 'NavigationSuiteScaffold', 'Navigation', 'src/components/ui/NavigationSuiteScaffold.tsx', null),
  ('panel', 'Panel', 'Surfaces', 'src/components/ui/Panel.tsx', null),
  ('progress-indicator', 'ProgressIndicator', 'Feedback & indicators', 'src/components/ui/ProgressIndicator.tsx', null),
  ('pull-to-refresh-box', 'PullToRefreshBox', 'Interactions', 'src/components/ui/PullToRefreshBox.tsx', null),
  ('radio-button', 'RadioButton', 'Selection', 'src/components/ui/RadioButton.tsx', null),
  ('range-slider', 'RangeSlider', 'Inputs', 'src/components/ui/RangeSlider.tsx', null),
  ('result-panel', 'ResultPanel', 'Surfaces', 'src/components/ui/ResultPanel.tsx', null),
  ('scaffold', 'Scaffold', 'Layout', 'src/components/ui/Scaffold.tsx', null),
  ('scroll-field', 'ScrollField', 'Inputs', 'src/components/ui/ScrollField.tsx', null),
  ('search-bar', 'SearchBar', 'Inputs', 'src/components/ui/SearchBar.tsx', null),
  ('segmented-button-group', 'SegmentedButtonGroup', 'Selection', 'src/components/ui/SegmentedButtonGroup.tsx', null),
  ('segmented-control', 'SegmentedControl', 'Selection', 'src/components/ui/SegmentedControl.tsx', null),
  ('select', 'Select', 'Inputs', 'src/components/ui/Select.tsx', null),
  ('slider', 'Slider', 'Inputs', 'src/components/ui/Slider.tsx', null),
  ('snackbar', 'Snackbar', 'Feedback & indicators', 'src/components/ui/Snackbar.tsx', null),
  ('split-button', 'SplitButton', 'Actions', 'src/components/ui/SplitButton.tsx', null),
  ('switch', 'Switch', 'Selection', 'src/components/ui/Switch.tsx', 'switch'),
  ('tabs', 'Tabs', 'Navigation', 'src/components/ui/Tabs.tsx', null),
  ('text-area', 'TextArea', 'Inputs', 'src/components/ui/TextArea.tsx', null),
  ('text-field', 'TextField', 'Inputs', 'src/components/ui/TextField.tsx', 'text-field'),
  ('time-picker', 'TimePicker', 'Date & time', 'src/components/ui/TimePicker.tsx', null),
  ('time-picker-dialog', 'TimePickerDialog', 'Date & time', 'src/components/ui/TimePickerDialog.tsx', null),
  ('toggle-button', 'ToggleButton', 'Selection', 'src/components/ui/ToggleButton.tsx', 'toggle-button'),
  ('tooltip', 'Tooltip', 'Feedback & overlays', 'src/components/ui/Tooltip.tsx', null),
  ('top-app-bar', 'TopAppBar', 'Navigation', 'src/components/ui/TopAppBar.tsx', null),
  ('tri-state-checkbox', 'TriStateCheckbox', 'Selection', 'src/components/ui/TriStateCheckbox.tsx', null),
  ('validation-message', 'ValidationMessage', 'Feedback & forms', 'src/components/ui/ValidationMessage.tsx', null),
  ('wide-navigation-rail', 'WideNavigationRail', 'Navigation', 'src/components/ui/WideNavigationRail.tsx', null)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  implementation_path = excluded.implementation_path,
  preview_key = excluded.preview_key;

commit;
