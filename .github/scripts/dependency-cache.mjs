import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const action = process.argv[2];
if (action !== "prepare" && action !== "save") {
  console.error("Usage: node .github/scripts/dependency-cache.mjs <prepare|save>");
  process.exit(2);
}

const workspace = process.cwd();
const workspaceModules = path.join(workspace, "node_modules");
const packageFiles = ["package.json", "package-lock.json", ".npmrc"];
const hash = crypto.createHash("sha256");

hash.update("node=" + process.version + "\nos=" + process.platform + "\narch=" + process.arch + "\n");
for (const filename of packageFiles) {
  const filepath = path.join(workspace, filename);
  hash.update("\nfile=" + filename + "\n");
  if (fs.existsSync(filepath)) hash.update(fs.readFileSync(filepath));
  else hash.update("<absent>");
}

const cacheKey = hash.digest("hex");
const cacheRoot = path.join(os.homedir(), ".cache", "loculary", "dependencies");
const cacheEntry = path.join(cacheRoot, cacheKey);
const cachedModules = path.join(cacheEntry, "node_modules");
const completeMarker = path.join(cacheEntry, ".complete");
const outputFile = process.env.GITHUB_OUTPUT;

function setOutput(name, value) {
  if (outputFile) fs.appendFileSync(outputFile, name + "=" + value + "\n");
}

function removeWorkspaceModules() {
  fs.rmSync(workspaceModules, { recursive: true, force: true });
}

function linkCachedModules() {
  fs.symlinkSync(
    cachedModules,
    workspaceModules,
    process.platform === "win32" ? "junction" : "dir",
  );
}

if (action === "prepare") {
  const cacheHit =
    fs.existsSync(completeMarker) &&
    fs.readFileSync(completeMarker, "utf8").trim() === cacheKey &&
    fs.existsSync(path.join(cachedModules, "next", "package.json")) &&
    fs.statSync(cachedModules).isDirectory();

  removeWorkspaceModules();

  if (cacheHit) {
    linkCachedModules();
    console.log("Reusing node_modules directly from persistent local storage.");
  } else {
    console.log("No complete dependency cache for this lockfile; npm ci is required.");
  }

  setOutput("cache-hit", String(cacheHit));
  process.exit(0);
}

if (!fs.existsSync(workspaceModules)) {
  throw new Error("node_modules is missing; refusing to save an incomplete dependency cache.");
}

fs.mkdirSync(cacheRoot, { recursive: true });
const temporaryEntry = path.join(cacheRoot, ".tmp-" + process.pid + "-" + cacheKey);
const temporaryModules = path.join(temporaryEntry, "node_modules");
fs.rmSync(temporaryEntry, { recursive: true, force: true });
fs.mkdirSync(temporaryEntry, { recursive: true });

try {
  // Prefer a same-volume rename (near-instant, no duplicate copy). Fall back
  // to a local copy only when the runner workspace and cache are on different volumes.
  try {
    fs.renameSync(workspaceModules, temporaryModules);
  } catch (error) {
    if (error?.code !== "EXDEV") throw error;
    fs.cpSync(workspaceModules, temporaryModules, { recursive: true, dereference: false });
    fs.rmSync(workspaceModules, { recursive: true, force: true });
  }

  fs.writeFileSync(path.join(temporaryEntry, ".complete"), cacheKey + "\n");
  fs.rmSync(cacheEntry, { recursive: true, force: true });
  fs.renameSync(temporaryEntry, cacheEntry);
  linkCachedModules();

  // Retain only the current dependency set, preventing old lockfiles from
  // accumulating full copies of node_modules on disk.
  for (const entry of fs.readdirSync(cacheRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== cacheKey) {
      fs.rmSync(path.join(cacheRoot, entry.name), { recursive: true, force: true });
    }
  }
  console.log("Persisted dependencies locally and linked the workspace to that cache.");
} catch (error) {
  fs.rmSync(temporaryEntry, { recursive: true, force: true });
  throw error;
}
