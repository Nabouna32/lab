import assert from "node:assert/strict";
import { test } from "node:test";
import { getToolProcessingPresentation } from "./processing.ts";

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
      icon: "🔒",
      label: "Traitement local",
      summary: "Vos données restent sur votre appareil.",
    },
  );
});

test("external processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "external" }),
    {
      icon: "🌐",
      label: "Service externe",
      summary: "Certaines données sont transmises à un service externe.",
    },
  );
});

test("server processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "utiluna-server" }),
    {
      icon: "☁️",
      label: "Serveur Utiluna",
      summary: "Ce traitement nécessite l’infrastructure Utiluna.",
    },
  );
});

test("hybrid processing is disclosed", () => {
  assert.deepEqual(
    getToolProcessingPresentation({ ...base, mode: "hybrid" }),
    {
      icon: "🔒 + 🌐",
      label: "Traitement hybride",
      summary: "Le traitement local est complété par un service externe.",
    },
  );
});
