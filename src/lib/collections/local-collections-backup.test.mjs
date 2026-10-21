import assert from "node:assert/strict";
import test from "node:test";
import {
  createLocalCollectionsBackup,
  parseLocalCollectionsBackup,
  MAX_LOCAL_COLLECTIONS_BACKUP_CHARS,
} from "./local-collections.ts";

const validToolIds = ["percentage", "json-formatter"];
const collection = (overrides = {}) => ({
  id: "local-original-id",
  name: "Projet vacances",
  created_at: "2026-10-21T00:00:00.000Z",
  tool_ids: ["percentage", "percentage", "removed-tool"],
  ...overrides,
});
const backup = (collections = [collection()], overrides = {}) => createLocalCollectionsBackup(collections, "2026-10-21T12:00:00.000Z")
  .replace('"version": 1', '"version": ' + (overrides.version ?? 1));

test("local collection backup exports a versioned portable JSON envelope", () => {
  const value = JSON.parse(createLocalCollectionsBackup([collection()], "2026-10-21T12:00:00.000Z"));
  assert.equal(value.format, "loculary-local-collections");
  assert.equal(value.version, 1);
  assert.equal(value.exported_at, "2026-10-21T12:00:00.000Z");
  assert.deepEqual(value.collections, [collection()]);
});

test("backup import validates the envelope, normalizes names and filters unavailable tool IDs", () => {
  const result = parseLocalCollectionsBackup(backup([collection({ name: "  Voyage  " })]), validToolIds);
  assert.deepEqual(result, {
    ok: true,
    ignoredToolCount: 1,
    collections: [{
      id: "local-import-0",
      name: "Voyage",
      created_at: "2026-10-21T00:00:00.000Z",
      tool_ids: ["percentage"],
    }],
  });
});

test("backup import rejects malformed JSON, unknown versions, empty backups and oversized files", () => {
  assert.deepEqual(parseLocalCollectionsBackup("{broken", validToolIds), { ok: false, reason: "invalid-json" });
  assert.deepEqual(parseLocalCollectionsBackup(backup([collection()], { version: 99 }), validToolIds), { ok: false, reason: "unsupported-format" });
  assert.deepEqual(parseLocalCollectionsBackup(backup([]), validToolIds), { ok: false, reason: "empty" });
  assert.deepEqual(parseLocalCollectionsBackup("x".repeat(MAX_LOCAL_COLLECTIONS_BACKUP_CHARS + 1), validToolIds), { ok: false, reason: "too-large" });
});

test("backup import rejects malformed records and more than the local collection limit", () => {
  const malformed = JSON.stringify({
    format: "loculary-local-collections",
    version: 1,
    exported_at: "2026-10-21T12:00:00.000Z",
    collections: [collection({ name: " " })],
  });
  assert.deepEqual(parseLocalCollectionsBackup(malformed, validToolIds), { ok: false, reason: "invalid-collections" });
  const tooMany = Array.from({ length: 51 }, (_, index) => collection({ id: "local-" + index, name: "Collection " + index }));
  assert.deepEqual(parseLocalCollectionsBackup(backup(tooMany), validToolIds), { ok: false, reason: "invalid-collections" });
});
