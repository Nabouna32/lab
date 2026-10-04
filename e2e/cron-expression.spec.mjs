import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("cron expression tool validates and previews runs", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/development/cron-expression`);
  await expect(page.getByLabel("Cron expression")).toHaveValue("0 9 * * 1-5");
  await expect(page.getByRole("status").filter({ hasText: "Valid expression" })).toBeVisible();

  const input = page.getByLabel("Cron expression");
  await input.fill("0 0 * * *");
  await expect(page.getByText("At midnight every day", { exact: true })).toBeVisible();

  await input.fill("60 * * * *");
  await expect(page.getByText("Invalid Cron expression.", { exact: true })).toBeVisible();
});
