import assert from "node:assert/strict";
import { test } from "node:test";
import { validateToolCatalog } from "./metadata.ts";
import { getPrimaryToolCategory, isPublishedTool } from "./types.ts";

const tool = {
  id: "fixture",
  icon: "🧮",
  version: 1,
  complexity: "small",
  categories: ["calculations"],
  content: {
    fr: { name: "Fixture", description: "Fixture" },
    en: { name: "Fixture", description: "Fixture" },
  },
  tags: ["fixture"],
  aliases: ["test"],
  seo: {
    fr: { title: "Fixture", description: "Fixture" },
    en: { title: "Fixture", description: "Fixture" },
  },
  examples: [],
  processing: {
    mode: "local",
    dataCategories: [],
    externalProviders: [],
    storage: "none",
    retention: "none",
    fallback: "local",
  },
  capabilities: ["local-processing"],
  browserRequirements: { apis: [] },
  offline: true,
  sharing: { supported: false, mode: "none" },
  relatedToolIds: [],
  quality: { accessibility: "required", performance: "standard", tests: "required" },
  lifecycle: "published",
  access: "anonymous",
  contributor: { type: "internal" },
};

test("the canonical tool contract derives publication and primary category from structured metadata", () => {
  assert.equal(isPublishedTool(tool), true);
  assert.equal(getPrimaryToolCategory(tool), "calculations");
  assert.equal("name" in tool, false);
  assert.equal("description" in tool, false);
  assert.equal("keywords" in tool, false);
  assert.equal("available" in tool, false);
  assert.equal("categoryId" in tool, false);
});

test("the metadata validator accepts a valid local published tool", () => {
  assert.doesNotThrow(() => validateToolCatalog([tool]));
});

test("the metadata validator rejects duplicate ids", () => {
  assert.throws(
    () => validateToolCatalog([tool, { ...tool }]),
    /Duplicate tool id/,
  );
});

test("the metadata validator rejects broken relationships", () => {
  assert.throws(
    () => validateToolCatalog([{ ...tool, relatedToolIds: ["missing-tool"] }]),
    /unknown related tool/,
  );
  assert.throws(
    () => validateToolCatalog([{ ...tool, relatedToolIds: [tool.id] }]),
    /cannot reference itself/,
  );
});

test("the metadata validator enforces processing capabilities and providers", () => {
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          processing: { ...tool.processing, mode: "external", externalProviders: ["example"] },
          capabilities: ["local-processing"],
          offline: false,
        },
      ]),
    /requires capability "network"/,
  );
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          processing: { ...tool.processing, mode: "external", externalProviders: [] },
          capabilities: ["network"],
          offline: false,
        },
      ]),
    /must declare at least one external provider/,
  );
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          processing: { ...tool.processing, mode: "local", externalProviders: ["example"] },
        },
      ]),
    /cannot declare external providers/,
  );
});

test("the metadata validator rejects incompatible offline, storage and network metadata", () => {
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          processing: { ...tool.processing, mode: "external", externalProviders: ["example"] },
          capabilities: ["network"],
          offline: true,
        },
      ]),
    /Only local tools can be declared offline/,
  );
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          processing: { ...tool.processing, storage: "server" },
        },
      ]),
    /incompatible storage metadata/,
  );
  assert.throws(
    () =>
      validateToolCatalog([
        {
          ...tool,
          capabilities: ["local-processing", "network"],
        },
      ]),
    /Local tool .* cannot require network access/,
  );
});

test("the metadata validator requires the primary category and canonical taxonomy", () => {
  assert.throws(
    () => validateToolCatalog([{ ...tool, categories: [] }]),
    /must declare at least one category/,
  );
  assert.throws(
    () => validateToolCatalog([{ ...tool, tags: ["fixture", "fixture"] }]),
    /unique, non-empty tags/,
  );
  assert.throws(
    () => validateToolCatalog([{ ...tool, aliases: [""] }]),
    /unique, non-empty aliases/,
  );
});

test("the metadata validator requires a contributor name for community tools", () => {
  assert.throws(
    () =>
      validateToolCatalog([
        { ...tool, contributor: { type: "community" } },
      ]),
    /must identify its contributor/,
  );
});
