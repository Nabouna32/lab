export function createToolShareUrl(origin: string, pathname: string): string {
  const url = new URL(pathname, origin);
  url.search = "";
  url.hash = "";
  return url.toString();
}
