import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generatePassword, getAlphabet, PASSWORD_LIMITS, validateOptions } from "./password-generator.ts";

const options = {
  length: 24,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

describe("password generator", () => {
  it("generates the requested length from the selected alphabet", () => {
    const password = generatePassword(options, () => 0);
    assert.equal(password.length, 24);
    assert.match(password, /^[a-zA-Z0-9!@#$%^&*()\-_=+\[\]{};:,.?]+$/);
  });

  it("guarantees every selected character class", () => {
    const password = generatePassword(options, () => 123456789);
    assert.match(password, /[a-z]/);
    assert.match(password, /[A-Z]/);
    assert.match(password, /[0-9]/);
    assert.match(password, /[!@#$%^&*()\-_=+\[\]{};:,.?]/);
  });

  it("can exclude ambiguous characters", () => {
    const alphabet = getAlphabet({ ...options, excludeAmbiguous: true });
    assert.equal([...alphabet].some((character) => "O0Il1|".includes(character)), false);
  });

  it("supports the documented length boundaries", () => {
    assert.equal(generatePassword({ ...options, length: PASSWORD_LIMITS.minLength }, () => 1).length, 8);
    assert.equal(generatePassword({ ...options, length: PASSWORD_LIMITS.maxLength }, () => 2).length, 128);
  });

  it("rejects lengths outside the supported range", () => {
    assert.throws(() => validateOptions({ ...options, length: 7 }), /invalid-length/);
    assert.throws(() => validateOptions({ ...options, length: 129 }), /invalid-length/);
  });

  it("rejects an empty character selection", () => {
    assert.throws(() => validateOptions({ ...options, lowercase: false, uppercase: false, numbers: false, symbols: false }), /empty-character-set/);
  });

  it("removes ambiguous characters from generated passwords", () => {
    const password = generatePassword({
      ...options,
      lowercase: false,
      uppercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
    }, () => 0);
    assert.equal([...password].some((character) => "O0Il1|".includes(character)), false);
  });
});
