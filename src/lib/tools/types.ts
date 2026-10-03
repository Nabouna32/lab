import type { Locale } from "../i18n/config.ts";

export type ToolId =
  | "percentage"
  | "discount"
  | "vat"
  | "rule-of-three"
  | "age"
  | "duration"
  | "download-speed"
  | "download-time"
  | "file-size"
  | "file-size-converter"
  | "word-character-counter"
  | "video-bitrate"
  | "json-formatter"
  | "url-encoder-decoder"
  | "base64-encoder-decoder"
  | "uuid-generator"
  | "unix-timestamp"
  | "hash-generator"
  | "jwt-decoder"
  | "regex-tester"\n  | "contrast-checker";

export type ToolComplexity = "small" | "advanced" | "mini-application";
export type ToolProcessingMode = "local" | "external" | "server" | "hybrid";
export type ToolLifecycle = "draft" | "review" | "published" | "hidden" | "archived";
export type ToolAccess = "anonymous" | "account" | "premium";
export type ToolSharingMode = "none" | "configuration" | "result" | "configuration-and-result";
export type ToolCapability =
  | "local-processing"
  | "file-input"
  | "clipboard"
  | "camera"
  | "microphone"
  | "geolocation"
  | "network"
  | "account-data"
  | "database";

export type ToolLocalizedContent = { name: string; description: string };
export type ToolExample = { label: string; description?: string };
export type ToolSeoMetadata = { title: string; description: string };
export type ToolProcessingMetadata = {
  mode: ToolProcessingMode;
  description: Partial<Record<Locale, string>> & { en: string };
  dataCategories: string[];
  externalProviders: string[];
  storage: "none" | "local" | "server" | "external" | "hybrid";
  retention: string;
  fallback: string;
};
export type ToolBrowserRequirements = { apis: string[]; minimumFeatures?: string[] };
export type ToolSharingMetadata = { supported: boolean; mode: ToolSharingMode };
export type ToolQualityMetadata = {
  accessibility: "required";
  performance: "standard" | "heavy";
  tests: "required" | "partial" | "not-yet";
};
export type ToolContributor = { type: "internal" | "community"; name?: string };

export type Tool = {
  id: ToolId;
  icon: string;

  version: number;
  complexity: ToolComplexity;
  categories: string[];
  content: Partial<Record<Locale, ToolLocalizedContent>> & { fr: ToolLocalizedContent; en: ToolLocalizedContent };
  tags: string[];
  aliases: string[];
  seo: Record<Locale, ToolSeoMetadata>;
  examples: ToolExample[];
  processing: ToolProcessingMetadata;
  capabilities: ToolCapability[];
  browserRequirements: ToolBrowserRequirements;
  offline: boolean;
  sharing: ToolSharingMetadata;
  relatedToolIds: string[];
  quality: ToolQualityMetadata;
  lifecycle: ToolLifecycle;
  access: ToolAccess;
  contributor: ToolContributor;
};

export function isPublishedTool(tool: Tool): boolean {
  return tool.lifecycle === "published";
}

export function getToolContent(tool: Tool, locale: Locale): ToolLocalizedContent {
  return tool.content[locale] ?? tool.content.en;
}

export function isToolContentFallback(tool: Tool, locale: Locale): boolean {
  return tool.content[locale] === undefined;
}

export function isToolProcessingDescriptionFallback(processing: ToolProcessingMetadata, locale: Locale): boolean {
  return processing.description[locale] === undefined;
}

export function getPrimaryToolCategory(tool: Tool): string {
  const category = tool.categories[0];
  if (!category) throw new Error(`Tool "${tool.id}" must declare at least one category.`);
  return category;
}
