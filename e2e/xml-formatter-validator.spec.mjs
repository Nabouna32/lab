import { expect, test } from "@playwright/test";

test.describe("XML Formatter & Validator", () => {
  test("formats valid XML and validates it", async ({ page }) => {
    await page.goto("/fr/outils/formateur-validateur-xml");

    await page.getByLabel("Votre XML").fill("<root><item id=\"1\">Loculary</item><empty/></root>");
    await page.getByRole("button", { name: "Formater" }).click();

    await expect(page.getByRole("status")).toContainText("XML valide");
    await expect(page.locator("pre")).toContainText("<root>");
    await expect(page.locator("pre")).toContainText("<item id=\"1\">Loculary</item>");
  });

  test("rejects malformed XML", async ({ page }) => {
    await page.goto("/fr/outils/formateur-validateur-xml");

    await page.getByLabel("Votre XML").fill("<root><item></root>");
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByRole("alert")).toContainText("XML invalide");
  });
});
