import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("JWT decoder reads header and payload locally", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/development/jwt-decoder`);
  await expect(page.getByRole("heading", { name: "JWT Decoder", exact: true })).toBeVisible();
  await page.getByLabel("Your JWT").fill("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE3MDAwMDAwMDB9.signature");
  await page.getByRole("button", { name: "Decode", exact: true }).click();
  await expect(page.getByText('"sub": "123"', { exact: false })).toBeVisible();
  await expect(page.getByText("Decoding is not verification", { exact: false })).toBeVisible();
});
