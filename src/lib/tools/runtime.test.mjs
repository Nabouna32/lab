import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const typesFile = fileURLToPath(new URL("./types.ts", import.meta.url));
const toolsFile = fileURLToPath(new URL("./tools.ts", import.meta.url));
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

test("clipboard access is enforced through the tool runtime", async () => {
  const runtime = await readFile(runtimeFile, "utf8");
  const copyButton = await readFile(copyButtonFile, "utf8");
  const tools = await readFile(toolsFile, "utf8");

  assert.match(runtime, /requireCapability\("clipboard"\)/);
  assert.match(copyButton, /useToolRuntime/);
  assert.doesNotMatch(copyButton, /copyTextToClipboard/);

  for (const toolId of ["percentage", "word-character-counter"]) {
    const entry = tools.match(new RegExp(`id: "${toolId}"[\\s\\S]*?(?=\\n  \\},|\\n\\]\\.map)`));
    assert.ok(entry, `Tool "${toolId}" must exist in the catalog.`);
    assert.match(entry[0], /capabilities: \["clipboard"\]/);
  }
});

test("the runtime is scoped to a tool page instead of being global", async () => {
  const runtime = await readFile(runtimeFile, "utf8");
  assert.match(runtime, /ToolRuntimeContext/);

  const toolPage = await readFile(toolPageFile, "utf8");
  assert.match(toolPage, /<ToolRuntimeProvider[\s\S]*\{content &&/);
});
