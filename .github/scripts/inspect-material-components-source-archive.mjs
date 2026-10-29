import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const TRUSTED_HOSTS = new Set(['dl.google.com', 'maven.google.com', 'storage.googleapis.com']);
const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;
const MAX_CHECKSUM_BYTES = 4096;
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 30_000;
const REDIRECTS = new Set([301, 302, 303, 307, 308]);

function trustedUrl(value, label) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label} must be a valid URL.`); }
  if (url.protocol !== 'https:' || !TRUSTED_HOSTS.has(url.hostname) || url.username || url.password) {
    throw new Error(`${label} must use HTTPS on a trusted Google Maven host.`);
  }
  return url;
}

async function fetchBytes(value, label, fetchImpl, maxBytes, allowMissing = false) {
  let url = trustedUrl(value, label);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetchImpl(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: 'application/octet-stream, text/plain;q=0.9' },
    });
    if (REDIRECTS.has(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error(`${label} redirected without a Location header.`);
      if (redirects === MAX_REDIRECTS) throw new Error(`${label} exceeded the redirect limit.`);
      url = trustedUrl(new URL(location, url).toString(), `${label} redirect URL`);
      continue;
    }
    if (allowMissing && (response.status === 404 || response.status === 410)) {
      await response.body?.cancel();
      return null;
    }
    if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}.`);
    const length = Number(response.headers.get('content-length'));
    if (Number.isFinite(length) && length > maxBytes) throw new Error(`${label} exceeds the size limit.`);
    if (!response.body) throw new Error(`${label} has no response body.`);
    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel();
          throw new Error(`${label} exceeds the size limit.`);
        }
        chunks.push(Buffer.from(value));
      }
    } finally { reader.releaseLock(); }
    return Buffer.concat(chunks, total);
  }
  throw new Error(`${label} exceeded the redirect limit.`);
}

function parseChecksum(bytes, algorithm, label) {
  const text = bytes.toString('utf8').trim();
  const pattern = algorithm === 'sha256' ? /^[a-f0-9]{64}(?:\\s+.*)?$/i : /^[a-f0-9]{40}(?:\\s+.*)?$/i;
  if (!pattern.test(text)) throw new Error(`${label} does not contain one valid ${algorithm.toUpperCase()} checksum.`);
  return text.match(/^[a-f0-9]+/i)[0].toLowerCase();
}

export function calculateMavenArchiveHashes(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return {
    sha256: createHash('sha256').update(buffer).digest('hex'),
    gitBlobSha1: createHash('sha1').update(Buffer.from(`blob ${buffer.length}\\0`)).update(buffer).digest('hex'),
    sizeBytes: buffer.length,
  };
}

export async function inspectMavenSourceArchive(manifest, fetchImpl = globalThis.fetch) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('Manifest must be an object.');
  if (manifest.artifact !== 'com.google.android.material:material' || manifest.referenceVersion !== '1.14.0') {
    throw new Error('This verifier is scoped to com.google.android.material:material:1.14.0.');
  }
  const archiveUrl = trustedUrl(manifest.sourceArchive?.url, 'Source archive URL').toString();
  const archiveBytes = await fetchBytes(archiveUrl, 'Source archive', fetchImpl, MAX_ARCHIVE_BYTES);
  const [sha256Bytes, sha1Bytes] = await Promise.all([
    fetchBytes(`${archiveUrl}.sha256`, 'Published SHA-256 checksum', fetchImpl, MAX_CHECKSUM_BYTES, true),
    fetchBytes(`${archiveUrl}.sha1`, 'Published SHA-1 checksum', fetchImpl, MAX_CHECKSUM_BYTES, true),
  ]);
  const calculated = calculateMavenArchiveHashes(archiveBytes);
  const checksums = [];
  if (sha256Bytes) {
    const expected = parseChecksum(sha256Bytes, 'sha256', 'Published SHA-256 checksum');
    checksums.push({ algorithm: 'sha256', expected, actual: calculated.sha256, matches: expected === calculated.sha256 });
  }
  if (sha1Bytes) {
    const expected = parseChecksum(sha1Bytes, 'sha1', 'Published SHA-1 checksum');
    const actual = createHash('sha1').update(archiveBytes).digest('hex');
    checksums.push({ algorithm: 'sha1', expected, actual, matches: expected === actual });
  }
  if (!checksums.length) throw new Error('Google Maven published no SHA-256 or SHA-1 sidecar for the source archive.');
  const mismatches = checksums.filter(checksum => !checksum.matches);
  if (mismatches.length) throw new Error(`Published checksum mismatch: ${mismatches.map(x => x.algorithm).join(', ')}.`);
  return {
    artifact: manifest.artifact,
    referenceVersion: manifest.referenceVersion,
    sourceArchiveUrl: archiveUrl,
    checksums,
    ...calculated,
    checksumStatus: 'verified-against-google-maven-sidecar',
  };
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) throw new Error('Usage: node .github/scripts/inspect-material-components-source-archive.mjs <manifest.json>');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  process.stdout.write(`${JSON.stringify(await inspectMavenSourceArchive(manifest), null, 2)}\\n`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(error => {
    process.stderr.write(`Maven source archive verification failed: ${error.message}\\n`);
    process.exitCode = 1;
  });
}
