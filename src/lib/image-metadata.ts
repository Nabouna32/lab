export type ImageMetadata = {
  width: number;
  height: number;
  mimeType: string;
  size: number;
  exif: Record<string, string>;
};

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

const EXIF_TAGS: Record<number, string> = {
  0x010f: "cameraMake",
  0x0110: "cameraModel",
  0x0132: "dateModified",
  0x0112: "orientation",
  0x0131: "software",
};

function readAscii(view: DataView, offset: number, length: number): string {
  if (offset < 0 || length < 0 || offset + length > view.byteLength) return "";
  return new TextDecoder()
    .decode(new Uint8Array(view.buffer, view.byteOffset + offset, length))
    .replace(/\0+$/, "")
    .trim();
}

function readIfdValue(
  view: DataView,
  entryOffset: number,
  tiffBase: number,
  littleEndian: boolean,
): string | undefined {
  const type = view.getUint16(entryOffset + 2, littleEndian);
  const count = view.getUint32(entryOffset + 4, littleEndian);
  const typeSize = type === 2 ? 1 : type === 3 ? 2 : type === 4 ? 4 : 0;
  if (!typeSize || count === 0) return undefined;

  const byteLength = typeSize * count;
  if (!Number.isSafeInteger(byteLength) || byteLength > view.byteLength) return undefined;
  const valueOffset =
    byteLength <= 4
      ? entryOffset + 8
      : tiffBase + view.getUint32(entryOffset + 8, littleEndian);
  if (valueOffset < 0 || valueOffset + byteLength > view.byteLength) return undefined;

  if (type === 2) return readAscii(view, valueOffset, count);
  if (type === 3) return String(view.getUint16(valueOffset, littleEndian));
  return String(view.getUint32(valueOffset, littleEndian));
}

function readRationals(
  view: DataView,
  entryOffset: number,
  tiffBase: number,
  littleEndian: boolean,
): number[] | undefined {
  if (view.getUint16(entryOffset + 2, littleEndian) !== 5) return undefined;
  const count = view.getUint32(entryOffset + 4, littleEndian);
  if (count !== 3) return undefined;

  const valueOffset = tiffBase + view.getUint32(entryOffset + 8, littleEndian);
  if (valueOffset < 0 || valueOffset + count * 8 > view.byteLength) return undefined;

  const values: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const numerator = view.getUint32(valueOffset + index * 8, littleEndian);
    const denominator = view.getUint32(valueOffset + index * 8 + 4, littleEndian);
    if (denominator === 0) return undefined;
    values.push(numerator / denominator);
  }
  return values;
}

function dmsToDegrees(values: number[], maxDegrees: number): number | undefined {
  if (values.length !== 3) return undefined;
  const [degrees, minutes, seconds] = values;
  if (
    !Number.isFinite(degrees) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    degrees < 0 ||
    degrees > maxDegrees ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60 ||
    (degrees === maxDegrees && (minutes !== 0 || seconds !== 0))
  ) {
    return undefined;
  }
  return degrees + minutes / 60 + seconds / 3600;
}

function parseGpsIfd(
  view: DataView,
  ifdOffset: number,
  tiffBase: number,
  littleEndian: boolean,
): string | undefined {
  if (ifdOffset < tiffBase + 8 || ifdOffset + 2 > view.byteLength) return undefined;

  const entryCount = view.getUint16(ifdOffset, littleEndian);
  const availableEntries = Math.floor((view.byteLength - ifdOffset - 2) / 12);
  const count = Math.min(entryCount, availableEntries);
  let latitudeRef = "";
  let longitudeRef = "";
  let latitudeValues: number[] | undefined;
  let longitudeValues: number[] | undefined;

  for (let index = 0; index < count; index += 1) {
    const entryOffset = ifdOffset + 2 + index * 12;
    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag === 0x0001) {
      latitudeRef = readIfdValue(view, entryOffset, tiffBase, littleEndian) ?? "";
    } else if (tag === 0x0002) {
      latitudeValues = readRationals(view, entryOffset, tiffBase, littleEndian);
    } else if (tag === 0x0003) {
      longitudeRef = readIfdValue(view, entryOffset, tiffBase, littleEndian) ?? "";
    } else if (tag === 0x0004) {
      longitudeValues = readRationals(view, entryOffset, tiffBase, littleEndian);
    }
  }

  if (!["N", "S"].includes(latitudeRef) || !["E", "W"].includes(longitudeRef)) {
    return undefined;
  }

  const latitude = latitudeValues ? dmsToDegrees(latitudeValues, 90) : undefined;
  const longitude = longitudeValues ? dmsToDegrees(longitudeValues, 180) : undefined;
  if (latitude === undefined || longitude === undefined) return undefined;

  return `${latitude.toFixed(6)}° ${latitudeRef}, ${longitude.toFixed(6)}° ${longitudeRef}`;
}

