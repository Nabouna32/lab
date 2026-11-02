import { test, expect } from "@playwright/test";

const locales = [
  {
    locale: "fr",
    processingLabel: "Informations sur le traitement",
    localLabel: "Traitement local",
  },
  {
    locale: "en",
    processingLabel: "Processing information",
    localLabel: "Local processing",
  },
];

const tools = [
  {
    id: "percentage",
    paths: {
      fr: "/fr/outils/calculateur-de-pourcentage",
      en: "/en/tools/percentage-calculator",
    },
  },
  {
    id: "expense-splitter",
    paths: {
      fr: "/fr/outils/repartiteur-de-depenses-de-groupe",
      en: "/en/tools/group-expense-splitter",
    },
  },
  {
    id: "json-formatter",
    paths: {
      fr: "/fr/outils/formateur-json",
      en: "/en/tools/json-formatter",
    },
  },
  {
    id: "image-compressor",
    paths: {
      fr: "/fr/outils/compresseur-d-image",
      en: "/en/tools/image-compressor",
    },
  },
  {
    id: "qr-code-generator",
    paths: {
      fr: "/fr/outils/generateur-de-qr-code",
      en: "/en/tools/qr-code-generator",
    },
  },
];

const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
];

for (const locale of locales) {
  for (const tool of tools) {
    test(`page ${tool.id} — ${locale.locale}: structure et reflow`, async ({ page }, testInfo) => {
      await page.goto(tool.paths[locale.locale]);

      const header = page.locator("main header");
      const title = header.getByRole("heading", { level: 1 });
      const processingInfo = page.getByRole("button", { name: locale.processingLabel });
      const workspace = page.locator('main > div > section[aria-labelledby="tool-page-title"]');

      await expect(header).toHaveCount(1);
      await expect(title).toBeVisible();
      await expect(title).not.toBeEmpty();
      await expect(workspace).toHaveCount(1);
      await expect(workspace).toBeVisible();
      await expect(page.getByRole("region", { name: await title.innerText() })).toBeVisible();
      await expect(header.getByText(locale.localLabel, { exact: true })).toBeVisible();
      await expect(processingInfo).toBeVisible();

      for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme });

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await expect(title).toBeVisible();
          await expect(processingInfo).toBeVisible();

          const dimensions = await page.evaluate(() => ({
            viewport: document.documentElement.clientWidth,
            document: document.documentElement.scrollWidth,
            body: document.body.scrollWidth,
          }));

          expect(
            dimensions.document,
            `Débordement horizontal du document à ${viewport.width}px (${colorScheme})`,
          ).toBeLessThanOrEqual(dimensions.viewport + 1);
          expect(
            dimensions.body,
            `Débordement horizontal du body à ${viewport.width}px (${colorScheme})`,
          ).toBeLessThanOrEqual(dimensions.viewport + 1);

          if (viewport.width === 390 || viewport.width === 1440) {
            await testInfo.attach(`${tool.id}-${locale.locale}-${colorScheme}-${viewport.width}px`, {
              body: await page.screenshot(),
              contentType: "image/png",
            });
          }
        }
      }
    });

    test(`page ${tool.id} — ${locale.locale}: RichTooltip clavier et activation explicite`, async ({ page }) => {
      await page.goto(tool.paths[locale.locale]);

      const trigger = page.getByRole("button", { name: locale.processingLabel });
      const tooltip = page.getByRole("tooltip");

      await trigger.focus();
      await expect(tooltip).toBeVisible();

      const tooltipId = await tooltip.getAttribute("id");
      const describedBy = await trigger.getAttribute("aria-describedby");
      expect(tooltipId).toBeTruthy();
      expect(describedBy).toContain(tooltipId);

      // RichTooltip content can contain block-level details: keep valid HTML.
      await expect(tooltip.locator("span > div")).toHaveCount(0);

      await page.keyboard.press("Escape");
      await expect(tooltip).toHaveCount(0);
      await expect(trigger).toBeFocused();

      await trigger.click();
      await expect(tooltip).toBeVisible();

      await trigger.click();
      await expect(tooltip).toHaveCount(0);
      await expect(trigger).toBeFocused();

      await trigger.click();
      await expect(tooltip).toBeVisible();

      await page.locator("main header h1").click();
      await expect(tooltip).toHaveCount(0);
    });

    test(`page ${tool.id} — ${locale.locale}: RichTooltip tactile, second tap et persistance`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({
        baseURL: "http://127.0.0.1:4173",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        locale: locale.locale === "fr" ? "fr-FR" : "en-US",
        colorScheme: "light",
      });

      try {
        const page = await context.newPage();
        await page.goto(tool.paths[locale.locale]);

        const trigger = page.getByRole("button", { name: locale.processingLabel });
        const tooltip = page.getByRole("tooltip");

        await trigger.tap();
        await expect(tooltip).toBeVisible();
        await expect(trigger).toBeFocused();

        if (tool.id === "percentage") {
          await testInfo.attach(`tooltip-${locale.locale}-mobile-open`, {
            body: await page.screenshot(),
            contentType: "image/png",
          });
        }

        await tooltip.tap();
        await expect(tooltip).toBeVisible();

        await trigger.tap();
        await expect(tooltip).toHaveCount(0);
        if (tool.id === "percentage" && locale.locale === "fr") {
          await page.waitForTimeout(600);
          await expect(tooltip).toHaveCount(0);
        }

        await trigger.tap();
        await expect(tooltip).toBeVisible();

        await page.locator("main header h1").tap();
        await expect(tooltip).toHaveCount(0);
      } finally {
        await context.close();
      }
    });
  }
}
