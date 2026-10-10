import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const variants = [
  "content",
  "expressive",
  "fidelity",
  "fruit-salad",
  "monochrome",
  "neutral",
  "rainbow",
  "tonal-spot",
  "vibrant",
];

test("design lab generates real Material Color Utilities schemes and exposes its variants", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/design-lab`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Trouvons la personnalité visuelle de Loculary." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Couleurs d’identité des catégories" })).toBeVisible();

  const lab = page.locator("main[data-scheme-variant]");
  const variantSelect = page.getByTestId("scheme-variant");
  const specSelect = page.getByTestId("scheme-spec-version");
  const platformSelect = page.getByTestId("scheme-platform");
  await expect(variantSelect.locator("option")).toHaveCount(9);
  await expect(specSelect.locator("option")).toHaveCount(2);
  await expect(platformSelect.locator("option")).toHaveCount(2);
  await expect(lab).toHaveAttribute("data-seed", "#1E88E5");
  await expect(lab).toHaveAttribute("data-category-set", "compare");
  await expect(lab).toHaveAttribute("data-category-style", "stripe");
  await expect(lab).toHaveAttribute("data-type-preset", "roboto");
  await expect(page.getByTestId("category-mcu-rainbow")).toHaveCount(7);
  await expect(page.getByTestId("category-direct-rainbow")).toHaveCount(7);
  await expect(lab).toHaveAttribute("data-spec-version", "2025");

  await specSelect.selectOption("2021");
  await expect(platformSelect).toBeDisabled();
  await specSelect.selectOption("2025");
  await platformSelect.selectOption("watch");
  await expect(lab).toHaveAttribute("data-platform", "watch");
  await platformSelect.selectOption("phone");

  for (const variant of variants) {
    await variantSelect.selectOption(variant);
    await expect(lab).toHaveAttribute("data-scheme-variant", variant);
  }

  await expect(page.locator('[class*="rolePairGrid"] > article')).toHaveCount(22);
  await expect(page.locator('[class*="semanticRoleGrid"] > div')).toHaveCount(53);
  await expect(page.locator('[class*="tonalPaletteGrid"] > article')).toHaveCount(6);
  await expect(page.locator('[class*="typeScaleGrid"] article')).toHaveCount(15);
});

test("source seed validation, contrast, light/dark, and category colors are independent", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/design-lab`, { waitUntil: "networkidle" });

  const lab = page.locator("main[data-scheme-variant]");
  const seedInput = page.locator('input[aria-describedby="seed-help"]');
  const calculations = page.getByTestId("category-mcu-rainbow").filter({ hasText: "Calculs" });
  const directCalculations = page.getByTestId("category-direct-rainbow").filter({ hasText: "Calculs" });
  const categorySeedBefore = await calculations.getAttribute("data-category-seed");

  await seedInput.fill("#ff0000");
  await expect(lab).toHaveAttribute("data-seed", "#FF0000");
  await expect(calculations).toHaveAttribute("data-category-seed", categorySeedBefore);

  await seedInput.fill("not-a-color");
  await expect(seedInput).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Saisis une couleur hexadécimale valide à 3 ou 6 chiffres.")).toBeVisible();
  await expect(lab).toHaveAttribute("data-seed", "#FF0000");

  await page.getByRole("button", { name: "Violet Material" }).click();
  await expect(lab).toHaveAttribute("data-seed", "#6750A4");

  const lightPrimary = await lab.evaluate(el => getComputedStyle(el).getPropertyValue("--lab-primary").trim());
  await page.getByRole("button", { name: "Sombre" }).click();
  await expect(lab).toHaveAttribute("data-theme", "dark");
  const darkPrimary = await lab.evaluate(el => getComputedStyle(el).getPropertyValue("--lab-primary").trim());
  expect(darkPrimary).not.toBe(lightPrimary);

  await page.getByRole("button", { name: "Renforcé · 0,5" }).click();
  await expect(lab).toHaveAttribute("data-contrast", "0.5");

  const generatedRainbowColor = await calculations.getAttribute("data-category-color");
  const directRainbowColor = await directCalculations.getAttribute("data-category-color");
  expect(generatedRainbowColor).not.toBe(directRainbowColor);
  await page.getByTestId("category-set-vivid").click();
  await expect(lab).toHaveAttribute("data-category-set", "vivid");
  await expect(directCalculations).toHaveAttribute("data-category-color", "#D32F2F");

  const softBackground = await calculations.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole("button", { name: "Aplat coloré" }).click();
  await expect(lab).toHaveAttribute("data-category-style", "solid");
  const solidBackground = await calculations.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(solidBackground).not.toBe(softBackground);

  await page.getByRole("button", { name: "Système", exact: true }).click();
  await expect(lab).toHaveAttribute("data-type-preset", "system");
  await expect.poll(() => lab.evaluate(el => getComputedStyle(el).fontFamily)).toContain("system-ui");

  await page.getByLabel("Langue de l’aperçu").selectOption("en");
  await expect(page.getByRole("heading", { name: "Category identity colors" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Semantic color roles" })).toBeVisible();
});
