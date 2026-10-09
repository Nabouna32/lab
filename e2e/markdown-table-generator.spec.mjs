import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("Markdown Table Generator works in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/generateur-de-tableau-markdown", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Générateur de tableau Markdown", exact: true })).toBeVisible();
  await expect(page.getByLabel("En-tête 1, Colonne 1")).toBeVisible();
  await page.getByLabel("En-tête 1, Colonne 1").fill("Nom");
  await page.getByLabel("En-tête 1, Colonne 2").fill("Âge");
  await page.getByLabel("Corps 2, Colonne 1").fill("Ada");
  await page.getByLabel("Corps 2, Colonne 2").fill("36");
  const output = page.getByRole("pre", { name: "Markdown" });
  await expect(output).toContainText("| Nom | Âge |");
  await expect(output).toContainText("| :--- | :--- |");
});

test("Markdown Table Generator is localized in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/markdown-table-generator", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Markdown Table Generator", exact: true })).toBeVisible();
  await expect(page.getByLabel("Header 1, Column 1")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
});
