import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashText } from "./hash-generator.ts";

describe("hashText", () => {
  it("hashes UTF-8 text with SHA-256", async () => {
    assert.equal(
      await hashText("hello", "SHA-256"),
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });

  it("supports SHA-1", async () => {
    assert.equal(await hashText("hello", "SHA-1"), "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
  });

  it("hashes Unicode text as UTF-8", async () => {
    const result = await hashText("é", "SHA-256");
    assert.equal(result, "4a99557e4033c3539de2eb65472017cad5f9557f7a0625a09f1c3f6e2ba69c4c");
  });
});
