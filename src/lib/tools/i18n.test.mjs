import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import vm from "node:vm";
import { getIntlLocale, locales, languages } from "../i18n/config.ts";
import { getMessages } from "../i18n/messages.ts";
import { formatPlural } from "../i18n/plural.ts";

const require = createRequire(import.meta.url);
const typescript = require("typescript");

function collectShape(value, path = "") {
  if (Array.isArray(value)) {
    return [
      [path, "array", value.length],
      ...value.flatMap((item, index) => collectShape(item, `${path}[${index}]`)),
    ];
  }
  if (value !== null && typeof value === "object") {
    return [
      [path, "object"],
      ...Object.keys(value).sort().flatMap((key) => collectShape(value[key], path ? `${path}.${key}` : key)),
    ];
  }
  return [[path, typeof value]];
}

function collectInterpolationVariables(value, path = "") {
  if (typeof value === "string") {
    return [[path, [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()]];
  }
  if (typeof value === "function") {
    const variables = [...value.toString().matchAll(/\$\{\s*([\w.]+)\s*\}/g)]
      .map((match) => match[1])
      .sort();
    return [[path, variables]];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectInterpolationVariables(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value).sort().flatMap((key) =>
      collectInterpolationVariables(value[key], path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function loadEditorialContent(relativePath) {
  const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
  const start = source.indexOf("const content = ");
  const end = source.indexOf(" as const;", start);
  assert.notEqual(start, -1, relativePath);
  assert.notEqual(end, -1, relativePath);

  const expression = source.slice(start + "const content = ".length, end);
  const compiled = typescript.transpileModule(
    `module.exports = ${expression};`,
    { compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 } },
  ).outputText;

  const sandboxModule = { exports: {} };
  vm.runInNewContext(compiled, { module: sandboxModule, exports: sandboxModule.exports });
  return sandboxModule.exports;
}

test("i18n registry exposes the initial languages", () => {
  assert.deepEqual(locales, ["fr", "en"]);
  assert.equal(languages.fr.direction, "ltr");
  assert.equal(languages.en.direction, "ltr");
  assert.equal(languages.fr.enabled, true);
  assert.equal(languages.en.enabled, true);
  assert.equal(languages.fr.translationStatus, "complete");
  assert.equal(languages.en.translationStatus, "partial");
  assert.equal(languages.fr.intlLocale, "fr-FR");
  assert.equal(languages.en.intlLocale, "en-US");
  assert.equal(getIntlLocale("fr"), "fr-FR");
  assert.equal(getIntlLocale("en"), "en-US");
});

test("global messages are available in every enabled locale", () => {
  for (const locale of locales) {
    const messages = getMessages(locale);
    assert.ok(messages.nav.tools.length > 0);
    assert.ok(messages.tools.title.length > 0);
    assert.ok(messages.processing.more.length > 0);
  }
});

test("global message locales keep the same structure and interpolation variables", () => {
  const fr = getMessages("fr");
  const en = getMessages("en");
  assert.deepEqual(collectShape(fr), collectShape(en));
  assert.deepEqual(collectInterpolationVariables(fr), collectInterpolationVariables(en));
});

const localizedUiFiles = [
  "../../components/theme/ThemeToggle.tsx",
  "../../components/layout/Breadcrumbs.tsx",
  "../../components/home/Categories.tsx",
  "../../components/tools/temps-telechargement/DownloadTimeCalculator.tsx",
  "../../components/tools/vitesse-telechargement/DownloadSpeedConverter.tsx",
];

test("audited UI components consume localization instead of local bilingual strings", () => {
  for (const relativePath of localizedUiFiles) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.equal(source.includes('locale === "fr"'), false, relativePath);
    assert.equal(source.includes('locale === "en"'), false, relativePath);
  }

  const theme = readFileSync(fileURLToPath(new URL("../../components/theme/ThemeToggle.tsx", import.meta.url)), "utf8");
  const categories = readFileSync(fileURLToPath(new URL("../../components/home/Categories.tsx", import.meta.url)), "utf8");
  const downloadTime = readFileSync(fileURLToPath(new URL("../../components/tools/temps-telechargement/DownloadTimeCalculator.tsx", import.meta.url)), "utf8");
  const downloadSpeed = readFileSync(fileURLToPath(new URL("../../components/tools/vitesse-telechargement/DownloadSpeedConverter.tsx", import.meta.url)), "utf8");

  assert.match(theme, /getMessages\(locale\)\.theme/);
  const breadcrumbs = readFileSync(fileURLToPath(new URL("../../components/layout/Breadcrumbs.tsx", import.meta.url)), "utf8");
  assert.match(breadcrumbs, /t\.breadcrumbs\.label/);
  assert.match(categories, /t\.home\.categoriesCount/);
  assert.match(downloadTime, /getDownloadSizeUnitLabel\(locale, unit\)/);
  assert.match(downloadTime, /getDownloadSpeedUnitLabel\(locale, unit\)/);
  assert.match(downloadTime, /getDownloadDurationLabels\(locale\)/);
  assert.match(downloadSpeed, /getSpeedUnitLabel\(locale, unit, "long"\)/);
  assert.match(downloadSpeed, /getSpeedUnitLabel\(locale, to\)/);
});

const editorialFiles = [
  "age", "duree", "tva", "text-counter", "taille-fichier", "reduction",
  "regle-de-trois", "convertisseur-taille", "temps-telechargement",
  "vitesse-telechargement", "percentage",
];

test("tool editorial modules keep FR/EN content structured and out of JSX locale branches", () => {
  for (const tool of editorialFiles) {
    const relativePath = `../../components/tools/${tool}/ToolEditorial.tsx`;
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.match(source, /const content = \{/);
    assert.match(source, /const t = content\[locale\]/);
    assert.equal(source.includes('locale === "fr"'), false, relativePath);
    assert.equal(source.includes('locale === "en"'), false, relativePath);
  }
});

test("tool editorial locales keep the same content structure", () => {
  for (const tool of editorialFiles) {
    const relativePath = `../../components/tools/${tool}/ToolEditorial.tsx`;
    const content = loadEditorialContent(relativePath);
    assert.deepEqual(Object.keys(content).sort(), ["en", "fr"], relativePath);
    assert.deepEqual(collectShape(content.fr), collectShape(content.en), relativePath);
  }
});

test("tool content falls back to English when a requested locale is missing", async () => {
  const { getToolContent, isToolContentFallback, isToolProcessingDescriptionFallback } = await import("./types.ts");
  const tool = {
    content: {
      fr: { name: "Nom français", description: "Description française" },
      en: { name: "English name", description: "English description" },
    },
  };
  assert.deepEqual(getToolContent(tool, "de"), tool.content.en);
  assert.deepEqual(getToolContent(tool, "fr"), tool.content.fr);
  assert.deepEqual(getToolContent(tool, "en"), tool.content.en);
  assert.equal(isToolContentFallback(tool, "de"), true);
  assert.equal(isToolContentFallback(tool, "fr"), false);
  assert.equal(isToolProcessingDescriptionFallback({ description: { en: "English" } }, "fr"), true);
  assert.equal(isToolProcessingDescriptionFallback({ description: { fr: "Français", en: "English" } }, "fr"), false);
});

test("plural formatting uses locale-aware rules", () => {
  assert.equal(formatPlural("fr", 1, { one: "catégorie", other: "catégories" }), "1 catégorie");
  assert.equal(formatPlural("fr", 2, { one: "catégorie", other: "catégories" }), "2 catégories");
  assert.equal(formatPlural("en", 1, { one: "category", other: "categories" }), "1 category");
  assert.equal(formatPlural("en", 2, { one: "category", other: "categories" }), "2 categories");
});

test("audited pluralized UI components delegate plural selection to the i18n layer", () => {
  const localizedFiles = [
    "../../app/[locale]/outils/page.tsx",
    "../../components/tools/ToolSearch.tsx",
    "../../components/tools/age/AgeCalculator.tsx",
  ];

  for (const relativePath of localizedFiles) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.equal(source.includes("=== 1 ?"), false, relativePath);
    assert.match(source, /formatPlural\(locale/);
  }

  const units = readFileSync(fileURLToPath(new URL("../i18n/units.ts", import.meta.url)), "utf8");
  assert.equal(units.includes("value === 1 ?"), false);
  assert.match(units, /formatPlural\(locale, value/);
});


test("public route metadata and category copy use localized message keys", async () => {
  const home = readFileSync(fileURLToPath(new URL("../../app/[locale]/page.tsx", import.meta.url)), "utf8");
  const tools = readFileSync(fileURLToPath(new URL("../../app/[locale]/outils/page.tsx", import.meta.url)), "utf8");
  const category = readFileSync(fileURLToPath(new URL("../../app/[locale]/outils/[category]/page.tsx", import.meta.url)), "utf8");
  const messages = readFileSync(fileURLToPath(new URL("../i18n/messages.ts", import.meta.url)), "utf8");
  assert.match(home, /title: t\.home\.metaTitle/);
  assert.match(tools, /title: t\.tools\.metaTitle/);
  assert.match(category, /t\.tools\.categoryDescription\(categoryName\)/);
  assert.match(messages, /metaTitle: "Utiluna — Outils gratuits en ligne"/);
  assert.match(messages, /metaTitle: "Utiluna — Free online tools"/);
  assert.match(messages, /categoryDescription: \(category\) =>/);
  assert.equal(messages.includes('locale === "fr" ? "Utiluna — Outils gratuits en ligne"'), false);
  assert.equal(messages.includes('locale === "fr" ? "Tous les outils — Utiluna"'), false);
});


test("fallback messaging is wired into the tool page and processing status", () => {
  const page = readFileSync(fileURLToPath(new URL("../../components/tools/ToolPage/ToolPage.tsx", import.meta.url)), "utf8");
  const header = readFileSync(fileURLToPath(new URL("../../components/tools/ToolPage/ToolPageHeader.tsx", import.meta.url)), "utf8");
  const processing = readFileSync(fileURLToPath(new URL("../../components/tools/ToolPage/ToolProcessingStatus.tsx", import.meta.url)), "utf8");

  assert.match(page, /isToolContentFallback\(tool, locale\)/);
  assert.match(page, /contentFallback=\{isContentFallback\}/);
  assert.match(header, /contentFallback &&/);
  assert.match(header, /fallbackNotice/);
  assert.match(processing, /isToolProcessingDescriptionFallback\(processing, locale\)/);
  assert.match(processing, /fallbackNotice/);
});

test("published tool interfaces keep user-facing state messages behind the i18n layer", () => {
  const publishedToolFiles = [
    "../../components/tools/percentage/PercentageCalculator.tsx",
    "../../components/tools/reduction/ReductionCalculator.tsx",
    "../../components/tools/tva/TVACalculator.tsx",
    "../../components/tools/regle-de-trois/RuleOfThreeCalculator.tsx",
    "../../components/tools/age/AgeCalculator.tsx",
    "../../components/tools/duree/DurationCalculator.tsx",
    "../../components/tools/vitesse-telechargement/DownloadSpeedConverter.tsx",
    "../../components/tools/temps-telechargement/DownloadTimeCalculator.tsx",
    "../../components/tools/taille-fichier/FileSizeCalculator.tsx",
    "../../components/tools/convertisseur-taille/FileSizeConverter.tsx",
    "../../components/tools/text-counter/TextCounter.tsx",
  ];

  for (const relativePath of publishedToolFiles) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.match(source, /getToolMessages\(locale\)/, relativePath);
    assert.equal(source.includes('locale === "fr"'), false, relativePath);
    assert.equal(source.includes('locale === "en"'), false, relativePath);
  }
});


test("public shell interfaces keep user-facing labels and states behind the i18n layer", () => {
  const publicShellFiles = [
    "../../components/layout/Header.tsx",
    "../../components/layout/Footer.tsx",
    "../../components/layout/Breadcrumbs.tsx",
    "../../components/layout/LanguageSelector.tsx",
    "../../components/layout/MobileHeaderSearch.tsx",
    "../../components/theme/ThemeToggle.tsx",
    "../../components/home/Hero.tsx",
    "../../components/home/Categories.tsx",
    "../../components/home/DiscoverTools.tsx",
    "../../components/tools/ToolSearch.tsx",
  ];

  for (const relativePath of publicShellFiles) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    if (relativePath.endsWith("MobileHeaderSearch.tsx")) {
      assert.match(source, /searchLabel: string/);
      assert.match(source, /closeLabel: string/);
    } else {
      assert.match(source, /getMessages\((locale|currentLocale)\)/, relativePath);
    }
    assert.equal(source.includes('locale === "fr"'), false, relativePath);
    assert.equal(source.includes('locale === "en"'), false, relativePath);
  }

  const search = readFileSync(fileURLToPath(new URL("../../components/tools/ToolSearch.tsx", import.meta.url)), "utf8");
  assert.match(search, /t\.tools\.noResults/);
  assert.match(search, /t\.tools\.noResultsHelp/);
  assert.match(search, /t\.tools\.clearSearch/);
});
