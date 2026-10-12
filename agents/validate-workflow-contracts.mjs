import fs from 'node:fs';
import path from 'node:path';
import { validateApprovalWorkflowContracts } from './validate-workflow-contracts.rules.mjs';

const root = process.cwd();
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const read = (relative) => {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    fail(`Missing required file: ${relative}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
};
const has = (text, value, label) => {
  if (!text.includes(value)) fail(`${label}: missing "${value}"`);
};
const listMarkdownRecursive = (directory, prefix = '') => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return listMarkdownRecursive(absolute, relative);
    return entry.isFile() && entry.name.endsWith('.md') ? [relative] : [];
  }).sort();
};

const common = read('agents/AGENT-CONTRACT.md');
const start = read('agents/START-HERE.md');
const rootRules = read('AGENTS.md');
const issueContract = read('agents/PRODUCT-ISSUE-CONTRACT.md');
const featureContract = read('agents/features/FEATURE-FACTORY-CONTRACT.md');
const featureGuide = read('agents/features/FEATURE-WORKFLOW.md');
const toolContract = read('agents/tools/TOOL-FACTORY-CONTRACT.md');
const toolGuide = read('agents/tools/TOOL-WORKFLOW.md');
const productGuide = read('agents/product/PRODUCT-WORKFLOW.md');
const workflowIndex = read('agents/README.md');
const decisions = read('docs/DECISIONS.md');
const packageJson = JSON.parse(read('package.json'));
const ci = read('.github/workflows/ci.yml');


has(common, 'single ChatGPT assistant', 'Common contract');
has(common, 'The user retains final authority', 'Decision authority');
has(common, 'approved proposal and Issue criteria', 'Proposal-to-implementation traceability');
has(common, 'Assess urgency and priority across Loculary', 'Portfolio prioritization');
has(common, 'Use emojis generously and naturally as visual markers in user-facing responses', 'Assistant emoji convention');
has(common, 'functional product icons remain governed by', 'Product iconography distinction');
has(common, 'A user\'s opinion, objection, doubt or counterargument is not automatically a decision', 'Discussion closure');
has(common, 'active mission Issue stores the operational plan', 'Plan ownership');
has(common, 'Do not require a handoff prompt by default', 'Optional conversation handoff');
errors.push(...validateApprovalWorkflowContracts({ common, start, rootRules, issueContract, featureGuide, toolGuide, productGuide, decisions }));
has(common, '**OBSERVED**', 'Evidence integrity');
has(issueContract, 'Operational plan', 'Issue contract plan structure');
has(issueContract, 'Approval and continuity', 'Issue contract continuity');
has(issueContract, 'Traceability and verification', 'Issue decision-to-implementation traceability');
has(start, 'Read the complete active mission Issue and relevant comments', 'Bootstrap');
has(rootRules, 'Do not require a new conversation or a handoff prompt by default', 'Optional repository handoff');
has(featureContract, 'feature-specific requirements', 'Feature specialization');
has(toolContract, 'formulas, units, conversion factors', 'Tool domain checks');
has(featureGuide, 'manual-only', 'Feature E2E policy');
has(toolGuide, 'manual-only', 'Tool E2E policy');
has(productGuide, 'Never change direction silently', 'Product workflow');
has(decisions, '## DEC-049 — Controlled manual merge as the default delivery workflow', 'Merge decision');
has(common, 'Never bypass protections', 'Protected merge policy');

const activeAgentFiles = listMarkdownRecursive(path.join(root, 'agents'));
const activeAgentText = activeAgentFiles.map((file) => read(`agents/${file}`)).join('\n');
const governanceText = `${rootRules}\n${common}\n${start}\n${issueContract}\n${workflowIndex}\n${activeAgentText}\n${read('docs/PRODUCT.md')}\n${read('docs/PROJECT_INSTRUCTIONS.md')}`;
const staleRules = [
  [/make the smallest coherent change/i, 'smallest-change rule'],
  [/make the smallest change that solves/i, 'smallest-change rule'],
  [/implement the smallest useful version/i, 'smallest-version rule'],
  [/smallest coherent implementation sequence/i, 'smallest-sequence rule'],
  [/concise visual control receipt being trialed/i, 'mechanical trial receipt'],
  [/one validated execution step at a time/i, 'step-by-step approval framing'],
  [/validated scope limits execution authorization/i, 'scope-centric authorization framing'],
];
for (const [pattern, label] of staleRules) {
  if (pattern.test(governanceText)) fail(`Obsolete collaboration framing remains: ${label}`);
}


if (/use emojis sparingly|emojis? without clutter|concise visual control receipt being trialed/i.test(governanceText)) {
  fail('Active agent guidance still restricts emoji use or requires a mechanical response receipt');
}

if (packageJson.scripts?.['validate:workflows'] !== 'node agents/validate-workflow-contracts.mjs') {
  fail('package.json must expose validate:workflows as the focused Node validator');
}
has(ci, 'agents/classify-ci-changes.mjs', 'CI change classification');
has(ci, 'governance_changed="$value"', 'CI governance change detection');
has(ci, 'node --test agents/classify-ci-changes.test.mjs', 'CI classifier behavioral tests');
has(ci, 'node agents/validate-workflow-contracts.mjs', 'CI lightweight governance validation');
has(ci, 'git fetch --no-tags --depth=1 origin main', 'CI main freshness check');
has(ci, 'name: Node.js 24.21.0', 'CI check name');
has(ci, 'workflow_dispatch:', 'CI manual trigger');
if (/^  schedule:/m.test(ci)) fail('Full CI must not run on a weekly schedule');
if (ci.includes('fetch-depth: 0')) fail('CI must not fetch full Git history for change classification');
if (ci.includes('npm run validate:agents')) fail('CI still invokes the obsolete validator');

if (errors.length) {
  console.error(`Workflow validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) {
    console.error(`Warnings (${warnings.length}):`);
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}
console.log('Workflow validation passed: collaboration contracts and CI governance checks are consistent.');
