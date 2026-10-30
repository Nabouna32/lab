import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAVEN_BASE = 'https://dl.google.com/dl/android/maven2';
const ALLOWED_HOSTS = new Set(['dl.google.com', 'maven.google.com', 'storage.googleapis.com']);
const MAX_ARTIFACT_BYTES = 50 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 30_000;

export const PUBLICATION_TARGETS = Object.freeze([
  {
    familyId: 'compose-ui-text',
    group: 'androidx.compose.ui',
    logicalModule: 'ui-text',
    androidModule: 'ui-text-android',
    version: '1.12.1',
  },
  {
    familyId: 'compose-foundation-layout',
    group: 'androidx.compose.foundation',
    logicalModule: 'foundation-layout',
    androidModule: 'foundation-layout-android',
    version: '1.12.1',
  },
]);

export function parseSha256(value, label = 'checksum') {
  const match = String(value).trim().match(/^([a-f0-9]{64})(?:\s+.*)?$/i);
  if (!match) throw new Error(label + ' must contain one SHA-256 digest.');
  return match[1].toLowerCase();
}

export function calculateSha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function verifySha256(bytes, sidecar, label) {
  const expected = parseSha256(sidecar, label + ' checksum');
  const actual = calculateSha256(bytes);
  if (actual !== expected) throw new Error(label + ' does not match its published SHA-256.');
  return actual;
}

export function validateModuleMetadata(bytes, expected, label) {
  let metadata;
  try {
    metadata = JSON.parse(Buffer.from(bytes).toString('utf8'));
  } catch {
    throw new Error(label + ' is not valid Gradle module metadata.');
  }
  const component = metadata.component;
  if (
    component?.group !== expected.group ||
    component?.module !== expected.module ||
    component?.version !== expected.version
  ) {
    throw new Error(label + ' declares an unexpected component identity: ' + JSON.stringify(component) + '; expected ' + JSON.stringify(expected) + '.');
  }
  if (!Array.isArray(metadata.variants)) {
    if (typeof component?.url === 'string') {
      return {
        component: { ...component },
        variants: [],
        redirectUrl: component.url,
      };
    }
    throw new Error(label + ' must declare variants or a component redirect URL.');
  }
  return {
    component: { ...component },
    redirectUrl: typeof component.url === 'string' ? component.url : null,
    variants: metadata.variants.map((variant) => ({
      name: variant.name ?? null,
      attributes: variant.attributes ?? {},
      availableAt: (variant['available-at'] ?? variant.availableAt)
        ? {
            url: (variant['available-at'] ?? variant.availableAt).url ?? null,
            group: (variant['available-at'] ?? variant.availableAt).group ?? null,
            module: (variant['available-at'] ?? variant.availableAt).module ?? null,
            version: (variant['available-at'] ?? variant.availableAt).version ?? null,
          }
        : null,
    })),
  };
}

export function validateZipSignature(bytes, label) {
  const value = Buffer.from(bytes);
  if (value.length < 4 || value[0] !== 0x50 || value[1] !== 0x4b) {
    throw new Error(label + ' is not a ZIP/JAR/AAR archive.');
  }
  return { signature: 'PK', sizeBytes: value.length };
}

function trustedUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(label + ' must be a valid URL.');
  }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname) || url.username || url.password) {
    throw new Error(label + ' must use HTTPS on an approved Google Maven host.');
  }
  return url;
}

