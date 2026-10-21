export type PdfPageSize = "a4" | "letter";
export type ImagePdfPage = { jpegBytes: Uint8Array; width: number; height: number };
const encoder = new TextEncoder();
const PAGE_SIZES: Record<PdfPageSize, { width: number; height: number }> = { a4: { width: 595.28, height: 841.89 }, letter: { width: 612, height: 792 } };
function ascii(value: string): Uint8Array { return encoder.encode(value); }
function joinBytes(parts: Uint8Array[]): Uint8Array {
 const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
 let offset = 0; for (const part of parts) { output.set(part, offset); offset += part.length; } return output;
}
export function createImagePdf(pages: readonly ImagePdfPage[], pageSize: PdfPageSize = "a4"): Uint8Array {
 if (pages.length === 0) throw new Error("At least one image is required.");
 if (pages.length > 10) throw new Error("A PDF can contain at most 10 images.");
 for (const page of pages) {
  if (!Number.isSafeInteger(page.width) || page.width < 1 || !Number.isSafeInteger(page.height) || page.height < 1) throw new Error("Image dimensions must be positive integers.");
  if (page.jpegBytes.length < 4 || page.jpegBytes[0] !== 255 || page.jpegBytes[1] !== 216) throw new Error("Each image must be encoded as JPEG.");
 }
 const objects: Uint8Array[] = [], pageIds = pages.map((_, index) => 3 + index * 3);
 objects.push(ascii("<< /Type /Catalog /Pages 2 0 R >>"));
 objects.push(ascii("<< /Type /Pages /Kids [" + pageIds.map((id) => String(id) + " 0 R").join(" ") + "] /Count " + pages.length + " >>"));
 pages.forEach((page, index) => {
  const pageId = pageIds[index], contentId = pageId + 1, imageId = pageId + 2, base = PAGE_SIZES[pageSize];
  const landscape = page.width > page.height, pageWidth = landscape ? base.height : base.width, pageHeight = landscape ? base.width : base.height, margin = 24;
  const scale = Math.min((pageWidth - margin * 2) / page.width, (pageHeight - margin * 2) / page.height);
  const drawWidth = page.width * scale, drawHeight = page.height * scale, x = (pageWidth - drawWidth) / 2, y = (pageHeight - drawHeight) / 2;
  const content = "q " + drawWidth.toFixed(3) + " 0 0 " + drawHeight.toFixed(3) + " " + x.toFixed(3) + " " + y.toFixed(3) + " cm /Im0 Do Q";
  objects.push(ascii("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageWidth.toFixed(2) + " " + pageHeight.toFixed(2) + "] /Resources << /XObject << /Im0 " + imageId + " 0 R >> >> /Contents " + contentId + " 0 R >>"));
  objects.push(ascii("<< /Length " + ascii(content).length + " >>\nstream\n" + content + "\nendstream"));
  objects.push(joinBytes([ascii("<< /Type /XObject /Subtype /Image /Width " + page.width + " /Height " + page.height + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + page.jpegBytes.length + " >>\nstream\n"), page.jpegBytes, ascii("\nendstream")]));
 });
 const parts: Uint8Array[] = [ascii("%PDF-1.4\n")], offsets = [0]; let byteLength = parts[0].length;
 objects.forEach((object, index) => { offsets.push(byteLength); const wrapped = joinBytes([ascii(String(index + 1) + " 0 obj\n"), object, ascii("\nendobj\n")]); parts.push(wrapped); byteLength += wrapped.length; });
 const xrefOffset = byteLength; let xref = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
 for (let index = 1; index < offsets.length; index += 1) xref += String(offsets[index]).padStart(10, "0") + " 00000 n \n";
 parts.push(ascii(xref + "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF\n"));
 return joinBytes(parts);
}
