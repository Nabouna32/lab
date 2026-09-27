import assert from "node:assert/strict";
import { test } from "node:test";
import { searchTools } from "./search.ts";

const fixtureTools = [
  {
    id: "pourcentage",
    tags: ["%", "taux"],
    aliases: ["pourcentage"],
    categories: ["calculs"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage." },
      en: { name: "Percentage Calculator", description: "Calculate a percentage." },
    },
  },
  {
    id: "regle-de-trois",
    tags: ["proportion"],
    aliases: ["ratio"],
    categories: ["calculs"],
    lifecycle: "published",
    content: {
      fr: { name: "Règle de trois", description: "Résolvez une proportionnalité." },
      en: { name: "Rule of Three Calculator", description: "Solve proportional calculations." },
    },
  },
  {
    id: "temps-telechargement",
    tags: ["download", "internet"],
    aliases: ["telechargement"],
    categories: ["informatique"],
    lifecycle: "published",
    content: {
      fr: { name: "Temps de téléchargement", description: "Estimez une durée de téléchargement." },
      en: { name: "Download Time Calculator", description: "Estimate download time." },
    },
  },
];

function ids(query, locale = "fr") {
  return searchTools(fixtureTools, query, locale).map(({ tool }) => tool.id);
}

test("matches localized names and ignores accents", () => {
  assert.equal(ids("regle")[0], "regle-de-trois");
  assert.equal(ids("règle")[0], "regle-de-trois");
});

test("matches aliases and keywords", () => {
  assert.equal(ids("internet")[0], "temps-telechargement");
  assert.equal(ids("telechargement")[0], "temps-telechargement");
});

test("tolerates a small typo in a tool name", () => {
  assert.equal(ids("pourcentge")[0], "pourcentage");
  assert.equal(ids("telechargemnt")[0], "temps-telechargement");
});

test("supports multi-term queries with a typo", () => {
  assert.equal(ids("calculer pourcentge")[0], "pourcentage");
});

test("does not fuzzy-match very short terms", () => {
  assert.deepEqual(ids("tvx"), []);
});


test("matches tags and categories", () => {
  const catalogFixture = {
    id: "internet-tools",
    name: "Internet tools",
    description: "Utilities for internet tasks.",
    tags: ["networking"],
    aliases: [],
    categories: ["informatique"],
    lifecycle: "published",
    content: {
      fr: { name: "Outils Internet", description: "Outils pour les tâches Internet." },
      en: { name: "Internet Tools", description: "Utilities for internet tasks." },
    },
  };

  assert.equal(searchTools([catalogFixture], "networking")[0]?.tool.id, "internet-tools");
  assert.equal(searchTools([catalogFixture], "informatique")[0]?.tool.id, "internet-tools");
});
