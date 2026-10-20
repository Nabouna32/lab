import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateSearchOverlayPosition } from "./search-overlay-position.ts";

test("keeps a search overlay below the field when there is enough room", () => {
  assert.deepEqual(
    calculateSearchOverlayPosition(
      { top: 100, left: 40, bottom: 140, width: 300 },
      { offsetLeft: 0, offsetTop: 0, width: 400, height: 800 },
    ),
    { top: 148, left: 40, width: 300, maxHeight: 360, placement: "below" },
  );
});

test("places the overlay above the field when the lower viewport space is smaller", () => {
  assert.deepEqual(
    calculateSearchOverlayPosition(
      { top: 700, left: 20, bottom: 740, width: 300 },
      { offsetLeft: 0, offsetTop: 0, width: 400, height: 800 },
    ),
    { top: 692, left: 20, width: 300, maxHeight: 648, placement: "above" },
  );
});

test("never assigns more height than the remaining visual viewport space", () => {
  const position = calculateSearchOverlayPosition(
    { top: 30, left: 10, bottom: 50, width: 200 },
    { offsetLeft: 0, offsetTop: 0, width: 320, height: 110 },
  );

  assert.equal(position.placement, "below");
  assert.equal(position.maxHeight, 40);
  assert.ok(position.top + position.maxHeight <= 110 - 12);
});

test("clamps overlay width and horizontal position to the visual viewport", () => {
  assert.deepEqual(
    calculateSearchOverlayPosition(
      { top: 50, left: 280, bottom: 90, width: 300 },
      { offsetLeft: 20, offsetTop: 0, width: 320, height: 600 },
    ),
    { top: 98, left: 52, width: 296, maxHeight: 360, placement: "below" },
  );
});
