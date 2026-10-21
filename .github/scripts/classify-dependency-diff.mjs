import { readFileSync, appendFileSync } from "node:fs";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
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

export function classifyDependencyDiff(baseManifest, headManifest, manifestsOnly) {
  if (manifestsOnly !== true) return "full";
  if (!baseManifest || typeof baseManifest !== "object" || Array.isArray(baseManifest)) return "full";
  if (!headManifest || typeof headManifest !== "object" || Array.isArray(headManifest)) return "full";
  const base = withoutEslintDependency(baseManifest);
  const head = withoutEslintDependency(headManifest);
  if (typeof base.version !== "string" || typeof head.version !== "string") return "full";
  if (base.version === head.version) return "full";
  if (JSON.stringify(base.remainder) !== JSON.stringify(head.remainder)) return "full";
  return "lint_only";
}

const [, , basePath, headPath, manifestsOnlyArgument] = process.argv;
if (!basePath || !headPath || process.argv.length !== 5) {
  throw new Error("Usage: node classify-dependency-diff.mjs <base-package.json> <head-package.json> <manifests-only:true|false>");
}
const baseManifest = JSON.parse(readFileSync(basePath, "utf8"));
const headManifest = JSON.parse(readFileSync(headPath, "utf8"));
const scope = classifyDependencyDiff(baseManifest, headManifest, manifestsOnlyArgument === "true");
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `scope=${scope}\n`);
console.log(`Dependency verification scope: ${scope}`);
