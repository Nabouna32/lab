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
package androidx.compose.material3.testing {
  public final enum class Example {
  }
  public abstract annotation class Marker
}
`;


const V4_DUMP = `// Signature format: 4.0
package androidx.compose.material3 {
  public final class ButtonDefaults {
    ctor public ButtonDefaults();
    method @androidx.compose.runtime.Composable public androidx.compose.ui.graphics.Shape getShape();
    method @BytecodeOnly @androidx.compose.runtime.Composable public androidx.compose.ui.graphics.Shape getShape(androidx.compose.runtime.Composer?, int);
    property public androidx.compose.ui.graphics.Shape shape;
    field public static final androidx.compose.material3.ButtonDefaults INSTANCE;
  }
  public final class Example {
    enum_constant public static final androidx.compose.material3.Example ONE;
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
  assert.equal(first.declarationCount, 6);
  assert.equal(first.declarations[0].package, 'androidx.compose.material3');
  assert.equal(first.declarations[0].kind, 'fun');
  assert.equal(first.declarations[0].symbol, 'Button');
  assert.match(first.declarations[0].signature, /^public final fun Button/);
  assert.equal(first.declarations[2].package, 'androidx.compose.material3.tokens');
  assert.equal(first.declarations[3].kind, 'fun');
  assert.equal(first.declarations[4].kind, 'enum class');
  assert.equal(first.declarations[4].symbol, 'Example');
  assert.equal(first.declarations[5].kind, 'annotation class');
  assert.equal(first.semanticCompleteness, 'not-established-by-api-dump-alone');
  assert.match(first.source.sha256, /^[a-f0-9]{64}$/);
  assert.equal(first.source.formatVersion, '2.0');
  assert.equal(first.sourceApiCandidateCount, 6);
  assert.equal(first.bytecodeOnlyCount, 0);
});


test('inventories AndroidX API signature format 4.0 members and records the format', () => {
  const result = inventoryApiDump(V4_DUMP, {
    artifact: 'androidx.compose.material3:material3',
    version: '1.4.0',
    commit: COMMIT,
    sourcePath: 'compose/material3/material3/api/current.txt',
  });

  assert.equal(result.source.formatVersion, '4.0');
  assert.equal(result.declarationCount, 8);
  assert.equal(result.sourceApiCandidateCount, 7);
  assert.equal(result.bytecodeOnlyCount, 1);
  assert.equal(result.declarations[0].kind, 'class');
  assert.equal(result.declarations[1].kind, 'constructor');
  assert.equal(result.declarations[1].symbol, 'ButtonDefaults');
  assert.equal(result.declarations[2].kind, 'method');
  assert.equal(result.declarations[2].symbol, 'getShape');
  assert.equal(result.declarations[3].kind, 'method');
  assert.equal(result.declarations[3].symbol, 'getShape');
  assert.equal(result.declarations[3].classification, 'bytecode-only');
  assert.equal(result.declarations[4].kind, 'property');
  assert.equal(result.declarations[4].symbol, 'shape');
  assert.equal(result.declarations[5].kind, 'field');
  assert.equal(result.declarations[5].symbol, 'INSTANCE');
  assert.equal(result.declarations[7].kind, 'enum-constant');
  assert.equal(result.declarations[7].symbol, 'ONE');
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
  assert.throws(() => inventoryApiDump('// Signature format: 2.0\npackage sample {\n}', options), /No public declarations/);
  assert.throws(() => inventoryApiDump('// Signature format: 2.0\npackage sample {\n  public final fun Example(): kotlin.Unit', options), /Unclosed package block/);
});

test('rejects declarations outside package blocks rather than losing provenance', () => {
  assert.throws(() => inventoryApiDump('// Signature format: 2.0\npublic final fun Orphan(): kotlin.Unit', {
    artifact: 'example:artifact',
    version: '1.0.0',
    commit: COMMIT,
    sourcePath: 'api/current.txt',
  }), /outside a package block/);
});
