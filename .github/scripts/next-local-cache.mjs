import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const action = process.argv[2];
if (action !== "restore" && action !== "save") {
  console.error("Usage: node .github/scripts/next-local-cache.mjs <restore|save>");
  process.exit(2);
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
);
const nextVersion = packageJson.dependencies?.next;
if (typeof nextVersion !== "string" || nextVersion.length === 0) {
  throw new Error("Could not determine the pinned Next.js dependency version.");
}

const cacheKey = `${process.platform}-${process.arch}-next-${nextVersion}`;
const persistentCache = path.join(
  os.homedir(),
  ".cache",
  "loculary",
  "next",
  cacheKey,
);
const buildCache = path.join(process.cwd(), ".next", "cache");

if (action === "restore") {
  if (!fs.existsSync(persistentCache)) {
    console.log("No local Next.js cache found; the build will create one.");
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(buildCache), { recursive: true });
  fs.rmSync(buildCache, { recursive: true, force: true });
  fs.cpSync(persistentCache, buildCache, { recursive: true });
  console.log("Restored the Next.js cache from local runner storage.");
  process.exit(0);
}

if (!fs.existsSync(buildCache)) {
  console.log("Next.js did not create a cache directory; nothing to persist.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(persistentCache), { recursive: true });
fs.rmSync(persistentCache, { recursive: true, force: true });
fs.cpSync(buildCache, persistentCache, { recursive: true });
console.log("Persisted the Next.js cache on local runner storage.");
