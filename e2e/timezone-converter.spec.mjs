import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("Time zone converter converts Paris to New York in French", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/convertisseur-de-fuseaux-horaires`);
  await expect(page.getByRole("heading", { name: "Convertisseur de fuseaux horaires", exact: true })).toBeVisible();
  await page.getByLabel("Date et heure").fill("2024-01-15T12:00");
  await page.getByLabel("Fuseau source").selectOption("Europe/Paris");
  await page.getByLabel("Fuseau de destination").selectOption("America/New_York");
  await page.getByRole("button", { name: "Convertir", exact: true }).click();
  await expect(page.getByText("UTC+01:00")).toBeVisible();
  await expect(page.getByText("UTC-05:00")).toBeVisible();
  await expect(page.getByText(/06:00/)).toBeVisible();
});

test("Time zone converter explains an ambiguous DST time in English", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/time-zone-converter`);
  await expect(page.getByRole("heading", { name: "Time Zone Converter", exact: true })).toBeVisible();
  await page.getByLabel("Date and time").fill("2024-11-03T01:30");
  await page.getByLabel("Source time zone").selectOption("America/New_York");
  await page.getByLabel("Destination time zone").selectOption("Europe/Paris");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.getByText("This local time occurs twice because of a time-zone transition. Loculary uses the first occurrence.")).toBeVisible();
  await expect(page.getByText(/06:30/)).toBeVisible();
});

test("Time zone converter reports a nonexistent DST time", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/time-zone-converter`);
  await page.getByLabel("Date and time").fill("2024-03-10T02:30");
  await page.getByLabel("Source time zone").selectOption("America/New_York");
  await page.getByLabel("Destination time zone").selectOption("Europe/Paris");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(/Some local times do not exist/);
});