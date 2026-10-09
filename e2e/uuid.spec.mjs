import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function stubClipboard(page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
}

test("UUID generator creates, copies and clears UUID v4 values in French", async ({ page }) => {
  await stubClipboard(page);
  await page.goto(baseUrl + "/fr/outils/generateur-uuid", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Générateur UUID" })).toBeVisible();
  await page.getByLabel("Nombre d’UUID").fill("3");
  await page.getByRole("button", { name: "Générer" }).click();

  const output = page.locator("pre").last();
  await expect(output).toHaveText(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:\n[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}){2}$/i,
  );

  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();

  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(output).toHaveText(" ");
});

test("UUID generator is fully localized in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/uuid-generator", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "UUID Generator" })).toBeVisible();
  await expect(page.getByLabel("Number of UUIDs")).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate" })).toBeVisible();
  await expect(page.getByText("Fully local processing", { exact: true })).toBeVisible();
});

test("UUID generator rejects an invalid count", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/generateur-uuid", { waitUntil: "networkidle" });

  await page.getByLabel("Nombre d’UUID").fill("51");
  await page.getByRole("button", { name: "Générer" }).click();

  await expect(page.locator("#uuid-count-error")).toHaveText("Choisissez un nombre entier compris entre 1 et 50.");
  await expect(page.locator("#uuid-count-error")).toHaveAttribute("role", "alert");
  await expect(page.locator("pre").last()).toHaveText(" ");
});
