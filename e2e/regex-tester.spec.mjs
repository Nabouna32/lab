import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("regex tester finds matches", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/regex-tester`);
  await expect(page.getByRole("heading", { name: "Regex Tester", exact: true })).toBeVisible();
  await page.getByLabel("Regular expression").fill("\\d+");
  await page.getByLabel("Test text").fill("Order 123 and 456");
  await page.getByRole("button", { name: "Test", exact: true }).click();
  await expect(page.getByText("2 matches", { exact: true })).toBeVisible();
  await expect(page.getByText("123", { exact: true })).toBeVisible();
  await expect(page.getByText("456", { exact: true })).toBeVisible();
});

test("regex tester is available on the French localized route", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/testeur-regex`);
  await expect(page.getByRole("heading", { name: "Testeur de regex", exact: true })).toBeVisible();
  await page.getByLabel("Expression régulière").fill("chat");
  await page.getByLabel("Texte à tester").fill("chat");
  await page.getByRole("button", { name: "Tester", exact: true }).click();
  await expect(page.getByText("1 correspondance", { exact: true })).toBeVisible();
});

test("regex tester reports invalid expressions", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/regex-tester`);
  await page.getByLabel("Regular expression").fill("[");
  await page.getByRole("button", { name: "Test", exact: true }).click();
  await expect(page.getByText("The regular expression or flags are invalid.", { exact: true })).toBeVisible();
});