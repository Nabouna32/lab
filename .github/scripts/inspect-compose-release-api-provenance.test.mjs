import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGitilesBlobHashes,
  parseApiDumpMetadata,
  parseGitilesLog,
  parseGitilesRefs,
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

test('parses official Gitiles refs and resolves an exact release branch', () => {
  const refs = parseGitilesRefs(")]}'\n" + JSON.stringify({
    'refs/heads/androidx-compose-ui-release': { value: COMMIT },
    'refs/heads/androidx-main': { value: 'b'.repeat(40) },
  }));
  assert.equal(refs.length, 2);
  assert.deepEqual(
    resolveGitilesRef(refs, ['refs/heads/androidx-compose-ui-release'], 'compose-ui'),
    { ref: 'refs/heads/androidx-compose-ui-release', commit: COMMIT },
  );
});

test('reports related official refs when no release candidate exists', () => {
  const refs = [
    { ref: 'refs/heads/androidx-main', commit: COMMIT },
    { ref: 'refs/heads/androidx-compose-main', commit: COMMIT },
  ];
  assert.throws(
    () => resolveGitilesRef(refs, ['refs/heads/androidx-compose-ui-release'], 'compose-ui'),
    /Related published refs: none/,
  );
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
