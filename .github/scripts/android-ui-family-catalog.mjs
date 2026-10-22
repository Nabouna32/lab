import { readFileSync } from 'node:fs';

const ALLOWED_PORT_PRIORITIES = new Set(['P0', 'P1', 'P2', 'P3', 'migration-reference-only']);
const ALLOWED_SUCCESSOR_STATUSES = new Set([
  'not-assessed',
  'candidate-non-equivalent-successor',
  'candidate-migration-target-not-one-to-one',
  'no-single-successor',
  'no-successor',
  'verified-mapping',
]);
const ALLOWED_PLATFORMS = new Set([
  'android-mobile',
  'android-adaptive',
  'wear-os',
  'android-tv',
  'android-views-legacy',
]);

export function validateFamilyCatalog(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    return ['Catalog must be a JSON object.'];
  }
  if (catalog.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (catalog.status !== 'candidate-scope-not-exhaustive') {
    errors.push('Catalog status must explicitly avoid claiming exhaustive global coverage.');
  }
  if (!Array.isArray(catalog.families) || catalog.families.length === 0) {
    errors.push('families must be a non-empty array.');
    return errors;
  }

  const ids = new Set();
  const artifacts = new Set();
  for (const [index, family] of catalog.families.entries()) {
    const label = 'families[' + index + ']';
    if (!family || typeof family !== 'object' || Array.isArray(family)) {
      errors.push(label + ' must be an object.');
      continue;
    }
    for (const field of ['id', 'name', 'platform', 'role', 'artifact', 'scope', 'versionPolicy', 'inventoryStatus', 'sourceDirectory', 'notes', 'referenceVersionStatus', 'successorMappingStatus']) {
      if (typeof family[field] !== 'string' || !family[field].trim()) {
        errors.push(label + '.' + field + ' is required.');
      }
    }
    if (typeof family.id === 'string') {
      if (ids.has(family.id)) errors.push('Duplicate family id: ' + family.id);
      ids.add(family.id);
    }
    if (typeof family.artifact === 'string') {
      if (artifacts.has(family.artifact)) errors.push('Duplicate artifact coordinate: ' + family.artifact);
      artifacts.add(family.artifact);
    }
    if (!ALLOWED_PLATFORMS.has(family.platform)) {
      errors.push(label + '.platform is not a recognized family boundary.');
    }
    if (!ALLOWED_PORT_PRIORITIES.has(family.portPriority)) {
      errors.push(label + '.portPriority must be an explicit priority or migration-reference-only.');
    }
    if (!['not-started', 'watch-snapshot-only', 'in-progress', 'verified'].includes(family.inventoryStatus)) {
      errors.push(label + '.inventoryStatus is invalid.');
    }
    if (!ALLOWED_SUCCESSOR_STATUSES.has(family.successorMappingStatus)) {
      errors.push(label + '.successorMappingStatus is invalid.');
    }
    if (!Array.isArray(family.successorFamilyIds)) {
      errors.push(label + '.successorFamilyIds must be an array, including when empty.');
    } else if (family.successorFamilyIds.some((id) => typeof id !== 'string' || !id.trim())) {
      errors.push(label + '.successorFamilyIds must contain non-empty family ids.');
    }
    if (family.referenceVersion === null) {
      if (family.referenceVersionStatus !== 'not-selected') {
        errors.push(label + ' must mark an unset reference version as not-selected.');
      }
    } else if (typeof family.referenceVersion !== 'string' || !family.referenceVersion.trim()) {
      errors.push(label + '.referenceVersion must be a non-empty string or null.');
    }
    for (const field of ['sourceRepository', 'officialApiReference', 'officialReleaseNotes']) {
      try {
        const url = new URL(family[field]);
        if (url.protocol !== 'https:') errors.push(label + '.' + field + ' must use HTTPS.');
      } catch {
        errors.push(label + '.' + field + ' must be a valid HTTPS URL.');
      }
    }
  }
  for (const [index, family] of catalog.families.entries()) {
    if (!Array.isArray(family?.successorFamilyIds)) continue;
    for (const successorId of family.successorFamilyIds) {
      if (!ids.has(successorId)) errors.push('families[' + index + '] references unknown successor family: ' + successorId);
      if (successorId === family.id) errors.push('families[' + index + '] cannot be its own successor.');
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const path = process.argv[2] ?? 'docs/material3/catalog/families.json';
  const catalog = JSON.parse(readFileSync(path, 'utf8'));
  const errors = validateFamilyCatalog(catalog);
  if (errors.length) {
    process.stderr.write(errors.map((error) => '- ' + error).join('\n') + '\n');
    process.exitCode = 1;
  } else {
    process.stdout.write(`Validated ${catalog.families.length} candidate Android UI families (not a completeness claim).\n`);
  }
}
