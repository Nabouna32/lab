import { readFileSync } from 'node:fs';

const MAX_CHANGED_FILES = 3000;

const LIGHTWEIGHT_PATHS = [
  /^.*\.(?:md|mdx|txt)$/,
  /^LICENSE$/,
  /^LICENSE\..*$/,
  /^AGENTS\.md$/,
  /^agents\/.*$/,
  /^docs\/(?:DECISIONS|PRODUCT|PROJECT_INSTRUCTIONS)\.md$/,
  /^\.github\/workflows\/.*$/,
];

const GOVERNANCE_PATHS = [
  /^AGENTS\.md$/,
  /^agents\/.*$/,
  /^docs\/(?:DECISIONS|PRODUCT|PROJECT_INSTRUCTIONS)\.md$/,
  /^\.github\/workflows\/.*$/,
];

export function parseChangedPathsNul(contents) {
  if (typeof contents !== 'string' || contents.length === 0 || !contents.endsWith('\0')) {
    throw new Error('Changed paths must be a non-empty NUL-delimited list with a trailing NUL.');
  }

  const paths = contents.slice(0, -1).split('\0');
  if (paths.some((path) => path.length === 0)) {
    throw new Error('Changed paths contain an empty path.');
  }

  return paths;
}

export function classifyCiChanges(paths, expectedCount) {
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    throw new Error('Expected changed-file count must be a positive integer.');
  }
  if (expectedCount > MAX_CHANGED_FILES) {
    throw new Error(`Pull request exceeds the ${MAX_CHANGED_FILES}-file listing limit.`);
  }
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error('No changed paths were returned; refusing lightweight classification.');
  }
  if (paths.some((path) => typeof path !== 'string' || path.length === 0 || path.includes('\0'))) {
    throw new Error('Changed paths contain an invalid path.');
  }
  if (paths.length !== expectedCount) {
    throw new Error(`Changed path count mismatch: expected ${expectedCount}, received ${paths.length}.`);
  }

  const lightweightOnly = paths.every((path) => LIGHTWEIGHT_PATHS.some((pattern) => pattern.test(path)));
  const dependenciesChanged = paths.some((path) => path === 'package.json' || path === 'package-lock.json');
  const governanceChanged = paths.some((path) => GOVERNANCE_PATHS.some((pattern) => pattern.test(path)));

  return {
    lightweight_only: lightweightOnly,
    dependencies_changed: dependenciesChanged,
    governance_changed: governanceChanged,
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const [expectedCountArgument, pathsFile] = process.argv.slice(2);
  if (!expectedCountArgument || !pathsFile || process.argv.length !== 4) {
    throw new Error('Usage: node agents/classify-ci-changes.mjs <expected-count> <nul-delimited-paths-file>');
  }

  if (!/^\d+$/.test(expectedCountArgument)) {
    throw new Error('Expected changed-file count is missing or invalid.');
  }

  const paths = parseChangedPathsNul(readFileSync(pathsFile, 'utf8'));
  const result = classifyCiChanges(paths, Number(expectedCountArgument));
  for (const [key, value] of Object.entries(result)) {
    process.stdout.write(`${key}=${value}\n`);
  }
}
