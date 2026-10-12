import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export const CANONICAL_STATE_LABELS = [
  'state:ready', 'state:investigating', 'state:implementing', 'state:testing',
  'state:blocked', 'state:waiting', 'state:deferred',
];
export const CANONICAL_TYPE_LABELS = [
  'type:bug', 'type:feature', 'type:maintenance', 'type:audit', 'type:documentation',
];
const suspendedStates = new Set(['state:blocked', 'state:waiting', 'state:deferred']);

function labelNames(labels = []) {
  return labels.map((label) => typeof label === 'string' ? label : label?.name).filter(Boolean);
}

export function validateIssueLabels(issue) {
  const names = labelNames(issue.labels);
  const errors = [];
  const removableLabels = [];
  for (const [family, canonical] of [
    ['state', CANONICAL_STATE_LABELS],
    ['type', CANONICAL_TYPE_LABELS],
  ]) {
    const familyLabels = names.filter((name) => name.startsWith(family + ':'));
    const known = familyLabels.filter((name) => canonical.includes(name));
    const unknown = familyLabels.filter((name) => !canonical.includes(name));
    if (known.length === 0) {
      errors.push(family + ': missing canonical label; observed [' + (familyLabels.join(', ') || 'none') + ']. Add exactly one valid ' + family + ':* label after human triage.');
    } else if (known.length > 1) {
      errors.push(family + ': multiple canonical labels [' + known.join(', ') + ']; choose exactly one explicitly.');
    } else if (unknown.length > 0) {
      removableLabels.push(...unknown);
    }
  }

  const stateLabels = names.filter((name) => CANONICAL_STATE_LABELS.includes(name));
  if (stateLabels.length === 1 && suspendedStates.has(stateLabels[0])) {
    const body = issue.body ?? '';
    const fields = [
      ['Reason', /^\s*[-*]\s*\*\*Reason:\*\*\s*\S/im],
      ['Resumption / unblock / review condition', /^\s*[-*]\s*\*\*Resumption\s*\/\s*unblock\s*\/\s*review condition:\*\*\s*\S/im],
      ['Next action', /^\s*[-*]\s*\*\*Next action:\*\*\s*\S/im],
    ];
    const missing = fields.filter(([, pattern]) => !pattern.test(body)).map(([name]) => name);
    if (missing.length) {
      errors.push(stateLabels[0] + ': missing structured Issue-body field(s): ' + missing.join(', ') + '. Add explicit non-empty fields: **Reason:**, **Resumption / unblock / review condition:**, **Next action:**.');
    }
  }
  return { errors, removableLabels: [...new Set(removableLabels)], valid: errors.length === 0 && removableLabels.length === 0 };
}

async function githubRequest(path, token, options = {}) {
  const response = await fetch('https://api.github.com' + path, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: 'Bearer ' + token,
      'x-github-api-version': '2022-11-28',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error('GitHub API ' + (options.method ?? 'GET') + ' ' + path + ' failed (' + response.status + '): ' + await response.text());
  return response.status === 204 ? null : response.json();
}

async function fetchIssue(repo, number, token) {
  return githubRequest('/repos/' + repo + '/issues/' + number, token);
}

async function listOpenIssues(repo, token) {
  const issues = [];
  for (let page = 1; ; page += 1) {
    const batch = await githubRequest('/repos/' + repo + '/issues?state=open&per_page=100&page=' + page, token);
    issues.push(...batch.filter((issue) => !issue.pull_request));
    if (batch.length < 100) break;
  }
  return issues;
}

async function setLabels(repo, issue, labels, token) {
  return githubRequest('/repos/' + repo + '/issues/' + issue.number + '/labels', token, {
    method: 'PUT',
    body: JSON.stringify({ labels }),
  });
}

function printResult(issue, result) {
  const url = issue.html_url ?? '#' + issue.number;
  if (result.errors.length) {
    for (const error of result.errors) console.error('::error title=Issue #' + issue.number + ' label compliance::' + url + ' — ' + error);
    return false;
  }
  if (result.removableLabels.length) {
    console.log('Issue #' + issue.number + ': deterministic correction required for ' + result.removableLabels.join(', '));
    return true;
  }
  console.log('Issue #' + issue.number + ': labels compliant');
  return true;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required.');
  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const event = eventPath ? JSON.parse(fs.readFileSync(eventPath, 'utf8')) : {};
  const isFullAudit = eventName === 'schedule' || eventName === 'workflow_dispatch';
  if (!isFullAudit && (event.sender?.type === 'Bot' || /\[bot\]$/i.test(event.sender?.login ?? ''))) {
    console.log('Skipping bot-authored Issue event to prevent correction loops.');
    return;
  }

  const issues = isFullAudit
    ? await listOpenIssues(repo, token)
    : event.issue?.number
      ? [await fetchIssue(repo, event.issue.number, token)]
      : (() => { throw new Error('Unsupported event ' + eventName + ': expected an Issue payload or full-audit trigger.'); })();

  let failures = 0, corrections = 0, compliant = 0;
  for (const issue of issues) {
    let result = validateIssueLabels(issue);
    if (result.removableLabels.length) {
      const currentNames = labelNames(issue.labels);
      const updatedNames = currentNames.filter((name) => !result.removableLabels.includes(name));
      await setLabels(repo, issue, updatedNames, token);
      corrections += 1;
      const refreshed = await fetchIssue(repo, issue.number, token);
      result = validateIssueLabels(refreshed);
      if (result.errors.length || result.removableLabels.length) {
        failures += 1;
        printResult(refreshed, result);
      } else {
        console.log('Issue #' + issue.number + ': deterministically removed unknown family label(s); revalidation passed.');
      }
    } else if (result.errors.length) {
      failures += 1;
      printResult(issue, result);
    } else {
      compliant += 1;
      printResult(issue, result);
    }
  }
  const summary = [
    '### Open Issue label lifecycle audit',
    '',
    '- Issues inspected: ' + issues.length,
    '- Compliant without mutation: ' + compliant,
    '- Deterministic corrections: ' + corrections,
    '- Issues requiring explicit resolution: ' + failures,
    '',
    failures ? 'Open Issues remain non-compliant. Resolve the errors above; no ambiguous label was guessed.' : 'All inspected Issues satisfy the label lifecycle contract.',
  ].join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  console.log(summary);
  if (failures) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('::error::' + error.message);
    process.exitCode = 1;
  });
}
