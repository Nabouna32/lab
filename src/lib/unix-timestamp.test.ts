import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dateTimeLocalToTimestamp, timestampToDate } from "./unix-timestamp";

describe("timestampToDate", () => {
  it("converts Unix seconds", () => {
    assert.equal(timestampToDate(0, "seconds")?.iso, "1970-01-01T00:00:00.000Z");
  });

  it("converts Unix milliseconds", () => {
    assert.equal(timestampToDate(1_700_000_000_000, "milliseconds")?.iso, "2023-11-14T22:13:20.000Z");
  });

  it("accepts negative timestamps", () => {
    assert.equal(timestampToDate(-1, "seconds")?.iso, "1969-12-31T23:59:59.000Z");
  });

  it("rejects non-finite values", () => {
    assert.equal(timestampToDate(Number.NaN, "seconds"), null);
  });

  it("rejects overflow", () => {
    assert.equal(timestampToDate(Number.MAX_VALUE, "milliseconds"), null);
  });
});

describe("dateTimeLocalToTimestamp", () => {
  it("converts a local date-time in the runtime timezone", () => {
    const result = dateTimeLocalToTimestamp("1970-01-01T00:00");
    assert.ok(result?.date instanceof Date);
    assert.equal(result?.timestampMilliseconds, new Date("1970-01-01T00:00").getTime());
  });

  it("rejects an empty value", () => {
    assert.equal(dateTimeLocalToTimestamp(""), null);
  });
});
