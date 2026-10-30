import assert from "node:assert/strict";
import { test } from "node:test";
import { searchTools } from "./search.ts";
import { getPublishedTools } from "./catalog.ts";

const fixtureTools = [
  {
    id: "percentage",
    tags: ["%", "taux"],
    aliases: ["pourcentage"],
    categories: ["calculations"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur de pourcentage", description: "Calculez un pourcentage." },
      en: { name: "Percentage Calculator", description: "Calculate a percentage." },
    },
  },
  {
    id: "rule-of-three",
    tags: ["proportion"],
    aliases: ["ratio"],
    categories: ["calculations"],
    lifecycle: "published",
    content: {
      fr: { name: "Règle de trois", description: "Résolvez une proportionnalité." },
      en: { name: "Rule of Three Calculator", description: "Solve proportional calculations." },
    },
  },
  {
    id: "download-time",
    tags: ["download", "internet"],
    aliases: ["telechargement"],
    categories: ["computing"],
    lifecycle: "published",
    content: {
      fr: { name: "Temps de téléchargement", description: "Estimez une durée de téléchargement." },
      en: { name: "Download Time Calculator", description: "Estimate download time." },
    },
  },
  {
    id: "age-calculator",
    tags: ["age", "date"],
    aliases: ["âge", "birth date"],
    categories: ["calculations"],
    lifecycle: "published",
    content: {
      fr: { name: "Calculateur d'âge", description: "Calculez votre âge à partir de votre date de naissance." },
      en: { name: "Age Calculator", description: "Calculate your age from your date of birth." },
    },
  },
  {
    id: "image-metadata",
    tags: ["image", "exif", "metadata"],
    aliases: ["metadonnees image"],
    categories: ["images"],
    lifecycle: "published",
    content: {
      fr: { name: "Métadonnées d’image", description: "Inspectez les informations d’une image avant de la partager." },
      en: { name: "Image Metadata", description: "Inspect image information before sharing." },
    },
  },
  {
    id: "image-compressor",
    tags: ["image", "compress"],
    aliases: ["compression image"],
    categories: ["images"],
    lifecycle: "published",
    content: {
      fr: { name: "Compresser une image", description: "Réduisez le poids d’une image avant de la partager." },
      en: { name: "Image Compressor", description: "Reduce image size before sharing." },
    },
  },
  {
    id: "image-dimensions",
    tags: ["image", "dimensions"],
    aliases: ["dimensions image"],
    categories: ["images"],
    lifecycle: "published",
    content: {
      fr: { name: "Dimensions d’image", description: "Vérifiez les dimensions d’un fichier image." },
      en: { name: "Image Dimensions", description: "Check the dimensions of an image file." },
    },
  },
];

function ids(query, locale = "fr") {
  return searchTools(fixtureTools, query, locale).map(({ tool }) => tool.id);
}

test("matches localized names and ignores accents", () => {
  assert.equal(ids("regle")[0], "rule-of-three");
  assert.equal(ids("règle")[0], "rule-of-three");
});

test("matches aliases and keywords", () => {
  assert.equal(ids("internet")[0], "download-time");
  assert.equal(ids("telechargement")[0], "download-time");
});

test("tolerates a small typo in a tool name", () => {
  assert.equal(ids("pourcentge")[0], "percentage");
  assert.equal(ids("telechargemnt")[0], "download-time");
});

test("supports natural-language queries with numbers and intent words", () => {
  assert.equal(ids("calculer 17 % de 283")[0], "percentage");
});

test("supports multi-term queries with a typo", () => {
  assert.equal(ids("calculer pourcentge")[0], "percentage");
});

test("keeps relevant results when one query term is extra context", () => {
  assert.equal(ids("calculer un pourcentage rapidement")[0], "percentage");
});

test("does not fuzzy-match very short terms", () => {
  assert.deepEqual(ids("tvx"), []);
});

test("matches short terms at word boundaries instead of inside unrelated words", () => {
  assert.deepEqual(ids("age"), ["age-calculator"]);
  assert.deepEqual(ids("âge"), ["age-calculator"]);
  assert.equal(ids("per")[0], "percentage");
});

test("real catalog keeps short age queries away from image and percentage tools", () => {
  const publishedTools = getPublishedTools();

  for (const locale of ["fr", "en"]) {
    const resultIds = searchTools(publishedTools, "age", locale).map(({ tool }) => tool.id);
    assert.equal(resultIds[0], "age");
    assert.ok(!resultIds.includes("image-metadata"));
    assert.ok(!resultIds.includes("image-compressor"));
    assert.ok(!resultIds.includes("percentage"));
  }
});

test("matches tags and categories", () => {
  const catalogFixture = {
    id: "internet-tools",
    name: "Internet tools",
    description: "Utilities for internet tasks.",
    tags: ["networking"],
    aliases: [],
    categories: ["computing"],
    lifecycle: "published",
    content: {
      fr: { name: "Outils Internet", description: "Outils pour les tâches Internet." },
      en: { name: "Internet Tools", description: "Utilities for internet tasks." },
    },
  };

  assert.equal(searchTools([catalogFixture], "networking")[0]?.tool.id, "internet-tools");
  assert.equal(searchTools([catalogFixture], "computing")[0]?.tool.id, "internet-tools");
});

test("uses curated intent associations for a task-only query", () => {
  assert.deepEqual(new Set(ids("préparer")), new Set(["image-metadata", "image-compressor"]));
});

test("ranks tools associated with the inferred task above other matching tools", () => {
  const results = ids("préparer une image à partager");
  assert.ok(results.indexOf("image-metadata") < results.indexOf("image-dimensions"));
  assert.ok(results.indexOf("image-compressor") < results.indexOf("image-dimensions"));
});

test("recognizes English task intent as well as French", () => {
  assert.ok(ids("prepare an image to share", "en").includes("image-metadata"));
});
