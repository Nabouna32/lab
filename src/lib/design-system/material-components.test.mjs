import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const checkboxSource = readFileSync(new URL("../../components/ui/Checkbox.tsx", import.meta.url), "utf8");
const switchSource = readFileSync(new URL("../../components/ui/Switch.tsx", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../../components/ui/MaterialIcon.tsx", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const passwordSource = readFileSync(new URL("../../components/tools/password-generator/PasswordGenerator.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function literalColors(name) {
  return [...globalCss.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6});`, "g"))].map((match) => match[1]);
}

test("custom status foregrounds meet WCAG AA contrast on their light and dark containers", () => {
  for (const status of ["info", "success", "warning"]) {
    const foregrounds = literalColors(status);
    const backgrounds = literalColors(`${status}-soft`);
    assert.equal(foregrounds.length, 2, `${status} should define light and dark foregrounds`);
    assert.equal(backgrounds.length, 2, `${status} should define light and dark containers`);
    for (let themeIndex = 0; themeIndex < 2; themeIndex += 1) {
      const ratio = contrastRatio(foregrounds[themeIndex], backgrounds[themeIndex]);
      assert.ok(ratio >= 4.5, `${status} ${themeIndex === 0 ? "light" : "dark"} contrast is ${ratio.toFixed(2)}:1`);
    }
  }
});

test("shared switch uses native checkbox semantics with the switch role and M3 semantic colors", () => {
  assert.match(switchSource, /role="switch"/);
  assert.match(switchSource, /peer-checked:bg-\[var\(--primary\)\]/);
  assert.match(switchSource, /peer-checked:after:bg-\[var\(--on-primary\)\]/);
  assert.match(switchSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(switchSource, /#[0-9a-fA-F]{3,8}/);
});

test("shared checkbox uses M3 foreground/background roles and a visible keyboard focus", () => {
  assert.match(checkboxSource, /peer-checked:bg-\[var\(--primary\)\]/);
  assert.match(checkboxSource, /text-\[var\(--on-primary\)\]/);
  assert.match(checkboxSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(checkboxSource, /accent-\[#/);
});

test("functional icons use bundled Material Symbols paths and inherit currentColor", () => {
  for (const name of ["content_copy", "restart_alt", "arrow_outward", "lock", "public", "cloud", "warning", "star_fill", "collections_bookmark", "keyboard_arrow_down", "swap_horiz", "apps", "language"]) {
    assert.ok(iconSource.includes(name), `missing Material Symbol: ${name}`);
  }
  assert.match(iconSource, /fill="currentColor"/);
  assert.match(iconSource, /viewBox="0 -960 960 960"/);
});

test("breadcrumbs and collapsible tool sections use Material Symbols instead of text glyphs", () => {
  const breadcrumbsSource = readFileSync(new URL("../../components/layout/Breadcrumbs.tsx", import.meta.url), "utf8");
  const sectionSource = readFileSync(new URL("../../components/tools/ToolPage/ToolSection.tsx", import.meta.url), "utf8");
  const categorySource = readFileSync(new URL("../../components/home/CategoryCard.tsx", import.meta.url), "utf8");
  const languageSource = readFileSync(new URL("../../components/layout/LanguageFlag.tsx", import.meta.url), "utf8");
  const converterSource = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
  assert.match(breadcrumbsSource, /MaterialIcon name="chevron_right"/);
  assert.doesNotMatch(breadcrumbsSource, /›/);
  assert.match(sectionSource, /MaterialIcon name="keyboard_arrow_down"/);
  assert.doesNotMatch(sectionSource, /aria-hidden="true">\+/);
  assert.match(categorySource, /MaterialIcon name="chevron_right"/);
  assert.match(languageSource, /MaterialIcon name="language"/);
  assert.match(converterSource, /MaterialIcon name="swap_horiz"/);
});

test("common navigation and identity icons use the shared Material Symbols component", () => {
  const starSource = readFileSync(new URL("../../components/ui/StarIcon.tsx", import.meta.url), "utf8");
  const collectionSource = readFileSync(new URL("../../components/ui/CollectionIcon.tsx", import.meta.url), "utf8");
  const searchSource = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");
  const headerSource = readFileSync(new URL("../../components/layout/DesktopHeaderMenu.tsx", import.meta.url), "utf8");
  assert.match(starSource, /MaterialIcon name=\{filled \? "star_fill" : "star"\}/);
  assert.match(collectionSource, /MaterialIcon name="collections_bookmark"/);
  assert.match(searchSource, /MaterialIcon name="search"/);
  assert.match(headerSource, /MaterialIcon name="apps"/);
  assert.doesNotMatch(headerSource, /function Icon\(/);
});

test("real checkbox and switch call sites use shared primitives", () => {
  assert.match(labSource, /import \{ Switch \} from "@\/components\/ui\/Switch"/);
  assert.match(labSource, /<Switch /);
  assert.match(passwordSource, /import \{ Checkbox \} from "@\/components\/ui\/Checkbox"/);
  assert.match(passwordSource, /<Checkbox/);
});
