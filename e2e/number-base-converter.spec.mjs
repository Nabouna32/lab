import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("number base converter converts between common bases in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/developpement/convertisseur-de-bases", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Convertisseur de bases" })).toBeVisible();

  await page.getByLabel("Nombre à convertir").fill("FF");
  await page.getByLabel("Base de départ").selectOption("16");
  await page.getByLabel("Base d’arrivée").selectOption("10");

  await expect(page.getByText("255", { exact: true })).toBeVisible();
});

test("number base converter validates digits in the selected base in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/development/number-base-converter", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Number Base Converter" })).toBeVisible();

  const input = page.getByLabel("Number to convert");
  await input.fill("102");
  await page.getByLabel("Source base").selectOption("2");

  await expect(page.getByRole("alert")).toHaveText("Enter a valid integer for the selected base.");
  await expect(input).toHaveAttribute("aria-invalid", "true");
});
