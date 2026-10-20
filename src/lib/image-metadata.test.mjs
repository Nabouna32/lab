import assert from "node:assert/strict";
import test from "node:test";
import {
  AnimatedImageUnsupportedError,
  getCleanImageFormat,
  isAnimatedImage,
  stripImageMetadata,
} from "./image-metadata.ts";

function buffer(bytes) {
  return Uint8Array.from(bytes).buffer;
}

function ascii(value) {
  return [...value].map((character) => character.charCodeAt(0));
}

const gifHeader = [...ascii("GIF89a"), 1, 0, 1, 0, 0, 0, 0];
const gifFrame = [0x2c, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1, 0, 0];

test("detects animated GIFs but permits static GIFs", () => {
  assert.equal(isAnimatedImage(buffer([...gifHeader, ...gifFrame, 0x3b])), false);
  assert.equal(isAnimatedImage(buffer([...gifHeader, ...gifFrame, ...gifFrame, 0x3b])), true);
});

test("detects APNG animation control chunks", () => {
  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
  const animationControl = [0, 0, 0, 8, ...ascii("acTL"), 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];
  assert.equal(isAnimatedImage(buffer([...pngSignature, ...animationControl])), true);
  assert.equal(isAnimatedImage(buffer(pngSignature)), false);
});

test("detects animated WebP chunks", () => {
  const webp = [...ascii("RIFF"), 12, 0, 0, 0, ...ascii("WEBP"), ...ascii("ANIM"), 0, 0, 0, 0];
  assert.equal(isAnimatedImage(buffer(webp)), true);
});

test("refuses metadata stripping for animation before canvas conversion", async () => {
  const animatedGif = new File([[...gifHeader, ...gifFrame, ...gifFrame, 0x3b]], "animated.gif", {
    type: "image/gif",
  });
  await assert.rejects(stripImageMetadata(animatedGif), AnimatedImageUnsupportedError);
});

test("chooses a download extension matching the actual cleaned image format", () => {
  assert.deepEqual(getCleanImageFormat("image/jpeg"), { mimeType: "image/jpeg", extension: "jpg" });
  assert.deepEqual(getCleanImageFormat("image/webp"), { mimeType: "image/webp", extension: "webp" });
  assert.deepEqual(getCleanImageFormat("image/png"), { mimeType: "image/png", extension: "png" });
  assert.deepEqual(getCleanImageFormat("image/gif"), { mimeType: "image/png", extension: "png" });
});
