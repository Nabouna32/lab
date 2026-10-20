import { strict as assert } from "node:assert";
import test from "node:test";
import { getNextCronRuns, parseCronExpression } from "./cron-expression.ts";

test("parses a classic five-field weekday expression", () => {
  const schedule = parseCronExpression("0 9 * * 1-5");
  assert.deepEqual(schedule.fields.minute.values, [0]);
  assert.deepEqual(schedule.fields.hour.values, [9]);
  assert.deepEqual(schedule.fields.dayOfWeek.values, [1, 2, 3, 4, 5]);
});

test("extends a single-value step through the field maximum", () => {
  const schedule = parseCronExpression("5/10 8/6 * * *");
  assert.deepEqual(schedule.fields.minute.values, [5, 15, 25, 35, 45, 55]);
  assert.deepEqual(schedule.fields.hour.values, [8, 14, 20]);
});

test("accepts Sunday as both 0 and 7", () => {
  const schedule = parseCronExpression("0 0 * * 7");
  assert.deepEqual(schedule.fields.dayOfWeek.values, [0, 7]);
});

test("rejects unsupported field counts and ranges", () => {
  assert.throws(() => parseCronExpression("0 0 * *"));
  assert.throws(() => parseCronExpression("60 * * * *"));
  assert.throws(() => parseCronExpression("0 25 * * *"));
  assert.throws(() => parseCronExpression("0 0 * * 8"));
  assert.throws(() => parseCronExpression("1e1 * * * *"));
  assert.throws(() => parseCronExpression("1.0 * * * *"));
  assert.throws(() => parseCronExpression("+1 * * * *"));
  assert.throws(() => parseCronExpression("0 0 */1e1 * *"));
  assert.throws(() => parseCronExpression("0 0 1e1-20 * *"));
});

test("uses Cron's OR semantics when both day fields are restricted", () => {
  const schedule = parseCronExpression("0 9 1 * 1");
  const runs = getNextCronRuns(schedule, new Date(2026, 5, 29, 8, 0), 3);
  assert.deepEqual(runs.map((date) => date.toDateString()), [
    new Date(2026, 5, 29, 9, 0).toDateString(),
    new Date(2026, 6, 1, 9, 0).toDateString(),
    new Date(2026, 6, 6, 9, 0).toDateString(),
  ]);
});

test("finds the next leap-day run even when it is more than 366 days away", () => {
  const schedule = parseCronExpression("0 0 29 2 *");
  const runs = getNextCronRuns(schedule, new Date(2025, 2, 1, 12, 0), 1);
  assert.equal(runs.length, 1);
  assert.equal(runs[0]?.getFullYear(), 2028);
  assert.equal(runs[0]?.getMonth(), 1);
  assert.equal(runs[0]?.getDate(), 29);
  assert.equal(runs[0]?.getHours(), 0);
  assert.equal(runs[0]?.getMinutes(), 0);
});

test("finds a leap-day schedule across the non-leap century year", () => {
  const schedule = parseCronExpression("0 0 29 2 *");
  const runs = getNextCronRuns(schedule, new Date(2097, 2, 1, 12, 0), 1);
  assert.equal(runs.length, 1);
  assert.equal(runs[0]?.getFullYear(), 2104);
  assert.equal(runs[0]?.getMonth(), 1);
  assert.equal(runs[0]?.getDate(), 29);
});

test("returns no runs for invalid reference dates or non-integer counts", () => {
  const schedule = parseCronExpression("0 0 * * *");
  assert.deepEqual(getNextCronRuns(schedule, new Date(Number.NaN), 1), []);
  assert.deepEqual(getNextCronRuns(schedule, new Date(2026, 0, 1), 1.5), []);
});

test("finds the next midnight runs", () => {
  const schedule = parseCronExpression("0 0 * * *");
  const runs = getNextCronRuns(schedule, new Date(2026, 0, 1, 12, 0), 2);
  assert.equal(runs[0]?.getHours(), 0);
  assert.equal(runs[0]?.getMinutes(), 0);
  assert.equal(runs[1]?.getDate(), 3);
});
