import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const fieldCss = readFileSync(new URL("../../components/ui/MaterialTextField.module.css", import.meta.url), "utf8");
const chipCss = readFileSync(new URL("../../components/ui/Chip.module.css", import.meta.url), "utf8");
const typographySpec = readFileSync(new URL("../../../docs/material3/components/Typography.md", import.meta.url), "utf8");

const roles = [
  "display-large", "display-medium", "display-small",
  "headline-large", "headline-medium", "headline-small",
  "title-large", "title-medium", "title-small",
  "body-large", "body-medium", "body-small",
  "label-large", "label-medium", "label-small",
];

test("Material 3 typography exposes all 15 canonical roles as size, line-height, weight and tracking tokens", () => {
  for (const role of roles) {
    for (const property of ["size", "line-height", "weight", "tracking"]) {
      assert.match(globalCss, new RegExp("--m3-type-" + role + "-" + property + "\\s*:"));
    }
    assert.ok(globalCss.includes(".m3-type-" + role + " {"), "missing semantic typography class " + role);
  }
  assert.match(globalCss, /font-size:\s*var\(--m3-type-body-large-size\)/);
  assert.match(globalCss, /line-height:\s*var\(--m3-type-body-large-line-height\)/);
});

test("shared controls use semantic Material 3 typography roles rather than duplicated type declarations", () => {
  assert.ok(buttonSource.includes("m3-type-label-large"));
  assert.ok(fieldCss.includes("var(--m3-type-body-large-size)"));
  assert.ok(fieldCss.includes("var(--m3-type-label-medium-size)"));
  assert.ok(chipCss.includes("var(--m3-type-label-large-size)"));
  assert.doesNotMatch(buttonSource, /text-sm font-medium leading-5 tracking-\[0\.1px\]/);
});

test("typography spec documents source provenance, web adaptations and migration gaps", () => {
  assert.ok(typographySpec.includes("androidx.compose.material3:material3:1.4.0"));
  assert.ok(typographySpec.includes("Web adaptations"));
  assert.ok(typographySpec.includes("site-wide call-site inventory"));
  assert.ok(typographySpec.includes("15-role"));
});
