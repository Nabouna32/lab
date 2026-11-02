import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const shareToolButton = readFileSync(new URL("./ShareToolButton.tsx", import.meta.url), "utf8");

test("tool sharing uses the shared clipboard helper for its Web Share fallback", () => {
  assert.match(shareToolButton, /import \{ copyTextToClipboard \} from "@\/lib\/copy"/);
  assert.match(shareToolButton, /await copyTextToClipboard\(url\)/);
  assert.doesNotMatch(shareToolButton, /navigator\.clipboard/);
  assert.match(shareToolButton, /setStatus\(copied \? "copied" : "error"\)/);
});


test("tool sharing uses the official Material share symbol and the shared IconButton", () => {
  assert.match(shareToolButton, /import \{ IconButton \} from "@\/components\/ui\/IconButton"/);
  assert.match(shareToolButton, /<IconButton label=\{messages\.shareTool\} onClick=\{handleShare\}>/);
  assert.doesNotMatch(shareToolButton, /title=\{messages\.shareTool\}/);
  assert.ok(!shareToolButton.includes("{messages.shareTool}</span>"));
  assert.match(shareToolButton, /MaterialIcon name="share"/);
  assert.doesNotMatch(shareToolButton, /arrow_outward/);
});
