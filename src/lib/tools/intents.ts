import type { Tool, ToolId } from "./types.ts";
import { isPublishedTool } from "./types.ts";

export const intentIds = ["calculate", "convert", "generate", "analyze", "measure"] as const;
export type IntentId = (typeof intentIds)[number];

export type IntentDefinition = {
  id: IntentId;
  toolIds: readonly ToolId[];
};

/**
 * Curated intent-to-tool associations are deliberately separate from categories.
 * One intent can lead to tools across multiple domains; no AI inference is required.
 */
export const intentDefinitions: readonly IntentDefinition[] = [
  {
    id: "calculate",
    toolIds: [
      "compound-interest",
      "percentage",
      "discount",
      "vat",
      "rule-of-three",
      "ip-subnet-calculator",
      "number-base-converter",
    ],
  },
  {
    id: "convert",
    toolIds: [
      "unit-converter",
      "file-size-converter",
      "download-speed",
      "color-converter",
      "base64-encoder-decoder",
      "url-encoder-decoder",
      "html-entity-encoder-decoder",
      "csv-json-converter",
      "text-case-converter",
      "timezone-converter",
      "number-base-converter",
    ],
  },
  {
    id: "generate",
    toolIds: [
      "uuid-generator",
      "password-generator",
      "hash-generator",
      "qr-code-generator",
      "color-palette-generator",
      "markdown-table-generator",
      "json-to-typescript",
    ],
  },
  {
    id: "analyze",
    toolIds: [
      "json-formatter",
      "yaml-formatter-validator",
      "xml-formatter-validator",
      "url-parser",
      "regex-tester",
      "jwt-decoder",
      "text-diff-checker",
      "image-metadata",
      "image-compressor",
      "html-previewer",
      "video-bitrate",
    ],
  },
  {
    id: "measure",
    toolIds: [
      "age",
      "duration",
      "date-calculator",
      "download-time",
      "download-speed",
      "file-size",
      "video-bitrate",
      "contrast-checker",
      "ip-subnet-calculator",
      "unix-timestamp",
    ],
  },
];

export function isIntentId(value: string | undefined): value is IntentId {
  return value !== undefined && intentIds.some((intentId) => intentId === value);
}

export function getIntentDefinition(intentId: IntentId): IntentDefinition {
  const definition = intentDefinitions.find((intent) => intent.id === intentId);
  if (!definition) throw new Error(`Unknown intent "${intentId}".`);
  return definition;
}

export function getToolsForIntent(intentId: IntentId, tools: readonly Tool[]): Tool[] {
  const definition = getIntentDefinition(intentId);
  const publishedById = new Map(
    tools.filter(isPublishedTool).map((tool) => [tool.id, tool] as const),
  );

  return definition.toolIds
    .map((toolId) => publishedById.get(toolId))
    .filter((tool): tool is Tool => tool !== undefined);
}
