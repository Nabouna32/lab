import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const read = (relativePath) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const migration = read("../../supabase/migrations/20261030030000_log_retention_policy.sql");
const sqlTest = read("../../supabase/tests/log_retention.sql");
const databaseDocs = read("../../docs/DATABASE.md");
const privacyDocs = read("../../docs/PRIVACY.md");

test("log retention migration schedules a six-month purge without running it immediately", () => {
  assert.match(migration, /interval '6 months'/);
  assert.match(migration, /cron\.schedule\(\s*'loculary-log-retention-6m'/);
  assert.match(migration, /'0 3 \* \* \*'/);
  assert.match(migration, /'select private\.prune_retained_logs\(\);'/);
  assert.match(migration, /end_time is not null[\s\S]*?end_time < v_cutoff/);
  assert.doesNotMatch(migration, /^\s*select private\.prune_retained_logs\(\);\s*$/m);
});

test("retention exceptions are private, reason-coded, and capped at twelve months", () => {
  assert.match(migration, /private\.admin_audit_log_retention_holds/);
  assert.match(migration, /security_incident', 'legal_obligation', 'internal_investigation/);
  assert.match(migration, /INC-\[0-9\]\{4\}-\[0-9\]\{3,\}/);
  assert.match(migration, /p_hold_until > v_event_created_at \+ interval '12 months'/);
  assert.match(migration, /security definer/gi);
  assert.match(migration, /set search_path = ''/g);
  assert.match(migration, /revoke all on table private\.admin_audit_log_retention_holds/);
  assert.match(migration, /revoke all on function private\.set_admin_audit_log_retention_hold/);
  assert.match(migration, /revoke all on function private\.prune_retained_logs/);
  assert.doesNotMatch(migration, /delete from auth\.audit_log_entries|delete from auth\.users/);
});

test("pgTAP retention suite is transactional and its plan matches its assertions", () => {
  const plan = Number(sqlTest.match(/plan\((\d+)\)/)?.[1]);
  const assertionCount = (sqlTest.match(/^select (?:ok|is|lives_ok|throws_ok)\(/gm) ?? []).length;

  assert.match(sqlTest, /^begin;/m);
  assert.match(sqlTest, /rollback;\s*$/);
  assert.equal(plan, assertionCount);
  assert.match(sqlTest, /account deletion anonymizes the audit actor/);
  assert.match(sqlTest, /account deletion anonymizes the audit target/);
  assert.match(sqlTest, /account deletion anonymizes the retention-hold creator/);
  assert.match(sqlTest, /active retention exceptions/);
  assert.match(sqlTest, /completed cron runs older than six months are deleted/);
});

test("internal privacy documentation distinguishes configured and pending retention", () => {
  assert.match(databaseDocs, /activation en attente d’approbation de production/i);
  assert.match(databaseDocs, /six mois/i);
  assert.match(databaseDocs, /douze mois/i);
  assert.match(privacyDocs, /Politique applicative retenue, en attente d’application/i);
  assert.match(privacyDocs, /24 heures/i);
  assert.match(privacyDocs, /une heure/i);
});
