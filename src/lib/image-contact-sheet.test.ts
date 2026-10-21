import test from "node:test";
import assert from "node:assert/strict";
import { getContactSheetLayout } from "./image-contact-sheet.ts";

test("contact sheet layout fits supported batch and column counts", () => {
  assert.deepEqual(getContactSheetLayout(1, 2), { columns: 2, rows: 1, width: 720, height: 280, tileWidth: 360, tileHeight: 280 });
  assert.equal(getContactSheetLayout(10, 3).rows, 4);
  assert.equal(getContactSheetLayout(20, 4).height, 1400);
});

test("contact sheet layout rejects invalid image counts and column counts", () => {
  assert.throws(() => getContactSheetLayout(0, 3), RangeError);
  assert.throws(() => getContactSheetLayout(21, 3), RangeError);
  assert.throws(() => getContactSheetLayout(3, 5), RangeError);
});
