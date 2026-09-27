import type { Locale } from "../i18n/config.ts";
import { getPrimaryToolCategory, getToolContent, isPublishedTool } from "./types.ts";
import type { Tool } from "@/lib/tools/types";

export type ToolSearchResult = { tool: Tool; score: number };

export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

const SEARCH_STOP_WORDS = new Set([
  "a", "an", "and", "calculate", "calculates", "calculating", "calculer", "calcule", "calculez",
  "convert", "converter", "convertir", "convertissez", "conversion", "de", "des", "du", "en",
  "et", "for", "find", "la", "le", "les", "ma", "me", "mon", "my", "of", "pour", "the", "to",
  "un", "une", "what", "with",
]);

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

function tokenizeSearchQuery(query: string): string[] {
  return (normalizeSearchText(query).match(/[a-z0-9%]+/g) ?? [])
    .filter((term) => !/^\d+(?:[.,]\d+)?$/.test(term) && !SEARCH_STOP_WORDS.has(term));
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

function scoreTerm(
  term: string,
  name: string,
  description: string,
  tags: string[],
  aliases: string[],
  categories: string[],
  haystack: string,
): number {
  let score = 0;
  if (name === term) score += 100;
  if (name.startsWith(term)) score += 60;
  if (name.includes(term)) score += 40;
  if (tags.some((tag) => tag === term)) score += 35;
  if (aliases.some((alias) => alias === term)) score += 35;
  if (categories.some((category) => category === term)) score += 25;
  if (tags.some((tag) => tag.startsWith(term))) score += 25;
  if (aliases.some((alias) => alias.startsWith(term))) score += 25;
  if (categories.some((category) => category.startsWith(term))) score += 15;
  if (description.includes(term)) score += 20;

  if (score === 0 && hasFuzzyTermMatch(term, haystack)) {
    score += 12;
  }

  return score;
}

export function searchTools(tools: readonly Tool[], query: string, locale: Locale = "fr"): ToolSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const terms = tokenizeSearchQuery(normalizedQuery);
  if (terms.length === 0) return [];

  return tools.filter(isPublishedTool).map((tool) => {
    const content = getToolContent(tool, locale);
    const name = normalizeSearchText(content.name);
    const description = normalizeSearchText(content.description);
    const aliases = tool.aliases.map(normalizeSearchText);
    const tags = tool.tags.map(normalizeSearchText);
    const categories = [...new Set([getPrimaryToolCategory(tool), ...tool.categories].filter(Boolean))].map(normalizeSearchText);
    const haystack = getSearchText(tool, locale);

    const termScores = terms.map((term) => scoreTerm(term, name, description, tags, aliases, categories, haystack));
    const matchedTerms = termScores.filter((score) => score > 0).length;
    if (matchedTerms === 0) return { tool, score: 0 };

    const allTermsMatch = matchedTerms === terms.length;
    const score = termScores.reduce((total, termScore) => total + termScore, 0)
      + (allTermsMatch ? 30 : matchedTerms * 8);

    return { tool, score };
  }).filter(({ score }) => score > 0).sort((a, b) => {
    const aName = getToolContent(a.tool, locale).name;
    const bName = getToolContent(b.tool, locale).name;
    return b.score - a.score || aName.localeCompare(bName, locale);
  });
}
