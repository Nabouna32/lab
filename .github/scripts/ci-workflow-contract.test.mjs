import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflowPath = new URL("../workflows/ci.yml", import.meta.url);
const workflow = readFileSync(workflowPath, "utf8");

function sectionFor(jobName) {
  const marker = `  ${jobName}:\n`;
  const start = workflow.indexOf(marker);
  assert.notEqual(start, -1, `Missing workflow job: ${jobName}`);
  const nextTopLevelJob = /\n(?=  [a-zA-Z0-9_-]+:)/g;
  nextTopLevelJob.lastIndex = start + marker.length;
  const next = nextTopLevelJob.exec(workflow);
  return workflow.slice(start, next ? next.index : undefined);
}

test("npm audit runs on pull requests, scheduled runs, and manual dispatches", () => {
  const triggers = workflow.slice(0, workflow.indexOf("\njobs:"));
  assert.match(triggers, /^  pull_request:/m);
  assert.match(triggers, /^  workflow_dispatch:/m);
  assert.match(triggers, /^  schedule:/m);

  const audit = sectionFor("npm-audit");
  assert.match(audit, /^  npm-audit:/m);
  assert.doesNotMatch(audit, /^    if:/m);
  assert.match(audit, /run: node \.github\/scripts\/run-npm-audit\.mjs/);
  assert.match(audit, /node-version: 24\.21\.0/);
  assert.match(audit, /permissions:\n      contents: read/);
});

test("the required Node.js gate fails when the npm audit job does not pass", () => {
  const gate = sectionFor("ci");
  assert.match(gate, /needs: \[prepare, quality, build, supabase, npm-audit\]/);
  assert.match(gate, /NPM_AUDIT_RESULT: \$\{\{ needs\.npm-audit\.result \}\}/);
  assert.match(gate, /case "\$NPM_AUDIT_RESULT" in/);
  assert.match(gate, /success\) ;;/);
  assert.match(gate, /The npm audit job must succeed/);
});
