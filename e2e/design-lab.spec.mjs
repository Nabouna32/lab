import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("design lab compares palettes while preserving category identity colors", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/design-lab`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Trouvons la personnalité visuelle de Loculary." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Couleurs d’identité des catégories" })).toBeVisible();

  const categoryCards = page.locator('[class*="categoryCard"]');
  await expect(categoryCards).toHaveCount(7);

  const calculations = categoryCards.filter({ hasText: "Calculs" });
  await expect(calculations).toContainText("#D92D20");

  const forestPalette = page.getByRole("button", { name: /Turquoise \+ vert/ });
  await forestPalette.click();
  await expect(forestPalette).toHaveAttribute("aria-pressed", "true");
  await expect(calculations).toContainText("#D92D20");

  await page.getByRole("button", { name: /Sombre/ }).click();
  await expect(calculations).toContainText("#FF6B5E");

  await page.getByLabel("Langue de l’aperçu").selectOption("en");
  await expect(page.getByRole("heading", { name: "Category identity colors" })).toBeVisible();
});
