import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workbench = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentAuditWorkbench.tsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentLivePreview.tsx", import.meta.url), "utf8");
const maintenance = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentMaintenancePanel.tsx", import.meta.url), "utf8");
const migration = readFileSync(new URL("../../../supabase/migrations/20261015190000_design_audit_maintenance.sql", import.meta.url), "utf8");
const route = readFileSync(new URL("../../app/[locale]/design-lab/audit/page.tsx", import.meta.url), "utf8");

test("The workbench reads its inventory and progress from Supabase", () => {
  assert.match(workbench, /design_audit_components/);
  assert.match(workbench, /design_audit_reports/);
  assert.match(workbench, /implementation_path/);
  assert.match(workbench, /audit_status/);
  assert.doesNotMatch(workbench, /m3ComponentAuditRegistry/);
});

test("Live previews reuse real production components and never substitute a fake", () => {
  for (const name of ["Button", "Checkbox", "Switch", "TextField", "Chip", "ToggleButton", "IconButton", "Card"]) {
    assert.match(preview, new RegExp(`import \\{ ${name} \\} from "@\/components\/ui\/${name}"`));
  }
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
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
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
