import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const GITILES_BASE = 'https://android.googlesource.com/platform/frameworks/support';
const ALLOWED_HOST = 'android.googlesource.com';
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RESPONSE_BYTES = 20 * 1024 * 1024;
const MAX_REDIRECTS = 5;

export const RELEASE_GROUPS = [
  {
    id: 'compose-ui',
    branch: 'androidx-compose-ui-release',
    refCandidates: ['refs/tags/androidx-compose-ui-1.12.1', 'refs/tags/androidx-compose-ui-release-1.12.1', 'refs/heads/androidx-compose-ui-release', 'refs/heads/androidx-compose-ui-release-1.12.1', 'refs/heads/androidx-compose-ui-1.12.1-release', 'refs/heads/androidx-compose-release'],
    versionMarker: 'COMPOSE_UI',
    version: '1.12.1',
    modules: [
      { family: 'compose-ui', path: 'compose/ui/ui/api/current.txt', versionedPath: 'compose/ui/ui/api/1.12.1.txt' },
      { family: 'compose-ui-text', path: 'compose/ui/ui-text/api/current.txt', versionedPath: 'compose/ui/ui-text/api/1.12.1.txt' },
    ],
  },
  {
    id: 'compose-foundation',
    branch: 'androidx-compose-foundation-release',
    refCandidates: ['refs/tags/androidx-compose-foundation-1.12.1', 'refs/tags/androidx-compose-foundation-release-1.12.1', 'refs/heads/androidx-compose-foundation-release', 'refs/heads/androidx-compose-foundation-release-1.12.1', 'refs/heads/androidx-compose-foundation-1.12.1-release', 'refs/heads/androidx-compose-release'],
    versionMarker: 'COMPOSE_FOUNDATION',
    version: '1.12.1',
    modules: [
      { family: 'compose-foundation', path: 'compose/foundation/foundation/api/current.txt', versionedPath: 'compose/foundation/foundation/api/1.12.1.txt' },
      { family: 'compose-foundation-layout', path: 'compose/foundation/foundation-layout/api/current.txt', versionedPath: 'compose/foundation/foundation-layout/api/1.12.1.txt' },
    ],
  },
];

function assertGitilesUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(label + ' must be a valid URL.');
  }
  if (url.protocol !== 'https:' || url.hostname !== ALLOWED_HOST || url.username || url.password) {
    throw new Error(label + ' must use HTTPS on the official AndroidX Gitiles host.');
  }
  return url;
}

async function readBoundedBody(response, label) {
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) {
    throw new Error(label + ' exceeds the response size limit.');
  }
  if (!response.body) throw new Error(label + ' has no response body.');
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error(label + ' exceeds the response size limit.');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

export async function fetchGitilesBytes(value, label, fetchImpl = globalThis.fetch, { optional = false } = {}) {
  let currentUrl = assertGitilesUrl(value, label);
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchImpl(currentUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: 'application/octet-stream, text/plain;q=0.9' },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error(label + ' redirected without a Location header.');
      if (redirectCount === MAX_REDIRECTS) throw new Error(label + ' exceeded the redirect limit.');
      currentUrl = assertGitilesUrl(new URL(location, currentUrl).toString(), label + ' redirect');
      continue;
    }
    if (optional && response.status === 404) {
      await response.body?.cancel();
      return null;
    }
    if (!response.ok) throw new Error(label + ' returned HTTP ' + response.status + '.');
    return readBoundedBody(response, label);
  }
  throw new Error(label + ' exceeded the redirect limit.');
}

export function parseGitLsRemoteRefs(text) {
  const refs = new Map();
  const peeledTags = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(/^([a-f0-9]{40})\s+(refs\/(?:heads|tags)\/\S+)$/i);
    if (!match) continue;
    const ref = match[2];
    const peeled = ref.endsWith('^{}');
    const name = peeled ? ref.slice(0, -3) : ref;
    if (peeled) peeledTags.set(name, match[1].toLowerCase());
    else refs.set(name, match[1].toLowerCase());
  }
  return [...refs.entries()]
    .map(([ref, commit]) => ({
      ref,
      commit: peeledTags.get(ref) ?? commit,
    }))
    .sort((left, right) => left.ref.localeCompare(right.ref));
}

