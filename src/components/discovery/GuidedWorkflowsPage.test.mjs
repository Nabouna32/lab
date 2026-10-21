import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getPublishedTools } from "../../lib/tools/catalog.ts";

const source = readFileSync(new URL("./GuidedWorkflowsPage.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../../app/[locale]/[section]/page.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("../home/HomeDiscovery.tsx", import.meta.url), "utf8");
const routeHelpers = readFileSync(new URL("../../lib/tools/routes.ts", import.meta.url), "utf8");

test("guided workflows only reference published tools", () => {
  const ids = [...source.matchAll(/toolId: "([^"]+)"/g)].map((match) => match[1]);
  const publishedIds = new Set(getPublishedTools().map((tool) => tool.id));
  assert.ok(ids.length >= 8, "provide several multi-step workflows");
  for (const id of ids) assert.ok(publishedIds.has(id), `workflow references unpublished tool: ${id}`);
});

test("guided workflows explain their steps and distinguish real automatic transfer", () => {
  assert.equal([...source.matchAll(/id: "(?:clean-and-compare|prepare-json|convert-tabular-data|prepare-photo-document)"/g)].length, 4);
  assert.match(source, /transfer: "automatic"/);
  assert.match(source, /transfer: "manual"/);
  assert.match(source, /transfer: "independent"/);
  assert.match(source, /these steps remain independent/);
  assert.match(source, /ces étapes restent indépendantes/);
  assert.match(source, /The result is passed automatically to the next step/);
  assert.match(source, /Le résultat passe automatiquement à l’étape suivante/);
  assert.match(source, /Copy the result into the next step when needed/);
  assert.match(source, /Copiez le résultat dans l’étape suivante/);
  assert.match(source, /data-testid="guided-workflows"/);
});

test("guided workflows have localized routes, metadata, and a homepage entry point", () => {
  assert.match(routeHelpers, /en: "guided-workflows"/);
  assert.match(routeHelpers, /fr: "parcours-guides"/);
  assert.match(route, /getGuidedWorkflowsPath\(locale\)/);
  assert.match(route, /GuidedWorkflowsPage locale=\{locale\}/);
  assert.match(home, /getGuidedWorkflowsPath\(locale\)/);
  assert.match(home, /Guided workflows/);
  assert.match(home, /Parcours guidés/);
});
