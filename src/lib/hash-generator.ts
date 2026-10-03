export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const enc = new TextEncoder();

export async function hashText(value: string, algorithm: HashAlgorithm): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, enc.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
