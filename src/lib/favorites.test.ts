import test from "node:test";
import assert from "node:assert/strict";
import { getVisibleFavoriteIds, mergeFavoriteIds, normalizeFavoriteIds, parseFavoriteMigrationPayload, reconcileAnonymousAfterMerge, reconcileVerifiedMigration, sortFavoriteIds } from "./favorites.ts";

const catalog = ["percentage", "age", "unit-converter", "uuid-generator"];

test("normalizes IDs against published tools and removes duplicates", () => {
  assert.deepEqual(normalizeFavoriteIds(["age", "unknown", "age", 4, "percentage"], catalog), ["age", "percentage"]);
});

test("merges local and remote favorites as an idempotent catalog-ordered union", () => {
  const merged = mergeFavoriteIds(["uuid-generator", "age"], ["percentage", "age"], catalog);
  assert.deepEqual(merged, ["percentage", "age", "uuid-generator"]);
  assert.deepEqual(mergeFavoriteIds(merged, merged, catalog), merged);
});

test("sorts favorites deterministically in catalog order", () => {
  assert.deepEqual(sortFavoriteIds(["uuid-generator", "percentage"], catalog), ["percentage", "uuid-generator"]);
});

test("parses only account-bound migration payloads and filters unknown IDs", () => {
  assert.deepEqual(
    parseFavoriteMigrationPayload(JSON.stringify({ targetUserId: "user-a", toolIds: ["age", "retired-tool", "age"] }), catalog),
    { targetUserId: "user-a", toolIds: ["age"] },
  );
  assert.equal(parseFavoriteMigrationPayload(JSON.stringify({ toolIds: ["age"] }), catalog), null);
  assert.equal(parseFavoriteMigrationPayload("{broken", catalog), null);
});

test("account transitions expose only the active account and anonymous state after sign-out", () => {
  const migration = { targetUserId: "user-a", toolIds: ["age"] };
  assert.deepEqual(getVisibleFavoriteIds({
    userId: "user-a", remoteIds: ["percentage"], anonymousIds: ["uuid-generator"], migration, catalogOrder: catalog,
  }), ["percentage", "age"]);
  assert.deepEqual(getVisibleFavoriteIds({
    userId: "user-b", remoteIds: ["unit-converter"], anonymousIds: ["uuid-generator"], migration, catalogOrder: catalog,
  }), ["unit-converter"]);
  assert.deepEqual(getVisibleFavoriteIds({
    userId: null, remoteIds: [], anonymousIds: ["uuid-generator"], migration, catalogOrder: catalog,
  }), ["uuid-generator"]);
});

test("failed verification retains migration and anonymous payload for retry", () => {
  const migration = { targetUserId: "user-a", toolIds: ["age", "percentage"] };
  assert.deepEqual(reconcileVerifiedMigration(migration, "user-a", migration.toolIds, ["age"]), migration);
  assert.deepEqual(reconcileAnonymousAfterMerge(migration.toolIds, migration.toolIds, ["age"]), migration.toolIds);
});

test("successful verification clears only the confirmed migration IDs", () => {
  const migration = { targetUserId: "user-a", toolIds: ["age", "percentage", "unit-converter"] };
  assert.deepEqual(
    reconcileVerifiedMigration(migration, "user-a", ["age", "percentage"], ["age", "percentage"]),
    { targetUserId: "user-a", toolIds: ["unit-converter"] },
  );
  assert.equal(reconcileVerifiedMigration({ targetUserId: "user-a", toolIds: ["age"] }, "user-b", ["age"], ["age"])?.targetUserId, "user-a");
});
