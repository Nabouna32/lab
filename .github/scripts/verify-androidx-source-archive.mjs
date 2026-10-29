import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const ALLOWED_HOSTS = new Set([
  'android.googlesource.com',
  'dl.google.com',
  'maven.google.com',
  'storage.googleapis.com',
]);
const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function assertTrustedHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname) || url.username || url.password) {
    throw new Error(`${label} must use HTTPS on an approved AndroidX artifact host.`);
  }
  return url;
}

function parseSha256(text, label) {
  const match = text.trim().match(/^([a-f0-9]{64})(?:\s+.*)?$/i);
  if (!match) throw new Error(`${label} does not contain one valid SHA-256 checksum.`);
  return match[1].toLowerCase();
}

async function readBoundedBody(response, label, maxBytes) {
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > maxBytes) {
    throw new Error(`${label} exceeds the ${maxBytes}-byte safety limit.`);
  }
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
        throw new Error(`${label} exceeds the ${maxBytes}-byte safety limit.`);
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

async function fetchTrustedBytes(value, label, fetchImpl, maxBytes) {
  let currentUrl = assertTrustedHttpsUrl(value, label);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchImpl(currentUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: 'application/octet-stream, text/plain;q=0.9' },
    });

    if (REDIRECT_STATUSES.has(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error(`${label} returned a redirect without a Location header.`);
      if (redirectCount === MAX_REDIRECTS) {
        throw new Error(`${label} exceeded the ${MAX_REDIRECTS}-redirect limit.`);
      }
      currentUrl = assertTrustedHttpsUrl(new URL(location, currentUrl).toString(), `${label} redirect URL`);
      continue;
    }

    if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}.`);
    return readBoundedBody(response, label, maxBytes);
  }

  throw new Error(`${label} exceeded the ${MAX_REDIRECTS}-redirect limit.`);
}

export function calculateArchiveHashes(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return {
    sha256: createHash('sha256').update(buffer).digest('hex'),
    gitBlobSha1: createHash('sha1')
      .update(Buffer.from(`blob ${buffer.length}\0`))
      .update(buffer)
      .digest('hex'),
    sizeBytes: buffer.length,
  };
}

export async function verifySourceArchive(manifest, fetchImpl = globalThis.fetch) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('The baseline manifest must be a JSON object.');
  }
  const { artifact, referenceVersion, sourceArchive } = manifest;
  if (typeof artifact !== 'string' || !artifact.trim()) throw new Error('artifact is required.');
  if (typeof referenceVersion !== 'string' || !referenceVersion.trim()) {
    throw new Error('referenceVersion is required.');
  }
  if (!sourceArchive || typeof sourceArchive !== 'object') throw new Error('sourceArchive is required.');
  if (!/^[a-f0-9]{64}$/i.test(sourceArchive.publishedSha256 ?? '')) {
    throw new Error('sourceArchive.publishedSha256 must be a 64-character SHA-256 value.');
  }
  if (!/^[a-f0-9]{40}$/i.test(sourceArchive.gitilesBlobId ?? '')) {
    throw new Error('sourceArchive.gitilesBlobId must be a 40-character Git blob SHA-1.');
  }

  const [archiveBytes, checksumBytes] = await Promise.all([
    fetchTrustedBytes(sourceArchive.url, 'Source archive', fetchImpl, MAX_ARCHIVE_BYTES),
    fetchTrustedBytes(sourceArchive.checksumUrl, 'Published checksum', fetchImpl, 4096),
  ]);
  const publishedChecksum = parseSha256(checksumBytes.toString('utf8'), 'Published checksum');
  const calculated = calculateArchiveHashes(archiveBytes);
  const expectedChecksum = sourceArchive.publishedSha256.toLowerCase();
  const expectedBlobId = sourceArchive.gitilesBlobId.toLowerCase();
  const errors = [];

  if (publishedChecksum !== expectedChecksum) {
    errors.push('The checksum file and publishedSha256 field disagree.');
  }
  if (calculated.sha256 !== expectedChecksum) {
    errors.push('The downloaded archive SHA-256 does not match the published checksum.');
  }
  if (calculated.gitBlobSha1 !== expectedBlobId) {
    errors.push('The downloaded archive Git blob SHA-1 does not match gitilesBlobId.');
  }
  if (errors.length) {
    const error = new Error(errors.join('\n'));
    error.verification = { artifact, referenceVersion, publishedChecksum, ...calculated, errors };
    throw error;
  }

  return {
    artifact,
    referenceVersion,
    archiveUrl: sourceArchive.url,
    checksumUrl: sourceArchive.checksumUrl,
    publishedChecksum,
    ...calculated,
    status: 'verified',
  };
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    throw new Error('Usage: node .github/scripts/verify-androidx-source-archive.mjs <baseline.json>');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const result = await verifySourceArchive(manifest);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    process.stderr.write(`Archive verification failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
