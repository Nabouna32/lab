import { test, expect } from "@playwright/test";

test("cron expression tool validates and previews runs", async ({ page }) => {
  await page.goto("/en/tools/development/cron-expression");
  await expect(page.getByLabel("Cron expression")).toHaveValue("0 9 * * 1-5");
  await expect(page.getByText("Valid expression")).toBeVisible();

  const input = page.getByLabel("Cron expression");
  await input.fill("0 0 * * *");
  await expect(page.getByText("At midnight every day")).toBeVisible();

  await input.fill("60 * * * *");
  await expect(page.getByText("Invalid Cron expression.")).toBeVisible();
});
