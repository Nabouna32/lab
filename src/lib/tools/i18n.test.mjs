import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { locales, languages } from "../i18n/config.ts";
import { getMessages } from "../i18n/messages.ts";

test("i18n registry exposes the initial languages", () => {
  assert.deepEqual(locales, ["fr", "en"]);
  assert.equal(languages.fr.direction, "ltr");
  assert.equal(languages.en.direction, "ltr");
  assert.equal(languages.fr.enabled, true);
  assert.equal(languages.en.enabled, true);
  assert.equal(languages.fr.translationStatus, "complete");
  assert.equal(languages.en.translationStatus, "partial");
});

test("global messages are available in every enabled locale", () => {
  for (const locale of locales) {
    const messages = getMessages(locale);
    assert.ok(messages.nav.tools.length > 0);
    assert.ok(messages.tools.title.length > 0);
    assert.ok(messages.processing.more.length > 0);
  }
});

const localizedUiFiles = [
  "../../components/theme/ThemeToggle.tsx",
  "../../components/tools/ToolPage/EditorialPrimitives.tsx",
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
  const editorialPrimitives = readFileSync(fileURLToPath(new URL("../../components/tools/ToolPage/EditorialPrimitives.tsx", import.meta.url)), "utf8");
  const categories = readFileSync(fileURLToPath(new URL("../../components/home/Categories.tsx", import.meta.url)), "utf8");
  const downloadTime = readFileSync(fileURLToPath(new URL("../../components/tools/temps-telechargement/DownloadTimeCalculator.tsx", import.meta.url)), "utf8");
  const downloadSpeed = readFileSync(fileURLToPath(new URL("../../components/tools/vitesse-telechargement/DownloadSpeedConverter.tsx", import.meta.url)), "utf8");

  assert.match(theme, /getMessages\(locale\)\.theme/);
  assert.match(editorialPrimitives, /getMessages\(locale\)\.tools\.back/);
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
