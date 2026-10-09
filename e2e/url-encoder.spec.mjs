import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("URL encoder encodes and decodes a URL component", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/encodeur-decodeur-url", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Encodeur et décodeur d’URL" })).toBeVisible();

  const input = page.getByLabel("Votre texte");
  await input.fill("hello world?name=Loculary");

  await page.getByRole("button", { name: "Encoder" }).click();
  const output = page.locator("pre").last();
  await expect(output).toContainText("hello%20world%3Fname%3DLoculary");

  await page.getByRole("button", { name: "Décoder" }).click();
  await expect(output).toContainText("hello world?name=Loculary");

  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();

  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});
