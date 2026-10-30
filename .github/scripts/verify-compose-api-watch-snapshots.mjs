import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DEFAULT_MANIFEST = 'docs/material3/catalog/watch/androidx-compose-p0-2026-10-29/manifest.json';

function countLines(lines, pattern) {
  return lines.filter((line) => pattern.test(line)).length;
}

export function validateComposeApiWatchManifest(manifest) {
  const errors = [];
  if (manifest?.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (manifest?.status !== 'watch-only-not-release-baseline') errors.push('status must remain watch-only-not-release-baseline.');
  if (manifest?.releaseVersion !== '1.12.1') errors.push('releaseVersion must be 1.12.1.');
  if (manifest?.releaseBaseline !== false) errors.push('releaseBaseline must remain false.');
  if (manifest?.releaseCommitIdentified !== false) errors.push('releaseCommitIdentified must remain false until proven.');
  if (manifest?.sourceArchiveCompared !== false) errors.push('sourceArchiveCompared must remain false until proven.');
  if (manifest?.apiFormat !== '5.0') errors.push('apiFormat must be 5.0.');
  if (manifest?.requiredSurface !== 'public') errors.push('requiredSurface must be public.');
  if (!/^[0-9a-f]{40}$/.test(manifest?.sourceCommit ?? '')) errors.push('sourceCommit must be an immutable Git commit SHA.');
  if (!Array.isArray(manifest?.entries) || manifest.entries.length !== 4) {
    errors.push('entries must contain exactly the four P0 watch snapshots.');
    return errors;
  }

  const expectedFamilies = new Set(['compose-ui', 'compose-foundation', 'compose-ui-text', 'compose-foundation-layout']);
  const actualFamilies = new Set(manifest.entries.map((entry) => entry?.family));
  if (actualFamilies.size !== 4 || [...expectedFamilies].some((family) => !actualFamilies.has(family))) {
    errors.push('entries must cover each P0 Compose family exactly once.');
  }
  for (const [index, entry] of manifest.entries.entries()) {
    if (!entry?.sourcePath || !entry?.snapshotPath) errors.push('entries[' + index + '] must identify sourcePath and snapshotPath.');
    if (!/^[0-9a-f]{40}$/.test(entry?.gitBlobSha1 ?? '')) errors.push('entries[' + index + '].gitBlobSha1 must be a Git blob SHA-1.');
    if (!Number.isInteger(entry?.characters) || entry.characters <= 0) errors.push('entries[' + index + '].characters must be a positive integer.');
    if (!entry?.lineCounts || Object.values(entry.lineCounts).some((value) => !Number.isInteger(value) || value < 0)) {
      errors.push('entries[' + index + '].lineCounts must contain non-negative integer metrics.');
    }
  }
  return errors;
}

export function verifyComposeApiWatchSnapshots({ root = process.cwd(), manifestPath = DEFAULT_MANIFEST } = {}) {
  const absoluteManifestPath = resolve(root, manifestPath);
  const manifest = JSON.parse(readFileSync(absoluteManifestPath, 'utf8'));
  const errors = validateComposeApiWatchManifest(manifest);
  if (errors.length) return errors;

  const catalogPath = resolve(root, 'docs/material3/catalog/families.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const families = new Map(catalog.families.map((family) => [family.id, family]));

  for (const entry of manifest.entries) {
    const family = families.get(entry.family);
    if (!family) errors.push('Missing family catalog entry: ' + entry.family + '.');
    else if (family.inventoryStatus !== 'watch-snapshot-only') {
      errors.push(entry.family + ' must remain watch-snapshot-only until release provenance is verified.');
    }

    const snapshotPath = resolve(dirname(absoluteManifestPath), entry.snapshotPath);
    let content;
    try {
      content = readFileSync(snapshotPath);
    } catch {
      errors.push('Missing watch snapshot: ' + entry.snapshotPath + '.');
      continue;
    }

    const gitBlobSha1 = createHash('sha1')
      .update('blob ' + content.length + '\0')
      .update(content)
      .digest('hex');
    if (gitBlobSha1 !== entry.gitBlobSha1) {
      errors.push(entry.family + ' Git blob SHA-1 mismatch: expected ' + entry.gitBlobSha1 + ', received ' + gitBlobSha1 + '.');
    }

    const text = content.toString('utf8');
    const lines = text.split('\n');
    if (text.length !== entry.characters) errors.push(entry.family + ' character count mismatch.');
    if (lines[0] !== '// Signature format: 5.0') errors.push(entry.family + ' must use signature format 5.0.');
    if (lines[1] !== '// - surface=public') errors.push(entry.family + ' must declare the public API surface.');

    const actualCounts = {
      packages: countLines(lines, /^package /),
      types: countLines(lines, /^\s*public (?:abstract |final |open )?(?:class|interface|enum|annotation class|object|typealias)\b/),
      methods: countLines(lines, /^\s*method /),
      constructors: countLines(lines, /^\s*ctor /),
      fields: countLines(lines, /^\s*field /),
      properties: countLines(lines, /^\s*property /),
    };
    for (const [key, actual] of Object.entries(actualCounts)) {
      if (actual !== entry.lineCounts[key]) {
        errors.push(entry.family + ' ' + key + ' count mismatch: expected ' + entry.lineCounts[key] + ', received ' + actual + '.');
      }
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const manifestPath = process.argv[2] ?? DEFAULT_MANIFEST;
  const errors = verifyComposeApiWatchSnapshots({ manifestPath });
  if (errors.length) {
    process.stderr.write(errors.map((error) => '- ' + error).join('\n') + '\n');
    process.exitCode = 1;
  } else {
    process.stdout.write('Verified four immutable Compose P0 API watch snapshots; none is treated as a stable release baseline.\n');
  }
}
