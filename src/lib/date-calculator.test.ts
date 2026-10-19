import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { calculateDateAdjustment, parseDateInput } from "./date-calculator.ts";

function date(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

describe("calculateDateAdjustment", () => {
  it("adds days", () => {
    assert.equal(calculateDateAdjustment(date("2026-01-10"), 5, "days", "add")?.toISOString(), date("2026-01-15").toISOString());
  });

  it("subtracts weeks", () => {
    assert.equal(calculateDateAdjustment(date("2026-01-15"), 2, "weeks", "subtract")?.toISOString(), date("2026-01-01").toISOString());
  });

  it("clamps January 31 plus one month to February", () => {
    assert.equal(calculateDateAdjustment(date("2026-01-31"), 1, "months", "add")?.toISOString(), date("2026-02-28").toISOString());
  });

  it("keeps leap-day month arithmetic valid", () => {
    assert.equal(calculateDateAdjustment(date("2024-02-29"), 1, "years", "add")?.toISOString(), date("2025-02-28").toISOString());
  });

  it("clamps backward month arithmetic", () => {
    assert.equal(calculateDateAdjustment(date("2026-03-31"), 1, "months", "subtract")?.toISOString(), date("2026-02-28").toISOString());
  });

  it("rejects invalid amounts", () => {
    assert.equal(calculateDateAdjustment(date("2026-01-01"), -1, "days", "add"), null);
    assert.equal(calculateDateAdjustment(date("2026-01-01"), 1.5, "days", "add"), null);
  });

  it("rejects month and year adjustments outside the supported Date range", () => {
    const start = date("2026-01-01");
    assert.equal(calculateDateAdjustment(start, Number.MAX_SAFE_INTEGER, "months", "add"), null);
    assert.equal(calculateDateAdjustment(start, Number.MAX_SAFE_INTEGER, "years", "subtract"), null);
  });
});

describe("parseDateInput", () => {
  it("accepts a real calendar date", () => {
    assert.equal(parseDateInput("2024-02-29")?.getFullYear(), 2024);
    assert.equal(parseDateInput("2024-02-29")?.getMonth(), 1);
    assert.equal(parseDateInput("2024-02-29")?.getDate(), 29);
  });

  it("rejects impossible dates instead of normalizing them", () => {
    assert.equal(parseDateInput("2026-02-31"), null);
    assert.equal(parseDateInput("2026-04-31"), null);
    assert.equal(parseDateInput("2025-02-29"), null);
  });

  it("rejects values that are not in the date input format", () => {
    assert.equal(parseDateInput(""), null);
    assert.equal(parseDateInput("2026-2-03"), null);
    assert.equal(parseDateInput("not-a-date"), null);
  });
});
