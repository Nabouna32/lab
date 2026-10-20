const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;

export type ZipEntry = { name: string; blob: Blob };

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function safeFileName(name: string): string {
  const baseName = name.split(/[\\/]/).pop() ?? "";
  return baseName.replace(/[<>:"|?*\u0000-\u001f]/g, "_").replace(/^\.+/, "").trim().slice(0, 180) || "image";
}

/** ZIP STORE archive: image files are already encoded, so recompressing them is unnecessary. */
export async function createZipArchive(entries: readonly ZipEntry[]): Promise<Blob> {
  if (entries.length === 0) throw new Error("Cannot create an empty archive.");
  const prepared: { name: Uint8Array; data: Uint8Array; crc: number; offset: number }[] = [];
  const usedNames = new Set<string>();
  let offset = 0;
  let totalBytes = 0;

  for (const entry of entries) {
    const name = safeFileName(entry.name);
    let uniqueName = name;
    let suffix = 2;
    const dot = name.lastIndexOf(".");
    while (usedNames.has(uniqueName.toLowerCase())) {
      uniqueName = dot > 0 ? name.slice(0, dot) + " (" + suffix++ + ")" + name.slice(dot) : name + " (" + suffix++ + ")";
    }
    usedNames.add(uniqueName.toLowerCase());
    const data = new Uint8Array(await entry.blob.arrayBuffer());
    totalBytes += data.byteLength;
    if (totalBytes > MAX_ARCHIVE_BYTES) throw new Error("Archive exceeds the supported size.");
    const nameBytes = new TextEncoder().encode(uniqueName);
    if (nameBytes.byteLength > 65535 || data.byteLength > 0xffffffff) throw new Error("ZIP entry is too large.");
    prepared.push({ name: nameBytes, data, crc: crc32(data), offset });
    offset += 30 + nameBytes.byteLength + data.byteLength;
    if (offset > 0xffffffff) throw new Error("Archive exceeds the ZIP format limit.");
  }

  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let centralSize = 0;
  for (const entry of prepared) {
    const local = new Uint8Array(30 + entry.name.byteLength);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true); lv.setUint16(10, 0, true); lv.setUint16(12, 0x0021, true);
    lv.setUint32(14, entry.crc, true); lv.setUint32(18, entry.data.byteLength, true); lv.setUint32(22, entry.data.byteLength, true);
    lv.setUint16(26, entry.name.byteLength, true); local.set(entry.name, 30);
    localParts.push(local, entry.data);

    const central = new Uint8Array(46 + entry.name.byteLength);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true); cv.setUint16(10, 0, true); cv.setUint16(12, 0, true); cv.setUint16(14, 0x0021, true);
    cv.setUint32(16, entry.crc, true); cv.setUint32(20, entry.data.byteLength, true); cv.setUint32(24, entry.data.byteLength, true);
    cv.setUint16(28, entry.name.byteLength, true); cv.setUint16(30, 0, true); cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true); cv.setUint16(36, 0, true); cv.setUint32(38, 0, true); cv.setUint32(42, entry.offset, true);
    central.set(entry.name, 46);
    centralParts.push(central);
    centralSize += central.byteLength;
  }

  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
  ev.setUint16(8, prepared.length, true); ev.setUint16(10, prepared.length, true);
  ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true); ev.setUint16(20, 0, true);
  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}
