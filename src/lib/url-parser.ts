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
