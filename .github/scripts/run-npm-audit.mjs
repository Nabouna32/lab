import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const auditPath = path.resolve("npm-audit.json");
const reportPath = path.join(scriptDirectory, "report-npm-audit.mjs");

const auditResult = spawnSync(
  "npm",
  ["audit", "--audit-level=high", "--json"],
  {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    shell: process.platform === "win32",
  },
);

if (auditResult.error) {
  console.error(`Unable to execute npm audit: ${auditResult.error.message}`);
}
if (auditResult.stderr) console.error(auditResult.stderr);
writeFileSync(auditPath, auditResult.stdout ?? "", "utf8");

const reportResult = spawnSync(process.execPath, [reportPath, auditPath], {
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});

if (reportResult.stdout) process.stdout.write(reportResult.stdout);
if (reportResult.stderr) process.stderr.write(reportResult.stderr);

const auditStatus = auditResult.status ?? 1;
const reportStatus = reportResult.status ?? 1;

if (auditStatus !== 0) {
  process.exitCode = auditStatus;
} else if (reportStatus !== 0) {
  process.exitCode = reportStatus;
}
