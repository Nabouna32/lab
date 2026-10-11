import fs from 'node:fs';
import path from 'node:path';

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
const listMarkdown = (directory) => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
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
const auditContract = read('agents/AUDIT-CONTRACT.md');
const featureContract = read('agents/features/FEATURE-FACTORY-CONTRACT.md');
const featureGuide = read('agents/features/FEATURE-WORKFLOW.md');
const toolContract = read('agents/tools/TOOL-FACTORY-CONTRACT.md');
const toolGuide = read('agents/tools/TOOL-WORKFLOW.md');
const productGuide = read('agents/product/PRODUCT-WORKFLOW.md');
const workflowIndex = read('agents/README.md');
const auditIndex = read('agents/audits/README.md');
const decisions = read('docs/DECISIONS.md');
const packageJson = JSON.parse(read('package.json'));
const ci = read('.github/workflows/ci.yml');

has(common, 'single ChatGPT assistant', 'Common contract');
has(common, 'The user retains final authority', 'Decision authority');
has(common, 'bidirectional coverage review', 'Plan traceability');
has(common, 'Assess urgency and priority across Loculary', 'Portfolio prioritization');
has(common, 'Use emojis generously and naturally as visual markers in user-facing responses', 'Assistant emoji convention');
has(common, 'functional product icons remain governed by', 'Product iconography distinction');
has(common, 'A user\'s opinion, objection, doubt or counterargument is not automatically a decision', 'Discussion closure');
has(common, 'active mission Issue stores the operational plan', 'Plan ownership');
has(common, 'ready-to-copy handoff prompt for a fresh implementation conversation by default', 'Implementation handoff');
has(common, '**OBSERVED**', 'Evidence integrity');
has(issueContract, 'Operational plan', 'Issue contract plan structure');
has(issueContract, 'Plan validation and fresh-conversation handoff', 'Issue contract handoff');
has(issueContract, 'Decision-to-plan traceability', 'Issue decision-to-plan coverage');
has(auditContract, 'Historical reports remain immutable', 'Audit immutability');
has(auditContract, 'The mission Issue owns the operational plan', 'Audit/Issue separation');
has(start, 'Read the complete active mission Issue and relevant comments', 'Bootstrap');
has(rootRules, 'After plan validation, provide a ready-to-copy handoff prompt', 'Repository handoff rule');
has(featureContract, 'feature-specific requirements', 'Feature specialization');
has(toolContract, 'formulas, units, conversion factors', 'Tool domain checks');
has(featureGuide, 'manual-only', 'Feature E2E policy');
has(toolGuide, 'manual-only', 'Tool E2E policy');
has(productGuide, 'Never change direction silently', 'Product workflow');
has(workflowIndex, 'Specialist guides retain domain checks only', 'Workflow index');
has(workflowIndex, 'contiguous IDs 01–32', 'Workflow index numbering policy');
if (/Audit procedures have stable, unique IDs but need not be contiguous/i.test(workflowIndex)) fail('Workflow index still permits non-contiguous audit IDs');
has(auditIndex, 'contiguous specialist IDs 01–32', 'Audit numbering policy');
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

const auditFiles = listMarkdown(path.join(root, 'agents', 'audits'))
  .filter((name) => /^\d{2}-.+\.md$/.test(name));
const audits = auditFiles.map((name) => ({
  name,
  id: Number(/^(\d{2})-/.exec(name)[1]),
  content: read('agents/audits/' + name),
}));
const byName = new Map(audits.map((audit) => [audit.name, audit]));
const seenIds = new Set();
for (const audit of audits) {
  if (seenIds.has(audit.id)) fail('Duplicate audit ID: ' + String(audit.id).padStart(2, '0'));
  seenIds.add(audit.id);
  has(audit.content, 'agents/AUDIT-CONTRACT.md', 'Audit contract reference ' + audit.name);

  const slug = audit.name.replace(/^\d{2}-/, '').replace(/\.md$/, '');
  const idText = String(audit.id).padStart(2, '0');
  const metadataFields = [
    {
      label: 'Audit ID',
      pattern: /^\s*-\s*\*\*Audit ID\s*:\*\*\s*(.*?)\s*$/,
      accepted: [idText, String(audit.id)],
      description: 'ID',
    },
    {
      label: 'Slug',
      pattern: /^\s*-\s*\*\*Slug\s*:\*\*\s*(.*?)\s*$/,
      accepted: [slug],
      description: 'slug',
    },
    {
      label: 'procedure path',
      pattern: /^\s*-\s*\*\*(?:Mission|Procedure)\s*:\*\*\s*(.*?)\s*$/,
      accepted: ['agents/audits/' + audit.name],
      description: 'procedure path',
    },
    {
      label: 'report path',
      pattern: /^\s*-\s*\*\*(?:Rapports|Reports|New reports)\s*:\*\*\s*(.*?)\s*$/,
      accepted: ['docs/audits/' + idText + '-' + slug + '/'],
      description: 'report path',
    },
  ];

  for (const field of metadataFields) {
    const values = audit.content.split(/\r?\n/)
      .map((line) => field.pattern.exec(line))
      .filter(Boolean)
      .map((match) => match[1].trim());
    if (values.length !== 1) {
      fail('Audit ' + field.description + ' metadata in ' + audit.name +
        ': expected exactly one supported metadata line, found ' + values.length);
      continue;
    }
    const rawValue = values[0];
    const tick = String.fromCharCode(96);
    const value = rawValue.startsWith(tick) && rawValue.endsWith(tick)
      ? rawValue.slice(1, -1)
      : rawValue;
    if (!field.accepted.includes(value)) {
      fail('Audit ' + field.description + ' metadata in ' + audit.name +
        ': expected exact value ' + field.accepted.join(' or ') + ', found ' + rawValue);
    }
  }
}

