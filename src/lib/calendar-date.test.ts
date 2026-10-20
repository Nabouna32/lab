import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  addCalendarMonthsClamped,
  createCalendarDate,
  daysInCalendarMonth,
  parseCalendarDate,
} from "./calendar-date.ts";

describe("parseCalendarDate", () => {
  it("parses years below 100 without the Date constructor's 1900 offset", () => {
    const date = parseCalendarDate("0001-06-15");
    assert.ok(date);
    assert.equal(date.getFullYear(), 1);
    assert.equal(date.getMonth(), 5);
    assert.equal(date.getDate(), 15);
  });

  it("accepts leap days only in leap years, including years below 100", () => {
    assert.equal(parseCalendarDate("0004-02-29")?.getFullYear(), 4);
    assert.equal(parseCalendarDate("0001-02-29"), null);
    assert.equal(parseCalendarDate("0000-01-01"), null);
  });

  it("rejects impossible dates rather than normalizing them", () => {
    assert.equal(parseCalendarDate("2026-02-31"), null);
    assert.equal(parseCalendarDate("2026-13-01"), null);
    assert.equal(parseCalendarDate("2026-00-10"), null);
  });
});

describe("calendar date arithmetic", () => {
  it("counts days correctly in early calendar years", () => {
    assert.equal(daysInCalendarMonth(1, 1), 28);
    assert.equal(daysInCalendarMonth(4, 1), 29);
    assert.equal(daysInCalendarMonth(100, 1), 28);
  });

  it("clamps month changes without changing the calendar century", () => {
    const result = addCalendarMonthsClamped(createCalendarDate(1, 0, 31), 1);
    assert.equal(result.getFullYear(), 1);
    assert.equal(result.getMonth(), 1);
    assert.equal(result.getDate(), 28);
  });

  it("handles a leap-day month change in an early year", () => {
    const result = addCalendarMonthsClamped(createCalendarDate(4, 1, 29), 12);
    assert.equal(result.getFullYear(), 5);
    assert.equal(result.getMonth(), 1);
    assert.equal(result.getDate(), 28);
  });
});
