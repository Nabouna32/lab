import assert from "node:assert/strict";
import test from "node:test";
import { countTextStats } from "./mots-caracteres.ts";

test("counts words, characters, spaces, and lines", () => {
  assert.deepEqual(countTextStats("Bonjour le monde\nDeuxième ligne"), {
    characters: 31,
    charactersWithoutSpaces: 27,
    words: 5,
    spaces: 3,
    lines: 2,
  });
});

test("treats apostrophes and hyphens inside words as part of one word", () => {
  assert.equal(countTextStats("l'été bien-être").words, 2);
});

test("counts user-perceived Unicode characters correctly", () => {
  assert.equal(countTextStats("Été 😊").characters, 5);
  assert.equal(countTextStats("Été 😊").charactersWithoutSpaces, 4);
});

test("counts combined emoji sequences as single characters", () => {
  assert.equal(countTextStats("👨‍👩‍👧‍👦 👍🏽").characters, 3);
  assert.equal(countTextStats("👨‍👩‍👧‍👦 👍🏽").charactersWithoutSpaces, 2);
});

test("returns zero for empty text", () => {
  assert.deepEqual(countTextStats(""), {
    characters: 0,
    charactersWithoutSpaces: 0,
    words: 0,
    spaces: 0,
    lines: 0,
  });
});
