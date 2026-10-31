import { createRequire } from "node:module";
import { test, expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const locales = [
  { locale: "fr", path: "/fr/design-lab" },
  { locale: "en", path: "/en/design-lab" },
];
const viewports = [320, 390, 768, 1440, 1920];
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function runAxe(page, label) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async (tags) => {
    const report = await window.axe.run(document, {
      runOnly: { type: "tag", values: tags },
    });
    return {
      violations: report.violations.map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
      incomplete: report.incomplete.map(({ id, help, nodes }) => ({
        id,
        help,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
    };
  }, wcagTags);
  console.log("axe-core " + label + " : " + JSON.stringify(result));
  expect(result.violations, "Violations WCAG " + label).toEqual([]);
}

async function interactiveMetrics(page) {
  return page.locator('section[aria-labelledby="actions-title"] button, footer a, a[data-material-button-link="true"]')
    .evaluateAll((elements) => {
      function parseColor(value) {
        const rgb = value.match(/rgba?\(([^)]+)\)/i);
        if (rgb) {
          const values = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
          return { r: values[0], g: values[1], b: values[2], a: values[3] ?? 1 };
        }
        const srgb = value.match(/color\(srgb\s+([^)]+)\)/i);
        if (srgb) {
          const values = srgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
          return { r: values[0] * 255, g: values[1] * 255, b: values[2] * 255, a: values[3] ?? 1 };
        }
        const oklab = value.match(/oklab\(([^)]+)\)/i);
        if (oklab) {
          const values = oklab[1].split(/[,\s/]+/).filter(Boolean).map(Number);
          const [L, a, b] = values;
          const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
          const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
          const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
          const encode = (channel) => {
            const value = channel <= 0.0031308 ? 12.92 * channel : 1.055 * Math.sign(channel) * Math.abs(channel) ** (1 / 2.4) - 0.055;
            return Math.max(0, Math.min(255, value * 255));
          };
          return {
            r: encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            g: encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            b: encode(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
            a: values[3] ?? 1,
          };
        }
        return null;
      }
      function composite(foreground, background) {
        const alpha = foreground.a;
        return {
          r: foreground.r * alpha + background.r * (1 - alpha),
          g: foreground.g * alpha + background.g * (1 - alpha),
          b: foreground.b * alpha + background.b * (1 - alpha),
          a: 1,
        };
      }
      function luminance(color) {
        const channel = (value) => {
          const normalized = value / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
      }
      function contrast(first, second) {
        const light = Math.max(luminance(first), luminance(second));
        const dark = Math.min(luminance(first), luminance(second));
        return Number(((light + 0.05) / (dark + 0.05)).toFixed(2));
      }
      function effectiveBackground(element) {
        let background = { r: 255, g: 255, b: 255, a: 1 };
        const ancestors = [];
        for (let node = element; node; node = node.parentElement) ancestors.push(node);
        for (const node of ancestors.reverse()) {
          const color = parseColor(getComputedStyle(node).backgroundColor);
          if (color && color.a > 0) background = color.a < 1 ? composite(color, background) : color;
        }
        return background;
      }
      return elements
        .filter((element) => element.getClientRects().length && !element.disabled && element.innerText.trim() && element.getAttribute("data-testid") !== "header-search-trigger" && element.getAttribute("data-testid") !== "long-label-button")
        .map((element) => {
          const style = getComputedStyle(element);
          const background = effectiveBackground(element);
          const foreground = parseColor(style.color);
          const border = parseColor(style.borderTopColor);
          const borderVisible = border && border.a >= 0.5 && Number.parseFloat(style.borderTopWidth) > 0;
          const isText = /Texte|Text$/.test(element.innerText.trim());
          return {
            label: element.innerText.trim(),
            kind: element.tagName.toLowerCase(),
            minWidth: style.minWidth,
            minHeight: style.minHeight,
            paddingInlineStart: style.paddingInlineStart,
            paddingInlineEnd: style.paddingInlineEnd,
            paddingBlockStart: style.paddingBlockStart,
            paddingBlockEnd: style.paddingBlockEnd,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            fontWeight: style.fontWeight,
            gap: style.gap,
            borderRadius: style.borderRadius,
            textContrast: contrast(foreground.a < 1 ? composite(foreground, background) : foreground, background),
            borderContrast: borderVisible ? contrast(border.a < 1 ? composite(border, background) : border, background) : null,
          };
        });
    });
}

for (const entry of locales) {
  test.describe("Loculary " + entry.locale, () => {
    test("reflow sans débordement et libellé mobile accessible", async ({ page }) => {
      await page.goto(entry.path);
      for (const width of viewports) {
        await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
        const metrics = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
        }));
        expect(metrics.lang).toMatch(new RegExp("^" + entry.locale));
        expect(metrics.scrollWidth, "Débordement à " + width + "px").toBeLessThanOrEqual(metrics.clientWidth + 1);
        expect(metrics.bodyWidth, "Débordement du body à " + width + "px").toBeLessThanOrEqual(metrics.clientWidth + 1);
      }
      await page.setViewportSize({ width: 320, height: 800 });
      const longButton = page.getByTestId("long-label-button");
      await expect(longButton).toBeVisible();
      const label = await longButton.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const rect = element.getBoundingClientRect();
        return {
          whiteSpace: getComputedStyle(element).whiteSpace,
          lines: range.getClientRects().length,
          right: rect.right,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        };
      });
      expect(label.lines).toBeGreaterThanOrEqual(2);
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
      expect(label.right).toBeLessThanOrEqual(321);
    });

    for (const colorScheme of ["light", "dark"]) {
      test("accessibilité WCAG, contraste et géométrie Button (" + colorScheme + ")", async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(entry.path);
        await runAxe(page, entry.locale + " " + colorScheme);
        const results = await interactiveMetrics(page);
        const buttons = results.filter((result) => result.kind === "button");
        const links = results.filter((result) => result.kind === "a");
        expect(buttons.length).toBeGreaterThanOrEqual(6);
        expect(links.length).toBeGreaterThan(0);
        const contrastFailures = results.filter((result) =>
          result.textContrast < 4.5 ||
          (result.borderContrast !== null && result.borderContrast < 3)
        );
        const geometryFailures = buttons.filter((result) =>
          result.minWidth !== "58px" ||
          result.minHeight !== "40px" ||
          result.paddingInlineStart !== (/Texte|Text$/.test(result.label) ? "12px" : "24px") ||
          result.paddingInlineEnd !== (/Texte|Text$/.test(result.label) ? "12px" : "24px") ||
          result.paddingBlockStart !== "8px" ||
          result.paddingBlockEnd !== "8px" ||
          result.fontSize !== "14px" ||
          result.lineHeight !== "20px" ||
          Math.abs(Number.parseFloat(result.letterSpacing) - 0.1) > 0.001 ||
          result.fontWeight !== "500" ||
          result.gap !== "8px" ||
          Number.parseFloat(result.borderRadius) < 9999
        );
        console.log("Boutons et liens " + entry.locale + " " + colorScheme + " : " + JSON.stringify(results));
        expect(contrastFailures, "Contraste des boutons, liens ou contours insuffisant").toEqual([]);
        expect(geometryFailures, "Géométrie Button incorrecte").toEqual([]);
      });
    }
  });
}


