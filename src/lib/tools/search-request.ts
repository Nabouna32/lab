import type { Locale } from "@/lib/i18n/config";
import type { ToolSearchResult } from "./search";

type SearchClientModule = {
  searchToolCatalog(query: string, locale: Locale): ToolSearchResult[];
};

export type ToolSearchRequestResult =
  | { status: "success"; results: ToolSearchResult[] }
  | { status: "error" };

type SearchClientLoader = () => Promise<SearchClientModule>;

export async function executeToolSearch(
  query: string,
  locale: Locale,
  loadSearchClient: SearchClientLoader = () => import("./search-client"),
): Promise<ToolSearchRequestResult> {
  try {
    const { searchToolCatalog } = await loadSearchClient();
    return {
      status: "success",
      results: searchToolCatalog(query, locale).slice(0, 6),
    };
  } catch {
    return { status: "error" };
  }
}
