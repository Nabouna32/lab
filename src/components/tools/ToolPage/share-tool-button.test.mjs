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
