import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../workflows/ci.yml", import.meta.url), "utf8");
const template = readFileSync(new URL("../pull_request_template.md", import.meta.url), "utf8");

test("le template de PR reste informatif sans checklist ni issue obligatoire", () => {
  assert.match(template, /^## Résumé/m);
  assert.match(template, /^## Vérifications/m);
  assert.doesNotMatch(template, /Checklist avant fusion|Issues liées|Refs #|Closes #/);
  assert.equal((template.match(/^\s*[-*]\s+\[[ xX]\]/gm) ?? []).length, 0);
});

test("aucun contrôle de checklist, de référence d'issue ou d'unicité ne bloque une PR", () => {
  assert.doesNotMatch(
    workflow,
    /check-pr-governance|PR_BODY|PR_AUTHOR_LOGIN|Contrôle de gouvernance des PR|priorityPullRequest/,
  );
  assert.match(workflow, /name: Vérification finale des contrôles applicables/);
  assert.match(workflow, /Confirm all applicable checks passed/);
});

test("une édition de titre ou de corps ne lance aucun job, un changement de base conserve la CI", () => {
  assert.equal(
    workflow.split("github.event.changes.base.ref != null").length - 1,
    6,
    "all six CI jobs must skip metadata-only edits but run when the base ref changes",
  );
  assert.match(workflow, /- edited/);
});
