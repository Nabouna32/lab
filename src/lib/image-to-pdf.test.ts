import assert from "node:assert/strict";
import { test } from "node:test";
import { createImagePdf } from "./image-to-pdf.ts";
const jpeg = new Uint8Array([255, 216, 255, 217]);
test("creates a PDF with one page per image and valid cross-reference offsets", () => {
 const source = new TextDecoder("latin1").decode(createImagePdf([{ jpegBytes: jpeg, width: 1200, height: 800 }, { jpegBytes: jpeg, width: 800, height: 1200 }]));
 assert.ok(source.startsWith("%PDF-1.4")); assert.match(source, /\/Count 2/); assert.equal((source.match(/\/Type \/Page\b/g) ?? []).length, 2);
 const xref = Number(source.match(/startxref\n(\d+)/)?.[1]); assert.equal(source.slice(xref, xref + 4), "xref");
 assert.ok(source.includes("0000000009 00000 n")); assert.ok(source.includes("1 0 obj"));
});
test("rejects empty, oversized, and invalid image pages", () => {
 assert.throws(() => createImagePdf([]), /at least one/i);
 assert.throws(() => createImagePdf(Array.from({ length: 11 }, () => ({ jpegBytes: jpeg, width: 1, height: 1 }))), /at most 10/i);
 assert.throws(() => createImagePdf([{ jpegBytes: new Uint8Array([1, 2]), width: 1, height: 1 }]), /JPEG/i);
 assert.throws(() => createImagePdf([{ jpegBytes: jpeg, width: 0, height: 1 }]), /dimensions/i);
});
