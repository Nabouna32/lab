export type UrlParseResult =
  | {
      value: {
        href: string;
        origin: string;
        protocol: string;
        username: string;
        hasPassword: boolean;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
        queryParameters: Array<{ key: string; value: string }>;
      };
      error: null;
    }
  | { value: null; error: "invalid-url" };

export function parseUrl(input: string): UrlParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { value: null, error: "invalid-url" };

  try {
    const url = new URL(trimmed);
    return {
      value: {
        href: url.href,
        origin: url.origin,
        protocol: url.protocol,
        username: url.username,
        hasPassword: url.password.length > 0,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        queryParameters: Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value })),
      },
      error: null,
    };
  } catch {
    return { value: null, error: "invalid-url" };
  }
}

const sensitiveParameterNames = new Set([
  "auth",
  "authorization",
  "code_verifier",
  "password",
  "passwd",
  "secret",
  "session",
  "session_id",
  "sessionid",
  "signature",
  "sig",
]);

export function hasSensitiveUrlData(input: {
  username: string;
  hasPassword: boolean;
  hash: string;
  queryParameters: readonly { key: string; value: string }[];
}): boolean {
  if (input.username || input.hasPassword) return true;

  const fragmentParameters = new URLSearchParams(input.hash.replace(/^#/, ""));
  const parameterNames = [...input.queryParameters.map(({ key }) => key), ...Array.from(fragmentParameters.keys())];

  return parameterNames.some((key) => {
    const normalized = key.trim().replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().replace(/[\s-]+/g, "_");
    return sensitiveParameterNames.has(normalized) ||
      /(?:^|_)(?:access|refresh|id)?_?token$/.test(normalized) ||
      /(?:^|_)(?:api_?key|client_secret|password|passwd|secret|signature|session_?id)$/.test(normalized);
  });
}
