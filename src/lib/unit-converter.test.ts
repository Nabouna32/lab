import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertUnit } from "./unit-converter.ts";

describe("convertUnit", () => {
  it("converts length in both directions", () => {
    assert.equal(convertUnit(1, "length", "km", "m"), 1000);
    assert.equal(convertUnit(1000, "length", "m", "km"), 1);
    assert.equal(convertUnit(1, "length", "in", "cm"), 2.54);
  });

  it("converts mass and volume", () => {
    assert.equal(convertUnit(1, "mass", "kg", "g"), 1000);
    assert.equal(convertUnit(1, "volume", "l", "ml"), 1000);
    assert.ok(Math.abs((convertUnit(1, "volume", "cup", "ml") ?? 0) - 236.5882365) < 1e-9);
  });

  it("converts area using squared units", () => {
    assert.equal(convertUnit(1, "area", "m2", "cm2"), 10000);
    assert.equal(convertUnit(1, "area", "km2", "m2"), 1000000);
  });

  it("converts temperature with negative Celsius and Fahrenheit values", () => {
    assert.equal(convertUnit(0, "temperature", "c", "f"), 32);
    assert.equal(convertUnit(32, "temperature", "f", "c"), 0);
    assert.equal(convertUnit(-40, "temperature", "c", "f"), -40);
    assert.equal(convertUnit(0, "temperature", "k", "c"), -273.15);
  });

  it("accepts absolute zero in Celsius, Fahrenheit, and Kelvin without admitting colder values", () => {
    assert.equal(convertUnit(-273.15, "temperature", "c", "k"), 0);
    assert.equal(convertUnit(-459.67, "temperature", "f", "k"), 0);
    assert.equal(convertUnit(0, "temperature", "k", "c"), -273.15);
    assert.equal(convertUnit(-273.150001, "temperature", "c", "k"), null);
    assert.equal(convertUnit(-459.670001, "temperature", "f", "k"), null);
    assert.equal(convertUnit(-0.000001, "temperature", "k", "c"), null);
  });

  it("rejects impossible Kelvin values and negative physical quantities", () => {
    assert.equal(convertUnit(-1, "temperature", "k", "c"), null);
    assert.equal(convertUnit(-1, "length", "m", "cm"), null);
    assert.equal(convertUnit(-1, "mass", "kg", "g"), null);
    assert.equal(convertUnit(-1, "volume", "l", "ml"), null);
    assert.equal(convertUnit(-1, "area", "m2", "cm2"), null);
  });

  it("accepts zero and same-unit conversions", () => {
    assert.equal(convertUnit(0, "length", "m", "km"), 0);
    assert.equal(convertUnit(12.5, "mass", "kg", "kg"), 12.5);
  });

  it("rejects non-finite, unknown, and excessively large values", () => {
    assert.equal(convertUnit(Number.NaN, "length", "m", "cm"), null);
    assert.equal(convertUnit(Number.POSITIVE_INFINITY, "length", "m", "cm"), null);
    assert.equal(convertUnit(1e101, "length", "m", "cm"), null);
    assert.equal(convertUnit(1, "length", "unknown", "cm"), null);
  });

  it("rejects conversions whose result exceeds the numeric safety limit", () => {
    assert.equal(convertUnit(1e100, "length", "m", "mm"), null);
  });
});
