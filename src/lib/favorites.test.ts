import test from "node:test";
import assert from "node:assert/strict";
import { mergeFavoriteIds, normalizeFavoriteIds, parseFavoriteMigrationPayload, sortFavoriteIds } from "./favorites.ts";

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
