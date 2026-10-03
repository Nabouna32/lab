export type JwtDecoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
};

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
    throw new Error("Invalid base64url segment");
  }
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function decodeJsonSegment(segment: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(decodeBase64Url(segment));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JWT JSON segment must be an object");
  }
  return parsed as Record<string, unknown>;
}

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    throw new Error("A JWT must contain three non-empty segments");
  }

  return {
    header: decodeJsonSegment(parts[0]),
    payload: decodeJsonSegment(parts[1]),
    signature: parts[2],
  };
}

export function formatDecodedJwt(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}
