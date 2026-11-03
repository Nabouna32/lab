test("les PR de travail exigent une issue, une checklist et la priorité chronologique", () => {
  const triggers = workflow.slice(0, workflow.indexOf("\\njobs:"));
  assert.match(triggers, /pull_request:[\\s\\S]*?types:[\\s\\S]*?- edited/);
  assert.match(triggers, /pull_request_target:[\\s\\S]*?- closed/);
  assert.match(workflow, /name: Contrôle de gouvernance des PR/);
  assert.match(workflow, /node \.github\\/scripts\\/check-pr-governance\\.mjs/);
  assert.match(workflow, /name: Réévaluation de la PR prioritaire après fermeture/);
  assert.match(workflow, /actions: write/);

  const templatePath = new URL("../pull_request_template.md", import.meta.url);
  const template = readFileSync(templatePath, "utf8");
  const governance = readFileSync(new URL("./pr-governance.mjs", import.meta.url), "utf8");
  const recheck = readFileSync(new URL("./recheck-pr-governance.mjs", import.meta.url), "utf8");
  assert.equal((template.match(/^\\- \\[ \\]/gm) ?? []).length, 5);
  assert.match(governance, /selectPriorityPullRequest/);
  assert.match(governance, /hasLinkedIssueReference/);
  assert.match(governance, /validateRequiredChecklist/);
  assert.match(recheck, /rerun-failed-jobs/);
  assert.match(recheck, /Contrôle de gouvernance des PR/);
});
