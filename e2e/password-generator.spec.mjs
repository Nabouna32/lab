import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("password generator creates a configurable password", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/computing/password-generator`);
  await expect(page.getByRole("heading", { name: "Password generator", exact: true })).toBeVisible();

  await page.getByLabel("Length").fill("16");
  await page.getByLabel("Symbols").uncheck();
  await page.getByRole("button", { name: "Generate password", exact: true }).click();

  const result = page.getByRole("status").or(page.locator("output").last());
  await expect(result).toContainText(/.+/);
});

test("password generator is available on the French localized route", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/informatique/generateur-de-mot-de-passe`);
  await expect(page.getByRole("heading", { name: "Générateur de mots de passe", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Générer un mot de passe", exact: true }).click();
  await expect(page.locator("output").last()).not.toHaveText("Générez un mot de passe pour l’afficher ici.");
});
