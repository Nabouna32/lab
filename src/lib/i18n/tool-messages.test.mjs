import test from "node:test";
import assert from "node:assert/strict";
import { locales } from "./config.ts";
import { getToolMessages } from "./tool-messages.ts";
import { getDownloadDurationLabels, getDownloadSizeUnitLabel, getDownloadSpeedUnitLabel, getFileSizeUnitLabel, getSpeedUnitLabel, formatDurationPart } from "./units.ts";

test("tool UI messages are available in every enabled locale", () => {
  for (const locale of locales) {
    const messages = getToolMessages(locale);
    assert.ok(messages.age.birthDate.length > 0);
    assert.ok(messages.age.emptyResult.length > 0);
    assert.ok(messages.duration.startDate.length > 0);
    assert.ok(messages.duration.emptyResult.length > 0);
    assert.ok(messages.percentage.result.length > 0);
    assert.ok(messages.reduction.price.length > 0);
    assert.ok(messages.ruleOfThree.result.length > 0);
    assert.ok(messages.vat.rate.length > 0);
    assert.ok(messages.fileSize.value.length > 0);
    assert.ok(messages.fileSize.emptyResult.length > 0);
    assert.ok(messages.downloadTime.estimated.length > 0);
    assert.ok(messages.downloadSpeed.value.length > 0);
    assert.ok(messages.downloadSpeed.emptyResult.length > 0);
    assert.ok(messages.downloadTime.estimated.length > 0);
  }
});

test("unit labels are centralized and localized", () => {
  assert.equal(getFileSizeUnitLabel("fr", "mo"), "Mo");
  assert.equal(getFileSizeUnitLabel("en", "mo"), "MB");
  assert.equal(getSpeedUnitLabel("fr", "mbps"), "Mbit/s");
  assert.equal(getSpeedUnitLabel("en", "mbps"), "Mbit/s");
  assert.equal(getDownloadSizeUnitLabel("fr", "go"), "Go");
  assert.equal(getDownloadSizeUnitLabel("en", "go"), "GB");
  assert.equal(getDownloadSpeedUnitLabel("fr", "mo-s"), "Mo/s");
  assert.equal(getDownloadSpeedUnitLabel("en", "mo-s"), "MB/s");
  assert.equal(getDownloadDurationLabels("fr").day, "j");
  assert.equal(getDownloadDurationLabels("en").day, "d");
  assert.equal(formatDurationPart("fr", "days", 1), "1 jour");
  assert.equal(formatDurationPart("fr", "days", 2), "2 jours");
  assert.equal(formatDurationPart("en", "hours", 1), "1 hour");
  assert.equal(formatDurationPart("en", "hours", 2), "2 hours");
});

test("tool UI messages expose locale-specific wording", () => {
  assert.notEqual(getToolMessages("fr").age.birthDate, getToolMessages("en").age.birthDate);
  assert.notEqual(getToolMessages("fr").percentage.modes.evolution.title, getToolMessages("en").percentage.modes.evolution.title);
});
