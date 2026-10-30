import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateComposeApiWatchManifest, verifyComposeApiWatchSnapshots } from './verify-compose-api-watch-snapshots.mjs';

const manifest = JSON.parse(readFileSync(new URL('../../docs/material3/catalog/watch/androidx-compose-p0-2026-10-29/manifest.json', import.meta.url), 'utf8'));

test('all four Compose P0 watch snapshots match their immutable AndroidX Git blobs', () => {
  assert.deepEqual(verifyComposeApiWatchSnapshots(), []);
});

test('watch snapshots cannot be promoted to stable release baselines without new evidence', () => {
  const promoted = { ...manifest, releaseBaseline: true };
  assert.ok(validateComposeApiWatchManifest(promoted).some((error) => error.includes('releaseBaseline must remain false')));
});

test('watch manifest requires all four P0 families and immutable Git blob identities', () => {
  const incomplete = {
    ...manifest,
    entries: manifest.entries.slice(0, 3),
  };
  assert.ok(validateComposeApiWatchManifest(incomplete).some((error) => error.includes('exactly the four P0 watch snapshots')));

  const invalidBlob = {
    ...manifest,
    entries: manifest.entries.map((entry, index) => index === 0 ? { ...entry, gitBlobSha1: 'not-a-git-blob' } : entry),
  };
  assert.ok(validateComposeApiWatchManifest(invalidBlob).some((error) => error.includes('Git blob SHA-1')));
});
