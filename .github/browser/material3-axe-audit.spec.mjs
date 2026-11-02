import { mkdirSync, writeFileSync } from "node:fs";
import { test } from "@playwright/test";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const reportDirectory = resolve("artifacts/browser/axe-reports");
const locales = [
  { locale: "fr", tools: [
    "/fr/outils/calculateur-de-pourcentage",
    "/fr/outils/repartiteur-de-depenses-de-groupe",
    "/fr/outils/formateur-json",
    "/fr/outils/compresseur-d-image",
    "/fr/outils/generateur-de-qr-code",
  ] },
  { locale: "en", tools: [
    "/en/tools/percentage-calculator",
    "/en/tools/group-expense-splitter",
    "/en/tools/json-formatter",
    "/en/tools/image-compressor",
    "/en/tools/qr-code-generator",
  ] },
];
const colorSchemes = ["light", "dark"];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function runAxe(page, label) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async (tags) => {
    const report = await window.axe.run(document, {
      runOnly: { type: "tag", values: tags },
    });
    return {
      summary: {
        violations: report.violations.length,
        incomplete: report.incomplete.length,
        passes: report.passes.length,
      },
      violations: report.violations.map(({ id, impact, help, helpUrl, nodes }) => ({
        id,
        impact,
        help,
        helpUrl,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
      incomplete: report.incomplete.map(({ id, help, helpUrl, nodes }) => ({
        id,
        help,
        helpUrl,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
    };
  }, wcagTags);
}

for (const entry of locales) {
  for (const path of entry.tools) {
    for (const colorScheme of colorSchemes) {
      test("rapport axe-core informatif — " + entry.locale + " / " + path + " / " + colorScheme, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(path);

        const result = await runAxe(page, entry.locale + " " + path + " " + colorScheme);
        const report = {
          toolPath: path,
          locale: entry.locale,
          colorScheme,
          viewport: { width: 390, height: 844 },
          tags: wcagTags,
          generatedAt: new Date().toISOString(),
          ...result,
          interpretation: "Rapport indicatif uniquement. Les constats axe-core ne définissent aucune valeur AndroidX et ne font pas échouer ce contrôle.",
        };
        const filename = [entry.locale, path.split("/").filter(Boolean).at(-1), colorScheme].join("-") + ".json";
        mkdirSync(reportDirectory, { recursive: true });
        writeFileSync(resolve(reportDirectory, filename), JSON.stringify(report, null, 2) + "\n");

        console.log(
          "axe-core informatif " + entry.locale + " " + path + " " + colorScheme +
          " : " + result.summary.violations + " violation(s), " +
          result.summary.incomplete + " vérification(s) manuelle(s), " +
          result.summary.passes + " règle(s) réussie(s).",
        );
      });
    }
  }
}
