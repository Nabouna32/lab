import { readFileSync } from "node:fs";

const auditPath = process.argv[2] ?? "npm-audit.json";
const lockPath = process.argv[3] ?? "package-lock.json";

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read valid JSON from ${path}: ${error.message}`);
  }
}

const audit = readJson(auditPath);
const lock = readJson(lockPath);
const packages = lock.packages ?? {};
const root = packages[""] ?? {};
const findings = Object.entries(audit.vulnerabilities ?? {});
const severityOrder = ["critical", "high", "moderate", "low", "info"];
const counts = audit.metadata?.vulnerabilities ?? {};

function dependenciesOf(entry) {
  return {
    ...entry.dependencies,
    ...entry.optionalDependencies,
    ...entry.devDependencies,
  };
}

function resolvePackage(parentKey, name) {
  let current = parentKey;
  while (true) {
    const candidate = current
      ? `${current}/node_modules/${name}`
      : `node_modules/${name}`;
    if (packages[candidate]) return candidate;
    if (!current) return null;
    const nestedIndex = current.lastIndexOf("/node_modules/");
    current = nestedIndex >= 0 ? current.slice(0, nestedIndex) : "";
  }
}

function dependencyPaths(packageName, vulnerable) {
  const declaredTargets = new Set(vulnerable.nodes ?? []);
  const targets = declaredTargets.size
    ? declaredTargets
    : new Set(Object.entries(packages)
        .filter(([key, entry]) => key && entry.name === packageName)
        .map(([key]) => key));
  const paths = [];
  function visit(parentKey, chain, seen) {
    if (paths.length >= 10 || chain.length > 100) return;
    for (const name of Object.keys(dependenciesOf(packages[parentKey] ?? {}))) {
      const key = resolvePackage(parentKey, name);
      if (!key || seen.has(key)) continue;
      const entry = packages[key];
      const nextChain = [...chain, `${name}@${entry.version ?? "unknown"}`];
      if (targets.has(key) || (!declaredTargets.size && entry.name === packageName)) {
        paths.push(nextChain.join(" → "));
        if (paths.length >= 10) return;
      } else {
        const nextSeen = new Set(seen);
        nextSeen.add(key);
        visit(key, nextChain, nextSeen);
      }
    }
  }

  visit("", [`${root.name ?? lock.name ?? "root"}@${root.version ?? lock.version ?? "unknown"}`], new Set());
  return paths;
}

function fixDescription(value) {
  if (value === false) return "Aucun correctif proposé par npm";
  if (value === true) return "Correctif disponible (version compatible)";
  if (value && typeof value === "object") {
    const version = value.version ? `version ${value.version}` : "version non précisée";
    const major = value.isSemVerMajor ? " ; mise à jour majeure requise" : "";
    return `Correctif proposé : ${value.name ?? "paquet concerné"} ${version}${major}`;
  }
  return "Disponibilité du correctif non précisée par npm";
}

console.log("## npm audit — rapport de sécurité");
console.log(`Résumé : ${findings.length} paquet(s) vulnérable(s) signalé(s).`);
console.log(`Sévérités : ${severityOrder.map((level) => `${level}=${counts[level] ?? 0}`).join(", ")}.`);
console.log(`Vulnérabilités comptabilisées : ${counts.total ?? "non communiqué"}.`);

if (findings.length === 0) {
  console.log("Aucune vulnérabilité n’est présente dans le rapport JSON.");
}

for (const [packageName, vulnerability] of findings) {
  console.log("");
  console.log(`### ${packageName}@${vulnerability.range ?? "version inconnue"} — ${vulnerability.severity?.toUpperCase() ?? "sévérité inconnue"}`);
  console.log(`Type : ${vulnerability.isDirect ? "dépendance directe" : "dépendance transitive"}.`);
  console.log(`Versions affectées : ${vulnerability.range ?? "non précisées"}.`);
  console.log(`Version(s) installée(s) : ${(vulnerability.nodes ?? []).join(", ") || "non précisées"}.`);
  console.log(`Correctif : ${fixDescription(vulnerability.fixAvailable)}.`);

  const paths = dependencyPaths(packageName, vulnerability);
  console.log("Chemins de dépendances :");
  if (paths.length) {
    for (const path of paths) console.log(`- ${path}`);
    if (paths.length === 10) console.log("- Affichage limité à 10 chemins pour ce paquet.");
  } else {
    console.log("- Aucun chemin n’a pu être reconstruit depuis package-lock.json.");
  }

  const advisories = (vulnerability.via ?? []).filter((item) => item && typeof item === "object");
  if (!advisories.length) {
    console.log("Avis : npm n’a fourni aucun objet d’avis détaillé pour ce paquet.");
  }
  for (const advisory of advisories) {
    const advisoryId = advisory.url?.split("/").filter(Boolean).at(-1)
      ?? (advisory.source ? `source #${advisory.source}` : "identifiant non fourni");
    console.log(`Avis : ${advisoryId}`);
    console.log(`- Titre : ${advisory.title ?? "non fourni"}`);
    console.log(`- Sévérité : ${advisory.severity ?? vulnerability.severity ?? "non précisée"}`);
    console.log(`- URL : ${advisory.url ?? "non fournie"}`);
    console.log(`- Plage affectée : ${advisory.range ?? vulnerability.range ?? "non précisée"}`);
    if (advisory.cwe?.length) console.log(`- CWE : ${advisory.cwe.join(", ")}`);
    if (advisory.cvss?.score !== undefined) console.log(`- Score CVSS : ${advisory.cvss.score}`);
  }

  if (vulnerability.effects?.length) {
    console.log(`Dépendances impactées en aval : ${vulnerability.effects.join(", ")}.`);
  }
}

console.log("");
console.log(`Résultat npm audit : ${audit.error?.code ?? "aucune erreur reportée par npm"}.`);
if (audit.error?.summary) console.log(audit.error.summary);
