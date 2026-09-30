import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import type { Tool, ToolId } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

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
    () => import("@/components/tools/discount/ReductionCalculator"),
    () => import("@/components/tools/discount/ToolEditorial"),
  ),
  vat: createToolModule(
    () => import("@/components/tools/vat/TVACalculator"),
    () => import("@/components/tools/vat/ToolEditorial"),
  ),
  "rule-of-three": createToolModule(
    () => import("@/components/tools/rule-of-three/RuleOfThreeCalculator"),
    () => import("@/components/tools/rule-of-three/ToolEditorial"),
  ),
  age: createToolModule(
    () => import("@/components/tools/age/AgeCalculator"),
    () => import("@/components/tools/age/ToolEditorial"),
  ),
  duration: createToolModule(
    () => import("@/components/tools/duration/DurationCalculator"),
    () => import("@/components/tools/duration/ToolEditorial"),
  ),
  "download-speed": createToolModule(
    () => import("@/components/tools/download-speed/DownloadSpeedConverter"),
    () => import("@/components/tools/download-speed/ToolEditorial"),
  ),
  "download-time": createToolModule(
    () => import("@/components/tools/download-time/DownloadTimeCalculator"),
    () => import("@/components/tools/download-time/ToolEditorial"),
  ),
  "file-size": createToolModule(
    () => import("@/components/tools/file-size/FileSizeCalculator"),
    () => import("@/components/tools/file-size/ToolEditorial"),
  ),
  "file-size-converter": createToolModule(
    () => import("@/components/tools/file-size-converter/FileSizeConverter"),
    () => import("@/components/tools/file-size-converter/ToolEditorial"),
  ),
  "word-character-counter": createToolModule(
    () => import("@/components/tools/text-counter/TextCounter"),
    () => import("@/components/tools/text-counter/ToolEditorial"),
  ),
  "json-formatter": createToolModule(
    () => import("@/components/tools/json-formatter/JsonFormatter"),
    () => import("@/components/tools/json-formatter/ToolEditorial"),
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

export function getToolByRoute(category: string, slug: string): ToolRegistryEntry | undefined {
  return toolRegistry.find(
    ({ tool }) => getPrimaryToolCategory(tool) === category && tool.slug === slug,
  );
}