const specialistAudits = audits.filter(({ id }) => id !== 99).sort((a, b) => a.id - b.id);
const expectedSpecialistIds = Array.from({ length: 32 }, (_, index) => index + 1);
const actualSpecialistIds = specialistAudits.map(({ id }) => id);
if (JSON.stringify(actualSpecialistIds) !== JSON.stringify(expectedSpecialistIds)) {
  fail('Specialist audit IDs must be contiguous 01–32; found [' +
    actualSpecialistIds.map((id) => String(id).padStart(2, '0')).join(', ') + ']');
}
const finalProcedures = audits.filter(({ name }) => /final|red[- ]team/i.test(name));
if (finalProcedures.length !== 1 || finalProcedures[0].name !== '99-final-launch.md') {
  fail('Expected exactly one final-launch procedure, 99-final-launch.md; found ' +
    finalProcedures.map(({ name }) => name).join(', '));
}
const finalAudits = audits.filter(({ id }) => id === 99);
if (finalAudits.length !== 1) fail('Expected exactly one reserved audit 99, found ' + finalAudits.length);
else if (finalAudits[0].name !== '99-final-launch.md') {
  fail('Audit 99 must be the reserved final-launch procedure; found ' + finalAudits[0].name);
}
if (audits.some(({ id }) => id > 32 && id !== 99)) {
  fail('Only audit 99 may exist outside the specialist sequence 01–32');
}
if (!audits.some(({ id, name }) => id === 32 && name === '32-agent-system.md')) {
  fail('Missing audit 32 — agent-system governance and workflow');
}

// Enforce a bijection between numbered procedures and links in the active catalogue.
const catalogueSection = auditIndex.match(/^## Procedure catalogue\s*\r?\n([\s\S]*?)(?=^## |\s*$)/m);
if (!catalogueSection) {
  fail('Audit catalogue is missing the "Procedure catalogue" section');
} else {
  const catalogueLines = catalogueSection[1].split(/\r?\n/).filter((line) => /^\s*-\s+/.test(line));
  const catalogueEntries = [];
  const seenTargets = new Set();
  const seenCatalogueIds = new Set();

  for (const line of catalogueLines) {
    const link = /^\s*-\s+\[(\d{2})\s+—\s+[^\]]+\]\(([^)]+)\)\s*$/.exec(line);
    if (!link) {
      fail('Malformed or non-numbered entry in audit procedure catalogue: ' + line.trim());
      continue;
    }
    const id = Number(link[1]);
    const target = link[2];
    const targetMatch = /^\.\//.test(target) ? /^\.\/(\d{2}-.+\.md)$/.exec(target) : null;
    if (!targetMatch) {
      fail('Audit catalogue link must be a relative numbered procedure path: ' + target);
      continue;
    }
    const targetName = targetMatch[1];
    const procedure = byName.get(targetName);
    if (!procedure) fail('Audit catalogue entry points to a missing procedure: ' + targetName);
    if (Number(/^(\d{2})-/.exec(targetName)[1]) !== id) {
      fail('Audit catalogue label ID ' + link[1] + ' does not match target ' + targetName);
    }
    if (seenCatalogueIds.has(id)) fail('Duplicate audit catalogue ID: ' + link[1]);
    seenCatalogueIds.add(id);
    if (seenTargets.has(targetName)) fail('Duplicate audit catalogue target: ' + targetName);
    seenTargets.add(targetName);
    catalogueEntries.push({ id, targetName });
  }

  for (const audit of audits) {
    const occurrences = catalogueEntries.filter((entry) => entry.targetName === audit.name).length;
    if (occurrences !== 1) {
      fail('Audit procedure ' + audit.name + ' must appear exactly once in catalogue; found ' + occurrences);
    }
  }
  for (const entry of catalogueEntries) {
    if (!byName.has(entry.targetName)) {
      fail('Stale audit catalogue target: ' + entry.targetName);
    }
  }
  if (catalogueEntries.length !== audits.length) {
    fail('Audit catalogue must contain exactly ' + audits.length +
      ' procedure entries; found ' + catalogueEntries.length);
  }
}

if (/use emojis sparingly|emojis? without clutter|concise visual control receipt being trialed/i.test(governanceText)) {
  fail('Active agent guidance still restricts emoji use or requires a mechanical response receipt');
}

if (packageJson.scripts?.['validate:workflows'] !== 'node agents/validate-workflow-contracts.mjs') {
  fail('package.json must expose validate:workflows as the focused Node validator');
}
has(ci, 'governance_changed=true', 'CI governance change detection');
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
console.log(`Workflow validation passed: ${audits.length} audit procedures checked; specialist IDs are contiguous 01–32, audit 99 is reserved, and procedure metadata/catalogue references agree.`);
