const fields = [
  { description: 'ID', pattern: /^\s*-\s*\*\*Audit ID\s*:\*\*\s*(.*?)\s*$/, accepted: (id) => [String(id).padStart(2, '0'), String(id)] },
  { description: 'slug', pattern: /^\s*-\s*\*\*Slug\s*:\*\*\s*(.*?)\s*$/, accepted: (_id, slug) => [slug] },
  { description: 'procedure path', pattern: /^\s*-\s*\*\*(?:Mission|Procedure)\s*:\*\*\s*(.*?)\s*$/, accepted: (_id, _slug, name) => ['agents/audits/' + name] },
  { description: 'report path', pattern: /^\s*-\s*\*\*(?:Rapports|Reports|New reports)\s*:\*\*\s*(.*?)\s*$/, accepted: (id, slug) => ['docs/audits/' + String(id).padStart(2, '0') + '-' + slug + '/'] },
];

export function validateAuditMetadata(audits) {
  const errors = [];
  for (const audit of audits) {
    const slug = audit.name.replace(/^\d{2}-/, '').replace(/\.md$/, '');
    for (const field of fields) {
      const values = audit.content.split(/\r?\n/).map((line) => field.pattern.exec(line)).filter(Boolean).map((match) => match[1].trim());
      if (values.length !== 1) {
        errors.push('Audit ' + field.description + ' metadata in ' + audit.name + ': expected exactly one supported metadata line, found ' + values.length);
        continue;
      }
      const raw = values[0], tick = String.fromCharCode(96);
      const value = raw.startsWith(tick) && raw.endsWith(tick) ? raw.slice(1, -1) : raw;
      const accepted = field.accepted(audit.id, slug, audit.name);
      if (!accepted.includes(value)) errors.push('Audit ' + field.description + ' metadata in ' + audit.name + ': expected exact value ' + accepted.join(' or ') + ', found ' + raw);
    }
  }
  return errors;
}

export function validateAuditCatalogue(audits, auditIndex) {
  const errors = [], byName = new Map(audits.map((audit) => [audit.name, audit]));
  const heading = /^## Procedure catalogue\s*$/m.exec(auditIndex);
  if (!heading) return ['Audit catalogue is missing the "Procedure catalogue" section'];
  const rest = auditIndex.slice(heading.index + heading[0].length).replace(/^\r?\n/, '');
  const nextHeading = /^## /m.exec(rest), body = nextHeading ? rest.slice(0, nextHeading.index) : rest;
  const lines = body.split(/\r?\n/).filter((line) => /^\s*-\s+/.test(line));
  const entries = [], seenIds = new Set(), seenTargets = new Set();
  for (const line of lines) {
    const link = /^\s*-\s+\[(\d{2})\s+—\s+[^\]]+\]\(([^)]+)\)\s*$/.exec(line);
    if (!link) { errors.push('Malformed or non-numbered entry in audit procedure catalogue: ' + line.trim()); continue; }
    const id = Number(link[1]), target = link[2];
    const match = /^\.\//.test(target) ? /^\.\/(\d{2}-.+\.md)$/.exec(target) : null;
    if (!match) { errors.push('Audit catalogue link must be a relative numbered procedure path: ' + target); continue; }
    const name = match[1];
    if (!byName.has(name)) errors.push('Audit catalogue entry points to a missing procedure: ' + name);
    if (Number(/^(\d{2})-/.exec(name)[1]) !== id) errors.push('Audit catalogue label ID ' + link[1] + ' does not match target ' + name);
    if (seenIds.has(id)) errors.push('Duplicate audit catalogue ID: ' + link[1]);
    if (seenTargets.has(name)) errors.push('Duplicate audit catalogue target: ' + name);
    seenIds.add(id); seenTargets.add(name); entries.push({ id, name });
  }
  for (const audit of audits) {
    const count = entries.filter((entry) => entry.name === audit.name).length;
    if (count !== 1) errors.push('Audit procedure ' + audit.name + ' must appear exactly once in catalogue; found ' + count);
  }
  for (const entry of entries) if (!byName.has(entry.name)) errors.push('Stale audit catalogue target: ' + entry.name);
  if (entries.length !== audits.length) errors.push('Audit catalogue must contain exactly ' + audits.length + ' procedure entries; found ' + entries.length);
  return errors;
}


const requiredIssueLabels = [
  'state:ready', 'state:investigating', 'state:implementing', 'state:testing',
  'state:blocked', 'state:waiting', 'state:deferred',
  'type:bug', 'type:feature', 'type:maintenance', 'type:audit', 'type:documentation',
  'area:agent-system', 'area:product', 'area:workflow', 'area:ci',
  'area:accessibility', 'area:design',
  'dependencies', 'npm', 'github-actions',
];

export function validateIssueLabelPolicy(commonContract, issueContract, dependabotConfig) {
  const errors = [];
  const heading = /^## 10\. Issue-label lifecycle\s*$/m.exec(commonContract);
  if (!heading) return ['Common contract is missing the canonical Issue-label lifecycle section'];
  const rest = commonContract.slice(heading.index + heading[0].length);
  const nextHeading = /^## /m.exec(rest);
  const section = nextHeading ? rest.slice(0, nextHeading.index) : rest;
  const tableRows = section.split(/\r?\n/).filter((line) => /^\|\s*`[^\`]+`\s*\|/.test(line));
  const labels = tableRows.map((line) => /^\|\s*`([^\`]+)`\s*\|/.exec(line)?.[1]).filter(Boolean);
  const expected = new Set(requiredIssueLabels);
  const actual = new Set(labels);
  for (const label of requiredIssueLabels) {
    const count = labels.filter((item) => item === label).length;
    if (count !== 1) errors.push('Canonical Issue-label taxonomy must define ' + label + ' exactly once; found ' + count);
  }
  for (const label of labels) if (!expected.has(label)) errors.push('Unexpected label in canonical Issue-label taxonomy: ' + label);
  if (labels.length !== requiredIssueLabels.length) errors.push('Canonical Issue-label taxonomy must contain exactly ' + requiredIssueLabels.length + ' definitions; found ' + labels.length);

  for (const title of ['State transitions and maintenance']) {
    if (!new RegExp('^### ' + title + '\\s*$', 'm').test(section)) errors.push('Canonical label policy is missing section: ' + title);
  }
  const issueHeadings = [
    '### Creation and triage',
    '### Checkpoints, transitions and blockers',
    '### Closure and reopening',
  ];
  for (const title of issueHeadings) if (!issueContract.includes(title)) errors.push('Issue contract is missing label-lifecycle section: ' + title);
  for (const token of ['state:waiting', 'state:deferred', 'resumption', 'next', 'state:blocked', 'prerequisite', 'state:completed']) {
    if (!issueContract.includes(token)) errors.push('Issue contract is missing required lifecycle concept: ' + token);
  }
  for (const label of ['dependencies', 'npm', 'github-actions']) {
    if (!dependabotConfig.includes('- ' + label)) errors.push('Dependabot configuration is missing automation label: ' + label);
  }
  return errors;
}
