import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("shared shape tokens are consumed by date, navigation and slider compositions", () => {
  const datePicker = readFileSync(new URL("../../components/ui/DatePicker.module.css", import.meta.url), "utf8");
  const appLink = readFileSync(new URL("../../components/ui/AppLink.tsx", import.meta.url), "utf8");
  const recentTools = readFileSync(new URL("../../components/home/RecentTools.tsx", import.meta.url), "utf8");
  const relatedTools = readFileSync(new URL("../../components/tools/RelatedTools.tsx", import.meta.url), "utf8");
  const toolCard = readFileSync(new URL("../../components/tools/ToolCard.tsx", import.meta.url), "utf8");
  const urlParser = readFileSync(new URL("../../components/tools/url-parser/UrlParser.tsx", import.meta.url), "utf8");
  const jwtDecoder = readFileSync(new URL("../../components/tools/jwt-decoder/JwtDecoder.tsx", import.meta.url), "utf8");
  const hashGenerator = readFileSync(new URL("../../components/tools/hash-generator/HashGenerator.tsx", import.meta.url), "utf8");
  const editorialPrimitives = readFileSync(new URL("../../components/tools/ToolPage/EditorialPrimitives.tsx", import.meta.url), "utf8");
  const jsonDiff = readFileSync(new URL("../../components/tools/json-diff-checker/JsonDiffChecker.tsx", import.meta.url), "utf8");
  const jsonDiffEditorial = readFileSync(new URL("../../components/tools/json-diff-checker/ToolEditorial.tsx", import.meta.url), "utf8");
  const cronExpression = readFileSync(new URL("../../components/tools/cron-expression/CronExpression.tsx", import.meta.url), "utf8");
  const colorConverter = readFileSync(new URL("../../components/tools/color-converter/ColorConverter.tsx", import.meta.url), "utf8");
  const imageMetadata = readFileSync(new URL("../../components/tools/image-metadata/ImageMetadataViewer.tsx", import.meta.url), "utf8");
  const colorPalette = readFileSync(new URL("../../components/tools/color-palette-generator/ColorPaletteGenerator.tsx", import.meta.url), "utf8");

  assert.ok(datePicker.includes("border-radius: var(--shape-corner-extra-large)"));
  assert.ok(datePicker.includes("border-radius: var(--shape-corner-small)"));
  assert.ok(datePicker.includes("border-radius: var(--shape-corner-large)"));
  assert.ok(appLink.includes("rounded-[var(--shape-corner-full)]"));
  assert.ok(recentTools.includes("rounded-[var(--m3-card-shape)]"));
  assert.ok(recentTools.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(relatedTools.includes("shape-corner-medium"));
  assert.ok(toolCard.includes("shape-corner-medium"));
  assert.ok(urlParser.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(jwtDecoder.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(hashGenerator.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(editorialPrimitives.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(jsonDiff.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(jsonDiffEditorial.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(cronExpression.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(colorConverter.includes("rounded-[var(--shape-corner-medium)]"));
  assert.ok(cronExpression.includes("shape-corner-small"));
  assert.ok(imageMetadata.includes("shape-corner-small"));
  assert.ok(colorPalette.includes("shape-corner-small"));
});

