import { expect, test } from "@playwright/test";

const routes = [
  { name: "homepage-fr", path: "/fr" },
  { name: "ipv4-subnet-tool", path: "/fr/outils/calculateur-de-sous-reseau-ipv4" },
  { name: "image-metadata-tool", path: "/fr/outils/analyseur-de-metadonnees-image" },
] as const;

for (const route of routes) {
  test(`visual observation: ${route.name}`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await expect(page.locator("h1").first()).toBeVisible();

    // Let layout settle without relying on arbitrary sleeps.
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      language: document.documentElement.lang,
      colorScheme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      headings: Array.from(document.querySelectorAll("h1, h2, h3"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((element) => ({
          level: element.tagName,
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 120),
        })),
      visibleActions: Array.from(document.querySelectorAll("a, button, input, select, textarea"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        }).length,
    }));

    await testInfo.attach(`${route.name}-layout-report`, {
      body: JSON.stringify({ project: testInfo.project.name, ...metrics }, null, 2),
      contentType: "application/json",
    });

    // Capture the first viewport and the complete page as distinct artifacts.
    await testInfo.attach(`${route.name}-first-viewport`, {
      body: await page.screenshot({ fullPage: false, animations: "disabled", scale: "css" }),
      contentType: "image/png",
    });
    await testInfo.attach(`${route.name}-full-page`, {
      body: await page.screenshot({ fullPage: true, animations: "disabled", scale: "css" }),
      contentType: "image/png",
    });

    expect(
      metrics.horizontalOverflow,
      `Unexpected horizontal overflow at ${metrics.viewport.width}px on ${route.path}`,
    ).toBe(false);
  });
}
