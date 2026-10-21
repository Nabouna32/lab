import { readFileSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function equalJson(left, right) {
  return JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));
}

function withoutEslintDependency(manifest) {
  const copy = structuredClone(manifest);
  const version = copy?.devDependencies?.eslint;
  if (copy?.devDependencies) {
    delete copy.devDependencies.eslint;
    if (Object.keys(copy.devDependencies).length === 0) delete copy.devDependencies;
  }
  return { version, remainder: canonicalize(copy) };
}

function packageClosure(lockfile, rootNames) {
  const packages = lockfile.packages;
  const resolve = (fromPath, dependencyName) => {
    let current = fromPath;
    while (true) {
      const candidate = (current ? current + "/" : "") + "node_modules/" + dependencyName;
      if (Object.hasOwn(packages, candidate)) return candidate;
      if (!current) return null;
      const slash = current.lastIndexOf("/");
      current = slash < 0 ? "" : current.slice(0, slash);
    }
  };

  const visited = new Set();
  const pending = rootNames.map((name) => resolve("", name)).filter(Boolean);
  while (pending.length) {
    const packagePath = pending.pop();
    if (visited.has(packagePath)) continue;
    visited.add(packagePath);
    const entry = packages[packagePath] ?? {};
    for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
      for (const dependencyName of Object.keys(entry[field] ?? {})) {
        const resolved = resolve(packagePath, dependencyName);
        if (resolved && !visited.has(resolved)) pending.push(resolved);
      }
    }
  }
  return visited;
}

function withoutPackages(lockfile) {
  const copy = structuredClone(lockfile);
  delete copy.packages;
  return canonicalize(copy);
}

function rootWithoutEslint(lockfile) {
  const root = lockfile?.packages?.[""];
  if (!root || typeof root !== "object") return null;
  const copy = structuredClone(root);
  if (copy.devDependencies) {
    delete copy.devDependencies.eslint;
    if (Object.keys(copy.devDependencies).length === 0) delete copy.devDependencies;
  }
  return canonicalize(copy);
}

function lockfileContainsOnlyLintChanges(baseLock, headLock) {
  if (!baseLock || !headLock || typeof baseLock !== "object" || typeof headLock !== "object") return false;
  if (!baseLock.packages || !headLock.packages) return false;
  if (!equalJson(withoutPackages(baseLock), withoutPackages(headLock))) return false;
  if (!equalJson(rootWithoutEslint(baseLock), rootWithoutEslint(headLock))) return false;

  const baseRoot = baseLock.packages[""];
  const headRoot = headLock.packages[""];
  if (!baseRoot || !headRoot) return false;
  const baseDirect = { ...(baseRoot.dependencies ?? {}), ...(baseRoot.devDependencies ?? {}), ...(baseRoot.optionalDependencies ?? {}) };
  const headDirect = { ...(headRoot.dependencies ?? {}), ...(headRoot.devDependencies ?? {}), ...(headRoot.optionalDependencies ?? {}) };
  const lintRoots = ["eslint", "eslint-config-next"];
  const otherRoots = Object.keys({ ...baseDirect, ...headDirect }).filter((name) => !lintRoots.includes(name));
  const baseLint = packageClosure(baseLock, lintRoots);
  const headLint = packageClosure(headLock, lintRoots);
  const baseOther = packageClosure(baseLock, otherRoots);
  const headOther = packageClosure(headLock, otherRoots);

  const allPaths = new Set([...Object.keys(baseLock.packages), ...Object.keys(headLock.packages)]);
  allPaths.delete("");
  for (const packagePath of allPaths) {
    const baseEntry = baseLock.packages[packagePath];
    const headEntry = headLock.packages[packagePath];
    if (equalJson(baseEntry, headEntry)) continue;
    if (baseEntry && (!baseLint.has(packagePath) || baseOther.has(packagePath))) return false;
    if (headEntry && (!headLint.has(packagePath) || headOther.has(packagePath))) return false;
  }
  return true;
}

export function classifyDependencyDiff(baseManifest, headManifest, baseLock, headLock, manifestsOnly) {
  if (manifestsOnly !== true) return "full";
  if (!baseManifest || typeof baseManifest !== "object" || Array.isArray(baseManifest)) return "full";
  if (!headManifest || typeof headManifest !== "object" || Array.isArray(headManifest)) return "full";
  const base = withoutEslintDependency(baseManifest);
  const head = withoutEslintDependency(headManifest);
  if (typeof base.version !== "string" || typeof head.version !== "string") return "full";
  if (base.version === head.version || !equalJson(base.remainder, head.remainder)) return "full";
  if (baseLock?.packages?.[""]?.devDependencies?.eslint !== base.version) return "full";
  if (headLock?.packages?.[""]?.devDependencies?.eslint !== head.version) return "full";
  return lockfileContainsOnlyLintChanges(baseLock, headLock) ? "lint_only" : "full";
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , baseManifestPath, headManifestPath, baseLockPath, headLockPath, manifestsOnlyArgument] = process.argv;
  if (!baseManifestPath || !headManifestPath || !baseLockPath || !headLockPath || process.argv.length !== 7) {
    throw new Error("Usage: node classify-dependency-diff.mjs <base-package.json> <head-package.json> <base-package-lock.json> <head-package-lock.json> <manifests-only:true|false>");
  }
  const baseManifest = JSON.parse(readFileSync(baseManifestPath, "utf8"));
  const headManifest = JSON.parse(readFileSync(headManifestPath, "utf8"));
  const baseLock = JSON.parse(readFileSync(baseLockPath, "utf8"));
  const headLock = JSON.parse(readFileSync(headLockPath, "utf8"));
  const scope = classifyDependencyDiff(baseManifest, headManifest, baseLock, headLock, manifestsOnlyArgument === "true");
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `scope=${scope}\n`);
  console.log(`Dependency verification scope: ${scope}`);
}
