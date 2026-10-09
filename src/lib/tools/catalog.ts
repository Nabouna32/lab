import { isPublishedTool } from "./types.ts";
import type { Tool } from "@/lib/tools/types";
import { tools } from "./tools.ts";

/**
 * Single access boundary for the tool catalog.
 *
 * The current implementation is static and Git-backed. Keeping consumers behind
 * this boundary lets the catalog move to a database later without making every
 * page/component know where catalog data comes from.
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
