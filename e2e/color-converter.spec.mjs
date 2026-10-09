import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("color converter converts HEX to RGB and HSL", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/color-converter`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Color converter" })).toBeVisible();
  await page.getByLabel("Your color").fill("#336699");
  await expect(page.getByText("rgb(51, 102, 153)", { exact: true })).toBeVisible();
  await expect(page.getByText("hsl(210°, 50%, 40%)", { exact: true })).toBeVisible();
});

test("French color converter route is localized", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/convertisseur-de-couleur`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Convertisseur de couleurs" })).toBeVisible();
  await page.getByLabel("Votre couleur").fill("rgb(255, 0, 128)");
  await expect(page.locator("code").filter({ hasText: "#FF0080" })).toBeVisible();
});
