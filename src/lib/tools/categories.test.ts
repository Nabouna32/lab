import assert from "node:assert/strict";
import { createElement, isValidElement } from "react";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Alignment } from "../../components/layout/compose/Alignment.ts";
import { Arrangement } from "../../components/layout/compose/Arrangement.ts";
import { Modifier } from "../../components/layout/compose/Modifier.ts";
import { categoryColorIds, getCategoryColor, getCategoryContainerColor, getCategoryOnContainerColor } from "./category-colors.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const pageLayoutSource = readFileSync(new URL("../../components/layout/PageLayout.tsx", import.meta.url), "utf8");
const columnSource = readFileSync(new URL("../../components/layout/compose/Column.tsx", import.meta.url), "utf8");
const rowSource = readFileSync(new URL("../../components/layout/compose/Row.tsx", import.meta.url), "utf8");
const arrangementSource = readFileSync(new URL("../../components/layout/compose/Arrangement.ts", import.meta.url), "utf8");
const informationPageSource = readFileSync(new URL("../../components/information/InformationPage.tsx", import.meta.url), "utf8");
const adminPageSource = readFileSync(new URL("../../app/[locale]/admin/page.tsx", import.meta.url), "utf8");
const adminUsersPageSource = readFileSync(new URL("../../app/[locale]/admin/utilisateurs/page.tsx", import.meta.url), "utf8");
const categoryRouteSource = readFileSync(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url), "utf8");
const accountPageSource = readFileSync(new URL("../../app/[locale]/compte/page.tsx", import.meta.url), "utf8");
const adminAuditPageSource = readFileSync(new URL("../../app/[locale]/admin/audit/page.tsx", import.meta.url), "utf8");
const legalNoticePageSource = readFileSync(new URL("../../components/legal/LegalNoticePage.tsx", import.meta.url), "utf8");
const collectionsViewSource = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
const sharedCollectionViewSource = readFileSync(new URL("../../components/collections/SharedCollectionView.tsx", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../../components/layout/Header.tsx", import.meta.url), "utf8");
const footerSource = readFileSync(new URL("../../components/layout/Footer.tsx", import.meta.url), "utf8");
const rainbowSource = readFileSync(new URL("../design-system/rainbow-tones.ts", import.meta.url), "utf8");
const rainbowPaletteSource = readFileSync(new URL("../design-system/rainbow-palette.ts", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonVariantStyles = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");
const toolPageSource = readFileSync(new URL("../../components/tools/ToolPage/ToolPage.tsx", import.meta.url), "utf8");

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
  assert.ok(pageLayoutSource.includes('"form" | "form-wide" | "account" | "narrow"'));
  assert.ok(pageLayoutSource.includes('form: "max-w-[var(--layout-content-form)]"'));
  assert.ok(pageLayoutSource.includes('"form-wide": "max-w-[var(--layout-content-form-wide)]"'));
  assert.ok(globalCss.includes("--layout-content-form: 28rem"));
  assert.ok(globalCss.includes("--layout-content-form-wide: 36rem"));
  assert.ok(pageLayoutSource.includes('account: "max-w-[var(--layout-content-account)]"'));
  assert.ok(globalCss.includes("--layout-content-account: 42rem"));
});

test("admin and category pages share the canonical page container and spacing tokens", () => {
  for (const source of [adminPageSource, adminUsersPageSource]) {
    assert.ok(source.includes("<PageContainer width=\"default\" spacing=\"none\""));
    assert.ok(source.includes("py-[var(--space-8)] sm:py-[var(--space-10)]"));
  }
  assert.ok(categoryRouteSource.includes("<PageContainer width=\"wide\" spacing=\"none\""));
  assert.ok(categoryRouteSource.includes("py-[var(--space-8)] sm:py-[var(--space-10)]"));
});

test("shared page shells use PageContainer without forcing every context to the same width", () => {
  assert.ok(accountPageSource.includes('<PageContainer width="account" spacing="none"'));
  assert.ok(accountPageSource.includes('<PageContainer width="narrow" spacing="none"'));
  assert.ok(collectionsViewSource.includes('<PageContainer width="medium" spacing="none"'));
  assert.ok(sharedCollectionViewSource.includes('<PageContainer width="medium" spacing="none"'));
  assert.ok(headerSource.includes('<PageContainer width="wide" spacing="none">'));
  assert.ok(footerSource.includes('<PageContainer width="wide" spacing="none"'));
  assert.ok(adminAuditPageSource.includes('<PageContainer width="default" spacing="none"'));
  assert.ok(legalNoticePageSource.includes('<PageContainer width="narrow" spacing="none"'));
});

test("Arrangement.spacedBy returns a validated explicit Web gap", () => {
  assert.deepEqual(Arrangement.spacedBy(24), { kind: "spacedBy", space: 24 });
  assert.deepEqual(Arrangement.spacedBy(-8), { kind: "spacedBy", space: -8 });
  assert.throws(() => Arrangement.spacedBy(Number.NaN), RangeError);
  assert.ok(rowSource.includes("compose-layout-negative-gap-row"));
  assert.ok(columnSource.includes("compose-layout-negative-gap-column"));
  assert.ok(globalCss.includes(".compose-layout-negative-gap-row > * + *"));
  assert.ok(globalCss.includes(".compose-layout-negative-gap-column > * + *"));
  assert.deepEqual(Arrangement.spacedByCss("var(--layout-content-gap)"), {
    kind: "spacedByCss",
    space: "var(--layout-content-gap)",
  });
  assert.throws(() => Arrangement.spacedByCss("  "), TypeError);
});

function getModifierElementProps(node: unknown): { style?: Record<string, unknown>; children?: unknown } {
  assert.ok(isValidElement(node));
  return node.props as { style?: Record<string, unknown>; children?: unknown };
}

test("Modifier keeps operations as ordered wrappers instead of flattening their styles", () => {
  const wrapped = Modifier.padding(8).then(Modifier.fillMaxWidth()).wrap(createElement("span"));
  const outer = getModifierElementProps(wrapped);
  const inner = getModifierElementProps(outer.children);

  assert.deepEqual(outer.style, {
    paddingInlineStart: "8px",
    paddingBlockStart: "8px",
    paddingInlineEnd: "8px",
    paddingBlockEnd: "8px",
  });
  assert.deepEqual(inner.style, { width: "100%" });
  assert.equal(getModifierElementProps(inner.children).children, undefined);
});

test("Modifier exposes the common size and constraint operations needed by layout primitives", () => {
  assert.deepEqual(getModifierElementProps(Modifier.width(240).wrap(createElement("span"))).style, { width: "240px" });
  assert.deepEqual(getModifierElementProps(Modifier.height(48).wrap(createElement("span"))).style, { height: "48px" });
  assert.deepEqual(getModifierElementProps(Modifier.size(32, 16).wrap(createElement("span"))).style, {
    width: "32px",
    height: "16px",
  });
  assert.deepEqual(getModifierElementProps(Modifier.fillMaxSize(0.5).wrap(createElement("span"))).style, {
    width: "50%",
    height: "50%",
  });
  assert.deepEqual(getModifierElementProps(Modifier.widthIn({ minWidth: 200, maxWidth: 400 }).wrap(createElement("span"))).style, {
    minWidth: "200px",
    maxWidth: "400px",
  });
  assert.deepEqual(getModifierElementProps(Modifier.heightIn({ minHeight: 40 }).wrap(createElement("span"))).style, {
    minHeight: "40px",
  });
  assert.deepEqual(getModifierElementProps(Modifier.sizeIn({ minWidth: 100, maxHeight: 300 }).wrap(createElement("span"))).style, {
    minWidth: "100px",
    maxHeight: "300px",
  });
  assert.deepEqual(getModifierElementProps(Modifier.weight(2).wrap(createElement("span"))).style, {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: "0%",
  });
  assert.deepEqual(Modifier.align(Alignment.BottomEnd).boxScopeOptions(), {
    alignment: Alignment.BottomEnd,
    matchParentSize: false,
  });
  assert.deepEqual(Modifier.matchParentSize().boxScopeOptions(), {
    alignment: undefined,
    matchParentSize: true,
  });
  assert.deepEqual(Modifier.align(Alignment.Center).matchParentSize().withoutBoxScopeOperations().boxScopeOptions(), {
    alignment: undefined,
    matchParentSize: false,
  });
});

test("Modifier validates dimensions, fractions, weights and contradictory constraints", () => {
  assert.throws(() => Modifier.padding(-1), RangeError);
  assert.throws(() => Modifier.width(-1), RangeError);
  assert.throws(() => Modifier.fillMaxWidth(1.1), RangeError);
  assert.throws(() => Modifier.weight(0), RangeError);
  assert.throws(() => Modifier.widthIn({ minWidth: 300, maxWidth: 200 }), RangeError);
  assert.throws(() => Modifier.heightIn({ minHeight: 100, maxHeight: 50 }), RangeError);
});

test("Arrangement exposes the AndroidX alignment overloads for spacedBy and aligned", () => {
  assert.deepEqual(Arrangement.spacedBy(8, Alignment.End), {
    kind: "spacedBy",
    space: 8,
    alignment: Alignment.End,
  });
  assert.deepEqual(Arrangement.spacedBy(12, Alignment.CenterVertically), {
    kind: "spacedBy",
    space: 12,
    alignment: Alignment.CenterVertically,
  });
  assert.deepEqual(Arrangement.aligned(Alignment.CenterHorizontally), {
    kind: "aligned",
    alignment: Alignment.CenterHorizontally,
  });
  assert.deepEqual(Arrangement.aligned(Alignment.Bottom), {
    kind: "aligned",
    alignment: Alignment.Bottom,
  });
});


test("Row and Column apply the selected Arrangement alignment on the main axis", () => {
  assert.ok(rowSource.includes('horizontalArrangement.kind === "aligned"'));
  assert.ok(rowSource.includes('centerHorizontally: "center"'));
  assert.ok(rowSource.includes('horizontalArrangement.alignment'));
  assert.ok(columnSource.includes('verticalArrangement.kind === "aligned"'));
  assert.ok(columnSource.includes('centerVertically: "center"'));
  assert.ok(columnSource.includes('verticalArrangement.alignment'));
});


test("Box applies child-scoped alignment and matchParentSize modifiers", () => {
  const boxSource = readFileSync(new URL("../../components/layout/compose/Box.tsx", import.meta.url), "utf8");
  assert.ok(boxSource.includes("childProps.modifier.boxScopeOptions()"));
  assert.ok(boxSource.includes("childProps.modifier.withoutBoxScopeOperations()"));
  assert.ok(boxSource.includes('position: "absolute", inset: 0, display: "grid"'));
});


test("ToolPage uses the shared Column primitive for editorial content spacing", () => {
  assert.ok(toolPageSource.includes('import { Column } from "@/components/layout/compose/Column"'));
  assert.ok(toolPageSource.includes('Arrangement.spacedByCss("var(--tool-page-content-gap)")'));
  assert.ok(toolPageSource.includes('className="tool-page-editorial-stack"'));
  assert.ok(!toolPageSource.includes("space-y-8 sm:space-y-10"));
  assert.ok(globalCss.includes(".tool-page-editorial-stack"));
  assert.ok(globalCss.includes("--tool-page-content-gap: var(--space-8)"));
  assert.ok(globalCss.includes("--tool-page-content-gap: var(--space-10)"));
});
