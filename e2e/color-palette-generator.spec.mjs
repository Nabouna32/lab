import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("color palette generator works in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/color-palette-generator", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Color palette generator" })).toBeVisible();
  await page.getByLabel("Starting color").fill("#FF0080");
  await expect(page.locator("code").filter({ hasText: "#FF0080" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Analogous" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Triadic" })).toBeVisible();
});

test("color palette generator works in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/generateur-de-palette-de-couleurs", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Générateur de palette de couleurs" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Complémentaire", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Monochromatique" })).toBeVisible();
});
