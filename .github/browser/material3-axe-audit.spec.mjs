import { createRequire } from "node:module";
import { test, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const locales = [
  { locale: "fr", path: "/fr/design-lab" },
  { locale: "en", path: "/en/design-lab" },
];
const colorSchemes = ["light", "dark"];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function runAxe(page, label) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async (tags) => {
    const report = await window.axe.run(document, {
      runOnly: { type: "tag", values: tags },
    });
    return {
      violations: report.violations.map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
      incomplete: report.incomplete.map(({ id, help, nodes }) => ({
        id,
        help,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
    };
  }, wcagTags);

  console.log("axe-core " + label + " : " + JSON.stringify(result));
  expect(result.violations, "Violations détectées par axe-core — " + label).toEqual([]);
}

for (const entry of locales) {
  for (const colorScheme of colorSchemes) {
    test("audit axe-core facultatif — " + entry.locale + " / " + colorScheme, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(entry.path);
      await runAxe(page, entry.locale + " " + colorScheme);
    });
  }
}
