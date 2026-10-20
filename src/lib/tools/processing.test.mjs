import assert from "node:assert/strict";
import { test } from "node:test";
import { getToolProcessingPresentation } from "./processing.ts";
import { getMessages } from "../i18n/messages.ts";

const base = {
  dataCategories: [],
  externalProviders: [],
  storage: "none",
  retention: "Aucune",
  fallback: "Fallback local.",
};

test("local processing is presented as device-local", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "local" }),
    {
      icon: "lock",
      label: "Traitement local",
      summary: "Vos données restent sur votre appareil.",
    },
  );
});

test("external processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "external" }),
    {
      icon: "public",
      label: "Service externe",
      summary: "Certaines données sont transmises à un service externe.",
    },
  );
});

test("server processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "server" }),
    {
      icon: "cloud",
      label: "Serveur",
      summary: "Ce traitement nécessite un service serveur.",
    },
  );
});

test("hybrid processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "hybrid" }),
    {
      icon: "sync_alt",
      label: "Traitement hybride",
      summary: "Le traitement local est complété par un service externe.",
    },
  );
});


test("local privacy disclosure scopes its claim to tool inputs and results in both locales", () => {
  const french = getMessages("fr").processing.localDetail;
  const english = getMessages("en").processing.localDetail;

  assert.match(french, /données saisies et les résultats/);
  assert.match(french, /ne les envoie pas à un serveur/);
  assert.match(french, /compte ou dans un historique/);
  assert.doesNotMatch(french, /Aucune donnée/);

  assert.match(english, /data you enter and the results/);
  assert.match(english, /does not send them to a server/);
  assert.match(english, /account or history/);
  assert.doesNotMatch(english, /No data is sent to a server or stored by Loculary/);
});
