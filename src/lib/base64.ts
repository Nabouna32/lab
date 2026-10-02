export type Base64Operation = "encode" | "decode";

export type Base64Result =
  | { value: string; error: null }
  | { value: null; error: "invalid-base64" | "invalid-text" };

function bytesToBinary(bytes: Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(index, index + chunkSize)));
  }

  return chunks.join("");
}

function binaryToBytes(binary: string): Uint8Array {
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function normalizeBase64(input: string): string | null {
  const normalized = input.replace(/[\t\n\r ]/g, "");
  if (!normalized || normalized.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    return null;
  }

  const padding = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(padding);
}

export function transformBase64(input: string, operation: Base64Operation): Base64Result {
  try {
    if (operation === "encode") {
      const bytes = new TextEncoder().encode(input);
      return { value: btoa(bytesToBinary(bytes)), error: null };
    }

    const normalized = normalizeBase64(input);
    if (!normalized) return { value: null, error: "invalid-base64" };

    const bytes = binaryToBytes(atob(normalized));
    return {
      value: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      error: null,
    };
  } catch (error) {
    if (error instanceof URIError || error instanceof TypeError || error instanceof DOMException) {
      return {
        value: null,
        error: operation === "decode" ? "invalid-base64" : "invalid-text",
      };
    }
    throw error;
  }
}
