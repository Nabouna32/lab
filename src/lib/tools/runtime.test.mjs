import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const typesFile = fileURLToPath(new URL("./types.ts", import.meta.url));
const toolsFile = fileURLToPath(new URL("./tools.ts", import.meta.url));
const registryFile = fileURLToPath(new URL("./registry.ts", import.meta.url));
const runtimeFile = fileURLToPath(new URL("../../components/tools/ToolPage/ToolRuntimeProvider.tsx", import.meta.url));
const toolPageFile = fileURLToPath(new URL("../../components/tools/ToolPage/ToolPage.tsx", import.meta.url));
const copyButtonFile = fileURLToPath(new URL("../../components/ui/CopyButton.tsx", import.meta.url));

test("tool contract exposes an explicit access axis", async () => {
  const source = await readFile(typesFile, "utf8");
  assert.match(source, /export type ToolAccess = "anonymous" \| "account" \| "premium";/);
  assert.match(source, /\n  access: ToolAccess;/);
});

test("tool page provides the declared runtime capabilities to modules", async () => {
  const source = await readFile(toolPageFile, "utf8");
  assert.match(source, /ToolRuntimeProvider/);
  assert.match(source, /access=\{tool\.access\}/);
  assert.match(source, /capabilities=\{tool\.capabilities\}/);
});

test("tool clipboard access is capability-gated, including CopyButton", async () => {
  const runtime = await readFile(runtimeFile, "utf8");
  const copyButton = await readFile(copyButtonFile, "utf8");
  const tools = (await readFile(toolsFile, "utf8")).replace(/\r\n/g, "\n");
  const registry = await readFile(registryFile, "utf8");

  assert.match(runtime, /requireCapability\("clipboard"\)/);
  assert.match(copyButton, /useToolRuntime/);
  assert.doesNotMatch(copyButton, /copyTextToClipboard/);

  const registryEntries = [
    ...registry.matchAll(
      /^\s*(?:"([^"]+)"|([a-z0-9-]+)):\s*createToolModule\(\s*\(\) => import\("@\/components\/tools\/([^"]+)"\)/gm,
    ),
  ];
  assert.ok(registryEntries.length > 0, "The tool registry must expose runtime modules.");

  const definitionsStart = tools.indexOf("const toolDefinitions");
  const definitionsEnd = tools.indexOf("\n];", definitionsStart);
  assert.notEqual(definitionsStart, -1, "The tool catalog must define toolDefinitions.");
  assert.notEqual(definitionsEnd, -1, "The tool catalog must terminate toolDefinitions.");

  const definitions = new Map();
  const definitionLines = tools.slice(definitionsStart, definitionsEnd).split("\n");
  for (let index = 0; index < definitionLines.length; index += 1) {
    if (definitionLines[index] !== "  {") continue;

    let end = index + 1;
    while (end < definitionLines.length && definitionLines[end] !== "  },") end += 1;
    const entry = definitionLines.slice(index, end + 1).join("\n");
    const id = entry.match(/\bid:\s*"([^"]+)"/)?.[1];
    if (id) definitions.set(id, entry);
    index = end;
  }

  const copyToolIds = [];
  for (const match of registryEntries) {
    const toolId = match[1] ?? match[2];
    const modulePath = fileURLToPath(
      new URL(`../../components/tools/${match[3]}.tsx`, import.meta.url),
    );
    const moduleSource = await readFile(modulePath, "utf8");
    assert.doesNotMatch(
      moduleSource,
      /navigator\.clipboard/,
      `Tool "${toolId}" must not bypass the capability-gated clipboard runtime.`,
    );

    const usesCopyButton = /import\s*\{[^}]*\bCopyButton\b[^}]*\}\s*from\s*"@\/components\/ui\/CopyButton"/s.test(moduleSource);
    const usesRuntimeClipboard = /clipboard\.writeText\(/.test(moduleSource);
    if (usesRuntimeClipboard) {
      assert.match(moduleSource, /useToolRuntime/);
    }
    if (!usesCopyButton && !usesRuntimeClipboard) continue;

    copyToolIds.push(toolId);
    const entry = definitions.get(toolId);
    assert.ok(entry, `Tool "${toolId}" must exist in the catalog.`);
    assert.match(
      entry,
      /capabilities:\s*\[[^\]]*["\x27]clipboard["\x27]/,
      `Tool "${toolId}" uses clipboard access and must declare the clipboard capability.`,
    );
    if (usesCopyButton) {
      assert.match(runtime, /requireCapability\("clipboard"\)/);
      assert.match(copyButton, /useToolRuntime/);
      assert.doesNotMatch(copyButton, /copyTextToClipboard/);
    }
  }

  assert.ok(copyToolIds.length > 0, "At least one registered tool must use CopyButton.");
});
test("the runtime is scoped to a tool page instead of being global", async () => {
  const runtime = await readFile(runtimeFile, "utf8");
  assert.match(runtime, /ToolRuntimeContext/);

  const toolPage = await readFile(toolPageFile, "utf8");
  assert.match(toolPage, /<ToolRuntimeProvider[\s\S]*\{content &&/);
});
