import { getPrimaryToolCategory, getToolContent, isPublishedTool } from "./types.ts";
import type { Tool } from "./types";
import { normalizeSearchText } from "./search-utils.ts";

function getTerms(tool: Tool): string[] {
  return [getToolContent(tool, "fr").name, ...tool.tags, ...tool.aliases]
    .flatMap((value) => normalizeSearchText(value).split(/\s+/))
    .filter((term) => term.length >= 3);
}

/**
 * Finds related tools from catalogue metadata. No tool needs to list its
 * neighbours manually: category and shared keywords drive the relation score.
 */
export function getRelatedTools(
  tool: Tool,
  allTools: readonly Tool[],
  limit = 3,
): Tool[] {
  const sourceTerms = new Set(getTerms(tool));

  return allTools
    .filter((candidate) => isPublishedTool(candidate) && candidate.id !== tool.id)
    .map((candidate) => {
      const candidateTerms = getTerms(candidate);
      const sharedTerms = candidateTerms.filter((term) => sourceTerms.has(term));
      const score =
        sharedTerms.length * 10 +
        (getPrimaryToolCategory(candidate) === getPrimaryToolCategory(tool) ? 5 : 0);

      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || getToolContent(a.candidate, "fr").name.localeCompare(getToolContent(b.candidate, "fr").name, "fr"),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
