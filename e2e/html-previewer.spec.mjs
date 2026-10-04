import { expect, test } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("HTML previewer renders a fragment in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/developpement/apercu-html", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Aperçu HTML", exact: true })).toBeVisible();

  await page.getByLabel("Votre HTML").fill("<h1>Loculary</h1><p>Bonjour</p>");

  const frame = page.frameLocator("iframe[title='Aperçu']");
  await expect(frame.getByRole("heading", { name: "Loculary", exact: true })).toBeVisible();
  await expect(frame.getByText("Bonjour", { exact: true })).toBeVisible();
});

test("HTML previewer blocks script execution", async ({ page }) => {
  let executed = false;
  await page.exposeFunction("markExecuted", () => {
    executed = true;
  });

  await page.goto(baseUrl + "/en/tools/development/html-preview", { waitUntil: "networkidle" });
  await page.getByLabel("Your HTML").fill("<script>parent.markExecuted()</script><p>Safe</p>");

  const frame = page.frameLocator("iframe[title='Preview']");
  await expect(frame.getByText("Safe", { exact: true })).toBeVisible();
  expect(executed).toBe(false);
});
