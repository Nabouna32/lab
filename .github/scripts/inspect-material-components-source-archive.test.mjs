import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { calculateMavenArchiveHashes, inspectMavenSourceArchive } from './inspect-material-components-source-archive.mjs';

const archive = Buffer.from('official source archive fixture');
const hashes = calculateMavenArchiveHashes(archive);
const manifest = {
  artifact: 'com.google.android.material:material',
  referenceVersion: '1.14.0',
  sourceArchive: {
    url: 'https://dl.google.com/dl/android/maven2/com/google/android/material/material/1.14.0/material-1.14.0-sources.jar',
  },
};

function fetchFixture({ sha256 = hashes.sha256, sha1 = archiveSha1(), archiveBytes = archive, status = 200 } = {}) {
  return async url => {
    if (url.pathname.endsWith('.sha256')) return sha256 === null
      ? new Response('missing', { status: 404 })
      : new Response(`${sha256}  material-1.14.0-sources.jar\n`, { status });
    if (url.pathname.endsWith('.sha1')) return sha1 === null
      ? new Response('missing', { status: 404 })
      : new Response(`${sha1}  material-1.14.0-sources.jar\n`, { status });
    return new Response(archiveBytes, { status });
  };
}
function archiveSha1() {
  return createHash('sha1').update(archive).digest('hex');
}

test('verifies published SHA-256 and SHA-1 sidecars and records archive hashes', async () => {
  const result = await inspectMavenSourceArchive(manifest, fetchFixture());
  assert.equal(result.checksumStatus, 'verified-against-google-maven-sidecar');
  assert.equal(result.sha256, hashes.sha256);
  assert.equal(result.sha1, archiveSha1());
  assert.equal(result.gitBlobSha1, hashes.gitBlobSha1);
  assert.deepEqual(result.checksums.map(x => x.algorithm), ['sha256', 'sha1']);
  assert.equal(result.checksums.every(x => x.matches), true);
});

test('accepts a matching SHA-1 sidecar when Google Maven has no SHA-256 sidecar', async () => {
  const result = await inspectMavenSourceArchive(manifest, fetchFixture({ sha256: null }));
  assert.equal(result.checksums.length, 1);
  assert.equal(result.checksums[0].algorithm, 'sha1');
  assert.equal(result.checksums[0].matches, true);
});

test('rejects archive bytes that disagree with published checksums', async () => {
  await assert.rejects(
    inspectMavenSourceArchive(manifest, fetchFixture({ archiveBytes: Buffer.from('tampered') })),
    /Published checksum mismatch/,
  );
});

test('rejects a source archive when no published checksum sidecar exists', async () => {
  await assert.rejects(
    inspectMavenSourceArchive(manifest, fetchFixture({ sha256: null, sha1: null })),
    /published no SHA-256 or SHA-1 sidecar/,
  );
});

test('rejects untrusted hosts before fetching', async () => {
  const invalid = structuredClone(manifest);
  invalid.sourceArchive.url = 'https://example.com/material-1.14.0-sources.jar';
  const requested = [];
  await assert.rejects(inspectMavenSourceArchive(invalid, async url => {
    requested.push(url.hostname);
    return new Response('unexpected');
  }), /trusted Google Maven host/);
  assert.equal(requested.includes('example.com'), false);
});

test('rejects a redirect to an untrusted host before following it', async () => {
  const requested = [];
  await assert.rejects(inspectMavenSourceArchive(manifest, async url => {
    requested.push(url.hostname);
    if (url.pathname.endsWith('.sha256') || url.pathname.endsWith('.sha1')) {
      return new Response('missing', { status: 404 });
    }
    return new Response(null, { status: 302, headers: { location: 'https://example.com/archive.jar' } });
  }), /trusted Google Maven host/);
  assert.equal(requested.includes('example.com'), false);
});
