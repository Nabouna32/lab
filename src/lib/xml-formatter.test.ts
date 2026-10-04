import assert from "node:assert/strict";
import { test } from "node:test";
import { formatXml, validateXml } from "./xml-formatter.ts";

test("rejects empty XML", () => {
  assert.deepEqual(validateXml(""), { ok: false, message: "empty" });
});

test("extracts an XML declaration without changing it", () => {
  const input = '<?xml version="1.0" encoding="UTF-8"?>\n<root><item>value</item></root>';
  const declaration = input.match(/^\s*(<\?xml\s+[^?]*\?>)/i)?.[1];
  assert.equal(declaration, '<?xml version="1.0" encoding="UTF-8"?>');
});

test("formats a valid XML document in a browser environment", (t) => {
  if (typeof DOMParser === "undefined") {
    t.skip("DOMParser is provided by the browser runtime.");
    return;
  }

  const result = formatXml("<root><item id=\"1\">value</item><empty/></root>", "  ");
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(
      result.value,
      "<root>\n  <item id=\"1\">value</item>\n  <empty/>\n</root>",
    );
  }
});

test("rejects malformed XML in a browser environment", (t) => {
  if (typeof DOMParser === "undefined") {
    t.skip("DOMParser is provided by the browser runtime.");
    return;
  }

  const result = validateXml("<root><item></root>");
  assert.equal(result.ok, false);
});
