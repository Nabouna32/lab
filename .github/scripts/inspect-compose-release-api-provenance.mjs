import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
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

export function parseGitilesLog(text) {
  const json = text.replace(/^\)\]\}'(?:\r?\n)?/, '');
  const parsed = JSON.parse(json);
  const head = parsed?.log?.[0];
  const commit = head?.commit ?? head?.id;
  if (!/^[a-f0-9]{40}$/i.test(commit ?? '')) {
    throw new Error('Gitiles branch log did not return an immutable commit.');
  }
  return {
    commit: commit.toLowerCase(),
    message: typeof head.message === 'string' ? head.message : null,
    committer: head.committer ?? null,
  };
}

export function parseLibraryVersion(text, marker) {
  const escaped = marker.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp('^\\s*' + escaped + '\\s*=\\s*"([^"]+)"\\s*$', 'm'));
  if (!match) throw new Error('libraryversions.toml does not define ' + marker + '.');
  return match[1];
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

export async function inspectComposeReleaseProvenance({ outputDirectory, fetchImpl = globalThis.fetch } = {}) {
  if (!outputDirectory) throw new Error('outputDirectory is required.');
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
    const branchLogBytes = await fetchGitilesBytes(
      GITILES_BASE + '/+log/refs/heads/' + group.branch + '?format=JSON&n=1',
      group.branch + ' release branch head',
      fetchImpl,
    );
    const branchHead = parseGitilesLog(branchLogBytes.toString('utf8'));
    const commit = branchHead.commit;
    const versionsBytes = await fetchGitilesBytes(
      GITILES_BASE + '/+/' + commit + '/libraryversions.toml?format=TEXT',
      group.id + ' libraryversions.toml',
      fetchImpl,
    );
    const versionsText = Buffer.from(versionsBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
    const actualVersion = parseLibraryVersion(versionsText, group.versionMarker);
    if (actualVersion !== group.version) {
      throw new Error(group.versionMarker + ' at ' + commit + ' is ' + actualVersion + ', expected ' + group.version + '.');
    }

    const groupReport = {
      id: group.id,
      branch: group.branch,
      ref: 'refs/heads/' + group.branch,
      commit,
      commitMessage: branchHead.message,
      committer: branchHead.committer,
      versionMarker: group.versionMarker,
      version: actualVersion,
      libraryVersions: calculateGitilesBlobHashes(Buffer.from(versionsText)),
      apiDumps: [],
    };

    for (const module of group.modules) {
      const dumpBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + module.path + '?format=TEXT',
        module.family + ' stable API dump',
        fetchImpl,
      );
      const dumpText = Buffer.from(dumpBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
      const metadata = parseApiDumpMetadata(dumpText, module.family);
      const hashes = calculateGitilesBlobHashes(Buffer.from(dumpText));
      const localPath = module.family + '-api-current.txt';
      await writeFile(join(output, localPath), dumpText, 'utf8');

      const versionedBytes = await fetchGitilesBytes(
        GITILES_BASE + '/+/' + commit + '/' + module.versionedPath + '?format=TEXT',
        module.family + ' versioned stable API dump',
        fetchImpl,
        { optional: true },
      );
      let versionedDump = null;
      if (versionedBytes) {
        const versionedText = Buffer.from(versionedBytes.toString('utf8').replace(/\s+/g, ''), 'base64').toString('utf8');
        const versionedHashes = calculateGitilesBlobHashes(Buffer.from(versionedText));
        versionedDump = {
          path: module.versionedPath,
          ...versionedHashes,
          identicalToCurrent: versionedHashes.gitBlobSha1 === hashes.gitBlobSha1,
        };
      }

      groupReport.apiDumps.push({
        family: module.family,
        path: module.path,
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
  const report = await inspectComposeReleaseProvenance({ outputDirectory });
  for (const group of report.groups) {
    process.stdout.write(group.id + ' ' + group.version + ' @ ' + group.commit + '\n');
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
