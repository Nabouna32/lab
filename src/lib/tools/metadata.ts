import { locales } from "../i18n/config.ts";
import { getPrimaryToolCategory, isPublishedTool } from "@/lib/tools/types";
import type { Tool, ToolCapability, ToolProcessingMode } from "@/lib/tools/types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function expectedProcessingCapabilities(mode: ToolProcessingMode): Set<ToolCapability> {
  switch (mode) {
    case "local":
      return new Set(["local-processing"]);
    case "external":
      return new Set(["network"]);
    case "utiluna-server":
      return new Set(["network"]);
    case "hybrid":
      return new Set(["local-processing", "network"]);
  }
}

function validateToolQuality(tool: Tool): void {
  if (!slugPattern.test(tool.slug)) {
    throw new Error(`Tool "${tool.id}" must declare a URL-safe kebab-case slug.`);
  }

  if (getPrimaryToolCategory(tool) !== tool.categories[0]) {
    throw new Error(`Tool "${tool.id}" must use categoryId as its primary category.`);
  }

  if (tool.tags.some((tag) => !tag.trim()) || new Set(tool.tags).size !== tool.tags.length) {
    throw new Error(`Tool "${tool.id}" must declare unique, non-empty tags.`);
  }

  if (
    tool.aliases.some((alias) => !alias.trim()) ||
    new Set(tool.aliases).size !== tool.aliases.length
  ) {
    throw new Error(`Tool "${tool.id}" must declare unique, non-empty aliases.`);
  }

  if (tool.quality.accessibility !== "required") {
    throw new Error(`Tool "${tool.id}" must require accessibility validation.`);
  }

  if (isPublishedTool(tool)) {
        if (tool.quality.tests !== "required") {
      throw new Error(`Published tool "${tool.id}" must require tests.`);
    }
  }

  if (tool.contributor.type === "community" && !tool.contributor.name?.trim()) {
    throw new Error(`Community tool "${tool.id}" must identify its contributor.`);
  }

  const expected = expectedProcessingCapabilities(tool.processing.mode);
  for (const capability of expected) {
    if (!tool.capabilities.includes(capability)) {
      throw new Error(
        `Tool "${tool.id}" processing mode "${tool.processing.mode}" requires capability "${capability}".`,
      );
    }
  }

  if (tool.processing.mode === "local" && tool.capabilities.includes("network")) {
    throw new Error(`Local tool "${tool.id}" cannot require network access.`);
  }

  if (tool.processing.mode === "external" && tool.capabilities.includes("local-processing")) {
    throw new Error(`External tool "${tool.id}" cannot require local processing.`);
  }

  if (tool.processing.mode === "utiluna-server" && tool.capabilities.includes("local-processing")) {
    throw new Error(`Utiluna-server tool "${tool.id}" cannot require local processing.`);
  }

  if (tool.processing.mode === "local" && tool.processing.externalProviders.length > 0) {
    throw new Error(`Local tool "${tool.id}" cannot declare external providers.`);
  }

  if (tool.processing.mode !== "local" && tool.processing.externalProviders.length === 0) {
    throw new Error(`Remote tool "${tool.id}" must declare at least one external provider.`);
  }

  if (tool.processing.mode === "local" && !["none", "local"].includes(tool.processing.storage)) {
    throw new Error(`Local tool "${tool.id}" has incompatible storage metadata.`);
  }

  if (tool.processing.mode === "utiluna-server" && tool.processing.storage === "external") {
    throw new Error(`Utiluna-server tool "${tool.id}" cannot declare external-only storage.`);
  }

  if (tool.offline && tool.processing.mode !== "local") {
    throw new Error(`Only local tools can be declared offline: ${tool.id}`);
  }

  if (tool.offline && tool.capabilities.includes("network")) {
    throw new Error(`Offline tool "${tool.id}" cannot require network access.`);
  }

  if (!tool.sharing.supported && tool.sharing.mode !== "none") {
    throw new Error(`Tool "${tool.id}" has sharing mode without sharing support.`);
  }

  if (tool.sharing.supported && tool.sharing.mode === "none") {
    throw new Error(`Tool "${tool.id}" enables sharing without a sharing mode.`);
  }
}

export function validateToolCatalog(tools: readonly Tool[]): void {
  const ids = new Set<string>();

  for (const tool of tools) {
    if (ids.has(tool.id)) {
      throw new Error(`Duplicate tool id: ${tool.id}`);
    }
    ids.add(tool.id);
  }

  for (let index = 0; index < tools.length; index += 1) {
    for (let previousIndex = 0; previousIndex < index; previousIndex += 1) {
      if (tools[previousIndex].slug === tools[index].slug) {
        throw new Error(
          `Duplicate tool slug: ${tools[index].slug} (tools "${tools[previousIndex].id}" and "${tools[index].id}")`,
        );
      }
    }
  }

  for (const tool of tools) {
    if (tool.categories.length === 0) {
      throw new Error(`Tool "${tool.id}" must declare at least one category.`);
    }
    if (!tool.content.fr.name.trim() || !tool.content.fr.description.trim()) {
      throw new Error(`Tool "${tool.id}" must declare French name and description.`);
    }
    for (const locale of locales) {
      const seo = tool.seo[locale];
      if (!seo?.title.trim() || !seo.description.trim()) {
        throw new Error(`Tool "${tool.id}" must declare ${locale} SEO metadata.`);
      }
    }
    if (tool.version < 1 || !Number.isInteger(tool.version)) {
      throw new Error(`Tool "${tool.id}" must declare a positive integer version.`);
    }
    validateToolQuality(tool);
  }

  const knownIds = new Set(ids);
  for (const tool of tools) {
    for (const relatedId of tool.relatedToolIds) {
      if (!knownIds.has(relatedId)) {
        throw new Error(`Tool "${tool.id}" references unknown related tool "${relatedId}".`);
      }
      if (relatedId === tool.id) {
        throw new Error(`Tool "${tool.id}" cannot reference itself as related.`);
      }
    }
  }
}
