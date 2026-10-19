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
  assert.deepEqual(transformCsvJson(JSON.stringify([{ name: "Alice", note: 'Hello, "world"' }]), "json-to-csv"), {
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
  assert.equal(transformCsvJson('name,note\nAlice,"broken"x', "csv-to-json").error, "invalid-csv");
});


test("auto-detects semicolon-delimited CSV", () => {
  assert.deepEqual(JSON.parse(transformCsvJson("name;age\nAlice;30", "csv-to-json").value!), [
    { name: "Alice", age: "30" },
  ]);
});

test("rejects rows with inconsistent column counts", () => {
  assert.equal(transformCsvJson("name,age\nAlice,30,extra", "csv-to-json").error, "invalid-csv");
});

test("accepts a UTF-8 BOM before CSV headers", () => {
  assert.equal(transformCsvJson("\uFEFFname,age\nAlice,30", "csv-to-json").error, null);
});

test("auto-detects semicolon delimiters when headers contain quoted commas", () => {
  assert.deepEqual(
    JSON.parse(transformCsvJson('"Name, First";Age\nAlice;30', "csv-to-json").value!),
    [{ "Name, First": "Alice", Age: "30" }],
  );
});

test("auto-detects comma delimiters when headers contain quoted semicolons", () => {
  assert.deepEqual(
    JSON.parse(transformCsvJson('"Name; First",Age\nAlice,30', "csv-to-json").value!),
    [{ "Name; First": "Alice", Age: "30" }],
  );
});


test("neutralizes spreadsheet formulas in exported string cells and headers", () => {
  const result = transformCsvJson(JSON.stringify([
    { "=HYPERLINK(""https://example.com"",""open"")": "=1+1", note: "  +SUM(1,1)" },
    { "=HYPERLINK(""https://example.com"",""open"")": "-cmd|/C calc", note: "@SUM(1,1)" },
  ]), "json-to-csv");
  assert.equal(result.error, null);
  assert.equal(
    result.value,
    "'=HYPERLINK(""https://example.com"",""open"")','=1+1,note\r\n'-cmd|/C calc,'  +SUM(1,1)\r\n'@SUM(1,1),',
  );
});

test("preserves numeric negative values in CSV export", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ amount: -12 }]), "json-to-csv").value, "amount\r\n-12");
});

test("neutralizes formula markers after leading control characters", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ value: "\t=1+1" }]), "json-to-csv").value, "value\r\n'\t=1+1");
});
