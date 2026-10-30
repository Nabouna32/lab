import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGitilesBlobHashes,
  parseApiDumpMetadata,
  parseGitilesLog,
  parseGitLsRemoteRefs,
  parseLibraryVersion,
  resolveGitilesRef,
} from './inspect-compose-release-api-provenance.mjs';

const COMMIT = 'a'.repeat(40);

test('parses the anti-XSSI prefix and immutable head commit from a targeted Gitiles branch log', () => {
  const log = parseGitilesLog(")]}'\n" + JSON.stringify({
    log: [{ commit: COMMIT, message: 'Merge into androidx-compose-ui-release' }],
  }));
  assert.equal(log.commit, COMMIT);
  assert.equal(log.message, 'Merge into androidx-compose-ui-release');
});

test('rejects Gitiles branch logs without an immutable commit', () => {
  assert.throws(() => parseGitilesLog(")]}'\n" + JSON.stringify({ log: [] })), /did not return an immutable commit/);
});

test('parses targeted git ls-remote refs and resolves an immutable Compose release ref', () => {
  const refs = parseGitLsRemoteRefs([
    COMMIT + ' refs/heads/androidx-compose-ui-release',
    'b'.repeat(40) + ' refs/heads/androidx-main',
    'c'.repeat(40) + ' refs/tags/androidx-compose-ui-1.12.1',
  ].join('\n'));
  assert.equal(refs.length, 3);
  assert.deepEqual(
    resolveGitilesRef(refs, ['refs/heads/androidx-compose-ui-release'], 'compose-ui'),
    { ref: 'refs/heads/androidx-compose-ui-release', commit: COMMIT },
  );
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

test('reports discovered Compose release refs when no expected ref exists', () => {
  const refs = parseGitLsRemoteRefs([
    COMMIT + ' refs/heads/androidx-compose-main',
    'b'.repeat(40) + ' refs/heads/androidx-main',
  ].join('\n'));
  assert.throws(
    () => resolveGitilesRef(refs, ['refs/heads/androidx-compose-ui-release'], 'compose-ui'),
    /Related refs discovered by git ls-remote: none/,
  );
});

test('rejects malformed git ls-remote output', () => {
  assert.deepEqual(parseGitLsRemoteRefs('not a ref\n' + 'x'.repeat(40) + ' refs/heads/bad'), []);
});

test('reads the exact library version marker from libraryversions.toml', () => {
  assert.equal(parseLibraryVersion('COMPOSE_UI = "1.12.1"\n', 'COMPOSE_UI'), '1.12.1');
  assert.equal(parseLibraryVersion('COMPOSE_UI = "1.13.0-alpha01"\n', 'COMPOSE_UI'), '1.13.0-alpha01');
  assert.throws(() => parseLibraryVersion('COMPOSE_FOUNDATION = "1.12.1"\n', 'COMPOSE_UI'), /does not define/);
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
