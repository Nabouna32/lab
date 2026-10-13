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
  await expect(lab).toHaveAttribute("data-seed", "#4285F4");
  await expect(lab).toHaveAttribute("data-category-set", "mcu-rainbow");
  await expect(lab).toHaveAttribute("data-category-style", "stripe");
  await expect(lab).toHaveAttribute("data-type-preset", "roboto");
  await expect(lab).toHaveAttribute("data-scheme-variant", "vibrant");
  await expect(page.getByTestId("category-mcu-rainbow")).toHaveCount(7);
  const accentContrasts = await page.getByTestId("category-mcu-rainbow").evaluateAll(cards => cards.map(card => {
    const style = getComputedStyle(card);
    const luminance = (hex) => {
      const channels = hex.replace("#", "").match(/.{2}/g).map(value => parseInt(value, 16) / 255);
      const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(style.getPropertyValue("--category-foreground").trim());
    const background = luminance(style.getPropertyValue("--category-color").trim());
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  }));
  expect(accentContrasts.every(ratio => ratio >= 4.5)).toBe(true);
  await expect.poll(() => lab.evaluate(el => getComputedStyle(el).fontFamily)).toContain("Roboto");
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
  const categorySeedBefore = await calculations.getAttribute("data-category-seed");
  const categoryColorBefore = await calculations.getAttribute("data-category-color");
  const readStatusContrasts = () => lab.evaluate(el => {
    const style = getComputedStyle(el);
    const luminance = (hex) => {
      const channels = hex.replace("#", "").match(/.{2}/g).map(value => parseInt(value, 16) / 255);
      const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    return [["success","--lab-success-text","--lab-success-bg"],["warning","--lab-warning-text","--lab-warning-bg"],["error","--lab-error-text","--lab-error-bg"]].map(([name,fg,bg]) => {
      const foreground = luminance(style.getPropertyValue(fg).trim());
      const background = luminance(style.getPropertyValue(bg).trim());
      return { name, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
    });
  });
  expect((await readStatusContrasts()).every(pair => pair.ratio >= 4.5)).toBe(true);

  await seedInput.fill("#ff0000");
  await expect(lab).toHaveAttribute("data-seed", "#FF0000");
  await expect(calculations).toHaveAttribute("data-category-seed", categorySeedBefore);
  await expect(calculations).toHaveAttribute("data-category-color", categoryColorBefore);

  await seedInput.fill("not-a-color");
  await expect(seedInput).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Saisis une couleur hexadécimale valide à 3 ou 6 chiffres.")).toBeVisible();
  await expect(lab).toHaveAttribute("data-seed", "#FF0000");

  await page.getByRole("button", { name: "Violet Material" }).click();
  await expect(lab).toHaveAttribute("data-seed", "#6750A4");

  const lightPrimary = await lab.evaluate(el => getComputedStyle(el).getPropertyValue("--lab-primary").trim());
  await page.getByRole("button", { name: "Sombre" }).click();
  await expect(lab).toHaveAttribute("data-theme", "dark");
  expect((await readStatusContrasts()).every(pair => pair.ratio >= 4.5)).toBe(true);
  const darkPrimary = await lab.evaluate(el => getComputedStyle(el).getPropertyValue("--lab-primary").trim());
  expect(darkPrimary).not.toBe(lightPrimary);

  await page.getByRole("button", { name: "Renforcé · 0,5" }).click();
  await expect(lab).toHaveAttribute("data-contrast", "0.5");

  const generatedRainbowColor = await calculations.getAttribute("data-category-color");
  await page.getByTestId("category-set-blue").click();
  await expect(lab).toHaveAttribute("data-category-set", "blue");
  await page.getByTestId("category-set-mcu-rainbow").click();
  await expect(lab).toHaveAttribute("data-category-set", "mcu-rainbow");
  expect(await calculations.getAttribute("data-category-color")).toBe(generatedRainbowColor);

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

test("production pages apply generated blue M3 roles and distinct Rainbow categories", async ({ page }) => {
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  const readTheme = () => page.locator("html").evaluate(element => {
    const style = getComputedStyle(element);
    const categories = ["calculations", "dates", "computing", "images", "files", "video", "development"];
    const prefix = element.classList.contains("dark") ? "--m3-dark" : "--m3-light";
    return {
      primary: style.getPropertyValue("--primary").trim(),
      generatedPrimary: style.getPropertyValue("--m3-light-primary").trim(),
      categoryPairs: categories.map(category => ({
        color: style.getPropertyValue(`--category-${category}`).trim(),
        foreground: style.getPropertyValue(`${prefix}-category-${category}-foreground`).trim(),
      })),
    };
  });
  const assertCategoryContrast = (pairs) => {
    const luminance = (hex) => {
      const channels = hex.replace("#", "").match(/.{2}/g).map(value => parseInt(value, 16) / 255);
      const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    return pairs.every(({ color, foreground }) => {
      const bg = luminance(color);
      const fg = luminance(foreground);
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) >= 4.5;
    });
  };

  const light = await readTheme();
  expect(light.generatedPrimary).toMatch(/^#[0-9a-f]{6}$/i);
  expect(light.primary).not.toBe("#6750a4");
  expect(new Set(light.categoryPairs.map(pair => pair.color)).size).toBe(7);
  expect(assertCategoryContrast(light.categoryPairs)).toBe(true);

  await page.locator("html").evaluate(element => element.classList.add("dark"));
  const dark = await readTheme();
  expect(dark.primary).not.toBe(light.primary);
  expect(new Set(dark.categoryPairs.map(pair => pair.color)).size).toBe(7);
  expect(assertCategoryContrast(dark.categoryPairs)).toBe(true);
});
