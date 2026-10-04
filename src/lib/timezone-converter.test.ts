import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  convertTimeZone,
  formatOffset,
  getTimeZoneOptions,
  isSupportedTimeZone,
} from "./timezone-converter.ts";

describe("convertTimeZone", () => {
  it("converts Paris winter time to New York", () => {
    const result = convertTimeZone("2024-01-15T12:00", "Europe/Paris", "America/New_York");
    assert.equal(result?.destination.year, 2024);
    assert.equal(result?.destination.month, 1);
    assert.equal(result?.destination.day, 15);
    assert.equal(result?.destination.hour, 6);
    assert.equal(result?.destination.minute, 0);
    assert.equal(result?.sourceOffsetMinutes, 60);
    assert.equal(result?.destinationOffsetMinutes, -300);
    assert.equal(result?.status, "exact");
  });

  it("handles a destination crossing midnight", () => {
    const result = convertTimeZone("2024-07-01T23:30", "America/Los_Angeles", "Asia/Tokyo");
    assert.equal(result?.destination.year, 2024);
    assert.equal(result?.destination.month, 7);
    assert.equal(result?.destination.day, 2);
    assert.equal(result?.destination.hour, 15);
    assert.equal(result?.destination.minute, 30);
  });

  it("identifies a spring-forward gap", () => {
    assert.equal(
      convertTimeZone("2024-03-10T02:30", "America/New_York", "Europe/Paris"),
      null,
    );
  });

  it("identifies a repeated fall-back time and chooses the earlier instant", () => {
    const result = convertTimeZone("2024-11-03T01:30", "America/New_York", "Europe/Paris");
    assert.equal(result?.status, "ambiguous");
    assert.equal(result?.instant.toISOString(), "2024-11-03T05:30:00.000Z");
    assert.equal(result?.destination.hour, 6);
  });

  it("rejects malformed local date-time", () => {
    assert.equal(convertTimeZone("not-a-date", "Europe/Paris", "UTC"), null);
  });

  it("rejects unknown time zones", () => {
    assert.equal(convertTimeZone("2024-01-15T12:00", "Not/AZone", "UTC"), null);
  });
});

describe("time zone utilities", () => {
  it("recognizes UTC", () => {
    assert.equal(isSupportedTimeZone("UTC"), true);
  });

  it("provides a non-empty IANA zone list", () => {
    const zones = getTimeZoneOptions();
    assert.ok(zones.length > 100);
    assert.ok(zones.includes("Europe/Paris"));
  });

  it("formats positive, negative, and zero offsets", () => {
    assert.equal(formatOffset(0), "UTC");
    assert.equal(formatOffset(60), "UTC+01:00");
    assert.equal(formatOffset(-300), "UTC-05:00");
  });
});