for (const entry of locales) {
  test("navigation compacte et menu secondaire restent utilisables (" + entry.locale + ")", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(entry.path);

    const compactLinks = page.locator('nav a[data-nav-key]:visible');
    const compactViewports = [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 600, height: 800 },
      { width: 767, height: 390 },
    ];

    for (const viewport of compactViewports) {
      await page.setViewportSize(viewport);
      await expect(compactLinks).toHaveCount(5);
      await expect(page.getByRole("navigation", { name: entry.locale === "fr" ? "Navigation principale" : "Primary navigation" })).toHaveCount(1);
      const metrics = await compactLinks.evaluateAll((links) => ({
        keys: links.map((link) => link.getAttribute("data-nav-key")),
        rects: links.map((link) => {
          const rect = link.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.keys).toEqual(["home", "tools", "favorites", "collections", "account"]);
      expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
      expect(Math.max(...metrics.rects.map((rect) => rect.width)) - Math.min(...metrics.rects.map((rect) => rect.width))).toBeLessThanOrEqual(1);
      expect(metrics.rects.every((rect) => rect.height >= 56)).toBe(true);
    }

    await page.setViewportSize({ width: 320, height: 390 });
    await page.emulateMedia({ colorScheme: "dark" });
    const moreLabel = entry.locale === "fr" ? "Plus" : "More";
    const trigger = page.getByRole("button", { name: moreLabel });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const secondary = page.locator("#mobile-secondary-navigation");
    await expect(secondary).toHaveAttribute("aria-hidden", "false");
    const primarySecondaryNavigation = secondary.getByRole("navigation").first();
    await expect(primarySecondaryNavigation.getByRole("link")).toHaveCount(1);
    await expect(primarySecondaryNavigation.getByRole("link")).toHaveAccessibleName(
      entry.locale === "fr" ? "Parcours guidés" : "Guided workflows",
    );
    await expect(secondary.locator('input[type="radio"]')).toHaveCount(3);
    await expect(secondary.getByRole("navigation").nth(1).getByRole("link")).toHaveCount(2);

    const panelRect = await secondary.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    expect(panelRect.left).toBeGreaterThanOrEqual(0);
    expect(panelRect.right).toBeLessThanOrEqual(320);
    expect(panelRect.top).toBeGreaterThanOrEqual(0);
    expect(panelRect.bottom).toBeLessThanOrEqual(326);
    expect(panelRect.height).toBeLessThanOrEqual(246);

    await page.keyboard.press("Tab");
    await expect(primarySecondaryNavigation.getByRole("link")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(secondary).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toBeFocused();

    await trigger.click();
    const darkLabel = entry.locale === "fr" ? "Sombre" : "Dark";
    await secondary.getByRole("radio", { name: darkLabel }).check({ force: true });
    await expect(secondary.getByRole("radio", { name: darkLabel })).toBeChecked();
    await expect(secondary).toHaveAttribute("aria-hidden", "false");

    const outsideControl = page.getByTestId("header-search-trigger");
    await outsideControl.click();
    await expect(secondary).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("#header-tool-search-input")).toBeFocused();
    await outsideControl.click();
    await expect(page.locator("#header-tool-search-panel")).toHaveCount(0);

    await trigger.click();
    await primarySecondaryNavigation.getByRole("link", {
      name: entry.locale === "fr" ? "Parcours guidés" : "Guided workflows",
    }).click();
    await expect(page).toHaveURL(new RegExp(entry.locale === "fr" ? "/fr/parcours-guides" : "/en/guided-workflows"));
    await expect(secondary).toHaveAttribute("aria-hidden", "true");

    await trigger.click();
    await expect(primarySecondaryNavigation.getByRole("link")).toHaveAttribute("aria-current", "page");
    const languageNavigation = secondary.getByRole("navigation").nth(1);
    const alternateLanguage = entry.locale === "fr" ? "English" : "Français";
    await languageNavigation.getByRole("link", { name: alternateLanguage }).click();
    await expect(page).toHaveURL(new RegExp(entry.locale === "fr" ? "/en/guided-workflows" : "/fr/parcours-guides"));
    await expect(secondary).toHaveAttribute("aria-hidden", "true");
  });
}

test("navigation adaptative conserve les six destinations et les préférences sur le rail", async ({ page }) => {
  await page.goto("/fr/design-lab");
  const desktopViewports = [
    { width: 768, height: 390 },
    { width: 844, height: 390 },
    { width: 1024, height: 600 },
    { width: 1200, height: 480 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of desktopViewports) {
    await page.setViewportSize(viewport);
    const desktopLinks = page.locator("aside nav a[data-nav-key]:visible");
    await expect(desktopLinks).toHaveCount(6);
    await expect(page.locator('nav[aria-label="Langue"]:visible')).toBeVisible();
    await expect(page.locator('input[name="loculary-theme-desktop"]')).toHaveCount(3);
    await expect(page.getByRole("button", { name: "Plus" })).toHaveCount(0);
    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      navOverflow: getComputedStyle(document.querySelector("aside nav")).overflowY,
    }));
    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(metrics.navOverflow).toBe("auto");
  }

  await page.setViewportSize({ width: 768, height: 390 });
  await page.locator('aside a[data-nav-key="account"]').scrollIntoViewIfNeeded();
  await expect(page.locator('aside a[data-nav-key="account"]')).toBeVisible();
  await expect(page.locator('input[name="loculary-theme-desktop"][value="system"]')).toBeChecked();

  await page.locator('nav[aria-label="Langue"]:visible').getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/design-lab/);
});
test("focus clavier visible et réduction des animations", async ({ page }) => {
  await page.goto("/fr/design-lab");
  await page.evaluate(() => {
    document.activeElement?.blur();
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
  });
  const longButton = page.getByTestId("header-search-trigger");
  let focused = false;
  for (let index = 0; index < 50; index += 1) {
    await page.keyboard.press("Tab");
    focused = await longButton.evaluate((element) => element.matches(":focus-visible"));
    if (focused) break;
  }
  expect(focused, "Le bouton long doit être atteignable avec un focus clavier visible").toBe(true);
  const focusStyle = await longButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });
  expect(
    (focusStyle.outlineStyle !== "none" && focusStyle.outlineWidth !== "0px") || focusStyle.boxShadow !== "none",
    "Le focus clavier doit avoir un indicateur visuel",
  ).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const transition = await longButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      property: style.transitionProperty,
      durations: style.transitionDuration.split(",").map((value) => {
        const item = value.trim();
        const amount = Number.parseFloat(item);
        return item.endsWith("ms") ? amount / 1000 : amount;
      }),
    };
  });
  expect(
    transition.property === "none" || transition.durations.every((value) => Number.isFinite(value) && value <= 0.001),
    "Aucune transition ne doit subsister avec prefers-reduced-motion",
  ).toBe(true);
});

