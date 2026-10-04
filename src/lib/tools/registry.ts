import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import type { Tool, ToolId } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getCategorySlug, getToolSlug } from "@/lib/tools/routes";

export type ToolEditorialComponent = ComponentType<{ locale: Locale }>;
export type ToolRuntimeComponent = ComponentType;
export type ToolRuntimeLoader = () => Promise<{ default: ToolRuntimeComponent }>;

export type ToolModule = {
  loadRuntime: ToolRuntimeLoader;
  runtime: ToolRuntimeComponent;
  loadEditorial: () => Promise<{ default: ToolEditorialComponent }>;
};

export type ToolRegistryEntry = {
  tool: Tool;
  module: ToolModule;
};

function createToolModule(
  loadRuntime: ToolRuntimeLoader,
  loadEditorial: ToolModule["loadEditorial"],
): ToolModule {
  return {
    loadRuntime,
    runtime: dynamic(loadRuntime),
    loadEditorial,
  };
}

const moduleLoaders: Partial<Record<ToolId, ToolModule>> = {
  percentage: createToolModule(
    () => import("@/components/tools/percentage/PercentageCalculator"),
    () => import("@/components/tools/percentage/ToolEditorial"),
  ),
  discount: createToolModule(
    () => import("@/components/tools/reduction/ReductionCalculator"),
    () => import("@/components/tools/reduction/ToolEditorial"),
  ),
  vat: createToolModule(
    () => import("@/components/tools/tva/TVACalculator"),
    () => import("@/components/tools/tva/ToolEditorial"),
  ),
  "rule-of-three": createToolModule(
    () => import("@/components/tools/regle-de-trois/RuleOfThreeCalculator"),
    () => import("@/components/tools/regle-de-trois/ToolEditorial"),
  ),
  age: createToolModule(
    () => import("@/components/tools/age/AgeCalculator"),
    () => import("@/components/tools/age/ToolEditorial"),
  ),
  duration: createToolModule(
    () => import("@/components/tools/duree/DurationCalculator"),
    () => import("@/components/tools/duree/ToolEditorial"),
  ),
  "download-speed": createToolModule(
    () => import("@/components/tools/vitesse-telechargement/DownloadSpeedConverter"),
    () => import("@/components/tools/vitesse-telechargement/ToolEditorial"),
  ),
  "download-time": createToolModule(
    () => import("@/components/tools/temps-telechargement/DownloadTimeCalculator"),
    () => import("@/components/tools/temps-telechargement/ToolEditorial"),
  ),
  "file-size": createToolModule(
    () => import("@/components/tools/taille-fichier/FileSizeCalculator"),
    () => import("@/components/tools/taille-fichier/ToolEditorial"),
  ),
  "file-size-converter": createToolModule(
    () => import("@/components/tools/convertisseur-taille/FileSizeConverter"),
    () => import("@/components/tools/convertisseur-taille/ToolEditorial"),
  ),
  "word-character-counter": createToolModule(
    () => import("@/components/tools/text-counter/TextCounter"),
    () => import("@/components/tools/text-counter/ToolEditorial"),
  ),
  "text-case-converter": createToolModule(
    () => import("@/components/tools/text-case-converter/TextCaseConverter"),
    () => import("@/components/tools/text-case-converter/ToolEditorial"),
  ),
  "unit-converter": createToolModule(
    () => import("@/components/tools/unit-converter/UnitConverter"),
    () => import("@/components/tools/unit-converter/ToolEditorial"),
  ),
  "json-formatter": createToolModule(
    () => import("@/components/tools/json-formatter/JsonFormatter"),
    () => import("@/components/tools/json-formatter/ToolEditorial"),
  ),
  "yaml-formatter-validator": createToolModule(
    () => import("@/components/tools/yaml-formatter-validator/YamlFormatterValidator"),
    () => import("@/components/tools/yaml-formatter-validator/ToolEditorial"),
  ),
  "url-encoder-decoder": createToolModule(
    () => import("@/components/tools/url-encoder/UrlEncoder"),
    () => import("@/components/tools/url-encoder/ToolEditorial"),
  ),
  "url-parser": createToolModule(
    () => import("@/components/tools/url-parser/UrlParser"),
    () => import("@/components/tools/url-parser/ToolEditorial"),
  ),
  "base64-encoder-decoder": createToolModule(
    () => import("@/components/tools/base64/Base64Encoder"),
    () => import("@/components/tools/base64/ToolEditorial"),
  ),
  "csv-json-converter": createToolModule(
    () => import("@/components/tools/csv-json/CsvJsonConverter"),
    () => import("@/components/tools/csv-json/ToolEditorial"),
  ),
  "json-to-typescript": createToolModule(
    () => import("@/components/tools/json-to-typescript/JsonToTypeScript"),
    () => import("@/components/tools/json-to-typescript/ToolEditorial"),
  ),
  "html-entity-encoder-decoder": createToolModule(
    () => import("@/components/tools/html-entity-encoder/HtmlEntityEncoder"),
    () => import("@/components/tools/html-entity-encoder/ToolEditorial"),
  ),
  "uuid-generator": createToolModule(
    () => import("@/components/tools/uuid/UuidGenerator"),
    () => import("@/components/tools/uuid/ToolEditorial"),
  ),
  "unix-timestamp": createToolModule(
    () => import("@/components/tools/unix-timestamp/UnixTimestampConverter"),
    () => import("@/components/tools/unix-timestamp/ToolEditorial"),
  ),
  "hash-generator": createToolModule(
    () => import("@/components/tools/hash-generator/HashGenerator"),
    () => import("@/components/tools/hash-generator/ToolEditorial"),
  ),
  "password-generator": createToolModule(
    () => import("@/components/tools/password-generator/PasswordGenerator"),
    () => import("@/components/tools/password-generator/ToolEditorial"),
  ),
  "color-converter": createToolModule(
    () => import("@/components/tools/color-converter/ColorConverter"),
    () => import("@/components/tools/color-converter/ToolEditorial"),
  ),
  "color-palette-generator": createToolModule(
    () => import("@/components/tools/color-palette-generator/ColorPaletteGenerator"),
    () => import("@/components/tools/color-palette-generator/ToolEditorial"),
  ),
  "regex-tester": createToolModule(
    () => import("@/components/tools/regex-tester/RegexTester"),
    () => import("@/components/tools/regex-tester/ToolEditorial"),
  ),
  "jwt-decoder": createToolModule(
    () => import("@/components/tools/jwt-decoder/JwtDecoder"),
    () => import("@/components/tools/jwt-decoder/ToolEditorial"),
  ),
  "contrast-checker": createToolModule(
    () => import("@/components/tools/contrast-checker/ContrastChecker"),
    () => import("@/components/tools/contrast-checker/ToolEditorial"),
  ),
  "ip-subnet-calculator": createToolModule(
    () => import("@/components/tools/ip-subnet-calculator/IpSubnetCalculator"),
    () => import("@/components/tools/ip-subnet-calculator/ToolEditorial"),
  ),
  "number-base-converter": createToolModule(
    () => import("@/components/tools/number-base-converter/NumberBaseConverter"),
    () => import("@/components/tools/number-base-converter/ToolEditorial"),
  ),
  "video-bitrate": createToolModule(
    () => import("@/components/tools/video-bitrate/VideoBitrateCalculator"),
    () => import("@/components/tools/video-bitrate/ToolEditorial"),
  ),
};

export const toolRegistry: readonly ToolRegistryEntry[] = getPublishedTools().map((tool) => {
  const toolModule = moduleLoaders[tool.id];
  if (!toolModule) {
    throw new Error(`Published tool "${tool.id}" has no registered module.`);
  }
  return { tool, module: toolModule };
});

const registryById = new Map<string, ToolRegistryEntry>(
  toolRegistry.map((entry) => [entry.tool.id, entry]),
);

export function getToolRegistryEntry(toolId: string): ToolRegistryEntry | undefined {
  return registryById.get(toolId);
}

export function getToolByRoute(
  locale: Locale,
  categorySlug: string,
  toolSlug: string,
): ToolRegistryEntry | undefined {
  return toolRegistry.find(({ tool }) =>
    getCategorySlug(locale, getPrimaryToolCategory(tool)) === categorySlug &&
    getToolSlug(locale, tool.id) === toolSlug,
  );
}
