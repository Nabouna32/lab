import { test, expect } from "@playwright/test";

test.describe("Image Compressor", () => {
  test("exposes the compression controls and local workflow", async ({ page }) => {
    await page.goto("/fr/outils/image-compressor");
    await expect(page.getByText("Compresseur d’image")).toBeVisible();
    await expect(page.getByLabel("Format")).toBeVisible();
    await expect(page.getByLabel("Dimension maximale")).toBeVisible();
    await expect(page.getByText("Traitement local")).toBeVisible();
  });
});
