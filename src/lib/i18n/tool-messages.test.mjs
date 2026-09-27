import test from "node:test";
import assert from "node:assert/strict";
import { locales } from "./config.ts";
import { getToolMessages } from "./tool-messages.ts";

test("tool UI messages are available in every enabled locale", () => {
  for (const locale of locales) {
    const messages = getToolMessages(locale);
    assert.ok(messages.age.birthDate.length > 0);
    assert.ok(messages.duration.startDate.length > 0);
    assert.ok(messages.percentage.result.length > 0);
    assert.ok(messages.reduction.price.length > 0);
    assert.ok(messages.ruleOfThree.result.length > 0);
    assert.ok(messages.vat.rate.length > 0);
    assert.ok(messages.fileSize.value.length > 0);
    assert.ok(messages.downloadTime.estimated.length > 0);
    assert.ok(messages.downloadSpeed.value.length > 0);
    assert.ok(messages.downloadTime.sizeUnits.ko.length > 0);
    assert.ok(messages.downloadTime.speedUnits.mbps.length > 0);
    assert.ok(messages.downloadTime.duration.second.length > 0);
    assert.ok(messages.downloadSpeed.shortUnits.mbps.length > 0);
  }
});

test("tool UI messages expose locale-specific wording", () => {
  assert.notEqual(getToolMessages("fr").age.birthDate, getToolMessages("en").age.birthDate);
  assert.notEqual(getToolMessages("fr").percentage.modes.evolution.title, getToolMessages("en").percentage.modes.evolution.title);
});

test("download units follow the localized decimal-unit conventions", () => {
  const fr = getToolMessages("fr");
  const en = getToolMessages("en");

  assert.deepEqual(fr.downloadTime.sizeUnits, { ko: "ko", mo: "Mo", go: "Go", to: "To" });
  assert.deepEqual(en.downloadTime.sizeUnits, { ko: "kB", mo: "MB", go: "GB", to: "TB" });
  assert.equal(fr.downloadSpeed.shortUnits["mo-s"], "Mo/s");
  assert.equal(en.downloadSpeed.shortUnits["mo-s"], "MB/s");
  assert.notEqual(fr.downloadSpeed.shortUnits.mbps, en.downloadSpeed.shortUnits.mbps);
});
