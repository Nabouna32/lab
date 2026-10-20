import assert from "node:assert/strict";
import test from "node:test";
import { parseExifMetadata } from "./image-metadata.ts";
import { getToolMessages } from "./i18n/tool-messages.ts";

function jpegWithCameraMake(): ArrayBuffer {
  const bytes = new Uint8Array(50);
  bytes.set([
    0xff, 0xd8, 0xff, 0xe1, 0, 38, 69, 120, 105, 102, 0, 0,
    73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 15, 1, 2, 0, 5, 0, 0, 0,
    26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  new TextEncoder().encode("Canon").forEach((value, index) => {
    bytes[38 + index] = value;
  });
  return bytes.buffer;
}

function jpegWithDateFields(): ArrayBuffer {
  const bytes = new Uint8Array(146);
  bytes.set([0xff, 0xd8, 0xff, 0xe1], 0);
  new DataView(bytes.buffer).setUint16(4, 142, false);
  bytes.set([69, 120, 105, 102, 0, 0], 6);

  const tiff = new Uint8Array(134);
  const view = new DataView(tiff.buffer);
  tiff.set([0x49, 0x49], 0);
  view.setUint16(2, 42, true);
  view.setUint32(4, 8, true);

  // IFD0 stores the modification time and points to the EXIF sub-IFD.
  view.setUint16(8, 2, true);
  const dateModified = "2020:01:02 03:04:05";
  view.setUint16(10, 0x0132, true);
  view.setUint16(12, 2, true);
  view.setUint32(14, 20, true);
  view.setUint32(18, 80, true);
  view.setUint16(22, 0x8769, true);
  view.setUint16(24, 4, true);
  view.setUint32(26, 1, true);
  view.setUint32(30, 40, true);
  view.setUint32(34, 0, true);
  new TextEncoder().encode(dateModified + "\0").forEach((value, index) => {
    tiff[80 + index] = value;
  });

  // EXIF sub-IFD stores DateTimeOriginal, which is the capture time.
  view.setUint16(40, 1, true);
  view.setUint16(42, 0x9003, true);
  view.setUint16(44, 2, true);
  view.setUint32(46, 20, true);
  view.setUint32(50, 100, true);
  view.setUint32(54, 0, true);
  new TextEncoder().encode("2021:02:03 04:05:06\0").forEach((value, index) => {
    tiff[100 + index] = value;
  });

  bytes.set(tiff, 12);
  return bytes.buffer;
}

function jpegWithGps(): ArrayBuffer {
  const bytes = new Uint8Array(140);
  bytes.set([0xff, 0xd8, 0xff, 0xe1], 0);
  new DataView(bytes.buffer).setUint16(4, 136, false);
  bytes.set([69, 120, 105, 102, 0, 0], 6);

  const tiff = new Uint8Array(128);
  const view = new DataView(tiff.buffer);
  tiff.set([0x49, 0x49], 0);
  view.setUint16(2, 42, true);
  view.setUint32(4, 8, true);

  // IFD0 points to the GPS IFD at TIFF offset 26.
  view.setUint16(8, 1, true);
  view.setUint16(10, 0x8825, true);
  view.setUint16(12, 4, true);
  view.setUint32(14, 1, true);
  view.setUint32(18, 26, true);
  view.setUint32(22, 0, true);

  // GPS IFD: latitude ref, latitude, longitude ref, longitude.
  view.setUint16(26, 4, true);
  const entry = (index: number, tag: number, type: number, count: number, value: number) => {
    const offset = 28 + index * 12;
    view.setUint16(offset, tag, true);
    view.setUint16(offset + 2, type, true);
    view.setUint32(offset + 4, count, true);
    view.setUint32(offset + 8, value, true);
  };
  entry(0, 0x0001, 2, 2, "N".charCodeAt(0));
  entry(1, 0x0002, 5, 3, 80);
  entry(2, 0x0003, 2, 2, "E".charCodeAt(0));
  entry(3, 0x0004, 5, 3, 104);
  view.setUint32(76, 0, true);

  const rationals = [
    [48, 1], [51, 1], [30, 1],
    [2, 1], [17, 1], [40, 1],
  ];
  rationals.forEach(([numerator, denominator], index) => {
    const offset = 80 + index * 8;
    view.setUint32(offset, numerator, true);
    view.setUint32(offset + 4, denominator, true);
  });

  bytes.set(tiff, 12);
  return bytes.buffer;
}

test("reads basic JPEG EXIF text", () => {
  assert.equal(parseExifMetadata(jpegWithCameraMake()).cameraMake, "Canon");
});

test("prefers DateTimeOriginal and preserves the modification timestamp separately", () => {
  const metadata = parseExifMetadata(jpegWithDateFields());
  assert.equal(metadata.dateTaken, "2021:02:03 04:05:06");
  assert.equal(metadata.dateModified, "2020:01:02 03:04:05");
});

test("parses GPS latitude and longitude instead of exposing the TIFF offset", () => {
  assert.equal(
    parseExifMetadata(jpegWithGps()).gps,
    "48.858333° N, 2.294444° E",
  );
});

test("returns empty metadata for non-JPEG data", () => {
  assert.deepEqual(parseExifMetadata(new Uint8Array([1, 2, 3]).buffer), {});
});

test("handles truncated EXIF data without throwing", () => {
  const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0, 20, 69, 120, 105, 102, 0, 0]);
  assert.doesNotThrow(() => parseExifMetadata(bytes.buffer));
  assert.deepEqual(parseExifMetadata(bytes.buffer), {});
});

test("localizes image metadata labels in French and English", () => {
  assert.equal(getToolMessages("fr").imageMetadata.input, "Choisir une image");
  assert.equal(getToolMessages("fr").imageMetadata.cameraMake, "Marque de l’appareil");
  assert.equal(getToolMessages("fr").imageMetadata.cameraModel, "Modèle de l’appareil");
  assert.equal(getToolMessages("en").imageMetadata.cameraMake, "Camera make");
  assert.equal(getToolMessages("en").imageMetadata.cameraModel, "Camera model");
  assert.match(getToolMessages("fr").imageMetadata.gpsWarning, /coordonnées GPS/);
  assert.match(getToolMessages("en").imageMetadata.gpsWarning, /GPS coordinates/);
});
