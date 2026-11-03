import assert from "node:assert/strict";
import { test } from "node:test";
import { toolSeo } from "./seo.ts";

test("published tool SEO metadata is localized", () => {
  for (const toolId of Object.keys(toolSeo)) {
    assert.notEqual(toolSeo[toolId].fr.title, toolSeo[toolId].en.title);
    assert.notEqual(toolSeo[toolId].fr.description, toolSeo[toolId].en.description);
  }
});
