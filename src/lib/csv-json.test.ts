import assert from "node:assert/strict";
import { test } from "node:test";
import { transformCsvJson } from "./csv-json.ts";

test("converts CSV with quoted commas and escaped quotes to JSON", () => {
  assert.deepEqual(JSON.parse(transformCsvJson('name,note\nAlice,"Hello, ""world"""',"csv-to-json").value!), [
    { name: "Alice", note: 'Hello, "world"' },
  ]);
});
test("converts CSV fields containing newlines", () => {
  assert.equal(transformCsvJson('name,note\nAlice,"line one\nline two"',"csv-to-json").error, null);
});
test("converts JSON objects to CSV and escapes values", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ name: "Alice", note: 'Hello, "world"' }]),"json-to-csv"), {
    value: 'name,note\r\nAlice,"Hello, ""world"""',
    error: null,
  });
});
test("preserves union of JSON object keys", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ a: 1 }, { b: 2 }]),"json-to-csv").value, 'a,b\r\n1,\r\n,2');
});
test("rejects JSON values that are not an array of objects", () => {
  assert.equal(transformCsvJson('{"name":"Alice"}',"json-to-csv").error, "unsupported-json");
});
test("rejects malformed CSV quoting", () => {
  assert.equal(transformCsvJson('name,note\nAlice,"broken'," ,"csv-to-json").error, "invalid-csv");
});
