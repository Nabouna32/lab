export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
export type DigestVerification = "match" | "mismatch" | "invalid";

export const MAX_HASH_FILE_BYTES = 100 * 1024 * 1024;

const enc = new TextEncoder();
const digestLengths: Record<HashAlgorithm, number> = {
  "SHA-1": 40,
  "SHA-256": 64,
  "SHA-384": 96,
  "SHA-512": 128,
};

function toHex(digest: ArrayBuffer): string {
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashBytes(value: Uint8Array<ArrayBuffer>, algorithm: HashAlgorithm): Promise<string> {
  return toHex(await crypto.subtle.digest(algorithm, value));
}

export async function hashText(value: string, algorithm: HashAlgorithm): Promise<string> {
  return hashBytes(enc.encode(value), algorithm);
}

export function assertHashFileSize(size: number): void {
  if (!Number.isSafeInteger(size) || size < 0) {
    throw new RangeError("The file size is invalid.");
  }
  if (size > MAX_HASH_FILE_BYTES) {
    throw new RangeError("The file exceeds the 100 MiB limit.");
  }
}

export async function hashFile(file: File, algorithm: HashAlgorithm): Promise<string> {
  assertHashFileSize(file.size);
  return hashBytes(new Uint8Array(await file.arrayBuffer()), algorithm);
}

export function verifyDigest(
  actualDigest: string,
  expectedDigest: string,
  algorithm: HashAlgorithm,
): DigestVerification {
  const expected = expectedDigest.trim().toLowerCase();
  if (!new RegExp(`^[a-f0-9]{${digestLengths[algorithm]}}$`).test(expected)) return "invalid";
  return actualDigest.toLowerCase() === expected ? "match" : "mismatch";
}
