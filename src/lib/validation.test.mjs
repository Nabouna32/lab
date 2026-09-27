import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isValidEmail,
  isValidLength,
  isValidUuid,
  readFormString,
} from "./validation.ts";

test("validates email input", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("user@example"), false);
  assert.equal(isValidEmail("not an email"), false);
  assert.equal(isValidEmail("a".repeat(255) + "@example.com"), false);
});

test("validates UUID input", () => {
  assert.equal(isValidUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidUuid("not-a-uuid"), false);
  assert.equal(isValidUuid("550e8400-e29b-61d4-a716-446655440000"), false);
});

test("validates string length boundaries", () => {
  assert.equal(isValidLength("12345678", 8, 128), true);
  assert.equal(isValidLength("1234567", 8, 128), false);
  assert.equal(isValidLength("a".repeat(129), 8, 128), false);
});

test("rejects non-string form values", () => {
  const formData = new FormData();
  formData.set("value", new File(["content"], "input.txt"));
  assert.equal(readFormString(formData, "value"), null);
  formData.set("value", "valid");
  assert.equal(readFormString(formData, "value"), "valid");
});
