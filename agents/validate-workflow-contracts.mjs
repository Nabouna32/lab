import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail('Missing required file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}
function has(text, needle, label) {
  if (!text.includes(needle)) fail(label + ': missing required content: ' + needle);
}
function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

const common = read('agents/AGENT-CONTRACT.md');
const start = read('agents/START-HERE.md');
const rootRules = read('AGENTS.md');
const auditContract = read('agents/AUDIT-CONTRACT.md');
const issueContract = read('agents/PRODUCT-ISSUE-CONTRACT.md');
const featureContract = read('agents/features/FEATURE-FACTORY-CONTRACT.md');
const featureWorkflow = read('agents/features/FEATURE-WORKFLOW.md');
const toolContract = read('agents/tools/TOOL-FACTORY-CONTRACT.md');
const toolWorkflow = read('agents/tools/TOOL-WORKFLOW.md');
const productWorkflow = read('agents/product/PRODUCT-WORKFLOW.md');
const readme = read('agents/README.md');
const auditsReadme = read('agents/audits/README.md');
const governanceAudit = read('agents/audits/30-documentation-governance.md');

has(common, 'single ChatGPT assistant', 'Common contract');
has(common, 'Mandatory challenge and optimization', 'Common contract');
has(common, 'actionable discovery outside the current scope', 'Common contract');
has(common, 'Git retains ordinary history', 'Common contract');
has(common, 'Inspect the complete diff', 'Common contract');
has(start, 'one validated step at a time', 'Start guide');
has(start, 'agents/PRODUCT-ISSUE-CONTRACT.md', 'Start guide');
has(start, 'agents/AUDIT-CONTRACT.md', 'Start guide');
has(issueContract, 'ask explicitly', 'Issue contract');
has(issueContract, 'create a dedicated Issue or attach it to an existing Issue', 'Issue contract');
has(issueContract, 'independent resumption', 'Issue contract');
has(auditContract, 'Historical immutability', 'Audit contract');
has(auditContract, 'LATEST.md', 'Audit contract');
has(auditContract, 'read-only', 'Audit contract');
has(featureContract, 'mandatory', 'Feature workflow');
has(featureWorkflow, 'FEATURE-FACTORY-CONTRACT.md', 'Feature launch checklist');
has(toolContract, 'tool', 'Tool workflow');
has(toolWorkflow, 'TOOL-FACTORY-CONTRACT.md', 'Tool launch checklist');
has(productWorkflow, 'consequential', 'Product workflow');
has(readme, 'single ChatGPT assistant', 'Workflow README');
has(auditsReadme, 'historical audit reports', 'Audit README');
has(governanceAudit, 'Revue après audit et poursuite validée', 'Governance audit procedure');
has(rootRules, 'Work one validated step at a time.', 'AGENTS.md');

const coreText = common + start + readme;
if (/Meta-Agent|Feature Worker|Tool Worker|Feature Orchestrator|Tool Orchestrator|Product \/ Direction Agent/.test(coreText)) {
  fail('Core workflow docs still contain obsolete delegated-role language.');
}
for (const rel of [
  'agents/features/FEATURE-WORKER.md',
  'agents/features/FEATURE-ORCHESTRATOR.md',
  'agents/tools/TOOL-WORKER.md',
  'agents/tools/TOOL-ORCHESTRATOR.md',
  'agents/product/PRODUCT-AGENT.md',
  'docs/PRODUCT_BRAINSTORM.md',
  'agents/validate-agent-system.mjs'
]) {
  if (fs.existsSync(path.join(root, rel))) fail('Obsolete workflow artifact still exists: ' + rel);
}

const auditFiles = listMarkdown(path.join(root, 'agents', 'audits')).filter((name) => /^\d{2}-.+\.md$/.test(name));
const audits = auditFiles.map((name) => {
  const id = Number(/^(\d{2})-/.exec(name)[1]);
  const content = fs.readFileSync(path.join(root, 'agents', 'audits', name), 'utf8');
  return { name, id, content };
});
const ids = audits.map((audit) => audit.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
for (const id of [...new Set(duplicates)]) fail('Duplicate audit ID: ' + String(id).padStart(2, '0'));
const sortedIds = [...new Set(ids)].sort((a, b) => a - b);
for (let i = 0; i < sortedIds.length; i += 1) {
  if (sortedIds[i] !== i + 1) fail('Audit IDs are not contiguous: expected ' + String(i + 1).padStart(2, '0') + ', found ' + String(sortedIds[i]).padStart(2, '0'));
}
for (const audit of audits) {
  has(audit.content, 'agents/AUDIT-CONTRACT.md', 'Audit procedure ' + audit.name);
  has(audit.content, 'Revue après audit et poursuite validée', 'Audit continuation procedure ' + audit.name);
  has(audit.content, 'Issue de mission', 'Audit mission checkpoint ' + audit.name);
  if (/(?:agent autonome|agent d'implémentation|agent ultérieur|prompt .*pour l'agent d'implémentation|authorized Worker|Worker handoff|Audit Agent|orchestrated mission|HANDOFF-CONTRACT\\.md|FEATURE-WORKER\\.md|TOOL-WORKER\\.md)/i.test(audit.content)) {
    fail('Audit procedure ' + audit.name + ' still contains obsolete delegated-role wording or references.');
  }
  const slug = audit.name.replace(/^\d{2}-/, '').replace(/\.md$/, '');
  const reportDir = path.join(root, 'docs', 'audits', String(audit.id).padStart(2, '0') + '-' + slug);
  if (!fs.existsSync(reportDir)) warn('No report directory currently exists for ' + audit.name + ': expected ' + path.relative(root, reportDir));
}
const finalAudits = audits.filter((audit) => /final|red[- ]team/i.test(audit.name));
if (finalAudits.length !== 1) fail('Expected exactly one final/red-team audit procedure, found ' + finalAudits.length + '.');
else if (finalAudits[0].id !== Math.max(...ids)) fail('Final/red-team audit ' + finalAudits[0].name + ' is not the last numbered procedure.');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['validate:workflows'] !== 'node agents/validate-workflow-contracts.mjs') fail('package.json: missing scripts.validate:workflows = node agents/validate-workflow-contracts.mjs');
if (pkg.scripts?.['validate:agents'] !== undefined) fail('package.json still exposes the obsolete validate:agents script.');
const ci = read('.github/workflows/ci.yml');
has(ci, 'npm run validate:workflows', 'CI workflow');
if (ci.includes('npm run validate:agents')) fail('CI still calls the obsolete agent validator.');

if (errors.length) {
  console.error('Workflow validation failed with ' + errors.length + ' error(s):');
  for (const error of errors) console.error('- ' + error);
  if (warnings.length) {
    console.error('Warnings (' + warnings.length + '):');
    for (const warning of warnings) console.error('- ' + warning);
  }
  process.exit(1);
}
console.log('Workflow validation passed: ' + audits.length + ' audit procedures checked.');
if (warnings.length) {
  console.log('Warnings (' + warnings.length + '):');
  for (const warning of warnings) console.log('- ' + warning);
}