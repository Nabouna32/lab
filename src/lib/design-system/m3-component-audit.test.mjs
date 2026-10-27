import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workbench = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentAuditWorkbench.tsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentLivePreview.tsx", import.meta.url), "utf8");
const maintenance = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentMaintenancePanel.tsx", import.meta.url), "utf8");
const migration = readFileSync(new URL("../../../supabase/migrations/20261015210132_design_audit_maintenance.sql", import.meta.url), "utf8");
const route = readFileSync(new URL("../../app/[locale]/design-lab/audit/page.tsx", import.meta.url), "utf8");
const relationshipMigration = readFileSync(new URL("../../../supabase/migrations/20261015211016_design_audit_m3_relationship.sql", import.meta.url), "utf8");
const previewCoverageMigration = readFileSync(new URL("../../../supabase/migrations/20261015211356_design_audit_live_preview_coverage.sql", import.meta.url), "utf8");

test("The workbench reads its inventory and progress from Supabase", () => {
  assert.match(workbench, /design_audit_components/);
  assert.match(workbench, /design_audit_reports/);
  assert.match(workbench, /implementation_path/);
  assert.match(workbench, /audit_status/);
  assert.doesNotMatch(workbench, /m3ComponentAuditRegistry/);
});

test("Live previews reuse real production components and never substitute a fake", () => {
  assert.match(preview, /import \\{ Card, ElevatedCard, OutlinedCard \\} from "@\\/components\\/ui\\/Card"/);
  for (const name of ["Checkbox", "Switch", "TextField", "Chip", "ToggleButton", "IconButton", "Badge", "CircularProgressIndicator", "Divider", "FloatingActionButton", "ProgressIndicator", "RadioButton", "SegmentedControl", "Select", "Slider", "Tabs", "TextArea", "ButtonGroup", "ListItem", "MaterialTextField", "Panel", "ResultPanel", "Snackbar", "Tooltip", "TriStateCheckbox", "AlertDialog", "BottomAppBar", "ClearButton", "DatePicker", "ModalBottomSheet", "RangeSlider", "ScrollField", "SearchBar", "SplitButton", "TopAppBar", "ValidationMessage", "SwipeToDismissBox", "AppBarWithSearch", "BottomSheetScaffold", "Carousel", "CopyButton", "DatePickerDialog", "DropdownMenu", "ExposedDropdownMenu", "FloatingActionButtonMenu", "FloatingToolbar", "NavigationBar", "NavigationDrawer", "NavigationRail", "NavigationSuiteScaffold", "Scaffold", "SegmentedButtonGroup", "TimePicker", "TimePickerDialog", "WideNavigationRail", "PullToRefreshBox"]) {
    assert.match(preview, new RegExp(`import \\{ ${name} \\} from "@\/components\/ui\/${name}"`));
  }
  assert.ok(preview.includes('import { Button, ElevatedButton, FilledTonalButton, OutlinedButton, TextButton } from "@/components/ui/Button"'));
  assert.match(preview, /No substitute component is shown/);
  assert.match(preview, /Aucun faux composant n’est affiché/);
});

test("Maintenance UI supports reports, decisions, verifications and event history", () => {
  for (const table of ["design_audit_reports", "design_audit_decisions", "design_audit_verifications", "design_audit_events"]) {
    assert.ok(maintenance.includes(table), `Missing workflow table: ${table}`);
  }
  for (const status of ["new", "triage", "confirmed", "in-progress", "fixed", "verified", "reopened", "wont-fix"]) {
    assert.ok(maintenance.includes(status), `Missing report status: ${status}`);
  }
});

test("Database schema keeps maintenance data behind RLS and admin permissions", () => {
  for (const table of ["design_audit_components", "design_audit_reports", "design_audit_decisions", "design_audit_verifications", "design_audit_events"]) {
    assert.match(migration, new RegExp(`alter table public\.${table} enable row level security`));
  }
  assert.match(migration, /private\.has_admin_permission\('audit\.read'\)/);
  assert.match(migration, /private\.has_admin_permission\('audit\.write'\)/);
  assert.match(migration, /create policy "Audit readers can read event history"/);
  assert.match(migration, /revoke execute on function private\.log_design_audit_event\(\) from public, anon, authenticated/);
});

test("Maintenance route is private and excluded from indexing", () => {
  assert.match(route, /requireAdminPermission\(locale, "audit\.read"\)/);
  assert.match(route, /robots: \{ index: false, follow: false/);
});

test("The inventory distinguishes web adaptations from Loculary-specific utilities", () => {
  assert.match(workbench, /m3_relationship/);
  assert.match(workbench, /web-adaptation/);
  assert.match(workbench, /loculary-utility/);
  assert.match(relationshipMigration, /add column m3_relationship/);
  assert.match(relationshipMigration, /loculary-utility/);
  assert.match(relationshipMigration, /web-adaptation/);
});

test("Every inventoried production component has an explicit live preview mapping", () => {
  assert.match(previewCoverageMigration, /set preview_key = id/);
  assert.match(previewCoverageMigration, /wide-navigation-rail/);
  assert.match(previewCoverageMigration, /pull-to-refresh-box/);
  assert.match(workbench, /previewKey=\{component.preview_key\}/);
});


test("Reference catalogue is stored separately from the implementation inventory", async () => {
  const catalogMigration = readFileSync(new URL("../../../supabase/migrations/20261015215122_design_audit_reference_catalog.sql", import.meta.url), "utf8");
  const catalogEditingMigration = readFileSync(new URL("../../../supabase/migrations/20261015220100_design_audit_catalog_admin_editing.sql", import.meta.url), "utf8");
  assert.match(workbench, /design_audit_catalog_entries/);
  assert.match(workbench, /role="tablist"/);
  assert.match(workbench, /material-3/);
  assert.match(workbench, /loculary/);
  assert.match(catalogMigration, /create table public\.design_audit_catalog_entries/);
  assert.match(catalogMigration, /enable row level security/);
  assert.match(catalogMigration, /private\.has_admin_permission\('audit\.read'\)/);
  assert.match(catalogMigration, /revoke all on table public\.design_audit_catalog_entries from anon, authenticated/);
  const seedSection = catalogMigration.split("on conflict (id) do nothing;")[0];
  const seededRows = seedSection.match(/^\('[-a-z0-9]+',/gm) ?? [];
  assert.equal(seededRows.length, 116, "all 116 existing reference entries are migrated into PostgreSQL");
  assert.match(catalogEditingMigration, /Audit writers can update reference catalogue/);
  assert.match(catalogEditingMigration, /private\.has_admin_permission\('audit\.write'\)/);
  assert.match(catalogEditingMigration, /design_audit_catalog_entry_event/);
  assert.match(catalogEditingMigration, /design_audit_catalog_verified_requires_url/);
  assert.match(workbench, /catalog_scope: draftScope/);
});
