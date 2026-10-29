import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const lab = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../../app/[locale]/design-lab/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const retirementMigration = readFileSync(new URL("../../../supabase/migrations/20261029110714_retire_design_lab_audit.sql", import.meta.url), "utf8");

test("Design Lab is a local gallery of real shared components", () => {
  for (const component of ["Button", "Card", "Checkbox", "Chip", "IconButton", "NavigationBar", "ProgressIndicator", "Select", "Slider", "Switch", "TextArea", "TextField"]) {
    assert.ok(lab.includes(`@/components/ui/${component}`), `missing production component: ${component}`);
  }
  assert.match(lab, /<ProgressIndicator/);
  assert.match(lab, /<Slider/);
  assert.match(lab, /<NavigationBar/);
  assert.match(lab, /thème actif/);
  assert.match(lab, /active theme/);
  assert.doesNotMatch(lab, /createClient|supabase|ToolRuntimeProvider|m3-theme/);
  assert.doesNotMatch(page, /audit|Supabase|createClient/);
});

test("Gallery interactions are local and both locales are provided", () => {
  assert.match(lab, /useState/);
  assert.match(lab, /onCheckedChange/);
  assert.match(lab, /onValueChange/);
  assert.match(lab, /initialLocale/);
  assert.match(lab, /Galerie de composants/);
  assert.match(lab, /Component gallery/);
  assert.match(css, /var\(--on-surface\)/);
  assert.match(css, /var\(--surface-container-low\)/);
});

test("Retirement migration removes only Design Lab maintenance storage", () => {
  for (const table of ["design_audit_catalog_entries", "design_audit_verifications", "design_audit_decisions", "design_audit_reports", "design_audit_components", "design_audit_events"]) {
    assert.match(retirementMigration, new RegExp(`drop table if exists public\\.${table} cascade`));
  }
  assert.doesNotMatch(retirementMigration, /delete from public\.admin_role_permissions\s+where permission_key = 'audit\.(?:read|write)'/);
  assert.doesNotMatch(retirementMigration, /delete from public\.admin_permissions\s+where key = 'audit\.(?:read|write)'/);
  assert.doesNotMatch(retirementMigration, /drop table if exists public\.admin_audit_log/i);
});
