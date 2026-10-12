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


export function validateApprovalWorkflowContracts(sources) {
  const errors = [];
  const activeSources = [
    sources.rootRules, sources.start, sources.common, sources.issueContract,
    sources.featureGuide, sources.toolGuide, sources.productGuide, sources.decisions,
  ].map((source) => String(source ?? '')).join('\n');
  const staleRules = [
    [/implementation-plan approval are distinct/i, 'separate implementation-plan approval'],
    [/Begin implementation only after the concrete plan is explicitly validated/i, 'plan validation as implementation gate'],
    [/Obtain explicit validation of that concrete plan/i, 'explicit approval of the technical plan'],
    [/Ask for explicit plan approval/i, 'request to approve the technical plan'],
    [/After plan validation/i, 'handoff or execution tied to plan validation'],
    [/Plan validation and fresh-conversation handoff/i, 'old Issue-contract approval model'],
    [/explicit plan validation/i, 'explicit plan validation as a required step'],
  ];
  for (const [pattern, label] of staleRules) {
    if (pattern.test(activeSources)) errors.push('Obsolete approval workflow remains: ' + label);
  }
  const required = [
    [sources.common, "Read-only investigation, audits, source inspection, factual checkpoint updates to the mission Issue and comparison of options are the assistant's responsibility", 'Autonomous read-only investigation'],
    [sources.common, 'Approval is for the explained change proposal, not the investigation, audit, implementation method or operational plan', 'Approval boundary'],
    [sources.common, 'The plan records outcome, acceptance criteria, decisions, ordered tasks, files/areas, dependencies, risks and verification. It is an internal execution document, not an approval request', 'Internal operational plan'],
    [sources.common, 'If new evidence means the implementation would materially change the approved outcome, scope, direction or significant risk, pause the affected work', 'Material-change escalation'],
    [sources.common, 'After the user approves the proposed changes, provide a ready-to-copy handoff prompt for a fresh implementation conversation by default', 'Fresh-conversation handoff'],
    [sources.issueContract, 'The plan is an internal execution document for the assistant, not a document the user must validate', 'Issue plan ownership'],
    [sources.issueContract, 'The Issue can be updated during read-only investigation to preserve factual checkpoints. Such updates record state; they do not authorize implementation', 'Checkpoint authorization boundary'],
    [sources.decisions, '## DEC-050 — Fresh-conversation handoff with an explicit same-conversation option', 'DEC-050 handoff decision'],
  ];
  for (const [source, phrase, label] of required) {
    if (!String(source ?? '').includes(phrase)) errors.push('Missing workflow invariant: ' + label);
  }
  return errors;
}
