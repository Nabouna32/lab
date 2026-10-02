import { describe, expect, it } from "vitest";
import { dateTimeLocalToTimestamp, timestampToDate } from "./unix-timestamp";

describe("timestampToDate", () => {
  it("converts Unix seconds", () => {
    expect(timestampToDate(0, "seconds")?.iso).toBe("1970-01-01T00:00:00.000Z");
  });

  it("converts Unix milliseconds", () => {
    expect(timestampToDate(1_700_000_000_000, "milliseconds")?.iso).toBe("2023-11-14T22:13:20.000Z");
  });

  it("accepts negative timestamps", () => {
    expect(timestampToDate(-1, "seconds")?.iso).toBe("1969-12-31T23:59:59.000Z");
  });

  it("rejects non-finite values", () => {
    expect(timestampToDate(Number.NaN, "seconds")).toBeNull();
  });
});

describe("dateTimeLocalToTimestamp", () => {
  it("converts a local date-time in the runtime timezone", () => {
    const result = dateTimeLocalToTimestamp("1970-01-01T00:00");
    expect(result?.date).toBeInstanceOf(Date);
    expect(result?.timestampMilliseconds).toBe(new Date("1970-01-01T00:00").getTime());
  });

  it("rejects an empty value", () => {
    expect(dateTimeLocalToTimestamp("")).toBeNull();
  });
});
