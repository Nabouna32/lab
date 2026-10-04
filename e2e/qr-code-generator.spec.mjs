import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("QR Code generator creates a local SVG in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/developpement/generateur-de-qr-code", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Générateur de QR Code", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Aperçu du QR Code" })).toBeVisible();
  await expect(page.getByText("Version 2")).toBeVisible();
  await page.getByLabel("Contenu à encoder").fill("https://loculary.com");
  await expect(page.getByRole("img", { name: "Aperçu du QR Code" })).toBeVisible();
});

test("QR Code generator is localized in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/development/qr-code-generator", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "QR Code Generator", exact: true })).toBeVisible();
  await expect(page.getByLabel("Content to encode")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download SVG" })).toBeVisible();
});
