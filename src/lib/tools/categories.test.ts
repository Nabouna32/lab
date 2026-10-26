import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Arrangement } from "../../components/layout/compose/Arrangement.ts";
import { Modifier } from "../../components/layout/compose/Modifier.ts";
import { categoryColorIds, getCategoryColor, getCategoryContainerColor, getCategoryOnContainerColor } from "./category-colors.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const pageLayoutSource = readFileSync(new URL("../../components/layout/PageLayout.tsx", import.meta.url), "utf8");
const columnSource = readFileSync(new URL("../../components/layout/compose/Column.tsx", import.meta.url), "utf8");
const arrangementSource = readFileSync(new URL("../../components/layout/compose/Arrangement.ts", import.meta.url), "utf8");
const informationPageSource = readFileSync(new URL("../../components/information/InformationPage.tsx", import.meta.url), "utf8");
const adminPageSource = readFileSync(new URL("../../app/[locale]/admin/page.tsx", import.meta.url), "utf8");
const adminUsersPageSource = readFileSync(new URL("../../app/[locale]/admin/utilisateurs/page.tsx", import.meta.url), "utf8");
const categoryRouteSource = readFileSync(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url), "utf8");
const rainbowSource = readFileSync(new URL("../design-system/rainbow-tones.ts", import.meta.url), "utf8");
const rainbowPaletteSource = readFileSync(new URL("../design-system/rainbow-palette.ts", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonVariantStyles = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");

test("semantic theme tokens use the accepted blue M3 Fidelity seed", () => {
  assert.ok(rainbowSource.includes('const BRAND_SEED = "#4285F4"'));
  assert.ok(rainbowSource.includes("new SchemeFidelity(source, false"));
  assert.ok(rainbowSource.includes("new SchemeFidelity(source, true"));
  assert.ok(globalCss.includes("--primary: var(--m3-light-primary"));
  assert.ok(globalCss.includes("--primary: var(--m3-dark-primary"));
  assert.ok(rainbowSource.includes('error: "error"'));
  assert.ok(rainbowSource.includes('"on-error": "onError"'));
  assert.ok(globalCss.includes("--error: var(--m3-light-error"));
  assert.ok(globalCss.includes("--error: var(--m3-dark-error"));
  assert.ok(!globalCss.toLowerCase().includes("#6750a4"), "the old purple seed must not remain in production CSS");
});

test("FilledTonalButton uses Material 3 secondary container roles without a Loculary alias", () => {
  assert.ok(buttonVariantStyles.includes("const filledTonal = ["));
  assert.ok(buttonVariantStyles.includes('"filled-tonal": filledTonal,'), "the shared Material 3 variants map FilledTonalButton to its implementation");
  assert.ok(buttonVariantStyles.includes("bg-[var(--button-container-color,var(--secondary-container))] text-[color:var(--button-content-color,var(--on-secondary-container))]"));
  assert.ok(buttonSource.includes('variant="filled-tonal"'));
  assert.ok(buttonSource.includes("export function FilledTonalButton("));
  assert.ok(!buttonSource.includes("tonal: filledTonal"), "the legacy tonal alias must not remain in the shared API");
});

test("every category is wired to generated official MCU Rainbow colors for both themes", () => {
  assert.ok(rainbowSource.includes("new SchemeRainbow(seed, isDark"));
  assert.ok(rainbowPaletteSource.includes("Hct.from(hue, 72, 50)"));

  for (const categoryId of categoryColorIds) {
    const token = `--category-${categoryId}`;
    assert.ok(rainbowPaletteSource.includes(`${categoryId}:`), `${categoryId} should have one shared hue anchor`);
    assert.ok(globalCss.includes(`${token}: var(--m3-light-category-${categoryId}`), `${token} should use generated light-theme color`);
    assert.ok(globalCss.includes(`${token}: var(--m3-dark-category-${categoryId}`), `${token} should use generated dark-theme color`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-light-category-${categoryId}-container`), `${token} should have a generated light container`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-dark-category-${categoryId}-container`), `${token} should have a generated dark container`);
    assert.equal(getCategoryColor(categoryId), `var(${token})`);
    assert.equal(getCategoryContainerColor(categoryId), `var(${token}-container)`);
    assert.ok(globalCss.includes(`${token}-on-container: var(--m3-light-category-${categoryId}-on-container`), `${token} should have a generated light foreground`);
    assert.ok(globalCss.includes(`${token}-on-container: var(--m3-dark-category-${categoryId}-on-container`), `${token} should have a generated dark foreground`);
    assert.equal(getCategoryOnContainerColor(categoryId), `var(${token}-on-container)`);
  }

  assert.ok(!globalCss.includes("#d32f2f"), "the old direct Rainbow palette must not remain in production CSS");
  assert.ok(!globalCss.includes("#fb8c00"), "the old direct Rainbow palette must not remain in production CSS");
});

test("semantic status colors stay independent from generated category colors", () => {
  for (const statusToken of ["--success", "--warning", "--info"]) {
    assert.match(globalCss, new RegExp(`^\\s*${statusToken}:\\s*#[0-9a-f]{6};`, "m"));
  }
  assert.match(globalCss, new RegExp("^\\s*--error:\\s*var\\(--m3-light-error,", "m"));
  assert.match(globalCss, new RegExp("^\\s*--error:\\s*var\\(--m3-dark-error,", "m"));

  for (const statusToken of ["--success", "--warning", "--error", "--info"]) {
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-light-category-`));
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-dark-category-`));
  }
});

