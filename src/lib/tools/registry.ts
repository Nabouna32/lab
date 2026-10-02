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
  "json-formatter": createToolModule(
    () => import("@/components/tools/json-formatter/JsonFormatter"),
    () => import("@/components/tools/json-formatter/ToolEditorial"),
  ),
  "url-encoder-decoder": createToolModule(
    () => import("@/components/tools/url-encoder/UrlEncoder"),
    () => import("@/components/tools/url-encoder/ToolEditorial"),
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
