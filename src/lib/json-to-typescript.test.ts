import assert from "node:assert/strict";
import { test } from "node:test";
import { generateTypeScript } from "./json-to-typescript.ts";

test("generates interfaces for nested JSON objects", () => {
  const result = generateTypeScript('{"user":{"name":"Alice","active":true},"tags":["admin","user"]}', "Profile");
  assert.equal(result.error, null);
  assert.match(result.value!, /export interface ProfileUser/);
  assert.match(result.value!, /user: ProfileUser;/);
  assert.match(result.value!, /tags: string\[\];/);
});

test("marks properties missing from some array objects as optional", () => {
  const result = generateTypeScript('[{"id":1,"name":"Alice"},{"id":2}]', "User");
  assert.equal(result.error, null);
  assert.match(result.value!, /name\?: string;/);
});

test("handles nulls and unions", () => {
  const result = generateTypeScript('[{"value":1},{"value":"two"},{"value":null}]', "Item");
  assert.equal(result.error, null);
  assert.match(result.value!, /value: (number \| string \| null|string \| number \| null|number \| null \| string);/);
});

test("quotes invalid TypeScript property names", () => {
  const result = generateTypeScript('{"first-name":"Alice","default":true}', "Root");
  assert.equal(result.error, null);
  assert.match(result.value!, /"first-name": string;/);
  assert.match(result.value!, /"default": boolean;/);
});

test("rejects invalid JSON and unsupported scalar roots", () => {
  assert.equal(generateTypeScript("{", "Root").error, "invalid-json");
  assert.equal(generateTypeScript("42", "Root").error, "unsupported-root");
});

test("preserves unions inside arrays", () => {
  const result = generateTypeScript('{"values":[1,"two",true]}', "Data");
  assert.equal(result.error, null);
  assert.match(result.value!, /values: Array<number \| string \| boolean>;/);
});
