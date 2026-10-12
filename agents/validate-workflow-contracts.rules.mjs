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