test("unknown category IDs fall back to the shared primary tokens", () => {
  assert.equal(getCategoryColor("unknown"), "var(--accent)");
  assert.equal(getCategoryContainerColor("unknown"), "var(--accent-soft)");
  assert.equal(getCategoryOnContainerColor("unknown"), "var(--on-primary-container)");
});

test("shared layout spacing tokens define a consistent semantic scale", () => {
  for (const token of [
    "--space-0: 0",
    "--space-1: var(--m3-space-1)",
    "--space-2: var(--m3-space-2)",
    "--space-3: var(--m3-space-3)",
    "--space-4: var(--m3-space-4)",
    "--space-5: 1.25rem",
    "--space-6: var(--m3-space-6)",
    "--space-8: 2rem",
    "--space-10: 2.5rem",
    "--space-12: 3rem",
    "--space-16: 4rem",
    "--layout-page-gutter: 1rem",
    "--layout-page-section-gap: var(--space-8)",
    "--layout-content-gap: var(--space-6)",
    "--layout-item-gap: var(--space-4)",
  ]) {
    assert.ok(globalCss.includes(token), `missing shared layout token: ${token}`);
  }
});

test("AndroidX-named layout ports provide explicit spacing and product page composition stays separate", () => {
  assert.ok(pageLayoutSource.includes("Loculary-specific page composition, not an AndroidX API"));
  assert.ok(pageLayoutSource.includes("export function PageContainer"));
  assert.ok(!pageLayoutSource.includes("PageStack"), "custom PageStack must not replace AndroidX Column/Arrangement");
  assert.ok(pageLayoutSource.includes("var(--layout-page-gutter)"));
  assert.ok(pageLayoutSource.includes("var(--layout-content-narrow)"));
  assert.ok(columnSource.includes("export function Column"));
  assert.ok(columnSource.includes("verticalArrangement?: VerticalArrangement"));
  assert.ok(columnSource.includes("verticalArrangement = Arrangement.Top"));
  assert.ok(arrangementSource.includes("spacedBy(space: number)"));
  assert.ok(arrangementSource.includes("kind: " + '"spacedBy"'));
  assert.equal((informationPageSource.match(/<PageContainer width="narrow" spacing="default">/g) ?? []).length, 3);
  assert.equal(informationPageSource.split('<Column verticalArrangement={Arrangement.spacedByCss("var(--layout-content-gap)")}>').length - 1, 3);
});


