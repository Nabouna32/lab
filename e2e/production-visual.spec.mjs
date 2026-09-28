import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "https://loculary.vercel.app";

const screenshots = [
  ["homepage-desktop", "/fr", { width: 1440, height: 1000 }],
  ["tools-tablet", "/fr/outils", { width: 1024, height: 900 }],
  ["percentage-mobile", "/fr/outils/calculs/pourcentage", { width: 390, height: 844 }],
];

for (const [name, route, viewport] of screenshots) {
  test(`production screenshot: ${name}`, async ({ page }, testInfo) => {
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.setViewportSize(viewport);
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
    });

    expect(response?.ok(), `Expected ${route} to return a successful response.`).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
    });

    expect(consoleErrors, `Console errors on ${route}`).toEqual([]);
  });
}
