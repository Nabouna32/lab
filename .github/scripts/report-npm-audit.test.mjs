import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('npm audit reporter prints advisory metadata, lockfile paths, and fix availability', () => {
  const directory = mkdtempSync(join(tmpdir(), 'npm-audit-report-'));
  const auditPath = join(directory, 'audit.json');
  const lockPath = join(directory, 'package-lock.json');
  const reporterPath = fileURLToPath(new URL('./report-npm-audit.mjs', import.meta.url));

  try {
    writeFileSync(lockPath, JSON.stringify({
      name: 'loculary',
      version: '0.1.0',
      packages: {
        '': { name: 'loculary', version: '0.1.0', devDependencies: { 'eslint-config-next': '16.3.8' } },
        'node_modules/eslint-config-next': {
          name: 'eslint-config-next',
          version: '16.3.8',
          dependencies: { braces: '^3.0.0' },
        },
        'node_modules/braces': { name: 'braces', version: '3.0.3' },
      },
    }));
    writeFileSync(auditPath, JSON.stringify({
      vulnerabilities: {
        braces: {
          name: 'braces',
          severity: 'high',
          isDirect: false,
          range: '<=3.0.3',
          nodes: ['node_modules/braces'],
          via: ["micromatch", {
            source: 12345,
            name: 'braces',
            title: 'Example stack exhaustion advisory',
            url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
            severity: 'high',
            range: '<=3.0.3',
            cwe: ['CWE-400'],
            cvss: { score: 7.5 },
          }],
          effects: [],
          fixAvailable: false,
        },
      },
      metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 1, critical: 0, total: 1 } },
    }));

    const result = spawnSync(process.execPath, [reporterPath, auditPath, lockPath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /GHSA-vfj7-8cjw-p6xm/);
    assert.match(result.stdout, /braces@<=3\.0\.3/);
    assert.match(result.stdout, /loculary@0\.1\.0 → eslint-config-next@16\.3\.8 → braces@3\.0\.3/);
    assert.match(result.stdout, /Aucun correctif proposé par npm/);
    assert.match(result.stdout, /Avis indirect : vulnérabilité propagée par micromatch/);
    assert.match(result.stdout, /Paquets signalés comme vulnérables : 1/);
    assert.match(result.stdout, /ne représente pas nécessairement des avis distincts/);
    assert.match(result.stdout, /code de sortie de la commande npm audit reste la référence/);
    assert.match(result.stdout, /CWE-400/);
    assert.match(result.stdout, /Score CVSS : 7\.5/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
