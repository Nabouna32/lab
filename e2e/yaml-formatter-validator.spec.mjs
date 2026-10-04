import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("YAML formatter validates and formats a document", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/development/yaml-formatter-validator`);
  await expect(page.getByRole("heading", { name: "YAML Formatter & Validator", exact: true })).toBeVisible();
  await page.getByLabel("Your YAML").fill("root:\n    name: Loculary\n    tools:\n      - JSON\n      - YAML");
  await page.getByRole("button", { name: "Format", exact: true }).click();
  await expect(page.getByText("Formatted", { exact: true })).toBeVisible();
  await expect(page.locator("pre")).toContainText("root:\n  name: Loculary");
  await expect(page.locator("pre")).toContainText("tools:\n  - JSON\n  - YAML");
});
