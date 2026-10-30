import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildInventoryShards } from './material3-api-inventory-shard.mjs';

const COMMIT = '0123456789abcdef0123456789abcdef01234567';
const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');

function fixture() {
  const declarations = [
    { id: 'id-a', package: 'androidx.compose.material3', owner: null, kind: 'class', symbol: 'A', signature: 'public final class A {', line: 4, classification: 'source-api-candidate', apiStatus: 'unknown' },
    { id: 'id-b', package: 'androidx.compose.material3', owner: 'A', kind: 'method', symbol: 'getValue', signature: 'method @BytecodeOnly public int getValue();', line: 5, classification: 'bytecode-only', apiStatus: 'unknown' },
    { id: 'id-c', package: 'androidx.compose.material3.carousel', owner: null, kind: 'method', symbol: 'getHidden', signature: 'method @InaccessibleFromKotlin public int getHidden();', line: 9, classification: 'inaccessible-from-kotlin', apiStatus: 'unknown' },
    { id: 'id-d', package: 'androidx.compose.material3', owner: null, kind: 'class', symbol: 'ExampleKt', signature: 'public final class ExampleKt {', line: 12, classification: 'generated-jvm-facade', apiStatus: 'unknown' },
  ];
  return {
    schemaVersion: 1, artifact: 'androidx.compose.material3:material3', version: 'androidx-main@' + COMMIT,
    source: { commit: COMMIT, path: 'compose/material3/material3/api/current.txt', sha256: sha256('pinned API dump'), formatVersion: '5.0', surface: 'public' },
    inventoryKind: 'public-signature-surface', semanticCompleteness: 'not-established-by-api-dump-alone',
    declarationCount: 4, sourceApiCandidateCount: 1, bytecodeOnlyCount: 1, inaccessibleFromKotlinCount: 1,
    generatedFacadeCount: 1, kotlinOnlyCount: 0, experimentalCount: 0, deprecatedCount: 0, declarations,
  };
}

test('builds deterministic sharded manifests with verified declaration counts and hashes', () => {
  const input = fixture();
  const first = buildInventoryShards(input, { shardSize: 2 });
  const second = buildInventoryShards(input, { shardSize: 2 });
  assert.deepEqual(first, second);
  assert.equal(first.manifest.declarationCount, 4);
  assert.equal(first.manifest.generatedFacadeCount, 1);
  assert.equal(first.manifest.shards.length, 2);
  assert.deepEqual(first.manifest.packageCounts, { 'androidx.compose.material3': 3, 'androidx.compose.material3.carousel': 1 });
  assert.equal(first.manifest.source.url, `https://github.com/androidx/androidx/blob/${COMMIT}/compose/material3/material3/api/current.txt`);
  const firstShard = first.files.find((file) => file.path === 'declarations-001.json');
  assert.equal(JSON.parse(firstShard.content).length, 2);
  assert.equal(first.manifest.sourceApiCandidateCount, 1);
  assert.equal(first.manifest.shards[0].sha256, sha256(firstShard.content));
  assert.equal(first.manifest.shards[1].declarationCount, 2);
});

test('rejects inventory count drift and duplicate declaration identities', () => {
  const input = fixture();
  assert.throws(() => buildInventoryShards({ ...input, declarationCount: 5 }), /declarationCount/);
  const duplicate = fixture();
  duplicate.declarations[1].id = duplicate.declarations[0].id;
  assert.throws(() => buildInventoryShards(duplicate), /Duplicate declaration id/);
});

test('rejects non-public API surfaces and malformed source provenance', () => {
  const restricted = fixture();
  restricted.source.surface = 'restricted-non-atomic-group';
  assert.throws(() => buildInventoryShards(restricted), /surface=public|Only public API surfaces/);
  const missingHash = fixture();
  missingHash.source.sha256 = 'not-a-hash';
  assert.throws(() => buildInventoryShards(missingHash), /SHA-256/);
});