export async function resolveGitilesRef(fetchImpl, refs, candidates, label, versionMarker, expectedVersion) {
  const attempted = [];
  for (const candidate of candidates) {
    const match = refs.find((entry) => entry.ref === candidate);
    if (!match) continue;
    const versionBytes = await fetchGitilesBytes(
      GITILES_BASE + '/+/' + match.commit + '/libraryversions.toml?format=TEXT',
      label + ' version marker at ' + match.commit,
      fetchImpl,
    );
    const versionText = Buffer.from(versionBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
    let actualVersion;
    try {
      actualVersion = parseLibraryVersion(versionText, versionMarker);
    } catch {
      const availableMarkers = versionText.split(/\r?\n/)
        .filter((line) => /^\s*[A-Z0-9_]*COMPOSE[A-Z0-9_]*\s*=/.test(line))
        .map((line) => line.trim());
      attempted.push(candidate + '@' + match.commit + ' (marker missing; available: ' + (availableMarkers.join(', ') || 'none') + ')');
      continue;
    }
    if (actualVersion !== expectedVersion) {
      attempted.push(candidate + '@' + match.commit + ' (' + versionMarker + '=' + actualVersion + ')');
      continue;
    }
    return { ...match, version: actualVersion, libraryVersionsText: versionText };
  }
  const related = refs
    .filter((entry) => /compose/i.test(entry.ref) && /release/i.test(entry.ref))
    .map((entry) => entry.ref + '@' + entry.commit);
  throw new Error(
    'No official AndroidX ' + label + ' ref matched version ' + expectedVersion +
    '. Checked: ' + (attempted.join(', ') || candidates.join(', ')) +
    '. Related refs discovered by git ls-remote: ' + (related.join(', ') || 'none') + '.',
  );
}

export function parseLibraryVersion(text, marker) {
  const escaped = marker.replace(/[.*+?^$()|[\]\\]/g, '\\export function parseLibraryVersion(text, marker) {
  const escaped = marker.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp('^\\s*' + escaped + '\\s*=\\s*"([^"]+)"\\s*$', 'm'));
  if (!match) throw new Error('libraryversions.toml does not define ' + marker + '.');
  return match[1];
}');
  const direct = text.match(new RegExp('^\\s*' + escaped + '\\s*=\\s*"([^"]+)"\\s*

export function parseApiDumpMetadata(text, family) {
  const formatVersion = text.match(/^(?:\uFEFF)?\/\/ Signature format: (\d+\.\d+)(?:\r?\n|$)/)?.[1] ?? null;
  const surface = text.match(/^\/\/ - surface=([A-Za-z0-9_-]+)\s*$/m)?.[1] ?? null;
  const packageCount = text.split(/\r?\n/).filter((line) => /^package\s+/.test(line)).length;
  if (formatVersion !== '5.0') throw new Error(family + ' API dump must use signature format 5.0; received ' + (formatVersion ?? 'unknown') + '.');
  if (surface !== 'public') throw new Error(family + ' API dump must declare surface=public.');
  if (packageCount === 0) throw new Error(family + ' API dump contains no package declarations.');
  return { formatVersion, surface, packageCount };
}

export function calculateGitilesBlobHashes(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return {
    sha256: createHash('sha256').update(buffer).digest('hex'),
    gitBlobSha1: createHash('sha1').update(Buffer.from('blob ' + buffer.length + '\0')).update(buffer).digest('hex'),
    sizeBytes: buffer.length,
  };
}

export async function inspectComposeReleaseProvenance({ outputDirectory, refsText, fetchImpl = globalThis.fetch } = {}) {
  if (!outputDirectory) throw new Error('outputDirectory is required.');
  if (typeof refsText !== 'string' || !refsText.trim()) throw new Error('refsText from official git ls-remote is required.');
  const refs = parseGitLsRemoteRefs(refsText);
  const output = resolve(outputDirectory);
  await mkdir(output, { recursive: true });
  const report = {
    schemaVersion: 1,
    repository: 'androidx/androidx',
    gitilesBase: GITILES_BASE,
    referenceVersion: '1.12.1',
    inspectedAt: new Date().toISOString(),
    status: 'verified-release-refs-and-api-dumps',
    groups: [],
  };

  for (const group of RELEASE_GROUPS) {
    const resolvedRef = await resolveGitilesRef(fetchImpl, refs, group.refCandidates, group.id, group.versionMarker, group.version);
    const commit = resolvedRef.commit;
    const branchHead = { commit, message: null, committer: null };
    const versionsText = resolvedRef.libraryVersionsText;
    const actualVersion = resolvedRef.version;

    const groupReport = {
      id: group.id,
      preferredRef: group.branch,
      ref: resolvedRef.ref,
      commit,
      commitMessage: branchHead.message,
      committer: branchHead.committer,
      versionMarker: group.versionMarker,
      version: actualVersion,
      libraryVersions: calculateGitilesBlobHashes(Buffer.from(versionsText)),
      apiDumps: [],
    };

    for (const moduleInfo of group.modules) {
      const dumpBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.path + '?format=TEXT',
        moduleInfo.family + ' stable API dump',
        fetchImpl,
      );
      const dumpText = Buffer.from(dumpBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
      const metadata = parseApiDumpMetadata(dumpText, moduleInfo.family);
      const hashes = calculateGitilesBlobHashes(Buffer.from(dumpText));
      const localPath = moduleInfo.family + '-api-current.txt';
      await writeFile(join(output, localPath), dumpText, 'utf8');

      const versionedBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.versionedPath + '?format=TEXT',
        moduleInfo.family + ' versioned stable API dump',
        fetchImpl,
        { optional: true },
      );
      let versionedDump = null;
      if (versionedBytes) {
        const versionedText = Buffer.from(versionedBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
        const versionedHashes = calculateGitilesBlobHashes(Buffer.from(versionedText));
        versionedDump = {
          path: moduleInfo.versionedPath,
          ...versionedHashes,
          identicalToCurrent: versionedHashes.gitBlobSha1 === hashes.gitBlobSha1,
        };
      }

      groupReport.apiDumps.push({
        family: moduleInfo.family,
        path: moduleInfo.path,
        localPath,
        ...metadata,
        ...hashes,
        versionedDump,
      });
    }
    report.groups.push(groupReport);
  }

  await writeFile(join(output, 'release-provenance.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

async function main() {
  const outputDirectory = process.argv[2];
  const refsPath = process.argv[3];
  if (!refsPath) throw new Error('Usage: node inspect-compose-release-api-provenance.mjs <output-directory> <git-ls-remote-refs-file>');
  const refsText = await readFile(refsPath, 'utf8');
  const report = await inspectComposeReleaseProvenance({ outputDirectory, refsText });
  for (const group of report.groups) {
    process.stdout.write(group.id + ' ' + group.version + ' via ' + group.ref + ' @ ' + group.commit + '\n');
    for (const dump of group.apiDumps) {
      process.stdout.write('  ' + dump.family + ': ' + dump.sizeBytes + ' bytes, ' + dump.packageCount + ' packages, Git blob ' + dump.gitBlobSha1 + '\n');
    }
  }
  process.stdout.write('Release API provenance report written to ' + resolve(outputDirectory) + '\n');
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write('Compose release provenance inspection failed: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
, 'm'));
  if (direct) return direct[1];

  const group = text.match(new RegExp('^\\s*' + escaped + '\\s*=\\s*\\{([^}]*)\\}', 'm'));
  const alias = group?.[1].match(/atomicGroupVersion\s*=\s*"versions\.([A-Z0-9_]+)"/)?.[1];
  if (alias) {
    const escapedAlias = alias.replace(/[.*+?^$()|[\]\\]/g, '\\export function parseLibraryVersion(text, marker) {
  const escaped = marker.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp('^\\s*' + escaped + '\\s*=\\s*"([^"]+)"\\s*$', 'm'));
  if (!match) throw new Error('libraryversions.toml does not define ' + marker + '.');
  return match[1];
}');
    const resolved = text.match(new RegExp('^\\s*' + escapedAlias + '\\s*=\\s*"([^"]+)"\\s*

export function parseApiDumpMetadata(text, family) {
  const formatVersion = text.match(/^(?:\uFEFF)?\/\/ Signature format: (\d+\.\d+)(?:\r?\n|$)/)?.[1] ?? null;
  const surface = text.match(/^\/\/ - surface=([A-Za-z0-9_-]+)\s*$/m)?.[1] ?? null;
  const packageCount = text.split(/\r?\n/).filter((line) => /^package\s+/.test(line)).length;
  if (formatVersion !== '5.0') throw new Error(family + ' API dump must use signature format 5.0; received ' + (formatVersion ?? 'unknown') + '.');
  if (surface !== 'public') throw new Error(family + ' API dump must declare surface=public.');
  if (packageCount === 0) throw new Error(family + ' API dump contains no package declarations.');
  return { formatVersion, surface, packageCount };
}

export function calculateGitilesBlobHashes(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return {
    sha256: createHash('sha256').update(buffer).digest('hex'),
    gitBlobSha1: createHash('sha1').update(Buffer.from('blob ' + buffer.length + '\0')).update(buffer).digest('hex'),
    sizeBytes: buffer.length,
  };
}

export async function inspectComposeReleaseProvenance({ outputDirectory, refsText, fetchImpl = globalThis.fetch } = {}) {
  if (!outputDirectory) throw new Error('outputDirectory is required.');
  if (typeof refsText !== 'string' || !refsText.trim()) throw new Error('refsText from official git ls-remote is required.');
  const refs = parseGitLsRemoteRefs(refsText);
  const output = resolve(outputDirectory);
  await mkdir(output, { recursive: true });
  const report = {
    schemaVersion: 1,
    repository: 'androidx/androidx',
    gitilesBase: GITILES_BASE,
    referenceVersion: '1.12.1',
    inspectedAt: new Date().toISOString(),
    status: 'verified-release-refs-and-api-dumps',
    groups: [],
  };

  for (const group of RELEASE_GROUPS) {
    const resolvedRef = await resolveGitilesRef(fetchImpl, refs, group.refCandidates, group.id, group.versionMarker, group.version);
    const commit = resolvedRef.commit;
    const branchHead = { commit, message: null, committer: null };
    const versionsText = resolvedRef.libraryVersionsText;
    const actualVersion = resolvedRef.version;

    const groupReport = {
      id: group.id,
      preferredRef: group.branch,
      ref: resolvedRef.ref,
      commit,
      commitMessage: branchHead.message,
      committer: branchHead.committer,
      versionMarker: group.versionMarker,
      version: actualVersion,
      libraryVersions: calculateGitilesBlobHashes(Buffer.from(versionsText)),
      apiDumps: [],
    };

    for (const moduleInfo of group.modules) {
      const dumpBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.path + '?format=TEXT',
        moduleInfo.family + ' stable API dump',
        fetchImpl,
      );
      const dumpText = Buffer.from(dumpBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
      const metadata = parseApiDumpMetadata(dumpText, moduleInfo.family);
      const hashes = calculateGitilesBlobHashes(Buffer.from(dumpText));
      const localPath = moduleInfo.family + '-api-current.txt';
      await writeFile(join(output, localPath), dumpText, 'utf8');

      const versionedBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.versionedPath + '?format=TEXT',
        moduleInfo.family + ' versioned stable API dump',
        fetchImpl,
        { optional: true },
      );
      let versionedDump = null;
      if (versionedBytes) {
        const versionedText = Buffer.from(versionedBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
        const versionedHashes = calculateGitilesBlobHashes(Buffer.from(versionedText));
        versionedDump = {
          path: moduleInfo.versionedPath,
          ...versionedHashes,
          identicalToCurrent: versionedHashes.gitBlobSha1 === hashes.gitBlobSha1,
        };
      }

      groupReport.apiDumps.push({
        family: moduleInfo.family,
        path: moduleInfo.path,
        localPath,
        ...metadata,
        ...hashes,
        versionedDump,
      });
    }
    report.groups.push(groupReport);
  }

  await writeFile(join(output, 'release-provenance.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

async function main() {
  const outputDirectory = process.argv[2];
  const refsPath = process.argv[3];
  if (!refsPath) throw new Error('Usage: node inspect-compose-release-api-provenance.mjs <output-directory> <git-ls-remote-refs-file>');
  const refsText = await readFile(refsPath, 'utf8');
  const report = await inspectComposeReleaseProvenance({ outputDirectory, refsText });
  for (const group of report.groups) {
    process.stdout.write(group.id + ' ' + group.version + ' via ' + group.ref + ' @ ' + group.commit + '\n');
    for (const dump of group.apiDumps) {
      process.stdout.write('  ' + dump.family + ': ' + dump.sizeBytes + ' bytes, ' + dump.packageCount + ' packages, Git blob ' + dump.gitBlobSha1 + '\n');
    }
  }
  process.stdout.write('Release API provenance report written to ' + resolve(outputDirectory) + '\n');
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write('Compose release provenance inspection failed: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
, 'm'));
    if (resolved) return resolved[1];
    throw new Error('libraryversions.toml does not define version alias ' + alias + ' referenced by ' + marker + '.');
  }
  throw new Error('libraryversions.toml does not define a direct version or atomicGroupVersion alias for ' + marker + '.');
}

export function parseApiDumpMetadata(text, family) {
  const formatVersion = text.match(/^(?:\uFEFF)?\/\/ Signature format: (\d+\.\d+)(?:\r?\n|$)/)?.[1] ?? null;
  const surface = text.match(/^\/\/ - surface=([A-Za-z0-9_-]+)\s*$/m)?.[1] ?? null;
  const packageCount = text.split(/\r?\n/).filter((line) => /^package\s+/.test(line)).length;
  if (formatVersion !== '5.0') throw new Error(family + ' API dump must use signature format 5.0; received ' + (formatVersion ?? 'unknown') + '.');
  if (surface !== 'public') throw new Error(family + ' API dump must declare surface=public.');
  if (packageCount === 0) throw new Error(family + ' API dump contains no package declarations.');
  return { formatVersion, surface, packageCount };
}

export function calculateGitilesBlobHashes(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return {
    sha256: createHash('sha256').update(buffer).digest('hex'),
    gitBlobSha1: createHash('sha1').update(Buffer.from('blob ' + buffer.length + '\0')).update(buffer).digest('hex'),
    sizeBytes: buffer.length,
  };
}

export async function inspectComposeReleaseProvenance({ outputDirectory, refsText, fetchImpl = globalThis.fetch } = {}) {
  if (!outputDirectory) throw new Error('outputDirectory is required.');
  if (typeof refsText !== 'string' || !refsText.trim()) throw new Error('refsText from official git ls-remote is required.');
  const refs = parseGitLsRemoteRefs(refsText);
  const output = resolve(outputDirectory);
  await mkdir(output, { recursive: true });
  const report = {
    schemaVersion: 1,
    repository: 'androidx/androidx',
    gitilesBase: GITILES_BASE,
    referenceVersion: '1.12.1',
    inspectedAt: new Date().toISOString(),
    status: 'verified-release-refs-and-api-dumps',
    groups: [],
  };

  for (const group of RELEASE_GROUPS) {
    const resolvedRef = await resolveGitilesRef(fetchImpl, refs, group.refCandidates, group.id, group.versionMarker, group.version);
    const commit = resolvedRef.commit;
    const branchHead = { commit, message: null, committer: null };
    const versionsText = resolvedRef.libraryVersionsText;
    const actualVersion = resolvedRef.version;

    const groupReport = {
      id: group.id,
      preferredRef: group.branch,
      ref: resolvedRef.ref,
      commit,
      commitMessage: branchHead.message,
      committer: branchHead.committer,
      versionMarker: group.versionMarker,
      version: actualVersion,
      libraryVersions: calculateGitilesBlobHashes(Buffer.from(versionsText)),
      apiDumps: [],
    };

    for (const moduleInfo of group.modules) {
      const dumpBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.path + '?format=TEXT',
        moduleInfo.family + ' stable API dump',
        fetchImpl,
      );
      const dumpText = Buffer.from(dumpBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
      const metadata = parseApiDumpMetadata(dumpText, moduleInfo.family);
      const hashes = calculateGitilesBlobHashes(Buffer.from(dumpText));
      const localPath = moduleInfo.family + '-api-current.txt';
      await writeFile(join(output, localPath), dumpText, 'utf8');

      const versionedBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + moduleInfo.versionedPath + '?format=TEXT',
        moduleInfo.family + ' versioned stable API dump',
        fetchImpl,
        { optional: true },
      );
      let versionedDump = null;
      if (versionedBytes) {
        const versionedText = Buffer.from(versionedBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
        const versionedHashes = calculateGitilesBlobHashes(Buffer.from(versionedText));
        versionedDump = {
          path: moduleInfo.versionedPath,
          ...versionedHashes,
          identicalToCurrent: versionedHashes.gitBlobSha1 === hashes.gitBlobSha1,
        };
      }

      groupReport.apiDumps.push({
        family: moduleInfo.family,
        path: moduleInfo.path,
        localPath,
        ...metadata,
        ...hashes,
        versionedDump,
      });
    }
    report.groups.push(groupReport);
  }

  await writeFile(join(output, 'release-provenance.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

async function main() {
  const outputDirectory = process.argv[2];
  const refsPath = process.argv[3];
  if (!refsPath) throw new Error('Usage: node inspect-compose-release-api-provenance.mjs <output-directory> <git-ls-remote-refs-file>');
  const refsText = await readFile(refsPath, 'utf8');
  const report = await inspectComposeReleaseProvenance({ outputDirectory, refsText });
  for (const group of report.groups) {
    process.stdout.write(group.id + ' ' + group.version + ' via ' + group.ref + ' @ ' + group.commit + '\n');
    for (const dump of group.apiDumps) {
      process.stdout.write('  ' + dump.family + ': ' + dump.sizeBytes + ' bytes, ' + dump.packageCount + ' packages, Git blob ' + dump.gitBlobSha1 + '\n');
    }
  }
  process.stdout.write('Release API provenance report written to ' + resolve(outputDirectory) + '\n');
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write('Compose release provenance inspection failed: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
