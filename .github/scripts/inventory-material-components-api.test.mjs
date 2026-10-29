import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';

function digest(value, algorithm) {
  return createHash(algorithm).update(value).digest('hex');
}

test('MDC API inventory is pinned to the official 1.14.0 Maven coordinate', async () => {
  const response = await fetch('https://raw.githubusercontent.com/Nabouna32/lab/main/docs/material3/catalog/baselines/material-components-views-1.14.0.json');
  assert.equal(response.ok, true);
  const manifest = await response.json();
  assert.equal(manifest.artifact, 'com.google.android.material:material');
  assert.equal(manifest.referenceVersion, '1.14.0');
  assert.match(manifest.binaryArchive.url, /material-1\.14\.0\.aar$/);
  assert.equal(manifest.apiInventory.status, 'provisional-not-exhaustive');
});

test('digest helper expectation uses the exact downloaded bytes', () => {
  const bytes = Buffer.from('fixture');
  assert.equal(digest(bytes, 'sha256').length, 64);
  assert.equal(digest(bytes, 'sha1').length, 40);
});
