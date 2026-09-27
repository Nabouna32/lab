import type { Locale } from "../i18n/config.ts";
import { getPrimaryToolCategory, getToolContent, isPublishedTool } from "./types.ts";
import type { Tool } from "@/lib/tools/types";

export type ToolSearchResult = { tool: Tool; score: number };

export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

function getSearchText(tool: Tool, locale: Locale): string {
  const content = getToolContent(tool, locale);
  return normalizeSearchText([
    content.name,
    content.description,
    ...(tool.aliases ?? []),
    ...(tool.tags ?? []),
    ...(tool.categories ?? []),
    getPrimaryToolCategory(tool),
  ].join(" "));
}

function getTypoTolerance(term: string): number {
  if (term.length >= 8) return 2;
  if (term.length >= 4) return 1;
  return 0;
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 0; i < a.length; i += 1) {
    const current = [i + 1];

    for (let j = 0; j < b.length; j += 1) {
      current.push(
        Math.min(
          current[j] + 1,
          previous[j + 1] + 1,
          previous[j] + (a[i] === b[j] ? 0 : 1),
        ),
      );
    }

    previous = current;
  }

  return previous[b.length];
}

function hasFuzzyTermMatch(term: string, haystack: string): boolean {
  const tolerance = getTypoTolerance(term);
  if (tolerance === 0) return false;

  return haystack
    .split(/\s+/)
    .filter((candidate) => Math.abs(candidate.length - term.length) <= tolerance)
    .some((candidate) => levenshteinDistance(term, candidate) <= tolerance);
}

export function searchTools(tools: readonly Tool[], query: string, locale: Locale = "fr"): ToolSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return tools.filter(isPublishedTool).map((tool) => {
    const content = getToolContent(tool, locale);
    const name = normalizeSearchText(content.name);
    const description = normalizeSearchText(content.description);
    const aliases = tool.aliases.map(normalizeSearchText);
    const tags = tool.tags.map(normalizeSearchText);
    const categories = [...new Set([getPrimaryToolCategory(tool), ...tool.categories].filter(Boolean))].map(normalizeSearchText);
    const haystack = getSearchText(tool, locale);
    let score = 0;
    if (name === normalizedQuery) score += 100;
    if (name.startsWith(normalizedQuery)) score += 60;
    if (name.includes(normalizedQuery)) score += 40;
    if (tags.some((tag) => tag === normalizedQuery)) score += 35;
    if (aliases.some((alias) => alias === normalizedQuery)) score += 35;
    if (categories.some((category) => category === normalizedQuery)) score += 25;
    if (tags.some((tag) => tag.startsWith(normalizedQuery))) score += 25;
    if (aliases.some((alias) => alias.startsWith(normalizedQuery))) score += 25;
    if (categories.some((category) => category.startsWith(normalizedQuery))) score += 15;
    if (description.includes(normalizedQuery)) score += 20;
    const allTermsMatch = terms.every((term) =>
      haystack.includes(term) || hasFuzzyTermMatch(term, haystack),
    );
    if (allTermsMatch) score += 15;

    const fuzzyMatches = terms.filter(
      (term) => !haystack.includes(term) && hasFuzzyTermMatch(term, haystack),
    ).length;
    score += fuzzyMatches * 12;
    return { tool, score };
  }).filter(({ score }) => score > 0).sort((a, b) => {
    const aName = getToolContent(a.tool, locale).name;
    const bName = getToolContent(b.tool, locale).name;
    return b.score - a.score || aName.localeCompare(bName, locale);
  });
}
