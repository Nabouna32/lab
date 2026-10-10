import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("design lab compares category color sets, treatments, surfaces and typefaces", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/design-lab`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Trouvons la personnalité visuelle de Loculary." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Couleurs d’identité des catégories" })).toBeVisible();

  const lab = page.locator('main[data-category-set]');
  const categoryCards = page.locator('[class*="categoryCard"]');
  await expect(categoryCards).toHaveCount(7);

  const calculations = categoryCards.filter({ hasText: "Calculs" });
  await expect(calculations).toContainText("#D92D20");

  // Global brand palette and category identity colors are separate axes.
  const forestPalette = page.getByRole("button", { name: /Turquoise \+ vert/ });
  await forestPalette.click();
  await expect(forestPalette).toHaveAttribute("aria-pressed", "true");
  await expect(calculations).toContainText("#D92D20");

  await page.getByRole("button", { name: "Multicolore vif" }).click();
  await expect(lab).toHaveAttribute("data-category-set", "vivid");
  await expect(calculations).toContainText("#D32F2F");

  await page.getByRole("button", { name: "Aplat coloré" }).click();
  await expect(lab).toHaveAttribute("data-category-style", "solid");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(211, 47, 47)");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");

  await page.getByRole("button", { name: "Dominante bleue" }).click();
  await expect(lab).toHaveAttribute("data-category-set", "blue");
  await expect(calculations).toContainText("#2563EB");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(37, 99, 235)");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");

  await page.getByRole("button", { name: /Sombre/ }).click();
  await expect(calculations).toContainText("#60A5FA");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(96, 165, 250)");
  await expect.poll(() => calculations.evaluate(el => getComputedStyle(el).color)).toBe("rgb(16, 33, 58)");

  await page.getByRole("button", { name: "Contraste renforcé" }).click();
  await expect(lab).toHaveAttribute("data-surface-preset", "contrast");
  await expect.poll(() => lab.evaluate(el => getComputedStyle(el).getPropertyValue("--lab-bg").trim())).toBe("#0B1020");

  await page.getByRole("button", { name: "Système", exact: true }).click();
  await expect(lab).toHaveAttribute("data-type-preset", "system");
  await expect.poll(() => lab.evaluate(el => getComputedStyle(el).fontFamily)).toContain("system-ui");

  await page.getByRole("button", { name: "Bande franche" }).click();
  await expect(lab).toHaveAttribute("data-category-style", "stripe");

  await page.getByRole("button", { name: "Actuel", exact: true }).click();
  await expect(calculations).toContainText("#D92D20");
  await page.getByLabel("Langue de l’aperçu").selectOption("en");
  await expect(page.getByRole("heading", { name: "Category identity colors" })).toBeVisible();
});
