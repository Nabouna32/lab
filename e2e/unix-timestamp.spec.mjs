import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test.use({ timezoneId: "UTC" });

test("Unix timestamp converter converts seconds to a UTC date", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/developpement/convertisseur-timestamp-unix`);
  await expect(page.getByRole("heading", { name: "Convertisseur de timestamp Unix", exact: true })).toBeVisible();
  await page.getByLabel("Timestamp Unix").fill("0");
  await page.getByLabel("Unité du timestamp").selectOption("seconds");
  await page.getByRole("button", { name: "Convertir" }).click();
  await expect(page.getByText("1970-01-01T00:00:00.000Z")).toBeVisible();
  await expect(page.getByText(/0 secondes · 0 millisecondes/)).toBeVisible();
});

test("Unix timestamp converter converts a local date to Unix time", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/development/unix-timestamp-converter`);
  await expect(page.getByRole("heading", { name: "Unix Timestamp Converter", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Date → timestamp", exact: true }).click();
  await page.getByLabel("Date and time").fill("1970-01-01T00:00");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.getByText(/0 seconds · 0 milliseconds/)).toBeVisible();
});
