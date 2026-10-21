import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countTextLines,
  processTextLines,
  TEXT_LINE_PROCESSOR_MAX_CHARS,
  type TextLineProcessorOptions,
} from "./text-line-processor.ts";

const defaults: TextLineProcessorOptions = {
  trimLines: false,
  removeBlankLines: false,
  removeDuplicates: false,
  sortOrder: "none",
};

describe("processTextLines", () => {
  it("preserves order and empty lines unless requested", () => {
    assert.equal(processTextLines(" beta\n\nAlpha\n", defaults, "en"), " beta\n\nAlpha\n");
  });

  it("trims lines and removes blank lines", () => {
    assert.equal(processTextLines("  beta  \n  \n Alpha \n", {
      ...defaults, trimLines: true, removeBlankLines: true,
    }, "en"), "beta\nAlpha");
  });

  it("removes duplicates case-insensitively while preserving the first occurrence", () => {
    assert.equal(processTextLines("Alpha\nalpha\nBETA\nBeta\nAlpha ", {
      ...defaults, removeDuplicates: true,
    }, "en"), "Alpha\nBETA\nAlpha ");
  });

  it("can combine trimming, blank-line removal, de-duplication, and numeric-aware sorting", () => {
    assert.equal(processTextLines(" item 10 \nItem 2\n\nitem 2\nitem 1 ", {
      trimLines: true, removeBlankLines: true, removeDuplicates: true, sortOrder: "ascending",
    }, "en"), "item 1\nItem 2\nitem 10");
  });

  it("sorts descending without mutating the input order when sorting is disabled", () => {
    assert.equal(processTextLines("a\nC\nb", { ...defaults, sortOrder: "descending" }, "en"), "C\nb\na");
    assert.equal(processTextLines("a\nC\nb", defaults, "en"), "a\nC\nb");
  });

  it("handles empty input and counts trailing lines consistently", () => {
    assert.equal(processTextLines("", defaults, "en"), "");
    assert.equal(countTextLines(""), 0);
    assert.equal(countTextLines("one\ntwo\n"), 2);
  });

  it("rejects inputs above the documented resource limit", () => {
    assert.throws(
      () => processTextLines("x".repeat(TEXT_LINE_PROCESSOR_MAX_CHARS + 1), defaults, "en"),
      RangeError,
    );
  });
});
