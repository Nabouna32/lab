import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGitilesBlobHashes,
  parseApiDumpMetadata,
  parseGitLsRemoteRefs,
  parseLibraryVersion,
  resolveGitilesRef,
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
      return new Response(Buffer.from('COMPOSE_UI = "' + version + '"\n').toString('base64'), { status: 200 });
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
    libraryVersionsText: 'COMPOSE_UI = "1.12.1"\n',
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

test('calculates Git blob SHA-1 and SHA-256 for decoded Gitiles content', () => {
  const hashes = calculateGitilesBlobHashes(Buffer.from('hello\n'));
  assert.match(hashes.gitBlobSha1, /^[a-f0-9]{40}$/);
  assert.match(hashes.sha256, /^[a-f0-9]{64}$/);
  assert.equal(hashes.sizeBytes, 6);
});
