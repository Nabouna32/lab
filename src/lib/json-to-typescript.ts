export type JsonToTypeScriptResult = {
  value: string | null;
  error: "invalid-json" | "unsupported-root" | null;
};

type JsonObject = Record<string, unknown>;
type Node =
  | { kind: "string" | "number" | "boolean" | "null" | "unknown" }
  | { kind: "object"; name: string; properties: Map<string, Node>; optional: Set<string> }
  | { kind: "array"; item: Node }
  | { kind: "union"; items: Node[] };

const reserved = new Set([
  "any","as","boolean","break","case","catch","class","const","constructor","continue","debugger","declare","default","delete",
  "do","else","enum","export","extends","false","finally","for","from","function","get","if","implements","import","in",
  "infer","instanceof","interface","keyof","let","module","namespace","never","new","null","number","object","package",
  "private","protected","public","readonly","require","return","set","static","string","super","switch","symbol","this",
  "throw","true","try","type","typeof","undefined","unknown","var","void","while","with","yield",
]);

function typeName(value: string): string {
  const words = value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const name = words.map((word) => word[0].toUpperCase() + word.slice(1)).join("");
  return name || "Root";
}

function singular(name: string): string {
  if (name.endsWith("ies")) return name.slice(0, -3) + "y";
  if (name.endsWith("ses")) return name.slice(0, -2);
  if (name.endsWith("s") && !name.endsWith("ss")) return name.slice(0, -1);
  return name;
}

function uniqueName(base: string, used: Set<string>): string {
  const normalized = typeName(base);
  let candidate = normalized || "Root";
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${normalized}${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function mergeNodes(left: Node, right: Node, nameHint: string, used: Set<string>): Node {
  if (left.kind === "object" && right.kind === "object") {
    const properties = new Map(left.properties);
    const optional = new Set(left.optional);
    for (const [key, rightNode] of right.properties) {
      const existing = properties.get(key);
      if (existing) properties.set(key, mergeNodes(existing, rightNode, `${nameHint}${typeName(key)}`, used));
      else {
        properties.set(key, rightNode);
        optional.add(key);
      }
    }
    for (const key of left.properties.keys()) {
      if (!right.properties.has(key)) optional.add(key);
    }
    return { kind: "object", name: left.name, properties, optional };
  }

  if (left.kind === "array" && right.kind === "array") {
    return { kind: "array", item: mergeNodes(left.item, right.item, nameHint, used) };
  }

  const items: Node[] = [];
  function add(node: Node) {
    if (node.kind === "union") node.items.forEach(add);
    else if (!items.some((item) => nodeType(item) === nodeType(node))) items.push(node);
  }
  add(left);
  add(right);
  if (items.length === 1) return items[0];
  return { kind: "union", items };
}

function infer(value: unknown, hint: string, used: Set<string>): Node {
  if (value === null) return { kind: "null" };
  if (typeof value === "string") return { kind: "string" };
  if (typeof value === "number") return { kind: "number" };
  if (typeof value === "boolean") return { kind: "boolean" };

  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: "array", item: { kind: "unknown" } };
    let item = infer(value[0], `${singular(hint)}Item`, used);
    for (const entry of value.slice(1)) {
      item = mergeNodes(item, infer(entry, `${singular(hint)}Item`, used), hint, used);
    }
    return { kind: "array", item };
  }

  if (typeof value === "object") {
    const name = uniqueName(hint, used);
    const properties = new Map<string, Node>();
    for (const [key, child] of Object.entries(value as JsonObject)) {
      properties.set(key, infer(child, `${name}${typeName(key)}`, used));
    }
    return { kind: "object", name, properties, optional: new Set() };
  }

  return { kind: "unknown" };
}

function nodeType(node: Node): string {
  switch (node.kind) {
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    case "unknown": return "unknown";
    case "array": return node.item.kind === "union" ? `Array<${nodeType(node.item)}>` : `${nodeType(node.item)}[]`;
    case "object": return node.name;
    case "union": return node.items.map(nodeType).join(" | ");
  }
}

function propertyName(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) && !reserved.has(key) ? key : JSON.stringify(key);
}

type ObjectNode = Extract<Node, { kind: "object" }>;

function collectObjects(root: Node): ObjectNode[] {
  const result: Node[] = [];
  const seen = new Set<string>();
  function visit(node: Node) {
    if (node.kind === "object") {
      if (seen.has(node.name)) return;
      seen.add(node.name);
      for (const child of node.properties.values()) visit(child);
      result.push(node);
    } else if (node.kind === "array") {
      visit(node.item);
    } else if (node.kind === "union") {
      node.items.forEach(visit);
    }
  }
  visit(root);
  return result;
}

function render(root: Node): string {
  if (root.kind === "object") {
    const objects = collectObjects(root);
    return objects.map((object) => {
      const lines = [...object.properties].map(([key, child]) => {
        const optional = object.optional.has(key) ? "?" : "";
        return `  ${propertyName(key)}${optional}: ${nodeType(child)};`;
      });
      return `export interface ${object.name} {\n${lines.join("\n")}\n}`;
    }).join("\n\n") + "\n";
  }

  const objects = collectObjects(root);
  const declarations = objects.map((object) => {
    const lines = [...object.properties].map(([key, child]) => {
      const optional = object.optional.has(key) ? "?" : "";
      return `  ${propertyName(key)}${optional}: ${nodeType(child)};`;
    });
    return `export interface ${object.name} {\n${lines.join("\n")}\n}`;
  });
  return `export type Root = ${nodeType(root)};\n${declarations.length ? "\n" + declarations.join("\n\n") + "\n" : ""}`;
}

export function generateTypeScript(input: string, rootName = "Root"): JsonToTypeScriptResult {
  try {
    const parsed: unknown = JSON.parse(input);
    if (parsed === null || (typeof parsed !== "object" && !Array.isArray(parsed))) {
      return { value: null, error: "unsupported-root" };
    }
    const used = new Set<string>();
    const root = infer(parsed, typeName(rootName), used);
    return { value: render(root), error: null };
  } catch {
    return { value: null, error: "invalid-json" };
  }
}
