import { expect, test, type Page } from "@playwright/test";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const layout = await page.evaluate(() => ({
    title: document.title,
    language: document.documentElement.lang,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  const errors = runtimeErrors.get(page) ?? [];
  console.log(JSON.stringify({ test: testInfo.title, project: testInfo.project.name, layout, runtimeErrors: errors }));
  expect(errors, "unexpected browser runtime errors on homepage/discovery").toEqual([]);
});

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(
    dimensions.documentWidth,
    `document width (${dimensions.documentWidth}px) should fit viewport (${dimensions.viewportWidth}px)`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

test("French homepage renders and exposes the search combobox state", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Parcours guidés/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tous les outils", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Commence par ta tâche" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Catégories" })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  const search = page.locator("#home-tool-search-v4").getByRole("combobox");
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute("aria-expanded", "false");
  await search.fill("sous réseau");
  await expect(search).toHaveAttribute("aria-expanded", "true", { timeout: 8_000 });
  await expect(page.locator('[data-search-popup-owner="home-tool-search-v4"]')).toBeVisible();
});

test("English homepage renders in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Guided workflows/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "All tools", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start with your task" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Categories" })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("Explorer keeps intent and category discovery in both locales", async ({ page }) => {
  await page.goto("/fr/outils");
  await expect(page.getByRole("heading", { name: "Commence par ta tâche" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Parcourir par catégorie" })).toBeVisible();

  await page.goto("/en/tools");
  await expect(page.getByRole("heading", { name: "Start with your task" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browse by category" })).toBeVisible();
});

