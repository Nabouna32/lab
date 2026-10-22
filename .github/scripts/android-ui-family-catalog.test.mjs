import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFamilyCatalog } from './android-ui-family-catalog.mjs';

const catalog = JSON.parse(readFileSync(new URL('../../docs/material3/catalog/families.json', import.meta.url), 'utf8'));

test('candidate family catalog is structurally valid without claiming global completeness', () => {
  assert.deepEqual(validateFamilyCatalog(catalog), []);
  assert.equal(catalog.status, 'candidate-scope-not-exhaustive');
  assert.ok(catalog.families.some((family) => family.platform === 'android-mobile'));
  assert.ok(catalog.families.some((family) => family.platform === 'android-views-legacy'));
  assert.ok(catalog.families.some((family) => family.platform === 'wear-os'));
});

test('rejects duplicate identifiers and artifacts', () => {
  const duplicateId = structuredClone(catalog);
  duplicateId.families[1].id = duplicateId.families[0].id;
  assert.ok(validateFamilyCatalog(duplicateId).some((error) => error.includes('Duplicate family id')));

  const duplicateArtifact = structuredClone(catalog);
  duplicateArtifact.families[1].artifact = duplicateArtifact.families[0].artifact;
  assert.ok(validateFamilyCatalog(duplicateArtifact).some((error) => error.includes('Duplicate artifact coordinate')));
});

test('requires explicit unresolved reference versions and HTTPS provenance', () => {
  const invalid = structuredClone(catalog);
  invalid.families[1].referenceVersion = null;
  invalid.families[1].referenceVersionStatus = 'probably-latest';
  invalid.families[1].officialApiReference = 'http://example.com/api';
  const errors = validateFamilyCatalog(invalid);
  assert.ok(errors.some((error) => error.includes('not-selected')));
  assert.ok(errors.some((error) => error.includes('must use HTTPS')));
});

test('does not allow a family registry to imply exhaustive global coverage', () => {
  const invalid = structuredClone(catalog);
  invalid.status = 'complete';
  assert.ok(validateFamilyCatalog(invalid).some((error) => error.includes('avoid claiming exhaustive global coverage')));
});
