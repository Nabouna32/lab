import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Normalize the public declarations present in a saved AndroidX API dump.
 * This is a surface inventory, not a Kotlin semantic parser.
 */
export function inventoryApiDump(contents, { artifact, version, commit, sourcePath }) {
  if (typeof contents !== 'string' || contents.trim().length === 0) {
    throw new Error('API dump must be a non-empty UTF-8 string.');
  }
  if (typeof artifact !== 'string' || artifact.trim().length === 0) {
    throw new Error('Artifact is required.');
  }
  if (typeof version !== 'string' || version.trim().length === 0) {
    throw new Error('Version is required.');
  }
  if (typeof commit !== 'string' || !/^[a-f0-9]{40}$/i.test(commit)) {
    throw new Error('Commit must be a full 40-character Git SHA.');
  }
  if (typeof sourcePath !== 'string' || sourcePath.trim().length === 0) {
    throw new Error('Source path is required.');
  }

  const lines = contents.replace(/\r\n/g, '\n').split('\n');
  const declarations = [];
  let currentPackage = null;
  let braceDepth = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index].trim();
    const packageMatch = raw.match(/^package\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\{$/);
    if (packageMatch) {
      if (currentPackage !== null) {
        throw new Error('Nested package block at line ' + (index + 1) + '.');
      }
      currentPackage = packageMatch[1];
      braceDepth = 1;
      continue;
    }

    if (currentPackage === null) continue;

    if (/^public\s+/.test(raw)) {
      const kindMatch = raw.match(/^public\s+(?:(?:abstract|final|open|sealed|static|data|value|enum|annotation|inline|infix|operator|suspend|external|expect|actual)\s+)*(class|interface|object|enum class|annotation class|fun|val|var|typealias|constructor|field|property)\b/);
      const signatureHash = createHash('sha256').update(raw, 'utf8').digest('hex');
      declarations.push({
        id: currentPackage + ':' + signatureHash,
        package: currentPackage,
        kind: kindMatch?.[1] ?? 'unknown',
        signature: raw,
        line: index + 1,
        apiStatus: 'unknown',
      });
    }

    braceDepth += (raw.match(/{/g) ?? []).length;
    braceDepth -= (raw.match(/}/g) ?? []).length;
    if (braceDepth <= 0) {
      currentPackage = null;
      braceDepth = 0;
    }
  }

  if (declarations.length === 0) {
    throw new Error('No public declarations found; input may not be an AndroidX API dump.');
  }

  const dumpSha256 = createHash('sha256').update(contents, 'utf8').digest('hex');
  return {
    schemaVersion: 1,
    artifact,
    version,
    source: { commit: commit.toLowerCase(), path: sourcePath, sha256: dumpSha256 },
    inventoryKind: 'public-signature-surface',
    semanticCompleteness: 'not-established-by-api-dump-alone',
    declarationCount: declarations.length,
    declarations,
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const [dumpPath, artifact, version, commit, sourcePath] = process.argv.slice(2);
  if (!dumpPath || !artifact || !version || !commit || !sourcePath || process.argv.length !== 7) {
    throw new Error('Usage: node .github/scripts/material3-api-inventory.mjs <api-dump> <artifact> <version> <commit-sha> <source-path>');
  }
  const contents = readFileSync(dumpPath, 'utf8');
  const result = inventoryApiDump(contents, { artifact, version, commit, sourcePath });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
