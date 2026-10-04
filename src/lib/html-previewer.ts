const CSP = [
  "default-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "script-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "img-src data: blob:",
  "media-src data: blob:",
  "font-src data: blob:",
  "style-src 'unsafe-inline'",
].join("; ");

const CSP_META = \`<meta http-equiv="Content-Security-Policy" content="\${CSP}">\`;

export function createHtmlPreviewDocument(source: string): string {
  if (!source.trim()) return "";

  const html = source.trim();
  const headMatch = html.match(/<head\b[^>]*>/i);
  if (headMatch?.index !== undefined) {
    const end = headMatch.index + headMatch[0].length;
    return html.slice(0, end) + CSP_META + html.slice(end);
  }

  const htmlMatch = html.match(/<html\b[^>]*>/i);
  if (htmlMatch?.index !== undefined) {
    const end = htmlMatch.index + htmlMatch[0].length;
    return html.slice(0, end) + \`<head>\${CSP_META}</head>\` + html.slice(end);
  }

  return \`<!doctype html><html><head>\${CSP_META}</head><body>\${html}</body></html>\`;
}
