import test from "node:test";
import assert from "node:assert/strict";
import { calculateContrastRatio, evaluateContrast, parseColor } from "./contrast-checker";

test("parses three and six digit hex colors", () => {
  assert.deepEqual(parseColor("#fff"), { r: 255, g: 255, b: 255 });
  assert.deepEqual(parseColor("#112233"), { r: 17, g: 34, b: 51 });
});

test("parses rgb and rgba colors", () => {
  assert.deepEqual(parseColor("rgb(255, 0, 128)"), { r: 255, g: 0, b: 128 });
  assert.deepEqual(parseColor("rgba(0, 0, 0, 0.5)"), { r: 0, g: 0, b: 0 });
});

test("rejects malformed and out-of-range colors", () => {
  assert.equal(parseColor("#12"), null);
  assert.equal(parseColor("#gggggg"), null);
  assert.equal(parseColor("rgb(256, 0, 0)"), null);
});

test("matches the WCAG black and white reference ratio", () => {
  const ratio = calculateContrastRatio("#000000", "#ffffff");
  assert.ok(ratio !== null);
  assert.ok(Math.abs(ratio - 21) < 0.0001);
});

test("evaluates AA and AAA thresholds", () => {
  const result = evaluateContrast("#767676", "#ffffff");
  assert.ok(result);
  assert.equal(result.aaNormal, false);
  assert.equal(result.aaLarge, true);
  assert.equal(result.aaaNormal, false);
  assert.equal(result.aaaLarge, false);
});

test("returns null when a color cannot be parsed", () => {
  assert.equal(evaluateContrast("not-a-color", "#ffffff"), null);
});
