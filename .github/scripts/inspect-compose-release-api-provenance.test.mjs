import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGitilesBlobHashes,
  parseApiDumpMetadata,
  parseGitLsRemoteRefs,
  parseLibraryVersion,
  resolveGitilesRef,
  verifyReleaseProvenanceManifest,
} from './inspect-compose-release-api-provenance.mjs';

const COMMIT = 'a'.repeat(40);

test('resolves a release ref only when its immutable commit carries the expected stable version', async () => {
  const alphaCommit = 'e'.repeat(40);
  const refs = parseGitLsRemoteRefs([
    alphaCommit + ' refs/heads/androidx-compose-ui-release',
    COMMIT + ' refs/tags/androidx-compose-ui-1.12.1',
  ].join('\n'));
  const resolved = await resolveGitilesRef(
    async (url) => {
      const isAlpha = url.pathname.includes(alphaCommit);
      const version = isAlpha ? '1.13.0-alpha01' : '1.12.1';
      return new Response(Buffer.from('COMPOSE = "' + version + '"\nCOMPOSE_UI = { group = "androidx.compose.ui", atomicGroupVersion = "versions.COMPOSE" }\n').toString('base64'), { status: 200 });
    },
    refs,
    ['refs/heads/androidx-compose-ui-release', 'refs/tags/androidx-compose-ui-1.12.1'],
    'compose-ui',
    'COMPOSE_UI',
    '1.12.1',
  );
  assert.deepEqual(resolved, {
    ref: 'refs/tags/androidx-compose-ui-1.12.1',
    commit: COMMIT,
    version: '1.12.1',
    libraryVersionsText: 'COMPOSE = "1.12.1"\nCOMPOSE_UI = { group = "androidx.compose.ui", atomicGroupVersion = "versions.COMPOSE" }\n',
  });
});

test('reports discovered Compose release refs when no expected ref exists', async () => {
  const refs = parseGitLsRemoteRefs([
    COMMIT + ' refs/heads/androidx-compose-main',
    'b'.repeat(40) + ' refs/heads/androidx-main',
  ].join('\n'));
  await assert.rejects(
    resolveGitilesRef(
      async () => new Response(''),
      refs,
      ['refs/heads/androidx-compose-ui-release'],
      'compose-ui',
      'COMPOSE_UI',
      '1.12.1',
    ),
    /No official AndroidX compose-ui ref matched version 1.12.1/,
  );
});

test('rejects malformed git ls-remote output', () => {
  assert.deepEqual(parseGitLsRemoteRefs('not a ref\n' + 'x'.repeat(40) + ' refs/heads/bad'), []);
});

test('uses the peeled commit for annotated Git release tags', () => {
  const tagCommit = 'd'.repeat(40);
  const refs = parseGitLsRemoteRefs([
    'c'.repeat(40) + ' refs/tags/androidx-compose-ui-1.12.1',
    tagCommit + ' refs/tags/androidx-compose-ui-1.12.1^{}',
  ].join('\n'));
  assert.deepEqual(refs, [{
    ref: 'refs/tags/androidx-compose-ui-1.12.1',
    commit: tagCommit,
  }]);
});

test('reads the exact library version marker from libraryversions.toml', () => {
  assert.equal(parseLibraryVersion('COMPOSE_UI = "1.12.1"\n', 'COMPOSE_UI'), '1.12.1');
  assert.equal(parseLibraryVersion('COMPOSE_UI = "1.13.0-alpha01"\n', 'COMPOSE_UI'), '1.13.0-alpha01');
  assert.throws(() => parseLibraryVersion('COMPOSE_FOUNDATION = "1.12.1"\n', 'COMPOSE_UI'), /does not define/);
});

test('resolves Compose family versions through atomicGroupVersion aliases', () => {
  const versions = [
    'COMPOSE = "1.12.1"',
    'COMPOSE_UI = { group = "androidx.compose.ui", atomicGroupVersion = "versions.COMPOSE" }',
    'COMPOSE_FOUNDATION = { group = "androidx.compose.foundation", atomicGroupVersion = "versions.COMPOSE" }',
  ].join('\n');
  assert.equal(parseLibraryVersion(versions, 'COMPOSE_UI'), '1.12.1');
  assert.equal(parseLibraryVersion(versions, 'COMPOSE_FOUNDATION'), '1.12.1');
});

test('accepts public API 5.0 dumps with annotated package declarations', () => {
  const dump = [
    '// Signature format: 5.0',
    '// - surface=public',
    'package @SuppressCompatibility androidx.compose.ui.experimental {',
    '}',
    '',
  ].join('\n');
  assert.deepEqual(parseApiDumpMetadata(dump, 'compose-ui'), {
    formatVersion: '5.0',
    surface: 'public',
    packageCount: 1,
  });
});

