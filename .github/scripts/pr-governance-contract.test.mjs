import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../workflows/ci.yml", import.meta.url), "utf8");
const template = readFileSync(new URL("../pull_request_template.md", import.meta.url), "utf8");
const governance = readFileSync(new URL("./pr-governance.mjs", import.meta.url), "utf8");
const check = readFileSync(new URL("./check-pr-governance.mjs", import.meta.url), "utf8");

test("le gate PR conserve la règle d'unicité, le lien d'issue et la checklist sans réévaluation privilégiée", () => {
  const triggers = workflow.slice(0, workflow.indexOf("\njobs:"));
  assert.match(triggers, /pull_request:[\s\S]*?types:[\s\S]*?- edited/);
  assert.doesNotMatch(triggers, /pull_request_target/);
  assert.match(workflow, /name: Contrôle de gouvernance des PR/);
  assert.match(workflow, /node \.github\/scripts\/check-pr-governance\.mjs/);
  assert.doesNotMatch(workflow, /recheck-blocked-prs|actions: write|pull_request_target/);
  assert.equal((template.match(/^- \[ \]/gm) ?? []).length, 5);
  assert.match(governance, /selectPriorityPullRequest/);
  assert.match(governance, /hasLinkedIssueReference/);
  assert.match(governance, /validateRequiredChecklist/);
  assert.match(check, /priorityPullRequest\.number !== pullRequestNumber/);
  assert.match(check, /ne peut pas être fusionnée avant sa fermeture/);
});
