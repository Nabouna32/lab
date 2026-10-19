import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../components/tools/date-calculator/DateCalculator.tsx", import.meta.url), "utf8");

test("date calculator validates missing values and only describes a rendered error", () => {
  assert.match(
    source,
    /const invalid = startDate === "" \|\| parsedDate === null \|\| amount === "" \|\| numericAmount === null \|\| result === null;/,
  );
  assert.equal(
    (source.match(/aria-describedby=\{invalid \? "date-calculator-error" : undefined\}/g) ?? []).length,
    2,
  );
});
