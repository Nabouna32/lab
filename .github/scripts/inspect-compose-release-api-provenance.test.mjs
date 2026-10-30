import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGitilesBlobHashes,
  parseApiDumpMetadata,
  parseGitilesRefs,
  parseLibraryVersion,
  resolveGitilesRef,
} from './inspect-compose-release-api-provenance.mjs';

const COMMIT = 'a'.repeat(40);

test('parses the anti-XSSI prefix in the official Gitiles refs response', () => {
  const refs = parseGitilesRefs(")]}'\n" + JSON.stringify({
    'refs/heads/androidx-compose-ui-release': { value: COMMIT },
  }));
  assert.equal(resolveGitilesRef(refs, 'androidx-compose-ui-release'), COMMIT);
});

test('rejects missing release refs with actionable context', () => {
  assert.throws(
    () => resolveGitilesRef({ 'refs/heads/androidx-main': { value: COMMIT } }, 'androidx-compose-ui-release'),
    /Missing Gitiles ref refs\/heads\/androidx-compose-ui-release/,
  );
});

test('reads the exact library version marker from libraryversions.toml', () => {
  assert.equal(parseLibraryVersion('COMPOSE_UI = "1.12.1"\n', 'COMPOSE_UI'), '1.12.1');
  assert.throws(() => parseLibraryVersion('COMPOSE_UI = "1.13.0-alpha01"\n', 'COMPOSE_UI'), /does not define/);
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
