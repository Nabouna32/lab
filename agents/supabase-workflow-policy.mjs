import { appendFileSync } from 'node:fs';

const VALIDATION_PATHS = [
  'supabase/migrations/',
  'supabase/tests/',
];
const PRODUCTION_PATHS = ['supabase/migrations/'];
const DATABASE_CONFIG = 'supabase/config.toml';
const WORKFLOW_PATH = '.github/workflows/supabase-database.yml';

function isEnabled(value) {
  return value === true || value === 'true';
}

/**
 * Classify changed repository paths using the same policy as Supabase Database CI.
 * Keep this pure so edge cases can be tested without starting Docker/Supabase.
 */
export function classifySupabaseChanges(paths) {
  let validate = false;
  let production = false;

  for (const path of paths) {
    if (
      VALIDATION_PATHS.some((prefix) => path.startsWith(prefix)) ||
      path === DATABASE_CONFIG ||
      path === WORKFLOW_PATH
    ) {
      validate = true;
    }

    if (PRODUCTION_PATHS.some((prefix) => path.startsWith(prefix)) || path === DATABASE_CONFIG) {
      production = true;
    }
  }

  return { validate, production };
}

/**
 * Fail closed unless change detection succeeded and the validation job's result
 * exactly matches whether validation was required.
 */
export function evaluateValidationGate({ detectionResult, validationRequired, validationResult }) {
  if (detectionResult !== 'success') {
    return {
      passed: false,
      reason: 'Change detection did not succeed; refusing to report successful validation.',
    };
  }

  if (isEnabled(validationRequired)) {
    if (validationResult !== 'success') {
      return {
        passed: false,
        reason: `Supabase validation was required but ended with: ${validationResult}`,
      };
    }

    return { passed: true, reason: 'Supabase database validation passed.' };
  }

  if (validationRequired === false || validationRequired === 'false') {
    if (validationResult !== 'skipped') {
      return {
        passed: false,
        reason: `Validation was not required, but the validation job ended with: ${validationResult}`,
      };
    }

    return { passed: true, reason: 'No Supabase-related files changed; successful no-op validation.' };
  }

  return { passed: false, reason: 'Change detection did not produce a valid validation-required value.' };
}

/**
 * Production migration release is permitted only for a validated migration/config
 * change on a main push. PRs and manual runs must never release to production.
 */
export function shouldReleaseProduction({
  eventName,
  ref,
  productionRequired,
  validationResult,
  validationGatePassed,
}) {
  return (
    eventName === 'push' &&
    ref === 'refs/heads/main' &&
    isEnabled(productionRequired) &&
    validationResult === 'success' &&
    validationGatePassed === true
  );
}

function writeOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    throw new Error('GITHUB_OUTPUT is required when running the workflow policy CLI.');
  }
  appendFileSync(outputPath, `${name}=${value}\n`);
}

function runDetect() {
  const changedFiles = (process.env.CHANGED_FILES ?? '').split(/\r?\n/).filter(Boolean);
  const result = classifySupabaseChanges(changedFiles);
  writeOutput('validate', result.validate);
  writeOutput('production', result.production);
  console.log(`Database validation required: ${result.validate}`);
  console.log(`Production migration required: ${result.production}`);
}

function runGate() {
  const gate = evaluateValidationGate({
    detectionResult: process.env.DETECTION_RESULT,
    validationRequired: process.env.VALIDATION_REQUIRED,
    validationResult: process.env.VALIDATION_RESULT,
  });
  const productionAllowed = gate.passed && shouldReleaseProduction({
    eventName: process.env.EVENT_NAME,
    ref: process.env.WORKFLOW_REF,
    productionRequired: process.env.PRODUCTION_REQUIRED,
    validationResult: process.env.VALIDATION_RESULT,
    validationGatePassed: gate.passed,
  });

  writeOutput('production_allowed', productionAllowed);
  if (!gate.passed) {
    console.error(gate.reason);
    process.exitCode = 1;
    return;
  }

  console.log(gate.reason);
  console.log(`Production migration release allowed: ${productionAllowed}`);
}

const command = process.argv[2];
if (command === 'detect') {
  runDetect();
} else if (command === 'gate') {
  runGate();
} else if (command !== undefined) {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 2;
}
