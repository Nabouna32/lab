import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("color contrast checker evaluates WCAG thresholds in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/images/verificateur-de-contraste-des-couleurs", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Contraste des couleurs" })).toBeVisible();

  await page.getByLabel("Texte / premier plan").fill("#767676");
  await page.getByLabel("Arrière-plan").fill("#ffffff");

  await expect(page.getByText("4.48:1", { exact: true })).toBeVisible();
  await expect(page.getByText("Texte courant · AA")).toContainText("—");
  await expect(page.getByText("Grand texte · AA")).toContainText("✓");
});

test("color contrast checker supports RGB input in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/images/color-contrast-checker", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Color contrast checker" })).toBeVisible();

  await page.getByLabel("Text / foreground").fill("rgb(0, 0, 0)");
  await page.getByLabel("Background").fill("rgb(255, 255, 255)");

  await expect(page.getByText("21.00:1", { exact: true })).toBeVisible();
  await expect(page.getByText("Normal text · AAA")).toContainText("✓");
});
