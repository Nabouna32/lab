import assert from "node:assert/strict";
import test from "node:test";
import { calculateAge } from "./age.ts";

function date(value) {
  return new Date(`${value}T12:00:00`);
}

test("calculates years, months and days", () => {
  assert.deepEqual(calculateAge(date("2000-01-15"), date("2026-09-17")), {
    years: 26,
    months: 8,
    days: 2,
  });
});

test("handles a birthday exactly", () => {
  assert.deepEqual(calculateAge(date("2000-09-17"), date("2026-09-17")), {
    years: 26,
    months: 0,
    days: 0,
  });
});

test("treats a February 29 birthday as reaching its anniversary on February 28 in non-leap years", () => {
  assert.deepEqual(calculateAge(date("2024-02-29"), date("2025-02-28")), {
    years: 1,
    months: 0,
    days: 0,
  });
  assert.deepEqual(calculateAge(date("2024-02-29"), date("2025-02-27")), {
    years: 0,
    months: 11,
    days: 29,
  });
});

test("clamps month-end anniversaries sequentially", () => {
  assert.deepEqual(calculateAge(date("2026-01-31"), date("2026-03-30")), {
    years: 0,
    months: 2,
    days: 2,
  });
  assert.deepEqual(calculateAge(date("2026-03-31"), date("2026-05-30")), {
    years: 0,
    months: 2,
    days: 0,
  });
});

test("ignores time-of-day because age is based on calendar dates", () => {
  assert.deepEqual(
    calculateAge(new Date("2000-09-17T23:59:00"), new Date("2026-09-17T00:01:00")),
    { years: 26, months: 0, days: 0 },
  );
});

test("returns null when the birth calendar date is after the reference date", () => {
  assert.equal(calculateAge(date("2026-09-18"), date("2026-09-17")), null);
});
