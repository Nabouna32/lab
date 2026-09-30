import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test.beforeEach(async ({ page }) => {
  const token = process.env.VERCEL_TRUSTED_OIDC_TOKEN;

  if (token) {
    await page.setExtraHTTPHeaders({
      "x-vercel-trusted-oidc-idp-token": token,
    });
  }
});

test("TVA calculator converts HT to TTC", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculs/calculateur-de-tva`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Calculateur TVA HT / TTC" })).toBeVisible();

  await page.getByLabel("Prix HT").fill("100");
  await expect(page.getByText("120 €", { exact: true })).toBeVisible();
  await expect(page.getByText("20 €", { exact: true })).toBeVisible();
});

test("TVA calculator converts TTC to HT", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculs/calculateur-de-tva`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "TTC → HT" }).click();
  await page.getByLabel("Prix TTC").fill("120");

  await expect(page.getByText("100 €", { exact: true })).toBeVisible();
  await expect(page.getByText("20 €", { exact: true })).toBeVisible();
});
