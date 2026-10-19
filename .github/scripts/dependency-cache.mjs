import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const action = process.argv[2];
if (action !== "prepare" && action !== "save") {
  console.error("Usage: node .github/scripts/dependency-cache.mjs <prepare|save>");
  process.exit(2);
}

const workspaceModules = path.join(process.cwd(), "node_modules");
const packageFiles = ["package.json", "package-lock.json", ".npmrc"];
const hash = crypto.createHash("sha256");

hash.update("node=" + process.version + "\nos=" + process.platform + "\narch=" + process.arch + "\n");
for (const filename of packageFiles) {
  const filepath = path.join(process.cwd(), filename);
  hash.update("\nfile=" + filename + "\n");
  if (fs.existsSync(filepath)) hash.update(fs.readFileSync(filepath));
  else hash.update("<absent>");
}

const cacheKey = hash.digest("hex");
const cacheRoot = path.join(os.homedir(), ".cache", "loculary");
const markerPath = path.join(cacheRoot, "dependencies-key");
const legacyCacheRoot = path.join(cacheRoot, "dependencies");
const outputFile = process.env.GITHUB_OUTPUT;

function setOutput(name, value) {
  if (outputFile) fs.appendFileSync(outputFile, name + "=" + value + "\n");
}

if (action === "prepare") {
  let workspaceIsLink = false;
  try {
    workspaceIsLink = fs.lstatSync(workspaceModules).isSymbolicLink();
  } catch {
    // Missing node_modules is a normal cache miss.
  }

  const cacheHit =
    !workspaceIsLink &&
    fs.existsSync(markerPath) &&
    fs.readFileSync(markerPath, "utf8").trim() === cacheKey &&
    fs.existsSync(path.join(workspaceModules, "next", "package.json"));

  if (cacheHit) {
    console.log("Reusing node_modules in the persistent runner workspace; no copy or link needed.");
  } else {
    fs.rmSync(workspaceModules, { recursive: true, force: true });
    console.log("Local node_modules does not match the current lockfile/runtime; npm ci is required.");
  }

  // Remove the old external node_modules cache after detaching any legacy junction.
  // The active dependency tree now lives directly in the runner workspace.
  fs.rmSync(legacyCacheRoot, { recursive: true, force: true });

  setOutput("cache-hit", String(cacheHit));
  process.exit(0);
}

if (!fs.existsSync(path.join(workspaceModules, "next", "package.json"))) {
  throw new Error("node_modules/next is missing; refusing to mark dependencies as cached.");
}

fs.mkdirSync(cacheRoot, { recursive: true });
fs.writeFileSync(markerPath, cacheKey + "\n");
console.log("Recorded the dependency fingerprint; node_modules stays in the workspace for Turbopack.");
