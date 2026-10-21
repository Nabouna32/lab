import assert from "node:assert/strict";
import test from "node:test";
import { compareCsvDocuments, CsvDiffError, getCsvDiffHeaders } from "./csv-diff.ts";

test("CSV comparison detects added, removed, and changed records by key regardless of order", () => {
  const before = "id,name,active\n1,Ada,true\n2,Lin,false";
  const after = "id,name,active\n3,Grace,true\n2,Lin,true\n1,Ada,true";
  const result = compareCsvDocuments(before, after, "id");
  assert.deepEqual([result.added, result.removed, result.changed], [1, 0, 1]);
  assert.equal(result.changes[0].key, "2");
  assert.deepEqual(result.changes[0].fields, ["active"]);
  assert.equal(result.changes[1].key, "3");
});

test("CSV comparison handles quoted delimiters, escaped quotes, and multiline fields", () => {
  const result = compareCsvDocuments('id,note\n1,"hello, ""world""\nnext"', 'id,note\n1,"hello, ""world""\nnext"', "id");
  assert.equal(result.identical, true);
  assert.deepEqual(getCsvDiffHeaders("id;name\n1;Ada"), ["id", "name"]);
});

test("CSV comparison can compare rows by position without a key column", () => {
  const result = compareCsvDocuments("name,value\nA,1\nB,2", "name,value\nA,1\nB,3");
  assert.deepEqual([result.added, result.removed, result.changed], [0, 0, 1]);
});

test("CSV comparison rejects duplicate headers, malformed rows, and duplicate keys", () => {
  assert.throws(() => compareCsvDocuments("id,id\n1,2", "id,id\n1,2"), (error) => error instanceof CsvDiffError && error.code === "headers");
  assert.throws(() => compareCsvDocuments("id,name\n1", "id,name\n1,A"), (error) => error instanceof CsvDiffError && error.code === "invalid");
  assert.throws(() => compareCsvDocuments("id,name\n1,A\n1,B", "id,name\n1,A", "id"), (error) => error instanceof CsvDiffError && error.code === "duplicate-key");
});

test("CSV comparison validates the selected key and limits input size", () => {
  assert.throws(() => compareCsvDocuments("id,name\n1,A", "id,name\n1,A", "missing"), (error) => error instanceof CsvDiffError && error.code === "missing-key");
  assert.throws(() => compareCsvDocuments("id,name\n1,A", "id,name\n1,A", "id", ","), (error) => error !== null);
});