test("recherche mobile : navigation clavier des suggestions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fr/design-lab");
  await page.getByTestId("header-search-trigger").click();
  const input = page.locator("#header-tool-search-input");
  await expect(input).toBeVisible();
  await input.fill("âge");
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await expect(input).toHaveAttribute("aria-controls", "header-tool-search-results");
  const listbox = page.locator("#header-tool-search-results");
  await expect(listbox).toHaveAttribute("role", "listbox");
  await expect(listbox).toHaveAttribute("aria-busy", "true");
  await expect(listbox.getByRole("option").first()).toBeVisible();
  await expect(listbox).toHaveAttribute("aria-busy", "false");
  await page.keyboard.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", "header-tool-search-result-0");
  await expect(page.locator("#header-tool-search-result-0")).toHaveAttribute("role", "option");
  await page.keyboard.press("Escape");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).not.toHaveAttribute("aria-controls");
  await page.keyboard.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await expect(input).toHaveAttribute("aria-controls", "header-tool-search-results");
  await expect(input).toHaveAttribute("aria-activedescendant", "header-tool-search-result-0");
});


for (const entry of locales) {
  test("FilterChip et InputChip : sélection, retrait, clavier et désactivation (" + entry.locale + ")", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(entry.path);

    const specimens = page.getByTestId("chip-specimens");
    const filter = specimens.getByRole("button", { name: entry.locale === "fr" ? "Filtre actif" : "Active filter" });
    await expect(filter).toHaveAttribute("aria-pressed", "false");
    await filter.focus();
    await page.keyboard.press("Enter");
    await expect(filter).toHaveAttribute("aria-pressed", "true");

    const inputLabel = entry.locale === "fr" ? "Cuisine" : "Cooking";
    const dismissLabel = entry.locale === "fr" ? "Retirer Cuisine" : "Remove Cooking";
    const inputChip = page.getByTestId("input-chip");
    const chipButton = inputChip.getByRole("button", { name: inputLabel });
    const dismissButton = inputChip.getByRole("button", { name: dismissLabel });
    await expect(chipButton).toHaveAttribute("aria-pressed", "true");
    await expect(dismissButton).toBeVisible();
    await expect(dismissButton).toHaveAccessibleName(dismissLabel);

    await dismissButton.focus();
    await expect(dismissButton).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(inputChip).toHaveCount(0);
    await expect(filter).toHaveAttribute("aria-pressed", "true");

    const disabledChip = page.getByTestId("disabled-input-chip");
    const disabledLabel = entry.locale === "fr" ? "Désactivé" : "Disabled";
    const disabledDismissLabel = entry.locale === "fr" ? "Retirer Désactivé" : "Remove Disabled";
    const disabledChipButton = disabledChip.getByRole("button", { name: disabledLabel });
    const disabledDismissButton = disabledChip.getByRole("button", { name: disabledDismissLabel });
    await expect(disabledChipButton).toBeDisabled();
    await expect(disabledDismissButton).toBeDisabled();
    await disabledDismissButton.evaluate((element) => element.click());
    await expect(disabledChip).toBeVisible();

    await runAxe(page, entry.locale + " Design Lab Chips");
  });
}
