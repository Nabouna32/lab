import assert from "node:assert/strict";
import { test } from "node:test";
import { CSV_JSON_MAX_FILE_BYTES, getCsvJsonOperationForFile, transformCsvJson } from "./csv-json.ts";

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
  const input = '[{"=1+1":"=1+1","note":"  +SUM(1,1)"},{"=1+1":"-cmd|/C calc","note":"@SUM(1,1)"}]';
  const result = transformCsvJson(input, "json-to-csv");
  assert.equal(result.error, null);
  assert.equal(
    result.value,
    "'=1+1,note\r\n'=1+1,\"'  +SUM(1,1)\"\r\n'-cmd|/C calc,\"'@SUM(1,1)\"",
  );
});

test("preserves numeric negative values in CSV export", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ amount: -12 }]), "json-to-csv").value, "amount\r\n-12");
});

test("neutralizes spreadsheet formulas after Unicode whitespace and C1 controls", () => {
  const input = JSON.stringify([
    { value: "\u00a0=1+1" },
    { value: "\u2003@SUM(1,1)" },
    { value: "\u0085-1+1" },
  ]);
  assert.equal(
    transformCsvJson(input, "json-to-csv").value,
    "value\r\n'\u00a0=1+1\r\n\"'\u2003@SUM(1,1)\"\r\n'\u0085-1+1",
  );
});

test("neutralizes formula markers after leading control characters", () => {
  assert.equal(transformCsvJson(JSON.stringify([{ value: "\t=1+1" }]), "json-to-csv").value, "value\r\n'\t=1+1");
});

test("preserves CSV columns named __proto__ without changing object prototypes", () => {
  const result = transformCsvJson("__proto__,constructor\npayload,example", "csv-to-json");
  assert.equal(result.error, null);
  assert.deepEqual(
    JSON.parse(result.value!),
    JSON.parse('[{"__proto__":"payload","constructor":"example"}]'),
  );
});

test("selects the conversion direction from supported file extensions", () => {
  assert.equal(getCsvJsonOperationForFile("records.csv"), "csv-to-json");
  assert.equal(getCsvJsonOperationForFile("records.CSV"), "csv-to-json");
  assert.equal(getCsvJsonOperationForFile("records.json"), "json-to-csv");
  assert.equal(getCsvJsonOperationForFile("records.JSON"), "json-to-csv");
  assert.equal(getCsvJsonOperationForFile("records.txt"), null);
  assert.equal(getCsvJsonOperationForFile("records"), null);
});

test("limits imported CSV and JSON file size to 200 kB", () => {
  assert.equal(CSV_JSON_MAX_FILE_BYTES, 200_000);
});

test("uses an explicitly selected comma delimiter instead of auto-detecting", () => {
  assert.deepEqual(
    JSON.parse(transformCsvJson("name;note\nAlice;one", "csv-to-json", ",").value!),
    [{ "name;note": "Alice;one" }],
  );
});

test("auto-detects delimiters only when auto mode is selected", () => {
  assert.deepEqual(
    JSON.parse(transformCsvJson("name;age\nAlice;30", "csv-to-json", "auto").value!),
    [{ name: "Alice", age: "30" }],
  );
  assert.deepEqual(
    JSON.parse(transformCsvJson("name;age\nAlice;30", "csv-to-json", ";").value!),
    [{ name: "Alice", age: "30" }],
  );
});

test("preserves explicitly delimited records whose fields are all empty", () => {
  const result = transformCsvJson("first,second,third\\nA,B,C\\n,,", "csv-to-json");
  assert.equal(result.error, null);
  assert.deepEqual(JSON.parse(result.value!), [
    { first: "A", second: "B", third: "C" },
    { first: "", second: "", third: "" },
  ]);
});

test("continues to ignore standalone blank lines between CSV records", () => {
  const result = transformCsvJson("name,age\\nAlice,30\\n\\nBob,40\\n", "csv-to-json");
  assert.equal(result.error, null);
  assert.deepEqual(JSON.parse(result.value!), [
    { name: "Alice", age: "30" },
    { name: "Bob", age: "40" },
  ]);
});
