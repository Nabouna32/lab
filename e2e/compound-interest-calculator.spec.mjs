import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test.describe("Compound Interest Calculator", () => {
  test("calculates compound interest in French", async ({ page }) => {
    await page.goto(`${baseUrl}/fr/outils/calculs/calculateur-d-interets-composes`);
    await page.getByLabel("Capital initial").fill("1000");
    await page.getByLabel("Taux annuel").fill("5");
    await page.getByLabel("Durée").fill("10");
    await expect(page.getByText("1 647,01")).toBeVisible();
    await expect(page.getByText("Intérêts gagnés")).toBeVisible();
  });

  test("calculates with regular contributions in English", async ({ page }) => {
    await page.goto(`${baseUrl}/en/tools/calculations/compound-interest-calculator`);
    await page.getByLabel("Initial principal").fill("1000");
    await page.getByLabel("Annual rate").fill("5");
    await page.getByLabel("Years").fill("10");
    await page.getByLabel("Contribution per period").fill("100");
    await expect(page.getByText("17,175.24")).toBeVisible();
    await expect(page.getByText("Total contributions and principal")).toBeVisible();
  });
});
