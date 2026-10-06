import assert from "node:assert/strict";
import test from "node:test";
import { getNextActions } from "./relations.ts";

const tools = [
  {
    id: "percentage",
    icon: "📊",
    content: {
      fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage." },
      en: { name: "Percentage calculator", description: "Calculate a percentage." },
    },
    tags: ["prix", "taux"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "published",
    nextActionToolIds: ["discount"],
  },
  {
    id: "discount",
    icon: "🏷️",
    content: {
      fr: { name: "Calculateur de réduction", description: "Calculez une remise." },
      en: { name: "Discount calculator", description: "Calculate a discount." },
    },
    tags: ["prix", "remise"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "published",
    nextActionToolIds: [],
  },
  {
    id: "age",
    icon: "🎂",
    content: {
      fr: { name: "Calculateur d'âge", description: "Calculez un âge." },
      en: { name: "Age calculator", description: "Calculate age." },
    },
    tags: ["prix"],
    aliases: [],
    categories: ["dates"],
    lifecycle: "published",
    nextActionToolIds: [],
  },
  {
    id: "vat",
    icon: "💶",
    content: {
      fr: { name: "Calculateur TVA", description: "Calculez une TVA." },
      en: { name: "VAT calculator", description: "Calculate VAT." },
    },
    tags: ["prix"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "draft",
    nextActionToolIds: [],
  },
];

test("next actions use explicit curated relations, not shared metadata", () => {
  assert.deepEqual(
    getNextActions(tools[0], tools).map((tool) => tool.id),
    ["discount"],
  );
});

test("zero next actions is a valid outcome", () => {
  assert.deepEqual(getNextActions(tools[1], tools), []);
});

test("unpublished next actions are never returned", () => {
  assert.deepEqual(getNextActions({ ...tools[0], nextActionToolIds: ["vat"] }, tools), []);
});

test("curated order is preserved and limited", () => {
  assert.deepEqual(
    getNextActions({ ...tools[0], nextActionToolIds: ["discount", "age"] }, tools, 1).map((tool) => tool.id),
    ["discount"],
  );
});
