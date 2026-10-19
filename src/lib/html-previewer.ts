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

const CSP_META = `<meta http-equiv="Content-Security-Policy" content="${CSP}">`;

export function createHtmlPreviewDocument(source: string): string {
  if (!source.trim()) return "";

  // Put the policy before all user-controlled markup. Searching for a <head>
  // with a regex can match text inside comments or raw-text elements, placing
  // the policy inside inert content and allowing external resources to load.
  // The HTML parser creates the implicit html/head elements before processing
  // this leading meta; subsequent full-document tags are handled normally.
  return `<!doctype html>${CSP_META}${source.trim()}`;
}
