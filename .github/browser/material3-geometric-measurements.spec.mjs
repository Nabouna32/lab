import { test, expect } from "@playwright/test";

/**
 * Mesures géométriques réelles des ports Material 3 (issue #1196, lot 3/5).
 * Les valeurs attendues proviennent de la baseline AndroidX 1.4.0 épinglée
 * (docs/m3-geometric-audit-1196.md) ; toute adaptation Web documentée reste
 * un non-écart et n'est pas re-testée ici comme un écart.
 */

const locales = ["fr", "en"];
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const locale of locales) {
  for (const colorScheme of ["light", "dark"]) {
    test(`mesures DOM design-lab — ${locale} / ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(`/${locale}/design-lab`);

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(150);

        const measures = await page.evaluate(() => {
          const round = (value) => Math.round(value * 100) / 100;

          function metricsOf(element) {
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              width: round(rect.width),
              height: round(rect.height),
              minHeight: style.minHeight,
              borderRadius: style.borderRadius,
              paddingBlock: [style.paddingBlockStart, style.paddingBlockEnd],
              paddingInline: [style.paddingInlineStart, style.paddingInlineEnd],
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
            };
          }

          return {
            chip: metricsOf(document.querySelector('[data-testid="chip-specimens"] button[data-chip]')),
            navigationBar: metricsOf(document.querySelector('nav[data-navigation-bar]')),
            navigationBarItem: metricsOf(document.querySelector('nav[data-navigation-bar] a[data-nav-key]')),
          };
        });

        expect(measures.chip, "Chip présent").not.toBeNull();
        expect(measures.navigationBar, "NavigationBar présente").not.toBeNull();

        // Chip : 32 dp AndroidX 1.4.0.
        expect(measures.chip.height, "Hauteur Chip = 32px").toBe(32);

        // NavigationBar : 80 dp, item 64 dp.
        expect(measures.navigationBar.height, "Hauteur NavigationBar = 80px").toBeGreaterThanOrEqual(80);
        expect(measures.navigationBar.height, "Hauteur NavigationBar = 80px").toBeLessThan(96);
        expect(measures.navigationBarItem.height, "Item NavigationBar >= 64px").toBeGreaterThanOrEqual(64);
      }
    });
  }
}
