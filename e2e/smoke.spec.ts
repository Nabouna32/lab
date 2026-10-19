import { expect, test } from "@playwright/test";

test("localized homepages render a primary heading", async ({ page }) => {
  for (const locale of ["fr", "en"]) {
    await page.goto(`/${locale}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("search popup exposes its expanded state when there are no results", async ({ page }) => {
  for (const locale of ["fr", "en"]) {
    await page.goto(`/${locale}`);
    const search = page.getByRole("combobox");
    await search.fill("zzzz-no-such-loculary-tool-982341");

    await expect(search).toHaveAttribute("aria-expanded", "true");
    await expect(search).not.toHaveAttribute("aria-controls");
    await expect(page.locator('[data-search-popup-owner="home-tool-search-v4"]')).toBeVisible();
  }
});

test("French tool search opens the percentage calculator and computes a result", async ({ page }) => {
  await page.goto("/fr");
  const search = page.getByRole("combobox");
  await search.fill("pourcentage");

  const result = page.getByRole("option", { name: /calculateur de pourcentage/i });
  await expect(result).toBeVisible();
  await result.click();

  await expect(page).toHaveURL(/\/fr\/outils\/calculateur-de-pourcentage$/);
  await page.locator("#first-value").fill("20");
  await page.locator("#second-value").fill("150");

  const resultPanel = page.locator('[aria-live="polite"]').filter({ hasText: /\b30\b/ }).last();
  await expect(resultPanel).toBeVisible();
  await expect(resultPanel).toContainText("30");
});

test("English percentage calculator computes a result", async ({ page }) => {
  await page.goto("/en/tools/percentage-calculator");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.locator("#first-value").fill("20");
  await page.locator("#second-value").fill("150");

  const resultPanel = page.locator('[aria-live="polite"]').filter({ hasText: /\b30\b/ }).last();
  await expect(resultPanel).toBeVisible();
  await expect(resultPanel).toContainText("30");
});
