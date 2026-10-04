import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const agentsDir = path.join(root, 'agents');
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(`Missing required file: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function has(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing required reference/content: ${needle}`);
}

const common = read('agents/AGENT-CONTRACT.md');
const start = read('agents/START-HERE.md');
const rootRules = read('AGENTS.md');
const handoff = read('agents/HANDOFF-CONTRACT.md');
const auditContract = read('agents/AUDIT-CONTRACT.md');
const toolContract = read('agents/tools/TOOL-FACTORY-CONTRACT.md');
const toolWorker = read('agents/tools/TOOL-WORKER.md');
const featureContract = read('agents/features/FEATURE-FACTORY-CONTRACT.md');
const featureWorker = read('agents/features/FEATURE-WORKER.md');
const featureOrchestrator = read('agents/features/FEATURE-ORCHESTRATOR.md');
const agentsReadme = read('agents/README.md');

has(handoff, 'Write-before / write-after protocol', 'Handoff contract');
has(handoff, 'WORKING.md', 'Handoff contract');
has(handoff, 'last durable commit SHA', 'Handoff contract');
has(auditContract, 'agents/AGENT-CONTRACT.md', 'Audit contract');
has(auditContract, 'agents/HANDOFF-CONTRACT.md', 'Audit contract');
has(auditContract, 'docs/audits/<audit-id>/WORKING.md', 'Audit contract');
has(toolContract, 'agents/AGENT-CONTRACT.md', 'Tool contract');
has(toolContract, 'agents/HANDOFF-CONTRACT.md', 'Tool contract');
has(toolWorker, 'agents/AGENT-CONTRACT.md', 'Tool worker');
has(toolWorker, 'agents/HANDOFF-CONTRACT.md', 'Tool worker');
has(toolWorker, 'agents/handoffs/tool/', 'Tool worker');
has(featureContract, 'agents/AGENT-CONTRACT.md', 'Feature contract');
has(featureContract, 'agents/HANDOFF-CONTRACT.md', 'Feature contract');
has(featureWorker, 'agents/AGENT-CONTRACT.md', 'Feature worker');
has(featureWorker, 'agents/HANDOFF-CONTRACT.md', 'Feature worker');
has(featureWorker, 'agents/handoffs/feature/', 'Feature worker');
has(featureOrchestrator, 'agents/features/FEATURE-FACTORY-CONTRACT.md', 'Feature orchestrator');
has(agentsReadme, 'agents/AGENT-CONTRACT.md', 'Agents README');
has(start, 'agents/AGENT-CONTRACT.md', 'Agent start guide');
has(common, 'brand-new conversation', 'Common contract');
has(common, 'MUST NOT begin implementation or audit conclusions', 'Common contract');
has(common, 'tool output was truncated', 'Common contract');
has(common, 'Conversation failure resilience', 'Common contract');
has(common, 'HANDOFF-CONTRACT.md', 'Common contract');
has(rootRules, 'Work one validated step at a time.', 'AGENTS.md');

const auditDir = path.join(agentsDir, 'audits');
const auditFiles = listMarkdown(auditDir).filter((name) => /^\d{2}-.+\.md$/.test(name));
const audits = auditFiles.map((name) => {
  const match = /^(\d{2})-(.+)\.md$/.exec(name);
  const id = Number(match[1]);
  const content = fs.readFileSync(path.join(auditDir, name), 'utf8');
  return { name, id, content };
});

const ids = audits.map((audit) => audit.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
for (const id of [...new Set(duplicateIds)]) {
  fail(`Duplicate audit ID: ${String(id).padStart(2, '0')}`);
}

const sortedIds = [...new Set(ids)].sort((a, b) => a - b);
for (let i = 0; i < sortedIds.length; i += 1) {
  const expected = i + 1;
  if (sortedIds[i] !== expected) {
    fail(`Audit IDs are not contiguous: expected ${String(expected).padStart(2, '0')}, found ${String(sortedIds[i]).padStart(2, '0')}`);
  }
}

for (const audit of audits) {
  has(audit.content, 'agents/AUDIT-CONTRACT.md', `Audit mission ${audit.name}`);
  const reportSlug = audit.name.replace(/^\d{2}-/, '').replace(/\.md$/, '');
  const reportDir = path.join(root, 'docs', 'audits', `${String(audit.id).padStart(2, '0')}-${reportSlug}`);
  if (!fs.existsSync(reportDir)) {
    warn(`No report directory currently exists for ${audit.name}: expected ${path.relative(root, reportDir)}`);
  }
}

const finalAudits = audits.filter((audit) => /final|red[- ]team/i.test(audit.name));
if (finalAudits.length !== 1) {
  fail(`Expected exactly one final/red-team audit mission, found ${finalAudits.length}.`);
} else if (finalAudits[0].id !== Math.max(...ids)) {
  fail(`Final/red-team audit ${finalAudits[0].name} is not the last numeric audit.`);
}

for (const rel of ['agents/tools/TOOL-WORKER.md']) {
  const content = read(rel);
  has(content, 'agents/AGENT-CONTRACT.md', rel);
  has(content, 'FIRST ACTION', rel);
  has(content, 'current `main`', rel);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['validate:agents'] !== 'node agents/validate-agent-system.mjs') {
  fail('package.json: missing scripts.validate:agents = node agents/validate-agent-system.mjs');
}

const ci = read('.github/workflows/ci.yml');
has(ci, 'npm run validate:agents', '.github/workflows/ci.yml');

if (errors.length) {
  console.error(`Agent system validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) {
    console.error(`Warnings (${warnings.length}):`);
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}

console.log(`Agent system validation passed: ${audits.length} audit missions checked.`);
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
