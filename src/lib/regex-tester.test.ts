import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { testRegex } from "./regex-tester.ts";

describe("testRegex", () => {
  it("finds all global matches and captures", () => {
    const result = testRegex("(\\d+)", "g", "a12 b34");
    assert.deepEqual(result.matches, [
      { value: "12", index: 1, captures: ["12"], namedGroups: {} },
      { value: "34", index: 5, captures: ["34"], namedGroups: {} },
    ]);
    assert.equal(result.truncated, false);
  });

  it("supports named capture groups", () => {
    const result = testRegex("(?<name>\\w+)", "", "hello");
    assert.deepEqual(result.matches[0]?.namedGroups, { name: "hello" });
  });

  it("returns one match without the global flag", () => {
    const result = testRegex("cat", "", "cat cat");
    assert.equal(result.matches.length, 1);
    assert.equal(result.matches[0]?.index, 0);
  });

  it("supports case-insensitive and multiline flags", () => {
    const result = testRegex("^cat$", "gim", "CAT\ncat");
    assert.equal(result.matches.length, 2);
  });

  it("rejects invalid expressions", () => {
    assert.throws(() => testRegex("[", "", "test"), /regular expression|Invalid regular expression/i);
  });

  it("rejects duplicate or invalid flags", () => {
    assert.throws(() => testRegex("cat", "gg", "cat"), /Invalid flags/i);
  });

  it("limits excessive input", () => {
    assert.throws(() => testRegex("a", "g", "a".repeat(20_001)), /20,?000/);
  });

  it("caps very large match sets", () => {
    const result = testRegex(".", "g", "a".repeat(250));
    assert.equal(result.matches.length, 200);
    assert.equal(result.truncated, true);
  });
});