async function readBoundedBody(response, label) {
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > MAX_ARTIFACT_BYTES) {
    throw new Error(label + ' exceeds the ' + MAX_ARTIFACT_BYTES + '-byte safety limit.');
  }
  if (!response.body) throw new Error(label + ' has no response body.');
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_ARTIFACT_BYTES) {
        await reader.cancel();
        throw new Error(label + ' exceeds the ' + MAX_ARTIFACT_BYTES + '-byte safety limit.');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

async function fetchTrustedBytes(value, label, fetchImpl) {
  let url = trustedUrl(value, label);
  for (let count = 0; count <= MAX_REDIRECTS; count += 1) {
    const response = await fetchImpl(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { accept: 'application/octet-stream, text/plain;q=0.9' },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error(label + ' returned a redirect without a Location header.');
      if (count === MAX_REDIRECTS) throw new Error(label + ' exceeded the redirect limit.');
      url = trustedUrl(new URL(location, url).toString(), label + ' redirect URL');
      continue;
    }
    if (!response.ok) throw new Error(label + ' returned HTTP ' + response.status + '.');
    return readBoundedBody(response, label);
  }
  throw new Error(label + ' exceeded the redirect limit.');
}

async function fetchVerified(url, label, fetchImpl, kind) {
  const [bytes, sidecar] = await Promise.all([
    fetchTrustedBytes(url, label, fetchImpl),
    fetchTrustedBytes(url + '.sha256', label + ' checksum', fetchImpl),
  ]);
  const sha256 = verifySha256(bytes, sidecar.toString('utf8'), label);
  const shape = kind === 'metadata'
    ? null
    : validateZipSignature(bytes, label);
  return { url, sha256, sizeBytes: bytes.length, ...(shape ?? {}) , bytes };
}

export async function auditComposeSubmodulePublications({
  outputFile,
  fetchImpl = fetch,
  targets = PUBLICATION_TARGETS,
}) {
  if (typeof outputFile !== 'string' || !outputFile.trim()) {
    throw new Error('outputFile is required.');
  }
  if (!Array.isArray(targets) || targets.length !== 2) {
    throw new Error('Exactly the two pinned Compose submodule targets are required.');
  }

  const families = [];
  for (const target of targets) {
    const basePath = target.group.replaceAll('.', '/') + '/';
    const logicalBase = MAVEN_BASE + '/' + basePath + target.logicalModule + '/' + target.version + '/';
    const androidBase = MAVEN_BASE + '/' + basePath + target.androidModule + '/' + target.version + '/';
    const logicalMetadata = await fetchVerified(
      logicalBase + target.logicalModule + '-' + target.version + '.module',
      target.logicalModule + ' Gradle metadata',
      fetchImpl,
      'metadata',
    );
    const androidMetadata = await fetchVerified(
      androidBase + target.androidModule + '-' + target.version + '.module',
      target.androidModule + ' Gradle metadata',
      fetchImpl,
      'metadata',
    );
    const sources = await fetchVerified(
      androidBase + target.androidModule + '-' + target.version + '-sources.jar',
      target.androidModule + ' sources archive',
      fetchImpl,
      'archive',
    );
    const aar = await fetchVerified(
      androidBase + target.androidModule + '-' + target.version + '.aar',
      target.androidModule + ' Android AAR',
      fetchImpl,
      'archive',
    );

    const logicalSummary = validateModuleMetadata(logicalMetadata.bytes, {
      group: target.group, module: target.logicalModule, version: target.version,
    }, target.logicalModule);
    const androidSummary = validateModuleMetadata(androidMetadata.bytes, {
      group: target.group, module: target.logicalModule, version: target.version,
    }, target.androidModule + ' redirect metadata');
    const resolvedRedirect = androidSummary.redirectUrl
      ? new URL(androidSummary.redirectUrl, androidMetadata.url).toString()
      : null;
    if (resolvedRedirect !== logicalMetadata.url) {
      throw new Error(target.androidModule + ' metadata redirect mismatch: resolved ' + resolvedRedirect + '; expected ' + logicalMetadata.url + '.');
    }
    const androidVariantLinks = logicalSummary.variants.filter(
      (variant) => variant.availableAt?.module === target.androidModule,
    );

    families.push({
      familyId: target.familyId,
      version: target.version,
      logicalComponent: logicalSummary,
      androidComponentRedirect: {
        component: androidSummary.component,
        resolvedUrl: resolvedRedirect,
      },
      logicalMetadata: { url: logicalMetadata.url, sha256: logicalMetadata.sha256, sizeBytes: logicalMetadata.sizeBytes },
      androidMetadata: { url: androidMetadata.url, sha256: androidMetadata.sha256, sizeBytes: androidMetadata.sizeBytes },
      sourcesArchive: { url: sources.url, sha256: sources.sha256, sizeBytes: sources.sizeBytes },
      androidAar: { url: aar.url, sha256: aar.sha256, sizeBytes: aar.sizeBytes },
      logicalMetadataReferencesAndroidVariant: androidVariantLinks.length > 0,
      androidVariantLinkCount: androidVariantLinks.length,
    });
  }

  const report = {
    schemaVersion: 1,
    purpose: 'Google Maven publication integrity and Gradle variant inspection; not source-commit or stable-API-dump verification.',
    source: 'Google Maven artifacts and published SHA-256 sidecars',
    families,
  };
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  return report;
}

async function main() {
  const outputFile = process.argv[2];
  if (!outputFile) {
    throw new Error('Usage: node .github/scripts/audit-compose-submodule-publications.mjs <output-json>');
  }
  const report = await auditComposeSubmodulePublications({ outputFile });
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write('Compose submodule publication audit failed: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
