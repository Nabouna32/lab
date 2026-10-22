import test from 'node:test';
import assert from 'node:assert/strict';
import { inventoryApiDump } from './material3-api-inventory.mjs';

const COMMIT = '0123456789abcdef0123456789abcdef01234567';
const DUMP = `// Signature format: 2.0
package androidx.compose.material3 {
  public final fun Button(onClick: kotlin.Function0<kotlin.Unit>, content: @[Composable] kotlin.Function2<androidx.compose.runtime.Composer, kotlin.Int, kotlin.Unit>): kotlin.Unit
  public final val LocalContentColor: androidx.compose.runtime.ProvidableCompositionLocal<androidx.compose.ui.graphics.Color>
}
package androidx.compose.material3.tokens {
  public final class ButtonTokens private constructor() {
    public final fun getContainerColor(): androidx.compose.ui.graphics.Color
  }
}
`;

test('inventories public declarations across package blocks deterministically', () => {
  const options = {
    artifact: 'androidx.compose.material3:material3',
    version: '1.4.0',
    commit: COMMIT,
    sourcePath: 'compose/material3/material3/api/current.txt',
  };
  const first = inventoryApiDump(DUMP, options);
  const second = inventoryApiDump(DUMP, options);

  assert.deepEqual(first, second);
  assert.equal(first.declarationCount, 4);
  assert.equal(first.declarations[0].package, 'androidx.compose.material3');
  assert.equal(first.declarations[0].kind, 'fun');
  assert.match(first.declarations[0].signature, /^public final fun Button/);
  assert.equal(first.declarations[2].package, 'androidx.compose.material3.tokens');
  assert.equal(first.declarations[3].kind, 'fun');
  assert.equal(first.semanticCompleteness, 'not-established-by-api-dump-alone');
  assert.match(first.source.sha256, /^[a-f0-9]{64}$/);
});

test('does not infer API maturity from a public signature', () => {
  const result = inventoryApiDump(DUMP, {
    artifact: 'androidx.compose.material3:material3',
    version: '1.4.0',
    commit: COMMIT,
    sourcePath: 'api/current.txt',
  });
  assert.ok(result.declarations.every((entry) => entry.apiStatus === 'unknown'));
});

test('rejects missing or malformed provenance instead of creating an unpinned inventory', () => {
  const base = {
    artifact: 'androidx.compose.material3:material3',
    version: '1.4.0',
    commit: COMMIT,
    sourcePath: 'api/current.txt',
  };
  for (const patch of [
    { artifact: '' },
    { version: '' },
    { commit: 'androidx-main' },
    { sourcePath: '' },
  ]) {
    assert.throws(() => inventoryApiDump(DUMP, { ...base, ...patch }));
  }
});

test('rejects empty input and input without public declarations', () => {
  const options = {
    artifact: 'androidx.compose.material3:material3',
    version: '1.4.0',
    commit: COMMIT,
    sourcePath: 'api/current.txt',
  };
  assert.throws(() => inventoryApiDump('', options), /non-empty/);
  assert.throws(() => inventoryApiDump('package sample {\n}', options), /No public declarations/);
});

test('rejects declarations outside package blocks rather than losing provenance', () => {
  assert.throws(() => inventoryApiDump('public final fun Orphan(): kotlin.Unit', {
    artifact: 'example:artifact',
    version: '1.0.0',
    commit: COMMIT,
    sourcePath: 'api/current.txt',
  }), /outside a package block/);
});
