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

  await page.getByRole("button", { name: "Vives" }).click();
  await expect(page.getByRole("button", { name: "Vives" })).toHaveAttribute("aria-pressed", "true");

  const expectedLightColors = [
    ["Dates", "#A15C00"],
    ["Informatique", "#6941C6"],
    ["Images", "#C11574"],
    ["Fichiers", "#0077B6"],
    ["Vidéo", "#00875A"],
    ["Développement", "#3538CD"],
  ];
  for (const [name, color] of expectedLightColors) {
    await expect(categoryCards.filter({ hasText: name })).toContainText(color);
  }

  await page.getByRole("button", { name: /Sombre/ }).click();
  await expect(calculations).toContainText("#FF756B");
  const expectedDarkColors = [
    ["Dates", "#FFC05C"],
    ["Informatique", "#B7A0FF"],
    ["Images", "#FF8CC8"],
    ["Fichiers", "#61D5F2"],
    ["Vidéo", "#55D6A0"],
    ["Développement", "#9EA7FF"],
  ];
  for (const [name, color] of expectedDarkColors) {
    await expect(categoryCards.filter({ hasText: name })).toContainText(color);
  }

  await page.getByRole("button", { name: "Équilibrées" }).click();
  await expect(calculations).toContainText("#FF6B5E");
  await page.getByLabel("Langue de l’aperçu").selectOption("en");
  await expect(page.getByRole("heading", { name: "Category identity colors" })).toBeVisible();
});
