import assert from "node:assert/strict";
import test from "node:test";
import { normalizeLocalCollections, parseLocalCollections, MAX_LOCAL_COLLECTIONS } from "./local-collections.ts";

const valid = ["percentage", "json-formatter", "csv-json-converter"];
const make = (overrides = {}) => ({
  id: "local-one",
  name: "  Projet vacances  ",
  created_at: "2026-10-21T00:00:00.000Z",
  tool_ids: ["percentage", "percentage", "unknown", "json-formatter"],
  ...overrides,
});

test("local collections trim names, remove duplicate tools and discard unknown catalog IDs", () => {
  assert.deepEqual(normalizeLocalCollections([make()], valid), [{
    id: "local-one",
    name: "Projet vacances",
    created_at: "2026-10-21T00:00:00.000Z",
    tool_ids: ["percentage", "json-formatter"],
  }]);
});

test("local collection parsing rejects malformed, oversized, duplicate, or account-like records", () => {
  const rows = [
    make(),
    make({ id: "remote-uuid" }),
    make({ id: "local-one", name: "Duplicate ID" }),
    make({ id: "local-empty", name: "  " }),
    make({ id: "local-too-long", name: "x".repeat(81) }),
    make({ id: "local-bad-date", created_at: "not-a-date" }),
  ];
  assert.equal(normalizeLocalCollections(rows, valid).length, 1);
  assert.deepEqual(parseLocalCollections("{broken", valid), []);
  assert.deepEqual(parseLocalCollections(null, valid), []);
});

test("local collections are capped to protect browser storage and rendering", () => {
  const rows = Array.from({ length: MAX_LOCAL_COLLECTIONS + 10 }, (_, index) =>
    make({ id: "local-" + index, name: "Collection " + index }),
  );
  assert.equal(normalizeLocalCollections(rows, valid).length, MAX_LOCAL_COLLECTIONS);
});
