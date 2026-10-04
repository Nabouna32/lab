import { test, expect } from "@playwright/test";

test.describe("Date calculator", () => {
  test("loads in French with the primary controls", async ({ page }) => {
    await page.goto("/fr/outils/dates/calculateur-de-date");
    await expect(page).toHaveTitle(/Calculateur de date/);
    await expect(page.getByLabel("Date de départ")).toBeVisible();
    await expect(page.getByLabel("Quantité")).toBeVisible();
    await expect(page.getByLabel("Unité")).toBeVisible();
    await expect(page.getByText("Ajouter")).toBeVisible();
  });

  test("loads in English with the primary controls", async ({ page }) => {
    await page.goto("/en/tools/dates/date-calculator");
    await expect(page).toHaveTitle(/Date Calculator/);
    await expect(page.getByLabel("Start date")).toBeVisible();
    await expect(page.getByLabel("Amount")).toBeVisible();
    await expect(page.getByLabel("Unit")).toBeVisible();
  });
});
