import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("hash generator creates a SHA-256 digest", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/hash-generator`);
  await expect(page.getByRole("heading", { name: "Hash Generator", exact: true })).toBeVisible();
  await page.getByLabel("Your text").fill("hello");
  await page.getByLabel("Hash algorithm").selectOption("SHA-256");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(page.getByText("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824", { exact: true })).toBeVisible();
});
