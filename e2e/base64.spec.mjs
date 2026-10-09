import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("Base64 encoder encodes and decodes UTF-8 text", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/encodeur-base64", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Encodeur et décodeur Base64" })).toBeVisible();

  const input = page.getByLabel("Votre texte");
  await input.fill("Hello, café 🌍");

  await page.getByRole("button", { name: "Encoder" }).click();
  const output = page.locator("pre").last();
  await expect(output).toContainText("SGVsbG8sIGNhZsOpIPCfjI0=");

  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();

  await page.getByRole("button", { name: "Décoder" }).click();
  await expect(output).toContainText("Hello, café 🌍");

  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});
