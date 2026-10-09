import assert from "node:assert/strict";
import { test } from "node:test";
import { executeToolSearch } from "./search-request.ts";

for (const locale of ["fr", "en"]) {
  test("reports a failed lazy search load and recovers on retry (" + locale + ")", async () => {
    let shouldFail = true;
    const calls = [];
    const loadSearchClient = async () => {
      if (shouldFail) throw new Error("Simulated lazy chunk failure");
      return {
        searchToolCatalog(query, requestedLocale) {
          calls.push({ query, locale: requestedLocale });
          return Array.from({ length: 8 }, (_, index) => ({
            tool: { id: "tool-" + index },
            score: 100 - index,
          }));
        },
      };
    };

    const query = locale === "fr" ? "pourcentage" : "percentage";
    const failed = await executeToolSearch(query, locale, loadSearchClient);
    assert.deepEqual(failed, { status: "error" });

    shouldFail = false;
    const recovered = await executeToolSearch(query, locale, loadSearchClient);
    assert.equal(recovered.status, "success");
    if (recovered.status !== "success") return;
    assert.equal(recovered.results.length, 6);
    assert.equal(recovered.results[0].tool.id, "tool-0");
    assert.deepEqual(calls, [{ query, locale }]);
  });
}
