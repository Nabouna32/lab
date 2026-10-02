import { test, expect } from "@playwright/test";
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("UUID generator creates and copies UUID v4 values", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => {} } }); });
  await page.goto(baseUrl + "/fr/outils/developpement/generateur-uuid", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Générateur UUID" })).toBeVisible();
  await page.getByLabel("Nombre d’UUID").fill("3");
  await page.getByRole("button", { name: "Générer" }).click();
  const output = page.locator("pre").last();
  await expect(output).toHaveText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:\n[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}){2}$/i);
  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(output).toHaveText(" ");
});
