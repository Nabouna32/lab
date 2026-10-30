import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function buildInventoryShards(inventory, {
  shardSize = 500,
  catalogScope = 'phone-tablet-porting-reference',
  stableBaselineAlignment = 'UNVERIFIED',
  sourceRepository = 'androidx/androidx',
} = {}) {
  if (!inventory || typeof inventory !== 'object') throw new Error('Inventory must be a JSON object.');
  if (typeof inventory.artifact !== 'string' || !inventory.artifact.trim()) throw new Error('Inventory artifact is required.');
  if (typeof inventory.version !== 'string' || !inventory.version.trim()) throw new Error('Inventory version is required.');
  if (!Number.isInteger(shardSize) || shardSize < 1 || shardSize > 10000) throw new Error('Shard size must be an integer between 1 and 10000.');
  if (!Array.isArray(inventory.declarations) || inventory.declarations.length === 0) throw new Error('Inventory declarations must be a non-empty array.');

  const source = inventory.source;
  if (!source || typeof source.commit !== 'string' || !/^[a-f0-9]{40}$/i.test(source.commit)) throw new Error('Inventory source must include a full 40-character Git SHA.');
  if (typeof source.path !== 'string' || !source.path.trim()) throw new Error('Inventory source path is required.');
  if (typeof source.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(source.sha256)) throw new Error('Inventory source must include a SHA-256 hash.');
  if (source.formatVersion === '5.0' && source.surface !== 'public') throw new Error('AndroidX API signature format 5.0 must declare surface=public.');
  if (source.surface && source.surface !== 'public') throw new Error('Only public API surfaces can be sharded into this catalog.');
  if (inventory.declarationCount !== inventory.declarations.length) throw new Error('Inventory declarationCount does not match declarations length.');

  const ids = new Set();
  for (const declaration of inventory.declarations) {
    if (!declaration || typeof declaration.id !== 'string' || !declaration.id) throw new Error('Every declaration must have a non-empty id.');
    if (ids.has(declaration.id)) throw new Error('Duplicate declaration id: ' + declaration.id);
    ids.add(declaration.id);
  }

  const bytecodeOnlyCount = inventory.declarations.filter((entry) => entry.classification === 'bytecode-only').length;
  const inaccessibleFromKotlinCount = inventory.declarations.filter((entry) => entry.classification === 'inaccessible-from-kotlin').length;
  const generatedFacadeCount = inventory.declarations.filter((entry) => entry.classification === 'generated-jvm-facade').length;
  const kotlinOnlyCount = inventory.declarations.filter((entry) => entry.classification === 'kotlin-only').length;
  const experimentalCount = inventory.declarations.filter((entry) => entry.annotations?.some((annotation) => /Experimental/.test(annotation))).length;
  const deprecatedCount = inventory.declarations.filter((entry) => entry.annotations?.some((annotation) => /Deprecated/.test(annotation))).length;
  const sourceApiCandidateCount = inventory.declarations.length - bytecodeOnlyCount - inaccessibleFromKotlinCount - generatedFacadeCount;
  for (const [key, computed] of [
    ['bytecodeOnlyCount', bytecodeOnlyCount],
    ['inaccessibleFromKotlinCount', inaccessibleFromKotlinCount],
    ['generatedFacadeCount', generatedFacadeCount],
    ['kotlinOnlyCount', kotlinOnlyCount],
    ['experimentalCount', experimentalCount],
    ['deprecatedCount', deprecatedCount],
    ['sourceApiCandidateCount', sourceApiCandidateCount],
  ]) {
    if (inventory[key] !== computed) throw new Error('Inventory ' + key + ' does not match declarations.');
  }

  const packageNames = [...new Set(inventory.declarations.map((entry) => entry.package))].sort();
  const packageCounts = Object.fromEntries(packageNames.map((name) => [name, inventory.declarations.filter((entry) => entry.package === name).length]));
  const shards = [];
  const files = [];
  for (let offset = 0; offset < inventory.declarations.length; offset += shardSize) {
    const index = shards.length + 1;
    const declarations = inventory.declarations.slice(offset, offset + shardSize);
    const content = JSON.stringify(declarations);
    const path = 'declarations-' + String(index).padStart(3, '0') + '.json';
    shards.push({
      path,
      declarationCount: declarations.length,
      sha256: createHash('sha256').update(content, 'utf8').digest('hex'),
      firstSourceLine: declarations[0].line,
      lastSourceLine: declarations[declarations.length - 1].line,
    });
    files.push({ path, content });
  }

  const manifest = {
    schemaVersion: 1,
    artifact: inventory.artifact,
    version: inventory.version,
    inventoryKind: inventory.inventoryKind,
    catalogScope,
    stableBaselineAlignment,
    semanticCompleteness: inventory.semanticCompleteness,
    source: {
      repository: sourceRepository,
      commit: source.commit.toLowerCase(),
      path: source.path,
      url: 'https://github.com/' + sourceRepository + '/blob/' + source.commit.toLowerCase() + '/' + source.path,
      sha256: source.sha256,
      formatVersion: source.formatVersion,
      ...(source.surface ? { surface: source.surface } : {}),
    },
    generatedBy: '.github/scripts/material3-api-inventory.mjs + .github/scripts/material3-api-inventory-shard.mjs',
    declarationCount: inventory.declarations.length,
    sourceApiCandidateCount,
    bytecodeOnlyCount,
    inaccessibleFromKotlinCount,
    generatedFacadeCount,
    kotlinOnlyCount,
    experimentalCount,
    deprecatedCount,
    packageCounts,
    shardSize,
    shards,
  };
  files.unshift({ path: 'manifest.json', content: JSON.stringify(manifest, null, 2) + '\n' });
  return { manifest, files };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.length > 5) throw new Error('Usage: node .github/scripts/material3-api-inventory-shard.mjs <inventory-json> <output-dir> [shard-size] [catalog-scope] [stable-alignment]');
  const [inventoryPath, outputDir, shardSizeArg = '500', catalogScope, stableBaselineAlignment] = args;
  const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
  const result = buildInventoryShards(inventory, {
    shardSize: Number(shardSizeArg),
    ...(catalogScope ? { catalogScope } : {}),
    ...(stableBaselineAlignment ? { stableBaselineAlignment } : {}),
  });
  mkdirSync(outputDir, { recursive: true });
  for (const entry of readdirSync(outputDir)) if (/^declarations-\d{3}\.json$/.test(entry)) unlinkSync(join(outputDir, entry));
  for (const file of result.files) writeFileSync(join(outputDir, file.path), file.content, 'utf8');
  process.stdout.write(`Wrote ${result.manifest.declarationCount} declarations in ${result.manifest.shards.length} shards to ${outputDir}.\n`);
}
