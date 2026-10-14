import { isPublishedTool } from "./types.ts";
import type { Tool } from "@/lib/tools/types";
import { tools } from "./tools.ts";

/**
 * Single access boundary for the tool catalog.
 *
 * The current implementation is static and Git-backed. Keeping consumers behind
 * this boundary localizes data-source changes if a concrete product or operational
 * requirement ever justifies them; a database-backed catalog is not a planned migration.
 */
export function getAllTools(): readonly Tool[] {
  return tools;
}

export function getPublishedTools(): readonly Tool[] {
  return tools.filter(isPublishedTool);
}

export function getToolById(toolId: string): Tool | undefined {
  return tools.find((tool) => tool.id === toolId);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(
    (tool) => tool.categories.includes(categoryId) && isPublishedTool(tool),
  );
}
