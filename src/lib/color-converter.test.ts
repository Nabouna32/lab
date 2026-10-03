import assert from "node:assert/strict";
import { test } from "node:test";
import { convertColor, formatHsl, formatRgb, hslToRgb, parseColor, rgbToHsl } from "./color-converter.ts";

test("converts a hex color to RGB and HSL", () => {
  const result = convertColor("#336699");
  assert.deepEqual(result?.rgb, { r: 51, g: 102, b: 153 });
  assert.equal(result?.hex, "#336699");
  assert.equal(formatRgb(result!.rgb), "rgb(51, 102, 153)");
  assert.equal(formatHsl(result!.hsl), "hsl(210°, 50%, 40%)");
});

test("accepts shorthand hex, RGB and HSL input", () => {
  assert.deepEqual(parseColor("#369"), { r: 51, g: 102, b: 153 });
  assert.deepEqual(parseColor("rgb(51, 102, 153)"), { r: 51, g: 102, b: 153 });
  assert.deepEqual(parseColor("hsl(210, 50%, 40%)"), { r: 51, g: 102, b: 153 });
  assert.deepEqual(parseColor("hsl(-150, 50%, 40%)"), { r: 51, g: 102, b: 153 });
});

test("round trips representative HSL colors", () => {
  for (const color of [
    { h: 0, s: 100, l: 50 },
    { h: 120, s: 100, l: 50 },
    { h: 240, s: 100, l: 50 },
    { h: 210, s: 50, l: 40 },
  ]) {
    const rgb = hslToRgb(color);
    const result = rgbToHsl(rgb);
    assert.ok(Math.abs(result.h - color.h) < 0.1);
    assert.ok(Math.abs(result.s - color.s) < 0.1);
    assert.ok(Math.abs(result.l - color.l) < 0.1);
  }
});

test("rejects malformed and out-of-range colors", () => {
  assert.equal(convertColor(""), null);
  assert.equal(convertColor("#12"), null);
  assert.equal(convertColor("#gggggg"), null);
  assert.equal(convertColor("rgb(256, 0, 0)"), null);
  assert.equal(convertColor("hsl(20, 101%, 50%)"), null);
  assert.equal(convertColor("not a color"), null);
});
