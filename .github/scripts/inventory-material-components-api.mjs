import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

async function fetchBytes(value, label, maxBytes, allowMissing = false) {
  let url = trustedUrl(value, label);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetch(url, {
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
  const pattern = algorithm === 'sha256' ? /^[a-f0-9]{64}(?:\s+.*)?$/i : /^[a-f0-9]{40}(?:\s+.*)?$/i;
  if (!pattern.test(text)) throw new Error(`${label} does not contain one valid ${algorithm.toUpperCase()} checksum.`);
  return text.match(/^[a-f0-9]+/i)[0].toLowerCase();
}

function hashes(bytes) {
  return {
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sha1: createHash('sha1').update(bytes).digest('hex'),
  };
}

async function verifyArchive(url, label, expected, dir, filename) {
  const bytes = await fetchBytes(url, label, MAX_ARCHIVE_BYTES);
  const [sha256Sidecar, sha1Sidecar] = await Promise.all([
    fetchBytes(`${url}.sha256`, `${label} SHA-256 sidecar`, MAX_CHECKSUM_BYTES, true),
    fetchBytes(`${url}.sha1`, `${label} SHA-1 sidecar`, MAX_CHECKSUM_BYTES, true),
  ]);
  if (!sha256Sidecar && !sha1Sidecar) throw new Error(`${label} has no published checksum sidecar.`);
  const actual = hashes(bytes);
  const checksums = [];
  if (sha256Sidecar) {
    const published = parseChecksum(sha256Sidecar, 'sha256', `${label} SHA-256 sidecar`);
    if (published !== actual.sha256) throw new Error(`${label} SHA-256 differs from Google Maven sidecar.`);
    checksums.push({ algorithm: 'sha256', value: actual.sha256 });
  }
  if (sha1Sidecar) {
    const published = parseChecksum(sha1Sidecar, 'sha1', `${label} SHA-1 sidecar`);
    if (published !== actual.sha1) throw new Error(`${label} SHA-1 differs from Google Maven sidecar.`);
    checksums.push({ algorithm: 'sha1', value: actual.sha1 });
  }
  for (const algorithm of ['sha256', 'sha1']) {
    if (expected?.[algorithm] && expected[algorithm].toLowerCase() !== actual[algorithm]) {
      throw new Error(`${label} ${algorithm.toUpperCase()} differs from the pinned manifest.`);
    }
  }
  const destination = path.join(dir, filename);
  await writeFile(destination, bytes);
  return { path: destination, url, ...actual, sizeBytes: bytes.length, checksums };
}

async function main() {
  const manifestPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!manifestPath || !outputPath) {
    throw new Error('Usage: node .github/scripts/inventory-material-components-api.mjs <manifest.json> <output.json>');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.artifact !== 'com.google.android.material:material' || manifest.referenceVersion !== '1.14.0') {
    throw new Error('This inventory tool is scoped to com.google.android.material:material:1.14.0.');
  }
  const dir = await mkdtemp(path.join(tmpdir(), 'mdc-api-inventory-'));
  try {
    const [sources, aar] = await Promise.all([
      verifyArchive(manifest.sourceArchive.url, 'MDC source archive', {
        sha256: manifest.sourceArchive.publishedSha256,
        sha1: manifest.sourceArchive.publishedSha1,
      }, dir, 'material-1.14.0-sources.jar'),
      verifyArchive(manifest.binaryArchive.url, 'MDC binary AAR', {
        sha256: manifest.binaryArchive.publishedSha256,
        sha1: manifest.binaryArchive.publishedSha1,
      }, dir, 'material-1.14.0.aar'),
    ]);
    const args = [
      '.github/scripts/inventory-material-components-api.py',
      '--aar', aar.path,
      '--sources', sources.path,
      '--output', outputPath,
      '--reference-version', manifest.referenceVersion,
      '--aar-sha256', aar.sha256,
      '--sources-sha256', sources.sha256,
    ];
    const result = spawnSync('python3', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`API inventory parser exited with status ${result.status}.`);
    const report = JSON.parse(await readFile(outputPath, 'utf8'));
    report.provenance.aarSha1 = aar.sha1;
    report.provenance.aarSizeBytes = aar.sizeBytes;
    report.provenance.aarChecksums = aar.checksums;
    report.provenance.sourcesSha1 = sources.sha1;
    report.provenance.sourcesSizeBytes = sources.sizeBytes;
    report.provenance.sourcesChecksums = sources.checksums;
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    if (report.summary.javapFailures > 0) {
      throw new Error(`javap failed to inspect ${report.summary.javapFailures} class files; review the generated report before accepting the inventory.`);
    }
    console.log(JSON.stringify({
      binaryArchive: { url: aar.url, sha256: aar.sha256, sha1: aar.sha1, sizeBytes: aar.sizeBytes, checksums: aar.checksums },
      sourceArchive: { url: sources.url, sha256: sources.sha256, sha1: sources.sha1, sizeBytes: sources.sizeBytes, checksums: sources.checksums },
      summary: report.summary,
      outputPath,
    }, null, 2));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(`MDC API inventory failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
