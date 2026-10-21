import test from "node:test";
import assert from "node:assert/strict";
import { calculateContrastRatio, suggestAccessibleForeground } from "./contrast-checker.ts";

test("suggests the closest foreground color that reaches WCAG AA", () => {
  const suggested = suggestAccessibleForeground("#777777", "#FFFFFF", 4.5);
  assert.ok(suggested);
  assert.ok((calculateContrastRatio(suggested, "#FFFFFF") ?? 0) >= 4.5);
  assert.ok((calculateContrastRatio("#777777", "#FFFFFF") ?? 0) < 4.5);
});

test("suggests a darker or lighter foreground depending on the background", () => {
  const onWhite = suggestAccessibleForeground("#AAAAAA", "#FFFFFF", 4.5);
  const onBlack = suggestAccessibleForeground("#555555", "#000000", 4.5);
  assert.ok(onWhite);
  assert.ok(onBlack);
  assert.ok((calculateContrastRatio(onWhite, "#FFFFFF") ?? 0) >= 4.5);
  assert.ok((calculateContrastRatio(onBlack, "#000000") ?? 0) >= 4.5);
});

test("returns the existing color when it already passes and null when impossible", () => {
  assert.equal(suggestAccessibleForeground("#000000", "#FFFFFF", 4.5), "#000000");
  assert.equal(suggestAccessibleForeground("#777777", "#777777", 21), null);
  assert.equal(suggestAccessibleForeground("invalid", "#FFFFFF", 4.5), null);
});