function parseDateTakenFromExifIfd(
  view: DataView,
  ifdOffset: number,
  tiffBase: number,
  littleEndian: boolean,
): string | undefined {
  if (ifdOffset < tiffBase + 8 || ifdOffset + 2 > view.byteLength) return undefined;

  const entryCount = view.getUint16(ifdOffset, littleEndian);
  const availableEntries = Math.floor((view.byteLength - ifdOffset - 2) / 12);
  const count = Math.min(entryCount, availableEntries);

  for (let index = 0; index < count; index += 1) {
    const entryOffset = ifdOffset + 2 + index * 12;
    if (view.getUint16(entryOffset, littleEndian) !== 0x9003) continue;
    return readIfdValue(view, entryOffset, tiffBase, littleEndian);
  }
  return undefined;
}

function parseIfd(
  view: DataView,
  ifdOffset: number,
  tiffBase: number,
  littleEndian: boolean,
): Record<string, string> {
  const metadata: Record<string, string> = {};
  if (ifdOffset < tiffBase + 8 || ifdOffset + 2 > view.byteLength) return metadata;

  const entryCount = view.getUint16(ifdOffset, littleEndian);
  const availableEntries = Math.floor((view.byteLength - ifdOffset - 2) / 12);
  const count = Math.min(entryCount, availableEntries);

  for (let index = 0; index < count; index += 1) {
    const entryOffset = ifdOffset + 2 + index * 12;
    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag === 0x8825) {
      const type = view.getUint16(entryOffset + 2, littleEndian);
      const valueCount = view.getUint32(entryOffset + 4, littleEndian);
      if (type !== 4 || valueCount !== 1) continue;
      const gpsIfdOffset = tiffBase + view.getUint32(entryOffset + 8, littleEndian);
      const gps = parseGpsIfd(view, gpsIfdOffset, tiffBase, littleEndian);
      if (gps) metadata.gps = gps;
      continue;
    }

    if (tag === 0x8769) {
      const type = view.getUint16(entryOffset + 2, littleEndian);
      const valueCount = view.getUint32(entryOffset + 4, littleEndian);
      if (type !== 4 || valueCount !== 1) continue;
      const exifIfdOffset = tiffBase + view.getUint32(entryOffset + 8, littleEndian);
      const dateTaken = parseDateTakenFromExifIfd(view, exifIfdOffset, tiffBase, littleEndian);
      if (dateTaken) metadata.dateTaken = dateTaken;
      continue;
    }

    const key = EXIF_TAGS[tag];
    if (!key) continue;
    const value = readIfdValue(view, entryOffset, tiffBase, littleEndian);
    if (value) metadata[key] = value;
  }

  return metadata;
}

export function parseExifMetadata(buffer: ArrayBuffer): Record<string, string> {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return {};

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = view.getUint8(offset + 1);
    offset += 2;
    if (marker === 0xd9 || marker === 0xda) break;
    if (offset + 2 > view.byteLength) break;

    const segmentLength = view.getUint16(offset, false);
    if (segmentLength < 2 || offset + segmentLength > view.byteLength) break;
    const segmentDataOffset = offset + 2;

    if (marker === 0xe1 && segmentLength >= 8 && readAscii(view, segmentDataOffset, 6) === "Exif") {
      const tiffBase = segmentDataOffset + 6;
      if (tiffBase + 8 > view.byteLength) return {};

      const byteOrder = view.getUint16(tiffBase, false);
      const littleEndian = byteOrder === 0x4949;
      if (!littleEndian && byteOrder !== 0x4d4d) return {};
      if (view.getUint16(tiffBase + 2, littleEndian) !== 42) return {};

      const firstIfdOffset = view.getUint32(tiffBase + 4, littleEndian);
      return parseIfd(view, tiffBase + firstIfdOffset, tiffBase, littleEndian);
    }

    offset += segmentLength;
  }

  return {};
}

export async function inspectImage(file: File): Promise<ImageMetadata> {
  if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Invalid image.");
  }

  const buffer = await file.arrayBuffer();
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      exif: parseExifMetadata(buffer),
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function stripImageMetadata(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Invalid image.");
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable.");

    if (file.type === "image/jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0);

    const outputType = ["image/jpeg", "image/png", "image/webp"].includes(file.type)
      ? file.type
      : "image/png";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, 0.92);
    });
    if (!blob) throw new Error("Encoding unsupported.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