test("PageContainer exposes centralized form widths for standard and wider forms", () => {
  assert.ok(pageLayoutSource.includes('"form" | "form-wide" | "narrow"'));
  assert.ok(pageLayoutSource.includes('form: "max-w-[var(--layout-content-form)]"'));
  assert.ok(pageLayoutSource.includes('"form-wide": "max-w-[var(--layout-content-form-wide)]"'));
  assert.ok(globalCss.includes("--layout-content-form: 28rem"));
  assert.ok(globalCss.includes("--layout-content-form-wide: 36rem"));
});

test("admin and category pages share the canonical page container and spacing tokens", () => {
  for (const source of [adminPageSource, adminUsersPageSource]) {
    assert.ok(source.includes("<PageContainer width=\"default\" spacing=\"none\""));
    assert.ok(source.includes("py-[var(--space-8)] sm:py-[var(--space-10)]"));
  }
  assert.ok(categoryRouteSource.includes("<PageContainer width=\"wide\" spacing=\"none\""));
  assert.ok(categoryRouteSource.includes("py-[var(--space-8)] sm:py-[var(--space-10)]"));
});

test("Arrangement.spacedBy returns a validated explicit Web gap", () => {
  assert.deepEqual(Arrangement.spacedBy(24), { kind: "spacedBy", space: 24 });
  assert.throws(() => Arrangement.spacedBy(-1), RangeError);
  assert.throws(() => Arrangement.spacedBy(Number.NaN), RangeError);
  assert.deepEqual(Arrangement.spacedByCss("var(--layout-content-gap)"), {
    kind: "spacedByCss",
    space: "var(--layout-content-gap)",
  });
  assert.throws(() => Arrangement.spacedByCss("  "), TypeError);
});

test("Modifier.widthIn composes chained constraints instead of discarding earlier bounds", () => {
  assert.deepEqual(Modifier.widthIn({ min: 200 }).then(Modifier.widthIn({ max: 400 })).toStyle(), { minWidth: "200px", maxWidth: "400px" });
  assert.deepEqual(Modifier.widthIn({ min: 200, max: 600 }).then(Modifier.widthIn({ min: 250, max: 500 })).toStyle(), { minWidth: "250px", maxWidth: "500px" });
});

test("Modifier supports Compose-shaped padding overloads and ordered composition", () => {
  assert.deepEqual(Modifier.padding(8).toStyle(), {
    paddingInlineStart: "8px",
    paddingBlockStart: "8px",
    paddingInlineEnd: "8px",
    paddingBlockEnd: "8px",
  });
  assert.deepEqual(Modifier.padding(8, 12).toStyle(), {
    paddingInlineStart: "8px",
    paddingBlockStart: "12px",
    paddingInlineEnd: "8px",
    paddingBlockEnd: "12px",
  });
  assert.deepEqual(Modifier.padding(1, 2, 3, 4).toStyle(), {
    paddingInlineStart: "1px",
    paddingBlockStart: "2px",
    paddingInlineEnd: "3px",
    paddingBlockEnd: "4px",
  });
  assert.deepEqual(Modifier.padding(8).then(Modifier.fillMaxWidth()).toStyle(), {
    width: "100%",
    paddingInlineStart: "8px",
    paddingBlockStart: "8px",
    paddingInlineEnd: "8px",
    paddingBlockEnd: "8px",
  });
  assert.deepEqual(Modifier.padding(8).then(Modifier.padding(4)).toStyle(), {
    paddingInlineStart: "12px",
    paddingBlockStart: "12px",
    paddingInlineEnd: "12px",
    paddingBlockEnd: "12px",
  });
  assert.throws(() => Modifier.padding(-1), RangeError);
  assert.throws(() => Modifier.widthIn({ min: 300, max: 200 }), RangeError);
});
