import { expect, test } from "@playwright/test";

test("Unix timestamp converter converts seconds to a UTC date", async ({ page }) => {
  await page.goto("/fr/outils/developpement/convertisseur-timestamp-unix");
  await expect(page.getByRole("heading", { name: /timestamp unix/i })).toBeVisible();
  await page.getByLabel("Timestamp").fill("0");
  await page.getByLabel("Unité du timestamp").selectOption("seconds");
  await page.getByRole("button", { name: "Convertir" }).click();
  await expect(page.getByText("1970-01-01T00:00:00.000Z")).toBeVisible();
  await expect(page.getByText(/0 s · 0 ms/)).toBeVisible();
});

test("Unix timestamp converter converts a local date to Unix time", async ({ page }) => {
  await page.goto("/en/tools/development/unix-timestamp-converter");
  await expect(page.getByRole("heading", { name: /unix timestamp converter/i })).toBeVisible();
  await page.getByLabel("Date and time").fill("1970-01-01T00:00");
  await page.getByRole("button", { name: "Convert" }).click();
  await expect(page.getByText(/0 s · 0 ms/)).toBeVisible();
});
