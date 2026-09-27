import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolEditorialComponent = ComponentType<{ locale: Locale }>;

export type ToolModule = {
  loadEditorial: () => Promise<{ default: ToolEditorialComponent }>;
};

type ToolRegistryEntry = {
  tool: Tool;
  module: ToolModule;
};

const moduleLoaders: Record<string, ToolModule> = {
  pourcentage: {
    loadEditorial: () => import("@/components/tools/percentage/ToolEditorial"),
  },
  reduction: {
    loadEditorial: () => import("@/components/tools/reduction/ToolEditorial"),
  },
  tva: {
    loadEditorial: () => import("@/components/tools/tva/ToolEditorial"),
  },
  "regle-de-trois": {
    loadEditorial: () => import("@/components/tools/regle-de-trois/ToolEditorial"),
  },
  age: {
    loadEditorial: () => import("@/components/tools/age/ToolEditorial"),
  },
  duree: {
    loadEditorial: () => import("@/components/tools/duree/ToolEditorial"),
  },
  "vitesse-telechargement": {
    loadEditorial: () => import("@/components/tools/vitesse-telechargement/ToolEditorial"),
  },
  "temps-telechargement": {
    loadEditorial: () => import("@/components/tools/temps-telechargement/ToolEditorial"),
  },
  "taille-fichier": {
    loadEditorial: () => import("@/components/tools/taille-fichier/ToolEditorial"),
  },
  "convertisseur-taille": {
    loadEditorial: () => import("@/components/tools/convertisseur-taille/ToolEditorial"),
  },
  "mots-caracteres": {
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
