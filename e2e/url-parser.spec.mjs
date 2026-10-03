import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("URL parser displays URL components and query parameters", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/developpement/analyseur-url", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Analyseur d’URL" })).toBeVisible();

  const input = page.getByLabel("Votre URL");
  await input.fill("https://example.com:8443/docs?lang=fr&tag=web#intro");

  await expect(page.getByText("https:", { exact: true })).toBeVisible();
  await expect(page.getByText("example.com:8443", { exact: true })).toBeVisible();
  await expect(page.getByText("/docs", { exact: true })).toBeVisible();
  await expect(page.getByText("lang", { exact: true })).toBeVisible();
  await expect(page.getByText("fr", { exact: true })).toBeVisible();
  await expect(page.getByText("tag", { exact: true })).toBeVisible();
  await expect(page.getByText("web", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Copier l’URL" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();

  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});

test("URL parser reports malformed input", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/development/url-parser", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "URL Parser" })).toBeVisible();
  await page.getByLabel("Your URL").fill("not a URL");
  await expect(page.getByText("Enter a valid absolute URL.", { exact: true })).toBeVisible();
});
