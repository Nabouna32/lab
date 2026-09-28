import assert from "node:assert/strict";
import { test } from "node:test";
import { copyTextToClipboard } from "./copy.ts";

test("copyTextToClipboard writes text through the browser clipboard", async () => {
  const originalNavigator = globalThis.navigator;
  let copied = "";

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { clipboard: { writeText: async (value) => { copied = value; } } },
  });

  try {
    assert.equal(await copyTextToClipboard("Loculary"), true);
    assert.equal(copied, "Loculary");
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }
});

test("copyTextToClipboard reports clipboard failures without throwing", async () => {
  const originalNavigator = globalThis.navigator;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { clipboard: { writeText: async () => { throw new Error("denied"); } } },
  });

  try {
    assert.equal(await copyTextToClipboard("Loculary"), false);
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }
});

test("copyTextToClipboard reports unavailable browser clipboard APIs", async () => {
  const originalNavigator = globalThis.navigator;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {},
  });

  try {
    assert.equal(await copyTextToClipboard("Loculary"), false);
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  }
});
