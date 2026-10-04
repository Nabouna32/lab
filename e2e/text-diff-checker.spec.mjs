import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("text diff checker compares two versions locally", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/development/text-diff-checker");
  await expect(page.getByRole("heading", { name: "Text Diff Checker", exact: true })).toBeVisible();

  await page.getByLabel("Original version").fill("one\ntwo\nthree");
  await page.getByLabel("Updated version").fill("one\nchanged\nthree\nfour");

  await expect(page.getByText("+2 additions · -1 removal · 2 unchanged lines", { exact: true })).toBeVisible();
  await expect(page.getByText("changed", { exact: true })).toBeVisible();
  await expect(page.getByText("two", { exact: true })).toBeVisible();
  await expect(page.getByText("four", { exact: true })).toBeVisible();
});
