export type XmlIndent = "  " | "    " | "\t";

export type XmlFormatResult =
  | { ok: true; value: string }
  | { ok: false; message: string };

const XML_SPACE_NAMESPACE = "http://www.w3.org/XML/1998/namespace";

function hasParserError(document: XMLDocument): boolean {
  return Array.from(document.getElementsByTagName("*")).some(
    (element) => element.localName === "parsererror",
  );
}

function parserErrorMessage(document: XMLDocument): string {
  const parserError = Array.from(document.getElementsByTagName("*")).find(
    (element) => element.localName === "parsererror",
  );
  if (!parserError) return "The XML document is not well-formed.";

  const message = parserError.textContent?.replace(/\s+/g, " ").trim() ?? "";
  return message ? message.slice(0, 180) : "The XML document is not well-formed.";
}

function serialize(node: Node, indent: string, depth: number, preserveWhitespace: boolean): string {
  const serializer = new XMLSerializer();

  if (node.nodeType === Node.DOCUMENT_NODE) {
    return Array.from(node.childNodes)
      .filter((child) => child.nodeType !== Node.TEXT_NODE || child.textContent?.trim())
      .map((child) => serialize(child, indent, depth, false))
      .join("\n");
  }

  if (node.nodeType === Node.DOCUMENT_TYPE_NODE ||
      node.nodeType === Node.COMMENT_NODE ||
      node.nodeType === Node.PROCESSING_INSTRUCTION_NODE ||
      node.nodeType === Node.CDATA_SECTION_NODE) {
    return serializer.serializeToString(node);
  }

  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";

  if (node.nodeType !== Node.ELEMENT_NODE) return serializer.serializeToString(node);

  const element = node as Element;
  const inheritedPreserve =
    preserveWhitespace ||
    element.getAttributeNS(XML_SPACE_NAMESPACE, "space") === "preserve";

  if (inheritedPreserve) return serializer.serializeToString(element);

  const elementChildren = Array.from(element.childNodes).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.COMMENT_NODE ||
      child.nodeType === Node.PROCESSING_INSTRUCTION_NODE || child.nodeType === Node.DOCUMENT_TYPE_NODE,
  );
  const meaningfulText = Array.from(element.childNodes).some(
    (child) =>
      (child.nodeType === Node.TEXT_NODE && Boolean(child.textContent?.trim())) ||
      child.nodeType === Node.CDATA_SECTION_NODE,
  );

  if (elementChildren.length === 0 || meaningfulText) {
    return serializer.serializeToString(element);
  }

  const opening = serializer.serializeToString(element.cloneNode(false)).replace(/\/>$/, ">");
  const closing = `</${element.tagName}>`;
  if (elementChildren.length === 0) return serializer.serializeToString(element);

  const childIndent = indent.repeat(depth + 1);
  const children = elementChildren
    .map((child) => childIndent + serialize(child, indent, depth + 1, false))
    .join("\n");

  return `${opening}\n${children}\n${indent.repeat(depth)}${closing}`;
}

function xmlDeclaration(input: string): string {
  const match = input.match(/^\s*(<\?xml\s+[^?]*\?>)/i);
  return match?.[1] ?? "";
}

export function validateXml(input: string): XmlFormatResult {
  if (!input.trim()) return { ok: false, message: "empty" };

  const document = new DOMParser().parseFromString(input, "application/xml");
  if (hasParserError(document)) {
    return { ok: false, message: parserErrorMessage(document) };
  }

  return { ok: true, value: "" };
}

export function formatXml(input: string, indent: XmlIndent = "  "): XmlFormatResult {
  if (!input.trim()) return { ok: false, message: "empty" };

  const document = new DOMParser().parseFromString(input, "application/xml");
  if (hasParserError(document)) {
    return { ok: false, message: parserErrorMessage(document) };
  }

  const formatted = serialize(document, indent, 0, false);
  const declaration = xmlDeclaration(input);
  return {
    ok: true,
    value: declaration ? `${declaration}\n${formatted}` : formatted,
  };
}
