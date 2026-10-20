import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../../components/ui/SearchBar.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../../components/ui/SearchBar.module.css", import.meta.url), "utf8");

test("shared SearchBar uses the Material Symbols component for its action icons", () => {
  assert.match(source, /import \{ MaterialIcon \} from "@\/components\/ui\/MaterialIcon"/);
  assert.match(source, /name="search"/);
  assert.match(source, /name="close"/);
  assert.match(source, /name="arrow_back"/);
  assert.doesNotMatch(source, /[⌕×←]/);
  assert.doesNotMatch(styles, /font-size:\s*(?:22|25)px/);
});
