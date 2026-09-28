import assert from "node:assert/strict";
import { test } from "node:test";
import { formatJson, getJsonFormatError, minifyJson } from "./json-formatter.ts";

test("formats nested JSON without changing scalar representations", () => {
  const input = '{ "name":"Loculary","items":[1,true,null,"é"] }';
  assert.equal(
    formatJson(input, { indent: "  " }),
    '{\n  "name": "Loculary",\n  "items": [\n    1,\n    true,\n    null,\n    "é"\n  ]\n}',
  );
});

test("minifies valid JSON", () => {
  assert.equal(minifyJson('{ "a": 1, "b": [ true, false ] }'), '{"a":1,"b":[true,false]}');
});

test("preserves large integer lexemes", () => {
  const input = '{"value":9007199254740993}';
  assert.equal(minifyJson(input), input);
});

test("preserves exponent and decimal representations", () => {
  const input = '{"a":1.2300,"b":1e+09,"c":-0}';
  assert.equal(minifyJson(input), input);
});

test("rejects trailing commas", () => {
  const error = getJsonFormatError('{ "a":1,}');
  assert.equal(error.line, 1);
  assert.equal(error.column, 10);
});

test("rejects unterminated strings", () => {
  const error = getJsonFormatError('{ "a":"hello}');
  assert.equal(error.line, 1);
  assert.equal(error.column, 7);
});

test("rejects invalid numbers", () => {
  assert.ok(getJsonFormatError('{ "a":01}').index >= 0);
  assert.ok(getJsonFormatError('{ "a":1.}').index >= 0);
  assert.ok(getJsonFormatError('{ "a":1e}').index >= 0);
});

test("accepts arrays, escaped strings, unicode and whitespace", () => {
  const input = '[\n    "line\\ntext",\n    "\\u2764",\n    "é",\n    { "nested": 42 }\n  ]';
  assert.equal(minifyJson(input), '["line\\ntext","\\u2764","é",{"nested":42}]');
});
