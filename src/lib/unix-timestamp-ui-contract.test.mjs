import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(
  new URL("../components/tools/unix-timestamp/UnixTimestampConverter.tsx", import.meta.url),
  "utf8",
);

test("timestamp conversion fields describe the rendered validation error", () => {
  assert.equal(
    (source.match(/aria-describedby=\{error \? "unix-timestamp-error" : undefined\}/g) ?? []).length,
    2,
  );
  assert.match(
    source,
    /<p id="unix-timestamp-error" role="alert"[^>]*>\{t\.invalid\}<\/p>/,
  );
});
