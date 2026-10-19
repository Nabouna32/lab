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

const cacheKey = process.platform + "-" + process.arch + "-next-" + nextVersion;
const persistentCache = path.join(
  os.homedir(),
  ".cache",
  "loculary",
  "next",
  cacheKey,
);
const buildCache = path.join(process.cwd(), ".next", "cache");

if (action === "restore") {
  fs.mkdirSync(persistentCache, { recursive: true });
  fs.mkdirSync(path.dirname(buildCache), { recursive: true });

  // Link Next.js directly to the persistent local cache: no archive, network
  // transfer, or full cache copy on every CI run.
  fs.rmSync(buildCache, { recursive: true, force: true });
  fs.symlinkSync(
    persistentCache,
    buildCache,
    process.platform === "win32" ? "junction" : "dir",
  );
  console.log("Linked Next.js directly to its persistent local build cache.");
  process.exit(0);
}

if (!fs.existsSync(buildCache)) {
  throw new Error("The Next.js cache link is missing; refusing to report a persisted cache.");
}

const resolvedBuildCache = fs.realpathSync(buildCache);
const resolvedPersistentCache = fs.realpathSync(persistentCache);
if (resolvedBuildCache !== resolvedPersistentCache) {
  throw new Error("Next.js cache is not linked to the expected persistent local cache.");
}

console.log("Next.js build cache was updated in place on local runner storage.");
