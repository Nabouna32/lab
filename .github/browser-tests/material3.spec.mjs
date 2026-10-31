import { createRequire } from "node:module";
import { test, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const locales = [
  { code: "fr", path: "/fr/design-lab", guided: "Parcours" },
  { code: "en", path: "/en/design-lab", guided: "Guides" },
];
const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function openLab(page, locale, colorScheme = "light") {
  await page.emulateMedia({ colorScheme });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(locale.path);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
}

async function auditA11y(page, label) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async (tags) => {
    const report = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
    return {
      violations: report.violations.map(({ id, impact, help, nodes }) => ({
        id, impact, help, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
      incomplete: report.incomplete.map(({ id, help, nodes }) => ({
        id, help, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
    };
  }, wcagTags);
  test.info().annotations.push({ type: "axe-incomplete", description: label + ": " + JSON.stringify(result.incomplete) });
  console.log(JSON.stringify({ axe: label, violations: result.violations.length, incomplete: result.incomplete }));
  expect(result.violations, "Violations axe-core WCAG 2.2 AA").toEqual([]);
}

test.describe("Responsive et langues", () => {
  for (const locale of locales) {
    for (const viewport of viewports) {
      test(locale.code + " sans débordement à " + viewport.width + "px", async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(locale.path);
        const metrics = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(metrics.lang).toMatch(new RegExp("^" + locale.code));
        expect(metrics.scroll).toBeLessThanOrEqual(metrics.client + 1);
        expect(metrics.body).toBeLessThanOrEqual(metrics.client + 1);
        if (viewport.width <= 390) {
          const link = page.locator('a[data-nav-key="guided"]:visible').first();
          await expect(link).toBeVisible();
          const label = await link.evaluate((element) => {
            const node = element.lastElementChild;
            return { text: node?.textContent?.trim(), width: node?.clientWidth ?? 0, scroll: node?.scrollWidth ?? 0, aria: element.getAttribute("aria-label") };
          });
          expect(label.text).toBe(locale.guided);
          expect(label.scroll).toBeLessThanOrEqual(label.width + 1);
          expect(label.aria).toBe(locale.guided);
        }
      });
    }
  }
});

test.describe("Accessibilité et interactions", () => {
  for (const locale of locales) {
    for (const scheme of ["light", "dark"]) {
      test(locale.code + " axe-core " + scheme, async ({ page }) => {
        await openLab(page, locale, scheme);
        await auditA11y(page, locale.code + " " + scheme);
      });
    }
    test(locale.code + " géométrie AndroidX des boutons", async ({ page }) => {
      await openLab(page, locale);
      const buttons = await page.locator('section[aria-labelledby="actions-title"] button').evaluateAll((elements) =>
        elements.filter((element) => element.getClientRects().length && !element.disabled && element.innerText.trim() && element.getAttribute("data-testid") !== "long-label-button")
          .map((element) => {
            const style = getComputedStyle(element);
            return {
              label: element.innerText.trim(), minWidth: style.minWidth, minHeight: style.minHeight,
              start: style.paddingInlineStart, end: style.paddingInlineEnd,
              top: style.paddingBlockStart, bottom: style.paddingBlockEnd,
              fontSize: style.fontSize, lineHeight: style.lineHeight, weight: style.fontWeight, gap: style.gap,
            };
          })
      );
      expect(buttons.length).toBeGreaterThanOrEqual(6);
      for (const button of buttons) {
        const textButton = /Texte|Text$/.test(button.label);
        expect(button).toMatchObject({
          minWidth: "58px", minHeight: "40px",
          start: textButton ? "12px" : "24px", end: textButton ? "12px" : "24px",
          top: "8px", bottom: "8px", fontSize: "14px", lineHeight: "20px", weight: "500", gap: "8px",
        });
      }
    });
  }

  test("le focus clavier est visible sur le bouton long", async ({ page }) => {
    await openLab(page, locales[0]);
    await page.locator("body").focus();
    const button = page.getByTestId("long-label-button");
    let found = false;
    for (let i = 0; i < 50; i += 1) {
      await page.keyboard.press("Tab");
      if (await button.evaluate((element) => element === document.activeElement)) { found = true; break; }
    }
    expect(found).toBe(true);
    const visible = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return element.matches(":focus-visible") &&
        ((style.outlineStyle !== "none" && style.outlineWidth !== "0px") || style.boxShadow !== "none");
    });
    expect(visible).toBe(true);
  });

  test("la recherche clavier ouvre, sélectionne, ferme et rouvre les suggestions", async ({ page }) => {
    await openLab(page, locales[0]);
    await page.getByTestId("header-search-trigger").click();
    const input = page.locator("#header-tool-search-input");
    await expect(input).toBeVisible();
    await input.fill("json");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const id = await input.getAttribute("aria-controls");
    const list = page.locator("#" + id);
    await expect(list).toHaveAttribute("role", "listbox");
    await expect(list.locator('[role="option"]').first()).toBeVisible();
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-activedescendant", /.+/);
    await input.press("Escape");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-expanded", "true");
  });

  test("respecte prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(locales[0].path);
    await expect.poll(() => page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
    const transition = await page.getByTestId("long-label-button").evaluate((element) => {
      const style = getComputedStyle(element);
      return { property: style.transitionProperty, durations: style.transitionDuration.split(",").map((raw) => {
        const value = raw.trim(); const amount = Number.parseFloat(value);
        return value.endsWith("ms") ? amount / 1000 : amount;
      }) };
    });
    expect(transition.property === "none" || transition.durations.every((value) => value <= 0.001)).toBe(true);
  });
});
