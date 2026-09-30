import assert from "node:assert/strict";
import test from "node:test";
import { getRelatedTools } from "./relations.ts";

const tools = [
  {
    id: "percentage",
    icon: "📊",
    content: { fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage." } },
    tags: ["prix", "taux"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "published",
  },
  {
    id: "discount",
    icon: "🏷️",
    content: { fr: { name: "Calculateur de réduction", description: "Calculez une remise." } },
    tags: ["prix", "remise"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "published",
  },
  {
    id: "age",
    icon: "🎂",
    content: { fr: { name: "Calculateur d'âge", description: "Calculez un âge." } },
    tags: ["date", "naissance"],
    aliases: [],
    categories: ["dates"],
    lifecycle: "published",
  },
  {
    id: "vat",
    icon: "💶",
    content: { fr: { name: "Calculateur TVA", description: "Calculez une TVA." } },
    tags: ["prix", "taxe"],
    aliases: [],
    categories: ["calculations"],
    lifecycle: "draft",
  },
];

test("related tools use shared metadata and category", () => {
  const related = getRelatedTools(tools[0], tools);
  assert.equal(related[0].id, "discount");
});

test("unavailable tools are never returned", () => {
  const related = getRelatedTools(tools[0], tools);
  assert.equal(related.some((tool) => tool.id === "vat"), false);
});
