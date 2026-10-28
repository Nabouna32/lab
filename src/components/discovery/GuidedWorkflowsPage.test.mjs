import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getPublishedTools } from "../../lib/tools/catalog.ts";

const source = readFileSync(new URL("./GuidedWorkflowsPage.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../../app/[locale]/[section]/page.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("../home/HomeGuidedWorkflows.tsx", import.meta.url), "utf8");
const routeHelpers = readFileSync(new URL("../../lib/tools/routes.ts", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../lib/i18n/messages.ts", import.meta.url), "utf8");

test("guided workflows only reference published tools", () => {
  const ids = [...messages.matchAll(/toolId: "([^"]+)"/g)].map((match) => match[1]);
  const publishedIds = new Set(getPublishedTools().map((tool) => tool.id));
  assert.ok(ids.length >= 8, "provide several multi-step workflows");
  for (const id of ids) assert.ok(publishedIds.has(id), `workflow references unpublished tool: ${id}`);
});

test("guided workflows explain their steps and distinguish real automatic transfer", () => {
  assert.equal([...messages.matchAll(/id: "(?:clean-and-compare|prepare-json|convert-tabular-data|prepare-photo-document)"/g)].length, 8);
  assert.match(messages, /transfer: "automatic"/);
  assert.match(messages, /id: "convert-tabular-data"[\s\S]*?transfer: "automatic"/);
  assert.match(messages, /transfer: "independent"/);
  assert.match(messages, /these steps remain independent/);
  assert.match(messages, /ces étapes restent indépendantes/);
  assert.match(messages, /The result is passed automatically to the next step/);
  assert.match(messages, /Le résultat passe automatiquement à l’étape suivante/);
  assert.match(messages, /Copy the result into the next step when needed/);
  assert.match(messages, /Copiez le résultat dans l’étape suivante/);
  assert.match(source, /data-testid="guided-workflows"/);
  assert.match(source, /getMessages\(locale\)\.guidedWorkflows/);
  assert.match(source, /bg-\[var\(--primary-container\)\] text-\[var\(--on-primary-container\)\]/, "workflow icons pair primary-container with on-primary-container");
  assert.match(source, /m3-type-headline-large/);
  assert.match(source, /m3-type-title-large/);
  assert.doesNotMatch(source, /text-4xl font-black|text-5xl|tracking-\[-0\.06em\]/, "workflow headings must not bypass shared typography roles");
});

test("guided workflows have localized routes, metadata, and a homepage entry point", () => {
  assert.match(routeHelpers, /en: "guided-workflows"/);
  assert.match(routeHelpers, /fr: "parcours-guides"/);
  assert.match(route, /getGuidedWorkflowsPath\(locale\)/);
  assert.match(route, /GuidedWorkflowsPage locale=\{locale\}/);
  assert.match(home, /getGuidedWorkflowsPath\(locale\)/);
  assert.match(home, /t\.guidedWorkflows\.homeTitle/);
  assert.match(home, /t\.guidedWorkflows\.homeTitle/);
});
