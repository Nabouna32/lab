export const MAX_IMAGE_PIXELS = 40_000_000;

export type ImageOutputFormat = "webp" | "jpeg" | "png";

export type ImageDimensions = { width: number; height: number };

export type CompressionOptions = {
  maxDimension: number | null;
  quality: number;
  format: ImageOutputFormat;
};

export function fitImageWithinDimensions(
  width: number,
  height: number,
  maxDimension: number | null,
): ImageDimensions {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("Invalid image dimensions.");
  }
  if (maxDimension === null || maxDimension <= 0 || Math.max(width, height) <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function getOutputMimeType(format: ImageOutputFormat): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
  }
}

export function normalizeQuality(quality: number): number {
  if (!Number.isFinite(quality)) return 0.8;
  return Math.min(1, Math.max(0.1, quality));
}

export function calculateReductionPercent(originalBytes: number, compressedBytes: number): number {
  if (!Number.isFinite(originalBytes) || originalBytes <= 0 || compressedBytes < 0) return 0;
  return Math.max(0, ((originalBytes - compressedBytes) / originalBytes) * 100);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = -1;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions,
): Promise<{ blob: Blob; width: number; height: number; mimeType: string }> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();

    if (image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS) {
      throw new Error("Image is too large to process safely.");
    }

    const { width, height } = fitImageWithinDimensions(
      image.naturalWidth,
      image.naturalHeight,
      options.maxDimension,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available.");

    if (options.format === "jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);

    const mimeType = getOutputMimeType(options.format);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mimeType, normalizeQuality(options.quality)),
    );
    if (!blob) throw new Error("Image encoding is not supported.");

    return { blob, width, height, mimeType };
  } finally {
    URL.revokeObjectURL(url);
  }
}
