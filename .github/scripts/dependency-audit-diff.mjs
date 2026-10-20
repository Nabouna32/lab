import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SEVERITY_RANK = { low: 1, moderate: 2, high: 3, critical: 4 };

export function extractHighSeverityFindings(report) {
  if (!report || typeof report !== "object" || !report.vulnerabilities || typeof report.vulnerabilities !== "object") {
    throw new Error("npm audit returned no vulnerability report; refusing to skip dependency validation.");
  }
  if (report.error) {
    throw new Error(`npm audit failed: ${report.error.summary ?? report.error.message ?? "unknown audit error"}`);
  }

  const findings = new Set();
  for (const [packageName, vulnerability] of Object.entries(report.vulnerabilities)) {
    if ((SEVERITY_RANK[vulnerability?.severity] ?? 0) < SEVERITY_RANK.high) continue;

    const advisories = Array.isArray(vulnerability.via)
      ? vulnerability.via.filter((entry) => entry && typeof entry === "object")
      : [];
    const identifiers = advisories.length
      ? advisories.map((advisory) => advisory.url ?? advisory.source ?? advisory.title ?? advisory.name ?? JSON.stringify(advisory))
      : [`unidentified:${vulnerability.range ?? "unknown-range"}`];

    for (const identifier of identifiers) {
      findings.add(`${packageName}|${vulnerability.severity}|${identifier}`);
    }
  }
  return findings;
}

export function findIntroducedFindings(baseReport, headReport) {
  const base = extractHighSeverityFindings(baseReport);
  const head = extractHighSeverityFindings(headReport);
  return [...head].filter((finding) => !base.has(finding)).sort();
}

function runNpmAudit(directory) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["audit", "--json"], {
    cwd: directory,
    encoding: "utf8",
    shell: process.platform === "win32",
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });

  if (result.error) throw new Error(`Could not run npm audit in ${directory}: ${result.error.message}`);
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(`npm audit returned invalid JSON in ${directory}. stderr: ${result.stderr.trim()}`);
  }
  if (result.status !== 0 && !report?.vulnerabilities) {
    throw new Error(`npm audit failed in ${directory} (exit ${result.status}): ${result.stderr.trim()}`);
  }
  // A status of 1 is npm's expected result when its JSON report contains vulnerabilities.
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(`npm audit failed in ${directory} (exit ${result.status}): ${result.stderr.trim()}`);
  }
  return report;
}

async function main() {
  const baselineDirectory = resolve(process.argv[2] ?? "");
  if (!process.argv[2] || !existsSync(resolve(baselineDirectory, "package.json")) || !existsSync(resolve(baselineDirectory, "package-lock.json"))) {
    throw new Error("Usage: node .github/scripts/dependency-audit-diff.mjs <baseline-checkout-with-package-lock>");
  }

  const baselineReport = runNpmAudit(baselineDirectory);
  const headReport = runNpmAudit(process.cwd());
  const introduced = findIntroducedFindings(baselineReport, headReport);

  if (introduced.length) {
    console.error("New high/critical npm advisories were introduced:");
    for (const finding of introduced) console.error(`- ${finding.replaceAll("|", " — ")}`);
    process.exitCode = 1;
    return;
  }

  const baselineCount = extractHighSeverityFindings(baselineReport).size;
  const headCount = extractHighSeverityFindings(headReport).size;
  console.log(`Dependency audit passed: no new high/critical npm advisories (${baselineCount} baseline findings, ${headCount} head findings).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
