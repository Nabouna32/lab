import type { Tool } from "./types.ts";
import { isPublishedTool } from "./types.ts";

/**
 * Returns explicitly curated contextual continuations for a tool.
 *
 * Unlike catalogue similarity, these relations represent an editorially
 * validated next step and may legitimately be empty.
 */
export function getNextActions(
  tool: Tool,
  allTools: readonly Tool[],
  limit = 3,
): Tool[] {
  const publishedIds = new Set(
    allTools.filter((candidate) => isPublishedTool(candidate)).map((candidate) => candidate.id),
  );

  return tool.nextActionToolIds
    .filter((candidateId) => candidateId !== tool.id && publishedIds.has(candidateId))
    .slice(0, limit)
    .map((candidateId) => allTools.find((candidate) => candidate.id === candidateId))
    .filter((candidate): candidate is Tool => candidate !== undefined);
}
