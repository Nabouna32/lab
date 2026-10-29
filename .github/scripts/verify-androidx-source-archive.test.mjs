import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateArchiveHashes, verifySourceArchive } from './verify-androidx-source-archive.mjs';

const archiveBytes = Buffer.from('archive fixture: not a real AndroidX artifact\n');
const hashes = calculateArchiveHashes(archiveBytes);
const manifest = {
  artifact: 'androidx.compose.material3:material3',
  referenceVersion: '1.4.0',
  sourceArchive: {
    url: 'https://android.googlesource.com/example/material3-sources.jar',
    checksumUrl: 'https://android.googlesource.com/example/material3-sources.jar.sha256',
    publishedSha256: hashes.sha256,
    gitilesBlobId: hashes.gitBlobSha1,
  },
};

function fixtureFetch(overrides = {}) {
  return async (url) => {
    const isChecksum = url.pathname.endsWith('.sha256');
    const body = isChecksum
      ? Buffer.from(`${overrides.checksum ?? hashes.sha256}  material3-sources.jar\n`)
      : (overrides.archive ?? archiveBytes);
    return new Response(body, { status: overrides.status ?? 200 });
  };
}

test('verifies published checksum, downloaded bytes, and Git blob identity', async () => {
  const result = await verifySourceArchive(manifest, fixtureFetch());
  assert.equal(result.status, 'verified');
  assert.equal(result.artifact, manifest.artifact);
  assert.equal(result.referenceVersion, '1.4.0');
  assert.equal(result.sha256, hashes.sha256);
  assert.equal(result.gitBlobSha1, hashes.gitBlobSha1);
  assert.equal(result.sizeBytes, archiveBytes.length);
});

test('rejects an archive whose bytes differ from the recorded SHA-256', async () => {
  await assert.rejects(
    verifySourceArchive(manifest, fixtureFetch({ archive: Buffer.from('tampered archive') })),
    /SHA-256 does not match/,
  );
});

test('rejects a checksum file that conflicts with the recorded value', async () => {
  await assert.rejects(
    verifySourceArchive(manifest, fixtureFetch({ checksum: '0'.repeat(64) })),
    /checksum file and publishedSha256 field disagree/,
  );
});

test('rejects an archive whose Git blob identity differs', async () => {
  const invalid = structuredClone(manifest);
  invalid.sourceArchive.gitilesBlobId = '0'.repeat(40);
  await assert.rejects(
    verifySourceArchive(invalid, fixtureFetch()),
    /Git blob SHA-1 does not match/,
  );
});

test('rejects untrusted hosts before making a request', async () => {
  const invalid = structuredClone(manifest);
  invalid.sourceArchive.url = 'https://example.com/artifact.jar';
  let requested = false;
  await assert.rejects(
    verifySourceArchive(invalid, async () => {
      requested = true;
      return new Response('unexpected');
    }),
    /approved AndroidX artifact host/,
  );
  assert.equal(requested, false);
});

test('rejects malformed published checksums', async () => {
  await assert.rejects(
    verifySourceArchive(manifest, async (url) => new Response(
      url.pathname.endsWith('.sha256') ? 'not-a-checksum' : archiveBytes,
      { status: 200 },
    )),
    /does not contain one valid SHA-256 checksum/,
  );
});

test('rejects failed HTTP responses', async () => {
  await assert.rejects(
    verifySourceArchive(manifest, fixtureFetch({ status: 503 })),
    /returned HTTP 503/,
  );
});
