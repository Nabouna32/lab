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

  const normalizedContents = contents.replace(/\r\n/g, '\n');
  const formatMatch = normalizedContents.match(/^(?:\uFEFF)?\/\/ Signature format: (\d+\.\d+)(?:\n|$)/);
  const formatVersion = formatMatch?.[1];
  if (!formatVersion || !['2.0', '3.0', '4.0'].includes(formatVersion)) {
    throw new Error('Unsupported or missing AndroidX API signature format; expected 2.0, 3.0, or 4.0.');
  }

  const lines = normalizedContents.split('\n');
  const declarations = [];
  let currentPackage = null;
  let braceDepth = 0;
  const classScopes = [];

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

    const isMemberFormat = formatVersion !== '2.0' &&
      /^(?:method|property|field|ctor|enum_constant)\s+/.test(raw);
    const publicSignature = raw.match(/(?:^|\s)(public\s+(?:(?:abstract|final|open|sealed|static|data|inline|infix|operator|suspend|external|expect|actual)\s+)*(?:value class|enum class|annotation class|class|interface|object|fun|val|var|typealias|constructor|field|property)\b.*)$/)?.[1] ?? null;

    if (currentPackage === null) {
      if (publicSignature || isMemberFormat) {
        throw new Error('Public declaration outside a package block at line ' + (index + 1) + '.');
      }
      continue;
    }

    const nextBraceDepth = braceDepth
      + (raw.match(/{/g) ?? []).length
      - (raw.match(/}/g) ?? []).length;
    let kind = null;
    let symbol = null;

    if (isMemberFormat) {
      const memberMatch = raw.match(/^(method|property|field|ctor|enum_constant)\b/);
      const memberType = memberMatch?.[1];
      kind = memberType === 'ctor' ? 'constructor'
        : memberType === 'enum_constant' ? 'enum-constant'
        : memberType ?? 'unknown';

      if (memberType === 'method') {
        symbol = raw.match(/\s([A-Za-z_$][\w$.-]*)\s*\(/)?.[1] ?? null;
      } else if (memberType === 'ctor') {
        symbol = raw.match(/\bctor\s+(?:(?:public|protected|private|static|final)\s+)*([A-Za-z_$][\w$]*)\s*\(/)?.[1] ?? null;
      } else {
        symbol = raw.match(/([A-Za-z_$][\w$]*)\s*;$/)?.[1] ?? null;
      }
    } else if (publicSignature) {
      const kindMatch = publicSignature.match(/^public\s+(?:(?:abstract|final|open|sealed|static|data|inline|infix|operator|suspend|external|expect|actual)\s+)*(value class|enum class|annotation class|class|interface|object|fun|val|var|typealias|constructor|field|property)\b/);
      const symbolMatch = publicSignature.match(/^public\s+(?:(?:abstract|final|open|sealed|static|data|inline|infix|operator|suspend|external|expect|actual)\s+)*(?:value class|enum class|annotation class|class|interface|object|fun|val|var|typealias|constructor|field|property)\s+([A-Za-z_$][\w$]*)\b/);
      kind = kindMatch?.[1] ?? 'unknown';
      symbol = symbolMatch?.[1] ?? null;
    }

    const owner = classScopes.map((scope) => scope.symbol).join('.') || null;

    if (kind !== null) {
      const signatureHash = createHash('sha256')
        .update(currentPackage + '\0' + (owner ?? '') + '\0' + raw, 'utf8')
        .digest('hex');
      declarations.push({
        id: currentPackage + ':' + (owner ? owner + ':' : '') + signatureHash,
        package: currentPackage,
        owner,
        kind,
        symbol,
        signature: raw,
        line: index + 1,
        classification: raw.includes('@BytecodeOnly') ? 'bytecode-only'
          : raw.includes('@InaccessibleFromKotlin') ? 'inaccessible-from-kotlin'
          : 'source-api-candidate',
        apiStatus: 'unknown',
      });

      if (
        symbol &&
        ['value class', 'enum class', 'annotation class', 'class', 'interface', 'object'].includes(kind) &&
        raw.includes('{') &&
        nextBraceDepth > braceDepth
      ) {
        classScopes.push({ symbol, depth: nextBraceDepth });
      }
    }

    braceDepth = nextBraceDepth;
    while (classScopes.length > 0 && classScopes[classScopes.length - 1].depth > braceDepth) {
      classScopes.pop();
    }
    if (braceDepth <= 0) {
      currentPackage = null;
      braceDepth = 0;
      classScopes.length = 0;
    }
  }

  if (currentPackage !== null) {
    throw new Error('Unclosed package block for ' + currentPackage + '.');
  }

  if (declarations.length === 0) {
    throw new Error('No public declarations found; input may not be an AndroidX API dump.');
  }

  const dumpSha256 = createHash('sha256').update(contents, 'utf8').digest('hex');
  const bytecodeOnlyCount = declarations.filter((entry) => entry.classification === 'bytecode-only').length;
  const inaccessibleFromKotlinCount = declarations.filter((entry) => entry.classification === 'inaccessible-from-kotlin').length;
  return {
    schemaVersion: 1,
    artifact,
    version,
    source: { commit: commit.toLowerCase(), path: sourcePath, sha256: dumpSha256, formatVersion },
    inventoryKind: 'public-signature-surface',
    semanticCompleteness: 'not-established-by-api-dump-alone',
    declarationCount: declarations.length,
    sourceApiCandidateCount: declarations.length - bytecodeOnlyCount - inaccessibleFromKotlinCount,
    bytecodeOnlyCount,
    inaccessibleFromKotlinCount,
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
