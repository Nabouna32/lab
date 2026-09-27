import assert from "node:assert/strict";
import test from "node:test";
import { getRelatedTools } from "./relations.ts";

const tools = [
  {
    id: "pourcentage",
    slug: "pourcentage",
    icon: "📊",
    content: { fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage." } },
    tags: ["prix", "taux"],
    aliases: [],
    categories: ["calculs"],
    lifecycle: "published",
  },
  {
    id: "reduction",
    slug: "reduction",
    icon: "🏷️",
    content: { fr: { name: "Calculateur de réduction", description: "Calculez une remise." } },
    tags: ["prix", "remise"],
    aliases: [],
    categories: ["calculs"],
    lifecycle: "published",
  },
  {
    id: "age",
    slug: "age",
    icon: "🎂",
    content: { fr: { name: "Calculateur d'âge", description: "Calculez un âge." } },
    tags: ["date", "naissance"],
    aliases: [],
    categories: ["dates"],
    lifecycle: "published",
  },
  {
    id: "tva",
    slug: "tva",
    icon: "💶",
    content: { fr: { name: "Calculateur TVA", description: "Calculez une TVA." } },
    tags: ["prix", "taxe"],
    aliases: [],
    categories: ["calculs"],
    lifecycle: "draft",
  },
];

test("related tools use shared metadata and category", () => {
  const related = getRelatedTools(tools[0], tools);
  assert.equal(related[0].id, "reduction");
});

test("unavailable tools are never returned", () => {
  const related = getRelatedTools(tools[0], tools);
  assert.equal(related.some((tool) => tool.id === "tva"), false);
});
