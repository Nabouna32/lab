import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const calculators = [
  {
    name: "compound interest",
    url: new URL("../compound-interest/CompoundInterestCalculator.tsx", import.meta.url),
    values: ["principalValue", "rateValue", "yearsValue", "contributionValue"],
  },
  {
    name: "VAT",
    url: new URL("../tva/TVACalculator.tsx", import.meta.url),
    values: ["priceValue", "rateValue"],
  },
  {
    name: "discount",
    url: new URL("../reduction/ReductionCalculator.tsx", import.meta.url),
    values: ["priceValue", "discountValue"],
  },
];

for (const calculator of calculators) {
  test(`${calculator.name} accepts locale-aware decimal input`, async () => {
    const source = await readFile(calculator.url, "utf8");

    assert.match(source, /parseLocalizedNumber/);
    assert.match(source, /type="text" inputMode="decimal"/);

    for (const value of calculator.values) {
      assert.ok(
        source.includes(`parseLocalizedNumber(${value}, locale)`),
        `Expected ${value} to be parsed with the active locale`,
      );
      assert.ok(
        !source.includes(`Number(${value})`),
        `Unexpected locale-insensitive Number(${value}) parsing`,
      );
    }
  });
}