test('accepts public AndroidX API format 4.0 dumps without surface metadata', () => {
  const dump = [
    '// Signature format: 4.0',
    'package androidx.compose.ui {',
    '}',
    '',
  ].join('\n');
  assert.deepEqual(parseApiDumpMetadata(dump, 'compose-ui'), {
    formatVersion: '4.0',
    surface: 'public-by-current.txt-path',
    packageCount: 1,
  });
});

test('rejects restricted surfaces and format 5.0 dumps without an explicit public surface', () => {
  const restricted = [
    '// Signature format: 5.0',
    '// - surface=restricted',
    'package androidx.compose.ui {',
    '}',
  ].join('\n');
  const missingSurface = [
    '// Signature format: 5.0',
    'package androidx.compose.ui {',
    '}',
  ].join('\n');
  assert.throws(() => parseApiDumpMetadata(restricted, 'compose-ui'), /public surface/);
  assert.throws(() => parseApiDumpMetadata(missingSurface, 'compose-ui'), /explicitly declare surface=public/);
});

test('verifies all four immutable API dumps against the committed release manifest', () => {
  const dumpFamilies = [
    ['compose-ui', 'COMPOSE_UI', 'compose/ui/ui/api/current.txt', 28],
    ['compose-ui-text', 'COMPOSE_UI', 'compose/ui/ui-text/api/current.txt', 7],
    ['compose-foundation', 'COMPOSE_FOUNDATION', 'compose/foundation/foundation/api/current.txt', 24],
    ['compose-foundation-layout', 'COMPOSE_FOUNDATION', 'compose/foundation/foundation-layout/api/current.txt', 1],
  ];
  const groups = [
    {
      id: 'compose-ui',
      commit: COMMIT,
      ref: 'refs/heads/androidx-compose-release',
      version: '1.12.1',
      versionMarker: 'COMPOSE_UI',
      libraryVersions: { sha256: '1'.repeat(64), gitBlobSha1: '2'.repeat(40), sizeBytes: 100 },
      apiDumps: [],
    },
    {
      id: 'compose-foundation',
      commit: COMMIT,
      ref: 'refs/heads/androidx-compose-release',
      version: '1.12.1',
      versionMarker: 'COMPOSE_FOUNDATION',
      libraryVersions: { sha256: '1'.repeat(64), gitBlobSha1: '2'.repeat(40), sizeBytes: 100 },
      apiDumps: [],
    },
  ];
  const metadata = {
    'compose-ui': dumpFamilies.slice(0, 2),
    'compose-foundation': dumpFamilies.slice(2),
  };
  for (const group of groups) {
    group.apiDumps = metadata[group.id].map(([family, versionMarker, path, packageCount], index) => ({
      family,
      path,
      formatVersion: '4.0',
      surface: 'public-by-current.txt-path',
      packageCount,
      sizeBytes: 1000 + index,
      sha256: String(index + 1).repeat(64),
      gitBlobSha1: String(index + 1).repeat(40),
      versionedDump: null,
    }));
  }
  const report = { referenceVersion: '1.12.1', groups };
  const manifest = {
    schemaVersion: 1,
    status: 'verified-release-ref-and-api-dump-provenance',
    sourceArchiveAlignment: 'unverified',
    referenceVersion: '1.12.1',
    releaseCommit: COMMIT,
    releaseRef: 'refs/heads/androidx-compose-release',
    versionMarkers: {
      COMPOSE: '1.12.1',
      COMPOSE_UI: 'versions.COMPOSE',
      COMPOSE_FOUNDATION: 'versions.COMPOSE',
    },
    libraryVersions: { sha256: '1'.repeat(64), gitBlobSha1: '2'.repeat(40), sizeBytes: 100 },
    families: groups.flatMap((group) => group.apiDumps.map((dump) => ({
      id: dump.family,
      version: '1.12.1',
      versionMarker: group.versionMarker,
      apiPath: dump.path,
      formatVersion: dump.formatVersion,
      surface: dump.surface,
      packageCount: dump.packageCount,
      sizeBytes: dump.sizeBytes,
      sha256: dump.sha256,
      gitBlobSha1: dump.gitBlobSha1,
      versionedDump: null,
    }))),
  };
  assert.equal(verifyReleaseProvenanceManifest(report, manifest), true);
  const changed = structuredClone(manifest);
  changed.families[0].sha256 = '0'.repeat(64);
  assert.throws(() => verifyReleaseProvenanceManifest(report, changed), /drifted for sha256/);
});

test('calculates Git blob SHA-1 and SHA-256 for decoded Gitiles content', () => {
  const hashes = calculateGitilesBlobHashes(Buffer.from('hello\n'));
  assert.match(hashes.gitBlobSha1, /^[a-f0-9]{40}$/);
  assert.match(hashes.sha256, /^[a-f0-9]{64}$/);
  assert.equal(hashes.sizeBytes, 6);
});
