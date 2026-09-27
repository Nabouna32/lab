import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolEditorialComponent = ComponentType<{ locale: Locale }>;

export type ToolModule = {
  load: () => Promise<{ default: ComponentType }>;
  loadEditorial: () => Promise<{ default: ToolEditorialComponent }>;
};

type ToolRegistryEntry = {
  tool: Tool;
  module: ToolModule;
};

const moduleLoaders: Record<string, ToolModule> = {
  pourcentage: {
    load: () => import("@/components/tools/percentage/PercentageCalculator"),
    loadEditorial: () => import("@/components/tools/percentage/ToolEditorial"),
  },
  reduction: {
    load: () => import("@/components/tools/reduction/ReductionCalculator"),
    loadEditorial: () => import("@/components/tools/reduction/ToolEditorial"),
  },
  tva: {
    load: () => import("@/components/tools/tva/TVACalculator"),
    loadEditorial: () => import("@/components/tools/tva/ToolEditorial"),
  },
  "regle-de-trois": {
    load: () => import("@/components/tools/regle-de-trois/RuleOfThreeCalculator"),
    loadEditorial: () => import("@/components/tools/regle-de-trois/ToolEditorial"),
  },
  age: {
    load: () => import("@/components/tools/age/AgeCalculator"),
    loadEditorial: () => import("@/components/tools/age/ToolEditorial"),
  },
  duree: {
    load: () => import("@/components/tools/duree/DurationCalculator"),
    loadEditorial: () => import("@/components/tools/duree/ToolEditorial"),
  },
  "vitesse-telechargement": {
    load: () => import("@/components/tools/vitesse-telechargement/DownloadSpeedConverter"),
    loadEditorial: () => import("@/components/tools/vitesse-telechargement/ToolEditorial"),
  },
  "temps-telechargement": {
    load: () => import("@/components/tools/temps-telechargement/DownloadTimeCalculator"),
    loadEditorial: () => import("@/components/tools/temps-telechargement/ToolEditorial"),
  },
  "taille-fichier": {
    load: () => import("@/components/tools/taille-fichier/FileSizeCalculator"),
    loadEditorial: () => import("@/components/tools/taille-fichier/ToolEditorial"),
  },
  "convertisseur-taille": {
    load: () => import("@/components/tools/convertisseur-taille/FileSizeConverter"),
    loadEditorial: () => import("@/components/tools/convertisseur-taille/ToolEditorial"),
  },
  "mots-caracteres": {
    load: () => import("@/components/tools/text-counter/TextCounter"),
    loadEditorial: () => import("@/components/tools/text-counter/ToolEditorial"),
  },
};

export const toolRegistry: readonly ToolRegistryEntry[] = getPublishedTools().map((tool) => {
  const toolModule = moduleLoaders[tool.id];
  if (!toolModule) {
    throw new Error(`Published tool "${tool.id}" has no registered module.`);
  }
  return { tool, module: toolModule };
});

const registryById = new Map<string, ToolRegistryEntry>(toolRegistry.map((entry) => [entry.tool.id, entry]));

export function getToolRegistryEntry(toolId: string): ToolRegistryEntry | undefined {
  return registryById.get(toolId);
}

export function getToolByRoute(category: string, slug: string): ToolRegistryEntry | undefined {
  return toolRegistry.find(
    ({ tool }) => getPrimaryToolCategory(tool) === category && tool.slug === slug,
  );
}
