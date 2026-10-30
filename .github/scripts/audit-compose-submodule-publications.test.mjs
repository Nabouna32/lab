import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  calculateSha256,
  parseSha256,
  validateModuleMetadata,
  validateZipSignature,
  validateAndroidVariantLinks,
  verifySha256,
} from './audit-compose-submodule-publications.mjs';

test('parses a published SHA-256 sidecar', () => {
  const digest = 'a'.repeat(64);
  assert.equal(parseSha256(digest + '  artifact.module'), digest);
  assert.throws(() => parseSha256('not-a-checksum'), /SHA-256/);
});

test('verifies bytes against the published checksum', () => {
  const bytes = Buffer.from('compose publication');
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(calculateSha256(bytes), digest);
  assert.equal(verifySha256(bytes, digest, 'fixture'), digest);
  assert.throws(() => verifySha256(bytes, 'b'.repeat(64), 'fixture'), /published SHA-256/);
});

test('validates Gradle module component identity and preserves variant metadata', () => {
  const metadata = {
    component: {
      group: 'androidx.compose.ui',
      module: 'ui-text',
      version: '1.12.1',
    },
    variants: [
      {
        name: 'androidApiElements-published',
        attributes: { 'org.jetbrains.kotlin.platform.type': 'androidJvm' },
        'available-at': {
          url: '../ui-text-android/1.12.1/ui-text-android-1.12.1.module',
          group: 'androidx.compose.ui',
          module: 'ui-text-android',
          version: '1.12.1',
        },
      },
    ],
  };
  const result = validateModuleMetadata(Buffer.from(JSON.stringify(metadata)), {
    group: 'androidx.compose.ui',
    module: 'ui-text',
    version: '1.12.1',
  }, 'fixture');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].availableAt.module, 'ui-text-android');
  assert.throws(() => validateModuleMetadata(Buffer.from(JSON.stringify(metadata)), {
    group: 'androidx.compose.ui',
    module: 'ui-text-android',
    version: '1.12.1',
  }, 'fixture'), /unexpected component identity/);
});

test('verifies every logical-to-Android variant metadata link', () => {
  const variants = [
    {
      name: 'androidApiElements-published',
      availableAt: {
        url: '../../ui-text-android/1.12.1/ui-text-android-1.12.1.module',
        group: 'androidx.compose.ui',
        module: 'ui-text-android',
        version: '1.12.1',
      },
    },
    {
      name: 'androidRuntimeElements-published',
      availableAt: {
        url: '../../ui-text-android/1.12.1/ui-text-android-1.12.1.module',
        group: 'androidx.compose.ui',
        module: 'ui-text-android',
        version: '1.12.1',
      },
    },
  ];
  const source = 'https://dl.google.com/dl/android/maven2/androidx/compose/ui/ui-text/1.12.1/ui-text-1.12.1.module';
  const target = 'https://dl.google.com/dl/android/maven2/androidx/compose/ui/ui-text-android/1.12.1/ui-text-android-1.12.1.module';
  assert.equal(validateAndroidVariantLinks(variants, {
    group: 'androidx.compose.ui', module: 'ui-text-android', version: '1.12.1',
  }, source, target), 2);
  assert.throws(() => validateAndroidVariantLinks(variants, {
    group: 'androidx.compose.ui', module: 'ui-text-android', version: '1.12.0',
  }, source, target), /unexpected component reference/);
  assert.throws(() => validateAndroidVariantLinks(variants, {
    group: 'androidx.compose.ui', module: 'ui-text-android', version: '1.12.1',
  }, source, source), /does not resolve/);
});

test('accepts an Android publication metadata redirect to its logical module', () => {
  const metadata = {
    component: {
      url: '../../ui-text/1.12.1/ui-text-1.12.1.module',
      group: 'androidx.compose.ui',
      module: 'ui-text',
      version: '1.12.1',
      attributes: { 'org.gradle.status': 'release' },
    },
    variants: [],
  };
  const result = validateModuleMetadata(Buffer.from(JSON.stringify(metadata)), {
    group: 'androidx.compose.ui',
    module: 'ui-text',
    version: '1.12.1',
  }, 'ui-text-android redirect');
  assert.equal(result.redirectUrl, metadata.component.url);
  assert.deepEqual(result.variants, []);
  assert.throws(() => validateModuleMetadata(Buffer.from(JSON.stringify(metadata)), {
    group: 'androidx.compose.ui',
    module: 'ui-text-android',
    version: '1.12.1',
  }, 'unexpected redirect'), /unexpected component identity/);
});

test('rejects malformed Gradle metadata and non-archive bytes', () => {
  assert.throws(() => validateModuleMetadata(Buffer.from('{'), {
    group: 'g', module: 'm', version: '1',
  }, 'fixture'), /valid Gradle module metadata/);
  assert.throws(() => validateZipSignature(Buffer.from('nope'), 'fixture'), /ZIP\/JAR\/AAR/);
  assert.deepEqual(validateZipSignature(Buffer.from([0x50, 0x4b, 0x03, 0x04]), 'fixture'), {
    signature: 'PK',
    sizeBytes: 4,
  });
});
