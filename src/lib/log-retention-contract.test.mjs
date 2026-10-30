import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const read = (relativePath) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const initialMigration = read("../../supabase/migrations/20261030030000_log_retention_policy.sql");
const migration = read("../../supabase/migrations/20261030160000_extend_log_retention_to_12_months.sql");
const sqlTest = read("../../supabase/tests/log_retention.sql");
const databaseDocs = read("../../docs/DATABASE.md");
const privacyDocs = read("../../docs/PRIVACY.md");

test("new migration switches the daily purge to twelve months without running it immediately", () => {
  assert.match(migration, /interval '12 months'/);
  assert.match(migration, /cron\.unschedule\('loculary-log-retention-6m'\)/);
  assert.match(migration, /cron\.schedule\(\s*'loculary-log-retention-12m'/);
  assert.match(migration, /'0 3 \* \* \*'/);
  assert.match(migration, /'select private\.prune_retained_logs\(\);'/);
  assert.match(migration, /end_time is not null[\s\S]*?end_time < v_cutoff/);
  assert.doesNotMatch(migration, /^\s*select private\.prune_retained_logs\(\);\s*$/m);
  assert.match(initialMigration, /interval '6 months'/);
});

test("the twelve-month policy removes retention exceptions and keeps the purge restricted", () => {
  assert.match(migration, /drop function if exists private\.set_admin_audit_log_retention_hold/);
  assert.match(migration, /drop table if exists private\.admin_audit_log_retention_holds/);
  assert.match(migration, /security definer/gi);
  assert.match(migration, /set search_path = ''/g);
  assert.match(migration, /revoke all on function private\.prune_retained_logs\(\)/);
  assert.doesNotMatch(migration, /create table.*retention_holds|create or replace function private\.set_admin_audit_log_retention_hold/i);
  assert.doesNotMatch(migration, /delete from auth\.audit_log_entries|delete from auth\.users/);
});

test("pgTAP retention suite is transactional and its plan matches its assertions", () => {
  const plan = Number(sqlTest.match(/plan\((\d+)\)/)?.[1]);
  const assertionCount = (sqlTest.match(/^select (?:ok|is|lives_ok|throws_ok)\(/gm) ?? []).length;

  assert.match(sqlTest, /^begin;/m);
  assert.match(sqlTest, /rollback;\s*$/);
  assert.equal(plan, assertionCount);
  assert.match(sqlTest, /no retention-hold archive table remains/);
  assert.match(sqlTest, /unarchived admin audit events older than twelve months are deleted/);
  assert.match(sqlTest, /completed cron runs older than twelve months are deleted/);
  assert.match(sqlTest, /incomplete cron runs are preserved regardless of age/);
});

test("internal privacy documentation describes the active twelve-month policy", () => {
  assert.match(databaseDocs, /Politique (?:indiquée comme )?active en production depuis le 30 octobre 2026/i);
  assert.match(databaseDocs, /douze mois glissants/i);
  assert.match(databaseDocs, /Aucun archivage ni sauvegarde externe/i);
  assert.match(privacyDocs, /Politique applicative active en production depuis le 30 octobre 2026/i);
  assert.match(privacyDocs, /Aucune sauvegarde Google Drive ou archive externe/i);
  assert.match(privacyDocs, /24 heures/i);
  assert.match(privacyDocs, /une heure/i);
});
