import { expect, test } from "@playwright/test";

test("creates a local contact sheet and downloads a PNG", async ({ page }) => {
  await page.goto("/en/tools/image-contact-sheet-generator");
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==", "base64");
  await page.locator("#contact-sheet-files").setInputFiles([
    { name: "one.png", mimeType: "image/png", buffer: png },
    { name: "two.png", mimeType: "image/png", buffer: png },
  ]);
  await expect(page.getByText("2 images selected")).toBeVisible();
  await page.getByRole("button", { name: "Generate contact sheet" }).click();
  await expect(page.getByRole("img", { name: "Contact sheet of 2 images, 3 columns" })).toBeVisible();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  expect((await pending).suggestedFilename()).toBe("loculary-planche-contact.png");
});
